sap.ui.define(["sap/ui/core/mvc/Controller"],function(r){"use strict";return r.extend("com.capgemini.coe.irishRail_Worker.controller.WorkOrders",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this)},onBackPress:function(r){this.oRouter.navTo("RouteDashboard")},onWorkOrderPress:function(r){var e=this.getOwnerComponent().getModel("mainModel");var o=r.getSource().getBindingContext("WorkOrderModel").getObject();var t=o.task;var n=o.startTime;var i=o.endTime;var s=o.workorder;e.setProperty("/task",t);e.setProperty("/startTime",n);e.setProperty("/endTime",i);this.oRouter.navTo("RouteWorkOrderWizard",{workorderNumber:s})}})});