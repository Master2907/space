import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import moonTextureMap from './public/moon.jpg'
import normalTextureMap from './public/normal.png'
import earthTextureMap from './public/earth.jpg'
import sunTextureMap from './public/sun.jpg'
import mercuryTextureMap from './public/mercury.jpg'

const scene = new THREE.Scene();

// CAMERA
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
controls.enablePan = false;
controls.minDistance = 40;
controls.maxDistance = 600;

// OBJECTS

// -- light
const ambientLight = new THREE.AmbientLight(0xffffff);
// scene.add(ambientLight);

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

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(300).fill().forEach(addStar);

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
earth.position.set(0, 0, 85)
earthObj.add(earth)

// -- moon
const moonObj = new THREE.Object3D();
earth.add(moonObj)
const moon = planetObjGenerator(2, 64, moonTextureMap);
moon.position.set(0, 0, 15)
moonObj.add(moon)


// -- mercury
const mercuryObj = new THREE.Object3D();
mercuryObj.rotateY(90)
scene.add(mercuryObj)
const mercury = planetObjGenerator(4, 64, mercuryTextureMap);
mercury.position.set(0, 0, 45)
mercuryObj.add(mercury)

// ANIMATIONS
function animate() {
  requestAnimationFrame(animate);

  sun.rotateY(0.001)
  moonObj.rotateY(0.0012)

  earthObj.rotateY(0.002)
  earth.rotateY(0.0365)

  mercuryObj.rotateY(0.005)
  mercury.rotateY(0.02)

  renderer.render(scene, camera);
}

animate()


