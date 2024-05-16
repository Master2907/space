import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import gsap from 'gsap'

import moonTextureMap from './public/moon.jpg'
import normalTextureMap from './public/normal.png'
import earthTextureMap from './public/earth.jpg'
import sunTextureMap from './public/sun.jpg'
import mercuryTextureMap from './public/mercury.jpg'
import venusTextureMap from './public/venus.jpg'
import marsTextureMap from './public/mars.jpg'
import jupiterTextureMap from './public/jupiter.jpg'
import saturnTextureMap from './public/saturn.jpg'
import saturnRingTextureMap from './public/saturn_ring.png'
import uranusTextureMap from './public/uranus.jpg'
import neptunTextureMap from './public/neptun.jpg'

const scene = new THREE.Scene();
// DOM elements 
const cameraResetBtn = document.querySelector('.resetCamera')
const objectNameDiv = document.querySelector('.objectName')

// CAMERA
var cameraLock = undefined;

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(150, 150, 150);

// RENDERER
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

window.onresize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
}

// CONTROLS
var controls = new OrbitControls(camera, renderer.domElement);
controls.enablePan = false;
controls.minDistance = 40;
controls.maxDistance = 600;

// OBJECTS

// -- light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.03);
scene.add(ambientLight);

const sunLight = new THREE.PointLight(0xffffff, 25000, 10000)
scene.add(sunLight)


// HELPERS
const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

// Stars generator
function addStar() {
  const geometry = new THREE.SphereGeometry(0.3, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(700).fill().forEach(addStar);

function planetObjGenerator(size, segments, texture) {
  const objTexture = new THREE.TextureLoader().load(texture);
  const obj = new THREE.Mesh(
    new THREE.SphereGeometry(size, segments, segments),
    new THREE.MeshStandardMaterial({
      map: objTexture
    }));
  obj.clickable = true;
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
sun.clickable = true;
sun.position.set(0, 0, 0);
sun.nameInfo = 'Sun';
scene.add(sun);

// -- earth
const earthObj = new THREE.Object3D();
scene.add(earthObj)
const earth = planetObjGenerator(6, 64, earthTextureMap)
earth.position.set(0, 0, 110)
earth.nameInfo = 'Earth';
earthObj.add(earth)
console.log(earth)

// -- moon
const moonObj = new THREE.Object3D();
earth.add(moonObj)
const moon = planetObjGenerator(1, 64, moonTextureMap);
moon.position.set(0, 0, 12)
moon.nameInfo = 'Moon';
moonObj.add(moon)


// -- mercury
const mercuryObj = new THREE.Object3D();
mercuryObj.rotateY(90)
scene.add(mercuryObj)
const mercury = planetObjGenerator(3, 64, mercuryTextureMap);
mercury.position.set(0, 0, 45)
mercury.nameInfo = 'Mercury';
mercuryObj.add(mercury)

// -- venus
const venusObj = new THREE.Object3D();
venusObj.rotateY(-45)
scene.add(venusObj);
const venus = planetObjGenerator(4, 64, venusTextureMap);
venus.position.set(0, 0, 75);
venus.nameInfo = 'Venus'
venusObj.add(venus)

// -- mars
const marsObj = new THREE.Object3D();
scene.add(marsObj);
const mars = planetObjGenerator(4.5, 64, marsTextureMap);
mars.position.set(0, 0, 145);
mars.nameInfo = 'Mars';
marsObj.add(mars);

// -- jupiter
const jupiterObj = new THREE.Object3D();
scene.add(jupiterObj);
const jupiter = planetObjGenerator(10, 64, jupiterTextureMap);
jupiter.position.set(0, 0, 180);
jupiter.nameInfo = 'Jupiter';
jupiterObj.add(jupiter);


// -- saturn
const saturnObj = new THREE.Object3D();
scene.add(saturnObj)
const saturn = planetObjGenerator(8, 64, saturnTextureMap);
saturn.position.set(0, 0, 220);
saturn.nameInfo = 'Saturn'
saturnObj.add(saturn)

const saturnRingTexture = new THREE.TextureLoader().load(saturnRingTextureMap);
const saturnRing = new THREE.Mesh(
  new THREE.RingGeometry(13, 16, 64),
  new THREE.MeshStandardMaterial({side: THREE.DoubleSide, map: saturnRingTexture})
)


saturnRing.rotation.x = Math.PI / 2 - 0.5;
saturnRing.rotation.y = -0.1;
saturn.add(saturnRing)

// -- uranus
const uranusObj = new THREE.Object3D();
scene.add(uranusObj);
const uranus = planetObjGenerator(5, 64, uranusTextureMap);
uranus.position.set(0, 0, 260);
uranus.nameInfo = 'Uranus'
uranusObj.add(uranus);

// -- neptun
const neptunObj = new THREE.Object3D();
scene.add(neptunObj);
const neptun = planetObjGenerator(9, 64, neptunTextureMap);
neptun.position.set(0, 0, 300);
neptun.nameInfo = 'Neptun';
neptunObj.add(neptun);

// Lines

function generateLine(sizes) {
  for (let i = 0; i < sizes.length; i++) {
    let radius = sizes[i];
    const line = new THREE.Mesh(
      new THREE.RingGeometry(radius, radius + 0.5, 128),
      new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    )
    line.rotation.x = Math.PI / 2;
    scene.add(line)
  }
}
generateLine([45, 75, 110, 145, 180, 220, 260, 300])

// Features

function getCameraPositionDiff(sphere) {
  return 3 * sphere.geometry.parameters.radius
}

function animateCamera(p, diff) {
  gsap.to(camera.position, {
    x: p.x + diff,
    y: p.y + diff,
    z: p.z + diff,
    duration: 0.5,
    onUpdate: function () {
      camera.lookAt(p.x, p.y, p.z)
    }
  })
}

function getCenterPoint(mesh) {
  var middle = new THREE.Vector3();
  var geometry = mesh.geometry;

  geometry.computeBoundingBox();

  middle.x = (geometry.boundingBox.max.x + geometry.boundingBox.min.x) / 2;
  middle.y = (geometry.boundingBox.max.y + geometry.boundingBox.min.y) / 2;
  middle.z = (geometry.boundingBox.max.z + geometry.boundingBox.min.z) / 2;

  mesh.localToWorld(middle);
  return middle;
}


//Declare raycaster and mouse variables
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2();

function onClickEvent(mouse) {
  raycaster.setFromCamera(mouse, camera);
  var intersects = raycaster.intersectObjects(scene.children);

  for (var i = 0; i < intersects.length; i++) {
    console.log(intersects[i])
    if (intersects[i].object.clickable) {
      cameraLock = intersects[i].object;
      if (intersects[i].object.nameInfo) {
        objectNameDiv.querySelector('p').innerHTML = intersects[i].object.nameInfo;
        objectNameDiv.classList.add('visible');
      }
      cameraResetBtn.removeAttribute('hidden');
      controls.enabled = false;
    }
  }
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  onClickEvent(mouse)
}

function onMobileClick(event) {
  mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.touches[0].clientY / window.innerHeight) * 2 + 1;

  onClickEvent(mouse)
}

window.addEventListener("click", onMouseClick, false);
window.addEventListener("touchstart", onMobileClick, false);

cameraResetBtn.addEventListener('click', () => {
  cameraLock = undefined;
  cameraResetBtn.setAttribute('hidden', '');
  objectNameDiv.classList.remove('visible');
  gsap.to(camera.position, {
    x: 150,
    y: 150,
    z: 150,
  })
  controls.enabled = true;
})

// ANIMATIONS
function animate() {
  requestAnimationFrame(animate);

  sun.rotateY(0.001)
  moonObj.rotateY(0.0012)

  earthObj.rotateY(0.003)
  earth.rotateY(0.0365)

  mercuryObj.rotateY(0.008)
  mercury.rotateY(0.01)

  venusObj.rotateY(0.01)
  venus.rotateY(0.01)

  marsObj.rotateY(0.005)
  mars.rotateY(0.01)

  jupiterObj.rotateY(0.002)
  jupiter.rotateY(0.01)

  saturnObj.rotateY(0.001)
  saturn.rotateY(0.0005)

  uranusObj.rotateY(0.001)

  neptunObj.rotateY(0.0005)

  if (cameraLock != undefined) {
    const diff = getCameraPositionDiff(cameraLock);
    const p = getCenterPoint(cameraLock)
    animateCamera(p, diff)
  }

  renderer.render(scene, camera);
}
animate()
