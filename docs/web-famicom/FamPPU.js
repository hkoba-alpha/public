export class FamPPU {
    module;
    // コールバック関数の参照を保持するための変数
    vblankCallback = 0;
    hblankCallback = 0;
    cpuCallback = 0;
    // シングルトンインスタンスを保持するための変数
    static instance;
    // コンストラクタは外部から呼び出せないようにする
    constructor(module) {
        this.module = module;
    }
    // PPUのインスタンスを取得するためのメソッド
    static async getPPU() {
        if (!this.instance) {
            const wasmModule = await import('./wasm/ppu.js');
            const module = await wasmModule.default();
            this.instance = new FamPPU(module);
        }
        return this.instance;
    }
    // VBlankコールバックを設定するメソッド
    setVblankCallback(callback) {
        if (this.vblankCallback) {
            this.module.removeFunction(this.vblankCallback);
        }
        if (callback) {
            this.vblankCallback = this.module.addFunction(callback, 'v');
            this.module._setVblankCallback(this.vblankCallback);
        }
        else {
            this.vblankCallback = 0;
            this.module._setVblankCallback(0);
        }
    }
    // HBlankコールバックを設定するメソッド
    setHblankCallback(callback) {
        if (this.hblankCallback) {
            this.module.removeFunction(this.hblankCallback);
        }
        if (callback) {
            this.hblankCallback = this.module.addFunction(callback, 'vi');
            this.module._setHblankCallback(this.hblankCallback);
        }
        else {
            this.hblankCallback = 0;
            this.module._setHblankCallback(0);
        }
    }
    // CPUコールバックを設定するメソッド
    setCpuCallback(callback) {
        if (this.cpuCallback) {
            this.module.removeFunction(this.cpuCallback);
        }
        if (callback) {
            this.cpuCallback = this.module.addFunction(callback, 'vi');
            this.module._setCpuCallback(this.cpuCallback);
        }
        else {
            this.cpuCallback = 0;
            this.module._setCpuCallback(0);
        }
    }
    /**
     * 画面をレンダリングする
     * @param clip 上下8ドットずつをクリップするかどうか
     * @returns レンダリングされた画面のピクセルデータ
     */
    renderScreen(clip = false) {
        const ret = this.module._renderScreen();
        if (clip) {
            return new Uint8ClampedArray(this.module.HEAPU32.buffer, ret + 256 * 8 * 4, 256 * 224 * 4);
        }
        else {
            return new Uint8ClampedArray(this.module.HEAPU32.buffer, ret, 256 * 240 * 4);
        }
    }
    // メモリにデータを書き込むメソッド
    writeMem(addr, data) {
        //console.log("VRAM:" + addr.toString(16) + "=" + data.toString(16));
        this.module._writeMem(addr & 0x2007, data);
    }
    // メモリからデータを読み込むメソッド
    readMem(addr) {
        return this.module._readMem(addr & 0x2007);
    }
    // VRAMにデータを書き込むメソッド
    writeVram(addr, data) {
        this.module._writeVram(addr, data);
    }
    // VRAMからデータを読み込むメソッド
    readVram(addr) {
        return this.module._readVram(addr);
    }
    // スプライトにデータを書き込むメソッド
    writeSprite(addr, data) {
        this.module._writeSprite(addr, data);
    }
    /**
     * ミラーモードを設定するメソッド
     * @param mode 0: 1画面 lower, 1: １画面 upper, 2:垂直ミラー, 3:水平ミラー, 4:4画面
     */
    setMirrorMode(mode) {
        this.module._setMirrorMode(mode);
    }
    reset() {
        this.module._reset();
    }
    powerOff() {
        this.module._powerOff();
    }
}
