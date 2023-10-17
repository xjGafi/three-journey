import './style.css'
import {
  AxesHelper,
  DirectionalLight,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three'
import { VTKLoader } from 'three/examples/jsm/loaders/VTKLoader'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import vtkFile from '@/models/vtk/bunny.vtk?url'

const near = 0.1
const far = 20

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls,
  stats: Stats

init()
animate()

function init() {
  console.time('loading')

  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, near, far)
  camera.position.set(1, 1, 1)

  // Scene
  scene = new Scene()

  // Light
  const light = new DirectionalLight(0xFFFFFF)
  scene.add(light)

  // Axes
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)

  // Object
  const material = new MeshLambertMaterial({ color: 0xFFFFFF, side: DoubleSide })
  const loader = new VTKLoader()
  loader.load(vtkFile, (geometry) => {
    geometry.computeVertexNormals()
    console.log('🌈 geometry:', geometry)
    const mesh = new Mesh(geometry, material)
    scene.add(mesh)

    render()
    console.timeEnd('loading')
  })

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = near
  controls.maxDistance = far
  controls.enableDamping = true

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onResize)
}

function onResize() {
  const { innerWidth, innerHeight } = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()
  stats.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}
