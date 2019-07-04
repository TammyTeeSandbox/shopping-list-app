const electron = require("electron");
const { ipcRenderer } = electron;
const ul = document.querySelector("ul");

ipcRenderer
	.on("item:add", (e, item) => {
		const li = document.createElement("li");
		const itemText = document.createTextNode(item);

		ul.className = "collection";
		li.className = "collection-item";
		li.appendChild(itemText);
		ul.appendChild(li);
	})
	.on("item:clear", () => {
		ul.innerHTML = "";
		ul.className = "";
	});

//Remove item when double clicked
const removeItem = e => {
	e.target.remove();

	if (ul.children.length === 0) {
		ul.className = "";
	}
};

ul.addEventListener("dblclick", removeItem);
