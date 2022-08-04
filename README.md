# Three.js 学习

## 学习地址

- [Three.js 官方文档](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)
- [Three.js 零基础入门教程(郭隆邦)](http://www.yanhuangxueyuan.com/Three.js/)
- [Sean Bradley Three.js Tutorials](https://sbcode.net/threejs/)
- [Bruno Simon three.js journey: B 站](https://www.bilibili.com/video/BV1wY4y1h765)
- [Bruno Simon three.js journey: 官网](https://threejs-journey.com)

## 项目说明

- 使用 Pnpm Workspace 构建 Monorepo（单仓库多项目）

## 目录说明

### Lessons 1

[创建一个场景（Creating a scene）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)

> 旋转的绿色立方体

### Lessons 2

[画线（Drawing lines）](https://threejs.org/docs/index.html#manual/zh/introduction/Drawing-lines)

> 蓝色虚线向上箭头

### Lessons 3

[创建文字（Creating text）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-text)

WebGL / geometry / text

- [示例](https://threejs.org/examples/#webgl_geometry_text)
- [代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html)

> 绿色 Hello, three.js! 立体字

### Lessons 4

[载入 3D 模型（Loading 3D models）](https://threejs.org/docs/index.html#manual/zh/introduction/Loading-3D-models)

WebGL / loader / gltf

- [示例](https://threejs.org/examples/#webgl_loader_gltf)
- [代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_gltf.html)

机器人头盔

### Lessons 5

[虚线材质(LineDashedMaterial)](https://threejs.org/docs/index.html#api/zh/materials/LineDashedMaterial)

WebGL / lines / dashed

- [示例](https://threejs.org/examples/#webgl_lines_dashed)
- [代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_lines_dashed.html)

> 旋转的绿色虚线立方体

### Lessons 6

顶点位置数据解析渲染

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

> 旋转的四种（点、虚线、实线、面）渲染模式的几何体（纯色）

### Lessons 7

顶点颜色数据插值计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

> 四种（点、虚线、实线、面）渲染模式的几何体（渐变色）

### Lessons 8

顶点法向量数据光照计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
   - 使用类型数组 `Float32Array` 创建顶点法向量 normal 数据（此处：未生效）
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

> 旋转的四种（点、虚线、实线、面）渲染模式的几何体（渐变色）

### Lessons 13

常用材质介绍

1. 通过 `SphereGeometry` API 创建一个球体几何对象
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**（此处：在 SphereGeometry 上使用 LineDashedMaterial 不生效）

> 三种（点、实线、虚线）渲染模式的球体几何对象
