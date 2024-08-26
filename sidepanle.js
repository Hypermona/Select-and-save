const listDiv = document.getElementById("qalinst");
// listDiv.innerHTML = null;
chrome.storage.local.get(null, function (items) {
  for (let [key, newValue] of Object.entries(items)) {
    console.log(`Storage key "${key}" , new value is "${newValue}".`);
    const qnAdiv = document.createElement("div");
    const Qtag = document.createElement("h3");
    const Atag = document.createElement("p");
    Qtag.innerHTML = key;
    Atag.innerHTML = newValue;
    qnAdiv.appendChild(Qtag);
    qnAdiv.appendChild(Atag);
    qnAdiv.append(document.createComment("br"));
    listDiv.appendChild(qnAdiv);
  }
  console.log(items);
});
chrome.storage.onChanged.addListener((changes, namespace) => {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    const qnAdiv = document.createElement("div");
    const Qtag = document.createElement("h3");
    const Atag = document.createElement("p");
    Qtag.innerHTML = key;
    Atag.innerHTML = newValue;
    qnAdiv.appendChild(Qtag);
    qnAdiv.appendChild(Atag);
    qnAdiv.append(document.createComment("br"));
    listDiv.appendChild(qnAdiv);
  }
});
