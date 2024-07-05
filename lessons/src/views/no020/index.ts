import {
  AxesHelper,
  CatmullRomCurve3,
  DoubleSide,
  ExtrudeGeometry,
  Mesh,
  MeshBasicMaterial,
  Path,
  PerspectiveCamera,
  Scene,
  Shape,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

const DEPTH = 1

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 100)
  camera.position.set(0, 0, 20)

  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(100)
  scene.add(axesHelper)

  // Object
  addCurveByShape()
  addCubeByExtrudeGeometry()
  addBoxByExtrudeGeometry()
  addArcByExtrudeGeometry()
  addCapsuleByExtrudeGeometry()
  addFaceByExtrudeGeometry()
  addFace2ByExtrudeGeometry()
  addFace3ByExtrudeGeometry()
  addSquareByExtrudeGeometry()
  addSquare2ByExtrudeGeometry()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.addEventListener('change', render)
  controls.minDistance = 1
  controls.maxDistance = 80
  controls.update()

  // Resize
  window.addEventListener('resize', onResize, false)
  window.addEventListener('destroy', onDestroy, false)
}

function addCurveByShape() {
  const UNIT = 2

  const positions = [
    new Vector2(-UNIT, UNIT),
    new Vector2(UNIT, UNIT),
    new Vector2(UNIT, -UNIT),
    new Vector2(-UNIT, -UNIT),
  ]
  const shape = new Shape()
  shape.splineThru(positions) // 顶点带入样条插值计算函数
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0xFF0000 })

  const mesh = new Mesh(geometry, material)
  scene.add(mesh)
}

function addCubeByExtrudeGeometry() {
  const UNIT = 2

  const positions = [
    new Vector2(-UNIT, UNIT),
    new Vector2(UNIT, UNIT),
    new Vector2(UNIT, -UNIT),
    new Vector2(-UNIT, -UNIT),
  ]
  // 通过顶点定义轮廓
  const shape = new Shape(positions)
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0x00FF00 })

  const mesh = new Mesh(geometry, material)
  mesh.position.z = -2
  scene.add(mesh)
}

function addBoxByExtrudeGeometry() {
  const UNIT = 2

  // 通过 shpae 基类 path 的方法绘制轮廓（本质也是生成顶点）
  const shape = new Shape()
  // 四条直线绘制一个矩形轮廓
  shape.moveTo(-UNIT, UNIT) // 第 1 点(起点)
  shape.lineTo(UNIT, UNIT) // 第 2 点
  shape.lineTo(UNIT, -UNIT) // 第 3 点
  shape.lineTo(-UNIT, -UNIT) // 第 4 点
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0x00FF00 })

  const mesh = new Mesh(geometry, material)
  mesh.position.z = -4
  scene.add(mesh)
}

function addArcByExtrudeGeometry() {
  // 通过 shpae 基类 path 的方法绘制轮廓（本质也是生成顶点）
  const shape = new Shape()
  shape.absarc(0, 0, 2, 0, 2 * Math.PI, false) // 圆弧轮廓
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0x0000FF })

  const mesh = new Mesh(geometry, material)
  mesh.position.z = -6
  scene.add(mesh)
}

function addCapsuleByExtrudeGeometry() {
  const R = 1

  const shape = new Shape()
  shape.absarc(0, 0, R, 0, Math.PI, false)
  // shape.lineTo(-R, -2);
  shape.absarc(0, -2, R, Math.PI, 2 * Math.PI, false)
  // shape.lineTo(R, 0);
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0xFFFF00, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 4
  mesh.position.y = 1
  scene.add(mesh)
}

function addFaceByExtrudeGeometry() {
  const R = 2

  // 外轮廓（脸）
  const shape = new Shape()
  shape.arc(0, 0, R, 0, 2 * Math.PI, false)

  // 内轮廓（嘴巴）
  const path1 = new Path()
  path1.arc(0, -R / 2, R / 4, 0, 2 * Math.PI, false)
  // 内轮廓（鼻子）
  const path2 = new Path()
  path2.arc(0, -R / 12, R / 20, 0, 2 * Math.PI, false)
  // 内轮廓（左眼）
  const path3 = new Path()
  path3.arc(R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 内轮廓（右眼）
  const path4 = new Path()
  path4.arc(-R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 内轮廓分别插入到 holes 属性中
  shape.holes.push(path1, path2, path3, path4)
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0x00FFFF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 8
  scene.add(mesh)
}

function addFace2ByExtrudeGeometry() {
  const R = 2

  // 内轮廓（嘴巴）
  const shape1 = new Shape()
  shape1.arc(0, -R / 2, R / 4, 0, 2 * Math.PI, false)
  // 内轮廓（鼻子）
  const shape2 = new Shape()
  shape2.arc(0, -R / 12, R / 20, 0, 2 * Math.PI, false)
  // 内轮廓（左眼）
  const shape3 = new Shape()
  shape3.arc(R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 内轮廓（右眼）
  const shape4 = new Shape()
  shape4.arc(-R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    [shape1, shape2, shape3, shape4], // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0x00FFFF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 8
  mesh.position.y = 4
  scene.add(mesh)
}

function addFace3ByExtrudeGeometry() {
  const R = 2

  // 内轮廓（嘴巴）
  const shape1 = new Shape()
  shape1.arc(0, -R / 2, R / 4, 0, 2 * Math.PI, false)
  // 内轮廓（鼻子）
  const shape2 = new Shape()
  shape2.arc(0, -R / 12, R / 20, 0, 2 * Math.PI, false)
  // 内轮廓（左眼）
  const shape3 = new Shape()
  shape3.arc(R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)
  // 内轮廓（右眼）
  const shape4 = new Shape()
  shape4.arc(-R / 2, R / 4, R / 8, 0, 2 * Math.PI, false)

  // 创建轮廓的扫描轨迹(3D样条曲线)
  const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(3, 3, -3),
    new Vector3(0, 6, -6),
    new Vector3(-3, 9, -9),
  ])

  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    [shape1, shape2, shape3, shape4], // 二维轮廓
    {
      steps: 50, // 扫描方向细分数
      extrudePath: curve, // 选择扫描轨迹
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0x00FFFF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = 8
  mesh.position.y = 4
  mesh.position.z = -5
  scene.add(mesh)
}

function addSquareByExtrudeGeometry() {
  const UNIT = 1

  const shape = new Shape()
  shape.moveTo(-UNIT, UNIT)
  shape.lineTo(UNIT, UNIT)
  shape.lineTo(UNIT, -UNIT)
  shape.lineTo(-UNIT, -UNIT)

  const path = new Path()
  path.moveTo(-UNIT / 2, UNIT / 2)
  path.lineTo(UNIT / 2, UNIT / 2)
  path.lineTo(UNIT / 2, -UNIT / 2)
  path.lineTo(-UNIT / 2, -UNIT / 2)

  shape.holes.push(path)
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      depth: DEPTH, // 拉伸长度
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0xFF00FF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = -5
  scene.add(mesh)
}

function addSquare2ByExtrudeGeometry() {
  const UNIT = 1

  const shape = new Shape()
  shape.moveTo(-UNIT, UNIT)
  shape.lineTo(UNIT, UNIT)
  shape.lineTo(UNIT, -UNIT)
  shape.lineTo(-UNIT, -UNIT)

  const path = new Path()
  path.moveTo(-UNIT / 2, UNIT / 2)
  path.lineTo(UNIT / 2, UNIT / 2)
  path.lineTo(UNIT / 2, -UNIT / 2)
  path.lineTo(-UNIT / 2, -UNIT / 2)

  // 创建轮廓的扫描轨迹(3D样条曲线)
  const curve = new CatmullRomCurve3([
    new Vector3(0, 0, 0),
    new Vector3(-3, 3, 3),
    new Vector3(-6, 6, 0),
    new Vector3(-9, 9, -3),
  ])

  shape.holes.push(path)
  // 拉伸造型
  const geometry = new ExtrudeGeometry(
    shape, // 二维轮廓
    {
      steps: 50, // 扫描方向细分数
      extrudePath: curve, // 选择扫描轨迹
      bevelEnabled: false, // 无倒角
    },
  )

  const material = new MeshBasicMaterial({ color: 0xFF00FF, side: DoubleSide })
  // material.wireframe = true;

  const mesh = new Mesh(geometry, material)
  mesh.position.x = -5
  mesh.position.z = -5
  scene.add(mesh)
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

  render()
}

function onDestroy() {
  try {
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

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  render()
}
