import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';



const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);
camera.position.setZ(30);
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

// Cargar el mapa de emisión
const luzNoche = new THREE.TextureLoader().load('luzNoche.png');

//capa luces nocturnas
const ciudades = new THREE.Mesh(
    new THREE.SphereGeometry(4.45, 64, 64 ),
    new THREE.MeshStandardMaterial( {
       // configuracion luces nocturnas
       map: luzNoche,
       displacementMap: luzNoche,
       displacementScale: 0.2,
       bumpMap: luzNoche,
       transparent: true,
       emissive : new THREE.Color(0x8A2BE2),
     
    })
);
scene.add(ciudades);


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

//fondo de estrellas
const fondoEstrellas = new THREE.TextureLoader().load('2k_stars.jpg');
scene.background = fondoEstrellas;
  
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
  sound.setLoop(false);
  sound.setVolume(0.2);
});

planeta.add(sound);

// configuracion del sonido a la distancia
sound.setRefDistance(20); // Distancia a la que el sonido es más fuerte
sound.setRolloffFactor(1); // Cómo decrece el volumen con la distancia


//posicion del planeta  
planeta.position.z = -0.1;
planeta.position.setX(11);
ciudades.position.z = -0.1;
ciudades.position.setX(11);



//funciones

function animate() {
  requestAnimationFrame(animate);

  // Rotación continua del planeta
  planeta.rotation.y += 0.002;
  ciudades.rotation.y += 0.002;
  
 // Actualizar la intensidad de la emisión basada en la posición del sol y del planeta
 updateCityLightsIntensity();

 controls.update();
 renderer.render(scene, camera);

}

function moveCamera() {
  const t = document.body.getBoundingClientRect().top;

  // Ajustar la posición de la cámara basada en el scroll
  camera.position.z = t * -0.01;
  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
}

document.body.onscroll = moveCamera;

function updateCityLightsIntensity() {
  const sunDirection = new THREE.Vector3().subVectors(sun.position, planeta.position).normalize();
  const planetPosition = new THREE.Vector3().copy(planeta.position).normalize();

  // Calcular el producto punto
  const dot = sunDirection.dot(planetPosition);

  // Ajustar la intensidad de las luces de la ciudad
  // Queremos que la intensidad sea mayor cuando el 'dot' es negativo (parte trasera del planeta)
  ciudades.material.emissiveIntensity = (dot < 0) ? 3 : -1; 
}

function onDocumentClick(){
  sound.play();
}
document.addEventListener('click', onDocumentClick);

animate();


