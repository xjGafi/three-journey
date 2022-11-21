import './style.css'
import {
  AmbientLight,
  AxesHelper,
  CanvasTexture,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  VideoTexture,
  WebGLRenderer,
  sRGBEncoding,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import url from '@/textures/sintel.mp4?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 500)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(300)
  scene.add(axesHelper)

  // Light
  const ambient = new AmbientLight(0xFFFFFF)
  scene.add(ambient)

  // Object
  addCanvasTexture()
  addVideoTexture()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  renderer.outputEncoding = sRGBEncoding

  // Stats
  stats = Stats()
  document.body.appendChild(stats.dom)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 100
  controls.maxDistance = 800
  controls.update()

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function addCanvasTexture() {
  // 创建一个平面
  const geometry = new PlaneGeometry(300, 300)

  // 创建一个 canvas 对象，并绘制一些纹理
  const dpr = window.devicePixelRatio
  const size = {
    width: 100,
    height: 100,
  }
  const canvas = document.createElement('canvas')
  canvas.width = dpr * size.width
  canvas.height = dpr * size.height
  const ctx = canvas.getContext('2d')!
  ctx.scale(dpr, dpr)
  ctx.fillStyle = '#f00'
  ctx.fillRect(0, 0, size.width, size.height)
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.fillText('Three.js', size.width / 2, size.height / 2)
  // canvas 画布对象作为 CanvasTexture 的参数重建一个纹理对象
  const texture = new CanvasTexture(canvas)
  // 设置阵列
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  // uv 两个方向纹理重复数量
  // 等价 texture.repeat = new Vector2(5, 5)
  texture.repeat.set(5, 5)

  const material = new MeshLambertMaterial({
    map: texture, // 设置纹理贴图
    side: DoubleSide,
  })

  const mesh = new Mesh(geometry, material)
  mesh.position.x = -150
  scene.add(mesh)
}

function addVideoTexture() {
  // 创建一个平面
  const geometry = new PlaneGeometry(300, 300)

  // 创建 video 对象
  const video = document.createElement('video')
  video.src = url
  video.autoplay = true
  video.loop = true

  // video 对象作为 VideoTexture 参数创建纹理对象
  const texture = new VideoTexture(video)
  // 设置阵列
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  // uv 两个方向纹理重复数量
  // 等价 texture.repeat = new Vector2(3, 3)
  texture.repeat.set(3, 3)

  const material = new MeshLambertMaterial({
    map: texture, // 设置纹理贴图
    side: DoubleSide,
  })

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 150
  scene.add(mesh)
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function animate() {
  requestAnimationFrame(animate)

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}
