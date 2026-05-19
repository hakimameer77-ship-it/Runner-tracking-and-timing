import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// TODO: Paste your personalized configuration values from the Firebase Web App Console screen here
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

// Initialize App Services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function onScanSuccess(decodedText, decodedResult) {
    const runnerId = decodedText;
    const currentTime = new Date();
    
    // Formatting standard time output for readability
    const timestamp = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); 
    const rawTime = currentTime.getTime(); // Used for deterministic ascending numerical sorting

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = "block";
    resultDiv.innerText = `Logged Successfully! Runner ID: ${runnerId} at ${timestamp}`;

    // Upload transaction directly to Firebase under 'tracking/RUNNER_ID' root location
    set(ref(database, 'tracking/' + runnerId), {
        runner_id: runnerId,
        recorded_time: timestamp,
        raw_time: rawTime
    }).catch((error) => {
        console.error("Database storage exception caught:", error);
    });
}

function onScanFailure(error) {
    // Failures suppressed to avoid continuous layout logs during viewfinder rendering
}

// Instantiate visual scanner modules
let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 15, qrbox: 250 }, false
);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);
