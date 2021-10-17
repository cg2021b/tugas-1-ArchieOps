// Use Playground

import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x151515);
 
// Handler total object
let objectTotal = 32;

// Function Randomize
let randomizeNum = function(from, to){
    let x = Math.random() * (to - from);
    return x + from;
}

// Generate object ke scene, warna random. 
const generateObject = function(obj, col){
    let rColor = [];
    let gColor = [];
    let bColor = [];
    for(let j = 0;j < col; j++){
        rColor.push(randomizeNum(60, 240));
        gColor.push(randomizeNum(60, 240));
        bColor.push(randomizeNum(60, 240));
    }

    let geometry = new THREE.BoxGeometry(3, 3, 3);
    for(let i = 0; i < obj; i++){
        let material = new THREE.MeshStandardMaterial({
            roughness: 1.0,
        });
        let j = i % rColor.length;
        let color = new THREE.Color("rgb(" + Math.floor(rColor[j]) + ","
        + Math.floor(gColor[j]) + "," + Math.floor(bColor[j]) + ")");
        material.color.set(color);

        let cube = new THREE.Mesh(geometry, material);
        cube.position.set(randomizeNum(-20, 20), randomizeNum(-20, 20), randomizeNum(-20, 20));
        scene.add(cube);
    }
}


// Inisiasi Generate Object
generateObject(32, 6);


// Set Lighting 
const directionalLightTop = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLightTop.position.set(0, 30, 0);
scene.add(directionalLightTop);

const directionalLightFront = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLightFront.position.set(0, 0, -30);
scene.add(directionalLightFront);

const directionalLightBack = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLightBack.position.set(0, 0, 30);
scene.add(directionalLightBack);

const directionalLightLeft = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLightLeft.position.set(-30, 0, 0);
scene.add(directionalLightLeft);

const directionalLightRight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLightRight.position.set(30, 0, 0);
scene.add(directionalLightRight);

// Window Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
    // Resize Window
window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
})


// Set Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 1, 1000);
camera.position.set(0, 20, 40);
scene.add(camera);

// Controls (Orbit)
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

//  Renderer Scene
 const renderer = new THREE.WebGLRenderer({
     canvas: canvas
 });
 renderer.setSize(sizes.width, sizes.height);
 renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
 renderer.shadowMap.enabled = true;
 renderer.shadowMap.type = THREE.PCFSoftShadowMap; 

// Konstanta / varibel yang digunakan
const currentScoreElement = document.getElementById("currentScore");
const currentObjectElement = document.getElementById("currentObject");
const rightScore = 50;
const wrongScore = -20;

let currentScore = 0;
let selectedObject = [];
let originalColors = [];

// Fungsi analisis hasil pick objec 
 const disposeObject = () => {
    //  Ambil hex 2 objek untuk dicocokin warnanya
     let first = selectedObject[0].material.color.getHex();
     let second = selectedObject[1].material.color.getHex();
    
    //  Kalau nilainya sama (warnanya sama), hapus dari scene
     if (first === second) {
         selectedObject.forEach(object => {
             object.geometry.dispose();
             object.material.dispose();
             scene.remove(object);
             renderer.renderLists.dispose();
         });
        //  Tambah score
         currentScore += rightScore;
        //  Kurangin jumlah objek pada layar
         objectTotal -= 2;
     } 
     
     else {
        //  Kalau salah kurangin score
        currentScore += wrongScore;
        selectedObject[0].material.color.setHex(originalColors[0]);
     }

     currentScoreElement.innerHTML = currentScore;   
     selectedObject = [];
     originalColors = [];
 }
 

const rayCast = new THREE.Raycaster();
const mouse = new THREE.Vector2();

const onMouseClick = (e) => {
    mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
    mouse.y = - (e.clientY / window.innerHeight) * 2 + 1;
    rayCast.setFromCamera(mouse, camera);

    let intersects = rayCast.intersectObjects(scene.children, false);

    // Kalau objek ke pick...
    if (intersects[0]) {
        let firstObject = intersects[0].object;
        
        // Kalau sebelumnya udah pick 1 object, cek yang diklik objek yang sama atau bukan
        if (selectedObject.length > 0) {
            if (firstObject.uuid === selectedObject[0].uuid) {
                firstObject.material.color.setHex(originalColors[0]);
                selectedObject = [];
                originalColors = [];
                return;
            }
        }
        
        // Kalau belum ada objek, push ke list
        selectedObject.push(firstObject);
        originalColors.push(firstObject.material.color.getHex());
        // Kalau udah ada 2 objek, jalanin logika dispose (bener warnanya atau nggak)
        if (selectedObject.length > 1) {
            disposeObject();
        }
    }
}

document.addEventListener("click", onMouseClick);

const clock = new THREE.Clock();

let treeshold = 0; // variabel bantuan
let speed = 0.002; // tambahan kecepatan
const baseSpeed = 0.002; // kecepatan penambahan looping pertama

const tick = () => {    

currentObjectElement.innerText = objectTotal;
// Kalau sudah lebih dari >=60, threshold 0 (supaya gk generate lagi)
    if (objectTotal >= 60) {
        treeshold = 0;
    } 
    else {
        // Kalau gk, tambah terus thresholdnya
        treeshold += speed;
    }
    
//   Kalau belum sampe batas objek, makin lama makin cepet generatenya
    if (treeshold > 1) {
        generateObject(2, 1);
        treeshold = 0;
        speed += 0.002;
        objectTotal += 2;
    }

    // Warna kedap kedipnya
    const elapsedTime = clock.getElapsedTime();
    if (selectedObject.length > 0) {
        selectedObject[0].material.emissive.setHex(
            (elapsedTime % 0.5 >= 0.25) ? originalColors[0] : 0x000000
        );
    }

    renderer.render(scene, camera)
    window.requestAnimationFrame(tick)
}
tick()