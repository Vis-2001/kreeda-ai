function load_media() {
	let host_status = load_host_video();
    let user_status = load_user_webcams();
	let detector_status = bind_video_to_canvas();
	return([host_status, user_status, detector_status]);
}

function load_host_video() {
	html['host']['video'][0].src = "videos/e4.mp4";
	html['host']['video'][0].loop = 1;
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
	if(chooseframes==true)
	{
		if(ans.length>2)
		wrongframe++;
		totalframe++;
	}
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
	// let btn1=document.getElementById("Reps")
	// rep=btn1.value;
	// document.getElementById("reps-output").innerText=rep*2
	v.src=btn.value;
	v.loop=false
	v.play()
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

function hidecontainer(){
	document.getElementById("div-con").style.display="none"
	document.getElementById("middle-container").style.display="none"
	document.getElementById("hidden-container").style.display="flex"
}

async function playVid(val)
{
	var v=document.getElementById("host-video")
	if(val)
	{
		alert("demo video")
		v.src=exer_list[exer_ind];
		v.loop=false
		v.play()
	}
	else
	{
		alert("start")
		v.currentTime=0;
		v.play()
	}
}
function displaychange(){
	document.getElementById("div-con").style.display="flex"
	document.getElementById("middle-container").style.display="flex"
	document.getElementById("hidden-container").style.display="none"
}
function showcontainer(){
	displaychange()
	let temp="Reps-e*"
	exer_rep=[]
	let ind=-1
	let cnt=0
	for(let i=1;i<=exer.length;i++)
	{
		if(exer[i-1	])
		{
			let temp1=temp.replace("*",i)
			exer_rep.push(document.getElementById(temp1).value)
			cnt=1
		}
		else
		{
			let temp1=temp.replace("*",i)
			document.getElementById(temp1).value=null
			exer_rep.push(0)
		}
	}
	document.getElementById("change-label").innerText=exer_rep
	// add video playing thing asynchronous 
	exer_ind=0;
	for(;exer_ind<exer.length-1;exer_ind++)
	{
		if(exer[exer_ind])
		break;
	}
	document.getElementById("host-video").addEventListener("ended",function(){
		chooseframes=false
		alert(wrongframe/totalframe*100)
		if(wrongframe/totalframe*100>40)
		{
			// exer_rep[exer_ind]=exer_rep[exer_ind]+1
			alert("exercise not done properly")
		}
		wrongframe=0
		totalframe=0
		exer_rep[exer_ind]=exer_rep[exer_ind]-1;
		if(exer_rep[exer_ind]>=0)
		{
			chooseframes=true
			playVid(false)
		}
		else{
			exer_ind++;
			for(;exer_ind<exer.length-1;exer_ind++)
			{
				if(exer[exer_ind])
				break;
			}
			if(exer_ind<exer_list.length-1){
				chooseframes=true
				playVid(true)
			}
			else{
				document.getElementById("host-video").pause()
			}
		}
	})
	if(cnt==1)
	{
		chooseframes=true
		playVid(true)
	}
	else
	alert("None selected")
	
}

function changeExercise(buttonId){
	let val;
	if(buttonId=="button-1")
	{
		exer[0]=!exer[0];
		val=exer[0];
	}
	else if(buttonId=="button-2")
	{
		exer[1]=!exer[1];
		val=exer[1];
	}
	else
	{
		exer[2]=!exer[2];
		val=exer[2];
	}
	if(val==true)
	{
		let but=document.getElementById(buttonId);
		but.innerText="REMOVE"
		but.style.backgroundColor="green"
		let inp=buttonId.replace("button-","Reps-e")
		document.getElementById(inp).value=1
	}
	else{
		let but=document.getElementById(buttonId);
		but.innerText="ADD"
		but.style.backgroundColor="red"
		let inp=buttonId.replace("button-","Reps-e")
		document.getElementById(inp).value=null
	}
}