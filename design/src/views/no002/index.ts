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
import { materialList } from './static'
import snoise2DShader from '@/shaders/simplex/2d.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let animateId: number

const meshes: Mesh[] = []

const cursor = {
  x: 0.5,
  y: 0.5,
}

const clock = new Clock()
let deltaTime = 0
let timeOffset = 0

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Camera
  camera = new PerspectiveCamera(45, W / H, 1, 800)
  camera.position.z = 130

  // Object
  meshGenerator()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)

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
  const geometry = new PlaneGeometry(75, 75)

  materialList.forEach(({ color1, color2, timeOffset }, index) => {
    const material = new ShaderMaterial({
      uniforms: {
        uColor1: {
          value: new Color(color1),
        },
        uColor2: {
          value: new Color(color2),
        },
        uTime: { value: 0 },
        uTimeOffset: { value: timeOffset },
      },
      fragmentShader,
      vertexShader,
      transparent: true,
    })

    material.onBeforeCompile = (shader) => {
      shader.fragmentShader = shader.fragmentShader
        .replace(
          '#include <g_snoise>',
          snoise2DShader,
        )
    }

    const mesh = new Mesh(geometry, material)
    mesh.position.z = 50 - 35 * index
    meshes.push(mesh)
  })

  scene.add(...meshes)
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  if (width !== W || height !== H) {
    camera.aspect = W / H
    camera.updateProjectionMatrix()

    renderer.setSize(W, H)
    renderer.setPixelRatio(DPI)
  }
}

function onMouseMove(event: MouseEvent) {
  const { innerWidth: W, innerHeight: H } = window

  cursor.x = event.clientX / W
  cursor.y = event.clientY / H
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
    (mesh.material as ShaderMaterial).uniforms.uTime.value = time
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
