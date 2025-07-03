import {
  Color,
  Mesh,
  MeshBasicMaterial,
  MeshPhongMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three'

import { AsciiEffect } from 'three/examples/jsm/effects/AsciiEffect'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer, effect: AsciiEffect, controls: TrackballControls

let sphere: Mesh, plane: Mesh

const start = Date.now()

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()
  scene.background = new Color(0x000000)

  // Camera
  camera = new PerspectiveCamera(70, W / H, 1, 1000)
  camera.position.set(0, 150, 500)

  // Lights
  createLights()

  // Object
  createObject()

  // Renderer
  renderer = new WebGLRenderer()
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)
  renderer.setAnimationLoop(animate)

  // Effect
  createEffect()

  // Listener
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function animate() {
  const time = Date.now() - start

  sphere.position.y = Math.abs(Math.sin(time * 0.002)) * 80
  sphere.rotation.x = time * 0.0003
  sphere.rotation.z = time * 0.0002

  controls.update()

  effect.render(scene, camera)
}

function createLights() {
  const light1 = new PointLight(0xFFFFFF, 3, 0, 0)
  light1.position.set(500, 500, 500)
  const light2 = new PointLight(0xFFFFFF, 1, 0, 0)
  light2.position.set(-500, -500, -500)

  scene.add(light1)
  scene.add(light2)
}

function createObject() {
  // Sphere
  const sphereGeometry = new SphereGeometry(200, 20, 10)
  const sphereMaterial = new MeshPhongMaterial({
    flatShading: true,
  })
  sphere = new Mesh(sphereGeometry, sphereMaterial)

  scene.add(sphere)

  // Plane
  const planeGeometry = new PlaneGeometry(400, 400)
  const planeMaterial = new MeshBasicMaterial({
    color: 0x0E0E0E0,
  })
  plane = new Mesh(planeGeometry, planeMaterial)
  plane.position.y = -200
  plane.rotation.x = -Math.PI / 2

  scene.add(plane)
}

function createEffect() {
  const { innerWidth: W, innerHeight: H } = window

  effect = new AsciiEffect(renderer, ' .:-+*=%@#', { invert: true })
  effect.setSize(W, H)
  effect.domElement.style.color = '#FFFFFF'
  effect.domElement.style.backgroundColor = '#000000'

  // Special case: append effect.domElement, instead of renderer.domElement.
  // AsciiEffect creates a custom domElement (a div container) where the ASCII elements are placed.

  document.body.appendChild(effect.domElement)

  controls = new TrackballControls(camera, effect.domElement)
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  if (width !== W || height !== H) {
    camera.aspect = W / H
    camera.updateProjectionMatrix()

    renderer.setSize(W, H)
    renderer.setPixelRatio(DPI)

    effect.setSize(W, H)
  }
}

function onDestroy() {
  try {
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

export default function main() {
  init()
  animate()
}
