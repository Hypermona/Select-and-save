const storage = chrome.storage.local;
const NO_CONTENT = "No Content";

async function run() {
  function getSelected() {
    function getStyledHtml(element) {
      if (!(element instanceof Element)) return element.textContent;
      const clonedElement = element.cloneNode(true);
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(clonedElement);
      function applyStyles(node) {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const computedStyle = window.getComputedStyle(node);
          const style = node.style;
          for (const element of computedStyle) {
            const property = element;
            style[property] = computedStyle.getPropertyValue(property);
          }
          for (let child of node.children) {
            applyStyles(child);
          }
        }
      }
      applyStyles(clonedElement);
      return tempDiv.innerHTML;
    }

    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      const clonedContent = range.cloneContents();
      const tempDiv = document.createElement("div");
      tempDiv.appendChild(clonedContent);

      const selectedHtml = getStyledHtml(tempDiv);
      return selectedHtml;
    } else {
      return "";
    }
  }
  const [currentTab] = await chrome.tabs.query({
    active: true,
    currentWindow: true,
  });
  const button = document.getElementById("openSidePanel");
  button.addEventListener("click", async () => {
    await chrome.sidePanel.open({ tabId: currentTab.id });
    await chrome.sidePanel.setOptions({
      tabId: currentTab.id,
      path: "sidepanel.html",
      enabled: true,
    });
  });
  function saveQnA(qes, ans) {
    storage.set({ [qes]: ans }).then(() => {
      console.log("Value is set");
    });
  }
  function cb(result) {
    const selectedDivtag = document.getElementById("selected");
    const contentP = document.createElement("p");
    if (result === NO_CONTENT) {
      contentP.innerHTML = result;
      selectedDivtag.appendChild(contentP);
    }
    const takeQnA = document.createElement("input");
    const submitButton = document.createElement("button");
    takeQnA.placeholder = "Enter Title";
    contentP.innerHTML = result;
    submitButton.onclick = () => saveQnA(takeQnA.value, result);
    submitButton.textContent = "Save and Submit";
    selectedDivtag.appendChild(takeQnA);
    selectedDivtag.appendChild(contentP);
    selectedDivtag.appendChild(submitButton);
  }
  chrome.scripting
    .executeScript({
      target: { tabId: currentTab.id },
      function: getSelected,
    })
    .then((injectionResults) => {
      for (const { frameId, result } of injectionResults) {
        console.log(`Frame ${frameId} result:`, result);
        cb(result);
      }
    });
}

run();
