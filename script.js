let cvReady = false;
let src = null;
var orb, refGray;
var refKeyPts;
var refDescr;
var corners = [];
var initialized;

// Warn user if running from file:// (camera + CORS won't work)
if (location.protocol === 'file:') {
    const w = document.getElementById('warning');
    if (w) w.style.display = 'block';
}


function createMarkerBlobURL(data) {
    const blob = new Blob([data], { type: 'text/plain' });
    return URL.createObjectURL(blob);
}

// GLOBAL save function
window.saveImage = function(canvasId, filename) {
    let canvas = document.getElementById(canvasId);
    if (!canvas) { alert("Canvas not found!"); return; }
    let link = document.createElement("a");
    link.download = filename;
    link.href = canvas.toDataURL("image/png");
    link.click();
};

// OpenCV ready
function onOpenCvReady() {
    cvReady = true;
    document.getElementById("status").innerText = "OpenCV Ready! Upload an image.";

    // ── Patch marker URL after OpenCV loads ────────────────────────────────
    const markerURL = createMarkerBlobURL(MARKER_PATT_DATA);
    const marker = document.querySelector('a-marker');
    if (marker) {
        marker.setAttribute('url', markerURL);
        console.log("[Fix] marker.patt loaded via Blob URL:", markerURL);
    }
}

// Upload image
document.getElementById("fileInput").addEventListener("change", function (e) {
    let file = e.target.files[0];
    if (!file) return;
    let reader = new FileReader();
    reader.onload = function (event) {
        let img = new Image();
        img.onload = function () {
            let canvasInput = document.getElementById("canvasInput");
            canvasInput.width = img.width;
            canvasInput.height = img.height;
            canvasInput.getContext("2d").drawImage(img, 0, 0);

            let temp = document.createElement("canvas");
            temp.width = img.width;
            temp.height = img.height;
            temp.getContext("2d").drawImage(img, 0, 0);

            if (src) src.delete();
            src = cv.imread(temp);
            document.getElementById("status").innerText = "Image loaded! Click Generate Features.";
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(file);
});

// Generate features
document.getElementById("generateBtn").addEventListener("click", function () {
    if (!cvReady) { alert("OpenCV not ready"); return; }
    if (!src) { alert("Upload an image first!"); return; }

    let gray = new cv.Mat();
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
    cv.imshow("canvasGray", gray);

    let keypoints = new cv.KeyPointVector();
    let descriptors = new cv.Mat();
    let orb = new cv.ORB();
    orb.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);

    let output = new cv.Mat();
    cv.drawKeypoints(src, keypoints, output, [255, 0, 0, 255]);
    cv.imshow("canvasOutput", output);

    let count = keypoints.size();

    document.getElementById("cube").setAttribute("visible", false);
    document.getElementById("sphere").setAttribute("visible", false);
    document.getElementById("cone").setAttribute("visible", false);

    if (count < 100) {
        document.getElementById("cube").setAttribute("visible", true);
    } else if (count < 300) {
        document.getElementById("sphere").setAttribute("visible", true);
    } else {
        document.getElementById("cone").setAttribute("visible", true);
    }

    document.getElementById("status").innerText = `Detected ${count} features`;

    gray.delete();
    keypoints.delete();
    descriptors.delete();
    output.delete();
});

document.getElementById("saveGrayBtn").addEventListener("click", function () {
    saveImage("canvasGray", "grayscale.png");
});

document.getElementById("saveOrbBtn").addEventListener("click", function () {
    saveImage("canvasOutput", "orb_features.png");
});