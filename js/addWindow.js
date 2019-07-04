const electron = require("electron");
const { ipcRenderer } = electron;

const form = document.querySelector("form");
const submitForm = e => {
	e.preventDefault();
	const item = document.querySelector("#item").value;

	ipcRenderer.send("item:add", item); //works similar to socket.io
};

form.addEventListener("submit", submitForm);
