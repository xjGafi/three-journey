import {
  CircleGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let composer: EffectComposer, renderPass: RenderPass, FXAAShaderPass: ShaderPass, overlayShaderPass: ShaderPass

let animateId: number

const cursor = {
  x: 0.0,
  y: 0.0,
}

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(60, W / H, 0.1, 1000)
  camera.position.z = 50

  // Object
  createMesh()
  createWords()

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

function createWords() {
  const template = document.createElement('h1')
  template.setAttribute('style', `
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 50;
    user-select: none;
    margin: 0;
    font-size: 60px;
  `)
  template.innerHTML = 'H E L L O ;-)'
  document.body.appendChild(template)
}

function createMesh() {
  const circles = new Group()

  const circleGeometry = new CircleGeometry(80, 80)
  const circleCount = 15
  for (let i = 0; i < circleCount; i++) {
    const color = `rgb(${i * Math.floor(255 / circleCount)}, 0, ${(255 - i * 5)})`
    const circleMaterial = new MeshBasicMaterial({ color })
    const circleMesh = new Mesh(
      circleGeometry,
      circleMaterial,
    )
    circleMesh.position.set(0, 0, 0)
    circleMesh.position.z = i * 1
    circleMesh.scale.multiplyScalar((circleCount - i) * 0.05)
    circles.add(circleMesh)
  }

  scene.add(circles)
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
  FXAAShaderPass.renderToScreen = true
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
    vertexShader,
    fragmentShader,
  })
  overlayShaderPass.renderToScreen = true
  composer.addPass(overlayShaderPass)
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
  overlayShaderPass.uniforms.uMousePosition.value = new Vector2(cursor.x, cursor.y)

  camera.position.x = (cursor.x - 0.5) * 100
  camera.position.y = (cursor.y - 0.5) * 100
  camera.lookAt(new Vector3(0.0, 0.0, 0.0))
}

function render() {
  composer.render()
}

export default function main() {
  init()
  animate()
}
