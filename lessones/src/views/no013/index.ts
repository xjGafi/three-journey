import {
  AxesHelper,
  BoxGeometry,
  CameraHelper,
  DirectionalLight,
  Mesh,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  SpotLight,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let mesh: Mesh

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 500)
  camera.lookAt(0, 0, 0)

  // Scene
  scene = new Scene()

  // Object
  addCube()
  addPanel()

  // Light
  addDirectionalLightHelper()
  addSpotLight()

  // Axes
  const axesHelper = new AxesHelper(500)
  scene.add(axesHelper)

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  // 允许在场景中使用阴影贴图
  renderer.shadowMap.enabled = true

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.minDistance = 50
  controls.maxDistance = 800
  controls.update()

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addCube() {
  const geometry = new BoxGeometry(100, 100, 100)
  const material = new MeshLambertMaterial({
    color: 0xFFFFFF,
  })
  mesh = new Mesh(geometry, material)
  // 设置产生投影的网格模型
  mesh.castShadow = true

  scene.add(mesh)
}

function addPanel() {
  // 创建一个平面几何体作为投影面
  const planeGeometry = new PlaneGeometry(500, 500)
  const planeMaterial = new MeshLambertMaterial({
    color: 0xFFFFFF,
  })
  // 平面网格模型作为投影面
  const planeMesh = new Mesh(planeGeometry, planeMaterial)
  planeMesh.rotateX(-Math.PI / 2)
  planeMesh.position.y = -80
  scene.add(planeMesh)

  // 设置接收阴影的投影面
  planeMesh.receiveShadow = true
}

function addDirectionalLightHelper() {
  // 平行光光源对象
  const directionalLight = new DirectionalLight(0xFFFF00, 1)
  // 设置平行光光源位置（同聚光光源）
  directionalLight.position.set(-100, 100, -100)
  scene.add(directionalLight)

  // 设置用于计算阴影的光源对象
  directionalLight.castShadow = true
  // 设置计算阴影的区域，最好刚好紧密包围在对象周围
  // 计算阴影的区域过大：模糊  过小：看不到或显示不完整
  directionalLight.shadow.camera.near = 0.5
  directionalLight.shadow.camera.far = 500
  directionalLight.shadow.camera.left = -100
  directionalLight.shadow.camera.right = 100
  directionalLight.shadow.camera.top = 100
  directionalLight.shadow.camera.bottom = -100
  // 设置 mapSize 属性可以使阴影更清晰，不那么模糊
  directionalLight.shadow.mapSize.set(1024, 1024)

  // 摄像机辅助对象
  const cameraHelper = new CameraHelper(directionalLight.shadow.camera)
  scene.add(cameraHelper)
}

function addSpotLight() {
  // 聚光光源对象
  const spotLight = new SpotLight(0xFF00FF)
  // 设置聚光光源位置
  spotLight.position.set(100, 200, 100)
  scene.add(spotLight)

  // 设置聚光光源发散角度
  spotLight.angle = Math.PI / 6
  // 设置用于计算阴影的光源对象
  spotLight.castShadow = true
  // 设置计算阴影的区域，注意包裹对象的周围
  spotLight.shadow.camera.near = 1
  spotLight.shadow.camera.far = 500
  spotLight.shadow.camera.fov = 20
  spotLight.shadow.mapSize.set(1024, 1024)

  // 摄像机辅助对象
  const cameraHelper = new CameraHelper(spotLight.shadow.camera)
  scene.add(cameraHelper)
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
