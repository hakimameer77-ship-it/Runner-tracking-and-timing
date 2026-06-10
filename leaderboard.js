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
const tbody = document.getElementById('leaderboard-data');
const statTotal = document.getElementById('stat-total');
const statLatest = document.getElementById('stat-latest');

database.ref('tracking/').on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let runnersArray = Object.values(data);
        runnersArray.sort((a, b) => (a.elapsed_time || Infinity) - (b.elapsed_time || Infinity));
        
        let latestRunner = [...runnersArray].sort((a,b) => {
            let timeA = Math.max(a.start_time || 0, a.checkpoint1_time || 0, a.checkpoint2_time || 0, a.finish_time || 0);
            let timeB = Math.max(b.start_time || 0, b.checkpoint1_time || 0, b.checkpoint2_time || 0, b.finish_time || 0);
            return timeB - timeA;
        })[0];

        statTotal.innerText = runnersArray.length;
        if (latestRunner) {
            statLatest.innerText = `${latestRunner.runner_id} (${latestRunner.status})`;
        }

        tbody.innerHTML = "";
        runnersArray.forEach((runner, index) => {
            let statusDisplay = runner.status === 'Finished' ? `⏱️ ${runner.recorded_time}` : `🏃‍♂️ ${runner.status}`;
            let row = `
                <tr>
                    <td style="font-weight: bold;">#${index + 1}</td>
                    <td>${runner.runner_id}</td>
                    <td style="font-weight: 600;">${statusDisplay}</td>
                </tr>
            `;
            tbody.innerHTML += row;
        });
    } else {
        statTotal.innerText = "0";
        statLatest.innerText = "None";
        tbody.innerHTML = `<tr><td colspan="3" style="text-align: center;">Awaiting initialization from marshals...</td></tr>`;
    }
});
