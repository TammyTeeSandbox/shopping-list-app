const electron = require("electron");
const url = require("url");
const path = require("path");

const { app, BrowserWindow, Menu, ipcMain } = electron;

//SET ENV
process.env.NODE_ENV = "production";

let mainWindow;
let addWindow;

// Listen for the app to be ready
app.on("ready", () => {
	//Create new window
	mainWindow = new BrowserWindow({
		webPreferences: { nodeIntegration: true }
	});

	//Load html into window
	mainWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "mainWindow.html"),
			protocol: "file:",
			slashes: true
		})
	); // file://dirname/mainWindow.html

	// Quit app when closed
	mainWindow.on("closed", () => {
		app.quit();
	});

	//Build menu from template
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	//Insert menu
	Menu.setApplicationMenu(mainMenu);
});

// Handle Create Add Window
const createAddWindow = () => {
	//Create new window
	addWindow = new BrowserWindow({
		height: 200,
		title: "Add Shopping List Item",
		width: 300,
		webPreferences: { nodeIntegration: true }
	});

	//Load html into window
	addWindow.loadURL(
		url.format({
			pathname: path.join(__dirname, "addWindow.html"),
			protocol: "file:",
			slashes: true
		})
	);

	//Garbage collection
	addWindow.on("close", () => {
		addWindow = null;
	});
};

//Catch item add
ipcMain.on("item:add", (e, item) => {
	//send item to main window
	mainWindow.webContents.send("item:add", item);
	addWindow.close();
});

// Create menu template
const mainMenuTemplate = [
	{
		label: "File",
		submenu: [
			{
				label: "Add Item",
				click() {
					createAddWindow();
				}
			},
			{
				label: "Clear Items",
				click() {
					mainWindow.webContents.send("item:clear");
				}
			},
			{
				label: "Quit",
				accelerator: process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
				click() {
					app.quit();
				}
			}
		]
	}
];

// This does not work, throws an error

// If Mac, add emplty obj to menu
// if (process.platform == "darwin") {
// 	mainMenuTemplate.unshift({}); // adds to beginning of array
// }

// Add dev tools item if not in production
if (process.env.NODE_ENV !== "production") {
	mainMenuTemplate.push({
		label: "Developer Tools",
		submenu: [
			{
				label: "Toggle DevTools",
				accelerator: process.platform == "darwin" ? "Command+I" : "Ctrl+I",
				click(item, focusedWindow) {
					focusedWindow.toggleDevTools();
				}
			},
			{
				role: "reload"
			}
		]
	});
}
