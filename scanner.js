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

// KUNCI KESELAMATAN: Elakkan kamera scan benda yang sama banyak kali dalam 1 saat
let isProcessing = false; 

function onScanSuccess(decodedText) {
    // Jika sistem sedang hantar data, abaikan imbasan baru buat sementara waktu
    if (isProcessing) return;
    isProcessing = true;

    try {
        // PEMBERSIH TEKS: Buang jarak (space) dan tukar simbol terlarang Firebase kepada sengkang (-)
        let runnerId = decodedText.trim().replace(/[.#$\[\]\/]/g, "-");
        
        if (!runnerId) {
            alert("Ralat: Kod QR kosong atau tidak sah!");
            isProcessing = false;
            return;
        }

        const stationElement = document.getElementById("scan-station");
        if (!stationElement) {
            alert("Ralat Sistem: Pilihan stesen tidak dijumpai di paparan skrin!");
            isProcessing = false;
            return;
        }
        
        const station = stationElement.value;
        const runnerRef = database.ref('tracking/' + runnerId);

        // Bunyikan Beep jika ada
        if (beep) beep.play().catch(e => console.log("Audio play blocked by phone"));

        // Proses penghantaran data ke Firebase
        runnerRef.once('value').then((snapshot) => {
            const data = snapshot.val() || {};
            const now = Date.now();

            if (station === 'start') {
                runnerRef.set({
                    runner_id: runnerId,
                    start_time: now,
                    status: 'In Progress',
                    recorded_time: '🏃‍♂️ Racing...',
                    elapsed_time: Infinity
                }).then(() => {
                    alert(`✅ MULA: Pelari [${runnerId}] berjaya direkod!`);
                    setTimeout(() => { isProcessing = false; }, 2000); // Rehat 2 saat sebelum scan seterusnya
                });
            } 
            else if (station === 'checkpoint1') {
                if (!data.start_time) {
                    alert(`⚠️ AMARAN: Pelari [${runnerId}] BELUM scan di START LINE!`);
                    setTimeout(() => { isProcessing = false; }, 2000);
                    return;
                }
                runnerRef.update({
                    checkpoint1_time: now,
                    status: 'Passed Checkpoint 1'
                }).then(() => {
                    alert(`✅ CHECKPOINT 1: Pelari [${runnerId}] berjaya dilepaskan!`);
                    setTimeout(() => { isProcessing = false; }, 2000);
                });
            }
            else if (station === 'checkpoint2') {
                if (!data.start_time) {
                    alert(`⚠️ AMARAN: Pelari [${runnerId}] BELUM scan di START LINE!`);
                    setTimeout(() => { isProcessing = false; }, 2000);
                    return;
                }
                runnerRef.update({
                    checkpoint2_time: now,
                    status: 'Passed Checkpoint 2'
                }).then(() => {
                    alert(`✅ CHECKPOINT 2: Pelari [${runnerId}] berjaya dilepaskan!`);
                    setTimeout(() => { isProcessing = false; }, 2000);
                });
            }
            else if (station === 'finish') {
                if (!data.start_time) {
                    alert(`⚠️ AMARAN: Pelari [${runnerId}] BELUM scan di START LINE!`);
                    setTimeout(() => { isProcessing = false; }, 2000);
                    return;
                }

                const elapsedMs = now - data.start_time;
                const hours = Math.floor(elapsedMs / 3600000);
                const minutes = Math.floor((elapsedMs % 3600000) / 60000);
                const seconds = Math.floor((elapsedMs % 60000) / 1000);
                const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                runnerRef.update({
                    finish_time: now,
                    elapsed_time: elapsedMs,
                    recorded_time: formattedTime,
                    status: 'Finished'
                }).then(() => {
                    alert(`🏆 TAMAT: Pelari [${runnerId}] Selesai! Masa: ${formattedTime}`);
                    setTimeout(() => { isProcessing = false; }, 2000);
                });
            }
        }).catch((error) => {
            alert("Ralat Pangkalan Data (Firebase): " + error.message);
            isProcessing = false;
        });
        
    } catch (err) {
        alert("Ralat Aplikasi: " + err.message);
        isProcessing = false;
    }
}

// Render Scanner HTML5
let scanner = new Html5QrcodeScanner("reader", { fps: 15, qrbox: 250 }, false);
scanner.render(onScanSuccess);
