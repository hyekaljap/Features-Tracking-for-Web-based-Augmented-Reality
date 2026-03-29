let cvReady = false;
let src     = null;

// OpenCV ready 
function onOpenCvReady() {
  cvReady = true;
  setStatus('OpenCV ready — upload an image.', 'ok');
  const pill = document.getElementById('cvPill');
  const txt  = document.getElementById('cvPillText');
  if (pill) pill.classList.add('ready');
  if (txt)  txt.textContent = 'OpenCV Ready';

  // Flush any image uploaded before OpenCV was ready
  if (window._pendingCanvas) {
    if (src) src.delete();
    src = cv.imread(window._pendingCanvas);
    window._pendingCanvas = null;
    setStatus('Image loaded! Click Generate.', 'go');
  }
}

//  Status helper 
function setStatus(msg, ledClass) {
  const el  = document.getElementById('status');
  const led = document.getElementById('statusLed');
  if (el)  el.textContent = msg;
  if (led) led.className = 'status-led' + (ledClass ? ' ' + ledClass : '');
}

//  File upload 
document.getElementById('fileInput').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (ev) {
    const img = new Image();
    img.onload = function () {
      // Draw original
      const c = document.getElementById('canvasInput');
      c.width = img.width; c.height = img.height;
      c.getContext('2d').drawImage(img, 0, 0);

      // Temp canvas for cv.imread
      const tmp = document.createElement('canvas');
      tmp.width = img.width; tmp.height = img.height;
      tmp.getContext('2d').drawImage(img, 0, 0);

      if (!cvReady) {
        // Queue and wait
        window._pendingCanvas = tmp;
        setStatus('Image queued — waiting for OpenCV…', 'go');
        return;
      }
      if (src) src.delete();
      src = cv.imread(tmp);
      setStatus('Image loaded! Click Generate.', 'go');
    };
    img.src = ev.target.result;
  };
  reader.readAsDataURL(file);
});

//Generate Features
document.getElementById('generateBtn').addEventListener('click', function () {
  if (!cvReady) { alert('OpenCV is still loading — please wait.'); return; }
  if (!src)     { alert('Upload an image first!'); return; }

  const gray        = new cv.Mat();
  const keypoints   = new cv.KeyPointVector();
  const descriptors = new cv.Mat();
  const orb         = new cv.ORB();
  const output      = new cv.Mat();
  const mask        = new cv.Mat();

  // Convert to grayscale and show
  cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);
  cv.imshow('canvasGray', gray);

  // Detect ORB keypoints
  orb.detectAndCompute(gray, mask, keypoints, descriptors);

  // Draw keypoints on output
  cv.drawKeypoints(src, keypoints, output, [255, 60, 0, 255]);
  cv.imshow('canvasOutput', output);

  const count = keypoints.size();
  setStatus('Detected ' + count + ' ORB keypoints.', 'ok');

  // Show result card
  document.getElementById('featCount').textContent = count;
  document.getElementById('featResult').style.display = 'flex';

  // Determine shape label
  let shapeName;
  if      (count < 100)  shapeName = 'Cube';
  else if (count < 300)  shapeName = 'Sphere';
  else                   shapeName = 'Cone';
  document.getElementById('featShape').textContent = shapeName;

  // Cleanup
  gray.delete(); keypoints.delete(); descriptors.delete();
  output.delete(); mask.delete();
});

//  Save buttons 
function saveCanvas(id, filename) {
  const c = document.getElementById(id);
  if (!c || c.width === 0) { alert('Nothing to save — run Generate first.'); return; }
  const a = document.createElement('a');
  a.download = filename;
  a.href = c.toDataURL('image/png');
  a.click();
}
document.getElementById('saveGrayBtn').addEventListener('click', () => saveCanvas('canvasGray',   'grayscale.png'));
document.getElementById('saveOrbBtn').addEventListener('click',  () => saveCanvas('canvasOutput', 'orb_features.png'));