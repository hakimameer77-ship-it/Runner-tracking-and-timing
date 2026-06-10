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
const beep = document.getElementById("beep-sound");

let isProcessing = false; 
let lastScannedText = "";
let lastScannedTime = 0;

function onScanSuccess(decodedText) {
    const now = Date.now();
    
    // Anti-spam: Sekat jika QR yang yang sama diimbas berturut-turut dalam masa 3 saat
    if (decodedText === lastScannedText && (now - lastScannedTime) < 3000) {
        return; 
    }

    if (isProcessing) return;
    isProcessing = true;

    lastScannedText = decodedText;
    lastScannedTime = now;

    try {
        // Bersihkan teks daripada simbol yang dilarang oleh Firebase
        let runnerId = decodedText.trim().replace(/[.#$\[\]\/]/g, "-");
        if (!runnerId) { isProcessing = false; return; }

        const stationElement = document.getElementById("scan-station");
        const station = stationElement.value;
        const runnerRef = database.ref('tracking/' + runnerId);

        if (beep) {
            beep.play().catch(e => console.log("Audio play blocked"));
        }

        runnerRef.once('value').then((snapshot) => {
            const data = snapshot.val() || {};

            if (station === 'start') {
                // Menukar Infinity kepada 999999999999 untuk mengelakkan ralat Firebase set failed
                runnerRef.set({
                    runner_id: runnerId,
                    start_time: now,
                    status: 'In Progress',
                    recorded_time: '🏃‍♂️ Racing...',
                    elapsed_time: 999999999999
                }).then(() => {
                    alert(`✅ START LINE:\nPelari [${runnerId}] Mula Berlari!`);
                    isProcessing = false;
                }).catch((err) => {
                    alert("Firebase Set Error: " + err.message);
                    isProcessing = false;
                });
            } 
            else if (station === 'checkpoint1') {
                if (!data.start_time) { 
                    alert(`⚠️ AMARAN:\nPelari [${runnerId}] tidak melalui START LINE lagi!`); 
                    isProcessing = false; 
                    return; 
                }
                runnerRef.update({ checkpoint1_time: now, status: 'Passed Checkpoint 1' }).then(() => {
                    alert(`✅ CHECKPOINT 1:\nPelari [${runnerId}] Melepasi Checkpoint 1!`);
                    isProcessing = false;
                });
            }
            else if (station === 'checkpoint2') {
                if (!data.start_time) { 
                    alert(`⚠️ AMARAN:\nPelari [${runnerId}] tidak melalui START LINE lagi!`); 
                    isProcessing = false; 
                    return; 
                }
                runnerRef.update({ checkpoint2_time: now, status: 'Passed Checkpoint 2' }).then(() => {
                    alert(`✅ CHECKPOINT 2:\nPelari [${runnerId}] Melepasi Checkpoint 2!`);
                    isProcessing = false;
                });
            }
            else if (station === 'finish') {
                if (!data.start_time) { 
                    alert(`⚠️ AMARAN:\nPelari [${runnerId}] tidak melalui START LINE lagi!`); 
                    isProcessing = false; 
                    return; 
                }
                
                const elapsedMs = now - data.start_time;
                const hours = Math.floor(elapsedMs / 3600000);
                const minutes = Math.floor((elapsedMs % 3600000) / 60000);
                const seconds = Math.floor((elapsedMs % 60000) / 1000);
                const formattedTime = `${hours.toString().padStart(2,'0')}:${minutes.toString().padStart(2,'0')}:${seconds.toString().padStart(2,'0')}`;

                runnerRef.update({
                    finish_time: now,
                    elapsed_time: elapsedMs,
                    recorded_time: formattedTime,
                    status: 'Finished'
                }).then(() => {
                    alert(`🏆 FINISH LINE:\nPelari [${runnerId}] TAMAT!\nMasa: ${formattedTime}`);
                    isProcessing = false;
                });
            }
        }).catch((err) => { 
            alert("Ralat Firebase: " + err.message); 
            isProcessing = false; 
        });
    } catch (err) { 
        alert("Ralat Aplikasi: " + err.message); 
        isProcessing = false; 
    }
}

let html5QrcodeScanner = new Html5QrcodeScanner("reader", { 
    fps: 10, 
    qrbox: { width: 250, height: 250 },
    rememberLastUsedCamera: true
}, false);

html5QrcodeScanner.render(onScanSuccess);
