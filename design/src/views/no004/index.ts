import {
  CanvasTexture,
  ClampToEdgeWrapping,
  // Clock,
  Color,
  LinearFilter,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderChunk,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three'

import vertexShader from './shader/vertex.glsl?raw'
import fragmentShader from './shader/fragment.glsl?raw'
import vertexShaderCenterPiece from './shader/vertexShaderCenterPiece.glsl?raw'
import fragmentShaderCenterPiece from './shader/fragmentShaderCenterPiece.glsl?raw'
import snoiseShader from '@/shaders/snoise.glsl?raw'
import circleShader from '@/shaders/circle.glsl?raw'
import image from '@/textures/Einstein.jpg?url'

let camera: PerspectiveCamera, scene: Scene, renderer: WebGLRenderer

let geometryCenterPiece: PlaneGeometry, materialCenterPiece: ShaderMaterial, meshCenterPiece: Mesh

const textureLoader = new TextureLoader()

let animateId: number

const cursor = {
  x: 0.5,
  y: 0.5,
}

let start = Date.now()
let fixedTime = 0,
  timeOffset = 0,
  dynamicTime = 0

const renderUpdates = {
  rotate: [],
  fbo: [],
  dynamicTime: [],
}

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 1, 500)
  camera.position.z = 150

  // Object
  createMesh()
  createText()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
  })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
  renderer.setClearColor(
    new Color('rgb(255, 121, 180)')
  )

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

const wordTextureStore: any = {}
function generateWordTexture(word: string, size: number, fontFamily: string, weight: number) {
  if (!wordTextureStore[word]) {
    const canvas = document.createElement('canvas')
    const context = canvas.getContext('2d', { alpha: false })!
    const font =
      weight + ' ' + size * 2 + "px '" + fontFamily + "'"
    context.font = font
    const wordWidth = Math.max(
      size * 1.4,
      context.measureText(word).width
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
      canvas.height / 2
    )

    wordTextureStore[word] = canvas
  }

  return wordTextureStore[word]
}

function createText() {
  const wordTexture1 = new CanvasTexture(
    generateWordTexture('G', 80, 'serif', 700)
  )
  wordTexture1.generateMipmaps = false
  wordTexture1.wrapS = wordTexture1.wrapT =
    ClampToEdgeWrapping
  wordTexture1.minFilter = LinearFilter

  const wordTexture2 = new CanvasTexture(
    generateWordTexture('E', 80, 'serif', 700)
  )
  wordTexture2.generateMipmaps = false
  wordTexture2.wrapS = wordTexture2.wrapT =
    ClampToEdgeWrapping;
  wordTexture2.minFilter = LinearFilter;

  const wordTexture3 = new CanvasTexture(
    generateWordTexture('N', 80, 'serif', 700)
  );
  wordTexture3.generateMipmaps = false;
  wordTexture3.wrapS = wordTexture3.wrapT =
    ClampToEdgeWrapping;
  wordTexture3.minFilter = LinearFilter;

  const wordTexture4 = new CanvasTexture(
    generateWordTexture('I', 80, 'serif', 700)
  );
  wordTexture4.generateMipmaps = false;
  wordTexture4.wrapS = wordTexture4.wrapT =
    ClampToEdgeWrapping;
  wordTexture4.minFilter = LinearFilter;

  const wordTexture5 = new CanvasTexture(
    generateWordTexture('U', 80, 'serif', 700)
  );
  wordTexture5.generateMipmaps = false;
  wordTexture5.wrapS = wordTexture5.wrapT =
    ClampToEdgeWrapping;
  wordTexture5.minFilter = LinearFilter;

  const wordTexture6 = new CanvasTexture(
    generateWordTexture('S', 80, 'serif', 700)
  );
  wordTexture6.generateMipmaps = false;
  wordTexture6.wrapS = wordTexture6.wrapT =
    ClampToEdgeWrapping;
  wordTexture6.minFilter = LinearFilter;

  const geometry1 = new PlaneGeometry(
    wordTexture1.image.width * 0.074,
    wordTexture1.image.height * 0.074
  );
  const material1 = new ShaderMaterial({
    uniforms: {
      uTexture: { value: wordTexture1 },
      uColor: {
        value: new Color('rgb(255, 255, 255)'),
      },
    },
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    transparent: true,
  });
  const mesh1 = new Mesh(geometry1, material1);
  mesh1.position.set(-29.3, 0.0, 33.0);
  mesh1.scale.multiplyScalar(0.78);
  scene.add(mesh1);

  const geometry2 = new PlaneGeometry(
    wordTexture2.image.width * 0.074,
    wordTexture2.image.height * 0.074
  );
  const material2 = new ShaderMaterial({
    uniforms: {
      uTexture: { value: wordTexture2 },
      uColor: {
        value: new Color('rgb(255, 255, 255)'),
      },
    },
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    transparent: true,
  });
  const mesh2 = new Mesh(geometry2, material2);
  mesh2.position.set(-19.2, 0.0, 22.0);
  mesh2.scale.multiplyScalar(0.85);
  scene.add(mesh2);

  const geometry3 = new PlaneGeometry(
    wordTexture3.image.width * 0.074,
    wordTexture3.image.height * 0.074
  );
  const material3 = new ShaderMaterial({
    uniforms: {
      uTexture: { value: wordTexture3 },
      uColor: {
        value: new Color('rgb(255, 255, 255)'),
      },
    },
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    transparent: true,
  });
  const mesh3 = new Mesh(geometry3, material3);
  mesh3.position.set(-6.3, 0.0, 24.0);
  mesh3.scale.multiplyScalar(0.84);
  scene.add(mesh3);

  const geometry4 = new PlaneGeometry(
    wordTexture4.image.width * 0.074,
    wordTexture4.image.height * 0.074
  );
  const material4 = new ShaderMaterial({
    uniforms: {
      uTexture: { value: wordTexture4 },
      uColor: {
        value: new Color('rgb(255, 255, 255)'),
      },
    },
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    transparent: true,
  });
  const mesh4 = new Mesh(geometry4, material4);
  mesh4.position.set(6.0, 0.0, 30.0);
  mesh4.scale.multiplyScalar(0.8);
  scene.add(mesh4);

  const geometry5 = new PlaneGeometry(
    wordTexture5.image.width * 0.074,
    wordTexture5.image.height * 0.074
  );
  const material5 = new ShaderMaterial({
    uniforms: {
      uTexture: { value: wordTexture5 },
      uColor: {
        value: new Color('rgb(255, 255, 255)'),
      },
    },
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    transparent: true,
  });
  const mesh5 = new Mesh(geometry5, material5);
  mesh5.position.set(18.6, 0.0, 26.0);
  mesh5.scale.multiplyScalar(0.83);
  scene.add(mesh5);

  const geometry6 = new PlaneGeometry(
    wordTexture6.image.width * 0.074,
    wordTexture6.image.height * 0.074
  );
  const material6 = new ShaderMaterial({
    uniforms: {
      uTexture: { value: wordTexture6 },
      uColor: {
        value: new Color('rgb(255, 255, 255)'),
      },
    },
    fragmentShader: fragmentShader,
    vertexShader: vertexShader,
    transparent: true,
  });
  const mesh6 = new Mesh(geometry6, material6);
  mesh6.position.set(32.3, 0.0, 21.0);
  mesh6.scale.multiplyScalar(0.86);
  scene.add(mesh6);
}

function createMesh() {
  // @ts-ignore
  ShaderChunk.g_circle = circleShader
  // @ts-ignore
  ShaderChunk.g_snoise = snoiseShader

  const imageTextureWidth = 1024, imageTextureHeight = 710

  geometryCenterPiece = new PlaneGeometry(
    imageTextureWidth * 0.1,
    imageTextureHeight * 0.1
  )
  materialCenterPiece = new ShaderMaterial({
    uniforms: {
      uTexture: {
        value: textureLoader.load(
          image,
          function (texture) {
            texture.generateMipmaps = false
            texture.wrapS = ClampToEdgeWrapping
            texture.wrapT = ClampToEdgeWrapping
            texture.minFilter = LinearFilter
          }
        )
      },
      uTextureDimensions: {
        value: new Vector2(
          imageTextureWidth,
          imageTextureHeight
        ),
      },
      uTime: { value: 0 },
      uColorHigh: {
        value: new Color('rgba(43, 108, 239)'),
      },
      uColorLow: {
        value: new Color('rgb(255, 121, 180)'),
      },
    },
    fragmentShader: fragmentShaderCenterPiece,
    vertexShader: vertexShaderCenterPiece,
  })
  meshCenterPiece = new Mesh(
    geometryCenterPiece,
    materialCenterPiece
  )
  meshCenterPiece.position.set(0, -5, 0)
  meshCenterPiece.scale.multiplyScalar(2.6)
  scene.add(meshCenterPiece)
}

function onResize() {
  const { width, height } = renderer.domElement
  const { innerWidth, innerHeight, devicePixelRatio } = window

  if (width !== innerWidth || height !== innerHeight) {
    camera.aspect = innerWidth / innerHeight
    camera.updateProjectionMatrix()

    renderer.setSize(innerWidth, innerHeight)
    renderer.setPixelRatio(devicePixelRatio)
  }
}

function onMouseMove(event: MouseEvent) {
  cursor.x = event.clientX / innerWidth
  cursor.y = event.clientY / innerHeight
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
  timeOffset +=
    (Math.abs(x) + Math.abs(y)) / 5
  dynamicTime = fixedTime + timeOffset
  materialCenterPiece.uniforms.uTime.value = dynamicTime

  renderUpdates.dynamicTime.forEach(function (uniform: any) {
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
