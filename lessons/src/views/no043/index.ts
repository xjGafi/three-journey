import {
  AmbientLight,
  Audio,
  AudioListener,
  AudioLoader,
  AxesHelper,
  BoxGeometry,
  // CameraHelper,
  Clock,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three'
import type { Vector3 } from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import * as CANNON from 'cannon-es'
import { Pane } from 'tweakpane'

import hitURL from '@/sounds/hit.mp3?url'

interface Model {
  mesh: Mesh
  body: CANNON.Body
}

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls,
  stats: Stats

let world: CANNON.World

let sound: Audio

const objects: Array<Model> = []
const material = new MeshStandardMaterial({
  color: 0xFFFFFF,
  metalness: 0.3,
  roughness: 0.4,
})

const clock = new Clock()
let oldElapsedTime = 0

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 100)
  camera.position.set(0, 10, 10)

  // Scene
  scene = new Scene()

  // Sound
  initSound()

  // Physics
  initPhysics()

  // Floor
  createFloor()

  // Lights
  initLights()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  // 允许在场景中使用阴影贴图
  renderer.shadowMap.enabled = true

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 5
  controls.maxDistance = 50
  controls.update()

  // Axes
  const axesHelper = new AxesHelper(50)
  scene.add(axesHelper)

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // GUI
  initPane()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function initSound() {
  const listener = new AudioListener()
  camera.add(listener)
  sound = new Audio(listener)

  const audioLoader = new AudioLoader()
  audioLoader.load(hitURL, (buffer) => {
    sound.setBuffer(buffer)
  })
}

function playHitSound(collision: any) {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()

  if (impactStrength > 1.5) {
    sound.setVolume(Math.random())
    sound.offset = 0
    sound.play()
  }
}

function initPhysics() {
  world = new CANNON.World()
  world.broadphase = new CANNON.SAPBroadphase(world)
  world.allowSleep = true
  world.gravity.set(0, -9.82, 0)
  // Default material
  const defaultMaterial = new CANNON.Material('default')
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.1,
      restitution: 0.7,
    },
  )
  world.defaultContactMaterial = defaultContactMaterial
}

// Create Cube
function cubeGenerator(width: number, height: number, depth: number, x: number, y: number, z: number) {
  // Model
  const geometry = new BoxGeometry(width, height, depth)
  const mesh = new Mesh(geometry, material)
  mesh.castShadow = true
  mesh.position.set(x, y, z)
  scene.add(mesh)

  // Physic
  const halfSize = new CANNON.Vec3(width / 2, height / 2, depth / 2)
  const shape = new CANNON.Box(halfSize)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    shape,
    // material: defaultMaterial,
  })
  // 给模型添加一个初速度
  body.applyLocalForce(
    new CANNON.Vec3(500, 0, 0),
    new CANNON.Vec3(0, 0, 0),
  )
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  objects.push({ mesh, body })
}

// Create Shpere
function shpereGenerator(radius: number, x: number, y: number, z: number) {
  // Model
  const gemetry = new SphereGeometry(radius, 50, 50)
  const mesh = new Mesh(gemetry, material)
  mesh.castShadow = true
  mesh.position.set(x, y, z)
  scene.add(mesh)

  // Physic
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    shape,
    // material: defaultMaterial,
  })
  // 给模型添加一个初速度
  body.applyLocalForce(
    new CANNON.Vec3(500, 0, 0),
    new CANNON.Vec3(0, 0, 0),
  )
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  objects.push({ mesh, body })
}

function createFloor() {
  // Mesh
  const geometry = new PlaneGeometry(50, 50)
  const mesh = new Mesh(geometry, new MeshStandardMaterial({
    color: 0x777777,
    metalness: 0.3,
    roughness: 0.4,
  }))
  mesh.rotateX(-Math.PI / 2)
  mesh.receiveShadow = true
  scene.add(mesh)

  // Physic
  const shape = new CANNON.Plane()
  const body = new CANNON.Body({
    mass: 0,
    shape,
  })
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2)
  world.addBody(body)
}

function initLights() {
  const ambientLight = new AmbientLight(0xFFFFFF, 3)
  scene.add(ambientLight)

  const directionalLight = new DirectionalLight(0xFFFFFF)
  directionalLight.position.set(-10, 20, 10)
  scene.add(directionalLight)

  directionalLight.castShadow = true
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 30
  directionalLight.shadow.camera.left = -20
  directionalLight.shadow.camera.right = 20
  directionalLight.shadow.camera.top = 20
  directionalLight.shadow.camera.bottom = -20
  directionalLight.shadow.mapSize.set(1024, 1024)

  // 摄像机辅助对象
  // const cameraHelper = new CameraHelper(directionalLight.shadow.camera)
  // scene.add(cameraHelper)
}

function clearObjects() {
  sound.stop()

  for (const object of objects) {
    // Remove body
    object.body.removeEventListener('collide', playHitSound)
    world.removeBody(object.body)

    // Remove mesh
    scene.remove(object.mesh)
  }

  objects.splice(0, objects.length)
}

function initPane() {
  const pane = new Pane({ title: 'Physic' })
  pane.addButton({
    title: 'Add cube',
  }).on('click', () => cubeGenerator(
    Math.random() + 0.5,
    Math.random() + 0.5,
    Math.random() + 0.5,
    (Math.random() - 0.5) * 5,
    5,
    (Math.random() - 0.5) * 5,
  ))

  pane.addButton({
    title: 'Add shpere',
  }).on('click', () => shpereGenerator(
    Math.random(),
    (Math.random() - 0.5) * 5,
    5,
    (Math.random() - 0.5) * 5,
  ))

  pane.addButton({
    title: 'Clear',
  }).on('click', clearObjects)
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
    clearObjects()
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

  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  world.step(1 / 60, deltaTime, 3)

  for (const object of objects) {
    const position = object.body.position as unknown
    const quaternion = object.body.quaternion as unknown
    object.mesh.position.copy(position as Vector3)
    object.mesh.quaternion.copy(quaternion as CANNON.Quaternion)
  }

  controls.update()
  stats.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
