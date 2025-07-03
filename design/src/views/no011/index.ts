import {
  DoubleSide,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector2,
  Vector3,
  WebGLRenderer,
} from 'three'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'

/**
 * 实现弹簧阻尼系统的数值平滑处理器
 * 可用于创建具有物理特性的平滑过渡动画
 */
class SpringValue {
  /** 当前值 */
  public value: number
  /** 当前运动速度 */
  private velocity: number
  /** 最小边界值 */
  private readonly minValue: number
  /** 最大边界值 */
  private readonly maxValue: number
  /** 弹簧力度：决定对输入变化的响应程度 */
  private readonly springForce: number
  /** 阻尼系数：用于减缓运动（值越小，阻尼越大） */
  private readonly damping: number
  /** 碰撞反弹系数：决定在边界处反弹的强度 */
  private readonly bounceForce: number

  /**
   * @param minValue 最小边界值
   * @param maxValue 最大边界值
   * @param springForce 弹簧力度（建议值：0.1-0.4）
   * @param damping 阻尼系数（建议值：0.05-0.95）
   * @param bounceForce 反弹系数（正值，内部会转换为负值）
   */
  constructor(
    minValue: number,
    maxValue: number,
    springForce: number,
    damping: number,
    bounceForce: number,
  ) {
    this.minValue = minValue
    this.maxValue = maxValue
    this.springForce = springForce
    this.damping = damping
    this.bounceForce = -Math.abs(bounceForce)
    this.value = minValue
    this.velocity = 0
  }

  /**
   * 更新当前值，实现平滑过渡效果
   * @param targetValue 目标值
   * @returns 更新后的当前值
   */
  update(targetValue: number): number {
    // 计算弹簧力
    this.velocity += (targetValue - this.value) * this.springForce
    // 应用阻尼
    this.velocity *= this.damping
    // 更新位置
    this.value += this.velocity

    // 处理边界碰撞
    if (this.value < this.minValue) {
      this.value = this.minValue
      if (this.velocity < 0)
        this.velocity *= this.bounceForce
    }
    else if (this.value > this.maxValue) {
      this.value = this.maxValue
      if (this.velocity > 0)
        this.velocity *= this.bounceForce
    }

    return this.value
  }
}

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let animateId: number

const mousePosition = {
  x: 0.5,
  y: 0.5,
}
const previousInertiaPosition = {
  x: 0,
  y: 0,
}
const mouseSpring = {
  x: new SpringValue(0, 1, 0.2, 0.09, -0.1),
  y: new SpringValue(0, 1, 0.2, 0.09, -0.1),
}
let currentMouseSpringPosition = new Vector2(
  mouseSpring.x.value,
  mouseSpring.y.value,
)
let mouseMovementAmount = 0

let geometryPiece: PlaneGeometry, materialPiece: ShaderMaterial, meshPiece: Mesh

let camX = 0
let camY = 0

const start = Date.now()
let fixedTime = 0
let timeOffset = 0
let dynamicTime = 0

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Camera
  camera = new PerspectiveCamera(45, W / H, 1, 500)
  camera.position.set(0, 0, 150)

  // Object
  createObject()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  })
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)
  renderer.setClearColor(0x000000)

  // Listener
  window.addEventListener('resize', onResize, false)
  window.addEventListener('mousemove', onMouseMove, false)
  window.addEventListener('destroy', onDestroy, false)
}

function animate() {
  animateId = window.requestAnimationFrame(animate)

  updateView()

  render()
}

function createObject() {
  geometryPiece = new PlaneGeometry(
    150,
    150,
    1,
    1,
  )
  materialPiece = new ShaderMaterial({
    uniforms: {
      u_color1: {
        value: new Vector3(112, 165, 222),
      },
      u_color2: {
        value: new Vector3(221, 0, 241),
      },
      u_color3: {
        value: new Vector3(66, 235, 213),
      },
      u_color4: {
        value: new Vector3(221, 0, 241),
      },
      u_shapePosition: {
        value: new Vector3(0, 0, 0),
      },
      u_mousePosition: {
        value: currentMouseSpringPosition,
      },
      u_shapeSize: {
        value: new Vector2(150, 150),
      },
      u_mouseMovement: {
        value: mouseMovementAmount,
      },
      u_time: {
        value: 0,
      },
      u_timeOffset: {
        value: 8.4,
      },
      u_animation: {
        value: 0,
      },
    },
    fragmentShader,
    vertexShader,
    side: DoubleSide,
  })

  meshPiece = new Mesh(
    geometryPiece,
    materialPiece,
  )
  meshPiece.position.set(0, 0, 0)
  meshPiece.scale.multiplyScalar(1)
  meshPiece.rotation.x = 0.0
  meshPiece.rotation.y = 0.0
  meshPiece.rotation.z = 0.0
  scene.add(meshPiece)
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

function onMouseMove(event: MouseEvent) {
  const { innerWidth: W, innerHeight: H } = window

  mousePosition.x = event.clientX / W
  mousePosition.y = event.clientY / H
}

function onDestroy() {
  try {
    window.cancelAnimationFrame(animateId)
    window.removeEventListener('destroy', onDestroy, false)
    window.removeEventListener('resize', onResize, false)
    window.removeEventListener('mousemove', onMouseMove, false)
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

function updateView() {
  camX = ((mousePosition.x - 0.5) * 50 - camera.position.x) * 0.05
  camY = ((mousePosition.y - 0.5) * 10 - camera.position.y) * 0.05

  fixedTime = 0.0001 * (Date.now() - start)

  timeOffset += (Math.abs(camX) + Math.abs(camY)) / 20
  dynamicTime = fixedTime + timeOffset
  materialPiece.uniforms.u_time.value = dynamicTime

  mouseSpring.x.update(mousePosition.x)
  mouseSpring.y.update(mousePosition.y)
  currentMouseSpringPosition = new Vector2(
    mouseSpring.x.value,
    mouseSpring.y.value,
  )

  mouseMovementAmount = Math.abs(mouseSpring.x.value - previousInertiaPosition.x)
  + Math.abs(mouseSpring.y.value - previousInertiaPosition.y)

  if (mouseMovementAmount < 0.0) {
    mouseMovementAmount = 0
  }
  else {
    mouseMovementAmount *= 5
  }

  previousInertiaPosition.x = mouseSpring.x.value
  previousInertiaPosition.y = mouseSpring.y.value

  materialPiece.uniforms.u_mouseMovement.value = mouseMovementAmount
  materialPiece.uniforms.u_mousePosition.value = currentMouseSpringPosition

  camera.position.x += camX
  camera.position.y += camY
  camera.position.z += camY
  camera.lookAt(scene.position)
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
