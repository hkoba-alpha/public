import { FamAPU } from "./FamAPU";
import { FamCPU } from "./FamCPU";
import { FamPPU } from "./FamPPU";
export declare function saveBinaryData(key: string, data: Uint8Array): Promise<void>;
export declare function loadBinaryData(key: string): Promise<Uint8Array | null>;
export declare class NesFile {
    private buffer;
    /**
    * 0: 1画面 lower bank
    * 1: 1画面 upper bank
    * 2: 垂直ミラー
    * 3: 水平ミラー
    * 4: ４画面
     */
    readonly mirrorMode: number;
    readonly batteryBacked: boolean;
    readonly trainer: boolean;
    readonly prgBankList: Uint8Array[];
    readonly chrBankList: Uint8Array[];
    readonly mapper: number;
    private md5;
    constructor(buffer: Uint8Array);
    getId(): Promise<string>;
}
/**
 * 画面描画
 */
export interface IFamCanvas {
    render(image: Uint8ClampedArray): void;
    isClip(): boolean;
    powerOff(): void;
}
/**
 *  ボタン番号
 */
export declare const enum PadButton {
    A = 0,
    B = 1,
    SELECT = 2,
    START = 3,
    UP = 4,
    DOWN = 5,
    LEFT = 6,
    RIGHT = 7
}
/**
 * コントローラ
 */
export interface IFamPad {
    getButton(button: PadButton): boolean;
}
/**
 * 音楽
 */
export interface IFamSound {
    /**
     * 240Hz分のサンプル数
     */
    samples: number;
    /**
     * 240Hz分のサンプルデータ
     * @param data
     */
    play(data: Uint8Array): void;
}
export declare abstract class Mapper {
    protected nesFile: NesFile;
    protected ram: Uint8Array;
    protected nextCpuCycle: number;
    protected cpu?: FamCPU;
    protected ppu?: FamPPU;
    protected apu?: FamAPU;
    protected canvas?: IFamCanvas;
    protected padList: (IFamPad | null)[];
    protected sound?: IFamSound;
    protected padData: {
        reg: number;
        index: number[];
    };
    /**
     * 8KBずつのバンクが4つ
     */
    protected prgBankMap: (Uint8Array | null)[];
    /**
     * PRGバンクサイズ
     * このバンクサイズで選択する
     */
    protected prgBankSize: 0x2000 | 0x4000;
    /**
     * CHRバンクサイズ
     * このバンクサイズで選択する
     */
    protected chrBankSize: 0x400 | 0x800 | 0x1000 | 0x2000;
    /**
     * バッテリーバックアップ
     * $6000-$7FFF
     */
    protected batteryRam?: Uint8Array;
    /**
     * バッテリーバックアップを保存するまでの待ちカウント
     */
    protected batteryCount: number;
    private soundCount;
    protected constructor(nesFile: NesFile);
    /**
     * エントリ
     */
    private static mapperEntryMap;
    /**
     *
     * @param type Mapper種別
     * @returns
     */
    static entry(type: number): (target: any, propertyKey: any, descriptor: any) => void;
    static getMapper(nes: NesFile): Mapper;
    private debugText;
    private debugStart;
    private stackBuf;
    init(canvas: IFamCanvas, sound: IFamSound): Promise<void>;
    private stepApu;
    setPad(player: number, pad: IFamPad | null): Mapper;
    /**
     *
     * @param bank 設定対象の開始バンク
     * @param index 設定元のバンクインデックス
     */
    setPrgBank(bank: number, index: number): Mapper;
    /**
     *
     * @param bank 設定対象の開始バンク(0-7)
     * @param index 設定元のバンク番号
     */
    setChrBank(bank: number, index: number): Mapper;
    getPrgBankSize(): number;
    getPrgBankCount(): number;
    getChrBankSize(): number;
    getChrBankCount(): number;
    setPrgBankSize(size: 0x2000 | 0x4000): Mapper;
    setChrBankSize(size: 0x400 | 0x800 | 0x1000 | 0x2000): Mapper;
    protected vblank(): void;
    protected stepCpu(cycle: number): void;
    reset(): void;
    powerOff(): void;
    readMem(addr: number): number;
    writeMem(addr: number, data: number): void;
    /**
     * $4020-$7fff WRAM
     * @param addr
     * @returns
     */
    protected readExtRam(addr: number): number;
    /**
     * $4020-$7fff WRAM
     * @param addr
     * @param data
     */
    protected writeExtRam(addr: number, data: number): void;
    /**
     * $8000-$ffff ROM
     * @param addr
     */
    protected readRom(addr: number): number;
    /**
     * $8000-$ffff ROM
     * @param addr
     * @param data
     */
    protected abstract writeRom(addr: number, data: number): void;
    /**
     * ROMの初期化
     */
    protected abstract initRom(): void;
    /**
     * フレームを進める
     */
    stepFrame(): void;
    private playFlag;
    startPlay(): void;
    stopPlay(): void;
    setDebugCallback(callback?: (data: {
        a: number;
        x: number;
        y: number;
        s: number;
        p: number;
        pc: number;
        cycle: number;
        ope: string;
        next: number;
        toString: () => string;
    }) => void): void;
}
