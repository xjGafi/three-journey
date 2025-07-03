import {
  BufferAttribute,
  BufferGeometry,
  Clock,
  Color,
  ConeGeometry,
  DirectionalLight,
  Group,
  Mesh,
  MeshToonMaterial,
  NearestFilter,
  PerspectiveCamera,
  Points,
  PointsMaterial,
  Scene,
  TextureLoader,
  TorusGeometry,
  TorusKnotGeometry,
  WebGLRenderer,
} from 'three'

import gsap from 'gsap'

import gradientUrl from '@/textures/gradients/5.jpg?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer

let animateId: number

const cameraBox = new Group()

const textureLoader = new TextureLoader()
const gradientTexture = textureLoader.load(gradientUrl)
gradientTexture.magFilter = NearestFilter

const meshMaterial = new MeshToonMaterial()
const particlesMaterial = new PointsMaterial()
const objectsDistance = 4
let meshes: Array<Mesh> = []

let scrollY = window.scrollY
let currentPage = 0
const cursor = {
  x: 0,
  y: 0,
}

const clock = new Clock()
let previousTime = 0

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()

  // Camera
  camera = new PerspectiveCamera(35, innerWidth / innerHeight, 0.1, 100)
  camera.position.z = 6
  cameraBox.add(camera)
  scene.add(cameraBox)

  // Lights
  const directionalLight = new DirectionalLight(0xFFFFFF, 3)
  directionalLight.position.set(1, 1, 0)
  scene.add(directionalLight)

  // Pages
  addPages()

  // Object
  addMeshes()
  addParticles()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Scroll
  window.addEventListener('scroll', onScroll, false)

  // Mouse
  window.addEventListener('mousemove', onMouseMove, false)

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addPages() {
  const template = document.createElement('section')
  template.setAttribute('style', `
    display: flex;
    flex-direction: column;
    z-index: 50;
  `)
  template.innerHTML = `<section class="page">
    <h1>My Portfolio</h1>
  </section>
  <section class="page">
    <h2>My projects</h2>
  </section>
  <section class="page">
    <h2>Contact me</h2>
  </section>`
  document.body.appendChild(template)
}

function addMeshes() {
  // Material
  meshMaterial.gradientMap = gradientTexture

  // Mesh
  const mesh1 = new Mesh(
    new TorusGeometry(1, 0.4, 16, 60),
    meshMaterial,
  )
  const mesh2 = new Mesh(
    new ConeGeometry(1, 2, 32),
    meshMaterial,
  )
  const mesh3 = new Mesh(
    new TorusKnotGeometry(0.8, 0.35, 100, 16),
    meshMaterial,
  )

  mesh1.position.x = 2
  mesh2.position.x = -2
  mesh3.position.x = 2

  mesh1.position.y = -objectsDistance * 0
  mesh2.position.y = -objectsDistance * 1
  mesh3.position.y = -objectsDistance * 2

  meshes = [mesh1, mesh2, mesh3]

  scene.add(...meshes)
}

function addParticles() {
  // Geometry
  const count = 2000
  const positions = new Float32Array(count * 3)

  for (let i = 0; i < count; i++) {
    const i3 = i * 3
    positions[i3 + 0] = (Math.random() - 0.5) * 10
    positions[i3 + 1] = objectsDistance * 0.5 - Math.random() * objectsDistance * meshes.length
    positions[i3 + 2] = (Math.random() - 0.5) * 10
  }

  const particlesGeometry = new BufferGeometry()
  particlesGeometry.setAttribute('position', new BufferAttribute(positions, 3))

  // Material
  particlesMaterial.sizeAttenuation = true
  particlesMaterial.size = 0.03

  // Points
  const particles = new Points(particlesGeometry, particlesMaterial)
  scene.add(particles)
}

function onScroll() {
  scrollY = window.scrollY
  const newPage = Math.round(scrollY / window.innerHeight)

  if (newPage !== currentPage) {
    currentPage = newPage
    const mesh = meshes[currentPage]
    const timeline = gsap.timeline()
    timeline
      .to(
        mesh.scale,
        {
          ease: 'power2.inOut',
          x: '+=0.2',
          y: '+=0.2',
          z: '+=0.2',
        },
      )
      .to(
        mesh.rotation,
        {
          duration: 2,
          ease: 'power2.inOut',
          x: '+=6',
          y: '+=3',
          z: '+=1.5',
        },
      )
      .to(
        mesh.scale,
        {
          ease: 'power2.inOut',
          x: '-=0.2',
          y: '-=0.2',
          z: '-=0.2',
        },
      )
  }
}

function onMouseMove(event: MouseEvent) {
  cursor.x = event.clientX / innerWidth - 0.5
  cursor.y = event.clientY / innerHeight - 0.5
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
    window.removeEventListener('scroll', onScroll, false)
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

function animate() {
  animateId = window.requestAnimationFrame(animate)

  /**
   * Color
   */
  const body = document.body
  const progress = scrollY / (body.offsetHeight - window.innerHeight)
  const getColor = (offset: number, scale = 1) => new Color(Math.abs(progress - offset) * scale, Math.abs(1 - offset) * scale, Math.abs(1 - progress - offset) * scale)

  // font
  const color = getColor(0, 255)
  body.style.setProperty('--font-color', `rgb(${color.r},${color.g},${color.b})`)

  // meshes
  meshMaterial.color = getColor(0.1)

  // particles
  particlesMaterial.color = getColor(0.1)

  // sence
  scene.background = getColor(0.2)

  /**
   * Animate
   */
  const elapsedTime = clock.getElapsedTime()
  const deltaTime = elapsedTime - previousTime
  previousTime = elapsedTime

  // camera
  camera.position.y = -scrollY / window.innerHeight * objectsDistance
  const parallaxX = cursor.x * 0.5
  const parallaxY = -cursor.y * 0.5
  cameraBox.position.x += (parallaxX - cameraBox.position.x) * 5 * deltaTime
  cameraBox.position.y += (parallaxY - cameraBox.position.y) * 5 * deltaTime

  // meshes
  for (const mesh of meshes) {
    mesh.rotation.x += deltaTime * 0.1
    mesh.rotation.y += deltaTime * 0.12
  }

  render()
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
