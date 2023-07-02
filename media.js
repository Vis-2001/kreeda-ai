function load_media() {
	let host_status = load_host_video();
    let user_status = load_user_webcams();
	let detector_status = bind_video_to_canvas();
	return([host_status, user_status, detector_status]);
}

function load_host_video() {
	html['host']['video'][0].src = "e1.gif";
	return("Loaded host video");
}

async function load_user_webcams() {
	webcam['devices'] = await get_webcam_list();
	webcam['count'] = await set_feeds();
	return("Loaded " + webcam['count'] + " webcams")
}

function check_input_type(device) {
	return (device.kind === 'videoinput');
}


async function get_webcam_list() {
    const media_devices = await navigator.mediaDevices.enumerateDevices();
	const webcam_list = media_devices.filter(check_input_type);
	return webcam_list;
};

async function set_html_srcObject(webcam_device, webcam_number){
	if(webcam_number<3)
	{
		const feed = await navigator.mediaDevices.getUserMedia({video: {deviceId: webcam_device.deviceId}})
		html['user']['video'][webcam_number].srcObject = feed;
	}
}


async function set_feeds() {   
	webcam['devices'].forEach((webcam_device, index)=>{
		set_html_srcObject(webcam_device, index);
	});
    return webcam['devices'].length;
}

function bind_video_to_canvas(){
	load_canvas(html['host']['video'][0], html['host']['canvas'][0], false);
    load_canvas(html['user']['video'][0], html['user']['canvas'][0], true);		
	load_canvas(html['user']['video'][1], html['user']['canvas'][1], true);		
	load_canvas(html['user']['video'][2], html['user']['canvas'][2], true);	
	// play_video(html['user']['video'][1])
	return ("Videos binded to the canvas")
}	



function play_video(video_feed) {   
	var isPlaying = (   video_feed.currentTime > 0 && 
						!video_feed.paused && !video_feed.ended && 
						video_feed.readyState > video_feed.HAVE_CURRENT_DATA );   
	if (video_feed.paused && !isPlaying) return video_feed.play();
} 

function load_canvas(video, canvas, playthis){
	let ctx = canvas.getContext('2d');
	canvas.setAttribute('width', 1024);
	canvas.setAttribute('height', 720);
	video.addEventListener('loadeddata', () => {
		if(playthis) video.play();
	});	
}

function drawKeypoints(video, poses, canvas,clr) {
	let ctx = canvas.getContext('2d');
	canvas.setAttribute('width', 1024);
	canvas.setAttribute('height', 720);
	for (let j = 0; j < poses[0].keypoints.length; j += 1) {
		let keypoint = poses[0].keypoints[j];
		if (keypoint.score >= 0.3) {
			ctx.fillStyle=clr[j]
			ctx.beginPath();
			var x = (keypoint.x/video.videoWidth)*1024
			var y = (keypoint.y/video.videoHeight)*720
			ctx.arc(x, y, 10, 0, 2 * Math.PI);
			ctx.stroke();
			ctx.fill();
		}
	}
	
  }

function get_angle(poses)
{
	let ans=[]
	for(let i=0;i<angles.length;i++)
	{
		ans.push(find_angle(poses[0].keypoints[angles[i][0]],poses[0].keypoints[angles[i][1]],poses[0].keypoints[angles[i][2]]))
	}
	return ans;
}

function diff(ang1,ang2)
{
	let ans=[]
	for(let i=0;i<angles.length;i++)
	{
		var d=ang1[i]-ang2[i];
		if(d<-30)
		{
			ans.push(angles[i][1])
			user_clr[angles[i][1]]="red"
		}
		else if(d>30)
		{
			ans.push(angles[i][1])
			user_clr[angles[i][1]]="red"
		}
		else
		user_clr[angles[i][1]]="green"
	}
	console.log(ang1)
	console.log(ang2)
	console.log("fault point:",ans.length,ans);
}

function plot(){
	get_poses_0(html['user']['video'][0], html['user']['canvas'][0],html['host']['video'][0], html['host']['canvas'][0]);
	get_poses_1(html['user']['video'][1], html['user']['canvas'][1]);
	get_poses_2(html['user']['video'][2], html['user']['canvas'][2]);
	window.requestAnimationFrame(plot);
}

function starthost(){
	let v=document.getElementById("host-video")
	let btn=document.getElementById("giff")
	let btn1=document.getElementById("Reps")
	rep=btn1.value;
	document.getElementById("reps-output").innerText=rep*2
	v.src=btn.value;
}

function resethost(){
	let v=document.getElementById("host-video")
	v.pause()
	v.currentTime=0
	v.play()
}

function pausehost(){
	let v=document.getElementById("host-video")
	v.pause()
}

function find_angle(A,B,C) {
   var rad= Math.atan2(C.y-B.y,C.x-B.x)-Math.atan2(A.y-B.y,A.x-B.x)
    return rad*180/Math.PI;
}
