import type {
  IUniform,
} from 'three'
import {
  CanvasTexture,
  ClampToEdgeWrapping,
  // Clock,
  Color,
  Group,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three'

import { words } from './static'

import vertexShaderCenterPiece from './shader/vertexShaderCenterPiece.glsl?raw'
import fragmentShaderCenterPiece from './shader/fragmentShaderCenterPiece.glsl?raw'
import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'
import circleShader from '@/shaders/circle.glsl?raw'
import snoiseShader from '@/shaders/snoise.glsl?raw'
import image from '@/textures/Einstein.jpg?url'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let geometryCenterPiece: PlaneGeometry, materialCenterPiece: ShaderMaterial, meshCenterPiece: Mesh

const textureLoader = new TextureLoader()

let animateId: number

const cursor = {
  x: 0.5,
  y: 0.5,
}

const start = Date.now()
let fixedTime = 0
let timeOffset = 0
let dynamicTime = 0

const renderUpdates = {
  rotate: [],
  fbo: [],
  dynamicTime: [],
}

function init() {
  const { innerWidth: W, innerHeight: H, devicePixelRatio: DPI } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, W / H, 1, 500)
  camera.position.z = 150

  // Object
  createMesh()
  createWords()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.setSize(W, H)
  renderer.setPixelRatio(DPI)
  renderer.setClearColor(0xFF79B4)

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

function createMesh() {
  const imageTextureWidth = 1240
  const imageTextureHeight = 710

  geometryCenterPiece = new PlaneGeometry(
    imageTextureWidth * 0.1,
    imageTextureHeight * 0.1,
  )
  materialCenterPiece = new ShaderMaterial(
    {
      uniforms: {
        uTexture: {
          value: textureLoader.load(
            image,
            (texture) => {
              texture.generateMipmaps = false
              texture.wrapS = ClampToEdgeWrapping
              texture.wrapT = ClampToEdgeWrapping
              texture.minFilter = LinearFilter
            },
          ),
        },
        uTextureDimensions: {
          value: new Vector2(
            imageTextureWidth,
            imageTextureHeight,
          ),
        },
        uTime: { value: 0 },
        uColorHigh: {
          value: new Color(0x2B6CEF),

        },
        uColorLow: {
          value: new Color(0xFF79B4),
        },
      },
      fragmentShader: fragmentShaderCenterPiece,
      vertexShader: vertexShaderCenterPiece,
    },
  )
  // 替代 ShaderChunk.xxx = xxxxxx
  materialCenterPiece.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <g_snoise>',
        snoiseShader,
      ).replace(
        '#include <g_circle>',
        circleShader,
      )
  }

  meshCenterPiece = new Mesh(
    geometryCenterPiece,
    materialCenterPiece,
  )
  meshCenterPiece.position.set(0, -5, 0)
  meshCenterPiece.scale.multiplyScalar(2.6)
  scene.add(meshCenterPiece)
}

const wordTextureStore: Record<string, HTMLCanvasElement> = {}

function generateWordTexture(options: {
  word: string
  size?: number
  fontFamily?: string
  weight?: number
}) {
  const {
    word,
    size = 80, // 默认字体大小为 80
    fontFamily = 'serif', // 默认字体为 serif
    weight = 700, // 默认字体粗细为 700
  } = options

  if (!wordTextureStore[word]) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d', { alpha: false })!
    const font
      = `${weight} ${size * 2}px '${fontFamily}'`
    context.font = font
    const wordWidth = Math.max(
      size * 1.4,
      context.measureText(word).width,
    )

    canvas.width = wordWidth + 20
    canvas.height = wordWidth + 20

    context.fillStyle = '#000'
    context.fillRect(0, 0, wordWidth, wordWidth)

    context.fillStyle = '#fff'
    context.font = font
    context.textAlign = 'center'
    context.textBaseline = 'middle'
    context.fillText(
      word,
      canvas.width / 2,
      canvas.height / 2,
    )

    wordTextureStore[word] = canvas
  }

  return wordTextureStore[word]
}

function createWords() {
  const wordsGroup = new Group()

  words.forEach((item) => {
    const { word, widthScalar, heightScalar, color, position: { x, y, z }, multiplyScalar } = item
    const wordTexture = new CanvasTexture(
      generateWordTexture({ word }),
    )
    wordTexture.generateMipmaps = false
    wordTexture.wrapS = wordTexture.wrapT
      = ClampToEdgeWrapping
    wordTexture.minFilter = LinearFilter

    const geometry = new PlaneGeometry(
      wordTexture.image.width * widthScalar,
      wordTexture.image.height * heightScalar,
    )

    const material = new ShaderMaterial({
      uniforms: {
        uTexture: { value: wordTexture },
        uColor: {
          value: new Color(color),
        },
      },
      fragmentShader,
      vertexShader,
      transparent: true,
    })

    const mesh = new Mesh(geometry, material)
    mesh.position.set(x, y, z)
    mesh.scale.multiplyScalar(multiplyScalar)

    wordsGroup.add(mesh)
  })

  scene.add(wordsGroup)
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
  const x = ((cursor.x - 0.5) * 44 - camera.position.x) / 20
  const y = ((cursor.y - 0.5) * 20 - camera.position.y) / 20

  fixedTime = 0.0001 * (Date.now() - start)
  timeOffset
    += (Math.abs(x) + Math.abs(y)) / 5
  dynamicTime = fixedTime + timeOffset
  materialCenterPiece.uniforms.uTime.value = dynamicTime

  renderUpdates.dynamicTime.forEach((uniform: IUniform) => {
    uniform.value = dynamicTime
  })

  camera.position.x += x
  camera.position.y += y
  camera.position.z += y
  camera.lookAt(scene.position)
}

function render() {
  renderer.render(scene, camera)
}

export default function main() {
  init()
  animate()
}
