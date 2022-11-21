import './style.css'
import type { BufferGeometry } from 'three'
import {
  AmbientLight,
  AxesHelper,
  BoxGeometry,
  DoubleSide,
  ImageLoader,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SphereGeometry,
  Texture,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import url from '@/textures/avatar.jpeg?url'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

init()
render()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 300)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)

  // Light
  const ambient = new AmbientLight(0xFFFFFF)
  scene.add(ambient)

  // Object
  addPlane()
  addCube()
  addBall()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)
  controls.minDistance = 100
  controls.maxDistance = 800
  controls.update()

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function addPlane() {
  // 纹理贴图映射到一个矩形平面上
  const geometry = new PlaneGeometry(80, 80)
  textureLoader(geometry, -100)
  imageLoader(geometry, -100)
}

function addCube() {
  // 纹理贴图映射到一个立方体上
  const geometry = new BoxGeometry(80, 80, 80)
  textureLoader(geometry)
  imageLoader(geometry)
}

function addBall() {
  // 纹理贴图映射到一个球体上
  const geometry = new SphereGeometry(40, 25, 25)
  textureLoader(geometry, 100)
  imageLoader(geometry, 100)
}

function textureLoader(geometry: BufferGeometry, offsetX = 0) {
  // TextureLoader 创建一个纹理加载器对象，可以加载图片作为几何体纹理
  const textureLoader = new TextureLoader()
  // 执行 load 方法，加载纹理贴图成功后，返回一个纹理对象 Texture
  textureLoader.load(url, (texture) => {
    const material = new MeshLambertMaterial({
      color: 0xFF0000,
      map: texture, // 设置纹理贴图
      side: DoubleSide,
    })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(offsetX, 50, 0)
    scene.add(mesh)

    // 纹理贴图加载成功后，调用渲染函数执行渲染操作
    render()
  })
}

function imageLoader(geometry: BufferGeometry, offsetX = 0) {
  // ImageLoader 创建一个图片加载器对象，可以加载图片作为几何体纹理
  const imageLoader = new ImageLoader()
  // 执行 load 方法，加载图片成功后，返回一个 html 的元素 img 对象
  imageLoader.load(url, (image) => {
    // image 对象作为参数，创建一个纹理对象 Texture
    const texture = new Texture(image)
    // 下次使用纹理时触发更新
    texture.needsUpdate = true
    const material = new MeshLambertMaterial({
      color: 0x00FF00,
      map: texture, // 设置纹理贴图
      side: DoubleSide,
    })
    const mesh = new Mesh(geometry, material)
    mesh.position.set(offsetX, -50, 0)
    scene.add(mesh)

    // 纹理贴图加载成功后，调用渲染函数执行渲染操作
    render()
  })
}

function onWindowResize() {
  const { innerWidth, innerHeight } = window

  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function render() {
  renderer.render(scene, camera)
}
