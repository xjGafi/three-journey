import type { Texture } from 'three'
import {
  AmbientLight,
  AxesHelper,
  DoubleSide,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import url from '@/textures/avatar.jpeg?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let texture: Texture

let time = 0

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 10000)
  camera.position.set(0, 0, 500)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(300)
  scene.add(axesHelper)

  // Light
  const ambient = new AmbientLight(0xFFFFFF, 3)
  scene.add(ambient)

  // Object
  // 创建一个平面
  const geometry = new PlaneGeometry(1000, 1000)

  // 加载纹理贴图
  texture = new TextureLoader().load(url)
  // 设置阵列
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  // uv 两个方向纹理重复数量
  // 等价 texture.repeat = new Vector2(10, 10)
  texture.repeat.set(10, 10)

  const material = new MeshLambertMaterial({
    map: texture, // 设置纹理贴图
    side: DoubleSide,
  })

  const mesh = new Mesh(geometry, material)
  scene.add(mesh)

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 1500
  controls.maxDistance = 5000
  controls.update()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
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

  // 设置纹理偏移和旋转
  texture.offset.x -= 0.05
  texture.rotation = Math.sin((time += 0.016))

  render()
  stats.update()
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
