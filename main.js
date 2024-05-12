import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

import moonTextureMap from './public/moon.jpg'
import spaceTextureMap from './public/space.jpg'
import normalTextureMap from './public/normal.png'
import earthTextureMap from './public/earth.jpg'

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#webgl'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

renderer.render(scene, camera)

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshStandardMaterial({
  color: 0xFF6347,
});

const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

const pointLight = new THREE.PointLight(0xffffff, 100, 100);
pointLight.position.set(5, 3, 3);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const lightHelper = new THREE.PointLightHelper(pointLight);
// scene.add(lightHelper)

const gridHelper = new THREE.GridHelper(200, 50);
// scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);


function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(400));

  star.position.set(x, y, z);
  scene.add(star)
}

Array(300).fill().forEach(addStar);


const spaceTexture = new THREE.TextureLoader().load(spaceTextureMap);


const moonTexture = new THREE.TextureLoader().load(moonTextureMap)
const normalTexture = new THREE.TextureLoader().load(normalTextureMap)
const moon = new THREE.Mesh(
  new THREE.SphereGeometry(3, 64, 64),
  new THREE.MeshStandardMaterial({
    map: moonTexture,
    normalMap: normalTexture
  })
);

const earthTexture = new THREE.TextureLoader().load(earthTextureMap)
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(12, 64, 64),
  new THREE.MeshStandardMaterial({
    map: earthTexture
  })
)
earth.position.set(15, 0, 15)

function clickHandler() {
  console.log('Click')
}

earth.callback = clickHandler;
scene.add(earth)

scene.add(moon)



function animate() {
  requestAnimationFrame(animate);

  moon.rotation.y += 0.005;
  earth.rotation.y += 0.001;
  controls.update();

  renderer.render(scene, camera);
}

animate()


