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

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const leaderboardTable = document.getElementById('leaderboard-data');

const trackingRef = database.ref('tracking/');

trackingRef.on('value', (snapshot) => {
    const data = snapshot.val();
    if (data) {
        let runnersArray = Object.values(data);
        
        runnersArray.sort((a, b) => a.raw_time - b.raw_time);
        
        leaderboardTable.innerHTML = "";
        
        runnersArray.forEach((runner, index) => {
            let row = `<tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${runner.runner_id}</td>
                <td>${runner.recorded_time}</td>
            </tr>`;
            leaderboardTable.innerHTML += row;
        });
    } else {
        leaderboardTable.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #627d98; font-weight: 500;">Awaiting initialization parameters from checkpoint marshals...</td></tr>`;
    }
});
