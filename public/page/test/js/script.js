import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  child,
  onValue,
  push,
  remove,
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDQwFFDLYTPFDN91-1hjE_J8ueSUZpyNI4",
  authDomain: "my-sites-96d9c.firebaseapp.com",
  databaseURL:
    "https://my-sites-96d9c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "my-sites-96d9c",
  storageBucket: "my-sites-96d9c.appspot.com",
  messagingSenderId: "103827506406",
  appId: "1:103827506406:web:b7f7dfb4b2b2a7933be727",
};

const app = initializeApp(firebaseConfig);

const db = getDatabase(app);
const storeListRef = ref(db, "stores");
const newStoreRef = push(storeListRef);

function pushNewStore(name, url, where, comment, visited) {
  set(newStoreRef, {
    // id: newStoreRef.key,
    name: name,
    url: url,
    where: where,
    comment: comment,
    visited: visited,
  });
}

function removeStore(id) {
  remove(child(storeListRef, `${id}`));
}

// onValue(storeListRef, (snapshot) => {
//   const data = snapshot.val();
//   console.log(data);
// });

function getStore(id) {
  get(child(storeListRef, `${id}`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log(snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function getAllStoresId() {
  const ids = [];
  get(child(storeListRef, `/`)).then((snapshot) => {
    // console.log(snapshot.val());
    for (let data in snapshot.val()) {
      ids.push(data);
    }
    console.log(ids);
  });
  // return ids;
}

function removeAllStores() {
  get(child(storeListRef, `/`)).then((snapshot) => {
    // console.log(snapshot.val());
    for (let data in snapshot.val()) {
      remove(child(storeListRef, data));
    }
  });
}
// removeAllStores();

// pushNewStore("a", "b", "c", "d");

// pushNewStore("test1", "https://google.com", "place 1", "comment 1", true);
// pushNewStore("test2", "", "place 2", "comment 2", true);
// pushNewStore("test3", "https://google.com", "place 3", "comment 3", false);
// pushNewStore("test4", "https://google.com", "place 4", "comment 4", true);
// pushNewStore("test5", "https://google.com", "place 5", "comment 5", false);
