// const html = {
// 	'user': {
// 		'video': [ document.getElementById("user-video-0"), 
// 				   document.getElementById("user-video-1"), 
// 				   document.getElementById("user-video-2")
// 				],
// 		'canvas': [
// 			document.getElementById("user-canvas-0"),
// 			document.getElementById("user-canvas-1"),
// 			document.getElementById("user-canvas-2")
// 		]
// 	},
// 	'host': {
// 		'video': [document.getElementById('host-video')],
// 		'canvas': [document.getElementById('host-canvas')]
// 	}
	
// }

const html = {
	'user': {
		'video': [ document.getElementById("user-video-2"),
				document.getElementById("user-video-0"), 
				   document.getElementById("user-video-1")
				],
		'canvas': [
			document.getElementById("user-canvas-2"),
			document.getElementById("user-canvas-0"),
			document.getElementById("user-canvas-1")
		]
	},
	'host': {
		'video': [document.getElementById('host-video')],
		'canvas': [document.getElementById('host-canvas')]
	}
	
}


// const angles ={
// 	'arm':{
// 		'shoulder': {
// 			'left': [7,5,11],
// 			'right': [8,6,12]
// 		},
// 		'elbow':{
// 			'left': [9,7,5],
// 			'right': [10,8,6]
// 		}
// 	},
// 	'leg':{
// 		'inner': {
// 			'left': [13,11,12],
// 			'right': [14,12,11]
// 		},
// 		'outter':{
// 			'left': [5,11,13],
// 			'right': [6,12,14]
// 		},
// 		'knee': {
// 			'left': [11,13,15],
// 			'right': [12,14,16]
// 		},
// 	}
// } 1,2,5,6,7,8,11,12,13,14
const audiosrc ={
	1: ["audio/headL.wav","audio/headR.wav"],
	2: ["audio/headR.wav","audio/headL.wav"],
	5: ["audio/LshoulderA.wav","audio/LshoulderT.wav"],
	6: ["audio/RshoulderT.wav","audio/RshoulderA.wav"],
	7: ["audio/BLelbow.wav","audio/SLelbow.wav"],
	8: ["audio/BRelbow.wav","audio/SRelbow.wav"],
	11: ["audio/LlegA.wav","audio/legC.wav"],
	12: ["audio/RlegA.wav","audio/legC.wav"],
	13: ["audio/BLknee.wav","audio/SLknee.wav"],
	14: ["audio/BRknee.wav","audio/SRknee.wav"]
}
const angles =[[7,5,11],[8,6,12],[9,7,5],[10,8,6],[13,11,12],[14,12,11],[5,11,13],[6,12,14],[11,13,15],[12,14,16],[6,2,5],[6,1,5]]
const selAngles=[null,null,null,null]

let rep= 1;
let webcam = {
	'devices': [],
	'count': 0
}

let pau=true

let exer_list=["videos/bentoverrow.mp4","videos/widefloorpress.mp4","videos/e1.mp4","videos/e5.mp4"]

let model_poses=[null,null];

const exer =[true,false,false,false];
let exer_rep =[];

let exer_ind=0;

let checkStart=false

let wrongframe=0
let totalframe=0
let chooseframes=false
let diffAngleState=true
let ang=[0,0,0]

async function master(){
	loading_status = await load_movenet();
	loading_status = load_media();
	getAngleMeter();
	plot();
}

