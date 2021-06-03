sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"sap/m/BusyDialog"
], function (Controller, MessageBox, BusyDialog) {
	"use strict";

	return Controller.extend("com.capgemini.coe.irishRail_Worker.controller.LandingPage", {
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oBusyIndicator = new BusyDialog();
		},

		onPasswordLoginPress: function (oEvent) {
			this.oRouter.navTo("RoutePasswordLogin");
		},

		onCameraPress: function (oEvent) {
			if (sap.ui.Device.system.desktop === true) {
				this._oPopover = null;
				if (!this._oPopover) {
					this._oPopover = sap.ui.xmlfragment("com.capgemini.coe.irishRail_Worker.view.camera", this);
					this.getView().addDependent(this._oPopover);
				}
				this._oPopover.openBy(oEvent.getSource());
			} else if (sap.ui.Device.system.phone === true) {
				//for Mobile Testing
				var oNav = navigator.camera;

				oNav.getPicture(this.onSuccess.bind(this), this.onError.bind(this), {
					quality: 75,
					cameraDirection: 1,
					targetWidth: 300,
					targetHeight: 300,
					destinationType: oNav.DestinationType.FILE_URI

				});
			}

		},

		onDesktopSnapshot: function (oEvent) {
			this.oBusyIndicator.open();
			this.oBusyIndicator.setText("Validating authentication");

			this.callMLService(oEvent.getParameter("image"));
		},

		onSuccess: function (imageData) {
			this.oBusyIndicator.open();
			this.oBusyIndicator.setText("Validating authentication");
			var that = this;
			if (sap.ui.Device.system.desktop === true) { //for desktop Testing
				this.callMLService(imageData);
			} else if (sap.ui.Device.system.phone === true) { //for Mobile Testing
				this.getImageData(imageData, function (dataUrl) {
					that.callMLService(dataUrl);
				});
			}
		},

		onError: function (message) {
			MessageBox.error("Oops! Unable to access camera");
		},

		getImageData: function (url, callback) {
			var xhr = new XMLHttpRequest();
			xhr.onload = function () {
				var reader = new FileReader();
				reader.onloadend = function () {
					callback(reader.result);
				};
				reader.readAsDataURL(xhr.response);
			};
			xhr.open('GET', url);
			xhr.responseType = 'blob';
			xhr.send();
		},

		callMLService: function (imageData) {
			var that = this;
			var block = imageData.split(";");
			// Get the content type of the image
			var contentType = block[0].split(":")[1]; // In this case "image/gif"
			// get the real base64 content of the file
			var realData = block[1].split(",")[1]; // In this case "R0lGODlhPQBEAPeoAJosM...."
			var blob = this.b64toBlob(realData, contentType);
			// var blob = this.convertFile64toBlob(imageData);
			var form = new FormData();
			form.append("file", blob);

			var settings = {
				async: true,
				crossDomain: true,
				"url": "/faceRecognitionDestination/upload",
				"method": "POST",
				"processData": false,
				"contentType": false,
				"mimeType": "multipart/form-data",
				"data": form
			};

			var promise = new Promise(function (resolve, reject) {
				$.ajax(settings).success(function (response) {

					// alert(JSON.stringify(JSON.parse(response).name));
					this.oBusyIndicator.close();
					///this.oRouter.navTo("RouteDashboard");
				}.bind(that)).error(function (response) {

					//this.oRouter.navTo("RouteDashboard");
					MessageBox.error("Oops! Can't recognize the image. Try again.");
					this.oBusyIndicator.close();
				}.bind(that));
			});

		},

		b64toBlob: function (b64Data, contentType, sliceSize) {
			contentType = contentType || '';
			sliceSize = sliceSize || 512;

			var byteCharacters = atob(b64Data);
			var byteArrays = [];

			for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
				var slice = byteCharacters.slice(offset, offset + sliceSize);

				var byteNumbers = new Array(slice.length);
				for (var i = 0; i < slice.length; i++) {
					byteNumbers[i] = slice.charCodeAt(i);
				}

				var byteArray = new Uint8Array(byteNumbers);

				byteArrays.push(byteArray);
			}

			var blob = new Blob(byteArrays, {
				type: contentType
			});
			return blob;
		},

		onBrowsePress: function () {
			var oNav = navigator.camera;
			oNav.getPicture(this.onSuccess.bind(this), this.onError.bind(this), {
				quality: 50,
				targetWidth: 300,
				targetHeight: 300,
				destinationType: oNav.DestinationType.FILE_URI,
				sourceType: oNav.PictureSourceType.PHOTOLIBRARY
			});
		}
	});
});