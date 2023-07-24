let wrongFrames = 0
let correctFrames = 0
let diffAngleState=true
let accuracy=0
let wrongExercises=0
let stepIndex=0
let steps_bentoverrow=[[-198.17964567, -197.83335493,  -48.22544226,  -53.84908831,    140.06809836,  127.13906964],  [-197.33647649, -193.75004551,  -57.7336418 ,  -55.76304441,    136.0016985 ,  128.50303437],  [-221.79759517, -201.38879888,  -32.89517323,  -51.8119177 ,    140.78568044,  126.84951319],  [-272.88442019, -276.99375734,   48.11255738,   33.94933676,    131.36140457,  120.1747237 ],  [-239.11292175, -211.33851088,   -3.62274003,  -35.8202646 ,    146.8386803 ,  139.12297621],  [-237.31133987, -204.54373842,  -19.60676209,  -45.90638044,    136.83534566,  138.36855478],  [-194.65331317, -197.05826558,  -50.70110314,  -54.74984373,    139.38774781,  126.60324907]]
let steps=[[-184.90276969, -190.62881485],[-264.80974247, -260.46141468],[54.24043369, 55.25266346],[48.7053814 , 44.19513105],[75.43668474, 73.28635648],[-267.04061691, -267.10692253],[-184.90276969, -190.62881485]]
let leftElbow = []
let rightElbow = []
let ind = 0;
let exerciseFinish=true

const loadingDiv = document.getElementById("loading")
const popup = document.getElementById("popup")
const mainDiv = document.getElementById("main-div")

const setCounter = document.getElementById("set-counter")
const repCounter = document.getElementById("rep-counter")


const tutorVideo = document.getElementById("tutor-video")
const tutorCanvas = document.getElementById("tutor-canvas")

const userVideo = document.getElementById("user-video")
const userCanvas = document.getElementById("user-canvas")

positiveAngleThreshold = 30
negativeAngleThreshold = -30

let host_model = null
let user_model = null

const anglesMap = {
    leftElbow: 2,
    rightElbow: 3
}


const angles = [[7, 5, 11], [8, 6, 12], [9, 7, 5], [10, 8, 6], [13, 11, 12], [14, 12, 11], [5, 11, 13], [6, 12, 14], [11, 13, 15], [12, 14, 16], [6, 2, 5], [6, 1, 5]]


function setLoading(state) {
    if (state) {
        loadingDiv.classList.remove("hidden")
        loadingDiv.classList.add("flex")
        mainDiv.classList.add("hidden")
        mainDiv.classList.remove("grid")
    } else {
        loadingDiv.classList.add("hidden")
        loadingDiv.classList.remove("flex")

        mainDiv.classList.remove("hidden")
        mainDiv.classList.add("grid")
    }
}

function find_angle(A, B, C) {
    var rad = Math.atan2(C.y - B.y, C.x - B.x) - Math.atan2(A.y - B.y, A.x - B.x)
    return rad * 180 / Math.PI;
}

function get_angle(poses) {
    if (!poses.length) {
        console.log("NO POSES, IGNORING!")
        return
    }
    let ans = []
    for (let i = 0; i < angles.length; i++) {
        ans.push(find_angle(poses[0].keypoints[angles[i][0]], poses[0].keypoints[angles[i][1]], poses[0].keypoints[angles[i][2]]))
    }
    return ans
}

function checkSteps(ang1){
    if (!ang1) {
        stepIndex=0
        console.log("exercise reset")
        return
    }
    let val=0;
    for(let i=0;i<selAngles.length;i++){
        if(selAngles[i]!=null){
            let d=steps[stepIndex][i]-ang1[selAngles[i]]
            if(Math.abs(d)<=errorPositiveAngles[i]){
                val++;
                user_clr[angles[selAngles[i]][1]] = "green"
            }
            else{
                user_clr[angles[selAngles[i]][1]] = "red"
            }
        }
    }
    if(val>parseInt(selAngles.length/2)){
        wrongFrames=wrongFrames+1-val/selAngles.length
        correctFrames++;
        stepIndex++;
        console.log("step compeleted")
        if(stepIndex>=steps.length){
            stepIndex=0;
            console.log("rep compeleted")
            reps[ind]--;
            console.log("accuracy of rep:",1-wrongFrames/correctFrames)
            accuracy=accuracy+(1-wrongFrames/correctFrames)
            wrongFrames=0
            correctFrames=0
            repCount = reps_per_set - reps[ind]
            repCounter.innerText = repCount
            if (reps[ind] <= 0) {
                ind++;
                console.log("set compeleted")
                if (ind < reps.length) {
                    setCounter.innerText = ind + 1
                    repCounter.innerText = 0
                    // alert("rep completed")
                }
            }
            if(ind>=reps.length){
                console.log("exercise compeleted")
                exerciseFinish=false
                accuracy=accuracy/(reps.length*reps_per_set)
                console.log("accuracy of exercse:",accuracy)
                for(let i=0;i<selAngles.length;i++){
                    user_clr[angles[selAngles[i]][1]] = "green"
                }
                // tutorVideo.pause()
            }
        }
    }
}

function drawKeypoints(video, poses, canvas, clr, ang) {
    let ctx = canvas.getContext('2d');
    canvas.setAttribute('width', 1024);
    canvas.setAttribute('height', 720);

    if (!poses.length) {
        console.log("NO POSES, IGNORING!")
        return
    }

    for (let j = 0; j < poses[0].keypoints.length; j += 1) {
        let keypoint = poses[0].keypoints[j];
        if (keypoint.score >= 0.3) {
            ctx.fillStyle = clr[j]
            ctx.beginPath();
            const x = (keypoint.x / video.videoWidth) * 1024
            const y = (keypoint.y / video.videoHeight) * 720
            ctx.arc(x, y, 10, 0, 2 * Math.PI);
            ctx.stroke();
            ctx.fill();
            // ctx.fillText(ang[j],x,y)
        }
    }

}

const loadWebcam = async () => {

    const video = document.getElementById('user-video')
    const feed = await navigator.mediaDevices.getUserMedia({ video: { deviceId: "cc23242822db19c6368b3cda6f987f88a8e981bdd7fbfcec75025353557497de" } })
    video.srcObject = feed;
}

async function load_movenet() {
    console.log("Loading tensorflow")
    tf.setBackend('webgl');
    await tf.ready();
    user_model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER })
    host_model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, { modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER })
    console.log("Finsihed Loading Tensorflow.")
    setLoading(false)
}

const user_clr = []

for (let i = 0; i < 18; i++) {
    user_clr.push("green")
}


async function get_poses_0() {
    let poses = [];
    await user_model.estimatePoses(userVideo, { flipHorizontal: false })
        .then(keypoint_list => { poses = keypoint_list; })
        .catch((error) => { console.log(error); })

    let ang2 = get_angle(poses, -1)
    if(exerciseFinish){
        checkSteps(ang2)
    }
    drawKeypoints(userVideo, poses, userCanvas, user_clr, ang2);
}

const plot = async () => {
    await get_poses_0()
    window.requestAnimationFrame(plot)
}

function check_input_type(device) {
    return (device.kind === 'videoinput');
}


async function get_webcam_list() {
    const media_devices = await navigator.mediaDevices.enumerateDevices();
    const webcam_list = media_devices.filter(check_input_type);
    return webcam_list;
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

const main = async () => {
    console.log(await get_webcam_list())
    await loadWebcam()
    await load_movenet()
    await sleep(2000)
    wrongFrames = 0
    correctFrames = 0
    tutorVideo.play()
    plot()
}
tutorVideo.loop=true

main()