import * as THREE from 'three'

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
    const boxGeometry = new THREE.BoxGeometry(this.size, this.size, this.size)
    const lambertMaterial = new THREE.MeshLambertMaterial({
      color: this.color,
      // overdraw: 1,
    })
    const mesh = new THREE.Mesh(boxGeometry, lambertMaterial)

    mesh.position.x = this.x
    mesh.position.y = this.y
    mesh.position.z = this.z
    mesh.rotation.y = this.rotate

    return mesh
    // scene.add(mesh)
  }
}

// class Shape {
//   constructor(x, y, z, color, source, scale = 1, rotate = 0) {
//     this.x = x
//     this.y = y
//     this.z = z
//     this.color = color
//     this.source = source
//     this.scale = scale
//     this.rotate = rotate
//   }

//   generator() {
//     const loader = new THREE.LegacyJSONLoader()

//     loader.load(this.source, (geometry) => {
//       const mesh = new THREE.Mesh(geometry, new THREE.MeshLambertMaterial({
//         color: this.color,
//         // overdraw: 1
//       }))

//       mesh.position.x = this.x
//       mesh.position.y = this.y
//       mesh.position.z = this.z
//       mesh.rotation.x = Math.PI / 2
//       mesh.rotation.y = this.rotate
//       mesh.scale.set(this.scale, this.scale, this.scale)

//       scene.add(mesh)
//     },
//     )
//   }
// }

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
    const pointLight = new THREE.PointLight(this.color, 1.1, 100)

    if (this.size !== 0) {
      const sphereGeometry = new THREE.SphereGeometry(this.size, 50, 50)
      const basicMaterial = new THREE.MeshBasicMaterial({ color: this.color })
      const lightBulbe = new THREE.Mesh(sphereGeometry, basicMaterial)
      pointLight.add(lightBulbe)
    }

    const time = Date.now() * 0.0005
    // firefly.position.set(0, 0, Math.sin(time*3)*10)

    pointLight.position.set(this.x, this.y, this.z + Math.sin(time * 3) * 10)
    pointLight.castShadow = true

    // scene.add(pointLight)
    return pointLight
  }
}

export { Cube, Light }
