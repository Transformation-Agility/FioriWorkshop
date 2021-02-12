sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/DisplayListItem"
], function(Controller, DisplayListItem) {
	"use strict";

	return Controller.extend("ZWS_DEMO.ext.controller.Comment", {
		
		onInit: function() {
			var oRouter = this.getOwnerComponent().getRouter();
			var href = window.location.href;
			var tab = href.split('to_Packs(\'');
			var tab2 = tab[1].substring(0,32);//.split('\')');
			this.sWorkPackId = tab2;//[0];
			this._loadComments(this.sWorkPackId);
			oRouter.getRoute("ZWS_CO_WORKLOADS/to_Packs").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
			var href = window.location.href;
			var tab = href.split('to_Packs(\'');
			var tab2 = tab[1].substring(0,32);//.split('\')');
			this.sWorkPackId = tab2;//[0];

			this._loadComments(this.sWorkPackId);
		},

		onDeleteItem: function(oEvent) {
			this._deleteListItem(oEvent.getParameter("listItem"));
		},

		onPressGo: function(oEvent) {
			//var oInputWorkPackId = this.getView().byId("inputWorkPack");
			//var sWorkPackId = oInputWorkPackId.getValue();
			var oListComment = this.getView().byId("listComment");

			oListComment.removeAllItems();
			this._loadComments(this.sWorkPackId);
		},

		onPressAddComment: function(oEvent) {
			var oInputAddComment = this.getView().byId("inputAddComment");
			var oButtonAddComment = this.getView().byId("buttonAddComment");

			var sCommentTxt = oInputAddComment.getValue();

			if (sCommentTxt) {
				var id = Date.now();

				this._addComment(sCommentTxt, id);
				oInputAddComment.setValue("");
				oButtonAddComment.setEnabled(false);
			}
		},

		onPressSave: function(oEvent) {
			//var sWorkPackId = this.getView().byId("inputWorkPack").getValue();
			var oModel = this.getOwnerComponent().getModel("Comment");
			var aList = this.getView().byId("listComment").getItems();

			if (!this.sWorkPackId) {
				//popup
			} else {
				sap.ui.core.BusyIndicator.show();
				oModel.remove("/CommentSet(WorkPackId='" + this.sWorkPackId + "',CommentNo=1)", {
					method: "DELETE",
					success: function(data) {
						var oEntry;

						for (var i in aList) {
							oEntry = {};
							oEntry.WorkPackId = this.sWorkPackId;
							oEntry.CommentNo = parseInt(i) + 1;
							oEntry.CommentTxt = aList[i].getProperty("label");

							//oModel.setHeaders({"content-type" : "application/json;charset=utf-8"});
							oModel.create('/CommentSet', oEntry, null, function() {
								//alert("Create successful");
							}, function() {
								//alert("Create failed");
							});
						}
					}.bind(this),
					error: function(e) {

					}
				});

			}
			sap.ui.core.BusyIndicator.hide();
		},

		onLiveChangeAddComment: function(oEvent) {
			var oButtonAddComment = this.getView().byId("buttonAddComment");
			oButtonAddComment.setEnabled(!!oEvent.getParameter("value"));
		},

		_loadComments: function(workPackId) {
			var sFilter = "WorkPackId eq '" + workPackId + "'";
			var oResults = [];
			var oModel = this.getOwnerComponent().getModel("Comment");
			var oListComment = this.getView().byId("listComment");

			oListComment.removeAllItems();

			oModel.read("/CommentSet", {
				urlParameters: {
					"$filter": sFilter
				},
				success: function(oData, oResponse) {
					oResults = oData.results;

					for (var i in oResults) {
						this._addComment(oResults[i].CommentTxt, oResults[i].CommentNo);
					}

				}.bind(this),
				error: function(response) {

				}
			});
		},

		_addComment: function(CommentTxt, CommentNo) {
			var oListComment = this.getView().byId("listComment");
			var listItem = new DisplayListItem({
				label: CommentTxt
			}).data("id", CommentNo);
			oListComment.addAggregation("items", listItem);
		},

		_deleteListItem: function(oListItem) {
			var oListComment = this.getView().byId("listComment");
			oListComment.removeAggregation("items", oListItem);
		}

	});

});