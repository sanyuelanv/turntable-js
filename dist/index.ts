export interface Rect {
    width: number;
    height: number;
}
export declare class Turntable {
    private isDev;
    private devFPS;
    private devLastTs;
    private lastTs;
    private endTs;
    private fristSecDist;
    private canvas;
    private ctx;
    private image;
    private speed;
    private isStart;
    private endAngle;
    private translatePos;
    private rotateAngle;
    private rotateTime;
    private startAngle;
    private callback;
    private readyCallback;
    private ready;
    /**
     *
     * @param canvas canvas 元素
     * @param imageSrc 图片链接
     * @param startAngle 开始弧度
     * @param readyCallback 图片加载完成会调
     * @param rect canvas 的尺寸。置空则采用图片尺寸
     * @param isDev 是否开启开发者模式
     */
    constructor(canvas: HTMLCanvasElement, imageSrc: string, startAngle: number, readyCallback: Function, rect: Rect, isDev: boolean);
    /**
     * 开始转动转盘
     * @param turnByRoundTime  转 1 圈所用时间(ms)
     */
    start(turnByRoundTime: number): void;
    /**
     * stop 并不能马上把转盘停下来，只会慢慢减速停止。但在帧数稳定的情况下，会在 1 s 内结束
     * @param pos 期望转到 弧度
     * @param callback 停下后的回调
     */
    stop(angle: number, callback: Function): void;
    /**
     * 还原旋转角度
     */
    resetCtxRotate(): void;
    private load;
    private allStop;
    private reset;
    private renderImage;
    private render;
}
