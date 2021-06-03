sap.ui.define([
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function (JSONModel, Device) {
	"use strict";

	return {

		createDeviceModel: function () {
			var oModel = new JSONModel(Device);
			oModel.setDefaultBindingMode("OneWay");
			return oModel;
		},

		createMainModel: function () {
			var oMainModel = new JSONModel({
				imageData: "",
				task: "",
				startTime: "",
				endTime: ""

			});
			oMainModel.setSizeLimit(1000);
			return oMainModel;
		}

	};
});