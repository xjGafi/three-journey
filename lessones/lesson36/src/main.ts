import './style.css';
import {
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
  sRGBEncoding,
  Clock,
  AnimationMixer,
  Mesh,
  PlaneGeometry,
  Color,
  Fog,
  DirectionalLight,
  HemisphereLight,
  MeshLambertMaterial,
  RepeatWrapping,
  TextureLoader,
  AnimationAction,
  LoopOnce,
  Group,
  Texture,
  SkeletonHelper,
  MeshStandardMaterial,
  NearestFilter
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import RobotExpressive from '@/models/RobotExpressive/RobotExpressive.glb?url';
import grass from '@/textures/grass.png?url';
import { Pane } from 'tweakpane';

let camera: PerspectiveCamera,
  scene: Scene,
  renderer: WebGLRenderer,
  clock: Clock,
  stats: Stats,
  controls: OrbitControls;

interface Actions {
  [key: string]: AnimationAction;
}
let model: Group,
  mixer: AnimationMixer,
  currentAction: AnimationAction, // 当前播放的动作
  previousAction: AnimationAction, // 上一次播放的动作
  actions: Actions; // 动作列表

// 用于 GUI 控制面板
// 可循环播放动作列表
const LOOP_REPEAT_LIST = [
  { text: '走路', value: 'Walking' },
  { text: '跑步', value: 'Running' }
];
// 不可循环播放动作列表
const LOOP_ONCE_LIST = [
  { text: '晃动', value: 'Idle' },
  { text: '跳舞', value: 'Dance' },
  { text: '倒地', value: 'Death' },
  { text: '坐下', value: 'Sitting' },
  { text: '站立', value: 'Standing' },
  { text: '跳跃', value: 'Jump' },
  { text: '点头', value: 'Yes' },
  { text: '摇头', value: 'No' },
  { text: '挥手', value: 'Wave' },
  { text: '攻击', value: 'Punch' },
  { text: '点赞', value: 'ThumbsUp' }
];

let texture: Texture;
let textureOffsetY = 0;

interface modelConfig {
  showShadow: boolean; // 显示影子
  showWireframe: boolean; // 显示模型网格
  showSkeleton: boolean; // 显示模型骨骼
  [key: string]: unknown;
}
const meshConfig: modelConfig = {
  showShadow: true,
  showWireframe: false,
  showSkeleton: false
};

interface AnimationConfig {
  action: string; // 默认动作
  paused: boolean; // 暂停
  timeScale: number; // 播放速度
  [key: string]: unknown;
}
const animationConfig: AnimationConfig = {
  action: 'Walking',
  paused: false,
  timeScale: 1
};

init();
animate();

function init() {
  // Scene
  scene = new Scene();
  scene.background = new Color(0xffffff);
  scene.fog = new Fog(0xffffff, 50, 100);

  // Canera
  camera = new PerspectiveCamera(45, innerWidth / innerHeight, 0.25, 100);
  camera.position.set(-5, 3, 10);

  // Light
  const hemiLight = new HemisphereLight(0xffffff, 0x444444, 0.6);
  hemiLight.position.set(0, 200, 0);
  scene.add(hemiLight);

  const dirLight = new DirectionalLight(0xffffff, 0.8);
  dirLight.position.set(0, 20, 10);
  dirLight.castShadow = true;
  dirLight.shadow.camera.top = 18;
  dirLight.shadow.camera.bottom = -10;
  dirLight.shadow.camera.left = -12;
  dirLight.shadow.camera.right = 12;
  scene.add(dirLight);

  // Object
  addGround();
  addModel();

  // Renderer
  const canvas = document.querySelector('canvas#webgl')!;
  renderer = new WebGLRenderer({ canvas });
  renderer.setSize(innerWidth, innerHeight);
  renderer.setPixelRatio(devicePixelRatio);
  renderer.shadowMap.enabled = true;
  renderer.outputEncoding = sRGBEncoding;

  // Controls
  controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 2, 0);
  controls.enableDamping = true;
  controls.minDistance = 5;
  controls.maxDistance = 40;

  // Clock
  clock = new Clock();

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Resize
  window.addEventListener('resize', onResize);

  // Fullscreen
  window.addEventListener('dblclick', onDoubleClick);
}

function addGround() {
  const geometry = new PlaneGeometry(500, 500);

  // 加载纹理贴图
  texture = new TextureLoader().load(grass);
  // 设置阵列
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  // uv 两个方向纹理重复数量
  texture.repeat.set(100, 100);
  // 防止纹理贴图模糊
  texture.minFilter = NearestFilter;
  texture.magFilter = NearestFilter;

  const material = new MeshLambertMaterial({
    map: texture // 设置纹理贴图
  });

  const ground = new Mesh(geometry, material);
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  scene.add(ground);
}

function addModel() {
  // 3D Model
  const loader = new GLTFLoader();
  loader.load(RobotExpressive, (gltf) => {
    model = gltf.scene;
    scene.add(model);

    // 模型配置
    modelConfig();

    // gltf.scene 作为混合器的参数，可以播放 gltf.scene 包含的帧动画数据
    mixer = new AnimationMixer(model);

    const loopOnceNameList = LOOP_ONCE_LIST.map((item) => {
      return item.value;
    });
    actions = {};
    // 获得剪辑 clip 对象
    gltf.animations.map((clip) => {
      // 剪辑 clip 作为参数，通过混合器 clipAction 方法返回一个操作对象 AnimationAction
      const action = mixer.clipAction(clip);
      actions[clip.name] = action;

      if (loopOnceNameList.includes(clip.name)) {
        action.clampWhenFinished = true; // 动画将在最后一帧之后自动暂停
        action.loop = LoopOnce; // 只执行一次
      }
    });

    // 播放默认动作
    currentAction = actions[animationConfig.action];
    currentAction.play();

    // Pane
    initPane();
  });
}

function initPane() {
  const pane = new Pane();

  // 模型配置
  let folder = pane.addFolder({ title: 'Model Config' });
  // 显示或隐藏影子、网格、骨骼
  for (const item in meshConfig) {
    if (Object.prototype.hasOwnProperty.call(meshConfig, item)) {
      folder
        .addInput(meshConfig, item, { label: keyToLabel(item) })
        .on('change', () => {
          modelConfig();
        });
    }
  }

  // 可循环播放动作配置
  folder = pane.addFolder({ title: 'Loop Repeat' });
  // 修改播放动作
  folder
    .addInput(animationConfig, 'action', {
      label: 'Action',
      options: LOOP_REPEAT_LIST
    })
    .on('change', ({ value }) => {
      switchAction(value, 0.5);
    });
  // 修改播放状态
  folder
    .addInput(animationConfig, 'paused', {
      label: 'Paused'
    })
    .on('change', ({ value }) => {
      currentAction.paused = value;
    });
  // 修改播放速度
  folder
    .addInput(animationConfig, 'timeScale', {
      label: 'Time Scale',
      step: 0.1,
      min: 0,
      max: 3
    })
    .on('change', ({ value }) => {
      currentAction.timeScale = value;
    });
  // 恢复初始状态
  folder.addButton({ title: '重置' }).on('click', () => {
    animationConfig.action = 'Walking';
    animationConfig.paused = false;
    animationConfig.timeScale = 1;
    pane.refresh();
  });

  // 不可循环播放动作配置
  folder = pane.addFolder({ title: 'Loop Once' });
  LOOP_ONCE_LIST.map((item) => {
    folder.addButton({ title: item.text }).on('click', () => {
      animationConfig.paused = true;
      switchAction(item.value, 0.2);
      // 当前动作播放完成后恢复之前的可循环播放的动作
      mixer.addEventListener('finished', restoreActive);
    });
  });

  // 面部表情动作配置
  folder = pane.addFolder({ title: 'Face Config' });
  const face = model.getObjectByName('Head_4')!;
  const expressions = Object.keys((face as Mesh).morphTargetDictionary!);
  expressions.map((item, index) => {
    folder.addInput((face as Mesh).morphTargetInfluences!, index, {
      label: item,
      step: 0.1,
      min: 0,
      max: 1
    });
  });
}

// 模型配置
function modelConfig() {
  model.traverse((child) => {
    // console.log('🌈 child:', child);
    if (child.type === 'Mesh' || child.type === 'SkinnedMesh') {
      // 显示影子
      child.castShadow = meshConfig.showShadow;

      // 显示网格
      ((child as Mesh).material as MeshStandardMaterial).wireframe =
        meshConfig.showWireframe;
    }

    // 显示骨骼
    if (meshConfig.showSkeleton) {
      const skeletonHelper = new SkeletonHelper(child);
      skeletonHelper.name = 'skeletonHelper';
      scene.add(skeletonHelper);
    } else {
      const skeletonHelper = scene.getObjectByName('skeletonHelper');
      if (skeletonHelper) {
        scene.remove(skeletonHelper);
      }
    }
  });
}

// 切换动作
function switchAction(name: string, duration: number) {
  previousAction = currentAction;
  currentAction = actions[name];

  // 结束上一个动作
  if (previousAction !== currentAction) {
    previousAction.fadeOut(duration);
  }

  // 开始下一个动作
  currentAction
    .reset()
    .setEffectiveTimeScale(1)
    .setEffectiveWeight(1)
    .fadeIn(duration)
    .play();
}

// 恢复动作
function restoreActive() {
  animationConfig.paused = false;
  mixer.removeEventListener('finished', restoreActive);
  switchAction(animationConfig.action, 0.2);
}

function onResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

// https://www.icode9.com/content-1-259170.html
function onDoubleClick() {
  const isInFullScreen =
    document?.fullscreenElement || (document as any)?.webkitFullscreenElement; // 兼容 Safari
  if (!isInFullScreen) {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if ((element as any).webkitRequestFullScreen) {
      (element as any).webkitRequestFullScreen(); // 兼容 Safari
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if ((document as any).webkitExitFullscreen) {
      (document as any).webkitExitFullscreen(); // 兼容 Safari
    }
  }
}

function animate() {
  requestAnimationFrame(animate);
  if (typeof mixer !== 'undefined') {
    // 获得两帧的时间间隔
    const getDelta = clock.getDelta();

    // 地板贴图后移，产生模型向前走的效果
    if (!animationConfig.paused) {
      textureOffsetY -= getDelta * 1.5 * animationConfig.timeScale;
    }
    texture.offset.y = textureOffsetY;

    // 更新混合器相关的时间
    mixer.update(getDelta);
  }

  controls.update();
  stats.update();

  render();
}

function render() {
  renderer.render(scene, camera);
}

// 小驼峰转大写字母开头并且加空格
function keyToLabel(str: string): string {
  return str
    .replace(/([A-Z])/g, ' $1') // 加空格
    .replace(/^\S/, ($0) => $0.toUpperCase()); // 首字母大写
}
