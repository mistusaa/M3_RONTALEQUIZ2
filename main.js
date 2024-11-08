// main.js
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let textMesh;
let stars, starGeo;

setupLighting();
createText();
createParticles();

function createParticles() {
  const points = [];

  for (let i = 0; i < 6000; i++) {
    let star = new THREE.Vector3(
      Math.random() * 600 - 300,
      Math.random() * 600 - 300,
      Math.random() * 600 - 300
    );
    points.push(star);
  }

  starGeo = new THREE.BufferGeometry().setFromPoints(points);

  let sprite = new THREE.TextureLoader().load("assets/images/star.png");
  let starMaterial = new THREE.PointsMaterial({
    color: 0xffb6c1,
    size: 0.7,
    map: sprite,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);
}

function animateParticles() {
  starGeo.attributes.position.array.forEach((value, index) => {
    // Adjust y positions to create falling effect
    if (index % 3 === 1) { // Check if it's the y component
      starGeo.attributes.position.array[index] -= 0.9;
      // Reset particles that have fallen out of view
      if (starGeo.attributes.position.array[index] < -300) {
        starGeo.attributes.position.array[index] = 300;
      }
    }
  });
  starGeo.attributes.position.needsUpdate = true;
}

function createText() {
  const loader = new THREE.FontLoader();
  loader.load("assets/fonts/helvetiker_regular.typeface.json", function (font) {
    const textGeometry = new THREE.TextGeometry("Rovil", {
      font: font,
      size: 5,
      height: 1,
      curveSegments: 12,
    });

    const textMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textMesh.position.set(-15, 0, -5);
    scene.add(textMesh);
  });

  camera.position.z = 50;
}

function setupLighting() {
  const light = new THREE.HemisphereLight(0x780a44, 0x1c3020, 1);
  scene.add(light);

  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(0, 0, 15);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 1024;
  spotLight.shadow.mapSize.height = 1024;
  scene.add(spotLight);
}

function animate() {
  requestAnimationFrame(animate);
  animateParticles();

  if (textMesh) {
    textMesh.rotation.y += 0.01;
  }

  renderer.render(scene, camera);
}

animate();
