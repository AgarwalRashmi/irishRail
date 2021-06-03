/* global QUnit */
QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
	"use strict";

	sap.ui.require([
		"com/capgemini/coe/irishRail_Worker/test/integration/AllJourneys"
	], function () {
		QUnit.start();
	});
});