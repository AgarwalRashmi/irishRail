sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator'
], function (Controller, JSONModel, MessageBox, Filter, FilterOperator) {
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
			var ologinModel = this.getView().getModel("ologinModel");
			var usr = ologinModel.getProperty("/username");
			// var pwd = ologinModel.getProperty("/password");
			var a = this.getOwnerComponent().getModel("WorkOrderModel");
			a.read("/WORKORDERS", {
				filters: [new Filter({
					path: "username",
					operator: FilterOperator.EQ,
					value1: usr
				})],
				success: function (oData, oResponse) {
					if (oData.results.length > 0)
						this.oRouter.navTo("RouteDashboard");
					else {
						MessageBox.error("Incorrect username or password");
						ologinModel.setProperty("/password", "");
					}

				}.bind(this),
				error: function (error) {

				}.bind(this)
			});

		}

	});

});