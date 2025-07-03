import {
  Group,
  Mesh,
  MeshBasicMaterial,
  NearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  WebGLRenderer,
} from 'three'

import rain from '@/textures/rain.png?url'
import grass from '@/textures/grass.png?url'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let group: Group

const RANGE = 20

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 1, 100)
  camera.position.set(0, 5, -5)

  // Scene
  scene = new Scene()

  // Object
  group = new Group()
  scene.add(group)
  spriteGenerator(rain, 1000, 0.15)
  groundGenerator(50, grass, 20)

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

// 批量创建精灵模型
function spriteGenerator(url: string, count: number, size: number) {
  // 加载精灵纹理贴图
  const texture = new TextureLoader().load(url)
  // 创建精灵材质对象
  const material = new SpriteMaterial({
    map: texture, // 设置精灵纹理贴图
  })

  for (let i = 0; i < count; i++) {
    // 创建精灵模型对象，不需要几何体 geometry 参数
    const sprite = new Sprite(material)
    group.add(sprite)
    // 控制精灵大小,
    sprite.scale.set(size, size, 1)
    const x = (Math.random() - 0.5) * RANGE // 在 x 轴居中分布
    const y = Math.random() * RANGE // 在 y 轴上方分布
    const z = -Math.random() * RANGE // 在 z 轴后方分布
    // 设置精灵模型位置，在整个空间上上随机分布
    sprite.position.set(x, y, z)
  }
}

// 创建草地
function groundGenerator(size: number, url: string, repeat: number) {
  const geometry = new PlaneGeometry(size, size * 1.5)

  // 加载纹理贴图
  const texture = new TextureLoader().load(url)
  // 设置阵列
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  // uv 两个方向纹理重复数量
  texture.repeat.set(repeat, repeat)
  // 防止纹理贴图模糊
  texture.minFilter = NearestFilter
  texture.magFilter = NearestFilter
  const material = new MeshBasicMaterial({ map: texture })

  const ground = new Mesh(geometry, material)
  ground.rotation.x = -Math.PI / 2
  scene.add(ground)
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

  group.children.forEach((rain) => {
    // 雨滴的 y 坐标每次减 0.08
    rain.position.y -= 0.08
    if (rain.position.y < 0) {
      // 如果雨滴落到地面，重置 y，从新下落
      rain.position.y = RANGE
    }
  })
  // scene.rotation.y = elapsedTime / 2;

  render()
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
