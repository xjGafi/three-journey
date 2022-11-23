import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import * as CANNON from 'cannon-es'
import { Pane } from 'tweakpane'

import hitURL from '@/sounds/hit.mp3?url'

interface Model {
  mesh: THREE.Mesh
  body: CANNON.Body
}

/**
 * Common
 */
const { innerWidth, innerHeight, devicePixelRatio } = window
const near = 1
const far = 50

/**
 * Scene
 */
const scene = new THREE.Scene()

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, innerWidth / innerHeight, near, 2 * far)
camera.position.set(0, 10, 10)

/**
 * Sounds
 */
const hitSound = new Audio(hitURL)

function playHitSound(collision: any) {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal()

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random()
    hitSound.currentTime = 0
    hitSound.play()
  }
}

/**
 * Physics
 */
const world = new CANNON.World()
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

/**
 * Objects
 */
const objects: Array<Model> = []
const material = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  metalness: 0.3,
  roughness: 0.4,
})

// Create Cube
function cubeGenerator(width: number, height: number, depth: number, x: number, y: number, z: number) {
  // Model
  const geometry = new THREE.BoxGeometry(width, height, depth)
  const mesh = new THREE.Mesh(geometry, material)
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
    material: defaultMaterial,
  })
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  objects.push({ mesh, body })
}

// Create Shpere
function shpereGenerator(radius: number, x: number, y: number, z: number) {
  // Model
  const gemetry = new THREE.SphereGeometry(radius, 50, 50)
  const mesh = new THREE.Mesh(gemetry, material)
  mesh.castShadow = true
  mesh.position.set(x, y, z)
  scene.add(mesh)

  // Physic
  const shape = new CANNON.Sphere(radius)
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    shape,
    material: defaultMaterial,
  })
  body.addEventListener('collide', playHitSound)
  world.addBody(body)

  objects.push({ mesh, body })
}

// Create floor
// Mesh
const geometry = new THREE.PlaneGeometry(far, far)
const mesh = new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
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

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.7)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.2)
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

// // 摄像机辅助对象
// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera)
// scene.add(cameraHelper)

/**
 * Renderer
 */
const canvas = document.querySelector('canvas#webgl')!
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
// 允许在场景中使用阴影贴图
renderer.shadowMap.enabled = true

/**
 * Utils
 */
// Controls
const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
controls.minDistance = near
controls.maxDistance = far

// Axes
const axesHelper = new THREE.AxesHelper(far)
scene.add(axesHelper)

// Stats
const stats = Stats()
document.body.appendChild(stats.dom)

/**
 * Animate
 */
const clock = new THREE.Clock()
let oldElapsedTime = 0
function animate() {
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - oldElapsedTime
  oldElapsedTime = elapsedTime

  world.step(1 / 60, deltaTime, 3)

  for (const object of objects) {
    const position = object.body.position as unknown
    const quaternion = object.body.quaternion as unknown
    object.mesh.position.copy(position as THREE.Vector3)
    object.mesh.quaternion.copy(quaternion as THREE.Quaternion)
  }

  controls.update()
  stats.update()

  renderer.render(scene, camera)

  window.requestAnimationFrame(animate)
}
animate()

/**
 * Pane
 */
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
  }).on('click', () => {
    for (const object of objects) {
      // Remove body
      object.body.removeEventListener('collide', playHitSound)
      world.removeBody(object.body)

      // Remove mesh
      scene.remove(object.mesh)
    }

    objects.splice(0, objects.length)
  })
}
initPane()

/**
 * Resize
 */
function onResize() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
}
window.addEventListener('resize', onResize)
