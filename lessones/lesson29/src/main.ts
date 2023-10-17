import './style.css'
import {
  Clock,
  PerspectiveCamera,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import steelBall from '@/textures/sprite.png?url'
import redBall from '@/textures/sprite0.png?url'
import yellowBall from '@/textures/sprite1.png?url'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

const clock = new Clock()

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(50, innerWidth / innerHeight, 1, 50)
  camera.position.z = 10

  // Scene
  scene = new Scene()

  // Object
  spriteGenerator(steelBall, 100, 0.2)
  spriteGenerator(redBall, 100, 0.2)
  spriteGenerator(yellowBall, 100, 0.2)

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 1
  controls.maxDistance = 20
  controls.update()

  // Resize
  window.addEventListener('resize', onWindowResize)
}

// 批量创建精灵模型
function spriteGenerator(url: string, count: number, size: number) {
  // 加载精灵纹理贴图
  const texture = new TextureLoader().load(url)

  for (let i = 0; i < count; i++) {
    // 创建精灵材质对象 SpriteMaterial
    const material = new SpriteMaterial({
      map: texture, // 设置精灵纹理贴图
    })
    // 创建精灵模型对象，不需要几何体 geometry 参数
    const sprite = new Sprite(material)
    scene.add(sprite)
    // 控制精灵大小,
    sprite.scale.set(size, size, 1)
    const x = (Math.random() - 0.5) * 10
    const y = (Math.random() - 0.5) * 10
    const z = (Math.random() - 0.5) * 10
    // 设置精灵模型位置，在 xoz 平面上随机分布
    sprite.position.set(x, y, z)
  }
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

  const elapsedTime = clock.getElapsedTime()
  scene.rotation.y = elapsedTime / 2

  render()
}

function render() {
  renderer.render(scene, camera)
}
