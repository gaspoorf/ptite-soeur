import './style.css'
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MeshSurfaceSampler } from 'three/addons/math/MeshSurfaceSampler.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FilmPass } from 'three/examples/jsm/postprocessing/FilmPass.js';
import { GlitchPass } from 'three/examples/jsm/postprocessing/GlitchPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { SMAAPass } from 'three/examples/jsm/postprocessing/SMAAPass.js';

import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import gsap from "gsap";



// base scene
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
document.body.appendChild( renderer.domElement );


const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x1c20d9, 0.0015);
//camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
camera.position.set(-55, 15, 40);
const initialTarget = new THREE.Vector3(-20, 35, 0);
camera.lookAt(initialTarget);


const params = { 
  lights: 100,
}


//light 
const pointlight = new THREE.PointLight(0xffffff, params.lights)
pointlight.position.set(75, 5, -10)
pointlight.castShadow = true;
scene.add(pointlight)


const pointlight2 = new THREE.PointLight(0xffffff, params.lights)
pointlight2.position.set(-35, 5, -50)
pointlight2.castShadow = true;
scene.add(pointlight2)


//spot light
const pointlight3 = new THREE.PointLight(0xffffff, 100)
pointlight3.position.set(-16, 99, -15)
pointlight3.castShadow = true;
scene.add(pointlight3)

const spotLight = new THREE.SpotLight(0xffffff, 800, 200, Math.PI / 6, 0.3, 1.3);
spotLight.position.set(-16, 100.45, -15);
spotLight.target.position.set(-16, 30, -15);
scene.add(spotLight.target);

spotLight.castShadow = true;

scene.add(spotLight);

const ambientlight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientlight);




//particles
const particleCount = 600; 
const particleSize = 0.5;
const particleRange = 200;

const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  positions[i * 3 + 0] = (Math.random() - 0.5) * particleRange; // x
  positions[i * 3 + 1] = (Math.random() - 0.5) * particleRange; // y
  positions[i * 3 + 2] = (Math.random() - 0.5) * particleRange; // z
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particlesMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: particleSize,
  transparent: true,
  opacity: 0.3,
});


const particleSystem = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particleSystem);

function animateParticles() {
  const positions = particleSystem.geometry.attributes.position.array;

  for (let i = 0; i < particleCount; i++) {
    positions[i * 3 + 1] += 0.02 * Math.sin(Date.now() * 0.001 + i);
    positions[i * 3 + 0] += 0.01 * Math.sin(Date.now() * 0.001 + i * 2); 
    positions[i * 3 + 2] += 0.01 * Math.cos(Date.now() * 0.001 + i * 3); 

    if (positions[i * 3 + 1] > particleRange / 2) positions[i * 3 + 1] = -particleRange / 2;
    if (positions[i * 3 + 1] < -particleRange / 2) positions[i * 3 + 1] = particleRange / 2;
  }

  particleSystem.geometry.attributes.position.needsUpdate = true;
}








const playButton = document.getElementById('playButton');
const pauseButton = document.getElementById('pauseButton');
const prevButton = document.getElementById('prevButton');
const nextButton = document.getElementById('nextButton');


const videos = [
  'KAYFABE.mp4', 
  'soeurlocation.mp4', 
  'hank-j.mp4', 
  'mirrroir.mp4', 
  'reHOKMAH.mp4', 
  'reNETZAH.mp4', 
  'MALKHUT.mp4'
];

const titles = [
  'KAYFABE', 
  'SOEUR LOCATION', 
  'HANK J.', 
  'MIRRROIR', 
  'reHOKMAH', 
  'reNETZAH', 
  'MALKHUT'
];

const artists = [
  'Ptite soeur - Gemroz', 
  'Ptite soeur - Gemroz', 
  'Ptite soeur - Femtogo - Neophron', 
  'Ptite soeur - Femtogo - Neophron',
  'Ptite soeur - Neophron',
  'Ptite soeur - Neophron - Rosalie du 38',
  'Ptite soeur - Neophron - Reivilose'
];
 
const video = document.createElement('video');
video.src = '/videos/sounds/' + videos[0];
video.loop = true;
video.muted = false;
video.crossOrigin = "anonymous";

document.addEventListener('click', () => {
  video.play();
});


const video2 = document.createElement('video');
video2.src = '/videos/glitch/ptitesoeur-pixel.mp4';
video2.loop = true;
video2.muted = true;
video2.crossOrigin = "anonymous";
video2.play();


const videoG1 = document.createElement('video');
videoG1.src = '/videos/glitch/glitch-color.mp4';
videoG1.loop = true;
videoG1.muted = true;
videoG1.crossOrigin = "anonymous";
videoG1.play();


const videoG2 = document.createElement('video');
videoG2.src = '/videos/glitch/glitch-grey.mp4';
videoG2.loop = true;
videoG2.muted = true;
videoG2.crossOrigin = "anonymous";
videoG2.play();


const videoG3 = document.createElement('video');
videoG3.src = '/videos/glitch/glitch-code.mp4';
videoG3.loop = true;
videoG3.muted = true;
videoG3.crossOrigin = "anonymous";
videoG3.play();


const fullscreenButton = document.getElementById('fullscreenButton');
fullscreenButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
    document.body.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});


const volButton = document.getElementById('volButton');
const noVolButton = document.getElementById('noVolButton');

volButton.addEventListener('click', () => {
  if(video.muted){
    video.muted = false;
    volButton.style.display = "inline-block";
    noVolButton.style.display = "none";""
  } else {
    video.muted = true;
    volButton.style.display = "none";
    noVolButton.style.display = "inline-block";
  }
});

noVolButton.addEventListener('click', () => {
  if(!video.muted){
    video.muted = true;
    noVolButton.style.display = "inline-block";
    volButton.style.display = "none";
  } else {
    video.muted = false;
    noVolButton.style.display = "none";
    volButton.style.display = "inline-block";
  }
});

playButton.addEventListener('click', () => {
  video.play();
  pauseButton.style.display = 'inline-block';
  playButton.style.display = 'none';
});

pauseButton.addEventListener('click', () => {
  video.pause();
  pauseButton.style.display = 'none';
  playButton.style.display = 'inline-block';
});

nextButton.addEventListener('click', () => {
  let currentIndex = videos.indexOf(video.src.split('/').pop());
  let nextIndex = (currentIndex + 1) % videos.length;
  video.src = '/videos/sounds/' + videos[nextIndex];
  video.play();
  document.getElementById('title').textContent = titles[nextIndex];
  document.getElementById('artist').textContent = artists[nextIndex];
});

prevButton.addEventListener('click', () => {
  let currentIndex = videos.indexOf(video.src.split('/').pop());
  let prevIndex = (currentIndex - 1) % videos.length;
  video.src = '/videos/sounds/' + videos[prevIndex];
  video.play();
  document.getElementById('title').textContent = titles[prevIndex];
  document.getElementById('artist').textContent = artists[prevIndex];
});


//texture
const videoTexture = new THREE.VideoTexture(video);
videoTexture.minFilter = THREE.LinearFilter;
videoTexture.magFilter = THREE.LinearFilter;
videoTexture.format = THREE.RGBFormat;


const videoTexture2 = new THREE.VideoTexture(video2);
videoTexture2.minFilter = THREE.LinearFilter;
videoTexture2.magFilter = THREE.LinearFilter;
videoTexture2.format = THREE.RGBFormat;

const videoTextureG1 = new THREE.VideoTexture(videoG1);
videoTextureG1.minFilter = THREE.LinearFilter;
videoTextureG1.magFilter = THREE.LinearFilter;
videoTextureG1.format = THREE.RGBFormat;

const videoTextureG2 = new THREE.VideoTexture(videoG2);
videoTextureG2.minFilter = THREE.LinearFilter;
videoTextureG2.magFilter = THREE.LinearFilter;
videoTextureG2.format = THREE.RGBFormat;

const videoTextureG3 = new THREE.VideoTexture(videoG3);
videoTextureG3.minFilter = THREE.LinearFilter;
videoTextureG3.magFilter = THREE.LinearFilter;
videoTextureG3.format = THREE.RGBFormat;






const loaderContent = document.getElementById('main-loading');
const loaderDiv = document.getElementById('loader');
const totalChars = 30; // Longueur de la barre

function updateAsciiLoader(percent) {
    // On s'assure que percent est un entier (0-100)
    const p = Math.round(percent);
    
    // Calcul des '#'
    const filledChars = Math.round((p / 100) * totalChars);
    const emptyChars = totalChars - filledChars;
    
    // Construction de la string
    const bar = '#'.repeat(filledChars) + '.'.repeat(emptyChars);
    
    // Affichage
    loaderDiv.innerText = `[${bar}] ${p}%`;
}



// 3D model
const loader = new GLTFLoader();

loader.load('/model/wall-tv.glb', (gltf) => {

	updateAsciiLoader(100);
	console.log('Modèle chargé !');
	const loadingVideo = document.querySelector('#loading video');
	loadingVideo.pause();

		setTimeout(() => {
			loaderContent.style.display = 'none';
			
			const loading = document.querySelector('#loading');
			loadingVideo.play();
			setTimeout(() => {
				loading.style.display = 'none';
			}, 4800);
	}, 500);


	const model = gltf.scene;




    model.scale.set(1, 1, 1);
    model.position.set(0, 0, 0);
    model.rotation.set(0, 180, 0);


    model.traverse((child) => {
      if (child.isMesh) {
        if (child.isMesh && child.name.includes('screenVideo')) {
          const geometry = child.geometry;
          
          geometry.computeBoundingBox();
          const bbox = geometry.boundingBox;
          
          const uvAttribute = geometry.attributes.uv;
          const posAttribute = geometry.attributes.position;
    
          for (let i = 0; i < uvAttribute.count; i++) {
            const x = posAttribute.getX(i);
            const y = posAttribute.getY(i);
            const z = posAttribute.getZ(i);
            
            const u = (x - bbox.min.x) / (bbox.max.x - bbox.min.x);
            const v = (y - bbox.min.y) / (bbox.max.y - bbox.min.y);
            
            uvAttribute.setXY(i, u, v);
          }
    
          uvAttribute.needsUpdate = true;
          
          child.material = new THREE.MeshStandardMaterial({
            map: videoTexture,
            emissive: new THREE.Color(0xffffff),
            emissiveMap: videoTexture,
            emissiveIntensity: 0.9
          });
        }

        if (child.name.includes('screenTV')) {

          child.material = new THREE.MeshStandardMaterial({
            map: videoTexture2,
            emissive: new THREE.Color(0x00ffff),
            emissiveIntensity: 0.9
          });

          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveMap = videoTexture2;
          
        }

        if (child.name.includes('glitch1')) {

          child.material = new THREE.MeshStandardMaterial({
            map: videoTextureG1,
            emissive: new THREE.Color(0x00ffff),
            emissiveIntensity: 0.9
          });

          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveMap = videoTextureG1;

          child.material.map.repeat.set(1, 1);
          child.material.map.offset.set(0, 0);
          
        }

        if (child.name.includes('glitch2')) {

          child.material = new THREE.MeshStandardMaterial({
            map: videoTextureG2,
            emissive: new THREE.Color(0x00ffff),
            emissiveIntensity: 0.9
          });

          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveMap = videoTextureG2;

          // child.material.map.repeat.set(1, 0.75);
          // child.material.map.offset.set(0, 0.125);
          
        }

        if (child.name.includes('glitch3')) {

          child.material = new THREE.MeshStandardMaterial({
            map: videoTextureG3,
            emissive: new THREE.Color(0x00ffff),
            emissiveIntensity: 0.9
          });

          child.material.emissive = new THREE.Color(0xffffff);
          child.material.emissiveMap = videoTextureG3;

          // child.material.map.repeat.set(1, 0.75);
          // child.material.map.offset.set(0, 0.125);
          
        }
      }
    });


  scene.add(model);
},

(xhr) => {
	// xhr.loaded = octets chargés
	// xhr.total = taille totale du fichier
	if (xhr.lengthComputable) {
		const percentComplete = (xhr.loaded / xhr.total) * 100;
		updateAsciiLoader(percentComplete);
	}
},

// 4. onError (En cas de problème)
(error) => {
	console.error('Erreur de chargement:', error);
	loaderDiv.innerText = "[ERREUR...............] :(";
}

);






const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    0.3, // strength
    0.5, // radius
    0.3 // threshold
);
composer.addPass(bloomPass);





const rgbPass = new ShaderPass({
    uniforms: { tDiffuse: { value: null }, amount: { value: 0.0005 } },
    vertexShader: `varying vec2 vUv;
        void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }`,
    fragmentShader: `uniform sampler2D tDiffuse; uniform float amount; varying vec2 vUv;
        void main() {
            vec2 offset = vec2(amount, 0.0);
            vec4 color;
            color.r = texture2D(tDiffuse, vUv + offset).r;
            color.g = texture2D(tDiffuse, vUv).g;
            color.b = texture2D(tDiffuse, vUv - offset).b;
            color.a = 1.0;
            gl_FragColor = color;
        }`
});
composer.addPass(rgbPass);




// film pass
const filmPass = new FilmPass(0.05, 0.05, 648, false);
composer.addPass(filmPass);


const fxaaPass = new ShaderPass(FXAAShader);
fxaaPass.material.uniforms['resolution'].value.set(
  1 / window.innerWidth,
  1 / window.innerHeight
);

composer.addPass(fxaaPass);

const smaaPass = new SMAAPass(window.innerWidth, window.innerHeight);
composer.addPass(smaaPass);

// // glitch pass
// const glitchPass = new GlitchPass();
// glitchPass.goWild = true;
// glitchPass.enabled = false;
// composer.addPass(glitchPass);



function init() {
	requestAnimationFrame( init );
	// controls.update();
	// composer.render();
}
requestAnimationFrame(init)




// resize window
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  
  fxaaPass.material.uniforms['resolution'].value.set(
    1 / window.innerWidth,
    1 / window.innerHeight
  );
});




// lookAt caemera
const cameraPos = camera.position.clone();
const dir0 = initialTarget.clone().sub(cameraPos).normalize();
const distanceToTarget = initialTarget.distanceTo(cameraPos);

let mouseNX = 0; 
let mouseNY = 0; 


const maxYaw = 0.2; 
const maxPitch = 0.1;
const smooth = 0.04; 


const currentLookAt = initialTarget.clone();


document.addEventListener('mousemove', (e) => {
  mouseNX = (e.clientX / window.innerWidth) * 2 - 1; 
  mouseNY = (e.clientY / window.innerHeight) * 2 - 1; 
});


window.addEventListener('mouseleave', () => {
  mouseNX = 0;
  mouseNY = 0;
});



let targetFov = camera.fov;
const minFov = 30;
const maxFov = 85;
const zoomSpeed = 1;
const zoomSmooth = 0.1; 


window.addEventListener('wheel', (e) => {
  targetFov += e.deltaY * 0.01 * zoomSpeed;
  targetFov = THREE.MathUtils.clamp(targetFov, minFov, maxFov);
});


function animate() {
  requestAnimationFrame(animate);

  animateParticles(); 

  const yaw = THREE.MathUtils.clamp(-mouseNX * maxYaw, -maxYaw, maxYaw);   // gauche/droite
  const pitch = THREE.MathUtils.clamp(mouseNY * maxPitch, -maxPitch, maxPitch); // haut/bas
  const dir = dir0.clone();

  dir.applyAxisAngle(new THREE.Vector3(0, 1, 0), yaw);

  const up = new THREE.Vector3(0, 1, 0);
  const right = new THREE.Vector3().crossVectors(up, dir).normalize();

  dir.applyAxisAngle(right, pitch);
  const desiredLookAt = cameraPos.clone().add(dir.multiplyScalar(distanceToTarget));
  currentLookAt.lerp(desiredLookAt, smooth);

  camera.lookAt(currentLookAt);

  camera.fov += (targetFov - camera.fov) * zoomSmooth;
  camera.updateProjectionMatrix();

  composer.render();
}

animate();