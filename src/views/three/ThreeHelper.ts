import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import * as THREE from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';
export function loadModel(url: string):Promise<any> {
    return new Promise((resolve, reject,) => {
        const loader = new GLTFLoader()
        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('three/examples/jsm/libs/draco/');
        loader.setDRACOLoader(dracoLoader);
        loader.load('/zombies3d.glb', resolve)
    })
}

export function creatScene(canvas: HTMLCanvasElement, options: {
    width: number, height: number, axes?: any, grid?: any
}) {
    // 场景
    const scene = new THREE.Scene()
    if (!!options.axes)
        scene.add(new THREE.AxesHelper(options.axes))
    if (!!options.grid)
        scene.add(new THREE.GridHelper(...options.grid))

    // 相机
    const camera = new THREE.PerspectiveCamera()

    // 渲染器
    const renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        canvas: canvas
    });
    renderer.setSize(options.width, options.height)
    renderer.setClearColor(0xffffff);
    renderer.setPixelRatio(window.devicePixelRatio);
    
    // 添加轨道控制器
    const controls = new OrbitControls(camera, renderer.domElement)
    // 创建 EffectComposer
    const composer = new EffectComposer(renderer);
    // 创建渲染 Pass
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass); // 添加渲染 Pass

    // 渲染循环
    function animate() {
        requestAnimationFrame(animate)
        controls.update();
        composer.render();
    }
    animate()
    return {
        scene,
        camera,
        renderer,
        composer
    }
}