import type {
  BufferAttribute,
} from 'three'
import {
  AmbientLight,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import SimplexNoise from 'simplex-noise'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let animateId: number

let ball: Mesh
const radius = 50

const noise = new SimplexNoise()

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, W / H, 1, 1000)
  camera.position.set(0, 0, 200)

  // Lights
  createLights()

  // Object
  createBall()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)

  // Listener
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function animate() {
  animateId = window.requestAnimationFrame(animate)

  makeRoughBall()

  render()
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
    // wireframe: true,
  })

  ball = new Mesh(geometry, material)
  ball.position.x = 0
  ball.castShadow = true

  scene.add(ball)
}

function makeRoughBall() {
  const positions = (ball.geometry.attributes.position as BufferAttribute).array as Array<number>
  for (let i = 0; i < positions.length; i += 3) {
    const vertex = new Vector3(positions[i], positions[i + 1], positions[i + 2])
    vertex.normalize()
    const time = Date.now()
    const amp = 5
    const distance = radius + noise.noise3D(
      vertex.x + time * 0.0007,
      vertex.y + time * 0.0008,
      vertex.z + time * 0.0009,
    ) * amp
    vertex.multiplyScalar(distance)
    positions[i] = vertex.x
    positions[i + 1] = vertex.y
    positions[i + 2] = vertex.z
  }
  ball.geometry.attributes.position.needsUpdate = true
  ball.geometry.computeVertexNormals()
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
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
