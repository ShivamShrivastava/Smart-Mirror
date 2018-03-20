/* Smart Mirror Test default config for modules
 */

var config = {
	port: 8080,
	ipWhitelist: ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.10.1"],

	language: "en",
	timeFormat: 24,
	units: "metric",
	electronOptions: {
		webPreferences: {
			nodeIntegration: true,
		},
	}

};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}
