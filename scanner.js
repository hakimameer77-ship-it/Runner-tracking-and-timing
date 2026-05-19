const firebaseConfig = {
  apiKey: "AIzaSyAMThjhhw7jWb2pvYz5OFcnvMiTt6-Co",
  authDomain: "runner-system.firebaseapp.com",
  databaseURL: "https://runner-system-default-rtdb.firebaseio.com",
  projectId: "runner-system",
  storageBucket: "runner-system.firebasestorage.app",
  messagingSenderId: "420895973613",
  appId: "1:420895973613:web:5842b54c9fe82e061face4",
  measurementId: "G-2XH1NE0EPT"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function onScanSuccess(decodedText) {
    const runnerId = decodedText;
    database.ref('tracking/' + runnerId).set({
        runner_id: runnerId,
        recorded_time: new Date().toLocaleTimeString(),
        raw_time: Date.now()
    });
    alert("Logged: " + runnerId);
}

let scanner = new Html5QrcodeScanner("reader", { fps: 15, qrbox: 250 }, false);
scanner.render(onScanSuccess);
