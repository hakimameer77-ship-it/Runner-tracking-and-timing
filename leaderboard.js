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

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

const database = firebase.database();
const tbody = document.getElementById('leaderboard-data');
const statTotal = document.getElementById('stat-total');
const statLatest = document.getElementById('stat-latest');

// Ambil Realtime Update untuk Jadual Leaderboard Rasmi
database.ref('tracking/').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let runnersArray = Object.values(data);
        
        // Susun mengikut tempoh masa terpantas
        runnersArray.sort((a, b) => (a.elapsed_time || Infinity) - (b.elapsed_time || Infinity));
        
        // Cari rekod imbasan terbaharu
        let latestRunner = [...runnersArray].sort((a,b) => {
            let timeA = Math.max(a.checkpoint_time || 0, a.finish_time || 0);
            let timeB = Math.max(b.checkpoint_time || 0, b.finish_time || 0);
            return timeB - timeA;
        })[0];

        statTotal.innerText = runnersArray.length;
        if (latestRunner) {
            statLatest.innerText = `${latestRunner.runner_id} (${latestRunner.status === 'Finished' ? '🏁 Tamat' : '🏃‍♂️ Mula'})`;
        }

        tbody.innerHTML = "";
        runnersArray.forEach((runner, index) => {
            let row = `
                <tr>
                    <td style="font-weight: bold; color: ${index < 3 ? '#1982c4' : '#102a43'}">#${index + 1}</td>
                    <td>${runner.runner_id}</td>
                    <td style="font-weight: 600; color: ${runner.status === 'Finished' ? '#2ec4b6' : '#ff4b4b'}">
                        ${runner.status === 'Finished' ? '⏱️ ' + runner.recorded_time : '🏃‍♂️ In Progress'}
                    </td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } else {
        statTotal.innerText = "0";
        statLatest.innerText = "None";
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #627d98;">Awaiting initialization parameters from checkpoint marshals...</td></tr>`;
    }
});

function deleteRunner(runnerId) {
    if (confirm(`Padam rekod ${runnerId}?`)) {
        database.ref('tracking/' + runnerId).remove();
    }
}
