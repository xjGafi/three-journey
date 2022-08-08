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

### [Lessons 1](./packages/lessons1/src/main.ts)

[创建一个场景（Creating a scene）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)

> 旋转的绿色立方体

### [Lessons 2](./packages/lessons2/src/main.ts)

[画线（Drawing lines）](https://threejs.org/docs/index.html#manual/zh/introduction/Drawing-lines)

> 蓝色虚线向上箭头

### [Lessons 3](./packages/lessons3/src/main.ts)

[创建文字（Creating text）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-text)

WebGL / geometry / text：[示例](https://threejs.org/examples/#webgl_geometry_text)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html)

> 绿色 Hello, three.js! 立体字

### [Lessons 4](./packages/lessons4/src/main.ts)

[载入 3D 模型（Loading 3D models）](https://threejs.org/docs/index.html#manual/zh/introduction/Loading-3D-models)

WebGL / loader / gltf：[示例](https://threejs.org/examples/#webgl_loader_gltf)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_gltf.html)

> 机器人头盔

### [Lessons 5](./packages/lessons5/src/main.ts)

[虚线材质(LineDashedMaterial)](https://threejs.org/docs/index.html#api/zh/materials/LineDashedMaterial)

WebGL / lines / dashed：[示例](https://threejs.org/examples/#webgl_lines_dashed)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_lines_dashed.html)

> 旋转的绿色虚线立方体

### [Lessons 6](./packages/lessons6/src/main.ts)

`BufferGeometry` 顶点位置数据解析渲染

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

> 旋转的四种（点、虚线、实线、面）渲染模式的三维几何体（纯色）

### [Lessons 7](./packages/lessons7/src/main.ts)

`BufferGeometry` 顶点颜色数据插值计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

> 四种（点、虚线、实线、面）渲染模式的三维几何体（渐变色）

### [Lessons 8](./packages/lessons8/src/main.ts)

`BufferGeometry` 顶点法向量数据光照计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
   - 使用类型数组 `Float32Array` 创建顶点法向量 normal 数据（🚨 此处：法向量未生效）
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

问题（未解决）

Q: `BufferGeometry` 定义的几何体，设置顶点法向量数据后没有效果？

> 四种（点、虚线、实线、面）渲染模式的三维几何体（渐变色）

### [Lessons 9](./packages/lessons9/src/main.ts)

`BufferGeometry` 顶点索引复用顶点数据

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
   - 使用类型数组 `Uint16Array` 创建顶点索引 index 数据
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**（使用顶点索引后，虚线失效）
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

> 四种（点、虚线、实线、面）渲染模式的二维几何体（渐变色）

### [Lessons 10](./packages/lessons10/src/main.ts)

常用材质介绍

1. 通过 `SphereGeometry` API 创建一个球体几何对象
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**（🚨 此处：虚线未生效）

问题（已解决）

Q: 给 `SphereGeometry` 等几何体设置 `LineDashedMaterial`（虚线材质）没有效果？

A：在学习几何体 `BufferGeometry` 的顶点索引属性 `BufferGeometry.index` 时，当我给虚线模型对象设置顶点索引属性后，虚线效果失效了，所以我猜测由于 `SphereGeometry` 等几何体的基类是 `BufferGeometry` ，在二次封装时使用了顶点索引属性，浏览 [SphereGeometry](https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js) 源码是验证了我的猜想。

> 三种（点、实线、虚线）渲染模式的球体几何对象
