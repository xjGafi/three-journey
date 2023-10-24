import './style.css'
import {
  BufferAttribute,
  BufferGeometry,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, controls: OrbitControls

const near = 1
const far = 100

init()
animate()

function init() {
  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, near, far)
  camera.position.set(0, 0, far)
  // camera.lookAt(0, 0, 0)

  // Scene
  scene = new Scene()

  // Objects
  timePointGenerator()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minDistance = near
  controls.maxDistance = far / 2

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function timePointGenerator() {
  const positionList: Array<number> = []
  const colorList: Array<number> = []

  const [hour, minute, second] = [24, 60, 60]
  const todayTimeList = Array.from(
    Array(hour),
    () => {
      return Array.from(
        Array(minute),
        () => Array(second).fill(''),
      )
    },
  )
  todayTimeList.forEach((minutes, h) => {
    minutes.forEach((seconds, m) => {
      seconds.forEach((_, s) => {
        positionList.push(h, m, s)
        colorList.push(h / hour, m / minute, s / second)
      })
    })
  })

  // geometry
  const positions = new Float32Array(positionList)
  const colors = new Float32Array(colorList)
  const geometry = new BufferGeometry()
  geometry.setAttribute('position', new BufferAttribute(positions, 3))
  geometry.setAttribute('color', new BufferAttribute(colors, 3))

  // material
  const material = new PointsMaterial({
    vertexColors: true,
    depthWrite: true,
    size: 2,
  })

  // points
  const points = new Points(geometry, material)
  points.position.set(-hour / 2, -minute / 2, -second / 2)
  scene.add(points)
}

// function pointGenerator(h: number, m: number, s: number) {
//   const geometry = new BufferGeometry()
//   const position = new Float32Array([h, m, s])
//   const attribute = new BufferAttribute(position, 3)
//   geometry.setAttribute('position', attribute)

//   const material = new PointsMaterial({
//     sizeAttenuation: true,
//     size: 0.1,
//     color: new Color(h, m, s),
//   })

//   const particles = new Points(geometry, material)
//   scene.add(particles)
// }

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function animate() {
  requestAnimationFrame(animate)

  // const time = new Date().toString().split(' ')[4]
  // const [x, y, z] = time.split(':')
  // // camera.lookAt(new Vector3(+x, +y, +z))
  // controls.target = new Vector3(+x, +y, +z)

  // updateTime()
  controls.update()

  render()
}

// function updateTime() {
//   const time = new Date().toString().split(' ')[4]

//   if (currentTime !== time) {
//     const [h, m, s] = time.split(':')
//       .map((value: string, index: number) => {
//         const total = index === 0 ? 24 : 60
//         return Number(value) / total
//       })

//     pointGenerator(h, m, s)
//   }

//   currentTime = time
// }

function render() {
  renderer.render(scene, camera)
}
