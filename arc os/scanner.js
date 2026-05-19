import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAMThjhhw7jWb2pvYz5OFcnvMiTt6-Co",
  authDomain: "runner-system.firebaseapp.com",
  databaseURL: "https://runner-system-default-rtdb.firebaseio.com",
  projectId: "runner-system",
  storageBucket: "runner-system.appspot.com",
  messagingSenderId: "420895973613",
  appId: "1:420895973613:web:5842b54c9fe82e061face4",
  measurementId: "G-2XH1NE0EPT"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function onScanSuccess(decodedText, decodedResult) {
    const runnerId = decodedText;
    const currentTime = new Date();
    
    const timestamp = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); 
    const rawTime = currentTime.getTime();

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = "block";
    resultDiv.innerText = `Logged Successfully! Runner ID: ${runnerId} at ${timestamp}`;

    set(ref(database, 'tracking/' + runnerId), {
        runner_id: runnerId,
        recorded_time: timestamp,
        raw_time: rawTime
    }).catch((error) => {
        console.error("Database cloud write error caught:", error);
    });
}

function onScanFailure(error) {}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 15, qrbox: 250 }, false
);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);
