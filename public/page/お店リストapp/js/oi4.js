const storeList = document.querySelector("#store-list");
const editListButton = document.querySelector("#edit-list");
const addButton = document.querySelector("#add");
const nameForm = document.querySelector("#name");
const urlForm = document.querySelector("#url");
const whereForm = document.querySelector("#where");
const commentForm = document.querySelector("#comment");
const visitedForm = document.querySelector("#visited");
// const addEditFrom = document.getElementById("add-edit-form");

// window.addEventListener("load", () => {
//   storeList.style.display = "block";
//   // addEditFrom.style.display = "none";
// });

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
let editButtonList;
let deleteButtonList;
let visitedButtonList;
let notVisitedButtonList;

function renewList() {
  const storeDataMap = {};
  get(child(storeListRef, `/`)).then((snapshot) => {
    for (const id in snapshot.val()) {
      const storeData = snapshot.child(id).val();
      storeDataMap[id] = storeData;
    }
    editListHtml(storeDataMap);
  });
}

function editListHtml(storeDataMap) {
  let notVisited = "";
  let visited = "";
  for (const id in storeDataMap) {
    const storeData = storeDataMap[id];
    const storeNameTag =
      storeData["url"] === ""
        ? `<p>${storeData["name"]}</p>`
        : `<a href="${storeData["url"]}" target="_blank">${storeData["name"]}</a>`;
    // console.log(storeNameTag);
    if (!storeData["visited"]) {
      notVisited =
        notVisited +
        `
        <hr style="border-style: dotted;" />
        <li>
          ${storeNameTag}
          <ul class="no-dot">
            <li>${storeData["where"]}</li>
            <li>${storeData["comment"]}</li>
          </ul>
          <!-- <button type="button" id="${id}" class="edit">編集</button> -->
          <button type="button" id="${id}" class="delete" style="display: none;">削除</button>
          <button type="button" id="${id}" class="visited" style="display: none;">もう行った</button>
        </li>
      `;
    } else {
      visited =
        visited +
        `
        <hr style="border-style: dotted;" />
        <li>
          ${storeNameTag}
          <ul class="no-dot">
            <li>${storeData["where"]}</li>
            <li>${storeData["comment"]}</li>
          </ul>
          <!-- <button type="button" id="${id}" class="edit">編集</button> -->
          <button type="button" id="${id}" class="delete" style="display: none;">削除</button>
          <button type="button" id="${id}" class="not-visited" style="display: none;">まだ行ってない</button>
        </li>
      `;
    }
  }
  const innerHTML = `
  <hr />
  <p>まだ行ってない</p><ul id="not-visited">${notVisited}</ul>
  <hr />
  <p>もう行った</p><ul id="visited">${visited}</ul>
  `;
  // console.log(innerHTML);
  storeList.innerHTML = innerHTML;
  console.log(innerHTML);

  // editButtonList = document.querySelectorAll(".edit");
  deleteButtonList = document.querySelectorAll(".delete");
  visitedButtonList = document.querySelectorAll(".visited");
  notVisitedButtonList = document.querySelectorAll(".not-visited");
  // console.log(editButtonList);
  // console.log(deleteButtonList);

  // // 編集ボタンを押したときの処理
  // editButtonList.forEach((editButton) => {
  //   // console.log(editButton);
  //   editButton.addEventListener("click", () => {
  //     // console.log(editButton.id);
  //   });
  // });

  // 削除ボタンを押したときの処理
  deleteButtonList.forEach((deleteButton) => {
    const storeId = deleteButton.id;
    deleteButton.addEventListener("click", () => {
      get(child(storeListRef, storeId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const isConfirmed = confirm(
              `「${snapshot.child("name").val()}」を削除しますか`
            );
            if (isConfirmed) {
              removeStoreData(storeId);
            }
          } else {
            alert(データが見つかりません);
          }
        })
        .catch((error) => {
          alert(`エラー: ${error}`);
        });
    });
  });

  // もう行ったボタンを押したときの処理
  visitedButtonList.forEach((visitedeButton) => {
    const storeId = visitedeButton.id;
    visitedeButton.addEventListener("click", () => {
      get(child(storeListRef, storeId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const isConfirmed = confirm(
              `「${snapshot.child("name").val()}」を「もう行った」にしますか`
            );
            if (isConfirmed) {
              reverseVisited(storeId);
            }
          } else {
            alert(データが見つかりません);
          }
        })
        .catch((error) => {
          alert(`エラー: ${error}`);
        });
    });
  });

  // まだ行ってないボタンを押したときの処理
  notVisitedButtonList.forEach((notVisitedButton) => {
    const storeId = notVisitedButton.id;
    notVisitedButton.addEventListener("click", () => {
      get(child(storeListRef, storeId))
        .then((snapshot) => {
          if (snapshot.exists()) {
            const isConfirmed = confirm(
              `「${snapshot
                .child("name")
                .val()}」を「まだ行ってない」にしますか`
            );
            if (isConfirmed) {
              reverseVisited(storeId);
            }
          } else {
            alert(データが見つかりません);
          }
        })
        .catch((error) => {
          alert(`エラー: ${error}`);
        });
    });
  });
}

function removeStoreData(id) {
  remove(child(storeListRef, id));
}

function reverseVisited(id) {
  let visited;
  get(child(storeListRef, `${id}/visited`))
    .then((snapshot) => {
      if (snapshot.exists()) {
        set(child(storeListRef, `${id}/visited`), !snapshot.val());
      } else {
        console.log("No data available");
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

onValue(storeListRef, () => {
  renewList();
});

addButton.addEventListener("click", () => {
  let notFilled = [];
  let name = nameForm.value;
  let url = urlForm.value;
  let where = whereForm.value;
  let comment = commentForm.value;
  let visited = visitedForm.checked;
  if (name == "") {
    notFilled.push("「店名」");
  }
  // if (url == "") {
  //   notFilled.push("「リンク」");
  // }
  if (where == "") {
    notFilled.push("「住所」");
  }
  // if (comment == "") {
  //   notFilled.push("「ひとこと」");
  // }
  // console.log(visited);
  if (notFilled.length != 0) {
    alert(`${notFilled.join("")}が入力されていません。`);
  } else {
    pushNewStore(name, url, where, comment, visited);
    nameForm.value = "";
    urlForm.value = "";
    whereForm.value = "";
    commentForm.value = "";
    visitedForm.checked = false;
  }
});

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

editListButton.addEventListener("click", () => {
  document.querySelectorAll(".delete").forEach((deleteButton) => {
    deleteButton.style.display =
      deleteButton.style.display == "none" ? "block" : "none";
  });
  document.querySelectorAll(".visited").forEach((visitedButton) => {
    visitedButton.style.display =
      visitedButton.style.display == "none" ? "block" : "none";
  });
  document.querySelectorAll(".not-visited").forEach((notVisitedButton) => {
    notVisitedButton.style.display =
      notVisitedButton.style.display == "none" ? "block" : "none";
  });
});
