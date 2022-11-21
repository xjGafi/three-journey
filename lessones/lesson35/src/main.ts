import './style.css'
import {
  AxesHelper,
  Bone,
  CylinderGeometry,
  DoubleSide,
  Float32BufferAttribute,
  MeshPhongMaterial,
  PerspectiveCamera,
  PointLight,
  Scene,
  Skeleton,
  SkeletonHelper,
  SkinnedMesh,
  Uint16BufferAttribute,
  Vector3,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { Pane } from 'tweakpane'

/**
 * @params segmentHeight: 骨关节高度
 * @params segmentCount: 骨关节数量
 * @params height: 骨骼高度
 * @params halfHeight: 骨骼高度 / 2
 */
interface Sizing {
  segmentHeight: number
  segmentCount: number
  height: number
  halfHeight: number
}

let scene: Scene, camera: PerspectiveCamera, renderer: WebGLRenderer

let mesh: SkinnedMesh

const state = {
  animateBones: false,
}

init()
animate()

function init() {
  // Scene
  scene = new Scene()

  // Axes
  const axesHelper = new AxesHelper(200)
  scene.add(axesHelper)

  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 200)
  camera.position.z = 30
  camera.position.y = 30

  // Light
  const lights = []
  lights[0] = new PointLight(0xFFFFFF, 1, 0)
  lights[1] = new PointLight(0xFFFFFF, 1, 0)
  lights[2] = new PointLight(0xFFFFFF, 1, 0)

  lights[0].position.set(0, 200, 0)
  lights[1].position.set(100, 200, 100)
  lights[2].position.set(-100, -200, -100)

  scene.add(lights[0])
  scene.add(lights[1])
  scene.add(lights[2])

  // Object
  addBones()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Pane
  initPane()

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement)
  controls.enableZoom = false

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function addBones() {
  const segmentHeight = 8
  const segmentCount = 4
  const height = segmentHeight * segmentCount

  const sizing: Sizing = {
    segmentHeight,
    segmentCount,
    height,
    halfHeight: height / 2,
  }

  const geometry = createGeometry(sizing)
  const bones = createBones(sizing)
  mesh = createMesh(geometry, bones)

  mesh.scale.multiplyScalar(1)
  scene.add(mesh)
}

function createGeometry(sizing: Sizing) {
  // 创建一个八棱柱几何体，高度 sizing.height，顶点坐标 y 分量范围[-sizing.halfHeight, sizing.halfHeight]
  const geometry = new CylinderGeometry(
    5,
    5,
    sizing.height,
    8,
    sizing.segmentCount * 3,
    true,
  )

  // 实现一个模拟腿部骨骼运动的效果
  const { position } = geometry.attributes
  const vertex = new Vector3()

  const skinIndices = [] // 骨骼蒙皮索引属性
  const skinWeights = [] // 骨骼蒙皮权重属性

  for (let i = 0; i < position.count; i++) {
    vertex.fromBufferAttribute(position, i) // 第 i 个顶点

    const y = vertex.y + sizing.halfHeight

    const skinIndex = Math.floor(y / sizing.segmentHeight) // 设置每个顶点蒙皮索引属性
    const skinWeight = (y % sizing.segmentHeight) / sizing.segmentHeight // 设置每个顶点蒙皮权重属性

    skinIndices.push(skinIndex, skinIndex + 1, 0, 0)
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
  }

  const skinIndexAttribute = new Uint16BufferAttribute(skinIndices, 4)
  const skinWeightAttribute = new Float32BufferAttribute(skinWeights, 4)

  geometry.setAttribute('skinIndex', skinIndexAttribute)
  geometry.setAttribute('skinWeight', skinWeightAttribute)

  return geometry
}

function createBones(sizing: Sizing) {
  const bones = []

  let prevBone = new Bone() // 上一节骨关节
  bones.push(prevBone)
  prevBone.position.y = -sizing.halfHeight

  // 设置关节父子关系，多个骨头关节构成一个树结构
  for (let i = 0; i < sizing.segmentCount; i++) {
    const nextBone = new Bone()
    nextBone.position.y = sizing.segmentHeight
    bones.push(nextBone)
    prevBone.add(nextBone)
    prevBone = nextBone
  }

  return bones
}

function createMesh(
  geometry: CylinderGeometry,
  bones: Array<Bone>,
): SkinnedMesh {
  const material = new MeshPhongMaterial({
    color: 0x156289,
    emissive: 0x072534,
    side: DoubleSide,
    flatShading: true,
  })

  const mesh = new SkinnedMesh(geometry, material)
  // 创建骨骼系统
  // 所有 Bone 对象插入到 Skeleton 中，全部设置为 .bones 属性的元素
  const skeleton = new Skeleton(bones)

  // // 查看 .bones 属性中所有骨关节
  // console.log('🌈 skeleton.bones:', skeleton.bones);
  // // 返回所有关节的世界坐标
  // skeleton.bones.forEach((bone) => {
  //   console.log(bone.getWorldPosition(new Vector3()));
  // });

  mesh.add(bones[0])

  mesh.bind(skeleton)

  const skeletonHelper = new SkeletonHelper(mesh)
  scene.add(skeletonHelper)

  return mesh
}

function initPane() {
  const pane = new Pane()
  let folder = pane.addFolder({ title: 'General Options' })

  folder.addInput(state, 'animateBones', {
    label: 'Animate Bones',
  })

  folder
    .addButton({
      label: 'Mesh Attribute',
      title: 'reset',
    })
    .on('click', () => {
      state.animateBones = false
      mesh.pose()
      pane.refresh()
    })

  const bones = mesh.skeleton.bones

  for (let i = 0; i < bones.length; i++) {
    const bone = bones[i]

    folder = pane.addFolder({ title: `Bone ${i}` })

    folder.addInput(bone.position, 'x', {
      label: 'position.x',
      min: -10 + bone.position.x,
      max: 10 + bone.position.x,
    })
    folder.addInput(bone.position, 'y', {
      label: 'position.y',
      min: -10 + bone.position.y,
      max: 10 + bone.position.y,
    })
    folder.addInput(bone.position, 'z', {
      label: 'position.z',
      min: -10 + bone.position.z,
      max: 10 + bone.position.z,
    })

    folder.addInput(bone.rotation, 'x', {
      label: 'rotation.x',
      min: -Math.PI * 0.5,
      max: Math.PI * 0.5,
    })
    folder.addInput(bone.rotation, 'y', {
      label: 'rotation.y',
      min: -Math.PI * 0.5,
      max: Math.PI * 0.5,
    })
    folder.addInput(bone.rotation, 'z', {
      label: 'rotation.z',
      min: -Math.PI * 0.5,
      max: Math.PI * 0.5,
    })

    folder.addInput(bone.scale, 'x', {
      label: 'scale.x',
      min: 0,
      max: 2,
    })
    folder.addInput(bone.scale, 'y', {
      label: 'scale.y',
      min: 0,
      max: 2,
    })
    folder.addInput(bone.scale, 'z', {
      label: 'scale.z',
      min: 0,
      max: 2,
    })
  }
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight
  camera.updateProjectionMatrix()

  renderer.setSize(innerWidth, innerHeight)

  render()
}

function animate() {
  requestAnimationFrame(animate)

  const time = Date.now() * 0.001

  // 改变骨关节角度
  if (state.animateBones) {
    for (let i = 0; i < mesh.skeleton.bones.length; i++) {
      mesh.skeleton.bones[i].rotation.z
        = (Math.sin(time) * 2) / mesh.skeleton.bones.length
    }
  }

  render()
}

function render() {
  renderer.render(scene, camera)
}
