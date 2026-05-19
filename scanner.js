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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

function onScanSuccess(decodedText, decodedResult) {
    const runnerId = decodedText;
    const currentTime = new Date();
    
    const timestamp = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }); 
    const rawTime = currentTime.getTime();

    // Mainkan kesan bunyi bip kejayaan
    const audio = document.getElementById('beep-sound');
    if(audio) {
        audio.currentTime = 0;
        audio.play().catch(e => console.log("Audio autoplay restriction caught"));
    }

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = "block";
    resultDiv.innerText = `⚡ [LOGGED] Runner ID: ${runnerId} at ${timestamp}`;

    database.ref('tracking/' + runnerId).set({
        runner_id: runnerId,
        recorded_time: timestamp,
        raw_time: rawTime
    }).catch((error) => {
        console.error("Gagal menghantar data ke Firebase:", error);
    });
}

function onScanFailure(error) {}

let html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", { fps: 15, qrbox: 250 }, false
);
html5QrcodeScanner.render(onScanSuccess, onScanFailure);
