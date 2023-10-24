import {
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  WebGLRenderer,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let composer: EffectComposer, renderPass: RenderPass, glitchPass: GlitchPass

let ball: Mesh

let animateId: number

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, W / H, 1, 1000)
  camera.position.set(0, 0, 200)

  // Object
  createBall()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)

  // Composer
  createComposer()

  // Listener
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function animate() {
  animateId = window.requestAnimationFrame(animate)

  ball.rotation.y += 0.005
  ball.rotation.z += 0.005

  render()
}

function createBall() {
  const geometry = new SphereGeometry(50, 100, 100)
  const material = new ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uSegments: { value: 50 },
    },
  })

  ball = new Mesh(geometry, material)

  scene.add(ball)
}

function createComposer() {
  composer = new EffectComposer(renderer)

  // RenderPass 通常位于过程链的开始，以便将渲染好的场景作为输入来提供给下一个后期处理步骤
  renderPass = new RenderPass(scene, camera)
  composer.addPass(renderPass)

  // 故障效果
  glitchPass = new GlitchPass()
  composer.addPass(glitchPass)
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

function onDestroy() {
  try {
    window.cancelAnimationFrame(animateId)
    window.removeEventListener('destroy', onDestroy, false)
    window.removeEventListener('resize', onResize, false)
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

function render() {
  composer.render()
}

export default function main() {
  init()
  animate()
}
