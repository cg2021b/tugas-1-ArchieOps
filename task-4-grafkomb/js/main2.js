/*
Loading Model
Shadow
*/

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';
import {OBJLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/OBJLoader.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/loaders/MTLLoader.js';


function main() {
  const canvas = document.querySelector('#myCanvas');
  const renderer = new THREE.WebGLRenderer({canvas});
  renderer.shadowMap.enabled = true;

  const fov = 45;
  const aspect = 2;  // the canvas default
  const near = 0.1;
  const far = 500;
  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(0, 20, 40);

  const controls = new OrbitControls(camera, canvas);
  controls.target.set(0, 5, 0);
  controls.update();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('black');

    // Texture lantai
  {
    const planeSize = 40;
    const loader = new THREE.TextureLoader();
    const texture = loader.load('https://threejsfundamentals.org/threejs/resources/images/checker.png');
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.receiveShadow = true;
    mesh.rotation.x = Math.PI * -.5;
    scene.add(mesh);
  }

//   Background Cube
  {
    const cubeSize = 40;
    const cubeGeo = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
    const cubeMat = new THREE.MeshPhongMaterial({
      color: 'grey',
      side: THREE.BackSide,
    });
    const mesh = new THREE.Mesh(cubeGeo, cubeMat);
    mesh.receiveShadow = true;
    mesh.position.set(0, cubeSize / 2 - 0.1, 0);
    scene.add(mesh);
  }

// Object Files
{
    const mtlLoader = new MTLLoader();
    // Left tree
    mtlLoader.load('object/tree.mtl', (mtl) => {
        mtl.preload();
        const objLoader = new OBJLoader();
        objLoader.setMaterials(mtl);
        objLoader.load('object/tree.obj', (root) => {
            // root.rotation.x = -Math.PI * .5;
            root.castShadow = true;
            root.receiveShadow = true;
            root.traverse( function ( child ) {
                if ( child instanceof THREE.Mesh ) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            } );
            root.position.x = -14;
            root.position.z = 0;
            root.scale.set(0.08, 0.08, 0.08);
            scene.add(root);
        });
    });

  //   // Right Tree
  //   mtlLoader.load('object/tree.mtl', (mtl) => {
  //     mtl.preload();
  //     const objLoader = new OBJLoader();
  //     objLoader.setMaterials(mtl);
  //     objLoader.load('object/tree.obj', (root) => {
  //         // root.rotation.x = -Math.PI * .5;
  //         root.castShadow = true;
  //         root.receiveShadow = true;
  //         root.traverse( function ( child ) {
  //             if ( child instanceof THREE.Mesh ) {
  //                 child.castShadow = true;
  //                 child.receiveShadow = true;
  //             }
  //         } );
  //         root.rotation.y = 3; 
  //         root.position.x = -2;
  //         root.position.z = -5;
  //         root.scale.set(0.08, 0.08, 0.08);
  //         scene.add(root);
  //     });
  // });

  // Right Bushes
  mtlLoader.load('object/bushes.mtl', (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('object/bushes.obj', (root) => {
        // root.rotation.x = -Math.PI * .5;
        root.castShadow = true;
        root.receiveShadow = true;
        root.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        root.rotation.y = -0.4 ;
        root.position.x = 10;
        root.position.z = -2;
        root.scale.set(1.5, 1.5, 1.5);
        scene.add(root);
    });
  });

  // Left Bushes
  mtlLoader.load('object/bushes.mtl', (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('object/bushes.obj', (root) => {
        // root.rotation.x = -Math.PI * .5;
        root.castShadow = true;
        root.receiveShadow = true;
        root.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        root.rotation.y = -0.4 ;
        root.position.x = 6;
        root.position.z = -4;
        root.scale.set(1.5, 1.5, 1.5);
        scene.add(root);
    });
  });

    mtlLoader.load('object/medieval-house-2.mtl', (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load('object/medieval-house-2.obj', (root) => {
          // root.rotation.x = -Math.PI * .5;
          root.castShadow = true;
          root.receiveShadow = true;
          root.traverse( function ( child ) {
              if ( child instanceof THREE.Mesh ) {
                  child.castShadow = true;
                  child.receiveShadow = true;
              }
          } );
          root.rotation.y = 0.4 ;
          root.position.y = 1;
          root.position.x = -10;
          root.position.z = -8;
          scene.add(root);
      });
  });

  mtlLoader.load('object/old-house.mtl', (mtl) => {
    mtl.preload();
    const objLoader = new OBJLoader();
    objLoader.setMaterials(mtl);
    objLoader.load('object/old-house.obj', (root) => {
        // root.rotation.x = -Math.PI * .5;
        root.castShadow = true;
        root.receiveShadow = true;
        root.traverse( function ( child ) {
            if ( child instanceof THREE.Mesh ) {
                child.castShadow = true;
                child.receiveShadow = true;
            }
        } );
        root.rotation.y = -0.4 ;
        root.position.x = 10;
        root.position.z = -8;
        scene.add(root);
    });
});

    
  }

//  Generate Color GUI
  class ColorGUIHelper {
    constructor(object, prop) {
      this.object = object;
      this.prop = prop;
    }
    get value() {
      return `#${this.object[this.prop].getHexString()}`;
    }
    set value(hexString) {
      this.object[this.prop].set(hexString);
    }
  }

//   Genertate Position GUI
  function makeXYZGUI(gui, vector3, name, onChangeFn) {
    const folder = gui.addFolder(name);
    folder.add(vector3, 'x', -10, 10).onChange(onChangeFn);
    folder.add(vector3, 'y', 0, 10).onChange(onChangeFn);
    folder.add(vector3, 'z', -10, 10).onChange(onChangeFn);
    // folder.open();
  }

//   Set lighting
  {
    const color = 0xFFFFFF;
    const intensity = 1;
    const light = new THREE.PointLight(color, intensity);
    light.castShadow = true;
    light.shadow.mapSize.set(2048,2048);
    light.position.set(10, 10, 10);
    scene.add(light);

    const helper = new THREE.PointLightHelper(light);
    scene.add(helper);

    function updateCamera() {
    }

    class MinMaxGUIHelper {
      constructor(obj, minProp, maxProp, minDif) {
        this.obj = obj;
        this.minProp = minProp;
        this.maxProp = maxProp;
        this.minDif = minDif;
      }
      get min() {
        return this.obj[this.minProp];
      }
      set min(v) {
        this.obj[this.minProp] = v;
        this.obj[this.maxProp] = Math.max(this.obj[this.maxProp], v + this.minDif);
      }
      get max() {
        return this.obj[this.maxProp];
      }
      set max(v) {
        this.obj[this.maxProp] = v;
        this.min = this.min;  // this will call the min setter
      }
    }

    // Generate all GUI into one object
    const gui = new GUI();
    gui.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    gui.add(light, 'intensity', 0, 2, 0.01);
    gui.add(light, 'distance', 0, 40).onChange(updateCamera);

    // GUI Folder shadowCamera
    {
      const folder = gui.addFolder('Shadow Camera');
      folder.open();
      const minMaxGUIHelper = new MinMaxGUIHelper(light.shadow.camera, 'near', 'far', 0.1);
      folder.add(minMaxGUIHelper, 'min', 0.1, 50, 0.1).name('near').onChange(updateCamera);
      folder.add(minMaxGUIHelper, 'max', 0.1, 50, 0.1).name('far').onChange(updateCamera);
    }

    makeXYZGUI(gui, light.position, 'position', updateCamera);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }

  function render() {

    resizeRendererToDisplaySize(renderer);

    {
      const canvas = renderer.domElement;
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
    }

    renderer.render(scene, camera);
    renderer.shadowMapType = THREE.PCFSoftShadowMap;

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
