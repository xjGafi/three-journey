import type {
  BufferAttribute,
} from 'three'
import {
  Clock,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector2,
  WebGLRenderer,
} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import meshVertexShader from './shader/meshVertex.glsl?raw'
import meshFragmentShader from './shader/meshFragment.glsl?raw'
import postVertexShader from './shader/postVertex.glsl?raw'
import postFragmentShader from './shader/postFragment.glsl?raw'
import pnoise3DShader from '@/shaders/periodic/3d.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let composer: EffectComposer, renderPass: RenderPass, FXAAShaderPass: ShaderPass, overlayShaderPass: ShaderPass

let material: ShaderMaterial

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
  camera.position.z = 180
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
  renderer.setClearColor(0x96BEFF)

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
  const geometry = new SphereGeometry(60, 20, 64)
  const radius = 10
  const geometryRows = 6
  const geometryCols = 64

  // FIXME: 有问题，mesh 裂了
  const positionAttribute = geometry.attributes.position as BufferAttribute
  const positionsArray = positionAttribute.array as Array<number>
  for (let i = 0; i < positionsArray.length; i += 3) {
    const currentRow = Math.floor(i / 3 / geometryRows)
    const currentCol = (i / 3) % geometryCols
    const radLength = (Math.PI * 2) / geometryCols
    const angle = radLength * currentRow + Math.PI * 2 * currentCol

    const dz = radius * Math.cos(angle)
    const dx = radius * Math.sin(angle)
    const dy = currentRow / 1.2

    positionsArray[i + 2] += dz
    positionsArray[i] += dx
    positionsArray[i + 1] = -positionsArray[i + 1] - 100 + dy
  }

  material = new ShaderMaterial({
    uniforms: {
      uMousePosition: {
        value: new Vector2(cursor.x, cursor.y),
      },
      uTime: {
        value: 0,
      },
    },
    vertexShader: meshVertexShader,
    fragmentShader: meshFragmentShader,
  })
  material.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <g_pnoise>',
        pnoise3DShader,
      )
  }

  const mesh = new Mesh(geometry, material)
  mesh.rotation.z = Math.PI / 2
  scene.add(mesh)
}

function createComposer() {
  composer = new EffectComposer(renderer)

  // RenderPass 通常位于过程链的开始，以便将渲染好的场景作为输入来提供给下一个后期处理步骤
  renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window
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
      uDensityMultiplier: {
        value: DPI || 1,
      },
      uMousePosition: {
        value: new Vector2(cursor.x, cursor.y),
      },
      uAmount: {
        value: new Vector2(300, 300),
      },
    },
    vertexShader: postVertexShader,
    fragmentShader: postFragmentShader,
  })
  overlayShaderPass.uniforms.uAmount.value.x = Math.round(W / 80)
  overlayShaderPass.uniforms.uAmount.value.y = (H / W) * overlayShaderPass.uniforms.uAmount.value.x

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
    overlayShaderPass.uniforms.uDensityMultiplier.value = DPI || 1
    overlayShaderPass.uniforms.uAmount.value.x = Math.round(W / 80)
    overlayShaderPass.uniforms.uAmount.value.y = (H / W) * overlayShaderPass.uniforms.uAmount.value.x
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

  const time = clock.getElapsedTime() / 5

  material.uniforms.uMousePosition.value = cursorVector
  material.uniforms.uTime.value = time
  overlayShaderPass.uniforms.uMousePosition.value = cursorVector

  camera.position.x += (cursorVector.x * 60 - camera.position.x) * 0.05
  camera.position.y += (cursorVector.y * 60 - camera.position.y) * 0.05
  camera.lookAt(scene.position)
}

function render() {
  composer.render()
}

export default function main() {
  init()
  animate()
}
