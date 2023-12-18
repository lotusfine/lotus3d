import './style.css'

import * as THREE from 'three';

import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import TWEEN, { Tween } from 'tween';


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#bg'),
  antialias: true,
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize( window.innerWidth, window.innerHeight);

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
//const directionalLight = new THREE.DirectionalLight(0xFFA07A, 0.1);
//directionalLight.position.set(0, -1, 0);
//scene.add(directionalLight);

//control de camara
const controls = new OrbitControls(camera, renderer.domElement);
controls.enabled = false;

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
    sound.setRefDistance(20);
    sound.setRolloffFactor(1);
    planeta.add(sound);
});

// Estado inicial del sonido
let isSoundOn = false;

// Botón de control de sonido
const soundToggleButton = document.getElementById('sound-toggle');
soundToggleButton.addEventListener('click', function() {
    isSoundOn = !isSoundOn;
    if (isSoundOn) {
        sound.play();
        this.classList.add('sound-on');
        this.textContent = 'Sound Off';
    } else {
        sound.pause();
        this.classList.remove('sound-on');
        this.textContent = 'Sound On';
    }
});


//posicion del planeta  
planeta.position.z = -0.1;
planeta.position.setX(11);
ciudades.position.z = -0.1;
ciudades.position.setX(11);


//posicion de la camara en las distintas paginas
const pagesConfig = [
  {id:"page0", cameraPosition: { x: 10, y: 10, z: 70 } },
  {id:"page1", cameraPosition: { x: 35, y: 17, z: -10 } },
  {id:"page2", cameraPosition: { x: -70, y: 50, z: 40 } },
  {id:"page3", cameraPosition: { x: 10, y: -30, z: 10 } },
  {id:"page4", cameraPosition: { x: 60, y: 10, z: 10 } },
  {id:"page5", cameraPosition: { x: -10, y: 90, z: 5 } },
];

let currentPage = 0;



//funciones///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


// Cuando cargas la página o reinicias, establece la posición inicial de la cámara
function initializeOrResetCamera() {
  const initialCameraPosition = pagesConfig[0].cameraPosition;
  camera.position.set(initialCameraPosition.x, initialCameraPosition.y, initialCameraPosition.z);
}

// Llamar a esta función al cargar la página y al reiniciar a page0
initializeOrResetCamera();



function animate() {
  requestAnimationFrame(animate);

  TWEEN.update();

  // Rotación continua del planeta
  planeta.rotation.y += 0.002;
  ciudades.rotation.y += 0.002;
  
 // Actualizar la intensidad de la emisión basada en la posición del sol y del planeta
 updateCityLightsIntensity();

 controls.update();
 renderer.render(scene, camera);

}

//function moveCamera() {
 // const t = document.body.getBoundingClientRect().top;

  // Ajustar la posición de la cámara basada en el scroll
 // camera.position.z = t * -0.01;
  //camera.position.x = t * -0.0002;
 // camera.position.y = t * -0.0002;
//}

//document.body.onscroll = moveCamera;

function updateCityLightsIntensity() {
  const sunDirection = new THREE.Vector3().subVectors(sun.position, planeta.position).normalize();
  const planetPosition = new THREE.Vector3().copy(planeta.position).normalize();

  // Calcular el producto punto
  const dot = sunDirection.dot(planetPosition);

  // Ajustar la intensidad de las luces de la ciudad
  // Queremos que la intensidad sea mayor cuando el 'dot' es negativo (parte trasera del planeta)
  ciudades.material.emissiveIntensity = (dot < 0) ? 3 : -1; 
}

//controladores de eventos UI

showPageContent(0);

document.getElementById('start-journey').addEventListener('click', function() {
  this.style.display = 'none';

  currentPage = 1;
  showPageContent(currentPage);
  animateCameraToPosition(currentPage);
  
  // Muestra los botones "Siguiente" y "Anterior"
  document.getElementById('nav-next').style.display = 'block';
  document.getElementById('nav-prev').style.display = 'block';
});

document.getElementById('nav-next').addEventListener('click', function() {
  if (currentPage < pagesConfig.length - 1) {
      currentPage++;
      showPageContent(currentPage);
      animateCameraToPosition(currentPage);
  } else {
      resetToStartJourney();
      resetCameraToInitialPosition();
  }
});

document.getElementById('nav-prev').addEventListener('click', function() {
  if (currentPage > 0) {
      currentPage--;
      showPageContent(currentPage);
      animateCameraToPosition(currentPage);
  }
});



function resetToStartJourney() {
  console.log("Resetting to start journey");
  currentPage = 0;//resetea a page0
  showPageContent(currentPage);//muestra page0
  document.getElementById('nav-next').style.display = 'none';
  document.getElementById('nav-prev').style.display = 'none';

  resetCameraToInitialPosition();
}

function showPageContent(pageNumber) {
  console.log("Showing page:", pageNumber);
  // Ocultar todas las páginas
  const pages = document.querySelectorAll('.content-page');
  pages.forEach(page => page.style.display = 'none');

  // Mostrar la página actual
  const currentPage = document.getElementById(`page${pageNumber}`);
  if (currentPage) {
      currentPage.style.display = 'block';
      if (pageNumber === 0) {
        document.getElementById('start-journey').style.display = 'block';
      }
  }
}




// animacion de transicion de movimiento a diferentes paginas
function animateCameraToPosition(pageNumber) {
  const position = pagesConfig[pageNumber].cameraPosition;
  if (position) {
      const tween = new TWEEN.Tween(camera.position)
          .to(position, 2000)
          .easing(TWEEN.Easing.Quadratic.Out)
          .onUpdate(() => renderer.render(scene, camera))
          .start();
  }
}


function resetCameraToInitialPosition() {
  const initialPosition = { x: 10, y: 10, z: 60}
  const tween = new TWEEN.Tween(camera.position)
  .to(initialPosition, 2000)
  .easing(TWEEN.Easing.Quadratic.Out)
  .onUpdate(() => renderer.render(scene, camera))
  .start();
}

animate();







