import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(80);
camera.position.setY(10);
camera.position.setX(20);

renderer.render(scene, camera)

//creacion del planeta
const textura = new THREE.TextureLoader().load('planetal.png');

const planeta = new THREE.Mesh(
    new THREE.SphereGeometry( 4.50, 64, 64 ),
    new THREE.MeshStandardMaterial( {
      map: textura,
      displacementMap: textura,
      displacementScale: 0.2,
      bumpMap: textura,
      
    } )
);

scene.add(planeta);

//objetos multiples con textura
const starTexture = new THREE.TextureLoader().load('estrellas.jpg');

function addStar(){
  const geometry = new THREE.SphereGeometry(0.25, 64, 64); // Asegúrese de que los segmentos sean suficientes para que la textura se vea bien
  const material = new THREE.MeshStandardMaterial({
    map: starTexture,
    bumpMap: starTexture,
    displacementMap: starTexture,
      displacementScale: 0.02
  });
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));
  
  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);


  
// Luz Primaria
const sun = new THREE.DirectionalLight(0xFFA07A, 6, 50);
sun.position.set(-90, 30, -10);
scene.add(sun);

/*// Helper para light1
const light1Helper = new THREE.PointLightHelper(light1);
scene.add(light1Helper);*/


/**/

/*// Tercera luz - Punto de luz
const light3 = new THREE.PointLight(0xFFA07A, 100, 100);
light3.position.set(-10, -10, 10);
scene.add(light3);*/

/*// Helper para light3
const light3Helper = new THREE.PointLightHelper(light3);
scene.add(light3Helper);*/

// Nueva luz - Luz direccional
const directionalLight = new THREE.DirectionalLight(0xFFA07A, 0.1);
directionalLight.position.set(0, -1, 0);
scene.add(directionalLight);

//control de camara
const controls = new OrbitControls(camera, renderer.domElement);

/*// Crear un GridHelper
// Los parámetros son (tamaño del grid, número de divisiones, color de las líneas principales, color de las líneas secundarias)
const size = 200;
const divisions = 10;
const gridHelper = new THREE.GridHelper(size, divisions, 0x00ff00, 0x808080);

// Agregar el GridHelper a la escena
scene.add(gridHelper);*/


//sonido
const listener = new THREE.AudioListener();
camera.add(listener);

// creando fuente de sonido posicional
const sound = new THREE.PositionalAudio(listener);

// cargando un archivo de sonido
const audioLoader = new THREE.AudioLoader();
audioLoader.load('space.mp3', function(buffer) {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.2);
  sound.play();
});

planeta.add(sound);

// configuracion del sonido a la distancia
sound.setRefDistance(20); // Distancia a la que el sonido es más fuerte
sound.setRolloffFactor(1); // Cómo decrece el volumen con la distancia


//scroll animation
planeta.position.z = -0.1;
planeta.position.setX(11);

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  planeta.rotation.x += 0.05;
  planeta.rotation.y += 0.075;
  planeta.rotation.z += 0.05;

  // Asegúrate de que estos valores sean lo suficientemente grandes como para notar el cambio
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
  
  console.log(camera.position.z); // Esto te ayudará a entender si se están aplicando los cambios
}

document.body.onscroll = moveCamera;


//animacion
function animate() {
  requestAnimationFrame( animate );

  planeta.rotation.y += 0.002;
  planeta.rotation.x += 0.000;
  planeta.rotation.z += 0.000;
  
  //refresco del control de camara
  controls.update();


  renderer.render(scene, camera);
}

animate();


