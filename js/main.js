document.getElementById('uploadBtn').addEventListener('change', function(e) {
    const imgElement = document.getElementById('inputImage');
    imgElement.src = URL.createObjectURL(e.target.files[0]);
});

document.getElementById('generateBtn').onclick = function() {
    // Execute the feature extraction [cite: 37]
    generateFeatures('inputImage', 'canvasOutput');
    // Start the AR overlay [cite: 25]
    initARScene();
};

document.getElementById('saveBtn').onclick = function() {
    const canvas = document.getElementById('canvasOutput');
    const link = document.createElement('a');
    link.download = 'ar-marker.png'; // Acceptable format [cite: 39]
    link.href = canvas.toDataURL();
    link.click();
};