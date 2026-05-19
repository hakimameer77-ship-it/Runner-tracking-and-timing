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
const leaderboardTable = document.getElementById('leaderboard-data');
const statTotal = document.getElementById('stat-total');
const statLatest = document.getElementById('stat-latest');

const trackingRef = database.ref('tracking/');

trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let runnersArray = Object.values(data);
        
        // Susun masa menaik (Terpaling laju ke atas)
        runnersArray.sort((a, b) => a.raw_time - b.raw_time);
        
        // Cari pelari paling baru mendaftar masuk (Raw time paling tinggi)
        let latestRunner = [...runnersArray].sort((a,b) => b.raw_time - a.raw_time)[0];
        
        // Kemas kini panel statistik live
        statTotal.innerText = runnersArray.length;
        statLatest.innerText = `🏃‍♂️ ${latestRunner.runner_id} (${latestRunner.recorded_time})`;
        
        leaderboardTable.innerHTML = "";
        
        runnersArray.forEach((runner, index) => {
            let rankDisplay = "";
            
            // Logik Penetapan Visual Lencana Podium Atas
            if (index === 0) {
                rankDisplay = `<span class="badge-icon">👑</span> <strong>#1</strong>`;
            } else if (index === 1) {
                rankDisplay = `<span class="badge-icon">🥈</span> <strong>#2</strong>`;
            } else if (index === 2) {
                rankDisplay = `<span class="badge-icon">🥉</span> <strong>#3</strong>`;
            } else {
                rankDisplay = `<strong>#${index + 1}</strong>`;
            }

            let row = `<tr>
                <td>${rankDisplay}</td>
                <td style="font-weight: 600; color: #102a43;">${runner.runner_id}</td>
                <td><span style="background: #e0f2fe; color: #0369a1; padding: 4px 10px; border-radius: 20px; font-size: 13px; font-weight: 600;">⏱️ ${runner.recorded_time}</span></td>
            </tr>`;
            leaderboardTable.innerHTML += row;
        });
    } else {
        statTotal.innerText = "0";
        statLatest.innerText = "None";
        leaderboardTable.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #627d98; font-weight: 500;">Awaiting initialization parameters from checkpoint marshals...</td></tr>`;
    }
});
