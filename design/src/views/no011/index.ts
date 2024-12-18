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

import meshVertexShader from './shader/vertex.glsl?raw'
import meshFragmentShader from './shader/fragment.glsl?raw'

class MousePosition {
  public value: number
  private a: number
  private readonly b: number
  private readonly c: number
  private readonly f: number
  private readonly g: number
  private readonly e: number

  constructor(b: number, c: number, f: number, g: number, h: number) {
    this.b = b
    this.c = c
    this.f = f
    this.g = g
    this.e = -Math.abs(h)
    this.value = b
    this.a = 0
  }

  update(d: number): number {
    this.a += (d - this.value) * this.f
    this.a *= this.g
    this.value += this.a

    if (this.value < this.b) {
      this.value = this.b
      if (this.a < 0)
        this.a *= this.e
    }
    else if (this.value > this.c) {
      this.value = this.c
      if (this.a > 0)
        this.a *= this.e
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
const mousePreviousInertiaPosition = {
  x: 0,
  y: 0,
}
const mouseInertiaPosition = {
  x: new MousePosition(0, 1, 0.2, 0.09, -0.1),
  y: new MousePosition(0, 1, 0.2, 0.09, -0.1),
}
let v2MouseInertiaPosition = new Vector2(
  mouseInertiaPosition.x.value,
  mouseInertiaPosition.y.value,
)
let mouseMovement = 0

let geometryCenterPiece: PlaneGeometry, materialCenterPiece: ShaderMaterial, meshCenterPiece: Mesh

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

  // Canera
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
  geometryCenterPiece = new PlaneGeometry(
    150,
    150,
    1,
    1,
  )
  materialCenterPiece = new ShaderMaterial({
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
        value: v2MouseInertiaPosition,
      },
      u_shapeSize: {
        value: new Vector2(150, 150),
      },
      u_mouseMovement: {
        value: mouseMovement,
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
    fragmentShader: meshFragmentShader,
    vertexShader: meshVertexShader,
    side: DoubleSide,
  })

  meshCenterPiece = new Mesh(
    geometryCenterPiece,
    materialCenterPiece,
  )
  meshCenterPiece.position.set(0, 0, 0)
  meshCenterPiece.scale.multiplyScalar(1)
  meshCenterPiece.rotation.x = 0.0
  meshCenterPiece.rotation.y = 0.0
  meshCenterPiece.rotation.z = 0.0
  scene.add(meshCenterPiece)
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
  materialCenterPiece.uniforms.u_time.value = dynamicTime

  mouseInertiaPosition.x.update(mousePosition.x)
  mouseInertiaPosition.y.update(mousePosition.y)
  v2MouseInertiaPosition = new Vector2(
    mouseInertiaPosition.x.value,
    mouseInertiaPosition.y.value,
  )
  mouseMovement
    = Math.abs(mouseInertiaPosition.x.value - mousePreviousInertiaPosition.x)
    + Math.abs(mouseInertiaPosition.y.value - mousePreviousInertiaPosition.y)
  if (mouseMovement < 0.0) {
    mouseMovement = 0
  }
  else {
    mouseMovement *= 5
  }
  mousePreviousInertiaPosition.x = mouseInertiaPosition.x.value
  mousePreviousInertiaPosition.y = mouseInertiaPosition.y.value
  materialCenterPiece.uniforms.u_mouseMovement.value = mouseMovement

  materialCenterPiece.uniforms.u_mousePosition.value = v2MouseInertiaPosition

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
