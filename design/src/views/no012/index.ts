import {
  Clock,
  Color,
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

class M {
  public value: number
  public s: boolean
  private readonly min: number
  private readonly max: number
  private readonly springForce: number
  private readonly damping: number
  private readonly bounceForce: number
  private velocity: number

  constructor(b: number, c: number, f: number, g: number, h: number) {
    this.min = b
    this.max = c
    this.springForce = f
    this.damping = g
    this.bounceForce = -Math.abs(h)
    this.value = b
    this.s = true
    this.velocity = 0
  }

  update(d: number): number {
    this.velocity += (d - this.value) * this.springForce
    this.velocity *= this.damping
    this.value += this.velocity
    if (this.value < this.min) {
      this.value = this.min
      if (this.velocity < 0)
        this.velocity *= this.bounceForce
    }
    else if (this.value > this.max) {
      this.value = this.max
      if (this.velocity > 0)
        this.velocity *= this.bounceForce
    }
    this.s = Math.abs(this.velocity) < 0.001 * (this.max - this.min) && Math.abs(this.value - d) < 0.1
    return this.value
  }

  setValue(d: number): number {
    this.velocity = 0
    this.s = true
    this.value = Math.min(this.max, Math.max(this.min, d))
    return this.value
  }
}

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let mesh: Mesh

let animateId: number

const cursor = {
  x: 0.5,
  y: 0.5,
}

const clock = new Clock()
let deltaTime = 0
let timeOffset = 0

const mouseInertiaPosition = {
  x: new M(0, 1, 0.2, 0.14, -0.1),
  y: new M(0, 1, 0.2, 0.14, -0.1),
}

let v2MouseInertiaPosition = new Vector2(
  mouseInertiaPosition.x.value,
  mouseInertiaPosition.y.value,
)

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Camera
  camera = new PerspectiveCamera(45, W / H, 1, 500)
  camera.position.z = 150

  // Object
  meshGenerator()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  })
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)
  renderer.setClearColor(new Color('rgb(25,25,25)'))

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

function meshGenerator() {
  const geometry = new PlaneGeometry(80, 80, 1, 1)
  const material = new ShaderMaterial({
    uniforms: {
      u_color1: {
        value: new Vector3(249, 94, 60),
      },
      u_color2: {
        value: new Vector3(213, 14, 101),
      },
      u_time: { value: 0 },
      u_timeOffset: { value: 1.7 },
      u_mousePosition: {
        value: v2MouseInertiaPosition,
      },
    },
    fragmentShader,
    vertexShader,
    side: DoubleSide,
    transparent: true,
  })
  mesh = new Mesh(geometry, material)
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
}

function onMouseMove(event: MouseEvent) {
  const { innerWidth: W, innerHeight: H } = window

  cursor.x = event.clientX / W
  cursor.y = event.clientY / H
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
  const x = ((cursor.x - 0.5) * 50 - camera.position.x) / 20
  const y = ((cursor.y - 0.5) * 40 - camera.position.y) / 20

  deltaTime += clock.getDelta() / 2
  timeOffset += (Math.abs(x) + Math.abs(y)) / 20
  const time = deltaTime + timeOffset;

  (mesh.material as ShaderMaterial).uniforms.u_time.value = time

  mouseInertiaPosition.x.update(cursor.x)
  mouseInertiaPosition.y.update(cursor.y)

  v2MouseInertiaPosition = new Vector2(
    mouseInertiaPosition.x.value,
    mouseInertiaPosition.y.value,
  );

  (mesh.material as ShaderMaterial).uniforms.u_mousePosition.value
    = v2MouseInertiaPosition

  camera.position.x += x
  camera.position.y += y
  camera.position.z += x + y
  camera.lookAt(scene.position)
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
