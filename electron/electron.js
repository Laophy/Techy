const { app, BrowserWindow, dialog } = require("electron");
const electron = require("electron");
const { ipcMain } = require("electron");
const path = require("path");
const fs = require("fs");
const { shell } = require("electron");

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    title: "Techy",
    width: 1920,
    height: 1080,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  //load the index.html from a url
  win.loadURL("http://localhost:3000");

  // Open the DevTools.
  win.webContents.openDevTools();

  //either use the removeMenu() function
  win.removeMenu();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.

  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

ipcMain.on("SAVE_FILE", (event, data) => {
  fs.writeFile(data.path, data.file, (err) => {
    if (!err) {
      console.log("Saved File: " + data.path);
    } else {
      console.log(err);
    }
  });
});

ipcMain.on("showMessage", (event) => {
  const options = {
    type: "warning",
    buttons: ["Cancel", "Yes, please", "No, thanks"],
    defaultId: 2,
    title: "Help",
    message: "Visit the links below for more informations.",
    detail: "Techy help center:",
    checkboxLabel: "Show next time?",
    checkboxChecked: true,
  };

  dialog.showMessageBox(null, options, (response, checkboxChecked) => {
    console.log(response);
    console.log(checkboxChecked);
  });
});

ipcMain.on("GET_FILE", (event, data) => {
  const file = dialog.showOpenDialogSync({
    properties: ["openFile"],
  });
  if (file) {
    const content = fs.readFileSync(file[0]); // returns a buffer
    const fileContent = content.toString();

    //Final string to return to client?
    console.log("Loading File: " + file);

    event.sender.send("GET_FILE", { data: fileContent, path: file });
  }
});

ipcMain.on("RUN_FILE", (event, file) => {
  // To open file in write and read mode,
  // create file if doesn't exists.
  if (file) {
    fs.open(file, "r", function (err, f) {
      if (err) {
        return console.error(err);
      }
      //console.log(f);
      shell.openPath(file);
      console.log("File Opened: " + file);
    });
  }
});
// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
