import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Texture loader
const textureLoader = new THREE.TextureLoader();

// Load textures
const textures = {
    Sun: textureLoader.load('textures/sun.png'),
    Mercury: textureLoader.load('textures/mercury.png'),
    Venus: textureLoader.load('textures/venus.png'),
    Earth: {
        map: textureLoader.load('textures/earth.png'),
    },
    Mars: textureLoader.load('textures/mars.png'),
    Jupiter: textureLoader.load('textures/jupiter.png'),
    Saturn: textureLoader.load('textures/saturn.png'),
    Uranus: textureLoader.load('textures/uranus.png'),
    Neptune: textureLoader.load('textures/neptune.png')
};

// Lighting
const ambientLight = new THREE.AmbientLight(0x333333);
scene.add(ambientLight);
const sunLight = new THREE.PointLight(0xffffff, 3, 0, 0);
scene.add(sunLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
camera.position.set(0, 30, 50);
controls.update();

// Planet data (scaled for visualization)
const planetData = [
    { name: 'Sun', radius: 5, orbitRadius: 0, speed: 0 },
    { name: 'Mercury', radius: 0.8, orbitRadius: 10, speed: 0.04 },
    { name: 'Venus', radius: 1.2, orbitRadius: 15, speed: 0.015 },
    { name: 'Earth', radius: 1.5, orbitRadius: 20, speed: 0.01 },
    { name: 'Mars', radius: 1, orbitRadius: 25, speed: 0.008 },
    { name: 'Jupiter', radius: 3, orbitRadius: 32, speed: 0.002 },
    { name: 'Saturn', radius: 2.5, orbitRadius: 40, speed: 0.0009 },
    { name: 'Uranus', radius: 1.8, orbitRadius: 45, speed: 0.0004 },
    { name: 'Neptune', radius: 1.8, orbitRadius: 50, speed: 0.0001 }
];

// Create planets
const planets = planetData.map(data => {
    const geometry = new THREE.SphereGeometry(data.radius, 64, 64);
    let material;

    if (data.name === 'Earth') {
        material = new THREE.MeshPhongMaterial({
            map: textures.Earth.map,
            normalMap: textures.Earth.normal,
            specularMap: textures.Earth.specular,
            shininess: 50
        });
    } else if (data.name === 'Sun') {
        material = new THREE.MeshBasicMaterial({
            map: textures[data.name],
            emissive: 0xffff00,
            emissiveIntensity: 0.5
        });
    } else {
        material = new THREE.MeshPhongMaterial({
            map: textures[data.name],
            shininess: 30
        });
    }

    const planet = new THREE.Mesh(geometry, material);
    planet.position.x = data.orbitRadius;
    
    // Create orbit path
    if (data.orbitRadius > 0) {
        const orbitGeometry = new THREE.RingGeometry(data.orbitRadius, data.orbitRadius + 0.1, 64);
        const orbitMaterial = new THREE.MeshBasicMaterial({
            color: 0x444444,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0
        });
        const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
        orbit.rotation.x = Math.PI / 2;
        scene.add(orbit);
    }

    return {
        mesh: planet,
        angle: Math.random() * Math.PI * 2,
        data: data
    };
});

// Add planets to scene
planets.forEach(planet => scene.add(planet.mesh));

// Stars background
const starGeometry = new THREE.BufferGeometry();
const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.1 });
const starVertices = [];

for (let i = 0; i < 10000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starVertices.push(x, y, z);
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Error handling for texture loading
const onError = (err) => {
    console.error('An error occurred loading the texture:', err);
};

// Animation loop
function animate() {
    requestAnimationFrame(animate);

    // Update planet positions
    planets.forEach(planet => {
        if (planet.data.orbitRadius > 0) {
            planet.angle += planet.data.speed;
            planet.mesh.position.x = Math.cos(planet.angle) * planet.data.orbitRadius;
            planet.mesh.position.z = Math.sin(planet.angle) * planet.data.orbitRadius;
        }
        planet.mesh.rotation.y += 0.01;
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();
