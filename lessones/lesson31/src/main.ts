import './style.css'
import {
  AnimationClip,
  AnimationMixer,
  AxesHelper,
  BoxGeometry,
  Clock,
  Group,
  KeyframeTrack,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  SphereGeometry,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let group: Group, cube: Mesh, sphere: Mesh

let mixer: AnimationMixer

const clock = new Clock()

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(50, innerWidth / innerHeight, 1, 50)
  camera.position.set(10, 10, 10)

  // Scene
  scene = new Scene()

  // PointLight
  const pointLight = new PointLight(0xFFFFFF, 1.5)
  pointLight.position.set(40, 20, 30)
  scene.add(pointLight)

  // Axes
  const axes = new AxesHelper(50)
  scene.add(axes)

  // Group
  group = new Group()
  scene.add(group)

  // Object
  sphereGenerator()
  cubeGenerator()
  addKeyframeAnimation()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 5
  controls.maxDistance = 40
  controls.update()

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function sphereGenerator() {
  const geometry = new SphereGeometry(2, 50, 50)
  const material = new MeshLambertMaterial({ color: 0xFF0000 })
  sphere = new Mesh(geometry, material)
  sphere.name = 'Sphere'
  group.add(sphere)
}

function cubeGenerator() {
  const geometry = new BoxGeometry(2, 2, 2)
  const material = new MeshLambertMaterial({ color: 0x00FF00 })
  cube = new Mesh(geometry, material)
  cube.name = 'Cube'
  cube.position.x = 6
  group.add(cube)
}

function addKeyframeAnimation() {
  // * 编辑关键帧
  // 创建名为 Cube 对象的关键帧数据：0 时刻对应颜色(0, 1, 0)，5 时刻对应颜色(0, 0, 1)，10 时刻对应颜色(0, 1, 0)
  const cubeColor = {
    name: 'Cube.material.color', // 改变 Cube 位置
    times: [0, 5, 10], // 关键帧时间数组，离散的时间点序列
    values: [0, 1, 0, 0, 0, 1, 0, 1, 0], // 与时间点对应的值组成的数组
  }
  // 创建位置关键帧对象
  const cubeColorTrack = new KeyframeTrack(
    cubeColor.name,
    cubeColor.times,
    cubeColor.values,
  )

  // 创建名为 Sphere 对象的关键帧数据：从 0~5 时间段，尺寸 scale 缩放 2 倍，从 5~10 时间段，尺寸 scale 缩放 1 倍
  const sphereScale = {
    name: 'Sphere.scale', // 改变 Sphere 尺寸
    times: [0, 5, 10], // 关键帧时间数组，离散的时间点序列
    values: [1, 1, 1, 2, 2, 2, 1, 1, 1], // 与时间点对应的值组成的数组
  }
  const sphereScaleTrack = new KeyframeTrack(
    sphereScale.name,
    sphereScale.times,
    sphereScale.values,
  )

  // duration 决定了默认的播放时间，一般取所有帧动画的最大时间
  // duration 偏小，帧动画数据无法播放完，偏大，播放完帧动画会继续空播放
  const duration = 10
  // 多个帧动画作为元素创建一个剪辑 clip 对象，命名 "firstTry"，持续时间 10 时刻
  const clip = new AnimationClip('firstTry', duration, [
    cubeColorTrack,
    sphereScaleTrack,
  ])

  // * 播放关键帧
  // group 作为混合器的参数，可以播放 group 中所有子对象的帧动画
  mixer = new AnimationMixer(group)
  // 剪辑 clip 作为参数，通过混合器 clipAction 方法返回一个操作对象 AnimationAction
  const controller = mixer.clipAction(clip)
  controller.timeScale = 5 // 默认 1，调节播放速度
  // controller.loop = LoopOnce; // 不循环播放
  controller.play() // 开始播放
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

  // 获得两帧的时间间隔
  const getDelta = clock.getDelta()
  // 更新混合器相关的时间
  mixer.update(getDelta)

  render()
}

function render() {
  renderer.render(scene, camera)
}
