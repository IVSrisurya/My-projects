let video;
let poseNet;
let pose;
let skeleton;
let posesArray = ['Agni', 'Baddha', 'Brahmari', 'Ekapada', 'Janu', 'Nadi'];
var pose_img_Array = new Array();
let brain;
let poseLabel;
var targetLabel;
var error;
var itr_cnt;
var pose_cnt;
var target;
var timeLeft;

function setup() {

  var canvas = createCanvas(640, 480);
  canvas.position(130, 210);
  video = createCapture(VIDEO);
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

  posesArray[0] = new Image();
  posesArray[0].src = 'img/Agni.jpg';
  posesArray[1] = new Image();
  posesArray[1].src = 'img/Baddha.jpg';
  posesArray[2] = new Image();
  posesArray[2].src = 'img/Brahmari.jpg';
  posesArray[3] = new Image();
  posesArray[3].src = 'img/Ekapada.jpg';
  posesArray[4] = new Image();
  posesArray[4].src = 'img/Janu.jpg';
  posesArray[5] = new Image();
  posesArray[5].src = 'img/Nadi.jpg';
  
  // let yoga_pose = document.getElementById("searching").value;

  pose_cnt = 0;
  targetLabel = 1;
  target = posesArray[pose_cnt];
  document.getElementById("poseName").textContent = target.value;
  timeLeft = 10;
  document.getElementById("time").textContent = "00:" + timeLeft;
  error = 0;
  itr_cnt = 0;
  document.getElementById("poseImg").src = posesArray[pose_cnt].src;
  
  // console.log("hiiiiiiiiiiiiiiiiiiiiiiiiii")

  let options = {
    inputs: 34,
    outputs: 6,
    task: 'classification',
    debug: true
  }

  brain = ml5.neuralNetwork(options);
  
  const modelDetails = {
    model: 'https://raw.githubusercontent.com/IVSrisurya/My-projects/gh-pages/yoga/model.json',
    metadata: 'https://raw.githubusercontent.com/IVSrisurya/My-projects/gh-pages/yoga/model_meta.json',
    weights: 'https://ivsrisurya.github.io/My-projects/yoga/model.weights.bin'
  }
  brain.load(modelDetails, modelLoaded)
}
  function modelLoaded(){
    console.log("Model is ready to deploy!");
    classifyPose();
  }


function classifyPose(){
  if (pose) {
    let inputs = [];
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      inputs.push(x);
      inputs.push(y);
    }
    brain.classify(inputs, gotResult);
  } else {
    setTimeout(classifyPose, 100);
  }
}

function gotResult(error, results) {

  if (results[0].confidence > 0.65) {
    if (results[0].label == targetLabel.toString()){
    window.setTimeout('alert("Great your posture is correct by 65%. Keep it up");window.close();', 5000);
      itr_cnt = itr_cnt + 1;      
      if (itr_cnt == 10) {
        itr_cnt = 0;
        nextPose();
    }
      else{
        timeLeft = timeLeft - 1;
        if (timeLeft < 10){
          document.getElementById("time").textContent = "00:0" + timeLeft;
        }else{
        document.getElementById("time").textContent = "00:" + timeLeft;}
        setTimeout(classifyPose, 1000);
    }
}
    else{
      error = error + 1;
      if (error >= 4){
        itr_cnt = 0;
        timeLeft = 10;
        if (timeLeft < 10){
          document.getElementById("time").textContent = "00:0" + timeLeft;
        }else{
        document.getElementById("time").textContent = "00:" + timeLeft;}
        error = 0;
        setTimeout(classifyPose, 100);
      }else{
        setTimeout(classifyPose, 100);
      }
  }
}
  else{
    setTimeout(classifyPose, 100);
}
}


function gotPoses(poses) {
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet is ready');
}
function draw() {
  push();
  translate(video.width, 0);
  scale(-1, 1);
  image(video, 0, 0, video.width, video.height);

  if (pose) {
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(2);
      stroke(0);

      line(a.position.x, a.position.y, b.position.x, b.position.y);
    }
    for (let i = 0; i < pose.keypoints.length; i++) {
      let x = pose.keypoints[i].position.x;
      let y = pose.keypoints[i].position.y;
      fill(0);
      stroke(255);
      ellipse(x, y, 16, 16);
    }
  }
  pop();
}

function nextPose(){
  if (pose_cnt >= 5) {
    console.log("All poses are completed!");
  }else{
    error = 0;
    itr_cnt = 0;
    pose_cnt = pose_cnt + 1;
    targetLabel = pose_cnt + 1;
    target = posesArray[pose_cnt];
    document.getElementById("poseName").textContent = target;
    document.getElementById("poseImg").src = posesArray[pose_cnt].src;
    timeLeft = 10;
    document.getElementById("time").textContent = "00:" + timeLeft;
    setTimeout(classifyPose, 4000)}
}