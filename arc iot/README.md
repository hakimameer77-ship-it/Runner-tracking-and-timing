# Arc IoT: Runner Tracking & Timing System

A high-performance, real-time runner tracking and timing system built with QR Code technology and Firebase Cloud. This project automates race management, providing live runner position updates and a futuristic, professional-grade leaderboard display.

## 🚀 Key Features
* **Live QR Scanning:** Rapid scanning using any device camera to log runner timing instantly.
* **Real-time Dashboard:** Automatically updates leaderboard positions without needing to refresh the page.
* **Futuristic HUD Design:** A premium Cyberpunk/Stadium HUD-inspired interface for a high-impact visual experience.
* **Firebase Integration:** Reliable and fast real-time data storage.
* **Admin Controls:** Simple, one-click record deletion directly from the leaderboard.

## 🛠️ Technology Stack
* **Frontend:** HTML5, CSS3 (Glassmorphism & Neon Design), JavaScript.
* **Backend:** Firebase Realtime Database.
* **Deployment:** GitHub Pages.
* **Library:** [Html5-QRCode](https://github.com/mebjas/html5-qrcode).

## 📋 How to Use
1. **Scanner:** Navigate to `scanner.html`, grant camera permissions, and scan the runner's QR Code.
2. **Tracking:** Data is instantly pushed to Firebase and reflected on the dashboard.
3. **Leaderboard:** View live runner standings at `index.html` with an automated podium display.
4. **Management:** Use the `❌` button on any runner card to remove incorrect records or reset data.

## ⚙️ Development Setup
To customize or further develop this project:
1. Clone this repository.
2. Link the project to your own Firebase Console.
3. Update the `firebaseConfig` in both `index.html` and `scanner.js` with your specific API credentials.

## 📜 License
This project is open-source and intended for educational purposes and sports event management.

---
*Built with passion to push the boundaries of sports technology.*
