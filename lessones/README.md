# 教程示例

## [Lesson 01](./lesson01/src/main.ts)

[创建一个场景（Creating a scene）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-a-scene)

> 旋转的绿色立方体

## [Lesson 02](./lesson02/src/main.ts)

[画线（Drawing lines）](https://threejs.org/docs/index.html#manual/zh/introduction/Drawing-lines)

> 蓝色虚线向上箭头

## [Lesson 03](./lesson03/src/main.ts)

[创建文字（Creating text）](https://threejs.org/docs/index.html#manual/zh/introduction/Creating-text)

WebGL / geometry /
text：[示例](https://threejs.org/examples/#webgl_geometry_text)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_geometry_text.html)

> 提夫尼绿色 Hello, three.js! 立体字

## [Lesson 04](./lesson04/src/main.ts)

[载入 3D 模型（Loading 3D models）](https://threejs.org/docs/index.html#manual/zh/introduction/Loading-3D-models)

WebGL / loader /
gltf：[示例](https://threejs.org/examples/#webgl_loader_gltf)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_loader_gltf.html)

> 机器人头盔

## [Lesson 05](./lesson05/src/main.ts)

[虚线材质(LineDashedMaterial)](https://threejs.org/docs/index.html#api/zh/materials/LineDashedMaterial)

WebGL / lines /
dashed：[示例](https://threejs.org/examples/#webgl_lines_dashed)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_lines_dashed.html)

> 旋转的绿色虚线立方体

## [Lesson 06](./lesson06/src/main.ts)

`BufferGeometry` 顶点位置数据解析渲染

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何
   体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格
   模型对象**

> 旋转的四种（点、虚线、实线、面）渲染模式的三维几何体（纯色）

## [Lesson 07](./lesson07/src/main.ts)

`BufferGeometry` 顶点颜色数据插值计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何
   体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格
   模型对象**

> 四种（点、虚线、实线、面）渲染模式的三维几何体（渐变色）

## [Lesson 08](./lesson08/src/main.ts)

`BufferGeometry` 顶点法向量数据光照计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何
   体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
   - 使用类型数组 `Float32Array` 创建顶点法向量 normal 数据（🚨 此处：法向量未生
     效）
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格
   模型对象**

问题（未解决）

Q: `BufferGeometry` 定义的几何体，设置顶点法向量数据后没有效果？

> 四种（点、虚线、实线、面）渲染模式的三维几何体（渐变色）

## [Lesson 09](./lesson09/src/main.ts)

`BufferGeometry` 顶点索引复用顶点数据

1. 通过 `BufferGeometry` 和 `BufferAttribute` 自定义了一个具有六个顶点数据的几何
   体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
   - 使用类型数组 `Uint16Array` 创建顶点索引 index 数据
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对象**（
   使用顶点索引后，虚线失效）
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` 创建 **三角面（网格）材质对象**，`Mesh` 创建 **网格
   模型对象**

> 四种（点、虚线、实线、面）渲染模式的二维几何体（渐变色）

## [Lesson 10](./lesson10/src/main.ts)

常用材质介绍

1. 通过 `SphereGeometry` 创建一个球体几何对象
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineDashedMaterial` 创建 **虚线材质对象**，`Line` 创建 **线模型对
   象**（🚨 此处：虚线未生效）

问题（已解决）

Q: 给 `SphereGeometry` 等几何体设置 `LineDashedMaterial`（虚线材质）没有效果？

A：在学习几何体 `BufferGeometry` 的顶点索引属性 `BufferGeometry.index` 时，当我
给虚线模型对象设置顶点索引属性后，虚线效果失效了，所以我猜测由于
`SphereGeometry` 等几何体的基类是 `BufferGeometry` ，在二次封装时使用了顶点索引
属性，浏览
[SphereGeometry](https://github.com/mrdoob/three.js/blob/master/src/geometries/SphereGeometry.js)
源码是验证了我的猜想。

> 三种（点、实线、虚线）渲染模式的球体几何对象

## [Lesson 11](./lesson11/src/main.ts)

点、线、网格模型介绍

1. 通过 `BoxGeometry` 创建一个立方体几何对象
2. 通过 `PointsMaterial` 创建 **点材质对象**，`Points` 创建 **点模型对象**
3. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`Line` 创建 **线模型对象**
4. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`LineLoop` 创建 **线模型对
   象**
5. 通过 `LineBasicMaterial` 创建 **实线材质对象**，`LineSegments` 创建 **线模型
   对象**
6. 通过 `MeshBasicMaterial` 创建 **实线材质对象**，`Mesh` 创建 **网格模型对象**
   - 可以设置 `wireframe：true` 属性使得网格模型以线条的模式渲染

`Line`，`LineLoop` 和 `LineSegments`：三者的区别：

- `Line` 与 `Mesh` 设置 `wireframe: true` 属性效果一致
- `LineLoop` 将所有能连接的线都连上
- `LineSegments` 则是顶点不共享，第 1、2 点确定一条线，第 3、4 顶点确定一条直线
  ，第 2 和 3 点之间不连接

> 五种（点、线、网格）渲染模式的立方体几何对象

## [Lesson 12](./lesson12/src/main.ts)

常见光源类型

1. 通过 `BoxGeometry` 创建一个立方体几何对象（颜色为： 0xffffff）
2. 通过 `AmbientLight` 创建 **环境光**（颜色为： 0x0000ff)
3. 通过 `SpotLight` 创建 **聚光光源**（颜色为： 0xff0000)
4. 通过 `PointLight` 创建 **点光源**（颜色为： 0xff0000)
5. 通过 `DirectionalLight` 创建 **平行光光源**（颜色为： 0xff0000)

> 一个由四种光源照射的立方体几何对象

## [Lesson 13](./lesson13/src/main.ts)

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

## [Lesson 14](./lesson14/src/main.ts)

层级模型节点命名、查找、遍历

1. 通过 `Group` 多个模型进行分组，形成层级模型
2. 使用 `.traverse()`, `.getObjectById()`, `.getObjectByName()` 三种方式遍历或查
   找查找某个具体的模型
3. 打印模型本地和世界位置坐标、缩放、矩阵

> 一个小人

## [Lesson 15](./lesson15/src/main.ts)

常见几何体和曲线

1. 通过 `Float32Array` 自定义顶点（利用三角函数生成顶点坐标
   `(angle, sin(angle))`），生成正弦曲线
2. 通过 `Vector2` 自定义顶点（利用三角函数生成顶点坐标 `(angle, sin(angle))`），
   生成正弦曲线
3. 通过 `SplineCurve` 创建平滑的正弦曲线（从一系列的点中，创建一个平滑的 **二
   维** 样条曲线）
4. 通过 `CatmullRomCurve3` 创建平滑的正弦曲线（使用 Catmull-Rom 算法， 从一系列
   的点创建一条平滑的 **三维** 样条曲线）
5. 通过 `ArcCurve` 创建一个形状为圆形的曲线，`EllipseCurve` 的别名
6. 通过 `Vector2` 自定义顶点（利用三角函数生成顶点坐标
   `(sin(angle), cos(angle))`），生成圆形
7. 通过 `EllipseCurve` 创建一个形状为圆形的曲线（将 `xRadius` 与 `yRadius` 设为
   相等）
8. 通过 `Vector2` 自定义顶点（利用三角函数生成顶点坐标
   `(xRadius * sin(angle), yRadius * cos(angle))`），生成椭圆形
9. 通过 `EllipseCurve` 创建一个形状为椭圆的曲线
10. 通过 `Float32Array` 自定义顶点，生成折线
11. 通过 `Vector2` 自定义顶点，生成折线
12. 通过 `LineCurve` 创建一条 **二维** 线段的曲线
13. 通过 `LineCurve3` 创建一条 **三维** 线段的曲线
14. 分别对比不同方式生成的正弦曲线、圆形、椭圆形、折线和直线的效果

> 正弦曲线、圆形、椭圆形、折线和直线

## [Lesson 16](./lesson16/src/main.ts)

贝赛尔曲线，多个线条组合曲线

1. 通过 `CubicBezierCurve` 创建一条平滑的 **二维三次** 贝塞尔曲线，由起点、终点
   和 **两个** 控制点所定义
2. 通过 `CubicBezierCurve3` 创建一条平滑的 **三维三次** 贝塞尔曲线，由起点、终点
   和 **两个** 控制点所定义
3. 通过 `QuadraticBezierCurve` 创建一条平滑的 **二维二次** 贝塞尔曲线，由起点、
   终点和 **一个** 控制点所定义
4. 通过 `QuadraticBezierCurve3` 创建一条平滑的 **三维二次** 贝塞尔曲线，由起点、
   终点和 **一个** 控制点所定义
5. 通过 `CurvePath` 把多个圆弧线、样条曲线、直线等多个曲线合并成一个曲线

> 贝赛尔曲线、胶囊形状曲线

## [Lesson 17](./lesson17/src/main.ts)

曲线路径管道成型

1. 通过 `CatmullRomCurve3` 创建平滑的正弦曲线（使用 Catmull-Rom 算法， 从一系列
   的点创建一条平滑的 **三维** 样条曲线）
2. 在上一步的基础上，通过 `TubeGeometry` 生成圆管
3. 通过 `CurvePath` 把多个圆弧线、样条曲线、直线等多个曲线合并成一个曲线
4. 在上一步的基础上，通过 `TubeGeometry` 生成圆管

> 曲线、胶囊形状曲线，曲线、胶囊形状圆管

## [Lesson 18](./lesson18/src/main.ts)

旋转造型

1. 通过 `CubicBezierCurve` 创建一条平滑的 **二维三次** 贝塞尔曲线，由起点、终点
   和 **两个** 控制点所定义
2. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型
3. 通过 `QuadraticBezierCurve` 创建一条平滑的 **二维二次** 贝塞尔曲线，由起点、
   终点和 **一个** 控制点所定义
4. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型
5. 通过 `CurvePath` 把多个圆弧线、样条曲线、直线等多个曲线合并成一个曲线
6. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型
7. 通过 `Shape` 和 `splineThru` 创建一个平滑的 **二维** 样条曲线
8. 在上一步的基础上，通过 `LatheGeometry` 创建旋转网格模型

> 曲线、胶囊形状曲线，曲线、胶囊形状网格模型

## [Lesson 19](./lesson19/src/main.ts)

形状和轮廓填充

1. 通过 `Shape` 和 `splineThru` 创建一个平滑的 **二维** 样条曲线
2. 通过 `Shape` 和 `ShapeGeometry` 创建一个矩形（与 1 中样条曲线坐标一致）
3. 通过 `Shape` 和 `ShapeGeometry` 创建一个矩形（通过 **顶点定义** 轮廓）
4. 通过 `Shape` 和 `ShapeGeometry` 创建一个矩形（通过 **四条直线绘制** 轮廓）
5. 通过 `Shape` 和 `ShapeGeometry` 创建一个圆形（使用 `absarc()`）
6. 通过 `Shape` 和 `ShapeGeometry` 创建一个胶囊形状网格模型（使用 `absarc()`）
7. 通过 `Shape`，`Path` 和 `ShapeGeometry` 创建一个外轮廓嵌套内轮脸状网格模型（
   使用 `arc()`，`holes`）
8. 通过 `Shape`，`Path` 和 `ShapeGeometry` 创建一个多个轮廓同时填充脸状网格模型
   （使用 `arc()`）
9. 通过 `Shape`，`Path` 和 `ShapeGeometry` 创建一个矩形嵌套矩形网格模型（使用
   `moveTo()`，`lineTo()`，`holes`）

> 曲线、矩形，胶囊形状、人脸、矩形嵌套网格模型

## [Lesson 20](./lesson20/src/main.ts)

拉伸扫描成型

在 Lesson 21 的基础上，通过 `ExtrudeGeometry` 利用 2D 轮廓生成 3D 模型

> 3D 曲线、矩形，胶囊形状、人脸、矩形嵌套网格模型

## [Lesson 21](./lesson21/src/main.ts)

创建纹理贴图

1. 通过 `TextureLoader` 创建一个纹理加载器对象
2. 通过 `ImageLoader` 创建一个图片加载器对象
3. 创建两组几何图形（平面、立方体、球体），并分别使用 `TextureLoader` 和
   `ImageLoader` 来设置材质，对比两种贴图方式的效果

> 六个几何图形（平面、立方体、球体）采用不同贴图的效果对比

## [Lesson 22](./lesson22/src/main.ts)

UV 映射原理(顶点纹理坐标)

1. 通过 `TextureLoader` 创建一个纹理加载器对象
2. 通过 `ImageLoader` 创建一个图片加载器对象
3. 通过 `PlaneGeometry` 创建两个平面几何图形，并分别使用 `TextureLoader` 和
   `ImageLoader` 来设置材质，对比两种贴图方式的效果
4. 通过 `BufferGeometry` 自定义顶点 UV 坐标创建两个平面几何图形，并分别使用
   `TextureLoader` 和 `ImageLoader` 来设置材质，对比两种贴图方式的效果
5. 对比四个平面几何图形整体的效果

> 四个平面几何图形采用不同贴图的效果对比

## [Lesson 23](./lesson23/src/main.ts)

[JSON 文件的加载器（ObjectLoader）](https://threejs.org/docs/index.html#api/zh/loaders/ObjectLoader)

WebGL / materials /
lightmap：[示例](https://threejs.org/examples/#webgl_materials_lightmap)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_lightmap.html)

> 砖墙纹路场景

## [Lesson 24](./lesson24/src/main.ts)

纹理对象阵列、偏移和旋转

1. 通过 `TextureLoader` 创建一个纹理加载器对象
2. 通过 `PlaneGeometry` 创建一个平面几何对象
3. 设置纹理阵列和重复数量
4. 设置纹理偏移和旋转动画

> 移动的纹理贴图

## [Lesson 25](./lesson25/src/main.ts)

Canvas、视频作为纹理贴图

1. 通过 `CanvasTexture` 让 Canvas 作为纹理贴图（使用
   `document.createElement('canvas')` 创建 canvas 对象，设置画布尺寸和图文）
2. 通过 `VideoTexture` 让视频作为纹理贴图（使用
   `document.createElement('video')` 创建 video 对象，设置视频地址和自动播放）
3. 设置纹理阵列和重复数量

> 使用 Canvas 和 视频制作纹理贴图

## [Lesson 26](./lesson26/src/main.ts)

[物理网格材质(MeshPhysicalMaterial)](https://threejs.org/docs/index.html#api/zh/materials/MeshPhysicalMaterial)

WebGL / materials / physical /
clearcoat：[示例](https://threejs.org/examples/#webgl_materials_physical_clearcoat)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_physical_clearcoat.html)

> 法线贴图应用：汽车喷漆材质球、碳纤维材质球、高尔夫球和台球

## [Lesson 27](./lesson27/src/main.ts)

凹凸贴图

1. 通过 `TextureLoader` 创建一个纹理加载器对象，加载多张纹理贴图
2. 通过 `MeshPhongMaterial` 创建材质，同时设置 `.map` 普通纹理贴图,`.bumpMap` 凹
   凸贴图
3. 通过 `SphereGeometry` 创建球体模型

> 五个使用凹凸贴图的材质球

## [Lesson 28](./lesson28/src/main.ts)

环境贴图

[CubeTextureLoader ](https://threejs.org/docs/index.html?q=CubeTextureLoader#api/zh/loaders/CubeTextureLoader)
WebGL / materials / cubemap /
dynamic：[示例](https://threejs.org/examples/#webgl_materials_cubemap_dynamic)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_cubemap_dynamic.html)

1. 通过 `CubeTextureLoader` 创建一个纹理加载器对象，加载环境贴图所用的 6 张纹理
   贴图
2. 通过 `SphereGeometry` 创建球体模型，设置 **反射** 材质贴图
3. 通过 `SphereGeometry` 创建球体模型，设置 **折射** 材质贴图
4. 通过 Tweakpane 动态修改材质贴图参数

> 两个环境贴图的材质球

## [Lesson 29](./lesson29/src/main.ts)

精灵模型 Sprite 和 SpriteMaterial

[精灵（Sprite）](https://threejs.org/docs/index.html?q=Sprite#api/zh/objects/Sprite)
[精灵材质(SpriteMaterial)](https://threejs.org/docs/index.html?q=Sprite#api/zh/materials/SpriteMaterial)
WebGL / sprites
[示例](https://threejs.org/examples/#webgl_sprites)、[代码](https://github.com/mrdoob/three.js/blob/master/examples/webgl_sprites.html)

1. 通过 `TextureLoader` 创建一个纹理加载器对象，加载精灵纹理贴图
2. 通过 `SpriteMaterial` 创建精灵材质对象，设置精灵纹理贴图
3. 通过 `Sprite` 创建精灵模型对象，不需要设置几何体 geometry 参数
4. 通过自定义函数 `spriteGenerator` 批量生成精灵模型对象

```
Sprite 用途：
1. 可以在三维场景中把精灵模型作为一个模型的标签，标签上可以显示一个写模型的信息；
2. 可以通过足够多的精灵模型对象，构建一个粒子系统，来模拟一个下雨、森林、或下雪的场景效果。
```

> 自动旋转的三种贴图的精灵模型对象

## [Lesson 30](./lesson30/src/main.ts)

精灵模型 Sprite 模拟下雨效果

1. 通过 `TextureLoader` 创建一个纹理加载器对象，加载雨滴纹理贴图
2. 通过 `SpriteMaterial` 创建精灵材质对象，设置雨滴纹理贴图
3. 通过 `Sprite` 创建精灵模型对象，不需要设置几何体 geometry 参数
4. 通过自定义函数 `spriteGenerator` 批量生成精灵模型对象
5. 通过 `PlaneGeometry` 创建一个平面几何对象作为地面
6. 通过 `TextureLoader` 创建一个纹理加载器对象，加载草地纹理贴图
7. 调整纹理阵列和重复数量，设置草地纹理贴图

> 通过一个精灵模拟模拟下雨的场景

## [Lesson 31](./lesson31/src/main.ts)

编辑关键帧并解析播放

1. 通过 `SphereGeometry` 创建一个球体几何对象
2. 通过 `BoxGeometry` 创建一个立方体几何对象
3. 通过 `KeyframeTrack` 和 `AnimationClip` 创建关键帧动画
4. 通过 `AnimationMixer` 播放关键帧动画
5. 通过 `Clock` 的 `getDelta()` 获得渲染间隔时间
6. 在 `animate()` 中执行 `mixer.update(渲染间隔时间)` 设置帧动画系统两次渲染的时
   间间隔

> 尺寸变化的球体几何对象，颜色变化的立方体几何对象

## [Lesson 32](./lesson32/src/main.ts)

解析外部模型的帧动画

1. 通过 `HemisphereLight` 创建一个半球光（放置于场景之上的光源，光照颜色从天空光
   线颜色渐变到地面光线颜色）
2. 通过 `DirectionalLight` 创建平行光光源
   - 使用 `castShadow` 设置光源可以用于计算阴影
3. 通过 `PlaneGeometry` 创建一个平面几何对象作为地面
   - 设置纹理阵列和重复数量
4. 通过 `GridHelper` 创建一个坐标格辅助对象
5. 通过 `GLTFLoader` 创建一个资源的加载器对象，加载模型
6. 通过 `AnimationClip` 创建关键帧动画
7. 通过 `AnimationMixer` 播放关键帧动画
8. 通过 `Clock` 的 `getDelta()` 获得渲染间隔时间
9. 在 `animate()` 中执行 `mixer.update(渲染间隔时间)` 设置帧动画系统两次渲染的时
   间间隔

> 向前走的两条腿

## [Lesson 33](./lesson33/src/main.ts)

播放设置(暂停、时间段、时间点)

1. 在 Lesson 32 的基础上，通过 Tweakpane 控制动画暂停、播放、快进、播放速度

> 向前走的两条腿
