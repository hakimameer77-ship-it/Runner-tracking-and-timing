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

// Subscribing to Cloud Tree variations dynamically
onValue(trackingRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Map raw object data properties into a linear array instance
        let runnersArray = Object.values(data);
        
        // Sorting chronologically using epoch millisecond values (Fastest runner hits #1)
        runnersArray.sort((a, b) => a.raw_time - b.raw_time);
        
        // Emptying table contents rows viewport data properties before injection loop
        leaderboardTable.innerHTML = "";
        
        // Re-inject layout row structures cleanly 
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
