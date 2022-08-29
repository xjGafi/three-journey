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

### [Lessons 01](./packages/lessons01/src/main.ts)

[创建一个场景（Creating a scene）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)

> 旋转的绿色立方体

### [Lessons 02](./packages/lessons02/src/main.ts)

[画线（Drawing lines）](https://threejs.org/docs/index.html#manual/zh/introduction/Drawing-lines)

> 蓝色虚线向上箭头

### [Lessons 03](./packages/lessons03/src/main.ts)

[创建文字（Creating text）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-text)

WebGL / geometry / text：[示例](https://threejs.org/examples/#webgl_geometry_text)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html)

> 提夫尼绿色 Hello, three.js! 立体字

### [Lessons 04](./packages/lessons04/src/main.ts)

[载入 3D 模型（Loading 3D models）](https://threejs.org/docs/index.html#manual/zh/introduction/Loading-3D-models)

WebGL / loader / gltf：[示例](https://threejs.org/examples/#webgl_loader_gltf)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_gltf.html)

> 机器人头盔

### [Lessons 05](./packages/lessons05/src/main.ts)

[虚线材质(LineDashedMaterial)](https://threejs.org/docs/index.html#api/zh/materials/LineDashedMaterial)

WebGL / lines / dashed：[示例](https://threejs.org/examples/#webgl_lines_dashed)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_lines_dashed.html)

> 旋转的绿色虚线立方体

### [Lessons 06](./packages/lessons06/src/main.ts)

`BufferGeometry` 顶点位置数据解析渲染

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格模型对象**

> 旋转的四种（点、虚线、实线、面）渲染模式的三维几何体（纯色）

### [Lessons 07](./packages/lessons07/src/main.ts)

`BufferGeometry` 顶点颜色数据插值计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格模型对象**

> 四种（点、虚线、实线、面）渲染模式的三维几何体（渐变色）

### [Lessons 08](./packages/lessons08/src/main.ts)

`BufferGeometry` 顶点法向量数据光照计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
   - 使用类型数组 `Float32Array` 创建顶点法向量 normal 数据（🚨 此处：法向量未生效）
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格模型对象**

问题（未解决）

Q: `BufferGeometry` 定义的几何体，设置顶点法向量数据后没有效果？

> 四种（点、虚线、实线、面）渲染模式的三维几何体（渐变色）

### [Lessons 09](./packages/lessons09/src/main.ts)

`BufferGeometry` 顶点索引复用顶点数据

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
   - 使用类型数组 `Uint16Array` 创建顶点索引 index 数据
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**（使用顶点索引后，虚线失效）
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格模型对象**

> 四种（点、虚线、实线、面）渲染模式的二维几何体（渐变色）

### [Lessons 10](./packages/lessons10/src/main.ts)

常用材质介绍

1. 通过 `SphereGeometry` 创建一个球体几何对象
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**（🚨 此处：虚线未生效）

问题（已解决）

Q: 给 `SphereGeometry` 等几何体设置 `LineDashedMaterial`（虚线材质）没有效果？

A：在学习几何体 `BufferGeometry` 的顶点索引属性 `BufferGeometry.index` 时，当我给虚线模型对象设置顶点索引属性后，虚线效果失效了，所以我猜测由于 `SphereGeometry` 等几何体的基类是 `BufferGeometry` ，在二次封装时使用了顶点索引属性，浏览 [SphereGeometry](https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js) 源码是验证了我的猜想。

> 三种（点、实线、虚线）渲染模式的球体几何对象

### [Lessons 11](./packages/lessons11/src/main.ts)

点、线、网格模型介绍

1. 通过 `BoxGeometry` 创建一个立方体几何对象
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`LineLoop` 创建 **线模型对象**
5. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`LineSegments` 创建 **线模型对象**
6. 通过 `MeshBasicMaterial` 创建 **实线材质对象**，`Mesh` 创建 **网格模型对象**
   - 可以设置 `wireframe：true` 属性使得网格模型以线条的模式渲染

`Line`，`LineLoop` 和 `LineSegments`：三者的区别：

- `Line` 与 `Mesh` 设置 `wireframe: true` 属性效果一致
- `LineLoop` 将所有能连接的线都连上
- `LineSegments` 则是顶点不共享，第 1、2 点确定一条线，第 3、4 顶点确定一条直线，第 2 和 3 点之间不连接

> 五种（点、线、网格）渲染模式的立方体几何对象

### [Lessons 12](./packages/lessons12/src/main.ts)

常见光源类型

1. 通过 `BoxGeometry` 创建一个立方体几何对象（颜色为： 0xffffff）
2. 通过 `AmbientLight` 创建 **环境光**（颜色为： 0x0000ff)
3. 通过 `SpotLight` 创建 **聚光光源**（颜色为： 0xff0000)
4. 通过 `PointLight` 创建 **点光源**（颜色为： 0xff0000)
5. 通过 `DirectionalLight` 创建 **平行光光源**（颜色为： 0xff0000)

> 一个由四种光源照射的立方体几何对象

### [Lessons 13](./packages/lessons13/src/main.ts)

光照阴影实时计算

1. 通过 `BoxGeometry` 创建一个立方体几何对象（颜色为： 0xffffff）
   - 使用 `castShadow` 设置立方体可以产生投影
2. 通过 `PlaneGeometry` 创建一个平面几何对象作为投影面（颜色为： 0xffffff）
   - 使用 `receiveShadow` 设置平面可以接收阴影
3. 通过 `DirectionalLight` 创建 **平行光光源**（颜色为： 0xffff00)
   - 使用 `castShadow` 设置光源可以用于计算阴影
4. 通过 `SpotLight` 创建 **聚光光源**（颜色为： 0xff00ff)
   - 使用 `castShadow` 设置光源可以用于计算阴影
5. 通过 `renderer.shadowMap.enabled = true` 允许在场景中使用阴影贴图

> 一个由两种光源照射的有投影的立方体几何对象

### [Lessons 14](./packages/lessons14/src/main.ts)

层级模型节点命名、查找、遍历

1. 通过 `Group` 多个模型进行分组，形成层级模型
2. 使用 `.traverse()`, `.getObjectById()`, `.getObjectByName()` 三种方式遍历或查找查找某个具体的模型
3. 打印模型本地和世界位置坐标、缩放、矩阵

> 一个小人

### [Lessons 15](./packages/lessons15/src/main.ts)

创建纹理贴图

1. 通过 `TextureLoader` 创建一个纹理加载器对象
2. 通过 `ImageLoader` 创建一个图片加载器对象
3. 创建两组几何图形（平面、立方体、球体），并分别使用 `TextureLoader` 和 `ImageLoader` 来设置材质，对比两种贴图方式的效果

> 六个几何图形（平面、立方体、球体）采用不同贴图的效果对比

### [Lessons 16](./packages/lessons16/src/main.ts)

UV 映射原理(顶点纹理坐标)

1. 通过 `TextureLoader` 创建一个纹理加载器对象
2. 通过 `ImageLoader` 创建一个图片加载器对象
3. 通过 `PlaneGeometry` 创建两个平面几何图形，并分别使用 `TextureLoader` 和 `ImageLoader` 来设置材质，对比两种贴图方式的效果
4. 通过 `BufferGeometry` 自定义顶点 UV 坐标创建两个平面几何图形，并分别使用 `TextureLoader` 和 `ImageLoader` 来设置材质，对比两种贴图方式的效果
5. 对比四个平面几何图形整体的效果

> 四个平面几何图形采用不同贴图的效果对比

### [Lessons 17](./packages/lessons17/src/main.ts)

常见几何体和曲线

1. 通过 `Float32Array` 自定义顶点（利用三角函数生成顶点坐标 `(angle, sin(angle))`），生成正弦曲线
2. 通过 `Vector2` 自定义顶点（利用三角函数生成顶点坐标 `(angle, sin(angle))`），生成正弦曲线
3. 通过 `SplineCurve` 创建平滑的正弦曲线（从一系列的点中，创建一个平滑的 **二维** 样条曲线。）
4. 通过 `CatmullRomCurve3` 创建平滑的正弦曲线（使用 Catmull-Rom 算法， 从一系列的点创建一条平滑的 **三维** 样条曲线）
5. 通过 `ArcCurve` 创建一个形状为圆形的曲线，`EllipseCurve` 的别名
6. 通过 `Vector2` 自定义顶点（利用三角函数生成顶点坐标 `(sin(angle), cos(angle))`），生成圆形
7. 通过 `EllipseCurve` 创建一个形状为圆形的曲线（将 `xRadius` 与 `yRadius` 设为相等）
8. 通过 `Vector2` 自定义顶点（利用三角函数生成顶点坐标 `(xRadius * sin(angle), yRadius * cos(angle))`），生成椭圆形
9. 通过 `EllipseCurve` 创建一个形状为椭圆的曲线
10. 通过 `Float32Array` 自定义顶点，生成折线
11. 通过 `Vector2` 自定义顶点，生成折线
12. 通过 `LineCurve` 创建一条 **二维** 线段的曲线
13. 通过 `LineCurve3` 创建一条 **三维** 线段的曲线
14. 分别对比不同方式生成的正弦曲线、圆形、椭圆形、折线和直线的效果

> 正弦曲线、圆形、椭圆形、折线和直线

### [Lessons 18](./packages/lessons18/src/main.ts)

贝赛尔曲线，多个线条组合曲线

1. 通过 `CubicBezierCurve` 创建一条平滑的 **二维三次** 贝塞尔曲线，由起点、终点和 **两个** 控制点所定义
2. 通过 `CubicBezierCurve3` 创建一条平滑的 **三维三次** 贝塞尔曲线，由起点、终点和 **两个** 控制点所定义
3. 通过 `QuadraticBezierCurve` 创建一条平滑的 **二维二次** 贝塞尔曲线，由起点、终点和 **一个** 控制点所定义
4. 通过 `QuadraticBezierCurve3` 创建一条平滑的 **三维二次** 贝塞尔曲线，由起点、终点和 **一个** 控制点所定义
5. 通过 `CurvePath` 把多个圆弧线、样条曲线、直线等多个曲线合并成一个曲线

> 贝赛尔曲线、胶囊形状曲线

### [Lessons 19](./packages/lessons19/src/main.ts)

曲线路径管道成型

1. 通过 `CatmullRomCurve3` 创建平滑的正弦曲线（使用 Catmull-Rom 算法， 从一系列的点创建一条平滑的 **三维** 样条曲线）
2. 在上一步的基础上，通过 `TubeGeometry` 生成圆管
3. 通过 `CurvePath` 把多个圆弧线、样条曲线、直线等多个曲线合并成一个曲线
4. 在上一步的基础上，通过 `TubeGeometry` 生成圆管

> 曲线、胶囊形状曲线，曲线、胶囊形状圆管

### [Lessons 20](./packages/lessons20/src/main.ts)

旋转造型

1. 通过 `CubicBezierCurve` 创建一条平滑的 **二维三次** 贝塞尔曲线，由起点、终点和 **两个** 控制点所定义
2. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型
3. 通过 `QuadraticBezierCurve` 创建一条平滑的 **二维二次** 贝塞尔曲线，由起点、终点和 **一个** 控制点所定义
4. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型
5. 通过 `CurvePath` 把多个圆弧线、样条曲线、直线等多个曲线合并成一个曲线
6. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型
7. 通过 `Shape` 和 `splineThru` 创建一个平滑的 **二维** 样条曲线
8. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型

> 曲线、胶囊形状曲线，曲线、胶囊形状网格模型

### [Lessons 21](./packages/lessons21/src/main.ts)

形状和轮廓填充

1. 通过 `Shape` 和 `splineThru` 创建一个平滑的 **二维** 样条曲线
2. 通过 `Shape` 和 `ShapeGeometry` 创建一个矩形（与 1 中样条曲线坐标一致）
3. 通过 `Shape` 和 `ShapeGeometry` 创建一个矩形（通过 **顶点定义** 轮廓）
4. 通过 `Shape` 和 `ShapeGeometry` 创建一个矩形（通过 **四条直线绘制** 轮廓）
5. 通过 `Shape` 和 `ShapeGeometry` 创建一个圆形（使用 `absarc()`）
6. 通过 `Shape` 和 `ShapeGeometry` 创建一个胶囊形状网格模型（使用 `absarc()`）
7. 通过 `Shape`，`Path` 和 `ShapeGeometry` 创建一个外轮廓嵌套内轮脸状网格模型（使用 `arc()`，`holes`）
8. 通过 `Shape`，`Path` 和 `ShapeGeometry` 创建一个多个轮廓同时填充脸状网格模型（使用 `arc()`）
9. 通过 `Shape`，`Path` 和 `ShapeGeometry` 创建一个矩形嵌套矩形网格模型（使用 `moveTo()`，`lineTo()`，`holes`）

> 曲线、矩形，胶囊形状、人脸、矩形嵌套网格模型

### [Lessons 22](./packages/lessons22/src/main.ts)

拉伸扫描成型

在 Lessons 21 的基础上，通过 `ExtrudeGeometry` 利用 2D 轮廓生成 3D 模型

> 3D 曲线、矩形，胶囊形状、人脸、矩形嵌套网格模型
