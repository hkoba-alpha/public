import { FamAPU } from "./FamAPU";
import { FamCPU } from "./FamCPU";
import { FamPPU } from "./FamPPU";
import { openDB } from "idb";
// IndexedDB のデータベースを開く
const DB_NAME = "WebNes";
const STORE_NAME = "BatteryRAM";
async function getDB() {
    return openDB(DB_NAME, 1, {
        upgrade(db) {
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        },
    });
}
// バイナリデータを保存
export async function saveBinaryData(key, data) {
    const db = await getDB();
    await db.put(STORE_NAME, data, key);
    //console.log("データを保存しました:", key);
}
// バイナリデータを取得
export async function loadBinaryData(key) {
    const db = await getDB();
    const data = await db.get(STORE_NAME, key);
    if (data) {
        console.log("取得したデータ:", key, data);
    }
    else {
        console.log("データが見つかりません:", key);
    }
    return data ?? null;
}
export class NesFile {
    buffer;
    /**
    * 0: 1画面 lower bank
    * 1: 1画面 upper bank
    * 2: 垂直ミラー
    * 3: 水平ミラー
    * 4: ４画面
     */
    mirrorMode;
    // バッテリーバックアップON/OFF
    batteryBacked;
    trainer;
    prgBankList;
    chrBankList;
    mapper;
    md5 = '';
    constructor(buffer) {
        this.buffer = buffer;
        const header = buffer.slice(0, 16);
        const prgBankSize = 0x4000;
        const chrBankSize = 0x2000;
        if (header[6] & 0x08) {
            this.mirrorMode = 4;
        }
        else if (header[6] & 0x01) {
            // 垂直ミラー
            this.mirrorMode = 2;
        }
        else {
            // 水平ミラー
            this.mirrorMode = 3;
        }
        this.batteryBacked = !!(header[6] & 0x02);
        this.trainer = !!(header[6] & 0x04);
        this.mapper = (header[7] & 0xf0) | (header[6] >> 4);
        const prgBankCount = header[4];
        let chrBankCount = header[5];
        const trainerSize = this.trainer ? 512 : 0;
        const prgOffset = 16 + trainerSize;
        let chrOffset = prgOffset + prgBankSize * prgBankCount;
        if (chrBankCount === 0) {
            // PRGをCHRとして登録
            //chrBankCount = prgBankCount * 2;
            //chrOffset = prgOffset;
        }
        this.prgBankList = [];
        for (let i = 0; i < prgBankCount; i++) {
            this.prgBankList.push(this.buffer.subarray(prgOffset + prgBankSize * i, prgOffset + prgBankSize * (i + 1)));
        }
        this.chrBankList = [];
        for (let i = 0; i < chrBankCount; i++) {
            this.chrBankList.push(this.buffer.subarray(chrOffset + chrBankSize * i, chrOffset + chrBankSize * (i + 1)));
        }
    }
    async getId() {
        if (!this.md5) {
            const hash = crypto.subtle.digest('SHA-1', this.buffer);
            const array = new Uint8Array(await hash);
            this.md5 = Array.from(array).map((b) => b.toString(16).padStart(2, '0')).join('');
        }
        return this.md5;
    }
}
;
export class Mapper {
    nesFile;
    ram = new Uint8Array(0x800);
    nextCpuCycle = 0;
    cpu;
    ppu;
    apu;
    canvas;
    padList = [null, null, null, null];
    sound;
    padData = { reg: 0, index: [8, 8] };
    /**
     * 8KBずつのバンクが4つ
     */
    prgBankMap = [null, null, null, null];
    /**
     * PRGバンクサイズ
     * このバンクサイズで選択する
     */
    prgBankSize = 0x4000;
    /**
     * CHRバンクサイズ
     * このバンクサイズで選択する
     */
    chrBankSize = 0x2000;
    /**
     * バッテリーバックアップ
     * $6000-$7FFF
     */
    batteryRam;
    /**
     * バッテリーバックアップを保存するまでの待ちカウント
     */
    batteryCount = 0;
    soundCount = 0;
    constructor(nesFile) {
        this.nesFile = nesFile;
    }
    /**
     * エントリ
     */
    static mapperEntryMap = {};
    /**
     *
     * @param type Mapper種別
     * @returns
     */
    static entry(type) {
        const entryFunc = (type, proc) => {
            this.mapperEntryMap[type] = proc;
        };
        return function (target, propertyKey, descriptor) {
            const originalMethod = descriptor.value;
            entryFunc(type, nes => originalMethod(nes));
            descriptor.value = function (...args) {
                return originalMethod.apply(this, args);
            };
        };
    }
    static getMapper(nes) {
        const ope = this.mapperEntryMap[nes.mapper];
        if (ope) {
            return ope(nes);
        }
        throw "Unkown Mapper: " + nes.mapper;
    }
    debugText = [];
    debugStart = false;
    stackBuf = [];
    async init(canvas, sound) {
        this.canvas = canvas;
        this.sound = sound;
        this.cpu = await FamCPU.getCPU();
        this.ppu = await FamPPU.getPPU();
        this.apu = await FamAPU.getAPU();
        this.cpu.setMemReadCallback((addr) => this.readMem(addr));
        this.cpu.setMemWriteCallback((addr, data) => this.writeMem(addr, data));
        //this.cpu.setApuStepCallback((cycle: number) => this.stepApu(cycle));
        this.ppu.setHblankCallback(y => {
            if (y === 0 || y === 131 || y == 65 || y == 196) {
                this.stepApu();
            }
        });
        this.apu.setDmcCallback(addr => {
            this.cpu.skip(4);
            return this.readMem(addr);
        });
        this.ppu.setVblankCallback(() => this.vblank());
        this.ppu.setCpuCallback((cycle) => this.stepCpu(cycle));
        this.apu.setIrqCallback(flag => this.cpu.irq(flag));
        this.ppu.setMirrorMode(this.nesFile.mirrorMode);
        if (this.nesFile.batteryBacked) {
            this.batteryRam = new Uint8Array(0x2000);
            const data = await loadBinaryData(await this.nesFile.getId());
            if (data) {
                this.batteryRam.set(data);
            }
        }
        this.initRom();
        let counter = 0;
        let outFlag = false;
        let totalCycle = 0;
        let lastStack = 0xff;
        /*
        this.cpu.setDebugCallback((a: number, x: number, y: number, s: number, p: number, pc: number, cycle: number) => {
            counter++;
            totalCycle += cycle;
            const code = this.readMem(pc);
            if (pc < 0x8000) {
                this.soundCount = 20;
            } else {
                outFlag = false;
            }
            if (pc < 0xc200 || pc > 0xc2ff) {
                //outFlag = true;
            } else {
                outFlag = false;
            }
            if (pc == 0xef11 || code === 0) {
                this.debugStart = true;
            }
            if (this.soundCount > 0) {
                outFlag = true;
                this.soundCount--;
            }
            outFlag = false;
            if (lastStack !== s && !this.debugStart) {
                if (s < lastStack) {
                    // 増えた
                    this.debugText.forEach(s => console.log(s));
                    console.log("PUSH:" + lastStack.toString(16) + " => " + s.toString(16));
                    this.debugText = [];
                } else {
                    // 減った
                    this.debugText.forEach(s => console.log(s));
                    console.log("POP:" + s.toString(16) + " <= " + lastStack.toString(16));
                    this.debugText = [];
                }
                lastStack = s;
            }
            if (outFlag || this.debugStart) {
                console.log(counter + " [" + pc.toString(16) + "] " + code.toString(16) + " A:" + a.toString(16) + " X:" + x.toString(16) + " Y:" + y.toString(16) + " P:" + p.toString(16) + " S:" + s.toString(16) + "  cycle:" + totalCycle + "  " + this.cpu!.getOperandText(pc)[0]);
            } else if (counter >= 0) {
                this.debugText.push(counter + " [" + pc.toString(16) + "] " + code.toString(16) + " A:" + a.toString(16) + " X:" + x.toString(16) + " Y:" + y.toString(16) + " P:" + p.toString(16) + " S:" + s.toString(16) + "  cycle:" + totalCycle);
                if (this.debugText.length > 2) {
                    this.debugText.splice(0, 1);
                }
            }
        });
        */
    }
    stepApu() {
        const buf = this.apu.step(this.sound.samples);
        if (this.sound) {
            this.sound.play(buf);
        }
    }
    setPad(player, pad) {
        this.padList[player] = pad;
        return this;
    }
    /**
     *
     * @param bank 設定対象の開始バンク
     * @param index 設定元のバンクインデックス
     */
    setPrgBank(bank, index) {
        let addr = bank * this.prgBankSize;
        let fromAddr = index * this.prgBankSize;
        for (let offset = 0; offset < this.prgBankSize; offset += 0x2000) {
            this.prgBankMap[(addr >> 13) & 3] = this.nesFile.prgBankList[fromAddr >> 14].subarray(fromAddr & 0x3fff, (fromAddr & 0x3fff) + 0x2000);
            addr += 0x2000;
            fromAddr += 0x2000;
        }
        return this;
    }
    /**
     *
     * @param bank 設定対象の開始バンク(0-7)
     * @param index 設定元のバンク番号
     */
    setChrBank(bank, index) {
        let addr = bank * this.chrBankSize;
        let fromAddr = index * this.chrBankSize;
        if (fromAddr >= this.nesFile.chrBankList.length * 0x2000) {
            // オーバーした
            return this;
        }
        const chr = this.nesFile.chrBankList[fromAddr >> 13];
        for (let i = 0; i < this.chrBankSize; i++) {
            this.ppu.writeVram(addr + i, chr[(fromAddr & 0x1fff) + i]);
        }
        return this;
    }
    getPrgBankSize() {
        return this.prgBankSize;
    }
    getPrgBankCount() {
        return this.nesFile.prgBankList.length * (0x4000 / this.prgBankSize);
    }
    getChrBankSize() {
        return this.chrBankSize;
    }
    getChrBankCount() {
        return this.nesFile.chrBankList.length * (0x2000 / this.chrBankSize);
    }
    setPrgBankSize(size) {
        this.prgBankSize = size;
        return this;
    }
    setChrBankSize(size) {
        this.chrBankSize = size;
        return this;
    }
    vblank() {
        this.cpu.nmi();
    }
    stepCpu(cycle) {
        this.nextCpuCycle += cycle;
        while (this.nextCpuCycle > 0) {
            const step = this.cpu.step(this.nextCpuCycle);
            this.nextCpuCycle -= step;
        }
    }
    reset() {
        this.ppu.setMirrorMode(this.nesFile.mirrorMode);
        this.initRom();
        this.cpu.reset();
        this.ppu.reset();
        this.apu.reset();
    }
    powerOff() {
        this.stopPlay();
        this.cpu.powerOff();
        this.ppu.powerOff();
        this.apu.powerOff();
        this.canvas.powerOff();
    }
    readMem(addr) {
        if (addr < 0x2000) {
            return this.ram[addr & 0x7ff];
        }
        else if (addr < 0x4000) {
            return this.ppu.readMem(addr);
        }
        else if (addr == 0x4016 || addr == 0x4017) {
            // controller
            const ix = addr - 0x4016;
            if (this.padData.index[ix] < 8) {
                let ret = 0;
                if (this.padList[ix]) {
                    ret = this.padList[ix].getButton(this.padData.index[ix]) ? 1 : 0;
                }
                if (this.padList[ix + 2]) {
                    ret |= this.padList[ix + 2].getButton(this.padData.index[ix]) ? 2 : 0;
                }
                this.padData.index[ix]++;
                return ret;
            }
            return 0;
        }
        else if (addr < 0x4020) {
            //console.log("Read Sound:" + addr.toString(16));
            //this.soundCount = 5;
            return this.apu.readMem(addr);
        }
        else if (addr < 0x8000) {
            return this.readExtRam(addr);
        }
        else {
            return this.readRom(addr);
        }
    }
    writeMem(addr, data) {
        if (addr < 0x2000) {
            this.ram[addr & 0x7ff] = data;
        }
        else if (addr < 0x4000) {
            //console.log("ppu.writeMem(0x" + addr.toString(16) + ",0x" + data.toString(16) + ");");
            this.ppu.writeMem(addr, data);
        }
        else if (addr == 0x4014) {
            // Sprite DMA
            const startAddr = data << 8;
            for (let i = 0; i < 256; i++) {
                this.ppu.writeMem(0x2004, this.readMem(startAddr + i));
            }
            this.cpu.skip(513);
        }
        else if (addr == 0x4016) {
            // TODO controller
            if (this.padData.reg !== (data & 1)) {
                this.padData.reg = (data & 1);
                if (!this.padData.reg) {
                    this.padData.index = [0, 0];
                }
            }
        }
        else if (addr < 0x4020) {
            this.apu.writeMem(addr, data);
        }
        else if (addr < 0x8000) {
            this.writeExtRam(addr, data);
        }
        else {
            this.writeRom(addr, data);
        }
    }
    /**
     * $4020-$7fff WRAM
     * @param addr
     * @returns
     */
    readExtRam(addr) {
        if (this.batteryRam && addr >= 0x6000) {
            return this.batteryRam[addr & 0x1fff];
        }
        return 0;
    }
    /**
     * $4020-$7fff WRAM
     * @param addr
     * @param data
     */
    writeExtRam(addr, data) {
        if (this.batteryRam && addr >= 0x6000) {
            this.batteryRam[addr & 0x1fff] = data;
            this.batteryCount = 10;
        }
    }
    /**
     * $8000-$ffff ROM
     * @param addr
     */
    readRom(addr) {
        const bank = this.prgBankMap[(addr >> 13) & 3];
        if (bank) {
            return bank[(addr & 0x1fff)];
        }
        return 0;
    }
    /**
     * フレームを進める
     */
    stepFrame() {
        const image = this.ppu.renderScreen(this.canvas.isClip());
        this.canvas.render(image);
        if (this.batteryCount > 0) {
            this.batteryCount--;
            if (this.batteryCount === 0) {
                //console.log("Save Battery");
                this.nesFile.getId().then(id => {
                    saveBinaryData(id, this.batteryRam).then();
                });
            }
        }
    }
    playFlag = false;
    startPlay() {
        if (!this.playFlag) {
            this.playFlag = true;
            let lastTime = 0;
            const play = (curTime) => {
                if (this.playFlag) {
                    requestAnimationFrame(play);
                    if (curTime - lastTime > 1500 / 60) {
                        console.log("Over:" + (curTime - lastTime));
                    }
                    lastTime = curTime;
                    this.stepFrame();
                }
            };
            play(0);
        }
    }
    stopPlay() {
        this.playFlag = false;
    }
    setDebugCallback(callback) {
        if (!callback) {
            this.cpu.setDebugCallback();
            return;
        }
        this.cpu.setDebugCallback((a, x, y, s, p, pc, cycle) => {
            const code = this.readMem(pc);
            const ope = this.cpu.getOperandText(pc);
            callback({
                a, x, y, s, p, pc, cycle, ope: ope[0], next: ope[1], toString: () => {
                    return pc.toString(16).toUpperCase().padStart(4, '0')
                        //+ "(" + ope[1].toString(16).toUpperCase().padStart(4, '0') + "): "
                        + "($" + code.toString(16).toUpperCase().padStart(2, '0') + ") "
                        + " A:" + a.toString(16).toUpperCase().padStart(2, '0')
                        + " X:" + x.toString(16).toUpperCase().padStart(2, '0')
                        + " Y:" + y.toString(16).toUpperCase().padStart(2, '0')
                        + " P:" + p.toString(16).toUpperCase().padStart(2, '0')
                        + " S:" + s.toString(16).toUpperCase().padStart(2, '0')
                        + " | " + ope[0];
                }
            });
        });
    }
}
