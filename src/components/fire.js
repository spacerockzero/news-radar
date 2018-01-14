import firebase from '@firebase/app';
import '@firebase/firestore';

let config = {
	apiKey: 'AIzaSyCDLzg1z67fO1nxguLdSRK3Tf5bDwgPsM4',
	authDomain: 'dev-radar.firebaseapp.com',
	databaseURL: 'https://dev-radar.firebaseio.com',
	projectId: 'dev-radar',
	storageBucket: 'dev-radar.appspot.com',
	messagingSenderId: '549078923980'
};

firebase.initializeApp(config);
firebase
	.firestore()
	.enablePersistence()
	.then(() => {
		let db = firebase.firestore();
	})
	.catch(err => {
		if (err.code === 'failed-precondition') {
			console.log('mult tabs open. can only persist on at a time');
		}
		else if (err.code === 'unimplemented') {
			console.log('browser doesnt support persistence features');
		}
		let db = firebase.firestore();
	});

export default firebase.default;
export const firestore = firebase.firestore();
