sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"../model/formatter"
], function (Controller, formatter) {
	"use strict";

	return Controller.extend("com.capgemini.coe.irishRail_Worker.controller.WorkOrders", {
		formatter: formatter,
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
		},

		onBackPress: function (oEvent) {
			this.oRouter.navTo("RouteDashboard");
		},
		onWorkOrderPress: function (oEvent) {
			var oModelDetail = this.getOwnerComponent().getModel("mainModel");
			var oWorkOrderDetails = oEvent.getSource().getBindingContext("WorkOrderModel").getObject();
			var task = oWorkOrderDetails.task;
			var startTime = oWorkOrderDetails.startTime;
			var endTime = oWorkOrderDetails.endTime;
			var workorderNo = oWorkOrderDetails.workorder;
			var username = oWorkOrderDetails.username;

			oModelDetail.setProperty("/task", task);
			oModelDetail.setProperty("/startTime", startTime);
			oModelDetail.setProperty("/endTime", endTime);
			oModelDetail.setProperty("/username", username);

			this.oRouter.navTo("RouteWorkOrderWizard", {
				workorderNumber: workorderNo
			});
		}

	});

});