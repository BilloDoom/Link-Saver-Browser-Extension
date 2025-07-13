function getNested(data, path, create = false) {
    const parts = path.split("/").filter(Boolean);
    let node = data;
    for (const part of parts) {
        if (!node.children) node.children = [];
        let child = node.children.find(c => c.name === part);
        if (!child && create) {
            child = { name: part, links: [], children: [] };
            node.children.push(child);
        }
        if (!child) return null;
        node = child;
    }
    return node;
}

function renderLinks(node, depth = 0) {
    const container = document.createElement("div");
    container.style.marginLeft = `${depth * 15}px`;

    if (node.name) {
        const title = document.createElement("div");
        title.className = "category";
        title.textContent = node.name;
        container.appendChild(title);
    }

    if (node.links?.length) {
        const list = document.createElement("ul");
        node.links.forEach(url => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = url;
            a.textContent = url;
            a.target = "_blank";
            li.appendChild(a);
            list.appendChild(li);
        });
        container.appendChild(list);
    }

    node.children?.forEach(child => {
        container.appendChild(renderLinks(child, depth + 1));
    });

    return container;
}

function loadCategoriesAndLinks(containerId = "link-groups") {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = "";
    chrome.storage.local.get({ linkTree: { name: "root", children: [], links: [] } }, data => {
        const tree = data.linkTree;
        container.appendChild(renderLinks(tree));
    });
}
