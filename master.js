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
// }
const angles =[[7,5,11],[8,6,12],[9,7,5],[10,8,6],[13,11,12],[14,12,11],[5,11,13],[6,12,14],[11,13,15],[12,14,16],[6,2,5],[6,1,5]]
const selAngles=[null,null,null,null]

let rep= 1;
let webcam = {
	'devices': [],
	'count': 0
}

let pau=true

let exer_list=["videos/e3.mp4","videos/e2.mp4","videos/e1.mp4","videos/e5.mp4"]

let model_poses=[null,null];

const exer =[true,false,false,false];
let exer_rep =[];

let exer_ind=0;

let wrongframe=0
let totalframe=0
let chooseframes=false

let ang=[0,0,0]

async function master(){
	loading_status = await load_movenet();
	loading_status = load_media();
	getAngleMeter();
	plot();
}

