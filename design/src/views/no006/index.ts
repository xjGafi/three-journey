import {
  Clock,
  IcosahedronGeometry,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import fragmentShader from './shader/fragment.glsl?raw'
import vertexShader from './shader/vertex.glsl?raw'
import fragmentOverlayShader from './shader/fragmentOverlay.glsl?raw'
import vertexOverlayShader from './shader/vertexOverlay.glsl?raw'
import pnoise3DShader from '@/shaders/periodic/3d.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let composer: EffectComposer, renderPass: RenderPass, FXAAShaderPass: ShaderPass, overlayShaderPass: ShaderPass

let material: ShaderMaterial, mesh: Mesh

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
  renderer.setClearColor(0x6400FF)

  // Composer
  createComposer()

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
  const geometry = new IcosahedronGeometry(40, 100)
  material = new ShaderMaterial({
    uniforms: {
      uMousePosition: {
        value: new Vector2(cursor.x, cursor.y),
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

  mesh = new Mesh(geometry, material)
  scene.add(mesh)
}

function createComposer() {
  composer = new EffectComposer(renderer)

  // RenderPass 通常位于过程链的开始，以便将渲染好的场景作为输入来提供给下一个后期处理步骤
  renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const { innerWidth: W, innerHeight: H } = window
  // 抗锯齿
  FXAAShaderPass = new ShaderPass(FXAAShader)
  FXAAShaderPass.uniforms.resolution.value.set(1 / W, 1 / H)
  composer.addPass(FXAAShaderPass)

  // 叠加滤镜
  overlayShaderPass = new ShaderPass({
    uniforms: {
      tDiffuse: {
        value: null,
      },
      dimensions: {
        value: new Vector2(W, H),
      },
      dimensionsMultiplier: {
        value: W < 800 ? 3 : 1,
      },
      uMousePosition: {
        value: new Vector2(cursor.x, cursor.y),
      },
    },
    vertexShader: vertexOverlayShader,
    fragmentShader: fragmentOverlayShader,
  })

  composer.addPass(overlayShaderPass)
  overlayShaderPass.renderToScreen = true
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  if (width !== W || height !== H) {
    camera.aspect = W / H
    camera.updateProjectionMatrix()

    renderer.setSize(W, H)
    renderer.setPixelRatio(DPI)

    FXAAShaderPass.uniforms.resolution.value.set(1 / W, 1 / H)
    overlayShaderPass.uniforms.dimensionsMultiplier.value = W < 800 ? 3 : 1
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
  overlayShaderPass.uniforms.uMousePosition.value = cursorVector

  const elapsedTime = clock.getElapsedTime() / 10

  mesh.rotation.x = elapsedTime
  mesh.rotation.y = elapsedTime * 1.5
  mesh.rotation.z = elapsedTime

  camera.position.x = (cursor.x - 0.5) * 100
  camera.position.y = (cursor.y - 0.5) * 100
  camera.lookAt(mesh.position)
}

function render() {
  composer.render()
}

export default function main() {
  init()
  animate()
}
