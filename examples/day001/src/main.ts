import './style.css'
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

let ball: Mesh

let geometry: SphereGeometry
let material: MeshLambertMaterial

const noise = new SimplexNoise()

init()
animate()

function init() {
  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 200)

  // Scene
  scene = new Scene()

  // Lights
  createLight()

  // Object
  createBall()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function createLight() {
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

// https://codepen.io/tksiiii/pen/jwdvGG
function createBall() {
  geometry = new SphereGeometry(50, 100, 100)
  material = new MeshLambertMaterial({
    color: 0x87F9D9,
    // wireframe: true,
  })

  ball = new Mesh(geometry, material)
  ball.position.x = 0
  ball.castShadow = true

  scene.add(ball)
}

function makeRoughBall() {
  const positions = geometry.attributes.position.array as Array<number>
  const offset = geometry.parameters.radius
  for (let i = 0; i < positions.length; i += 3) {
    const vertex = new Vector3(positions[i], positions[i + 1], positions[i + 2])
    vertex.normalize()
    const time = Date.now()
    const amp = 5
    const distance = offset + noise.noise3D(
      vertex.x + time * 0.0007,
      vertex.y + time * 0.0008,
      vertex.z + time * 0.0009,
    ) * amp
    vertex.multiplyScalar(distance)
    positions[i] = vertex.x
    positions[i + 1] = vertex.y
    positions[i + 2] = vertex.z
  }
  geometry.attributes.position.needsUpdate = true
  geometry.computeVertexNormals()
}

function animate() {
  requestAnimationFrame(animate)

  makeRoughBall()
  ball.rotation.y += 0.02

  render()
}

function render() {
  renderer.render(scene, camera)
}
