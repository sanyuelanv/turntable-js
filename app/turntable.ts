const getRequestAnimationFrame = (): Function => {
  const fixRequestAnimationFrame: Function = (callback): void => { window.setTimeout(callback, 1000 / 60) }
  return (window.requestAnimationFrame || window.webkitRequestAnimationFrame || fixRequestAnimationFrame)
}
export interface Rect {
  width: number,
  height: number,
}
export class Turntable {
  // 开发使用
  private devFPS: number = 0
  public devSpeedArr: number[] = []
  public devTimeArr: number[] = []
  private devLastTs: number = Date.now()
  // 正常属性
  private lastTs: number = 0
  private endTs: number = 0
  private fristSecDist: number = 0
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private image: HTMLImageElement
  private speed: number = 0
  private isStart: boolean = false
  private endAngle: number = -1
  private translatePos: Rect
  private rotateAngle: number = 0
  private rotateTime: number = 0
  private startAngle: number = 0
  private callback: Function
  private readyCallback: Function
  ready: boolean = false
  /**
   * 
   * @param canvas canvas 元素
   * @param imageSrc 图片链接
   * @param startAngle 开始弧度
   * @param readyCallback 图片加载完成会调
   * @param rect canvas 的尺寸。置空则采用图片尺寸
   */
  constructor(canvas: HTMLCanvasElement, imageSrc: string, startAngle: number, readyCallback: Function, rect: Rect) {
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.image = new Image()
    this.image.src = imageSrc
    this.startAngle = startAngle
    this.readyCallback = readyCallback
    this.image.onload = () => { this.load(rect) }
  }
  private load(rect: Rect): void {
    if (rect == null) {
      rect = { width: 0, height: 0 }
      rect.width = this.image.width
      rect.height = this.image.height
    }
    // 初始化尺寸
    this.canvas.width = rect.width * 2
    this.canvas.height = rect.height * 2
    this.canvas.style.width = rect.width + 'px'
    this.canvas.style.height = rect.height + 'px'
    const widthHalf = this.canvas.width * 0.5
    const heightHalf = this.canvas.height * 0.5
    this.translatePos = { width: widthHalf, height: heightHalf }
    // 定 形变圆心
    this.ctx.translate(widthHalf, heightHalf)
    // 定 速度 默认：转一圈用时 （1s）
    this.speed = 2 * Math.PI / 0.25
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
    this.ctx.rotate(this.startAngle)
    this.ctx.save()
    if (this.readyCallback) {
      this.ready = true
      this.readyCallback()
    }
  }
  /**
   * 开始转动转盘
   * @param turnByRoundTime  转 1 圈所用时间(ms)
   */
  public start(turnByRoundTime: number): void {
    if (!this.ready || this.isStart) return
    this.reset()
    this.speed = 2 * Math.PI / (turnByRoundTime / 1000)
    this.isStart = true
  }
  /**
   * stop 并不能马上把转盘停下来，只会慢慢减速停止。但在帧数稳定的情况下，会在 1 s 内结束
   * @param pos 期望转到 弧度
   * @param callback 停下后的回调
   */
  public stop(angle: number, callback: Function): void {
    // 已经设置了减速，动画没完成之前则不能再重新设置
    if (!this.ready || this.endAngle >= 0) return
    this.callback = callback
    this.endAngle = angle
  }
  private allStop(): void {
    if (this.callback) this.callback()
    this.resetCtxRotate()
    this.ctx.rotate(this.endAngle)
    this.reset()
  }
  private reset(): void {
    this.endAngle = -1
    this.endTs = 0
    this.isStart = false
    this.callback = null
    this.rotateTime = 0
    this.fristSecDist = 0
    if (__DEV__) {
      this.devSpeedArr = []
      this.devTimeArr = []
    }
  }
  /**
   * 还原旋转角度
   */
  public resetCtxRotate(): void {
    this.ctx.restore()
    this.ctx.save()
    this.rotateAngle = 0
  }
  private renderImage(): void {
    this.ctx.clearRect(-this.translatePos.width, -this.translatePos.height, this.canvas.width, this.canvas.height)
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0)'
    this.ctx.fillRect(-this.translatePos.width, -this.translatePos.height, this.canvas.width, this.canvas.height)
    this.ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, -this.translatePos.width, -this.translatePos.height, this.canvas.width, this.canvas.height)
  }
  private render(ts: number): void {
    this.renderImage()
    if (this.isStart) {
      this.rotateTime += ts
      let speed = this.speed
      // 前  1 S 速度   t * t * speed = nowSpeed
      if (this.rotateTime <= 1000) { speed = this.speed * (this.rotateTime / 1000) * (this.rotateTime / 1000) }
      else {
        if (this.fristSecDist == 0) {
          this.fristSecDist = this.rotateAngle
          console.log('前 ' + this.rotateTime + ' s的距离 ---- ' + this.fristSecDist * (180 / Math.PI), '当前时间' + this.rotateTime)
        }
        // 结束角度确定之后，开始减速
        if (this.endAngle >= 0 && this.endTs == 0) {
          console.log('最后 1s 之前的距离 ---- ' + this.rotateAngle * (180 / Math.PI), '当前时间' + this.rotateTime)
          this.endTs = this.rotateTime + 1000
          this.resetCtxRotate()
          this.ctx.rotate(this.endAngle - this.fristSecDist)
        }
        if (this.endTs > 0) {
          // 最后 1 S 速度
          const distT = (this.endTs - this.rotateTime)
          speed = this.speed * (distT / 1000) * (distT / 1000)
        }
      }
      let angle: number = speed * (ts / 1000)
      if (__DEV__) {
        this.devTimeArr.push(this.rotateTime)
        this.devSpeedArr.push(speed)
      }
      this.rotateAngle += angle
      if (this.isStart && this.endTs != 0) {
        if (this.rotateTime >= this.endTs || this.rotateAngle >= this.fristSecDist) {
          // 判断这最后一下要不要加上
          if ((this.rotateAngle - angle) < this.fristSecDist) {
            angle = this.fristSecDist - (this.rotateAngle - angle)
            this.rotateAngle += angle
          }
          else {
            console.log('最后 1s 的距离 ---- ' + this.rotateAngle * (180 / Math.PI), '当前时间' + this.rotateTime)
            console.log('--------')
            this.allStop()
          }
        }
      }
      if (!this.isStart) return
      this.ctx.rotate(angle)
    }
  }
}
