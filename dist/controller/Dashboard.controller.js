sap.ui.define(["sap/ui/core/mvc/Controller"],function(o){"use strict";return o.extend("com.capgemini.coe.irishRail_Worker.controller.Dashboard",{onInit:function(){this.oRouter=sap.ui.core.UIComponent.getRouterFor(this)},onTodayTaskpress:function(o){this.oRouter.navTo("RouteWorkOrders")}})});