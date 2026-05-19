import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// Official verified configuration from your Firebase App Console
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

// Initialize Firebase App & Database Services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const leaderboardTable = document.getElementById('leaderboard-data');

const trackingRef = ref(database, 'tracking/');

// Actively listen to real-time additions or adjustments in the cloud
onValue(trackingRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Map data structure into an array format
        let runnersArray = Object.values(data);
        
        // Sort ascending using the raw chronological unix stamp (Fastest runners first)
        runnersArray.sort((a, b) => a.raw_time - b.raw_time);
        
        // Clear previous table viewport records before iterating
        leaderboardTable.innerHTML = "";
        
        // Construct and append layout strings rows live
        runnersArray.forEach((runner, index) => {
            let row = `<tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${runner.runner_id}</td>
                <td>${runner.recorded_time}</td>
            </tr>`;
            leaderboardTable.innerHTML += row;
        });
    } else {
        leaderboardTable.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #999;">Awaiting initialization parameters from checkpoint marshals...</td></tr>`;
    }
});
