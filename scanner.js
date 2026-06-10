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

function onScanSuccess(decodedText) {
    const runnerId = decodedText.trim();
    const station = document.getElementById("scan-station").value;
    const runnerRef = database.ref('tracking/' + runnerId);

    if (beep) beep.play().catch(e => console.log("Audio play blocked"));

    runnerRef.once('value').then((snapshot) => {
        const data = snapshot.val() || {};
        const now = Date.now();

        if (station === 'start') {
            // Mula Kira Masa dari Sini
            runnerRef.set({
                runner_id: runnerId,
                start_time: now,
                status: 'In Progress',
                recorded_time: '🏃‍♂️ Racing...',
                elapsed_time: Infinity
            });
            alert(`Runner ${runnerId}: START recorded! Time has started.`);
        } 
        else if (station === 'checkpoint1') {
            if (!data.start_time) {
                alert(`⚠️ ERROR: Runner ${runnerId} has NOT scanned at START yet!`);
                return;
            }
            runnerRef.update({
                checkpoint1_time: now,
                status: 'Passed Checkpoint 1'
            });
            alert(`Runner ${runnerId}: Checkpoint 1 cleared!`);
        }
        else if (station === 'checkpoint2') {
            if (!data.start_time) {
                alert(`⚠️ ERROR: Runner ${runnerId} has NOT scanned at START yet!`);
                return;
            }
            runnerRef.update({
                checkpoint2_time: now,
                status: 'Passed Checkpoint 2'
            });
            alert(`Runner ${runnerId}: Checkpoint 2 cleared!`);
        }
        else if (station === 'finish') {
            if (!data.start_time) {
                alert(`⚠️ ERROR: Runner ${runnerId} has NOT scanned at START yet!`);
                return;
            }

            const elapsedMs = now - data.start_time;

            // Format milliseconds ke HH:MM:SS
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

            alert(`🏆 FINISH! Runner ${runnerId} completed. Time: ${formattedTime}`);
        }
    }).catch((error) => {
        console.error("Firebase Error:", error);
    });
}

let scanner = new Html5QrcodeScanner("reader", { fps: 15, qrbox: 250 }, false);
scanner.render(onScanSuccess);
