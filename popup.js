const saveBtn = document.getElementById("save-btn");
const copyBtn = document.getElementById("copy-to-clipboard");
const pathInput = document.getElementById("category-path");
const pathPreview = document.getElementById("path-preview");

const CATEGORY_REGEX = /^[a-zA-Z0-9\/]+$/;

document.getElementById("open-page").addEventListener("click", () => {
    chrome.tabs.create({ url: chrome.runtime.getURL("links.html") });
});

saveBtn.addEventListener("click", () => {
    const rawPath = pathInput.value.trim();
    if (!rawPath || !CATEGORY_REGEX.test(rawPath)) {
        alert("Invalid category path. Use letters, numbers, and '/' only.");
        return;
    }

    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        const url = tabs[0].url;
        chrome.storage.local.get({ linkTree: { name: "root", children: [], links: [] } }, data => {
            const tree = data.linkTree;
            const node = getNested(tree, rawPath, true);
            if (!node.links.includes(url)) {
                node.links.push(url);
                chrome.storage.local.set({ linkTree: tree }, () => {
                    loadCategoriesAndLinks("link-groups");
                });
            } else {
                alert("This URL is already saved in this category.");
            }
        });
    });
});

copyBtn.addEventListener("click", () => {
    chrome.storage.local.get({ linkTree: { name: "root", children: [], links: [] } }, data => {
        let text = "";

        function traverse(node, path) {
            if (node.links.length) {
                text += `# ${path}\n${node.links.join("\n")}\n\n`;
            }
            node.children.forEach(child => traverse(child, `${path}/${child.name}`));
        }

        traverse(data.linkTree, "");
        navigator.clipboard.writeText(text);
    });
});

pathInput.addEventListener("input", () => {
    const raw = pathInput.value.trim();
    const isValid = CATEGORY_REGEX.test(raw);

    pathPreview.className = isValid ? "path-valid" : "path-invalid";
    pathPreview.innerHTML = raw.replace(/\//g, '<span style="color: orange;">/</span>');
});

loadCategoriesAndLinks("link-groups");
