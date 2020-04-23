## 缓动无限转盘

### 需求
优化转盘转动效果
1. 缓动加速转动，
2. 均速转动 **(在没有接收到结果的时候一直均速转动)**
3. **(接受到结果)** 缓动减速转动直到停止

### 安装 
```
npm i sanyuelanv-turntable
npm run dev // 查看 demo 
```

### 使用

```javascript
// 初始化
const turntable = new Turntable(canvas, gift, 0.01 * Math.PI, () => {}, { width: 400, height: 400 }, null)
// 转动，可以指定速度
turntable.start(250)
// 停止
turntable.stop(testResulrArr[pos] * Math.PI, () => { })
// 回到原位
turntable.resetCtxRotate()
```

### API
```javaScript
/*
  初始化
  @param canvas — canvas 元素
  @param imageSrc — 图片链接
  @param startAngle — 开始弧度
  @param readyCallback — 图片加载完成会调
  @param rect — canvas 的尺寸。置空则采用图片尺寸
  @param fpsDom 展示 FPS 的demo
*/
constructor Turntable(canvas: HTMLCanvasElement, imageSrc: string, startAngle: number, readyCallback: Function, rect: Rect, isDev: boolean): Turntable
```
```
/*
  开始转动
  @param turnByRoundTime — 转 1 圈所用时间(ms)
*/
(method) Turntable.start(turnByRoundTime: number): void
```
```
/*
  stop 并不能马上把转盘停下来，只会慢慢减速停止。但在帧数稳定的情况下，会在 1 s 内结束
  @param pos — 期望转到 弧度
  @param callback — 停下后的回调
*/
(method) Turntable.stop(angle: number, callback: Function): void
```
```
/*
  还原旋转角度
*/
(method) Turntable.resetCtxRotate(): void
```
  