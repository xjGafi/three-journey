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
  Vector3,
  AnimationAction,
  LoopOnce,
  Group,
  Texture,
  SkeletonHelper,
  MeshStandardMaterial
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
  stats: Stats;

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
  { text: '晃动', value: 'Idle' },
  { text: '走路', value: 'Walking' },
  { text: '跑步', value: 'Running' },
  { text: '跳舞', value: 'Dance' }
];
// 不可循环播放动作列表
const LOOP_ONCE_LIST = [
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

interface Params {
  loopRepeat: string;
  paused: boolean; // 暂停
  timeScale: number; // 播放速度
  [key: string]: unknown;
}
// GUI 设置项
const PARAMS: Params = {
  loopRepeat: 'Walking',
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
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target = new Vector3(0, 2, 0);
  controls.minDistance = 5;
  controls.maxDistance = 40;
  controls.update();

  // Clock
  clock = new Clock();

  // Stats
  stats = Stats();
  document.body.appendChild(stats.dom);

  // Resize
  window.addEventListener('resize', onWindowResize);
}

function addGround() {
  const geometry = new PlaneGeometry(500, 500);

  // 加载纹理贴图
  texture = new TextureLoader().load(grass);
  // 设置阵列
  texture.wrapS = RepeatWrapping;
  texture.wrapT = RepeatWrapping;
  // uv 两个方向纹理重复数量
  texture.repeat.set(200, 200);

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

    model.traverse((child) => {
      // console.log('🌈 child:', child);
      if (child.type === 'Mesh' || child.type === 'SkinnedMesh') {
        // 开启阴影
        child.castShadow = true;

        // 显示模型网格
        ((child as Mesh).material as MeshStandardMaterial).wireframe = true;
      }

      // 显示骨骼
      const skeletonHelper = new SkeletonHelper(child);
      scene.add(skeletonHelper);
    });

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
    currentAction = actions[PARAMS.loopRepeat];
    currentAction.play();

    // Pane
    initPane();
  });
}

function initPane() {
  const pane = new Pane();

  // 可循环播放动作配置
  let folder = pane.addFolder({ title: 'Loop Repeat' });
  // 修改播放动作
  folder
    .addInput(PARAMS, 'loopRepeat', {
      label: '动作',
      options: LOOP_REPEAT_LIST
    })
    .on('change', ({ value }) => {
      switchAction(value, 0.5);
    });
  // 修改播放状态
  folder
    .addInput(PARAMS, 'paused', {
      label: '暂停'
    })
    .on('change', ({ value }) => {
      currentAction.paused = value;
    });
  // 修改播放速度
  folder
    .addInput(PARAMS, 'timeScale', {
      label: '播放速度',
      step: 0.1,
      min: 0,
      max: 3
    })
    .on('change', ({ value }) => {
      currentAction.timeScale = value;
    });
  // 恢复初始状态
  folder.addButton({ title: '重置动作' }).on('click', () => {
    PARAMS.loopRepeat = 'Walking';
    PARAMS.paused = false;
    PARAMS.timeScale = 1;
    pane.refresh();
  });

  // 不可循环播放动作配置
  folder = pane.addFolder({ title: 'Loop Once' });
  LOOP_ONCE_LIST.map((item) => {
    folder.addButton({ title: item.text }).on('click', () => {
      switchAction(item.value, 0.2);
      // 当前动作播放完成后恢复之前的可循环播放的动作
      mixer.addEventListener('finished', restoreActive);
    });
  });

  // // 面部表情动作配置（不生效）
  // const face = model.getObjectByName('Head_4')!;
  // const expressions = Object.keys((face as Mesh).morphTargetDictionary!);
  // folder = pane.addFolder({ title: 'Face' });
  // expressions.map((item) => {
  //   folder
  //     .addInput((face as Mesh).morphTargetDictionary!, item, {
  //       step: 0.1,
  //       min: 0,
  //       max: 3
  //     })
  //     .on('change', ({ value }) => {
  //       (face as Mesh).morphTargetDictionary![item] = value;
  //       // console.log('🌈 face:', face.morphTargetDictionary);
  //     });
  // });
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
  mixer.removeEventListener('finished', restoreActive);
  switchAction(PARAMS.loopRepeat, 0.2);
}

function onWindowResize() {
  camera.aspect = innerWidth / innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(innerWidth, innerHeight);

  render();
}

function animate() {
  requestAnimationFrame(animate);
  if (typeof mixer !== 'undefined') {
    // 获得两帧的时间间隔
    const getDelta = clock.getDelta();

    // 地板贴图后移，产生模型向前走的效果
    if (!PARAMS.paused) {
      textureOffsetY -= getDelta * 2 * PARAMS.timeScale;
    }
    texture.offset.y = textureOffsetY;

    // 更新混合器相关的时间
    mixer.update(getDelta);
  }

  stats.update();
  render();
}

function render() {
  renderer.render(scene, camera);
}
