# Lessons 7

顶点颜色数据插值计算

1. 通过 `BufferGeometry` 和 `BufferAttribute` 两个 API 自定义了一个具有六个顶点数据的几何体
   - 使用类型数组 `Float32Array` 创建顶点位置 position 数据
   - 使用类型数组 `Float32Array` 创建顶点颜色 color 数据
2. 通过 `PointsMaterial` API 创建 **点材质对象**，`Points` API 创建 **点模型对象**
3. 通过 `LineDashedMaterial` API 创建 **虚线材质对象**，`Line` API 创建 **线模型对象**
4. 通过 `LineBasicMaterial` API 创建 **实线材质对象**，`Line` API 创建 **线模型对象**
5. 通过 `MeshBasicMaterial` API 创建 **三角面（网格）材质对象**，`Mesh` API 创建 **网格模型对象**

> 四种（点、虚线、实线、面）渲染模式的几何体（渐变色）
