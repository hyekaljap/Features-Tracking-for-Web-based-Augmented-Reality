// Check if OpenCV is ready
cv['onRuntimeInitialized'] = () => {
    const btn = document.getElementById('generateBtn');
    btn.disabled = false;
    btn.innerText = "Generate Features";
    console.log("OpenCV Ready");
};

document.getElementById('uploadBtn').onchange = function(e) {
    let img = document.getElementById('inputImage');
    img.src = URL.createObjectURL(e.target.files[0]);
    img.onload = () => img.style.display = "block";
};

document.getElementById('generateBtn').onclick = function() {
    processImage('inputImage', 'canvasOutput');
    if (!scene) initAR(); // Start 3D scene
};

document.getElementById('saveBtn').onclick = function() {
    const link = document.createElement('a');
    link.download = 'marker.png';
    link.href = document.getElementById('canvasOutput').toDataURL();
    link.click();
};