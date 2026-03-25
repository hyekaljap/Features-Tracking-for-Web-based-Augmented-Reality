let cvReady=false

cv['onRuntimeInitialized'] = () => {
    console.log("OpenCV.js is ready");
    cvReady = true;
}

//Get Elements
const imageInput = document.getElementById('imageInput');
const imageSrc = document.getElementById('imageSrc');
const canvas = document.getElementById('canvasOuput');

//Load Image from input
imageInput.addEventListener('change',(e)=>{
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();
    reader.onload = function(even){
        imageSrc.src = event.target.result;
    };
    reader.readAsDataURL(file);
})

//Display Image When Loaded
imageSrc.onload = function(){
    const ctx = canvas.getContext('2d');
    canvas.width = imageSrc.width;
    canvas.height = imageSrc.height;
    ctx.drawImage(imageSrc,0,0);
};

//Feature

function GenerateFeatures(){
    
    let src = cv.imread(imageSrc); //Read Image Source
    let gray = new cv.Mat();
    let dst = new cv.Mat();

    //Convert to grayscale
    cv.cvtColor(src,gray,cv.COLOR_RGBA2GRAY);

    //ORB detector
    let orb = new cv.ORB();

    let keypoints = new cv.KeyPointVector();
    let descriptors = new cv.Mat();

    orb.detectAndCommpute(gray, new cv.Mat(), keypoints, descriptors);

    //Draw the keypoints
    cv.drawKeypoints(
        gray,
        keypoints,
        dst,
        [255,0,0,255], //red points
        cv.DrawMatchesFlags_DEFAULT
    );

    //Output
    cv.imshow('canvasOutput', dst);

    src.delete(); 
    gray.delete(); 
    dst.delete(); 
    keypoints.delete(); 
    descriptors.delete(); 
    orb.delete(); 
} 

// Save canvas as image 
function saveImage(){
    const link = document.createElement('a'); 
    link.download = 'output.png'; 
    link.href = canvas.toDataURL(); 
    link.click();
}