import {
  AxesHelper,
  Color,
  CylinderGeometry,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats

let animateId: number

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 1000)
  camera.position.set(0, 0, 500)
  camera.lookAt(0, 0, 0)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(500)
  scene.add(axesHelper)

  // Object
  addPerson()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

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

function addPerson(): void {
  // 头部网格模型和组
  const headMesh = sphereMesh(10, '#ff0000', 0, 0, 0)
  headMesh.name = '脑壳'
  const leftEyeMesh = sphereMesh(1, '#00ff00', 8, 5, 4)
  leftEyeMesh.name = '左眼'
  const rightEyeMesh = sphereMesh(1, '#0000ff', 8, 5, -4)
  rightEyeMesh.name = '右眼'
  const headGroup = new Group()
  headGroup.name = '头部'
  headGroup.add(headMesh, leftEyeMesh, rightEyeMesh)

  // 身体网格模型和组
  const neckMesh = cylinderMesh(3, 10, '#ffff00', 0, -10, 0)
  neckMesh.name = '脖子'
  const bodyMesh = cylinderMesh(14, 40, '#ff00ff', 0, -35, 0)
  bodyMesh.name = '腹部'
  const leftLegMesh = cylinderMesh(4, 60, '#00ffff', 0, -80, -7)
  leftLegMesh.name = '左腿'
  const rightLegMesh = cylinderMesh(4, 60, '#ffffff', 0, -80, 7)
  rightLegMesh.name = '右腿'
  const legGroup = new Group()
  legGroup.name = '腿'
  legGroup.add(leftLegMesh, rightLegMesh)
  const bodyGroup = new Group()
  bodyGroup.name = '身体'
  bodyGroup.add(neckMesh, bodyMesh, legGroup)

  // 人网格模型和组
  const personGroup = new Group()
  personGroup.name = '人'
  personGroup.add(headGroup, bodyGroup)
  personGroup.translateY(110)
  scene.add(personGroup)

  // 递归遍历
  scene.traverse((obj) => {
    if (obj.name === '左眼' || obj.name === '右眼')
      (<any>obj).material.color.set(0x000000)
  })

  // 遍历查找 scene 中复合条件的子对象，并返回 id 对应的对象
  const idNode = scene.getObjectById(1)
  console.log('getObjectById(1)', idNode)

  // 遍历查找对象的子对象，返回 name 对应的对象（name 是可以重名的，返回第一个）
  const nameNode = scene.getObjectByName('右腿');
  (<any>nameNode).material.color.set(0xFF0000)

  // position 属性获得本地坐标
  console.log('本地坐标', headGroup.position)
  // getWorldPosition() 方法获得世界坐标
  // 该语句默认在 threejs 渲染的过程中执行，如果渲染之前想获得世界矩阵属性、世界位置属性等属性，需要通过代码更新
  scene.updateMatrixWorld(true)
  const worldPosition = new Vector3()
  headGroup.getWorldPosition(worldPosition)
  console.log('世界坐标', worldPosition)

  // matrix 属性获得本地矩阵
  console.log('本地矩阵', headGroup.matrix)
  // matrixWorld 属性获得世界矩阵
  console.log('世界矩阵', headGroup.matrixWorld)
}

// 球体网格模型创建函数
function sphereMesh(
  radius: number,
  color: string,
  x: number,
  y: number,
  z: number,
): Mesh {
  const geometry = new SphereGeometry(radius, 25, 25)
  const material = new MeshBasicMaterial({
    color: new Color(color),
  })
  const mesh = new Mesh(geometry, material)
  mesh.position.set(x, y, z)
  return mesh
}

// 圆柱体网格模型创建函数
function cylinderMesh(
  radius: number,
  height: number,
  color: string,
  x: number,
  y: number,
  z: number,
): Mesh {
  const geometry = new CylinderGeometry(radius, radius, height, 25, 25)
  const material = new MeshBasicMaterial({
    color: new Color(color),
  })
  const mesh = new Mesh(geometry, material)
  mesh.position.set(x, y, z)
  return mesh
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
