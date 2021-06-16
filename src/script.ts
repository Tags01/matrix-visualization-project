import * as THREE from "three";
import {Sky as SkyShader} from "three/examples/jsm/objects/Sky";
import {OrbitControls} from "three/examples/jsm/controls/OrbitControls";
import * as Utils from "./utils";
import * as Textures from "./textures"

type Object3D = THREE.Object3D;
type Camera = THREE.Camera;

const renderer = new THREE.WebGLRenderer({
     canvas: Utils.$0("#threejs-canvas") as HTMLCanvasElement,
     antialias: true,
    failIfMajorPerformanceCaveat: true,
    powerPreference: "high-performance",
    precision: "lowp"
    });
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;
renderer.setSize(window.innerWidth/2, window.innerHeight)
const scene = new THREE.Scene();
scene.autoUpdate = false;
const group = new THREE.Group();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight / 2, 0.01, 1_000_000);
camera.position.set(1, 1, 1).multiplyScalar(20);
camera.lookAt(0, 0, 0);

scene.fog = new THREE.Fog(0xbbbbbb, 1);

const ambientLight = new THREE.AmbientLight(new THREE.Color(0x555555), 0.6);
const directionalLight = new THREE.DirectionalLight(new THREE.Color(0xeeeeee), 1);
directionalLight.position.set(1, 1, 1).multiplyScalar(45_000);
directionalLight.lookAt(0, 0, 0);

scene.add(ambientLight, directionalLight);

const geometries = [
    "BoxBufferGeometry", "CircleBufferGeometry", "ConeBufferGeometry",
    "CylinderBufferGeometry", "DodecahedronBufferGeometry", "IcosahedronBufferGeometry",
    "OctahedronBufferGeometry", "PlaneBufferGeometry", "RingBufferGeometry",
    "SphereBufferGeometry", "TetrahedronBufferGeometry", "TorusBufferGeometry",
    "TorusKnotBufferGeometry"
]

const textureArray = [
    Textures.water,
    Textures.nylon,
    Textures.wood
]
for (let index = 0; index < geometries.length; index++) {
    const geometry = new (<any>THREE)[geometries[index]](); // Don't worry about this.
    geometry.computeVertexNormals(true); // smooth lighting
    const mesh = new THREE.Mesh(geometry, textureArray[(index + 2) % 3].clone()); // puts the material on the geometry
    (<any>mesh.material).side = THREE.DoubleSide; 
    mesh.matrixWorld.setPosition(
        15 * Math.cos(index / 13 * Math.PI * 2),
        0,
        15 * Math.sin(index / 13 * Math.PI * 2) //places geometries in a circle
    );
    group.add(mesh)
}
scene.add(group)

//Sky setup

const sky = new SkyShader();
sky.matrixWorld.makeScale(15_000, 15_000, 15_000);
let uniforms = {
    turbidity: {value: 10},
    rayleigh: {value: 3},
    mieCoefficient: {value: 0.005},
    mieDirectionalG: {value: 0.7},
    elevation: {value: 2.7},
    azimuth: {value: 180},
    exposure: {value: renderer.toneMappingExposure},
    sunPosition: {value: new THREE.Vector3(0, Math.PI/4, 0)}
}
Object.assign(sky.material.uniforms, uniforms);

//Floor setup

let floorGeometry = new THREE.PlaneBufferGeometry(1, 1);
let floorMat = new THREE.Mesh(floorGeometry, Textures.floor);
floorMat.rotation.set(-Math.PI/2, 0, 0);
floorMat.position.set(0, -10, 0);
floorMat.scale.set(1_000, 1_000, 1_100);
floorMat.updateMatrixWorld();
scene.add(floorMat);
scene.add(<Object3D><unknown>sky);

//controls

let controls = new OrbitControls(<Camera>camera, renderer.domElement);
controls.maxDistance = 2_000;

//render loop

function render() {
    renderer.render(scene, camera);
    controls.update();
}

renderer.setAnimationLoop(render)

//raycasting. making objects clickable

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
let pickedObject: THREE.Object3D | null = null

//setup

const matrixEls = [...Utils.$('[data-matrix]')];
const positionEls = [...Utils.$('[data-position]')];
const scaleEls = [...Utils.$('[data-scale]')];
const rotationEls = [...Utils.$('[data-rotation]')];

const positionVec = new THREE.Vector3();
const scaleVec = new THREE.Vector3();
const rotationVec = new THREE.Euler();

//updating scene + input boxes

function handleInput(event: Event) {
    let element = event.target as HTMLElement
    if (element === null || pickedObject === null || element.contentEditable == undefined) return;
    if (element.dataset.matrix !== undefined) {
        const noNaNMatrix = Utils.parseElements(matrixEls, pickedObject.matrixWorld)
        if (!noNaNMatrix) return;
        positionVec.setFromMatrixPosition(pickedObject.matrixWorld);
        scaleVec.setFromMatrixScale(pickedObject.matrixWorld);
        rotationVec.setFromRotationMatrix(pickedObject.matrixWorld);
        Utils.putInGui(positionVec.toArray(), positionEls, 2);
        Utils.putInGui(scaleVec.toArray(), scaleEls, 2);
        Utils.putInGui(rotationVec.toArray(), rotationEls, 2);

    } else if (element.dataset.matrix === undefined) {
        const noNaNPosition = Utils.parseElements(positionEls, positionVec);
        const noNaNScale = Utils.parseElements(rotationEls, rotationVec);
        const noNaNRotation = Utils.parseElements(scaleEls, scaleVec);
        if (!noNaNPosition && !noNaNRotation && !noNaNScale) return;
        pickedObject.matrixWorld.compose(positionVec, new THREE.Quaternion().setFromEuler(rotationVec), scaleVec);
        Utils.putInGui(pickedObject.matrixWorld.elements, matrixEls, 2);
    }
    event.preventDefault();
    event.stopPropagation();
}

(<HTMLElement>Utils.$0("#left-container")).oninput = handleInput; //event bubbling input event

function pickObject(x: number, y: number) {
    mouse.set(
        (x / (0.5 * window.innerWidth)) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1,
    );

    raycaster.setFromCamera(mouse, camera);
    const selectedObject = raycaster.intersectObjects(group.children)[0];
    if (!selectedObject?.object) return;
    for (let object of group.children) {
        (<any>object).material.emissive.set(0x000000);
    }
    (<any>selectedObject.object).material.emissive.set(0x333333);

    pickedObject = selectedObject.object

    positionVec.setFromMatrixPosition(pickedObject.matrixWorld);
    scaleVec.setFromMatrixScale(pickedObject.matrixWorld);
    rotationVec.setFromRotationMatrix(pickedObject.matrixWorld);

    Utils.putInGui(pickedObject.matrixWorld.elements, matrixEls, 2);
    Utils.putInGui(positionVec.toArray(), positionEls, 2);
    Utils.putInGui(scaleVec.toArray(), scaleEls, 2);
    Utils.putInGui(rotationVec.toArray(), rotationEls, 2);

}

renderer.domElement.addEventListener("click", (event: MouseEvent) => {
    pickObject(event.clientX, event.clientY);
    event.preventDefault();
    event.stopPropagation();
});
renderer.domElement.addEventListener("touchstart", (event: TouchEvent) => {
    pickObject(event.touches[0].clientX, event.touches[0].clientY);
    event.preventDefault();
    event.stopPropagation();
}, {passive: true});

//making the advanced tab work

const buttonAdvanced = Utils.$0("#click-advanced") as HTMLElement;
const matrixRow4 = <HTMLElement[]><unknown>Utils.$(".advanced");

function toggleAdvanced(event: Event) {
    if (buttonAdvanced.style.backgroundColor === "") {
        buttonAdvanced.style.backgroundColor = "limegreen";
    } else {
        buttonAdvanced.style.backgroundColor = "";
    }
    for (let element of matrixRow4) {
        element.contentEditable = (!element.isContentEditable).toString();
    }
    event.preventDefault();
    event.stopPropagation();
}
buttonAdvanced.addEventListener("click", toggleAdvanced);
buttonAdvanced.addEventListener("touchstart", toggleAdvanced, {passive: true})


window.onresize = () => {
    renderer.setSize(window.innerWidth / 2, window.innerHeight);
    camera.aspect = window.innerWidth / (2*window.innerHeight);
    camera.updateProjectionMatrix();
}
