import './style.css'
import {
  AmbientLight,
  BoxGeometry,
  Color,
  DirectionalLight,
  GridHelper,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Raycaster,
  Scene,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import grass from '@/textures/grass.png?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  stats: Stats,
  controls: OrbitControls

let plane: Mesh,
  rollOver: Mesh,
  voxelGeo: BoxGeometry,
  voxelMaterial: MeshLambertMaterial

const objects: Array<Mesh> = []

let pointer: Vector2
let raycaster: Raycaster
let isShiftLeftDown = false

init()
animate()

function init() {
  // Scene
  scene = new Scene()
  scene.background = new Color(0xF0F0F0)

  // Camera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 10000)
  camera.position.set(500, 800, 1000)
  camera.lookAt(0, 0, 0)

  // Lights
  const ambientLight = new AmbientLight(0x606060)
  scene.add(ambientLight)

  const directionalLight = new DirectionalLight(0xFFFFFF)
  directionalLight.position.set(1, 0.75, 0.5).normalize()
  scene.add(directionalLight)

  // Object
  addModel()
  addGround()

  // 光线投射用于进行鼠标拾取（在三维空间中计算出鼠标移过了什么物体）
  raycaster = new Raycaster()
  pointer = new Vector2()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.minDistance = 5
  controls.maxDistance = 2000

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Listener
  eventListener()
}

function addModel() {
  // roll-over helpers
  const rollOverGeo = new BoxGeometry(50, 50, 50)
  const rollOverMaterial = new MeshBasicMaterial({
    color: 0xFF0000,
    opacity: 0.5,
    transparent: true,
  })
  rollOver = new Mesh(rollOverGeo, rollOverMaterial)
  rollOver.position.set(25, 25, 25)
  scene.add(rollOver)

  // cubes
  voxelGeo = new BoxGeometry(50, 50, 50)
  voxelMaterial = new MeshLambertMaterial({
    map: new TextureLoader().load(grass),
  })
}

function addGround() {
  // Ground
  const geometry = new PlaneGeometry(1000, 1000)
  geometry.rotateX(-Math.PI / 2)
  const material = new MeshBasicMaterial({ visible: false })
  plane = new Mesh(geometry, material)
  scene.add(plane)

  objects.push(plane)

  // GridHelper
  const gridHelper = new GridHelper(1000, 20)
  scene.add(gridHelper)
}

function eventListener() {
  // Operate
  window.addEventListener('pointermove', onPointerMove)
  window.addEventListener('pointerdown', onPointerDown)
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)

  // Resize
  window.addEventListener('resize', onResize)
}

function getIntersect(event: PointerEvent) {
  // 将鼠标位置归一化为设备坐标。x 和 y 方向的取值范围是 (-1 to +1)
  pointer.set(
    (event.clientX / innerWidth) * 2 - 1,
    -(event.clientY / innerHeight) * 2 + 1,
  )

  // 通过摄像机和鼠标位置更新射线
  raycaster.setFromCamera(pointer, camera)

  // 计算物体和射线的焦点
  return raycaster.intersectObjects(objects, false)
}

function onPointerMove(event: PointerEvent) {
  const intersects = getIntersect(event)

  if (intersects.length > 0) {
    const intersect = intersects[0]

    // 更新指示器位置
    rollOver.position.copy(intersect.point).add(intersect!.face!.normal)
    rollOver.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
  }
}

function onPointerDown(event: PointerEvent) {
  const intersects = getIntersect(event)

  // 编辑地图
  if (intersects.length > 0) {
    const intersect = intersects[0]

    // delete voxel
    if (isShiftLeftDown) {
      if (intersect.object !== plane) {
        scene.remove(intersect.object)

        const index = objects.indexOf(intersect.object as Mesh)
        objects.splice(index, 1)
      }

      // create voxel
    }
    else {
      const voxel = new Mesh(voxelGeo, voxelMaterial)
      voxel.position.copy(intersect.point).add(intersect!.face!.normal)
      voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
      scene.add(voxel)

      objects.push(voxel)
    }
  }

  // 处理在不挪动鼠标的情况下，连续新增 voxel 时，指示器位置不更新问题
  onPointerMove(event)
}

function onKeyDown(event: KeyboardEvent) {
  switch (event.code) {
    case 'ShiftLeft':
      isShiftLeftDown = true
      break
  }
}

function onKeyUp(event: KeyboardEvent) {
  switch (event.code) {
    case 'ShiftLeft':
      isShiftLeftDown = false
      break
  }
}

function onResize() {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function animate() {
  requestAnimationFrame(animate)

  controls.update()
  stats.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}
