sap.ui.controller("ZWS_DEMO.ext.controller.ListReportExt", {
	onInit: function() {
		var oSmartFilterBar = this.getView().byId("listReportFilter");
		oSmartFilterBar.addAggregation("customData",
			new sap.ui.core.CustomData({
				key: "executeStandardVariantOnSelect",
				value: true
			}));
		
		var liveMode = oSmartFilterBar.getLiveMode();
		if(!liveMode) {
			oSmartFilterBar.setLiveMode(true);
 
		}
	},
});