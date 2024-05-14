import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
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
import saturnRingTextureMap from './public/saturn.jpg'

const scene = new THREE.Scene();
// DOM elements 
const cameraResetBtn = document.querySelector('.resetCamera')

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


// Lines

function generateLine(sizes) {
  for (let i = 0; i < sizes.length; i++) {
    let radius = sizes[i];
    const line = new THREE.Mesh(
      new THREE.RingGeometry(radius, radius + 0.5, 128),
      new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.DoubleSide })
    )
    line.rotateX(1.55)
    scene.add(line)
  }
}
generateLine([45, 75, 110, 145, 180])

// Features

function getCameraPositionDiff(sphere) {
  const radius = sphere.geometry.parameters.radius
  return 3 * radius
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
    cameraLock = intersects[i].object;
    cameraResetBtn.removeAttribute('hidden');
    controls.enabled = false;
  }
}

function onMouseClick(event) {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

  onClickEvent(intersects)
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

  if (cameraLock != undefined) {
    const diff = getCameraPositionDiff(cameraLock);
    const p = getCenterPoint(cameraLock)
    animateCamera(p, diff)
  }

  renderer.render(scene, camera);
}
animate()
