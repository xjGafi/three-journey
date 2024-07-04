import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three'

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let composer: EffectComposer, renderPass: RenderPass, glitchPass: GlitchPass

let ball: Mesh
const radius = 50

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 200)

  // Lights
  createLights()

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

function createLights() {
  const ambientLight = new AmbientLight(0x4040FF)
  scene.add(ambientLight)

  const lights: Array<DirectionalLight> = []
  lights[0] = new DirectionalLight(0x52FFC9, 0.5)
  lights[0].position.set(0, 1, 1)
  lights[1] = new DirectionalLight(0x4BBDEA, 0.5)
  lights[1].position.set(0, 1, 0.5)
  lights[2] = new DirectionalLight(0x4F4FC9, 0.2)
  lights[2].position.set(0, -1, 0.5)
  scene.add(lights[0])
  scene.add(lights[1])
  scene.add(lights[2])
  lights.map(light => light.castShadow = true)
}

function createBall() {
  const geometry = new SphereGeometry(radius, 100, 100)
  const material = new MeshLambertMaterial({
    color: 0x87F9D9,
  })

  ball = new Mesh(geometry, material)
  ball.position.x = 0
  ball.castShadow = true

  scene.add(ball)
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

function animate() {
  animateId = window.requestAnimationFrame(animate)

  render()
}

function render() {
  composer.render()
}

export default function main() {
  init()
  animate()
}
