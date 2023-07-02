const html = {
	'user': {
		'video': [ document.getElementById("user-video-0"), 
				   document.getElementById("user-video-1"), 
				   document.getElementById("user-video-2")
				],
		'canvas': [
			document.getElementById("user-canvas-0"),
			document.getElementById("user-canvas-1"),
			document.getElementById("user-canvas-2")
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
const angles =[[7,5,11],[8,6,12],[9,7,5],[10,8,6],[13,11,12],[14,12,11],[5,11,13],[6,12,14],[11,13,15],[12,14,16]]

let rep= 1;
let webcam = {
	'devices': [],
	'count': 0
}

let pau=true

let model_poses=[null,null];

async function master(){
	loading_status = await load_movenet();
	loading_status = load_media();

	plot();
}

