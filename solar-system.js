// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Add lighting
const ambientLight = new THREE.AmbientLight(0x404040);
scene.add(ambientLight);
const pointLight = new THREE.PointLight(0xffffff, 1.5, 1000);
pointLight.position.set(0, 0, 0);
scene.add(pointLight);

// Create the Sun
const sunGeometry = new THREE.SphereGeometry(5, 32, 32);
const sunMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00, emissive: 0xffff00 });
const sun = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sun);

// Planet data
const planets = [
    { name: 'Mercury', radius: 0.4, distance: 10, speed: 0.02, color: 0x8c8c8c },
    { name: 'Venus', radius: 0.9, distance: 15, speed: 0.015, color: 0xe6b800 },
    { name: 'Earth', radius: 1, distance: 20, speed: 0.01, color: 0x0040ff },
    { name: 'Mars', radius: 0.5, distance: 25, speed: 0.008, color: 0xff3300 },
    { name: 'Jupiter', radius: 2, distance: 35, speed: 0.005, color: 0xb35900 },
    { name: 'Saturn', radius: 1.8, distance: 45, speed: 0.003, color: 0xffcc99 },
    { name: 'Uranus', radius: 1.2, distance: 55, speed: 0.002, color: 0x66ccff },
    { name: 'Neptune', radius: 1.1, distance: 65, speed: 0.001, color: 0x0000cc }
];

// Create planets
const planetMeshes = [];
planets.forEach(planet => {
    const geometry = new THREE.SphereGeometry(planet.radius, 32, 32);
    const material = new THREE.MeshPhongMaterial({ color: planet.color });
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = planet.distance;
    scene.add(mesh);
    planetMeshes.push({ mesh, speed: planet.speed, distance: planet.distance });
});

// Camera and controls
camera.position.set(0, 50, 100);
camera.lookAt(0, 0, 0);
const controls = new THREE.OrbitControls(camera, renderer.domElement);

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    
    // Rotate planets around the Sun
    planetMeshes.forEach((planet, index) => {
        const angle = Date.now() * planet.speed / 1000;
        planet.mesh.position.x = Math.cos(angle) * planet.distance;
        planet.mesh.position.z = Math.sin(angle) * planet.distance;
    });

    controls.update();
    renderer.render(scene, camera);
}

animate();
