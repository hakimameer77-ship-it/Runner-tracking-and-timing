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

// Initialize Firebase
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();

function onScanSuccess(decodedText, decodedResult) {
    const runnerId = decodedText;
    const currentTime = new Date();
    const timestamp = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
    const rawTime = currentTime.getTime();

    // Bunyi bip sukses
    const audio = document.getElementById('beep-sound');
    if(audio) { audio.play(); }

    // Hantar ke Database path 'tracking/'
    database.ref('tracking/' + runnerId).set({
        runner_id: runnerId,
        recorded_time: timestamp,
        raw_time: rawTime
    });

    const resultDiv = document.getElementById('result');
    resultDiv.style.display = "block";
    resultDiv.innerHTML = `⚡ [LOGGED] ${runnerId} <br> Time: ${timestamp}`;
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", { fps: 15, qrbox: 250 }, false);
html5QrcodeScanner.render(onScanSuccess);
