define("UsrSwimmingProgramm1Page", [], function() {
	return {
		entitySchemaName: "UsrSwimmingProgramm",
		attributes: {},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrSwimmingProgrammFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrSwimmingProgramm"
				}
			},
			"UsrSchema54e7c4c2Detailfd6bcf24": {
				"schemaName": "UsrSchema54e7c4c2Detail",
				"entitySchemaName": "UsrSwimLesson",
				"filter": {
					"detailColumn": "UsrSwimmingProgramm",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrOwner": {
				"460942f4-adc5-4491-984b-2579191c38f4": {
					"uId": "460942f4-adc5-4491-984b-2579191c38f4",
					"enabled": true,
					"removed": false,
					"ruleType": 1,
					"baseAttributePatch": "Type",
					"comparisonType": 3,
					"autoClean": false,
					"autocomplete": false,
					"type": 0,
					"value": "60733efc-f36b-1410-a883-16d83cab0980",
					"dataValueType": 10
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			
			asyncValidate: function(callback, scope) {
		this.callParent([function(response) {
			if (!this.validateResponse(response)) {
				return;
			}
			Terrasoft.chain(
				function(next) {
					this.validateSwimmingProgramm(function(response) {
						if (this.validateResponse(response)) {
							next();
						}
					}, this);
				},
				function(next) {
					callback.call(scope, response);
					next();
				}, this);
		}, this]);
	},
			
			validateSwimmingProgramm: function(callback, scope) {
			Terrasoft.SysSettings.querySysSettingsItem("UsrMaxNumberOfEveryDayActiveLesson", function(Maxcount) {
			if (!this.changedValues){
				callback.call(scope, {success:true});
			}
			var period = "";
			var active = false;
			var error_msg = this.get("Resources.Strings.ValidateEveryDayLesson");
			if (this.get("UsrPeriod")) {
				period = this.get("UsrPeriod").displayValue;
			}
			if (this.get("UsrActivity")) {
				active = this.get("UsrActivity");
			}
			var esq = Ext.create("Terrasoft.EntitySchemaQuery", { rootSchemaName: "UsrSwimmingProgramm" });
			esq.addColumn("UsrPeriod.Name", "UsrPeriodName");
			esq.filters.addItem(esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL, 
				"UsrPeriod.Name", "Ежедневно"));
			esq.filters.addItem(esq.createColumnFilterWithParameter(Terrasoft.ComparisonType.EQUAL,
				"UsrActivity", true));
			esq.getEntityCollection(function(response) {
				var result = {success: true};
				var count=response.collection.getCount();
				if (this.changedValues && period==="Ежедневно" && active===true && count>=Maxcount){
					result.message = error_msg + Maxcount;
					result.success = false;
				}
				callback.call(scope || this, result);
			}, this);
		}, this);
	}
},
			/*asyncValidate: function(callback, scope) {
				this.callParent([
					function(response) {
						if (!this.validateResponse(response)) 
						{
							return;
						}
					this.validateSwimmingProgramm(function(response) {
						if (!this.validateResponse(response)) 
						{
							return;
						}
						callback.call(scope, response);
					},
					this);
					},this]);
			},
			
			validateSwimmingProgramm: function(callback, scope) {
				Terrasoft.SysSettings.querySysSettingsItem("UsrMaxNumberOfEveryDayActiveLesson", function(Maxcount) {
				if (!this.changedValues){
					callback.call(scope, {success:true});
				}
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "UsrSwimmingProgramm"
				});
				
				var error_msg = this.get("Resources.Strings.ValidateEveryDayLesson");
				var period='';
				period = this.get("UsrPeriod").displayValue;
				var active=false;
				active = this.get("UsrActivity");
				esq.addAggregationSchemaColumn("UsrPeriod", Terrasoft.AggregationType.COUNT, "EveryDay");
				var Filter1 = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,"UsrPeriod.Name", "Ежедневно");
				var Filter2 = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,"UsrActivity", true);
				esq.filters.addItem(Filter1);
				esq.filters.addItem(Filter2);
				
				esq.getEntityCollection(function(response) {
					if (response.success && response.collection) {
						var count = 0;
						var items = response.collection.getItems();
						if (items.length > 0) {
							count = items[0].get("EveryDay");
						}

						if (count >= Maxcount) {
							if (callback) {
								callback.call(this, {success: false,message: error_msg + Maxcount});
							}
						}
						else 
							if (callback){
							callback.call(scope, {success: true});
						}
					}
				}, this);
			}, this);
		},*/
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName43349ce9-0176-46f3-8038-9b2eacebcebf",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrName",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "STRING469f0324-992c-44b4-8420-6c44b8f97f9c",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCode",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUP3d04f091-daa3-43b0-b48b-1b176ef45ffa",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPeriod",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUP5d709d60-7f24-413f-918f-6a64870a808c",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrOwner",
					"enabled": true,
					"contentType": 5
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "BOOLEAN7bd13455-de6f-4393-900f-3bc46ae516bc",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrActivity",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "STRING2beeaefe-d462-4f97-856f-c3eb972a0c90",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 2,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesAndFilesTab",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.NotesAndFilesTabCaption"
					},
					"items": [],
					"order": 0
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "Files",
				"values": {
					"itemType": 2
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "NotesControlGroup",
				"values": {
					"itemType": 15,
					"caption": {
						"bindTo": "Resources.Strings.NotesGroupCaption"
					},
					"items": []
				},
				"parentName": "NotesAndFilesTab",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "Notes",
				"values": {
					"bindTo": "UsrNotes",
					"dataValueType": 1,
					"contentType": 4,
					"layout": {
						"column": 0,
						"row": 0,
						"colSpan": 24
					},
					"labelConfig": {
						"visible": false
					},
					"controlConfig": {
						"imageLoaded": {
							"bindTo": "insertImagesToNotes"
						},
						"images": {
							"bindTo": "NotesImagesCollection"
						}
					}
				},
				"parentName": "NotesControlGroup",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "merge",
				"name": "ESNTab",
				"values": {
					"order": 1
				}
			},
			{
				"operation": "insert",
				"name": "Tab070c97d2TabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab070c97d2TabLabelTabCaption"
					},
					"items": [],
					"order": 2
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "UsrSchema54e7c4c2Detailfd6bcf24",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab070c97d2TabLabel",
				"propertyName": "items",
				"index": 0
			}
		]/**SCHEMA_DIFF*/
	};
});
