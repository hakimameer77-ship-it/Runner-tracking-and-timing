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

// Bunyi Beep apabila berjaya imbas
const beep = document.getElementById("beep-sound");

function onScanSuccess(decodedText) {
    const runnerId = decodedText.trim();
    const station = document.getElementById("scan-station").value;
    const runnerRef = database.ref('tracking/' + runnerId);

    if (beep) beep.play().catch(e => console.log("Audio play blocked"));

    runnerRef.once('value').then((snapshot) => {
        const data = snapshot.val();
        const now = Date.now();

        if (station === 'checkpoint') {
            // Logik Mula Kira Masa di Checkpoint
            runnerRef.set({
                runner_id: runnerId,
                checkpoint_time: now,
                status: 'In Progress',
                recorded_time: '🏃‍♂️ Running...',
                elapsed_time: Infinity // Letak nilai tinggi supaya pelari belum tamat berada di bawah leaderboard
            });
            alert(`Runner ${runnerId}: Checkpoint Berjaya Direkod! Masa mula dikira.`);
        } 
        else if (station === 'finish') {
            // Logik Tamat Perlumbaan & Kira Durasi Masa
            if (!data || !data.checkpoint_time) {
                alert(`⚠️ RALAT: Pelari ${runnerId} BELUM mengimbas di Checkpoint 1! Masa tidak dapat dikira.`);
                return;
            }

            if (data.status === 'Finished') {
                if (!confirm(`Pelari ${runnerId} sudah ada rekod penamat. Anda mahu overwrite masa baru?`)) {
                    return;
                }
            }

            const elapsedMs = now - data.checkpoint_time;

            // Tukar Milisaat (ms) kepada format Jam:Minit:Saat (HH:MM:SS)
            const hours = Math.floor(elapsedMs / 3600000);
            const minutes = Math.floor((elapsedMs % 3600000) / 60000);
            const seconds = Math.floor((elapsedMs % 60000) / 1000);
            
            const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

            runnerRef.update({
                finish_time: now,
                elapsed_time: elapsedMs,
                recorded_time: formattedTime,
                status: 'Finished'
            });

            alert(`🏁 TAHNIAH! Runner ${runnerId} Tamat. Masa: ${formattedTime}`);
        }
    }).catch((error) => {
        console.error("Firebase Error:", error);
    });
}

let scanner = new Html5QrcodeScanner("reader", { fps: 15, qrbox: 250 }, false);
scanner.render(onScanSuccess);
