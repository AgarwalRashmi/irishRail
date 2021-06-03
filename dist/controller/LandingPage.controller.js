sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/m/BusyDialog"],function(e,t,o){"use strict";return e.extend("com.capgemini.coe.irishRail_Worker.controller.LandingPage",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oBusyIndicator=new o},onPasswordLoginPress:function(e){this.oRouter.navTo("RoutePasswordLogin")},onCameraPress:function(e){if(sap.ui.Device.system.desktop===true){this._oPopover=null;if(!this._oPopover){this._oPopover=sap.ui.xmlfragment("com.capgemini.coe.irishRail_Worker.view.camera",this);this.getView().addDependent(this._oPopover)}this._oPopover.openBy(e.getSource())}else if(sap.ui.Device.system.phone===true){var t=navigator.camera;t.getPicture(this.onSuccess.bind(this),this.onError.bind(this),{quality:75,cameraDirection:1,targetWidth:300,targetHeight:300,destinationType:t.DestinationType.FILE_URI})}},onSuccess:function(e){this.oBusyIndicator.open();this.oBusyIndicator.setText("Validating authentication");var t=this;if(sap.ui.Device.system.desktop===true){this.callMLService(e)}else if(sap.ui.Device.system.phone===true){this.getImageData(e,function(e){t.callMLService(e)})}},onError:function(e){t.error("Oops! Unable to access camera")},getImageData:function(e,t){var o=new XMLHttpRequest;o.onload=function(){var e=new FileReader;e.onloadend=function(){t(e.result)};e.readAsDataURL(o.response)};o.open("GET",e);o.responseType="blob";o.send()},callMLService:function(e){var o=this;var i=e.split(";");var r=i[0].split(":")[1];var a=i[1].split(",")[1];var n=this.b64toBlob(a,r);var s=new FormData;s.append("file",n);var c={async:true,crossDomain:true,url:"/faceRecognitionDestination/upload",method:"POST",processData:false,contentType:false,mimeType:"multipart/form-data",data:s};var u=new Promise(function(e,i){$.ajax(c).success(function(e){this.oBusyIndicator.close();this.oRouter.navTo("RouteDashboard")}.bind(o)).error(function(e){debugger;t.error("Oops! Can't recognize the image. Try again.");this.oBusyIndicator.close()}.bind(o))})},b64toBlob:function(e,t,o){t=t||"";o=o||512;var i=atob(e);var r=[];for(var a=0;a<i.length;a+=o){var n=i.slice(a,a+o);var s=new Array(n.length);for(var c=0;c<n.length;c++){s[c]=n.charCodeAt(c)}var u=new Uint8Array(s);r.push(u)}var p=new Blob(r,{type:t});return p},onBrowsePress:function(){var e=navigator.camera;e.getPicture(this.onSuccess.bind(this),this.onError.bind(this),{quality:75,targetWidth:300,targetHeight:300,destinationType:e.DestinationType.FILE_URI,sourceType:e.PictureSourceType.PHOTOLIBRARY})}})});