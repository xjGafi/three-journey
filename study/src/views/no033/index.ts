import type {
  AnimationAction,
  AnimationClip,
  Texture,
} from 'three'
import {
  AnimationMixer,
  Clock,
  Color,
  DirectionalLight,
  Fog,
  HemisphereLight,
  Mesh,
  MeshLambertMaterial,
  NearestFilter,
  PerspectiveCamera,
  PlaneGeometry,
  RepeatWrapping,
  Scene,
  SkinnedMesh,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import Stats from 'three/examples/jsm/libs/stats.module'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Pane } from 'tweakpane'

import SimpleSkinning from '@/models/SimpleSkinning.gltf?url'
import grass from '@/textures/grass.png?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let texture: Texture

let mixer: AnimationMixer, clip: AnimationClip, action: AnimationAction

const clock = new Clock()

let textureOffsetY = 0

interface Params {
  paused: boolean // 暂停
  time: number // 开始播放时间
  timeScale: number // 播放速度
  [key: string]: unknown
}
// GUI 设置项
const PARAMS: Params = {
  paused: false,
  time: 0,
  timeScale: 0.5,
}

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(18, 6, 18)

  // Scene
  scene = new Scene()
  scene.background = new Color(0xFFFFFF)
  scene.fog = new Fog(0xFFFFFF, 70, 100)

  // Light
  const hemiLight = new HemisphereLight(0xFFFFFF, 0x444444, 0.6)
  hemiLight.position.set(0, 200, 0)
  scene.add(hemiLight)

  const dirLight = new DirectionalLight(0xFFFFFF, 0.8)
  dirLight.position.set(0, 20, 10)
  dirLight.castShadow = true
  dirLight.shadow.camera.top = 18
  dirLight.shadow.camera.bottom = -10
  dirLight.shadow.camera.left = -12
  dirLight.shadow.camera.right = 12
  scene.add(dirLight)

  // Object
  addGround()
  addKeyframeAnimation()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  renderer.shadowMap.enabled = true

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Pane
  initPane()

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 5
  controls.maxDistance = 50
  controls.update()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addGround() {
  const geometry = new PlaneGeometry(500, 500)

  // 加载纹理贴图
  texture = new TextureLoader().load(grass)
  // 设置阵列
  texture.wrapS = RepeatWrapping
  texture.wrapT = RepeatWrapping
  // uv 两个方向纹理重复数量
  texture.repeat.set(50, 50)
  // 防止纹理贴图模糊
  texture.minFilter = NearestFilter
  texture.magFilter = NearestFilter

  const material = new MeshLambertMaterial({
    map: texture, // 设置纹理贴图
  })

  const ground = new Mesh(geometry, material)
  ground.position.set(0, -5, 0)
  ground.rotation.x = -Math.PI / 2
  ground.receiveShadow = true
  scene.add(ground)
}

function addKeyframeAnimation() {
  // 3D Model
  const loader = new GLTFLoader()
  loader.load(SimpleSkinning, (gltf) => {
    // console.log('🌈 gltf:', gltf);
    scene.add(gltf.scene)

    // 设置阴影
    gltf.scene.traverse((child) => {
      if (child instanceof SkinnedMesh && child.isSkinnedMesh)
        child.castShadow = true
    })

    // gltf.scene 作为混合器的参数，可以播放 gltf.scene 包含的帧动画数据
    mixer = new AnimationMixer(gltf.scene)
    // gltf.animations[0]：获得剪辑 clip 对象
    // 剪辑 clip 作为参数，通过混合器 clipAction 方法返回一个操作对象 AnimationAction
    clip = gltf.animations[0]
    action = mixer.clipAction(clip)
    action.timeScale = PARAMS.timeScale
    // action.loop = LoopOnce;
    // action.clampWhenFinished = true;
    action.play()
  })
}

function initPane() {
  const pane = new Pane({ title: 'Animation' })
  // 修改播放状态
  pane.addBinding(PARAMS, 'paused').on('change', ({ value }) => {
    action.paused = value
  })
  // 修改播放时间（需要将动画设置为不循环 LoopOnce）
  pane
    .addBinding(PARAMS, 'time', {
      step: 0.001,
      min: 0,
      max: 0.5,
    })
    .on('change', ({ value }) => {
      action.time = value
      clip.duration = action.time
      action.play()
    })
  // 修改播放速度
  pane
    .addBinding(PARAMS, 'timeScale', {
      step: 0.1,
      min: 0,
      max: 3,
    })
    .on('change', ({ value }) => {
      action.timeScale = value
    })
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
  if (typeof mixer !== 'undefined') {
    // 获得两帧的时间间隔
    const getDelta = clock.getDelta()

    // 地板贴图后移，产生模型向前走的效果
    if (!action.paused)
      textureOffsetY -= getDelta * 2 * PARAMS.timeScale

    texture.offset.y = textureOffsetY

    // 更新混合器相关的时间
    mixer.update(getDelta)
  }

  stats.update()
  render()
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
