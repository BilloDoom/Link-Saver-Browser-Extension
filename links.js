const treeContainer = document.getElementById("link-tree");
const clearBtn = document.getElementById("clear-all");

function renderTree(node) {
  const ul = document.createElement("ul");

  if (node.links && node.links.length) {
    node.links.forEach(url => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = url;
      a.textContent = url;
      a.target = "_blank";
      li.appendChild(a);
      ul.appendChild(li);
    });
  }

  if (node.children && node.children.length) {
    node.children.forEach(child => {
      const li = document.createElement("li");
      const label = document.createElement("div");
      label.textContent = child.name;
      label.className = "category";

      li.appendChild(label);
      li.appendChild(renderTree(child));
      ul.appendChild(li);
    });
  }

  return ul;
}

function loadTree() {
  treeContainer.innerHTML = "";
  chrome.storage.local.get({ linkTree: { name: "root", children: [], links: [] } }, data => {
    const root = data.linkTree;
    const tree = renderTree(root);
    treeContainer.appendChild(tree);
  });
}

clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to remove all saved links?")) {
    chrome.storage.local.set({ linkTree: { name: "root", children: [], links: [] } }, loadTree);
  }
});

loadTree();
