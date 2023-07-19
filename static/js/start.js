let wrongFrames = 0
let correctFrames = 0
let diffAngleState=true
let accuracy=0
let wrongExercises=0

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

function diff(ang1, ang2) {
    if (!ang1 || !ang2) {
        return
    }
    let ans = []
    // let audiosrc="audio/elbow.wav"
    let pos = 0;
    for (let i = 0; i < selAngles.length; i++) {
        if (selAngles[i] != null) {
            var d = ang1[selAngles[i]] - ang2[selAngles[i]];
            if (d <  errorNegativeAngles[i]) {
                ans.push(angles[selAngles[i]][1])
                user_clr[angles[selAngles[i]][1]] = "red"
                if(diffAngleState){
                    var utterance = new SpeechSynthesisUtterance(errorNegativeMessages[i]);
                    window.speechSynthesis.speak(utterance);
                    diffAngleState=false
					break
                }
                
            }
            else if (d > errorPositiveAngles[i]) {
                ans.push(angles[selAngles[i]][1])
                user_clr[angles[selAngles[i]][1]] = "red"
                if(diffAngleState){
                    var utterance = new SpeechSynthesisUtterance(errorPositiveMessages[i]);
                    window.speechSynthesis.speak(utterance);
                    diffAngleState=false
					break
                }
            }
            else {
                user_clr[angles[selAngles[i]][1]] = "green"
            }

        }
    }
    if(ans.length==0)
    {
        diffAngleState=true
        window.speechSynthesis.cancel()
    }
    if (ans.length > 0)
        wrongFrames = wrongFrames + ans.length / selAngles.length;
    correctFrames++;
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
const host_clr = []



for (let i = 0; i < 18; i++) {
    user_clr.push("green")
    host_clr.push("green")
}

for (let i = 0; i < selAngles.length; i++) {
    host_clr[angles[selAngles[i]][i]] = "blue"
}


async function get_poses_0() {
    // console.log("")
    let poses1 = [];

    await host_model.estimatePoses(tutorVideo, { flipHorizontal: false })
        .then(keypoint_list => { poses1 = keypoint_list; })
        .catch((error) => { console.log(error); })
    let ang1 = get_angle(poses1, 1)
    drawKeypoints(tutorVideo, poses1, tutorCanvas, host_clr, ang1);

    let poses = [];
    await user_model.estimatePoses(userVideo, { flipHorizontal: false })
        .then(keypoint_list => { poses = keypoint_list; })
        .catch((error) => { console.log(error); })

    let ang2 = get_angle(poses, -1)
    diff(ang1, ang2)
    drawKeypoints(userVideo, poses, userCanvas, user_clr, ang2);
    // console.log(ang1)
    // console.log(ang2)
    // console.log("\n\n")
    // if (checkStart == true) {
    //     exerciseStarted(poses1)
    // }
    // console.log(poses)
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

let ind = 0;
tutorVideo.addEventListener("ended", async function () {
    console.log([wrongFrames, correctFrames])

    if (wrongFrames / correctFrames < 0.35) {
        reps[ind]--;
        accuracy=accuracy+(1-wrongFrames/correctFrames)
        repCount = reps_per_set - reps[ind]
        repCounter.innerText = repCount
    }
    else {
        wrongExercises++;
        let utterance = new SpeechSynthesisUtterance("You failed the Rep!");
        speechSynthesis.speak(utterance);
        popup.classList.remove("opacity-0")
        popup.classList.add("opacity-100")
        tutorVideo.pause()
        await sleep(3000)
        popup.classList.add("opacity-0")
        popup.classList.remove("opacity-100")
        tutorVideo.currentTime = 0
        tutorVideo.play()
        // alert("Wrong rep")
    }
    wrongFrames = 0
    correctFrames = 0
    if (reps[ind] <= 0) {
        ind++;
        if (ind < reps.length) {
            setCounter.innerText = ind + 1
            repCounter.innerText = 0
            // alert("rep completed")
        }

    }
    if (ind < reps.length) {
        tutorVideo.currentTime = 0;
        tutorVideo.play()
    }
    else {
        accuracy=accuracy/(reps_per_set*reps.length)
        alert(accuracy,wrongExercises)
        // alert("exercise compeleted")
    }
})

main()