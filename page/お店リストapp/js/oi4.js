async function getJsonData() {
  const requestURL = "data/store-info.json";
  const request = new Request(requestURL);

  const response = await fetch(request);
  const storeList = await response.json();
  showList(storeList);
}

function showList(json) {
  const storeList = document.getElementById("store-list");
  let innerHTML = "";
  json.forEach((store) => {
    innerHTML = innerHTML.concat(`
      <li>
        <a href="${store["url"]}" target="_blank">${store["name"]}</a>
          <ul>
            <li>${store["where"]}</li>
            <li>${store["comment"]}</li>
          </ul>
      </li>
    `);
  });
  innerHTML = `<ul class="no-dot">${innerHTML}</ul>`;

  storeList.innerHTML = innerHTML;
}

getJsonData();
