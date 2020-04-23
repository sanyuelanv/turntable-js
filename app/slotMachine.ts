const getRequestAnimationFrame = (): Function => {
  const fixRequestAnimationFrame: Function = (callback): void => { window.setTimeout(callback, 1000 / 60) }
  return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || fixRequestAnimationFrame)
}
export interface Rect {
  width: number,
  height: number,
}
export interface SlotBox {
  column: number,
  row: number,
  rect:Rect
}
export class SlotMachine {
  // 开发使用
  private devFPS: number = 0
  public devSpeedArr: number[] = []
  public devTimeArr: number[] = []
  private devLastTs: number = Date.now()
  // 正常
  private canvas: HTMLCanvasElement
  private image: HTMLImageElement
  private ctx: CanvasRenderingContext2D
  private lastTs: number = 0

  constructor(canvas: HTMLCanvasElement, imageSrc: string, rect: Rect, box: SlotBox) {
    canvas.width = rect.width * 2
    canvas.height = rect.height * 2
    canvas.style.width = rect.width + 'px'
    canvas.style.height = rect.height + 'px'
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.image = new Image()
    this.image.src = imageSrc
    this.image.onload = () => { this.initData() }
  }
  private initData(): void {
    const myRequestAnimationFrame = getRequestAnimationFrame()
    const step = () => {
      const now: number = Date.now()
      const dist: number = this.lastTs == null ? 0 : now - this.lastTs
      this.lastTs = now
      this.render(dist)
      myRequestAnimationFrame(step)
      if (__DEV__ && document.getElementById('fps')) {
        this.devFPS += 1
        const timeDist: number = now - this.devLastTs
        if (timeDist >= 1000) {
          this.devLastTs = now
          document.getElementById('fps').innerHTML = this.devFPS > 60 ? '60' : this.devFPS + ''
          this.devFPS = 0
        }
      }
    }
    myRequestAnimationFrame(step)
  }
  private renderImage(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.image, 0, 124, 100, 124, 0, 0, 200, 248)
  }
  private render(ts: number): void {
    this.renderImage()
  }
}