async function load_movenet(){
	console.log("Loaded tensorflow")
	tf.setBackend('webgl');
	await tf.ready();
	user_model_0 = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER})
	user_model_1 = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER})
	user_model_2 = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER})
	host_model = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER})
}


const user_clr=["green","green","green","green","green","green","green","green","green","green","green","green","green","green","green","green","green",]
const host_clr=["green","green","green","green","green","green","green","green","green","green","green","green","green","green","green","green","green",]


async function get_poses_0(video, canvas,video1, canvas1) {
	let poses1= [];
	await host_model.estimatePoses(video1, {flipHorizontal: false})
			.then(keypoint_list => {poses1 = keypoint_list;})
			.catch((error) => { console.log(error); })
	drawKeypoints(video1, poses1, canvas1,host_clr);

	let poses= [];
	await user_model_0.estimatePoses(video, {flipHorizontal: false})
			.then(keypoint_list => {poses = keypoint_list;})
			.catch((error) => { console.log(error); })
	let ang1=get_angle(poses,1)
	let ang2=get_angle(poses1,-1)
	diff(ang1,ang2)
	drawKeypoints(video, poses, canvas,user_clr);
}

async function get_poses_1(video, canvas) {
	let poses= [];
	await user_model_1.estimatePoses(video, {flipHorizontal: false})
			.then(keypoint_list => {poses = keypoint_list;})
			.catch((error) => { console.log(error); })
	drawKeypoints(video, poses, canvas,user_clr);
	let ang1=get_angle(poses,0)
}

async function get_poses_2(video, canvas) {
	let poses= [];
	await user_model_2.estimatePoses(video, {flipHorizontal: false})
			.then(keypoint_list => {poses = keypoint_list;})
			.catch((error) => { console.log(error); })
	drawKeypoints(video, poses, canvas,user_clr);
	let ang1=get_angle(poses,2)
}

async function get_poses_host(video, canvas) {
	
}

