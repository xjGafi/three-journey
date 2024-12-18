# Three.js & Design

## [No.001](./src/views/no001/index.ts)

![poster no.001](./assets/images/no001.jpg)

参考：[Basic practice of three.js](https://codepen.io/tksiiii/pen/jwdvGG)

## [No.002](./src/views/no002/index.ts)

![poster no.002](./assets/images/no002.jpg)

参考：[Daily CSS Design - Day 224](https://dailycssdesign.com/224/)

## [No.003](./src/views/no003/index.ts)（待优化）

![poster no.003](./assets/images/no003.jpg)

参考：[Daily CSS Design - Day 371](https://dailycssdesign.com/371/)

> [GLSL-Noise](https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83)

## [No.004](./src/views/no004/index.ts)

![poster no.004](./assets/images/no004.jpg)

参考：[Daily CSS Design - Day 334](https://dailycssdesign.com/334/)

## [No.005](./src/views/no005/index.ts)

![poster no.005](./assets/images/no005.jpg)

参考：[Daily CSS Design - Day 50](https://dailycssdesign.com/50/)

## [No.006](./src/views/no006/index.ts)

![poster no.006](./assets/images/no006.jpg)

参考：[Daily CSS Design - Day 51](https://dailycssdesign.com/51/)

## [No.007](./src/views/no007/index.ts)

![poster no.007](./assets/images/no007.jpg)

参考：[Daily CSS Design - Day 57](https://dailycssdesign.com/57/)

## [No.008](./src/views/no008/index.ts)

![poster no.008](./assets/images/no008.jpg)

参考：[Daily CSS Design - Day 61](https://dailycssdesign.com/61/)

## [No.009](./src/views/no009/index.ts)

![poster no.009](./assets/images/no009.jpg)

参考：[Daily CSS Design - Day 63](https://dailycssdesign.com/63/)

## [No.010](./src/views/no010/index.ts)

![poster no.010](./assets/images/no010.jpg)

参考：[Webgl Effects Ascii](https://threejs.org/examples/webgl_effects_ascii.html)

## [No.011](./src/views/no011/index.ts)

![poster no.011](./assets/images/no011.jpg)

参考：[Daily CSS Design - Day 144](https://dailycssdesign.com/144/)

## TODO:

- https://dailycssdesign.com/69/
- https://dailycssdesign.com/72/
- https://dailycssdesign.com/73/
- https://dailycssdesign.com/74/
- https://dailycssdesign.com/94/
- https://dailycssdesign.com/104/
- https://dailycssdesign.com/161/
- https://dailycssdesign.com/190/
- https://dailycssdesign.com/194/

## 问题:

1. 升级 three.js (> 0.151) 版本会导致颜色偏暗
   - 部分案例临时使用 `new THREE.Color(0xFF79B4).convertLinearToSRGB()` 处理（有些案例不生效）
   - 参考链接：[官方社区讨论帖子](https://discourse.threejs.org/t/updates-to-color-management-in-three-js-r152/50791/66)

> 尝试：https://webgl3d.cn/pages/c2fd5c/

1. 附加组件导入
   - 官方文档写法 `three/addons/xxx/xxx` 需要替换为 `three/examples/jsm/xxx/xxx`
