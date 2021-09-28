define("UsrRealty1Page", ["RightUtilities"], function(RightUtilities) {
	return {
		entitySchemaName: "UsrRealty",
		attributes: {
			"CurrentUserName": {
				dataValueType: this.Terrasoft.DataValueType.TEXT,
				value: ""
			},
			"IsCCagent": {
				dataValueType: this.Terrasoft.DataValueType.BOOLEAN,
				value: false
			},
			"UsrCommissionUSD":{
				dependencies: [
                    {
                        columns: ["UsrPriceUSD", "UsrOfferType"],
                        methodName: "calculateCommission"
                    }
                ]
     
			},
			"UsrOfferType":{
				lookupListConfig:{
					columns: ["UsrCommissionCoeff"]	
				},
		}
		},
		modules: /**SCHEMA_MODULES*/{}/**SCHEMA_MODULES*/,
		details: /**SCHEMA_DETAILS*/{
			"Files": {
				"schemaName": "FileDetailV2",
				"entitySchemaName": "UsrRealtyFile",
				"filter": {
					"masterColumn": "Id",
					"detailColumn": "UsrRealty"
				}
			},
			"UsrSchema65801e50Detailb9ae778b": {
				"schemaName": "UsrRealtyVisitDetailGrid",
				"entitySchemaName": "UsrRealtyVisit",
				"filter": {
					"detailColumn": "UsrRealty",
					"masterColumn": "Id"
				}
			}
		}/**SCHEMA_DETAILS*/,
		businessRules: /**SCHEMA_BUSINESS_RULES*/{
			"UsrComment": {
				"a5757e58-7e96-48eb-9d50-9a60133ef79f": {
					"uId": "a5757e58-7e96-48eb-9d50-9a60133ef79f",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 0,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 7,
							"leftExpression": {
								"type": 1,
								"attribute": "UsrPriceUSD"
							},
							"rightExpression": {
								"type": 0,
								"value": 5000,
								"dataValueType": 5
							}
						}
					]
				}
			},
			"UsrOfferType": {
				"05f3698e-d1d2-48f8-8ecd-1ac7d86ef001": {
					"uId": "05f3698e-d1d2-48f8-8ecd-1ac7d86ef001",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 1,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "CurrentUserName"
							},
							"rightExpression": {
								"type": 0,
								"value": "Supervisor",
								"dataValueType": 1
							}
						}
					]
				}
			},
			"UsrStatus": {
				"a61fab3e-f94c-4b6f-9fb9-74eb4dd672f7": {
					"uId": "a61fab3e-f94c-4b6f-9fb9-74eb4dd672f7",
					"enabled": true,
					"removed": false,
					"ruleType": 0,
					"property": 2,
					"logical": 0,
					"conditions": [
						{
							"comparisonType": 3,
							"leftExpression": {
								"type": 1,
								"attribute": "IsCCagent"
							},
							"rightExpression": {
								"type": 0,
								"value": true,
								"dataValueType": 12
							}
						}
					]
				}
			}
		}/**SCHEMA_BUSINESS_RULES*/,
		methods: {
			
			asyncValidate: function(callback, scope) {
				this.callParent([
					function(response) {
						if (!this.validateResponse(response)) 
						{
							return;
						}
					this.validateRealtyData(function(response) {
						if (!this.validateResponse(response)) 
						{
							return;
						}
						callback.call(scope, response);
					},
					this);
					},this]);
			},
			
			validateRealtyData: function(callback, scope) {
				// create query for server side
				var esq = this.Ext.create("Terrasoft.EntitySchemaQuery", {
					rootSchemaName: "UsrRealty"
				});
				esq.addAggregationSchemaColumn("UsrPriceUSD", Terrasoft.AggregationType.SUM, "PriceSum"); // select SUM(UsrPriceUSD) from UsrRealty where ...
				var saleOfferTypeId = "61db466b-fecf-4e8b-8689-e6d9b2e37fed";
				var saleFilter = esq.createColumnFilterWithParameter(this.Terrasoft.ComparisonType.EQUAL,"UsrOfferType", saleOfferTypeId);
				esq.filters.addItem(saleFilter);
				// run query
				esq.getEntityCollection(function(response) {
					if (response.success && response.collection) {
						var sum = 0;
						var items = response.collection.getItems();
						if (items.length > 0) {
							sum = items[0].get("PriceSum");
						}
						var max = 1000000;
						if (sum > max) {
							if (callback) {
								callback.call(this, {success: false,message: "You cannot save, because sum = " + sum + " is bigger than " + max});
							}
						}
						else 
							if (callback){
							callback.call(scope, {success: true});
						}
					}
				}, this);
			},
			
			calculateCommission: function(){
				var result=0;
				var price=this.get("UsrPriceUSD");
				var offerTypeObject=this.get("UsrOfferType");
				if (offerTypeObject){
					var coeff=offerTypeObject.UsrCommissionCoeff;
					result=coeff*price;
				}
				this.set("UsrCommissionUSD",result);
			},
			
			positiveValueValidator: function(value,column){
				let msg="";
				if (value<=0){
					msg=this.get("Resources.Strings.ValueMustBePositive");
				}
				return {
                    // Сообщение об ошибке валидации.
                    invalidMessage: msg
                };
			},
			
			// Переопределение базового метода, инициализирующего пользовательские валидаторы.
            setValidationConfig: function() {
                // Вызывает инициализацию валидаторов родительской модели представления.
                this.callParent(arguments);
                this.addColumnValidator("UsrPriceUSD", this.positiveValueValidator);
				this.addColumnValidator("UsrAreaSqrM", this.positiveValueValidator);

            },
			
			onEntityInitialized: function(){
				this.callParent(arguments);
				this.console.log("Terrasoft.SysValue.CURRENT_USER.displayValue = "+Terrasoft.SysValue.CURRENT_USER.displayValue);
				this.set("CurrentUserName", Terrasoft.SysValue.CURRENT_USER.displayValue);
				
				var OperData={
					operation: "IsCCagentsMember"
				};

				RightUtilities.checkCanExecuteOperation(OperData, this.getOperation, this);
			},
			getOperation: function(result){
				this.set("IsCCagent", result);
			},
			MyButtonClick: function() {
				this.console.log("Button pressed");
			//todo
		},
			getMyButtonEnabled: function() {
				var name=this.get("UsrName");
				var result=!!name;
				return result;
		},
		},
		dataModels: /**SCHEMA_DATA_MODELS*/{}/**SCHEMA_DATA_MODELS*/,
		diff: /**SCHEMA_DIFF*/[
			{
				"operation": "insert",
				"name": "UsrName25f923f8-d90d-4c9c-89ec-83085ada858a",
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
				"name": "FLOAT07ccd1c4-d7be-4bb8-a3c5-4d7ba88b7251",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrPriceUSD",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "FLOAT9cda0f77-bb22-4e0a-8436-6afd4db9a646",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrAreaSqrM",
					"enabled": true
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "LOOKUP14be9156-fd8c-49fb-b1a3-ee7751a5406a",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 3,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "MyButton",
				"values": {
					"itemType": 5,
					"caption": {
						"bindTo": "Resources.Strings.MyButtonCaption"
					},
					"click": {
						"bindTo": "MyButtonClick"
					},
					"enabled": {
						"bindTo": "getMyButtonEnabled"
					},
					"style": "red",
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 4,
						"layoutName": "ProfileContainer"
					}
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "FLOAT033d84de-e0ed-4c37-bd11-aba7c7f9bb70",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 5,
						"layoutName": "ProfileContainer"
					},
					"bindTo": "UsrCommissionUSD",
					"enabled": false
				},
				"parentName": "ProfileContainer",
				"propertyName": "items",
				"index": 5
			},
			{
				"operation": "insert",
				"name": "STRINGe0042e12-3429-476b-95fc-dd9534ef1ce1",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrLocation",
					"enabled": true
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 0
			},
			{
				"operation": "insert",
				"name": "LOOKUPed32c27a-8de8-45c2-b2d5-f5322538385e",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 0,
						"layoutName": "Header"
					},
					"bindTo": "UsrOfferType",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 1
			},
			{
				"operation": "insert",
				"name": "LOOKUPeac8513e-fa03-4cb6-bb9b-deed6cc09b96",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 0,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "UsrStatus",
					"enabled": true,
					"contentType": 3
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 2
			},
			{
				"operation": "insert",
				"name": "CreatedOn12c5232f-a986-47ef-bb1f-5e94dbfe29d6",
				"values": {
					"layout": {
						"colSpan": 12,
						"rowSpan": 1,
						"column": 12,
						"row": 1,
						"layoutName": "Header"
					},
					"bindTo": "CreatedOn",
					"enabled": false
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 3
			},
			{
				"operation": "insert",
				"name": "STRING43fc45ec-eb79-45d0-b763-d39766341322",
				"values": {
					"layout": {
						"colSpan": 24,
						"rowSpan": 1,
						"column": 0,
						"row": 2,
						"layoutName": "Header"
					},
					"bindTo": "UsrComment",
					"enabled": true,
					"contentType": 0
				},
				"parentName": "Header",
				"propertyName": "items",
				"index": 4
			},
			{
				"operation": "insert",
				"name": "Tab8c969516TabLabel",
				"values": {
					"caption": {
						"bindTo": "Resources.Strings.Tab8c969516TabLabelTabCaption"
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
				"name": "UsrSchema65801e50Detailb9ae778b",
				"values": {
					"itemType": 2,
					"markerValue": "added-detail"
				},
				"parentName": "Tab8c969516TabLabel",
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
					"order": 1
				},
				"parentName": "Tabs",
				"propertyName": "tabs",
				"index": 1
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
					"order": 2
				}
			}
		]/**SCHEMA_DIFF*/
	};
});
