import {
  Clock,
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  WebGLRenderer,
} from 'three'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'
import uniforms from './uniforms'

let scene: Scene
let camera: PerspectiveCamera
let renderer: WebGLRenderer

const meshes: Array<Mesh> = []

const cursor = {
  x: 0.5,
  y: 0.5,
}

const clock = new Clock()
let timeOffset = 0

init()
animate()

function init() {
  scene = new Scene()

  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 800)
  camera.position.z = 130

  meshGenerator()

  const canvas = document.querySelector('canvas#webgl_002')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  window.addEventListener('resize', onResize)
  window.addEventListener('mousemove', onMouseMove)
}

function animate() {
  requestAnimationFrame(animate)

  updateView()

  render()
}

function meshGenerator() {
  const geometry = new PlaneGeometry(75, 75)

  uniforms.forEach((uniform, index) => {
    const material = new ShaderMaterial({
      uniforms: {
        u_color1: {
          value: new Color(uniform.color1),
        },
        u_color2: {
          value: new Color(uniform.color2),
        },
        u_time: { value: 0 },
        u_timeOffset: { value: uniform.timeOffset },
      },
      fragmentShader,
      vertexShader,
      transparent: true,
    })

    const mesh = new Mesh(geometry, material)
    mesh.position.z = 50 - 35 * index
    meshes.push(mesh)
  })

  scene.add(...meshes)
}

function onResize() {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function onMouseMove(event: MouseEvent) {
  cursor.x = event.clientX / innerWidth - 0.5
  cursor.y = event.clientY / innerHeight - 0.5
}

function updateView() {
  const x = (cursor.x * 50 - camera.position.x) / 20
  const y = (cursor.y * 40 - camera.position.y) / 20

  const deltaTime = clock.getDelta()
  timeOffset += (Math.abs(x) + Math.abs(y)) / 20
  const time = deltaTime + timeOffset

  meshes.forEach((mesh) => {
    (mesh.material as ShaderMaterial).uniforms.u_time.value = time
  })

  camera.position.x += x
  camera.position.y += y
  camera.position.z += x + y
  camera.lookAt(scene.position)
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
