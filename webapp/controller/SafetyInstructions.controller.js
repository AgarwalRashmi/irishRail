sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.capgemini.coe.irishRail_Worker.controller.SafetyInstructions", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		},
		
		onBackPress: function (oEvent) {
			this.oRouter.navTo("RouteDashboard");
		}

	});

});