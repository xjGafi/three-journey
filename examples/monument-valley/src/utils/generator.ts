import * as THREE from 'three'
import { VOXLoader, VOXMesh } from 'three/examples/jsm/loaders/VOXLoader'

class Cube {
  private x: number
  private y: number
  private z: number
  private color: string
  private size: number
  private rotate: number

  constructor(x: number, y: number, z: number, color: string, size: number, rotate = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.color = color
    this.size = size
    this.rotate = rotate
  }

  generator() {
    const srgbColor = new THREE.Color(this.color).convertLinearToSRGB()
    const geometry = new THREE.BoxGeometry(this.size, this.size, this.size)
    const material = new THREE.MeshLambertMaterial({
      color: srgbColor,
    })
    const mesh = new THREE.Mesh(geometry, material)

    mesh.position.x = this.x
    mesh.position.y = this.y
    mesh.position.z = this.z
    mesh.rotation.y = this.rotate

    return mesh
  }
}

class Shape {
  private x: number
  private y: number
  private z: number
  private source: string
  private scale: number
  private rotate: number

  constructor(x: number, y: number, z: number, source: string, scale: number, rotate = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.source = source
    this.scale = scale
    this.rotate = rotate
  }

  generator() {
    const group = new THREE.Group()

    const loader = new VOXLoader()

    loader.load(this.source, (chunks) => {
      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]

        const mesh = new VOXMesh(chunk)

        group.add(mesh)
      }

      group.position.x = this.x
      group.position.y = this.y
      group.position.z = this.z
      group.rotation.x = Math.PI / 2
      group.rotation.y = this.rotate
      group.scale.set(this.scale, this.scale, this.scale)
    })

    return group
  }
}

class Light {
  private x: number
  private y: number
  private z: number
  private color: string
  private size: number

  constructor(x: number, y: number, z: number, color: string, size = 0) {
    this.x = x
    this.y = y
    this.z = z
    this.color = color
    this.size = size
  }

  generator() {
    const srgbColor = new THREE.Color(this.color).convertLinearToSRGB()
    const pointLight = new THREE.PointLight(srgbColor, 1.1, 100)

    if (this.size !== 0) {
      const sphereGeometry = new THREE.SphereGeometry(this.size, 50, 50)
      const basicMaterial = new THREE.MeshBasicMaterial({ color: srgbColor })
      const lightBulbe = new THREE.Mesh(sphereGeometry, basicMaterial)
      pointLight.add(lightBulbe)
    }

    const time = Date.now() * 0.0005

    pointLight.position.set(this.x, this.y, this.z + Math.sin(time * 3) * 10)
    pointLight.castShadow = true

    return pointLight
  }
}

export { Cube, Shape, Light }
