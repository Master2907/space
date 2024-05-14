import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import moonTextureMap from './public/moon.jpg'
import normalTextureMap from './public/normal.png'
import earthTextureMap from './public/earth.jpg'
import sunTextureMap from './public/sun.jpg'
import mercuryTextureMap from './public/mercury.jpg'
import venusTextureMap from './public/venus.jpg'
import marsTextureMap from './public/mars.jpg'
import jupiterTextureMap from './public/jupiter.jpg'
import saturnTextureMap from './public/saturn.jpg'
import saturnRingTextureMap from './public/saturn.jpg'

const scene = new THREE.Scene();

// CAMERA
var cameraLock = undefined;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.setZ(130);
camera.position.setX(130);
camera.position.setY(130);


// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

renderer.render(scene, camera)


// CONTROLS
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enablePan = false;
controls.minDistance = 40;
controls.maxDistance = 600;

// OBJECTS

// -- light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.05);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 20000, 10000)
scene.add(sunLight)

// HELPERS
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);


// Stars generator
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(600));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(600).fill().forEach(addStar);

function planetObjGenerator(size, segments, texture) {
  const objTexture = new THREE.TextureLoader().load(texture);
  const obj = new THREE.Mesh(
    new THREE.SphereGeometry(size, segments, segments),
    new THREE.MeshStandardMaterial({
      map: objTexture
    })
  )
  return obj;
}

// -- sun
const sunTexture = new THREE.TextureLoader().load(sunTextureMap)
const sun = new THREE.Mesh(
  new THREE.SphereGeometry(20, 128, 128),
  new THREE.MeshBasicMaterial({
    map: sunTexture
  })
);
sun.position.set(0, 0, 0)

scene.add(sun);

// -- earth
const earthObj = new THREE.Object3D();
scene.add(earthObj)
const earth = planetObjGenerator(6, 64, earthTextureMap)
earth.position.set(0, 0, 110)
earthObj.add(earth)

// const earthCamera = new THREE.Object3D();
// earth.add(earthCamera);
// camera.position.set(40,40,40)
// earthCamera.add(camera)




// -- moon
const moonObj = new THREE.Object3D();
earth.add(moonObj)
const moon = planetObjGenerator(1, 64, moonTextureMap);
moon.position.set(0, 0, 12)
moonObj.add(moon)


// -- mercury
const mercuryObj = new THREE.Object3D();
mercuryObj.rotateY(90)
scene.add(mercuryObj)
const mercury = planetObjGenerator(3, 64, mercuryTextureMap);
mercury.position.set(0, 0, 45)
mercuryObj.add(mercury)

// -- venus

const venusObj = new THREE.Object3D();
venusObj.rotateY(-45)
scene.add(venusObj);
const venus = planetObjGenerator(4, 64, venusTextureMap);
venus.position.set(0, 0, 75)
venusObj.add(venus)

// -- mars
const marsObj = new THREE.Object3D();
scene.add(marsObj);
const mars = planetObjGenerator(4.5, 64, marsTextureMap);
mars.position.set(0, 0, 145);
marsObj.add(mars);

// -- jupiter
const jupiterObj = new THREE.Object3D();
scene.add(jupiterObj);
const jupiter = planetObjGenerator(10, 64, jupiterTextureMap);
jupiter.position.set(0, 0, 180);
jupiterObj.add(jupiter);


// earthObj.add(camera)
// camera.position.set(10, 10, 120)

function getPosition(mesh){
  var position = new THREE.Vector3();
  position.setFromMatrixPosition(mesh.matrixWorld);
  return position
}



// ANIMATIONS
function animate() {
  requestAnimationFrame(animate);

  sun.rotateY(0.001)
  moonObj.rotateY(0.0012)
  
  earthObj.rotateY(0.003)
  earth.rotateY(0.0365)
  // earthCamera.rotateY(-0.0365)
  
  mercuryObj.rotateY(0.008)
  mercury.rotateY(0.01)
  
  venusObj.rotateY(0.01)
  venus.rotateY(0.01)
  
  marsObj.rotateY(0.005)
  
  jupiterObj.rotateY(0.001)
  
  if (cameraLock != undefined){
    const p = getPosition(cameraLock)
    camera.position.set(p.x+ 10, p.y + 10, p.z + 10)
  }
  
  
  renderer.render(scene, camera);
}

//Declare raycaster and mouse variables
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onMouseClick( event ) {
    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObjects( scene.children );
    for ( var i = 0; i < intersects.length; i++ ) {
        cameraLock = intersects[ i ].object;
        // intersects[ i ].object.material.color.set( 0xff0000 );
    }

}

window.addEventListener( 'click', onMouseClick, false );

animate()


