const select = document.getElementById("category-select");
const newCatInput = document.getElementById("new-category");
const saveBtn = document.getElementById("save-btn");
const linkGroups = document.getElementById("link-groups");
const copyBtn = document.getElementById("copy-all");
const clearBtn = document.getElementById("clear-all");

function loadCategoriesAndLinks() {
  select.innerHTML = `<option value="Uncategorized">Uncategorized</option>`;
  linkGroups.innerHTML = "";

  chrome.storage.local.get({ savedLinksByCategory: {} }, (data) => {
    const categories = Object.keys(data.savedLinksByCategory);

    categories.forEach(cat => {
      // Add to dropdown
      if (cat !== "Uncategorized") {
        const opt = document.createElement("option");
        opt.value = cat;
        opt.textContent = cat;
        select.appendChild(opt);
      }

      // Create category section
      const title = document.createElement("div");
      title.className = "category";
      title.textContent = cat;

      const list = document.createElement("ul");
      data.savedLinksByCategory[cat].forEach(url => {
        const li = document.createElement("li");
        const a = document.createElement("a");
        a.href = url;
        a.textContent = url;
        a.target = "_blank";
        li.appendChild(a);
        list.appendChild(li);
      });

      linkGroups.appendChild(title);
      linkGroups.appendChild(list);
    });
  });
}

// Save current tab URL
saveBtn.addEventListener("click", () => {
  const selectedCat = newCatInput.value.trim() || select.value || "Uncategorized";

  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    const url = tabs[0].url;
    chrome.storage.local.get({ savedLinksByCategory: {} }, (data) => {
      const links = data.savedLinksByCategory[selectedCat] || [];
      if (!links.includes(url)) {
        links.push(url);
        data.savedLinksByCategory[selectedCat] = links;
        chrome.storage.local.set({ savedLinksByCategory: data.savedLinksByCategory }, loadCategoriesAndLinks);
      } else {
        alert("This URL is already saved in this category.");
      }
    });
  });
});

// Copy all links (with categories)
copyBtn.addEventListener("click", () => {
  chrome.storage.local.get({ savedLinksByCategory: {} }, (data) => {
    let text = '';
    for (const [cat, links] of Object.entries(data.savedLinksByCategory)) {
      text += `# ${cat}\n${links.join("\n")}\n\n`;
    }
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied all links to clipboard!");
    });
  });
});

// Clear all
clearBtn.addEventListener("click", () => {
  if (confirm("Clear ALL saved links?")) {
    chrome.storage.local.set({ savedLinksByCategory: {} }, loadCategoriesAndLinks);
  }
});

// Initial load
loadCategoriesAndLinks();
