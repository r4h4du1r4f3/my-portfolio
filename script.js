import { initializeApp } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-analytics.js";
import { getDatabase, ref, push, onValue } from "https://www.gstatic.com/firebasejs/10.5.0/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBgiIo1XCwtq4VWQArRl2RkaVEB181Hi-I",
    authDomain: "portfolio-comment-db190.firebaseapp.com",
    projectId: "portfolio-comment-db190",
    storageBucket: "portfolio-comment-db190.firebasestorage.app",
    messagingSenderId: "941782972125",
    appId: "1:941782972125:web:1aa85c99fda171221dcd34",
    measurementId: "G-LDSS3FM68J"
};

// Initialize Firebase
// Declare variables in module scope so other functions can access them
let app = null;
let analytics = null;
let db = null;
let commentsRef = null;

try {
    app = initializeApp(firebaseConfig);
    analytics = getAnalytics(app);
    // Use the region-specific database URL (recommended by Firebase warning)
    const databaseUrl = "https://portfolio-comment-db190-default-rtdb.asia-southeast1.firebasedatabase.app";
    db = getDatabase(app, databaseUrl);
    commentsRef = ref(db, "comments");

    // Add error logging for database connection
    const connectedRef = ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
        if (snap.val() === true) {
            console.log("Connected to Firebase Database");
        } else {
            console.log("Not connected to Firebase Database");
        }
    });

    console.log('Firebase initialized successfully');
} catch (error) {
    console.error("Firebase initialization error:", error);
}
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector("#comment-form");
    const input = document.querySelector("#comment-input");
    const list = document.querySelector("#comment-list");

    if (form && input && list) {
        form.addEventListener("submit", e => {
            e.preventDefault();
            const text = input.value.trim();
            if (text) {
                if (!commentsRef) {
                    console.error('commentsRef is not available - Firebase may not be initialized');
                    return;
                }

                try {
                    push(commentsRef, {
                    text,
                    timestamp: Date.now()
                    });
                } catch (err) {
                    console.error('Error pushing comment:', err);
                }
                input.value = "";
            }
        });

        // Display comments live
        if (!commentsRef) {
            console.error('commentsRef is not available for onValue - Firebase may not be initialized');
        } else {
            onValue(commentsRef, snapshot => {
                list.innerHTML = "";
                snapshot.forEach(child => {
                    const data = child.val();
                    const li = document.createElement("li");
                    const date = new Date(data.timestamp).toLocaleString();
                    li.textContent = `${data.text}  — ${date}`;
                    list.appendChild(li);
                });
            }, (err) => {
                console.error('onValue error:', err);
            });
        }
    }
});

function toggleMenu() {
    const menu = document.querySelector('.menu-links');
    const icon = document.querySelector('.hamburger-icon');
    menu.classList.toggle('open')
    icon.classList.toggle('open')
}