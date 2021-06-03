sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function (Controller, JSONModel, MessageBox) {
	"use strict";

	return Controller.extend("com.capgemini.coe.irishRail_Worker.controller.PasswordLogin", {

		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			var ologinModel = new JSONModel({
				username: "",
				password: ""
			});
			this.getView().setModel(ologinModel, "ologinModel");
		},
		onBackPress: function (oEvent) {
			this.oRouter.navTo("RouteLandingPage");
		},

		onLoginPress: function (oEvent) {
			debugger;
			var ologinModel = this.getView().getModel("ologinModel");
			var usr = ologinModel.getProperty("/username");
			var pwd = ologinModel.getProperty("/password");
			if (usr == "rashmi" && pwd == "rashmi") {
				this.oRouter.navTo("RouteDashboard");
			} else {
				MessageBox.error("Incorrect username or password");
				ologinModel.setProperty("/password", "");
			}

		}

	});

});