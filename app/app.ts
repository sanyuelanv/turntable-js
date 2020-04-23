import './app.common.css'
import { SlotMachine } from './slotMachine'
import all from './assets/all.png'
import drawBox from './assets/drawBox.png'
// import * as echarts from 'echarts'
const canvas: HTMLCanvasElement = <HTMLCanvasElement>document.getElementById('main')
if (!__DEV__) {
  document.getElementById('fps').style.display = 'none'
}

const slotMachine: SlotMachine = new SlotMachine(canvas, all, { width: 100, height: 124 }, { column: 3, row: 9, rect: { width: 100, height: 124 } })
