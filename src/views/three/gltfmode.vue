<template>
    <el-row>
        <el-col :span="18">
            <canvas id="canvas" ref="canvas" style="border: 1px solid;"></canvas>
        </el-col>
        <el-col :span="6">
            <h1>模型树</h1>
            <div style="height: 50vh;overflow: auto;">
                <el-tree :data="modelthree" node-key="id" :props="{
                    children: 'children',
                    label: 'name',
                }" :expand-on-click-node="false" :default-expanded-keys="[1]" @node-click="handleNodeClick">
                </el-tree>
            </div>
        </el-col>
    </el-row>

</template>

<script setup name="Index" lang="ts">
import * as THREE from 'three'
import { OutlinePass } from 'three/examples/jsm/postprocessing/OutlinePass.js';
import { loadModel, creatScene } from './ThreeHelper'
import { onMounted, ref } from 'vue';
const canvas = ref()
const modelthree = ref(new Array<THREE.Object3D>())
const data: {
    camera: THREE.PerspectiveCamera | null
    outlinePass: OutlinePass | null,
    scene: THREE.Scene | null
} = {
    camera: null,
    outlinePass: null,
    scene: null
}
const handleNodeClick = (obj: THREE.Object3D) => {
    if (!data.outlinePass) return; // 确保outlinePass已被初始化

    // 初始化一个数组来存储需要突出显示的Mesh对象
    let meshesToOutline: THREE.Mesh[] = [];
    // 定义一个递归函数来遍历Group内的所有对象
    const collectMeshes = (object: THREE.Object3D) => {


        if (object instanceof THREE.Mesh) {
            // 如果是Mesh对象，则直接添加到数组
            meshesToOutline.push(object);
        } else if (object instanceof THREE.Group) {
            // 如果是Group对象，则递归遍历其所有子对象
            for (let i = 0; i < object.children.length; i++) {
                collectMeshes(object.children[i]);
            }
        }
    };

    // 开始遍历，从传入的对象开始
    collectMeshes(obj);
    // 设置选中对象为收集到的所有Mesh对象
    data.outlinePass.selectedObjects = meshesToOutline;
}
function main() {
    const WIDTH = 800; // window.innerWidth
    const HEIGHT = 500; // window.innerHeight
    const { scene, camera, renderer, composer } = creatScene(canvas.value, { width: WIDTH, height: HEIGHT })
    data.scene = scene
    camera.position.z = 10
    camera.position.y = 2
    data.camera = camera

    // 添加光源
    const ambientLight = new THREE.AmbientLight(0xffffff, 20)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0xffffff, 5, 10)
    pointLight.position.set(50, 20, 30)
    camera.add(pointLight)

    // 创建轮廓效果Pass
    const v2 = new THREE.Vector2(WIDTH, HEIGHT);
    const outlinePass1 = new OutlinePass(v2, scene, camera);
    outlinePass1.edgeStrength = 3; // 描边宽度
    outlinePass1.edgeGlow = 0.5; // 边缘发光强度
    outlinePass1.visibleEdgeColor.set(new THREE.Color(0, 255, 0)); // 绿色描边
    composer.addPass(outlinePass1); // 添加轮廓效果 Pass
    data.outlinePass = outlinePass1

    const outlinePass = new OutlinePass(v2, scene, camera);
    outlinePass.edgeStrength = 3; // 描边宽度
    outlinePass.edgeGlow = 0.5; // 边缘发光强度
    outlinePass.visibleEdgeColor.set(new THREE.Color(255, 0, 0)); // 红色描边
    composer.addPass(outlinePass); // 添加轮廓效果 Pass
    loadModel('/zombies3d.glb').then(gltf => {
        const model = gltf.scene
        modelthree.value.push(model)
        model.scale.set(1, 2, 1)
        model.position.set(0, 0, 0)
        scene.add(model)
    })
    // 点击事件处理
    canvas.value.addEventListener("click", (event: MouseEvent) => {
        const mouse = new THREE.Vector2(
            (event.clientX / WIDTH) * 2 - 1,
            -(event.clientY / HEIGHT) * 2 + 1
        );
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects(scene.children, true);
        if (intersects.length > 0) {
            // 显示轮廓效果
            outlinePass.selectedObjects = [intersects[0].object];

            // 弹出标签
            const label = document.createElement('div');
            label.textContent = intersects[0].object.name;
            label.style.position = 'absolute';
            label.style.top = event.clientY + 'px';
            label.style.left = event.clientX + 'px';
            label.style.color = 'white';
            label.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
            label.style.padding = '5px';
            label.style.borderRadius = '5px';
            document.body.appendChild(label);

            setTimeout(() => {
                document.body.removeChild(label);
            }, 5000);
        } else {
            outlinePass.selectedObjects = [];
        }
    })


}

onMounted(() => {
    main()
})
</script>

<style scoped lang="scss"></style>