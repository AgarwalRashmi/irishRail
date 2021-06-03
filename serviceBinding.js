function initModel() {
	var sUrl = "/hanaxs2/capgemini/apps/coe/irishRail_Worker/services/irishRail_Worker.xsodata/";
	var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
	sap.ui.getCore().setModel(oModel);
}