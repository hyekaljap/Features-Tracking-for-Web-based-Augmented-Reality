// Function to process the image and extract features
function generateFeatures(sourceElementId, canvasResultId) {
    // 1. Read the RGB image from the video or uploaded img
    let src = cv.imread(sourceElementId);
    let gray = new cv.Mat();
    
    // 2. Convert to Grayscale (Mandatory Requirement) [cite: 15]
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    
    // 3. Initialize ORB detector
    let orb = new cv.ORB();
    let keypoints = new cv.KeyPointVector();
    let descriptors = new cv.Mat();
    
    // 4. Detect features
    orb.detectAndCompute(gray, new cv.Mat(), keypoints, descriptors);
    
    // 5. Draw features back onto the image for UI feedback [cite: 23]
    let featureImage = new cv.Mat();
    cv.drawKeypoints(gray, keypoints, featureImage, [255, 0, 0, 255]);
    
    // Display result on the canvas
    cv.imshow(canvasResultId, featureImage);
    
    // Cleanup memory
    src.delete(); gray.delete(); orb.delete(); 
    descriptors.delete(); keypoints.delete(); featureImage.delete();
}