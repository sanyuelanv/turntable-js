import { Turntable } from './turntable'
import gift from './assets/gift.png'
import border from './assets/border@2x.png'
import start from './assets/start.png'
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('main')
const bg: HTMLDivElement = <HTMLDivElement>document.getElementById('bg')
const point: HTMLDivElement = <HTMLDivElement>document.getElementById('point')
bg.style.backgroundImage = `url(${border})`
point.style.backgroundImage = `url(${start})`
if (!__DEV__) { document.getElementById('fps').style.display = 'none' }
// get Test
let flag: boolean = false
const testResulrArr = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75]
const turntable = new Turntable(canvas, gift, 0.01 * Math.PI, () => {
  console.log('加载完成')
  document.onclick = () => {
    if (!flag) {
      turntable.start(250)
      flag = true
    }
    else {
      flag = false
      const pos = Math.floor(Math.random() * (7 - 0 + 1) + 0)
      turntable.stop(testResulrArr[pos] * Math.PI, () => { })
    }

  }
}, { width: 400, height: 400 }, document.getElementById('fps'))
