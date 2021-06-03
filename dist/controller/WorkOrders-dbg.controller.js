sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function (Controller) {
	"use strict";

	return Controller.extend("com.capgemini.coe.irishRail_Worker.controller.WorkOrders", {

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

			oModelDetail.setProperty("/task", task);
			oModelDetail.setProperty("/startTime", startTime);
			oModelDetail.setProperty("/endTime", endTime);

			this.oRouter.navTo("RouteWorkOrderWizard", {
				workorderNumber: workorderNo
			});
		}

	});

});