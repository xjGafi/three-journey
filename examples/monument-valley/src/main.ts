import './style.css'
import {
  AmbientLight,
  Color,
  OrthographicCamera,
  PCFSoftShadowMap,
  PerspectiveCamera,
  PointLight,
  Scene,
  Vector3,
  WebGLRenderer,
} from 'three'

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

import { Cube, Light, Shape } from './utils/generator'
import { floorplan, settings } from './utils/config'

let camera: PerspectiveCamera | OrthographicCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  controls: OrbitControls,
  stats: Stats

let pointLight: PointLight, ambientLight: AmbientLight

const near = 1
const far = 10000

const blockSize = 20
const grid = floorplan[0][0].length
const monumentSquareSize = blockSize * grid
const monumentHeight = blockSize * floorplan.length

init()
animate()

function init() {
  // Scene
  scene = new Scene()
  scene.background = new Color(settings.background)

  // Camera
  initCamera()

  // Objects
  initObjects()

  // Lights
  initLights()

  // Renderer
  initRenderer()

  // Controls
  initControls()

  // Stats
  stats = new Stats()
  document.body.appendChild(stats.dom)

  // Resize
  window.addEventListener('resize', onWindowResize)
}

function initCamera() {
  // Perspective Camera
  if (settings.perspectiveCamera) {
    camera = new PerspectiveCamera(25, innerWidth / innerHeight, near, far)
    camera.position.set(800, -800, 800)
    camera.up = new Vector3(0, 0, 1)
  }
  // Orthographic Camera
  else {
    camera = new OrthographicCamera(innerWidth / -2, innerWidth / 2, innerHeight / 2, innerHeight / -2, -1000, 5000)
    camera.position.set(20, -20, 20)
    camera.up = new Vector3(0, 0, 1)
  }
}

function initObjects() {
  let zPos = -monumentSquareSize - settings.offsetY
  let yPos = 0
  let xPos = 0

  for (let z = 0; z < floorplan.length; z++) {
    const reversedZ = floorplan.length - (z + 1)

    zPos += blockSize
    xPos = monumentSquareSize / 2

    for (let x = 0; x < floorplan[reversedZ].length; x++) {
      const reversedX = floorplan[reversedZ].length - (x + 1)

      xPos -= blockSize
      yPos = monumentSquareSize / 2

      for (let y = 0; y < floorplan[reversedZ][reversedX].length; y++) {
        const reversedY = floorplan[reversedZ][reversedX].length - (y + 1)
        const cell = floorplan[reversedZ][reversedX][reversedY]
        let shape = null

        yPos -= blockSize

        switch (cell) {
          case 1:
            shape = new Cube(xPos, yPos, zPos, settings.cube, blockSize)
            break
          case 2:
            shape = new Shape(xPos, yPos + blockSize / 10, zPos, settings.tail, 2)
            break
          case 3:
            shape = new Shape(xPos, yPos - blockSize / 8, zPos, settings.stairs, 2.5, Math.PI)
            break
            break
          case 4:
            shape = new Light(xPos, yPos, zPos, settings.pointLight, 2)
            break
          case 5:
            shape = new Shape(xPos, yPos + blockSize / 10, zPos, settings.pillar, 2)
            break
        }

        if (shape !== null)
          scene.add(shape.generator())
      }
    }
  }
}

function initLights() {
  pointLight = new PointLight(settings.globalLight, 12000000, 1000)
  pointLight.position.set(600, -200, 250 + monumentHeight)
  pointLight.castShadow = true

  ambientLight = new AmbientLight(settings.ambientLight, 30)

  scene.add(pointLight, ambientLight)
}

function initRenderer() {
  const canvas = document.querySelector('canvas#webgl')!
  renderer = new WebGLRenderer({
    canvas,
    antialias: true,
  })
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = PCFSoftShadowMap
  renderer.setSize(innerWidth, innerHeight)
  renderer.setPixelRatio(devicePixelRatio)
}

function initControls() {
  controls = new OrbitControls(camera, renderer.domElement)
  controls.minPolarAngle = Math.PI / 2 - 0.5
  controls.maxPolarAngle = Math.PI / 2 - 0.5
  controls.autoRotate = settings.autoRotate
  controls.autoRotateSpeed = settings.rotationSpeed
  controls.zoomSpeed = 0.3
  controls.minZoom = 0.5
  controls.maxZoom = 2.5
  controls.enableDamping = true
  controls.dampingFactor = 0.15
}

function onWindowResize() {
  if (settings.perspectiveCamera) {
    (camera as PerspectiveCamera).aspect = innerWidth / innerHeight
  }
  else {
    (camera as OrthographicCamera).left = innerWidth / -2;
    (camera as OrthographicCamera).right = innerWidth / 2;
    (camera as OrthographicCamera).top = innerHeight / 2;
    (camera as OrthographicCamera).bottom = innerHeight / -2
  }
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
