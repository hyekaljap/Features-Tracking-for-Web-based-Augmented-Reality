let scene, camera, renderer, cube;

function initARScene() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    
    renderer = new THREE.WebGLRenderer({ alpha: true }); // Alpha true to see camera feed behind
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Create the mandatory 3D Cube [cite: 8, 19]
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    cube = new THREE.Mesh(geometry, material);
    
    scene.add(cube);
    camera.position.z = 5;

    animate();
}

function animate() {
    requestAnimationFrame(animate);
    // Rotate cube for visual effect in the DEMO [cite: 40]
    if(cube) {
        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
    }
    renderer.render(scene, camera);
}