import type {
  Object3D,
} from 'three'
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
} from 'three'

interface SketchOptions {
  scene?: Scene
  camera?: PerspectiveCamera
  canvas?: Element
  renderer?: WebGLRenderer
}

class Sketch {
  private readonly scene: Scene
  private readonly camera: PerspectiveCamera
  private readonly canvas: Element
  private readonly renderer: WebGLRenderer
  private readonly objects: Object3D[]
  private stopAnimation: boolean

  constructor(opts?: SketchOptions) {
    const currentPage = location.pathname.slice(1)
    const { innerWidth, innerHeight, devicePixelRatio } = window

    this.scene = opts?.scene ?? new Scene()

    this.camera = opts?.camera
    ?? new PerspectiveCamera(75, innerWidth / innerHeight, 0.1, 1000)
    this.camera.position.set(0, 0, 3)

    this.canvas = opts?.canvas ?? document.querySelector(`canvas#webgl_${currentPage}`)!
    this.renderer = opts?.renderer ?? new WebGLRenderer({ canvas: this.canvas })
    this.renderer.physicallyCorrectLights = true
    this.renderer.outputEncoding = sRGBEncoding
    this.renderer.setSize(innerWidth, innerHeight)
    this.renderer.setPixelRatio(devicePixelRatio)

    this.objects = []
    this.stopAnimation = false

    this.resize = this.resize.bind(this)
    this.render = this.render.bind(this)
    this.animate = this.animate.bind(this)
    this.play = this.play.bind(this)
    this.stop = this.stop.bind(this)
  }

  resize(): void {
    const { width, height } = this.renderer.domElement
    const { innerWidth, innerHeight, devicePixelRatio } = window
    if (width !== innerWidth || height !== innerHeight) {
      this.camera.aspect = innerWidth / innerHeight
      this.camera.updateProjectionMatrix()

      this.renderer.setSize(innerWidth, innerHeight)
      this.renderer.setPixelRatio(devicePixelRatio)
    }
  }

  add(object: Object3D): void {
    this.objects.push(object)
    this.scene.add(object)
  }

  render(): void {
    this.resize()
    this.renderer.render(this.scene, this.camera)
  }

  animate(): void {
    this.render()

    this.objects.forEach((obj) => {
      obj.rotation.x += 0.01
      obj.rotation.y += 0.01
    })
  }

  play(): void {
    this.stopAnimation ? this.render() : this.animate()

    window.requestAnimationFrame(this.play)
  }

  stop(): void {
    this.stopAnimation = true
  }
}

export default Sketch
