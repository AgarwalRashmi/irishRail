//@ui5-bundle com/capgemini/coe/irishRail_Worker/Component-preload.js
jQuery.sap.registerPreloadedModules({
"version":"2.0",
"modules":{
	"com/capgemini/coe/irishRail_Worker/Component.js":function(){sap.ui.define(["sap/ui/core/UIComponent","sap/ui/Device","com/capgemini/coe/irishRail_Worker/model/models"],function(e,i,t){"use strict";return e.extend("com.capgemini.coe.irishRail_Worker.Component",{metadata:{manifest:"json"},init:function(){e.prototype.init.apply(this,arguments);this.getRouter().initialize();this.setModel(t.createDeviceModel(),"device");this.setModel(t.createMainModel(),"mainModel")}})});
},
	"com/capgemini/coe/irishRail_Worker/controller/Dashboard.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(o){"use strict";return o.extend("com.capgemini.coe.irishRail_Worker.controller.Dashboard",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this)},onTodayTaskpress:function(o){this.oRouter.navTo("RouteWorkOrders")}})});
},
	"com/capgemini/coe/irishRail_Worker/controller/LandingPage.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/m/MessageBox","sap/m/BusyDialog"],function(e,t,o){"use strict";return e.extend("com.capgemini.coe.irishRail_Worker.controller.LandingPage",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oBusyIndicator=new o},onPasswordLoginPress:function(e){this.oRouter.navTo("RoutePasswordLogin")},onCameraPress:function(e){if(sap.ui.Device.system.desktop===true){this._oPopover=null;if(!this._oPopover){this._oPopover=sap.ui.xmlfragment("com.capgemini.coe.irishRail_Worker.view.camera",this);this.getView().addDependent(this._oPopover)}this._oPopover.openBy(e.getSource())}else if(sap.ui.Device.system.phone===true){var t=navigator.camera;t.getPicture(this.onSuccess.bind(this),this.onError.bind(this),{quality:75,cameraDirection:1,targetWidth:300,targetHeight:300,destinationType:t.DestinationType.FILE_URI})}},onSuccess:function(e){this.oBusyIndicator.open();this.oBusyIndicator.setText("Validating authentication");var t=this;if(sap.ui.Device.system.desktop===true){this.callMLService(e)}else if(sap.ui.Device.system.phone===true){this.getImageData(e,function(e){t.callMLService(e)})}},onError:function(e){t.error("Oops! Unable to access camera")},getImageData:function(e,t){var o=new XMLHttpRequest;o.onload=function(){var e=new FileReader;e.onloadend=function(){t(e.result)};e.readAsDataURL(o.response)};o.open("GET",e);o.responseType="blob";o.send()},callMLService:function(e){var o=this;var i=e.split(";");var r=i[0].split(":")[1];var a=i[1].split(",")[1];var n=this.b64toBlob(a,r);var s=new FormData;s.append("file",n);var c={async:true,crossDomain:true,url:"/faceRecognitionDestination/upload",method:"POST",processData:false,contentType:false,mimeType:"multipart/form-data",data:s};var u=new Promise(function(e,i){$.ajax(c).success(function(e){this.oBusyIndicator.close();this.oRouter.navTo("RouteDashboard")}.bind(o)).error(function(e){debugger;t.error("Oops! Can't recognize the image. Try again.");this.oBusyIndicator.close()}.bind(o))})},b64toBlob:function(e,t,o){t=t||"";o=o||512;var i=atob(e);var r=[];for(var a=0;a<i.length;a+=o){var n=i.slice(a,a+o);var s=new Array(n.length);for(var c=0;c<n.length;c++){s[c]=n.charCodeAt(c)}var u=new Uint8Array(s);r.push(u)}var p=new Blob(r,{type:t});return p},onBrowsePress:function(){var e=navigator.camera;e.getPicture(this.onSuccess.bind(this),this.onError.bind(this),{quality:75,targetWidth:300,targetHeight:300,destinationType:e.DestinationType.FILE_URI,sourceType:e.PictureSourceType.PHOTOLIBRARY})}})});
},
	"com/capgemini/coe/irishRail_Worker/controller/PasswordLogin.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller","sap/ui/model/json/JSONModel","sap/m/MessageBox"],function(e,o,r){"use strict";return e.extend("com.capgemini.coe.irishRail_Worker.controller.PasswordLogin",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);var e=new o({username:"",password:""});this.getView().setModel(e,"ologinModel")},onBackPress:function(e){this.oRouter.navTo("RouteLandingPage")},onLoginPress:function(e){debugger;var o=this.getView().getModel("ologinModel");var s=o.getProperty("/username");var t=o.getProperty("/password");if(s=="rashmi"&&t=="rashmi"){this.oRouter.navTo("RouteDashboard")}else{r.error("Incorrect username or password");o.setProperty("/password","")}}})});
},
	"com/capgemini/coe/irishRail_Worker/controller/WorkOrderWizard.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(e){"use strict";return e.extend("com.capgemini.coe.irishRail_Worker.controller.WorkOrderWizard",{onInit:function(){this.WorkOrderModel=this.getOwnerComponent().getModel("WorkOrderModel");this.oRouter=sap.ui.core.UIComponent.getRouterFor(this);this.oRouter.getRoute("RouteWorkOrderWizard").attachPatternMatched(this._onObjectMatched,this)},onhandleWizardCancel:function(e){this.oRouter.navTo("RouteDashboard")},_onObjectMatched:function(e){var t=e.getParameter("arguments").workorderNumber;this.WorkOrderModel.metadataLoaded().then(function(){var e=this.WorkOrderModel.createKey("WORKORDERS_DESC",{workorder:t});this._bindView("/"+e)}.bind(this))},_bindView:function(e){this.getView().bindElement({path:e,model:"WorkOrderModel"})},onPPECameraPress:function(e){var t=navigator.camera;t.getPicture(this.onSuccess.bind(this),this.onError.bind(this),{quality:75,cameraDirection:1,targetWidth:300,targetHeight:300,destinationType:t.DestinationType.FILE_URI})},onPPEBrowsePress:function(){var e=navigator.camera;e.getPicture(this.onSuccess.bind(this),this.onError.bind(this),{quality:75,targetWidth:300,targetHeight:300,destinationType:e.DestinationType.FILE_URI,sourceType:e.PictureSourceType.PHOTOLIBRARY})},onSuccess:function(e){this.oBusyIndicator.open();this.oBusyIndicator.setText("Validating PPE Check");var t=this;if(sap.ui.Device.system.desktop===true){this.callMLService(e)}else if(sap.ui.Device.system.phone===true){this.getImageData(e,function(e){t.callMLService(e)})}},onError:function(e){MessageBox.error("Oops! Unable to access camera")},getImageData:function(e,t){var r=new XMLHttpRequest;r.onload=function(){var e=new FileReader;e.onloadend=function(){t(e.result)};e.readAsDataURL(r.response)};r.open("GET",e);r.responseType="blob";r.send()},callMLService:function(e){var t=this;var r=e.split(";");var o=r[0].split(":")[1];var a=r[1].split(",")[1];var i=this.b64toBlob(a,o);var n=new FormData;n.append("file",i);var s={async:true,crossDomain:true,url:"/PPE/upload",method:"POST",processData:false,contentType:false,mimeType:"multipart/form-data",data:n};var c=new Promise(function(e,r){$.ajax(s).success(function(e){this.oBusyIndicator.close();this.oRouter.navTo("RouteDashboard")}.bind(t)).error(function(e){debugger;MessageBox.error("Oops! Can't recognize the image. Try again.");this.oBusyIndicator.close()}.bind(t))})},b64toBlob:function(e,t,r){t=t||"";r=r||512;var o=atob(e);var a=[];for(var i=0;i<o.length;i+=r){var n=o.slice(i,i+r);var s=new Array(n.length);for(var c=0;c<n.length;c++){s[c]=n.charCodeAt(c)}var u=new Uint8Array(s);a.push(u)}var d=new Blob(a,{type:t});return d}})});
},
	"com/capgemini/coe/irishRail_Worker/controller/WorkOrders.controller.js":function(){sap.ui.define(["sap/ui/core/mvc/Controller"],function(r){"use strict";return r.extend("com.capgemini.coe.irishRail_Worker.controller.WorkOrders",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this)},onBackPress:function(r){this.oRouter.navTo("RouteDashboard")},onWorkOrderPress:function(r){var e=this.getOwnerComponent().getModel("mainModel");var o=r.getSource().getBindingContext("WorkOrderModel").getObject();var t=o.task;var n=o.startTime;var i=o.endTime;var s=o.workorder;e.setProperty("/task",t);e.setProperty("/startTime",n);e.setProperty("/endTime",i);this.oRouter.navTo("RouteWorkOrderWizard",{workorderNumber:s})}})});
},
	"com/capgemini/coe/irishRail_Worker/i18n/i18n.properties":'title=Title\nappTitle=irishRail_Worker\nappDescription=App Description',
	"com/capgemini/coe/irishRail_Worker/localService/metadata.xml":'<edmx:Edmx xmlns:edmx="http://schemas.microsoft.com/ado/2007/06/edmx" Version="1.0"><edmx:DataServices xmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" m:DataServiceVersion="2.0"><Schema xmlns:d="http://schemas.microsoft.com/ado/2007/08/dataservices"\n\t\t\txmlns:m="http://schemas.microsoft.com/ado/2007/08/dataservices/metadata" xmlns="http://schemas.microsoft.com/ado/2008/09/edm"\n\t\t\tNamespace="capgemini.apps.coe.irishRail_Worker.services.irishRail_Worker"><EntityType Name="WORKORDERSType"><Key><PropertyRef Name="workorder"/></Key><Property Name="workorder" Type="Edm.String" Nullable="false" MaxLength="64"/><Property Name="task" Type="Edm.String" MaxLength="64"/><Property Name="loction" Type="Edm.String" MaxLength="64"/><Property Name="startTime" Type="Edm.String" MaxLength="16"/><Property Name="endTime" Type="Edm.String" MaxLength="16"/><Property Name="priority" Type="Edm.String" MaxLength="16"/><Property Name="status" Type="Edm.String" MaxLength="32"/></EntityType><EntityType Name="WORKORDERS_DESCType"><Key><PropertyRef Name="workorder"/></Key><Property Name="workorder" Type="Edm.String" Nullable="false" MaxLength="64"/><Property Name="locationDetails" Type="Edm.String" MaxLength="32"/><Property Name="jobDetails" Type="Edm.String" MaxLength="64"/><Property Name="nearestStation" Type="Edm.String" MaxLength="32"/><Property Name="trackSector" Type="Edm.String" MaxLength="32"/><Property Name="nearestHospital" Type="Edm.String" MaxLength="64"/><Property Name="jobHazardDetails" Type="Edm.String" MaxLength="256"/></EntityType><EntityContainer Name="irishRail_Worker" m:IsDefaultEntityContainer="true"><EntitySet Name="WORKORDERS" EntityType="capgemini.apps.coe.irishRail_Worker.services.irishRail_Worker.WORKORDERSType"/><EntitySet Name="WORKORDERS_DESC" EntityType="capgemini.apps.coe.irishRail_Worker.services.irishRail_Worker.WORKORDERS_DESCType"/></EntityContainer></Schema></edmx:DataServices></edmx:Edmx>',
	"com/capgemini/coe/irishRail_Worker/manifest.json":'{"_version":"1.12.0","sap.app":{"id":"com.capgemini.coe.irishRail_Worker","type":"application","i18n":"i18n/i18n.properties","applicationVersion":{"version":"1.0.0"},"title":"{{appTitle}}","description":"{{appDescription}}","sourceTemplate":{"id":"servicecatalog.connectivityComponentForManifest","version":"0.0.0"},"dataSources":{"irishRail_Worker.xsodata":{"uri":"/hanaxs2/capgemini/apps/coe/irishRail_Worker/services/irishRail_Worker.xsodata/","type":"OData","settings":{"localUri":"localService/metadata.xml"}}}},"sap.ui":{"resourceRoots":{"openui5.camera":"./openui5/camera/"},"technology":"UI5","icons":{"icon":"","favIcon":"","phone":"","phone@2":"","tablet":"","tablet@2":""},"deviceTypes":{"desktop":true,"tablet":true,"phone":true}},"sap.ui5":{"flexEnabled":false,"rootView":{"viewName":"com.capgemini.coe.irishRail_Worker.view.LandingPage","type":"XML","async":true,"id":"LandingPage"},"dependencies":{"minUI5Version":"1.65.6","libs":{"sap.ui.layout":{},"sap.ui.core":{},"sap.m":{}}},"contentDensities":{"compact":true,"cozy":true},"models":{"i18n":{"type":"sap.ui.model.resource.ResourceModel","settings":{"bundleName":"com.capgemini.coe.irishRail_Worker.i18n.i18n"}},"WorkOrderModel":{"type":"sap.ui.model.odata.v2.ODataModel","settings":{"defaultOperationMode":"Server","defaultBindingMode":"OneWay","defaultCountMode":"Request"},"dataSource":"irishRail_Worker.xsodata","preload":true}},"resources":{"css":[{"uri":"css/style.css"}]},"routing":{"config":{"routerClass":"sap.m.routing.Router","viewType":"XML","async":true,"viewPath":"com.capgemini.coe.irishRail_Worker.view","controlAggregation":"pages","controlId":"app","clearControlAggregation":false},"routes":[{"name":"RouteLandingPage","pattern":"","target":["TargetLandingPage"]},{"name":"RoutePasswordLogin","pattern":"PasswordLogin","target":["TargetPasswordLogin"]},{"name":"RouteDashboard","pattern":"Dashboard","target":["TargetDashboard"]},{"name":"RouteWorkOrders","pattern":"WorkOrders","target":["TargetWorkOrders"]},{"name":"RouteWorkOrderWizard","pattern":"WorkOrderWizard/{workorderNumber}","target":["TargetWorkOrderWizard"]}],"targets":{"TargetLandingPage":{"viewType":"XML","transition":"slide","clearControlAggregation":false,"viewName":"LandingPage"},"TargetPasswordLogin":{"viewType":"XML","viewName":"PasswordLogin","transition":"slide","clearControlAggregation":false},"TargetDashboard":{"viewType":"XML","viewName":"Dashboard","transition":"slide","clearControlAggregation":false},"TargetWorkOrders":{"viewType":"XML","viewName":"WorkOrders","transition":"slide","clearControlAggregation":false},"TargetWorkOrderWizard":{"viewType":"XML","viewName":"WorkOrderWizard","transition":"slide","clearControlAggregation":false}}}}}',
	"com/capgemini/coe/irishRail_Worker/model/formatter.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,i){"use strict";return{}});
},
	"com/capgemini/coe/irishRail_Worker/model/models.js":function(){sap.ui.define(["sap/ui/model/json/JSONModel","sap/ui/Device"],function(e,i){"use strict";return{createDeviceModel:function(){var n=new e(i);n.setDefaultBindingMode("OneWay");return n},createMainModel:function(){var i=new e({imageData:"",task:"",startTime:"",endTime:""});i.setSizeLimit(1e3);return i}}});
},
	"com/capgemini/coe/irishRail_Worker/openui5/camera/Camera-dbg.js":function(){sap.ui.define(["jquery.sap.global","sap/ui/core/Control"],function(e,t){"use strict";var i=t.extend("openui5.camera.Camera",{metadata:{properties:{width:{type:"string",defaultValue:"640"},height:{type:"string",defaultValue:"480"},videoWidth:{type:"string",defaultValue:"1280"},videoHeight:{type:"string",defaultValue:"960"}},events:{snapshot:{}}},init:function(){var e=this;this._displayingVideo=false},_onUserClickedVideo:function(){var e=parseInt(this.getVideoWidth(),10);var t=parseInt(this.getVideoHeight(),10);if(this._displayingVideo){var i=this._takePicture(e,t);this.fireSnapshot({image:i})}},_takePicture:function(e,t){var i=this._getCanvas();var a=this._getVideo();var n=null;var s=i.getContext("2d");if(e&&t){s.drawImage(a,0,0,e,t);n=i.toDataURL("image/jpeg")}return n},_getCanvas:function(){return e("canvas",e("#"+this.getId())).get(0)},_getVideo:function(){return e("video",e("#"+this.getId())).get(0)},stopCamera:function(){this._displayingVideo=false;if(this._stream){this._stream.getVideoTracks().forEach(function(e){e.stop()})}},onAfterRendering:function(){var t=this;var i=this._getVideo();if(i&&!i.onclick){i.onclick=function(){t._onUserClickedVideo()}}if(i&&!this._displayingVideo){navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false}).then(function(e){t._stream=e;i.srcObject=e;i.play();t._displayingVideo=true}).catch(function(t){e.sap.log.error("Problems accessing the camera: "+t)})}}});return i});
},
	"com/capgemini/coe/irishRail_Worker/openui5/camera/Camera.js":function(){sap.ui.define(["jquery.sap.global","sap/ui/core/Control"],function(e,t){"use strict";var i=t.extend("openui5.camera.Camera",{metadata:{properties:{width:{type:"string",defaultValue:"640"},height:{type:"string",defaultValue:"480"},videoWidth:{type:"string",defaultValue:"1280"},videoHeight:{type:"string",defaultValue:"960"}},events:{snapshot:{}}},init:function(){var e=this;this._displayingVideo=false},_onUserClickedVideo:function(){var e=parseInt(this.getVideoWidth(),10);var t=parseInt(this.getVideoHeight(),10);if(this._displayingVideo){var i=this._takePicture(e,t);this.fireSnapshot({image:i})}},_takePicture:function(e,t){var i=this._getCanvas();var a=this._getVideo();var n=null;var s=i.getContext("2d");if(e&&t){s.drawImage(a,0,0,e,t);n=i.toDataURL("image/jpeg")}return n},_getCanvas:function(){return e("canvas",e("#"+this.getId())).get(0)},_getVideo:function(){return e("video",e("#"+this.getId())).get(0)},stopCamera:function(){this._displayingVideo=false;if(this._stream){this._stream.getVideoTracks().forEach(function(e){e.stop()})}},onAfterRendering:function(){var t=this;var i=this._getVideo();if(i&&!i.onclick){i.onclick=function(){t._onUserClickedVideo()}}if(i&&!this._displayingVideo){navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false}).then(function(e){t._stream=e;i.srcObject=e;i.play();t._displayingVideo=true}).catch(function(t){e.sap.log.error("Problems accessing the camera: "+t)})}}});return i});
},
	"com/capgemini/coe/irishRail_Worker/openui5/camera/CameraRenderer-dbg.js":function(){sap.ui.define([],function(){"use strict";var e={};e.render=function(e,t){e.write("<div");e.writeControlData(t);e.writeClasses();e.writeStyles();e.write(">");e.write("<div style='display: flex; flex-direction: row; align-items: center; justify-content: space-around;'>");e.write("<video width='%w' height='%h' style='width: %pwpx; height: %phpx;'></video>".replace("%w",t.getVideoWidth()).replace("%h",t.getVideoHeight()).replace("%pw",t.getWidth()).replace("%ph",t.getHeight()));e.write("<canvas width='%w' height='%h' style='display: none; width: %pwpx; height: %phpx;'></canvas>".replace("%w",t.getVideoWidth()).replace("%h",t.getVideoHeight()).replace("%pw",t.getWidth()).replace("%ph",t.getHeight()));e.write("</div>");e.write("</div>")};return e},true);
},
	"com/capgemini/coe/irishRail_Worker/openui5/camera/CameraRenderer.js":function(){sap.ui.define([],function(){"use strict";var e={};e.render=function(e,t){e.write("<div");e.writeControlData(t);e.writeClasses();e.writeStyles();e.write(">");e.write("<div style='display: flex; flex-direction: row; align-items: center; justify-content: space-around;'>");e.write("<video width='%w' height='%h' style='width: %pwpx; height: %phpx;'></video>".replace("%w",t.getVideoWidth()).replace("%h",t.getVideoHeight()).replace("%pw",t.getWidth()).replace("%ph",t.getHeight()));e.write("<canvas width='%w' height='%h' style='display: none; width: %pwpx; height: %phpx;'></canvas>".replace("%w",t.getVideoWidth()).replace("%h",t.getVideoHeight()).replace("%pw",t.getWidth()).replace("%ph",t.getHeight()));e.write("</div>");e.write("</div>")};return e},true);
},
	"com/capgemini/coe/irishRail_Worker/openui5/camera/library-dbg.js":function(){/*!
 * ${copyright}
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/library"],function(e,a){"use strict";sap.ui.getCore().initLibrary({name:"openui5.camera",noLibraryCSS:true,version:"0.0.1",dependencies:["sap.ui.core","sap.m"],types:[],interfaces:[],controls:["openui5.camera.Camera"],elements:[]});return openui5.camera},false);
},
	"com/capgemini/coe/irishRail_Worker/openui5/camera/library.js":function(){/*!
 * ${copyright}
 */
sap.ui.define(["jquery.sap.global","sap/ui/core/library"],function(e,a){"use strict";sap.ui.getCore().initLibrary({name:"openui5.camera",noLibraryCSS:true,version:"0.0.1",dependencies:["sap.ui.core","sap.m"],types:[],interfaces:[],controls:["openui5.camera.Camera"],elements:[]});return openui5.camera},false);
},
	"com/capgemini/coe/irishRail_Worker/view/Dashboard.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m"\n\tcontrollerName="com.capgemini.coe.irishRail_Worker.controller.Dashboard" xmlns:html="http://www.w3.org/1999/xhtml"><App><pages><Page title="Title"><customHeader><Bar><contentLeft><Image src="images/capLogo.png" width="4rem" class="sapUiTinyMarginBegin"/></contentLeft><contentMiddle><Title text="Irish Rail"/></contentMiddle><contentRight><Avatar src="{mainModel>/imageData}" displaySize="XS" showBorder="true" class="sapUiTinyMarginEnd"/></contentRight></Bar></customHeader><content><VBox width="100%" height="100%" class="dashboardbackground-style"><FlexBox alignItems="Center" justifyContent="Center" direction="Column" class="userDetails-style" width="100%"><SlideTile class="sapUiLargeMarginBottom"><tiles><GenericTile backgroundImage="images/safety.png" frameType="TwoByOne" header="Safety Instructions" class="tileText-style" press="press"></GenericTile><GenericTile backgroundImage="images/announcement.png" class="tileText-style" frameType="TwoByOne" header="Employer Announcement"\n\t\t\t\t\t\t\t\t\t\tpress="press"></GenericTile></tiles></SlideTile><GenericTile backgroundImage="images/todo.png" class="tileText-style sapUiLargeMarginTop" header="Sales Fulfillment Application Title"\n\t\t\t\t\t\t\t\tsubheader="Subtitle" frameType="TwoByOne" press="onTodayTaskpress"></GenericTile></FlexBox></VBox></content></Page></pages></App></mvc:View>',
	"com/capgemini/coe/irishRail_Worker/view/LandingPage.view.xml":'<mvc:View controllerName="com.capgemini.coe.irishRail_Worker.controller.LandingPage" xmlns:mvc="sap.ui.core.mvc" displayBlock="true"\n\txmlns="sap.m" xmlns:core="sap.ui.core"><Shell id="shell"><App id="app"><pages><Page id="page" title="{i18n>title}" showHeader="true"><customHeader><Bar><contentLeft><Image src="images/capLogo.png" width="4rem" class="sapUiTinyMarginBegin"/></contentLeft><contentMiddle><Title text="Irish Rail"/></contentMiddle></Bar></customHeader><content><VBox class="mainContainer-style"><FlexBox alignItems="Center" justifyContent="Center" class="sapUiLargeMarginTop" direction="Column"><items><Text text="Welcome to SafeTracks - Worker Module" class="sapUiLargeMarginBottom"/><Avatar src="{mainModel>/imageData}" displaySize="XL" showBorder="true" class="sapUiMediumMarginBottom avatarImage-style"\n\t\t\t\t\t\t\t\t\t\tpress="onCameraPress"/><HBox><Button icon="sap-icon://camera" type="Emphasized" class="sapUiTinyMargin" press="onCameraPress"/><Button icon="sap-icon://attachment" type="Emphasized" class="sapUiTinyMargin" press="onBrowsePress"/></HBox><Text text="Facing issues with face ID?" class="sapUiSmallMarginTop"/><Link text="Use password based login" class="sapUiSmallMarginTop" press="onPasswordLoginPress"/></items></FlexBox></VBox></content></Page></pages></App></Shell></mvc:View>',
	"com/capgemini/coe/irishRail_Worker/view/PasswordLogin.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.ui.layout.form"\n\tcontrollerName="com.capgemini.coe.irishRail_Worker.controller.PasswordLogin" xmlns:html="http://www.w3.org/1999/xhtml"><App><pages><Page title="Title"><customHeader><Bar><contentLeft><core:Icon src="sap-icon://sys-back" color="#FFF" press="onBackPress"/><Image src="images/capLogo.png" width="4rem" class="sapUiTinyMarginBegin"/></contentLeft><contentMiddle><Title text="Irish Rail"/></contentMiddle></Bar></customHeader><content><VBox width="100%" height="100%" class="whiteBackground"><FlexBox alignItems="Center" justifyContent="Center" direction="Column" class="userDetails-style" width="100%"><items><f:SimpleForm minWidth="1024" maxContainerCols="2" editable="false" layout="ResponsiveGridLayout" labelSpanL="3" labelSpanM="3"\n\t\t\t\t\t\t\t\t\temptySpanL="4" emptySpanM="4" columnsL="2" columnsM="2"><f:content><Label text="Username"/><Input placeholder="Enter username.." value="{ologinModel>/username}"/><Label text="Password"/><Input placeholder="Enter password.." type="Password" value="{ologinModel>/password}"/></f:content></f:SimpleForm><Link text="Forgot Login Details?" class="sapUiMediumMarginBottom"/><Button text="Login" icon="sap-icon://role" type="Emphasized" press="onLoginPress"/></items></FlexBox></VBox></content></Page></pages></App></mvc:View>',
	"com/capgemini/coe/irishRail_Worker/view/WorkOrderWizard.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns="sap.m" xmlns:f="sap.ui.layout.form"\n\tcontrollerName="com.capgemini.coe.irishRail_Worker.controller.WorkOrderWizard" xmlns:html="http://www.w3.org/1999/xhtml"><App><pages><Page title="Title" showHeader="false"><content><Wizard complete="wizardCompletedHandler" class="wizardBg-style"><WizardStep title="Compliance Check" activate="false"><VBox><MessageStrip class="sapUiSmallMarginBottom" text="Job Detail Number: {WorkOrderModel>workorder}" type="Information"/><HBox class="taskDetailsHeader-style" alignItems="Center"><Avatar displaySize="M" displayShape="Square" fallbackIcon="sap-icon://check-availability" class="imageColor-style"/><VBox class="sapUiTinyMarginBegin"><Text text="PPE Complince Check" class="headerFont-style"/><Text text="Please put on the provided PPE and click a picture of yourself" class="subHeaderFont-style"/></VBox></HBox><FlexBox justifyContent="Center" wrap="Wrap"><items><Title text="Make sure you are in a well lit place when taking snap" class="sapUiSmallMargin" level="H2"/><Avatar src="" displaySize="XL" showBorder="true" class="sapUiSmallMarginBottom avatarImage-style" press="onPPECameraPress"/><HBox><Button icon="sap-icon://camera" text="Snap and Check" type="Emphasized" class="sapUiTinyMargin" press="onPPECameraPress"/><Button icon="sap-icon://attachment" text="Browse and Check" type="Emphasized" class="sapUiTinyMargin" press="onPPEBrowsePress"/></HBox></items></FlexBox></VBox></WizardStep><WizardStep title="Task Details"><VBox height="100%"><MessageStrip class="sapUiSmallMarginBottom" text="Job Detail Number: {WorkOrderModel>workorder}" type="Information"/><HBox class="taskDetailsHeader-style" alignItems="Center"><Avatar displaySize="M" displayShape="Square" fallbackIcon="sap-icon://passenger-train" class="imageColor-style"/><VBox class="sapUiTinyMarginBegin"><Text text="{mainModel>/task}" class="headerFont-style"/><Text text="Planned Time: {mainModel>/startTime} - {mainModel>/endTime}" class="subHeaderFont-style"/></VBox></HBox><HBox><items><f:SimpleForm editable="false" layout="ResponsiveGridLayout" title="Location Details" labelSpanXL="4" labelSpanL="4" labelSpanM="12"\n\t\t\t\t\t\t\t\t\t\t\tlabelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1"\n\t\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="Region"/><Text text="{WorkOrderModel>locationDetails}"/><Label text="Nearest Station"/><Text text="{WorkOrderModel>nearestStation}"/><Label text="Track Sector"/><Text text="{WorkOrderModel>trackSector}"/></f:content></f:SimpleForm><f:SimpleForm editable="false" layout="ResponsiveGridLayout" title="Job Details" labelSpanXL="4" labelSpanL="4" labelSpanM="12"\n\t\t\t\t\t\t\t\t\t\t\tlabelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1"\n\t\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="Description"/><Text text="{WorkOrderModel>jobDetails}"/><Label text="Nearest Hospital"/><Text text="{WorkOrderModel>nearestHospital}"/></f:content></f:SimpleForm></items></HBox><VBox><f:SimpleForm editable="false" layout="ResponsiveGridLayout" title="Job Hazard Details" labelSpanXL="4" labelSpanL="4" labelSpanM="12"\n\t\t\t\t\t\t\t\t\t\tlabelSpanS="12" adjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1"\n\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false"><f:content><Text text="{WorkOrderModel>jobHazardDetails}"/></f:content></f:SimpleForm></VBox><HBox><items><f:SimpleForm editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12"\n\t\t\t\t\t\t\t\t\t\t\tadjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1"\n\t\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="Predicted Weather Condition"/><Text text="Waether"/></f:content></f:SimpleForm><f:SimpleForm editable="false" layout="ResponsiveGridLayout" labelSpanXL="4" labelSpanL="4" labelSpanM="12" labelSpanS="12"\n\t\t\t\t\t\t\t\t\t\t\tadjustLabelSpan="false" emptySpanXL="0" emptySpanL="0" emptySpanM="0" emptySpanS="0" columnsXL="2" columnsL="2" columnsM="1"\n\t\t\t\t\t\t\t\t\t\t\tsingleContainerFullSize="false"><f:content><Label text="Estimated Rail Crossings"/><Text text="Rail"/></f:content></f:SimpleForm></items></HBox></VBox></WizardStep><WizardStep title="Tasks progress"><VBox height="100%"><HBox class="taskDetailsHeader-style" alignItems="Center"><Avatar displaySize="M" displayShape="Square" fallbackIcon="sap-icon://passenger-train" class="imageColor-style"/><VBox class="sapUiTinyMarginBegin"><Text text="{mainModel>/task}" class="headerFont-style"/><Text text="Planned Time: {mainModel>/startTime} - {mainModel>/endTime}" class="subHeaderFont-style"/></VBox></HBox></VBox><GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" press="press"></GenericTile><GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" press="press" backgroundImage="images/emergStop.png"></GenericTile><GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" press="press"></GenericTile><GenericTile class="sapUiTinyMarginBegin sapUiTinyMarginTop tileLayout" press="press" backgroundImage="images/medicalEmerg.png"></GenericTile></WizardStep><WizardStep title="Job Report"></WizardStep></Wizard></content><footer><OverflowToolbar><ToolbarSpacer/><Button text="Cancel" press="onhandleWizardCancel"/></OverflowToolbar></footer></Page></pages></App></mvc:View>',
	"com/capgemini/coe/irishRail_Worker/view/WorkOrders.view.xml":'<mvc:View xmlns:core="sap.ui.core" xmlns:mvc="sap.ui.core.mvc" xmlns:card="sap.f.cards" xmlns:f="sap.f" xmlns="sap.m"\n\txmlns:grid="sap.ui.layout.cssgrid" xmlns:layout="sap.ui.layout" controllerName="com.capgemini.coe.irishRail_Worker.controller.WorkOrders"\n\txmlns:html="http://www.w3.org/1999/xhtml"><App><pages><Page title="Title"><customHeader><Bar><contentLeft><core:Icon src="sap-icon://sys-back" color="#FFF" press="onBackPress"/><Image src="images/capLogo.png" width="4rem" class="sapUiTinyMarginBegin"/></contentLeft><contentMiddle><Title text="Irish Rail"/></contentMiddle><contentRight><Avatar src="{mainModel>/imageData}" displaySize="XS" showBorder="true" class="sapUiTinyMarginEnd"/></contentRight></Bar></customHeader><content><VBox width="100%" height="100%" class="workOrderBg-style"><FlexBox class="whiteBackground sapUiSmallMarginTopBottom" justifyContent="Center" width="100%"><Title text="Assigned Work Orders" class="headerFontW-style" /></FlexBox><f:GridList class="gridlist" items="{WorkOrderModel>/WORKORDERS}" width="100%"><f:customLayout ><grid:GridBoxLayout boxMinWidth="100%" boxWidth="100%"/></f:customLayout><CustomListItem class="ProductsCard" type="Active" press="onWorkOrderPress"><VBox fitContainer="true" height="8rem"><FlexBox alignItems="Start" justifyContent="SpaceBetween" class="sapUiTinyMarginBeginEnd sapUiTinyMarginTopBottom"><items><Link text="{WorkOrderModel>workorder}" class="font-style"/><Text text="{WorkOrderModel>status}"/></items></FlexBox><FlexBox alignItems="Start" justifyContent="Start" direction="Column" class="sapUiTinyMarginBegin"><items><Text text="Task: {WorkOrderModel>task}"/><Text text="Location: {WorkOrderModel>location}"/><Text text="Planned Time: {WorkOrderModel>startTime} - {WorkOrderModel>endTime}"/><Text text="Priority: {WorkOrderModel>priority}"/></items></FlexBox></VBox></CustomListItem></f:GridList></VBox></content></Page></pages></App></mvc:View>',
	"com/capgemini/coe/irishRail_Worker/view/camera.fragment.xml":'<core:FragmentDefinition\n\txmlns="sap.m"\n\txmlns:core="sap.ui.core"\n\txmlns:camera="openui5.camera"><ResponsivePopover\n\t\ttitle="Camera"\n\t\t\n\t\tplacement="Left"\n\t\tmodal="true"><endButton><Button icon="sap-icon://decline" tooltip="Close" press="handleCloseButton" /></endButton><content><camera:Camera\n                id="idCamera"\n                width="640"\n                height="480"\n                snapshot="onCameraPress" \n                /></content></ResponsivePopover></core:FragmentDefinition>'
}});
