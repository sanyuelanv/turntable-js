import './app.common.css'
import { Turntable } from './turntable'
import gift from './assets/gift.png'
import border from './assets/border@2x.png'
import start from './assets/start.png'
import * as echarts from 'echarts'
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('main')
const bg: HTMLDivElement = <HTMLDivElement>document.getElementById('bg')
const point: HTMLDivElement = <HTMLDivElement>document.getElementById('point')
bg.style.backgroundImage = `url(${border})`
point.style.backgroundImage = `url(${start})`
if (!__DEV__) {
  document.getElementById('fps').style.display = 'none'
}
//图表的
const myChart = echarts.init(document.getElementById('echart'))
// get Test
let flag: boolean = false
const testResulrArr = [0, 0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75]
const turntable = new Turntable(canvas, gift, 0.01 * Math.PI, () => {
  console.log('加载完成')
  document.onclick = async () => {
    if (!flag) {
      turntable.start(250)
      flag = true
    }
    else {
      flag = false
      const pos = Math.floor(Math.random() * (7 - 0 + 1) + 0)
      turntable.stop(testResulrArr[pos] * Math.PI, () => {
        const option = {
          xAxis: {
            type: 'category',
            data: turntable.devTimeArr
          },
          yAxis: {
            type: 'value'
          },
          series: [{
            data: turntable.devSpeedArr,
            type: 'line'
          }]
        }
        myChart.setOption(option)
      })
    }

  }
}, { width: 400, height: 400 })
