/* jshint esversion: 6 */

"use strict";

const electron = require("electron");
const core = require(__dirname + "/app.js");

// Config
var config = {};
// Module to control application life.
const app = electron.app;
// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow;

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {

	var electronOptionsDefaults = {
		width: 800,
		height: 600,
		x: 0,
		y: 0,
		darkTheme: true,
		webPreferences: {
			nodeIntegration: false,
			zoomFactor: config.zoom
		},
		backgroundColor: "#000000"
	};

	// DEPRECATED: "kioskmode" backwards compatibility, to be removed
	// settings these options directly instead provides cleaner interface
	if (config.kioskmode) {
		electronOptionsDefaults.kiosk = true;
	} else {
		electronOptionsDefaults.fullscreen = true;
		electronOptionsDefaults.autoHideMenuBar = true;
	}

	var electronOptions = Object.assign({}, electronOptionsDefaults, config.electronOptions);

	// Create the browser window.
	mainWindow = new BrowserWindow(electronOptions);

	// and load the index.html of the app.
	//mainWindow.loadURL('file://' + __dirname + '../../index.html');
	mainWindow.loadURL("http://localhost:" + config.port);

	// Open the DevTools if run with "npm start dev"
	if (process.argv.includes("dev")) {
		mainWindow.webContents.openDevTools();
	}

	// Set responders for window events.
	mainWindow.on("closed", function() {
		mainWindow = null;
	});

	if (config.kioskmode) {
		mainWindow.on("blur", function() {
			mainWindow.focus();
		});

		mainWindow.on("leave-full-screen", function() {
			mainWindow.setFullScreen(true);
		});

		mainWindow.on("resize", function() {
			setTimeout(function() {
				mainWindow.reload();
			}, 1000);
		});
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on("ready", function() {
	console.log("Launching application.");
	createWindow();
});

// Quit when all windows are closed.
app.on("window-all-closed", function() {
	createWindow();
});

app.on("activate", function() {
	// On OS X it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	if (mainWindow === null) {
		createWindow();
	}
});

// Start the core application.
// This starts all node helpers and starts the webserver.
core.start(function(c) {
	config = c;
/* global config, vendor, MM, Log, Module */
/* Smart Mirror
 * Module and File loaders.
 *
 * By Michael Teeuw http://michaelteeuw.nl
 * MIT Licensed.
 */

var Loader = (function() {

	/* Create helper valiables */

	var loadedModuleFiles = [];
	var loadedFiles = [];
	var moduleObjects = [];

	/* Private Methods */

	/* loadModules()
	 * Loops thru all modules and requests load for every module.
	 */
	var loadModules = function() {

		var moduleData = getModuleData();

		var loadNextModule = function() {
			if (moduleData.length > 0) {
				var nextModule = moduleData[0];
				loadModule(nextModule, function() {
					moduleData = moduleData.slice(1);
					loadNextModule();
				});
			} else {
				// All modules loaded. Load custom.css
				// This is done after all the modules so we can
				// overwrite all the defined styles.

				loadFile(config.customCss, function() {
					// custom.css loaded. Start all modules.
					startModules();
				});

			}
		};

		loadNextModule();
	};

	/* startModules()
	 * Loops thru all modules and requests start for every module.
	 */
	var startModules = function() {
		for (var m in moduleObjects) {
			var module = moduleObjects[m];
			module.start();
		}

		// Notifiy core of loded modules.
		MM.modulesStarted(moduleObjects);
	};

	/* getAllModules()
	 * Retrieve list of all modules.
	 *
	 * return array - module data as configured in config
	 */
	var getAllModules = function() {
		return config.modules;
	};

	/* getModuleData()
	 * Generate array with module information including module paths.
	 *
	 * return array - Module information.
	 */
	var getModuleData = function() {
		var modules = getAllModules();
		var moduleFiles = [];

		for (var m in modules) {
			var moduleData = modules[m];
			var module = moduleData.module;

			var elements = module.split("/");
			var moduleName = elements[elements.length - 1];
			var moduleFolder =  config.paths.modules + "/" + module;

			if (defaultModules.indexOf(moduleName) !== -1) {
				moduleFolder =  config.paths.modules + "/default/" + module;
			}

			if (moduleData.disabled === true) {
				continue;
			}

			moduleFiles.push({
				index: m,
				identifier: "module_" + m + "_" + module,
				name: moduleName,
				path: moduleFolder + "/" ,
				file: moduleName + ".js",
				position: moduleData.position,
				header: moduleData.header,
				config: moduleData.config,
				classes: (typeof moduleData.classes !== "undefined") ? moduleData.classes + " " + module : module
			});

		}

		return moduleFiles;
	};

	/* loadModule(module)
	 * Load modules via ajax request and create module objects.
	 *
	 * argument callback function - Function called when done.
	 * argument module object - Information about the module we want to load.
	 */
	var loadModule = function(module, callback) {
		var url = module.path + "/" + module.file;

		var afterLoad = function() {
			var moduleObject = Module.create(module.name);
			if (moduleObject) {
				bootstrapModule(module, moduleObject, function() {
					callback();
				});
			} else {
				callback();
			}
		};

		if (loadedModuleFiles.indexOf(url) !== -1) {
			afterLoad();
		} else {
			loadFile(url, function() {
				loadedModuleFiles.push(url);
				afterLoad();
			});
		}

	};

	/* bootstrapModule(module, mObj)
	 * Bootstrap modules by setting the module data and loading the scripts & styles.
	 *
	 * argument module object - Information about the module we want to load.
	 * argument mObj object - Modules instance.
	 * argument callback function - Function called when done.
	 */
	var bootstrapModule = function(module, mObj, callback) {
		Log.info("Bootstrapping module: " + module.name);

		mObj.setData(module);

		mObj.loadScripts(function() {
			Log.log("Scripts loaded for: " + module.name);
			mObj.loadStyles(function() {
				Log.log("Styles loaded for: " + module.name);
				mObj.loadTranslations(function() {
					Log.log("Translations loaded for: " + module.name);
					moduleObjects.push(mObj);
					callback();
				});
			});
		});

	};

	/* loadFile(fileName)
	 * Load a script or stylesheet by adding it to the dom.
	 *
	 * argument fileName string - Path of the file we want to load.
	 * argument callback function - Function called when done.
	 */
	var loadFile = function(fileName, callback) {

		var extension =  fileName.slice((Math.max(0, fileName.lastIndexOf(".")) || Infinity) + 1);

		switch (extension.toLowerCase()) {
		case "js":
			Log.log("Load script: " + fileName);
			var script = document.createElement("script");
			script.type = "text/javascript";
			script.src = fileName;
			script.onload = function() {
				if (typeof callback === "function") {callback();}
			};
			script.onerror = function() {
				console.error("Error on loading script:", fileName);
				if (typeof callback === "function") {callback();}
			};

			document.getElementsByTagName("body")[0].appendChild(script);
			break;
		case "css":
			Log.log("Load stylesheet: " + fileName);
			var stylesheet = document.createElement("link");
			stylesheet.rel = "stylesheet";
			stylesheet.type = "text/css";
			stylesheet.href = fileName;
			stylesheet.onload = function() {
				if (typeof callback === "function") {callback();}
			};
			stylesheet.onerror = function() {
				console.error("Error on loading stylesheet:", fileName);
				if (typeof callback === "function") {callback();}
			};

			document.getElementsByTagName("head")[0].appendChild(stylesheet);
			break;
		}

	};

	/* Public Methods */
	return {

		/* loadModules()
		 * Load all modules as defined in the config.
		 */
		loadModules: function() {
			loadModules();
		},

		/* loadFile()
		 * Load a file (script or stylesheet).
		 * Prevent double loading and search for files in the vendor folder.
		 *
		 * argument fileName string - Path of the file we want to load.
		 * argument module Module Object - the module that calls the loadFile function.
		 * argument callback function - Function called when done.
		 */
		loadFile: function(fileName, module, callback) {

			if (loadedFiles.indexOf(fileName.toLowerCase()) !== -1) {
				Log.log("File already loaded: " + fileName);
				callback();
				return;
			}

			if (fileName.indexOf("http://") === 0 || fileName.indexOf("https://") === 0 || fileName.indexOf("/") !== -1) {
				// This is an absolute or relative path.
				// Load it and then return.
				loadedFiles.push(fileName.toLowerCase());
				loadFile(fileName, callback);
				return;
			}

			if (vendor[fileName] !== undefined) {
				// This file is available in the vendor folder.
				// Load it from this vendor folder.
				loadedFiles.push(fileName.toLowerCase());
				loadFile(config.paths.vendor + "/" + vendor[fileName], callback);
				return;
			}

			// File not loaded yet.
			// Load it based on the module path.
			loadedFiles.push(fileName.toLowerCase());
			loadFile(module.file(fileName), callback);
		}
	};

})();
