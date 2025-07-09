import { Vector3 } from 'three'

const colors = [
  new Vector3(50, 50, 50),
  new Vector3(255, 255, 255),
  new Vector3(255, 50, 50),
  new Vector3(0, 0, 255),
  new Vector3(180, 180, 180),
]

export const materialList = [
  { color1: colors[0], color2: colors[1], timeOffset: 4.4, position: 0 },
  { color1: colors[1], color2: colors[1], timeOffset: 4.1, position: -36 },
  { color1: colors[4], color2: colors[4], timeOffset: 5.1, position: -72 },
  { color1: colors[4], color2: colors[4], timeOffset: 8.1, position: -121 },
  { color1: colors[2], color2: colors[3], timeOffset: 4.4, position: -180 },
]
