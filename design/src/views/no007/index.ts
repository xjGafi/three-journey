import {
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  WebGLRenderer,
} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

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

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(60, W / H, 0.1, 1000)
  camera.position.y = 20
  camera.position.z = 120
  camera.lookAt(scene.position)

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
  renderer.setClearColor(0xEBC8DC)

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
  // Mountains
  const mountainsGeometry = new PlaneGeometry(350, 350, 10, 10)
  const mountainsPositions = mountainsGeometry.attributes.position.array
  for (let i = 0; i < mountainsPositions.length; i += 3) {
    const distance = -Math.floor(Math.random() * 150)
    mountainsPositions[i + 1] = distance // 修改 y 坐标
  }

  // Forest
  const forestGeometry = new PlaneGeometry(350, 350, 80, 80)
  const forestPositions = forestGeometry.attributes.position.array
  for (let i = 0; i < forestPositions.length; i += 3) {
    const distance = -Math.floor(Math.random() * 100)
    forestPositions[i + 1] = distance // 修改 y 坐标
  }

  material = new ShaderMaterial({
    uniforms: {
      uMousePosition: {
        value: new Vector2(cursor.x, cursor.y),
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

  const mountainsMesh = new Mesh(mountainsGeometry, material)
  mountainsMesh.position.set(0, 20, -20)
  scene.add(mountainsMesh)

  const forestMesh = new Mesh(forestGeometry, material)
  forestMesh.position.set(0, -25, -10)
  scene.add(forestMesh)

  // Water
  const waterGeometry = new PlaneGeometry(350, 350, 50, 50)
  const waterMaterial = new ShaderMaterial({
    uniforms: {
      uMousePosition: {
        value: new Vector2(
          cursor.x,
          cursor.y,
        ),
      },
    },
    fragmentShader: meshFragmentShader,
    vertexShader: meshVertexShader,
  })
  waterMaterial.onBeforeCompile = (shader) => {
    shader.vertexShader = shader.vertexShader
      .replace(
        '#include <g_pnoise>',
        pnoise3DShader,
      )
  }
  const waterMesh = new Mesh(waterGeometry, waterMaterial)
  waterMesh.rotation.x = -Math.PI / 2
  waterMesh.position.y = -50
  scene.add(waterMesh)
}

function createWords() {
  const template = document.createElement('h2')
  template.setAttribute('style', `
    position: absolute;
    top: 35%;
    left: 50%;
    transform: translate(-50%, -35%);
    z-index: 50;
    user-select: none;
    margin: 0;
    font-size: 80px;
    text-align: center;
  `)

  const text = `
    <p id='morning'> W A K E <br/> U P </p>
    <p id='evening'> S L E E P <br/> T I G H T </p>
  `
  template.innerHTML = text
  document.body.appendChild(template)
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
        value: 0.7,
      },
      uMousePosition: {
        value: new Vector2(cursor.x, cursor.y),
      },
    },
    vertexShader: postVertexShader,
    fragmentShader: postFragmentShader,
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
    overlayShaderPass.uniforms.dimensionsMultiplier.value = 0.7
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

  const morningEl = document.querySelector('#morning')
  const eveningEl = document.querySelector('#evening')

  if (cursor.x < 0.5) {
    morningEl?.setAttribute('style', 'display: block')
    eveningEl?.setAttribute('style', 'display: none')
  }
  else {
    morningEl?.setAttribute('style', 'display: none')
    eveningEl?.setAttribute('style', 'display: block')
  }
}

function render() {
  composer.render()
}

export default function main() {
  init()
  animate()
}
