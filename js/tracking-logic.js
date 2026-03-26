function processImage(sourceId, canvasId) {
    let src = cv.imread(sourceId);
    let gray = new cv.Mat();
    
    // Step 1: Convert to Grayscale (Required)
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    
    // Step 2: Feature Extraction (ORB)
    let orb = new cv.ORB();
    let keypoints = new cv.KeyPointVector();
    let descriptors = new cv.Mat();
    orb.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);
    
    // Step 3: Draw features for the UI
    let output = new cv.Mat();
    cv.drawKeypoints(gray, keypoints, output, [255, 0, 0, 255]);
    
    cv.imshow(canvasId, output);

    // Cleanup
    src.delete(); gray.delete(); orb.delete(); 
    keypoints.delete(); descriptors.delete(); output.delete();
}