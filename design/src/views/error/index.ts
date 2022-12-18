import {
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereBufferGeometry,
  WebGLRenderer,
} from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let composer: EffectComposer, renderPass: RenderPass, glitchPass: GlitchPass

let circle: Mesh

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 200)

  // Object
  createBall()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  renderPass = new RenderPass(scene, camera)
  glitchPass = new GlitchPass()

  composer = new EffectComposer(renderer)
  composer.addPass(renderPass)
  composer.addPass(glitchPass)

  // Listener
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function animate() {
  animateId = window.requestAnimationFrame(animate)

  circle.rotation.y += 0.005
  circle.rotation.z += 0.005

  render()
}

function createBall() {
  const SEGMENTS = 100

  const geometry = new SphereBufferGeometry(50, SEGMENTS)
  const material = new ShaderMaterial({
    fragmentShader,
    vertexShader,
    uniforms: {
      uSegments: { value: SEGMENTS / 2 },
    },
  })

  circle = new Mesh(geometry, material)

  scene.add(circle)
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
