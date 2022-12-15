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

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let animateId: number

let meshes: Array<Mesh>

const cursor = {
  x: 0.5,
  y: 0.5,
}

const clock = new Clock()
let deltaTime = 0
let timeOffset = 0

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 800)
  camera.position.z = 130

  // Object
  meshGenerator()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Listener
  window.addEventListener('resize', onResize, false)
  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('destroy', onDestroy, false)
}

function animate() {
  animateId = window.requestAnimationFrame(animate)

  updateView()

  render()
}

function meshGenerator() {
  meshes = []

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
  const { width, height } = renderer.domElement
  const { innerWidth, innerHeight, devicePixelRatio } = window

  if (width !== innerWidth || height !== innerHeight) {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(devicePixelRatio)
  }
}

function onMouseMove(event: MouseEvent) {
  cursor.x = event.clientX / innerWidth
  cursor.y = event.clientY / innerHeight
}

function onDestroy() {
  try {
    window.cancelAnimationFrame(animateId)
    window.removeEventListener('destroy', onDestroy, false)
    window.removeEventListener('resize', onResize, false)
    window.removeEventListener('mousemove', onMouseMove, false)
    renderer.dispose()
    renderer.forceContextLoss()
    const gl = renderer.domElement.getContext('webgl')
    gl?.getExtension('WEBGL_lose_context')?.loseContext()
    scene.clear()
  }
  catch (error) {
    console.error('Failed to destroy Three.js: ', error)
  }
}

function updateView() {
  const x = ((cursor.x - 0.5) * 50 - camera.position.x) / 20
  const y = ((cursor.y - 0.5) * 40 - camera.position.y) / 20

  deltaTime += clock.getDelta() / 2
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
