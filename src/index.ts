import * as THREE from "three";

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

const sphereGeometry = new THREE.SphereGeometry(5, 32, 32);
const sphereMaterial = new THREE.ShaderMaterial({
  uniforms: {
    time: { value: 1.0 },
    resolution: { value: new THREE.Vector2() },
    mouse: { value: new THREE.Vector2() },
    sphereColor: { value: new THREE.Color(1, 1, 1) },
  },
  fragmentShader: `
    uniform vec2 resolution;
    uniform float time;
    uniform vec2 mouse;
    uniform vec3 sphereColor;  

    void main() {
      vec2 uv = gl_FragCoord.xy / resolution.xy;
      float waveSpeed = 5.0 + 10.0 * length(uv - mouse);
      float wave = 0.5 + 0.5 * sin((uv.x * 10.0 + time) * waveSpeed);
      gl_FragColor = vec4(sphereColor * vec3(wave), 1.0);
    }
  `,
});
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
scene.add(sphere);
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
// const light = new THREE.PointLight(0xffffff, 1, 100);
// light.position.set(10, 10, 10);
// scene.add(light);
camera.position.z = 15;

function onDocumentMouseMove(event: MouseEvent) {
  event.preventDefault();
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  if (sphereMaterial && sphereMaterial.uniforms) {
    sphereMaterial.uniforms.time.value += 0.05;
    sphereMaterial.uniforms.mouse.value.copy(mouse);
    sphereMaterial.uniforms.resolution.value.set(
      window.innerWidth,
      window.innerHeight
    );
  }
}
document.addEventListener("mousemove", onDocumentMouseMove, false);

function animate() {
  requestAnimationFrame(animate);
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObject(sphere);
  if (intersects.length > 0) {
    const randomColor = new THREE.Color(
      Math.random(),
      Math.random(),
      Math.random()
    );
    sphereMaterial.uniforms.sphereColor.value = randomColor;
  }
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
