import './style.css'
import {
  BufferAttribute,
  Clock,
  Color,
  // DoubleSide,
  Group,
  Mesh,
  PerspectiveCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  TextureLoader,
  Vector2,
  WebGLRenderer,
} from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

import { Pane } from 'tweakpane'

import shaders from './shaders'
import image from '@/textures/avatar.jpeg?url'

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls

let group: Group

const textureLoader = new TextureLoader()

const clock = new Clock()

init()
animate()

function init() {
  const { innerWidth, innerHeight, devicePixelRatio } = window

  // Scene
  scene = new Scene()
  scene.background = new Color(0x28292E)

  // Canera
  camera = new PerspectiveCamera(75, innerWidth / innerHeight, 0.01, 100)
  camera.position.set(0, 0, 5)

  // Object
  meshGenerator()

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({ canvas })
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)

  // Controls
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true

  // Pane
  initPane()

  // Listener
  window.addEventListener('resize', onResize, false)
}

function meshGenerator() {
  const SIZE = 1
  const SEGMENTS = 16
  const OFFSET = 1.25
  const MAX = 10
  let offsetY = 0

  group = new Group()

  const geometry = new PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS)

  const { count } = geometry.attributes.position
  const randoms = new Float32Array(count)
  for (let i = 0; i < count; i++)
    randoms[i] = Math.random()
  geometry.setAttribute('aRandom', new BufferAttribute(randoms, 1))

  shaders.forEach((shader, index) => {
    const material = new ShaderMaterial({
      ...shader,
      transparent: true,
      // side: DoubleSide,
      // wireframe: true,
    })
    switch (index + 1) {
      case 5:
        material.uniforms = {
          uFrequency: { value: new Vector2(10, 5) },
          uTime: { value: 0 },
          uColor: { value: new Color(0x00FF00) },
        }
        break

      case 6:
        material.uniforms = {
          uFrequency: { value: new Vector2(10, 5) },
          uTime: { value: 0 },
          uTexture: { value: textureLoader.load(image) },
        }
        break

      case 35:
        material.uniforms = {
          uScale: { value: 30 },
        }
        break

      default:
        break
    }

    const mesh = new Mesh(geometry, material)
    if (index % MAX === 0)
      offsetY -= OFFSET
    mesh.position.x = OFFSET * (index % MAX)
    mesh.position.y = offsetY

    group.add(mesh)
  })

  group.position.set(-7.15, 4, 0)
  scene.add(group)
}

function initPane() {
  const pane = new Pane({ title: 'Shader' })

  // No.05
  let folder = pane.addFolder({ title: 'No.05' })
  const obj5UniformFrequency = ((group.children[4] as Mesh).material as ShaderMaterial)
    .uniforms.uFrequency.value
  folder.addBinding(
    obj5UniformFrequency,
    'x',
    {
      label: 'Frequency X',
      step: 0.01,
      min: 0,
      max: 20,
    },
  )
  folder.addBinding(
    obj5UniformFrequency,
    'y',
    {
      label: 'Frequency Y',
      step: 0.01,
      min: 0,
      max: 10,
    },
  )

  // No.06
  folder = pane.addFolder({ title: 'No.06' })
  const obj6UniformFrequency = ((group.children[5] as Mesh).material as ShaderMaterial)
    .uniforms.uFrequency.value
  folder.addBinding(
    obj6UniformFrequency,
    'x',
    {
      label: 'Frequency X',
      step: 0.01,
      min: 0,
      max: 20,
    },
  )
  folder.addBinding(
    obj6UniformFrequency,
    'y',
    {
      label: 'Frequency Y',
      step: 0.01,
      min: 0,
      max: 10,
    },
  )

  // No.35
  folder = pane.addFolder({ title: 'No.35' })
  const obj35UniformScale = ((group.children[34] as Mesh).material as ShaderMaterial).uniforms.uScale
  folder.addBinding(
    obj35UniformScale,
    'value',
    {
      label: 'Size',
      step: 0.01,
      min: 0,
      max: 100,
    },
  )
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

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime();

  // No.05
  ((group.children[4] as Mesh).material as ShaderMaterial).uniforms.uTime.value = elapsedTime;

  // No.06
  ((group.children[5] as Mesh).material as ShaderMaterial).uniforms.uTime.value = elapsedTime

  controls.update()

  render()
}

function render() {
  renderer.render(scene, camera)
}
