sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox",
	"sap/m/MessageToast"
], function (Controller, JSONModel, MessageBox, MessageToast) {
	"use strict";

	return Controller.extend("com.capgemini.coe.irishRail_Worker.controller.WorkOrderWizard", {

		onInit: function () {
			this.WorkOrderModel = this.getOwnerComponent().getModel("WorkOrderModel");
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.getRoute("RouteWorkOrderWizard").attachPatternMatched(this._onObjectMatched, this);
			var oCurrentWeather = new JSONModel({
				tempCelsius: "",
				weatherDesc: "",
				weatherIcon: "",
				weatherFeelsCelsius: "",
				weatherHumidity: ""
			});
			this.getView().setModel(oCurrentWeather, "oCurrentWeather");

			//get plus 15minutes to current time
			var min30 = 30 * 60 * 1000; // 30 minutes in milliseconds
			var momentOfTime = new Date(); // just for example, can be any other time
			var myTimeSpan = 15 * 60 * 1000; // 15 minutes in milliseconds
			momentOfTime.setTime(momentOfTime.getTime() + myTimeSpan);
			var timeplus15 = momentOfTime.getHours() + ":" + momentOfTime.getMinutes();

			momentOfTime.setTime(momentOfTime.getTime() + min30);
			var timeplus2 = momentOfTime.getHours() + ":" + momentOfTime.getMinutes();

			momentOfTime.setTime(momentOfTime.getTime() + min30);
			var timeplus3 = momentOfTime.getHours() + ":" + momentOfTime.getMinutes();

			momentOfTime.setTime(momentOfTime.getTime() + min30);
			var timeplus4 = momentOfTime.getHours() + ":" + momentOfTime.getMinutes();

			var oCurrentTime = new JSONModel({
				currentTimeplus15: timeplus15,
				currentTimeplus2: timeplus2,
				currentTimeplus3: timeplus3,
				currentTimeplus4: timeplus4

			});
			this.getView().setModel(oCurrentTime, "oCurrentTime");

			momentOfTime = new Date();
			myTimeSpan = 10 * 60 * 1000; // 10 minutes in milliseconds
			momentOfTime.setTime(momentOfTime.getTime() + myTimeSpan);
			this.timeplus10 = momentOfTime.getHours() + ":" + momentOfTime.getMinutes();

			var x = setInterval(function () {
				// debugger;

				var currentTi = new Date();
				currentTi = currentTi.getHours() + ":" + currentTi.getMinutes();

				// If the count down is finished, write some text
				if (this.timeplus10 == currentTi) {
					// debugger;
					clearInterval(x);

					//Open Alert fragment
					if (!this._oPopover2) {
						this._oPopover2 = sap.ui.xmlfragment("com.capgemini.coe.irishRail_Worker.view.trainApproachingAlert", this);
						this.getView().addDependent(this._oPopover2);
					}
					this._oPopover2.open();

					//If expired call Alert Audio
					this.trainSiren = new Audio();
					this.trainSiren.src = "https://actions.google.com/sounds/v1/emergency/emergency_siren_close_long.ogg";
					this.trainSiren.play();

				}
			}.bind(this), 1000);

		},

		onStopTrainAlarm: function (oEvent) {
			this.trainSiren.pause();
			this.trainSiren.currentTime = 0;
			this._oPopover2.close();

		},

		onhandleWizardCancel: function (oEvent) {
			this.oRouter.navTo("RouteWorkOrders");
		},

		_onObjectMatched: function (oEvent) {

			this.workorderNo = oEvent.getParameter("arguments").workorderNumber;

			// var oModel = this.getView().getModel("WorkOrderModel");
			this.WorkOrderModel.read("/WORKORDERS_DESC('" + this.workorderNo + "')", {
				success: function (oData, oResponse) {
					this.getWeather(oData.city);

				}.bind(this),
				error: function (error) {

					sap.m.MessageBox.error(error.message);
				}.bind(this)
			});

			this.WorkOrderModel.metadataLoaded().then(function () {
				var sObjectPath = this.WorkOrderModel.createKey("WORKORDERS_DESC", {
					workorder: this.workorderNo
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));

			var oWorkorderReport = new JSONModel({
				workorder: this.workorderNo,
				username: this.getView().getModel("mainModel").getData().username,
				comments: "",
				reason: ""

			});
			this.getView().setModel(oWorkorderReport, "oWorkorderReport");
		},

		_bindView: function (sObjectPath) {
			this.getView().bindElement({
				path: sObjectPath,
				model: "WorkOrderModel"
			});

		},

		onPPECameraPress: function (oEvent) {
			var oNav = navigator.camera;

			oNav.getPicture(this.onSuccess.bind(this), this.onError.bind(this), {
				quality: 75,
				cameraDirection: 1,
				targetWidth: 300,
				targetHeight: 300,
				destinationType: oNav.DestinationType.FILE_URI

			});

		},

		onPPEBrowsePress: function () {
			var oNav = navigator.camera;
			oNav.getPicture(this.onSuccess.bind(this), this.onError.bind(this), {
				quality: 75,
				targetWidth: 300,
				targetHeight: 300,
				destinationType: oNav.DestinationType.FILE_URI,
				sourceType: oNav.PictureSourceType.PHOTOLIBRARY
			});
		},

		onSuccess: function (imageData) {
			this.oBusyIndicator.open();
			this.oBusyIndicator.setText("Validating PPE Check");
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
				"url": "/PPE/upload",
				"method": "POST",
				"processData": false,
				"contentType": false,
				"mimeType": "multipart/form-data",
				"data": form
			};

			var promise = new Promise(function (resolve, reject) {
				$.ajax(settings).success(function (response) {
					this.oBusyIndicator.close();
					this.oRouter.navTo("RouteDashboard");
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

		getWeather: function (city) {
			var that = this;
			// var newURl = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=pune&appid=37acaec3ca9c320da39ba70030a0d150";
			var url = "/CurrentWeather/data/2.5/weather?q=" + city + "&appid=37acaec3ca9c320da39ba70030a0d150";
			var settings = {
				"async": true,
				"crossDomain": true,
				"url": url,
				"method": "GET"

			};

			var promise = new Promise(function (resolve, reject) {
				$.ajax(settings).success(function (response) {
					var tempKelvin = response.main.temp;
					var tempCelsius = Math.round(tempKelvin - 273.15);
					tempCelsius = tempCelsius + "°C";
					var weatherDesc = response.weather[0].description;
					var weatherFeelsKelvin = response.main.feels_like;
					var weatherFeelsCelsius = Math.round(tempKelvin - 273.15);
					weatherFeelsCelsius = "Feels like " + weatherFeelsCelsius + "°C";
					var weatherHumidity = response.main.humidity;
					weatherHumidity = weatherHumidity + "%";
					var weatherIcon = response.weather[0].icon;
					weatherIcon = "http://openweathermap.org/img/w/" + weatherIcon + ".png";

					var oCurrentWeather = this.getView().getModel("oCurrentWeather");

					oCurrentWeather.setProperty("/tempCelsius", tempCelsius);
					oCurrentWeather.setProperty("/weatherDesc", weatherDesc);
					oCurrentWeather.setProperty("/weatherIcon", weatherIcon);
					oCurrentWeather.setProperty("/weatherFeelsCelsius", weatherFeelsCelsius);
					oCurrentWeather.setProperty("/weatherHumidity", weatherHumidity);

				}.bind(that)).error(function (response) {

				}.bind(that));
			});
		},

		ontimePicker: function (oEvent) {
			this.timePicker = oEvent.getSource().getValue();
		},

		onStartTimer: function (oEvent) {
			// var presentHour = new Date().getHours();
			// var presentmins = new Date().getMinutes();

			var that = this;
			var x = setInterval(function () {

				this.getView().byId("countdownTimerid").setVisible(false);
				this.getView().byId("countdownHour").setVisible(true);
				this.getView().byId("countdownMin").setVisible(true);
				this.getView().byId("countdownSec").setVisible(true);

				var splitTime = this.timePicker.split(":");
				var today = new Date();
				var timePickerNow = new Date(today.getFullYear(), today.getMonth(), today.getDate(), splitTime[0], splitTime[1],
					splitTime[2]);
				var diffMs = (timePickerNow - today); // milliseconds between now & Christmas
				var diffDays = Math.floor(diffMs / 86400000); // days
				var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
				var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
				var diffSecs = Math.floor((diffMs % (1000 * 60)) / 1000); //seconds

				// this.getView().byId("countdownTimerid").setText(diffHrs + ":" + diffMins + ":" + diffSecs);
				this.getView().byId("countdownHour").setText(diffHrs);
				this.getView().byId("countdownMin").setText(diffMins);
				this.getView().byId("countdownSec").setText(diffSecs);
				// document.getElementById("demo").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

				// If the count down is finished, write some text
				if (diffMs < 0) {
					clearInterval(x);
					this.getView().byId("countdownTimerid").setVisible(true);
					this.getView().byId("countdownTimerid").setText("EXPIRED");
					this.getView().byId("countdownHour").setVisible(false);
					this.getView().byId("countdownMin").setVisible(false);
					this.getView().byId("countdownSec").setVisible(false);

					//Open Alert fragment
					if (!this._oPopover1) {
						this._oPopover1 = sap.ui.xmlfragment("com.capgemini.coe.irishRail_Worker.view.alert", this);
						this.getView().addDependent(this._oPopover1);
					}
					this._oPopover1.open();

					//If expired call Alert Audio
					this.siren = new Audio();
					this.siren.src = "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg";
					this.siren.play();

				}
			}.bind(this), 1000);
		},

		onStopAlarm: function (oEvent) {
			this.siren.pause();
			this.siren.currentTime = 0;
			this._oPopover1.close();

		},

		onAttachImagePress: function (oEvent) {
			var fileName = oEvent.getSource().getProperty("value");
			this.getView().byId("imageNameDetail").setText(fileName);
			MessageBox.success("Job completion picture is successfully attached.");
			// var oNav = navigator.camera;
			// oNav.getPicture(this.onSuccessImage.bind(this), this.onErrorImage.bind(this), {
			// 	quality: 50,
			// 	targetWidth: 300,
			// 	targetHeight: 300,
			// 	destinationType: oNav.DestinationType.FILE_URI,
			// 	sourceType: oNav.PictureSourceType.PHOTOLIBRARY
			// });
		},

		onRadioButtonSelected: function (oEvent) {
			var selectedRadioButton = oEvent.getSource().getText();
			if (selectedRadioButton == "Other") {
				this.getView().byId("otherRBid").setVisible(true);
				this.getView().getModel("oWorkorderReport").setProperty("/reason", "");

			} else {
				this.getView().byId("otherRBid").setVisible(false);
				this.getView().getModel("oWorkorderReport").setProperty("/reason", selectedRadioButton);

			}
		},

		onSOSUpdatePress: function (oEvent) {
			MessageBox.confirm("Do you want to raise a SOS request?", {
				actions: [MessageBox.Action.YES, MessageBox.Action.NO],
				title: "Raise SOS?",
				icon: MessageBox.Icon.INFORMATION,
				onClose: function (oAction) {
					if (oAction === MessageBox.Action.YES) {

						this.WorkOrderModel.read("/WORKORDERS('" + this.workorderNo + "')", {
							success: function (oData, oResponse) {
								delete oData.__metadata;
								oData.status = "SOS";
								this.updateSOS(oData);

							}.bind(this),
							error: function (error) {

								sap.m.MessageBox.error(error.message);
							}.bind(this)
						});
					}
				}.bind(this)
			});
		},

		updateSOS: function (oData) {
			this.WorkOrderModel.update("/WORKORDERS('" + this.workorderNo + "')", oData, {
				success: function (oResponse) {
					MessageToast.show("SOS raised successfully");
				}.bind(this),
				error: function (error) {

					sap.m.MessageBox.error(error.message);
				}.bind(this)
			});
		},

		onwizardCompletedPress: function (oEvent) {

			var oData = this.getView().getModel("oWorkorderReport").getData();
			this.WorkOrderModel.create("/WORKORDERS_REPORT", oData, {
				success: function (oResponse) {

					this.updateComplete();

					// MessageToast.show("SOS raised successfully");
				}.bind(this),
				error: function (error) {

					sap.m.MessageBox.error(error.message);
				}.bind(this)
			});

		},

		updateComplete: function () {
			this.WorkOrderModel.read("/WORKORDERS('" + this.workorderNo + "')", {
				success: function (oData, oResponse) {
					delete oData.__metadata;
					oData.status = "Completed";
					this.updateCompleteS(oData);

				}.bind(this),
				error: function (error) {
					sap.m.MessageBox.error(error.message);
				}.bind(this)
			});
		},

		updateCompleteS: function (oData) {
			this.WorkOrderModel.update("/WORKORDERS('" + this.workorderNo + "')", oData, {
				success: function (oResponse) {
					MessageBox.success("WorkOrder Closed Successfully.", {
						title: "Success", // default

						actions: sap.m.MessageBox.Action.OK,
						emphasizedAction: sap.m.MessageBox.Action.OK,
						onClose: function (oAction) {
							if (oAction === MessageBox.Action.OK) {
								this.oRouter.navTo("RouteWorkOrders");

							}
						}.bind(this)

					});

				}.bind(this),
				error: function (error) {
					sap.m.MessageBox.error(error.message);
				}.bind(this)
			});
		},

	});

});