    // Import the functions you need from the SDKs you need
    import userData from './puzzleGame.js';
    import { initializeApp } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-app.js";
    import { getDatabase, ref, get, set, child, update, remove } from "https://www.gstatic.com/firebasejs/9.19.1/firebase-database.js";
    // Your web app's Firebase configuration
    const firebaseConfig = {
      apiKey: "AIzaSyB589G8Y2QICKHzgNdTfnGsilrwoVP-0V8",
      authDomain: "puzzlegame-5d75e.firebaseapp.com",
      databaseURL: "https://puzzlegame-5d75e-default-rtdb.firebaseio.com/",
      projectId: "puzzlegame-5d75e",
      storageBucket: "puzzlegame-5d75e.appspot.com",
      messagingSenderId: "67735790397",
      appId: "1:67735790397:web:fb8a15cf017eef3a79db54"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getDatabase();
    
    console.log(userData());

    function InsertData(username, count, score) {
      set(ref(db, "User/" + Math.floor(Math.random() * 1000)), {
        Name: username,
        Swap: count,
        Score: score
      })
        .then(() => {
          alert("Data added successfully");
        })
        .catch((error) => {
          alert(error);
        });
    }