import {
  BoxGeometry,
  Clock,
  Group,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'
import pnoise3DShader from '@/shaders/periodic/3d.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let barGroup: Group, material: ShaderMaterial

const barRowCount = 20
const barColCount = 20
const barDepth = 9
const barSize = 0.5
const spacer = 4

let animateId: number

const cursor = {
  x: 0.0,
  y: 0.0,
}

const clock = new Clock()

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(60, W / H, 0.1, 1000)
  camera.position.z = 90
  camera.lookAt(scene.position)

  // Object
  createMesh()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)
  renderer.setClearColor(0x141414)

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
  const { innerWidth: W, innerHeight: H } = window

  barGroup = new Group()

  material = new ShaderMaterial({
    uniforms: {
      uMousePosition: {
        value: new Vector2(cursor.x, cursor.y),
      },
      uDimensions: {
        value: new Vector2(W, H),
      },
      uMultiplier: {
        value: 1.5,
      },
    },
    vertexShader,
    fragmentShader,
  })
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <g_pnoise>',
        pnoise3DShader,
      )
  }

  for (let i = 0; i < barRowCount * barColCount; i++) {
    const barGeometry = new BoxGeometry(barSize, barSize, barDepth)
    const barMesh = new Mesh(barGeometry, material)

    const currentRow = i % barRowCount
    const currentCol = Math.floor(i / barColCount)

    const x = currentRow * spacer - barRowCount * (spacer / 2)
    const y = currentCol * spacer - barColCount * (spacer / 2)
    const z = 0

    barMesh.position.set(x, y, z)

    barGroup.add(barMesh)
  }

  scene.add(barGroup)
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  if (width !== W || height !== H) {
    camera.aspect = W / H
    camera.updateProjectionMatrix()

    renderer.setSize(W, H)
    renderer.setPixelRatio(DPI)

    material.uniforms.uDimensions.value = new Vector2(W, H)
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
  const cursorVector = new Vector2(cursor.x, cursor.y)

  material.uniforms.uMousePosition.value = cursorVector

  const time = clock.getElapsedTime()

  barGroup.children.forEach((m, i) => {
    const normalizedCurrentRow = (i % barRowCount) / barRowCount
    const normalizedCurrentCol = Math.floor(i / barColCount) / barColCount

    const dx = Math.abs(cursor.x - normalizedCurrentRow)
    const dy = Math.abs(1 - cursor.y - normalizedCurrentCol)

    const effect = (1 - dx) * (1 - dy) * 10
    const z = -barDepth + (Math.sin(time * 3 + i / 3) + 1.2) / 0.5 + effect

    m.position.z = z
  })
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
