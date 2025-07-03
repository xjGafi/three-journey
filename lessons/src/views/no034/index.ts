import {
  Audio,
  AudioAnalyser,
  AudioListener,
  AudioLoader,
  AxesHelper,
  BoxGeometry,
  Clock,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  // PositionalAudio,
  Scene,
  Sprite,
  SpriteMaterial,
  TextureLoader,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import steelBall from '@/textures/sprite.png?url'
import backgroundMusic from '@/sounds/376737_Skullbeatz___Bad_Cat_Maste.mp3?url'

// import ballMusic from '@/sounds/Project_Utopia.mp3?url'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let ball: Sprite

let sound: Audio

let group: Group, analyser: AudioAnalyser

const clock = new Clock()

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(50, innerWidth / innerHeight, 1, 500)
  camera.position.z = 10

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(300)
  scene.add(axesHelper)

  // Object
  addBall()
  // addAudio();
  // addPositionalAudio();
  addAudioVisualizer()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 1
  controls.maxDistance = 500
  controls.update()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addBall() {
  const texture = new TextureLoader().load(steelBall)
  const material = new SpriteMaterial({ map: texture })
  ball = new Sprite(material)
  scene.add(ball)
}

// // 非位置音频，可用于不考虑位置的背景音乐
// function addAudio() {
//   // 创建一个监听者
//   const listener = new AudioListener()
//   // 监听者绑定到相机对象
//   camera.add(listener)

//   // 创建一个非位置音频对象，用来控制播放
//   const mainAudio = new Audio(listener)

//   // 创建一个音频加载器对象
//   const audioLoader = new AudioLoader()
//   // 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
//   audioLoader.load(backgroundMusic, (buffer) => {
//     // AudioBuffer 音频缓冲区对象关联到音频对象 mainAudio
//     mainAudio.setBuffer(buffer)
//     mainAudio.setLoop(true) // 循环
//     mainAudio.setVolume(0.1) // 音量

//     // 播放缓冲区中的音频数据
//     mainAudio.play() // play 播放、stop 停止、pause 暂停
//   })
// }

// function addPositionalAudio() {
//   // 创建一个监听者
//   const listener = new AudioListener()

//   // 创建一个位置音频对象，监听者作为参数，音频和监听者关联。
//   const ballAudio = new PositionalAudio(listener)
//   // 音源绑定到一个网格模型上
//   ball.add(ballAudio)

//   // 创建一个音频加载器对象
//   const audioLoader = new AudioLoader()
//   // 加载音频文件，返回一个音频缓冲区对象作为回调函数参数
//   audioLoader.load(ballMusic, (buffer) => {
//     // AudioBuffer 音频缓冲区对象关联到音频对象 ballAudio
//     ballAudio.setBuffer(buffer)
//     ballAudio.setLoop(true) // 循环
//     ballAudio.setVolume(0.9) // 音量
//     ballAudio.setRefDistance(200) // 参数值越大,声音越大

//     // 播放缓冲区中的音频数据
//     ballAudio.play() // play 播放、stop 停止、pause 暂停
//   })
// }

function addAudioVisualizer() {
  /**
   * 创建多个网格模型组成的组对象
   */
  group = new Group()
  const COUNT = 128 // 控制音频分析器返回频率数据数量

  for (let i = 0; i < COUNT / 2; i++) {
    const box = new BoxGeometry(1, 10, 10) // 创建一个立方体几何对象
    const material = new MeshBasicMaterial({
      color: 0x00FF00,
    }) // 材质对象
    const mesh = new Mesh(box, material) // 网格模型对象
    // 长方体间隔 2，整体居中
    mesh.position.set(2 * i - (COUNT / 2) * 1, 0, 0)
    group.add(mesh)
  }
  scene.add(group)

  const listener = new AudioListener() // 创建一个监听者
  camera.add(listener) // 监听者绑定到相机对象
  sound = new Audio(listener) // 非位置音频对象
  const audioLoader = new AudioLoader() // 音频加载器
  // 加载音频文件
  audioLoader.load(backgroundMusic, (buffer) => {
    sound.setBuffer(buffer) // 音频缓冲区对象关联到音频对象 sound
    sound.setLoop(true) // 循环
    sound.setVolume(0.5) // 音量
    sound.play() // 播放

    // 音频分析器和音频绑定，可以实时采集音频时域数据进行快速傅里叶变换
    analyser = new AudioAnalyser(sound, 2 * COUNT)
    // console.log('🌈 analyser:', analyser.getFrequencyData());
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
    sound.stop()
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

  const elapsedTime = clock.getElapsedTime()

  ball.position.set(5 * Math.sin(elapsedTime), 0, 10 * Math.cos(elapsedTime))

  if (analyser) {
    // 获得频率数据N个
    const arr = analyser.getFrequencyData()
    // console.log('🌈 arr:', arr);
    // 遍历组对象，每个网格子对象设置一个对应的频率数据
    group.children.forEach((elem, index) => {
      elem.scale.y = arr[index] / 8;
      ((elem as Mesh).material as MeshBasicMaterial).color.r = arr[index] / 200
    })
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
