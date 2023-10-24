import {
  Clock,
  Color,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'
import pnoiseShader from '@/shaders/pnoise.glsl?raw'
import circleShader from '@/shaders/circle.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let mesh: Mesh

let animateId: number

const cursor = {
  x: 0.5,
  y: 0.5,
}

const clock = new Clock()
let deltaTime = 0

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 800)
  camera.position.z = 130

  // Object
  createMesh()

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

function createMesh() {
  const colors = ['#ffb961', '#ca5fa6', 'rgb(0, 255, 243)', 'rgb(255, 121, 180)']

  const uColors: Record<string, { value: Color }> = {}
  colors.forEach((color, index) => {
    uColors[`uColor${index + 1}`] = { value: new Color(color) }
  })

  const geometry = new PlaneGeometry(60, 60, 250, 250)
  const material = new ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uTimeOffset: { value: 10 * Math.random() },
      uMouseInertia: { value: new Vector2(cursor.x, cursor.y) },
      ...uColors,
    },
    fragmentShader,
    vertexShader,
    transparent: true,
  })

  material.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <g_pnoise>',
        pnoiseShader,
      ).replace(
        '#include <g_circle>',
        circleShader,
      )

    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <g_pnoise>',
        pnoiseShader,
      )
  }

  mesh = new Mesh(geometry, material)

  scene.add(mesh)
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
  const x = ((cursor.x - 0.5) * 120 - camera.position.x) / 20
  const y = ((cursor.y - 0.5) * 120 - camera.position.y) / 20

  const timeOffset = clock.getDelta() / 5
  deltaTime += timeOffset

  const { uniforms } = mesh.material as ShaderMaterial
  uniforms.uTime.value = deltaTime
  uniforms.uTimeOffset.value = timeOffset
  uniforms.uMouseInertia.value = new Vector2(cursor.x, cursor.y)

  camera.position.x += x
  camera.position.y += y
  camera.position.z += (x + y) / 10
  camera.lookAt(scene.position)
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
