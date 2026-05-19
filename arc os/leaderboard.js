import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

// TODO: Paste your personalized configuration values from the Firebase Web App Console screen here
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

// Initialize App Services
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
const leaderboardTable = document.getElementById('leaderboard-data');

const trackingRef = ref(database, 'tracking/');

// Subscribing to Cloud Tree alterations
onValue(trackingRef, (snapshot) => {
    const data = snapshot.val();
    if (data) {
        // Transform JSON tree schema into standard sortable linear arrays
        let runnersArray = Object.values(data);
        
        // Sorting ascending using relative unix time indexes
        runnersArray.sort((a, b) => a.raw_time - b.raw_time);
        
        // Emptying placeholder text content rows
        leaderboardTable.innerHTML = "";
        
        // Dynamic Table Row injection lifecycle loop
        runnersArray.forEach((runner, index) => {
            let row = `<tr>
                <td><strong>#${index + 1}</strong></td>
                <td>${runner.runner_id}</td>
                <td>${runner.recorded_time}</td>
            </tr>`;
            leaderboardTable.innerHTML += row;
        });
    } else {
        leaderboardTable.innerHTML = `<tr><td colspan="3" style="text-align: center; color: #999;">No logged tracking records discovered.</td></tr>`;
    }
});
