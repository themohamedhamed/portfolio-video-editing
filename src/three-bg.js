import * as THREE from 'three';

export function initThreeBg() {
  const canvas = document.querySelector('#three-canvas');
  if (!canvas) return;

  // 1. Scene, Camera & Renderer
  const scene = new THREE.Scene();
  
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true, // Transparent bg to let CSS colors through
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 2. Particle Geometry Generation
  const particlesCount = 1800;
  const positions = new Float32Array(particlesCount * 3);
  const colors = new Float32Array(particlesCount * 3);

  // Colors to mix (Cyan & Purple)
  const colorCyan = new THREE.Color(0x00f2fe);
  const colorPurple = new THREE.Color(0xa855f7);

  for (let i = 0; i < particlesCount; i++) {
    // Positioning particles in a wide 3D space
    positions[i * 3] = (Math.random() - 0.5) * 80;     // X
    positions[i * 3 + 1] = (Math.random() - 0.5) * 80; // Y
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60; // Z

    // Mixed colors based on position
    const mixedColor = colorCyan.clone().lerp(colorPurple, Math.random());
    colors[i * 3] = mixedColor.r;
    colors[i * 3 + 1] = mixedColor.g;
    colors[i * 3 + 2] = mixedColor.b;
  }

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

  // 3. Materials & Points
  // Generate a small circular texture programmatically so particles are soft round dots
  const createCircleTexture = () => {
    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    return new THREE.CanvasTexture(canvas);
  };

  const material = new THREE.PointsMaterial({
    size: 0.28,
    vertexColors: true,
    transparent: true,
    opacity: 0.65,
    map: createCircleTexture(),
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(geometry, material);
  scene.add(particleSystem);

  // 4. Mouse Tracking for Parallax Interaction
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const handleMouseMove = (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) / 100;
    mouseY = (event.clientY - window.innerHeight / 2) / 100;
  };

  window.addEventListener('mousemove', handleMouseMove);

  // 5. Window Resize Handler
  const handleResize = () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  };

  window.addEventListener('resize', handleResize);

  // 6. Animation Loop
  const clock = new THREE.Clock();

  const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    // Slow organic rotation
    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = elapsedTime * 0.015;

    // Smooth lerp mouse tracking
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    particleSystem.position.x = targetX * 0.8;
    particleSystem.position.y = -targetY * 0.8;

    // Render scene
    renderer.render(scene, camera);

    // Call tick again on next frame
    requestAnimationFrame(tick);
  };

  // Start tick
  tick();

  // Return clean-up function in case needed
  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('resize', handleResize);
    geometry.dispose();
    material.dispose();
    renderer.dispose();
  };
}
