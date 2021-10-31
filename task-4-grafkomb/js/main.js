/*  Control [Done]
    Texture [Done]
    Panorama [Done]
    Fog [Done]
    Realistic reflective [Done]
*/
import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/build/three.module.js';
import {OrbitControls} from 'https://threejsfundamentals.org/threejs/resources/threejs/r132/examples/jsm/controls/OrbitControls.js';
import {GUI} from 'https://threejsfundamentals.org/threejs/../3rdparty/dat.gui.module.js';

function main() {
    const canvas = document.querySelector('#myCanvas');
    const renderer = new THREE.WebGLRenderer({canvas});
    const gui = new GUI();
  
    const fov = 75;
    const aspect = 2;  // the canvas default
    const near = 0.1;
    const far = 50;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    let sphereCamera;

    camera.position.z = 6;
    camera.position.y = 0;
    camera.position.x = 1;
  
    const controls = new OrbitControls(camera, canvas);
    controls.target.set(0, 0, 0);
    controls.update();
    
    const scene = new THREE.Scene();

    // Mirror Sphere
    {   
        const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256, { format: THREE.RGBFormat, generateMipmaps: true, minFilter: THREE.LinearMipmapLinearFilter } );

        sphereCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
        sphereCamera.position.set(0, 0, -1);
        scene.add(sphereCamera);
        let sphereMaterial = new THREE.MeshBasicMaterial({envMap: sphereCamera.renderTarget});
        let sphereGeo =  new THREE.SphereGeometry(1, 32, 16);
        let mirrorSphere = new THREE.Mesh(sphereGeo, sphereMaterial);
        mirrorSphere.position.set(0, 0, -1);
        scene.add(mirrorSphere);
    }

    // Fog Controller

    // We use this class to pass to dat.gui
    // so when it manipulates near or far
    // near is never > far and far is never < near
    // Also when dat.gui manipulates color we'll
    // update both the fog and background colors.
    class FogGUIHelper {
        constructor(fog, backgroundColor) {
            this.fog = fog;
            this.backgroundColor = backgroundColor;
        }
        get near() {
            return this.fog.near;
        }
        set near(v) {
            this.fog.near = v;
            this.fog.far = Math.max(this.fog.far, v);
        }
        get far() {
            return this.fog.far;
        }
        set far(v) {
            this.fog.far = v;
            this.fog.near = Math.min(this.fog.near, v);
        }
        get color() {
            return `#${this.fog.color.getHexString()}`;
        }
        set color(hexString) {
            this.fog.color.set(hexString);
            this.backgroundColor.set(hexString);
        }
    }

    // Add the GUI constant to the scene
    {
        const near = 1;
        const far = 50;
        const color = 0xb9d5df;
        scene.fog = new THREE.Fog(color, near, far);
        scene.background = new THREE.Color(color);
       
        
        const folder = gui.addFolder('Fog');
        folder.open();
        const fogGUIHelper = new FogGUIHelper(scene.fog, scene.background);
        folder.add(fogGUIHelper, 'near', near, far).listen();
        folder.add(fogGUIHelper, 'far', near, far).listen();
        folder.addColor(fogGUIHelper, 'color');
      }


    // Light Function
    {
      const color = 0xFFFFFF;
      const intensity = 1;
      const light = new THREE.DirectionalLight(color, intensity);
      light.position.set(10, 10, 8);
      scene.add(light);
    //   const lightHelper = new THREE.DirectionalLightHelper(light, 3);
    //   scene.add(lightHelper);
    }
    
    const boxWidth = 1;
    const boxHeight = 1;
    const boxDepth = 1;
    const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);
    const loader = new THREE.TextureLoader();

    // List of Texture use
    const materials = [
        new THREE.MeshBasicMaterial({map: loader.load('images/red_brick.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('images/metal.jpg')}),
        new THREE.MeshBasicMaterial({map: loader.load('images/bamboo.jpg')}),
      ];

    // Function generate basic material
    function makeInstanceTexture(geometry, texture, x, y, z) {
        // const material = new THREE.MeshPhongMaterial({color});
    
        const cube = new THREE.Mesh(geometry, texture);
        scene.add(cube);
    
        cube.position.x = x;
        cube.position.y = y;
        cube.position.z = z;
        return cube;
  
      }
  
    const cubes = [
      makeInstanceTexture(geometry, materials[2], -3, 0, -0.5),
      makeInstanceTexture(geometry, materials[1],  3, 0, -1.5),
      makeInstanceTexture(geometry, materials[0], 0, -3, -1),
    ];
    
    // Function adding panorama background
    {
      const texture = loader.load(
        'images/background.jpg',
        () => {
          const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
          rt.fromEquirectangularTexture(renderer, texture);
          scene.background = rt.texture;
        });
    }
    
    // Function resize window
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
    
    // Renderer function, function per tick
    function render(time) {
      time *= 0.001;
  
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
      

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rot = time * speed;
        cube.rotation.x = rot;
        cube.rotation.y = rot;
      });
  
      renderer.render(scene, camera);
      sphereCamera.updateCubeMap(renderer, scene);
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  }
  
  main();