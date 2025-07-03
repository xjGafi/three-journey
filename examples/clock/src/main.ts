import './style.css'
import {
  Color,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  WebGLRenderer,
} from 'three'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let mesh: Mesh

let currentTime = '00:00:00'

init()
animate()

function init() {
  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 10)
  camera.position.set(0, 0, 3)

  // Scene
  scene = new Scene()

  // Object
  const geometry = new PlaneGeometry(innerWidth, innerHeight)
  const material = new MeshBasicMaterial()
  mesh = new Mesh(geometry, material)
  scene.add(mesh)

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

function animate() {
  requestAnimationFrame(animate)

  updateTime()

  render()
}

function updateTime() {
  const time = new Date().toString().split(' ')[4]

  if (currentTime !== time) {
    const text = document.querySelector('h1#clock')!
    text.innerHTML = time

    const [r, g, b] = time.split(':')
      .map((value: string, index: number) => {
        const total = index === 0 ? 24 : 60
        return Number(value) / total
      });

    (mesh.material as MeshBasicMaterial).color = new Color(r, g, b)
  }

  currentTime = time
}

function render() {
  renderer.render(scene, camera)
}
