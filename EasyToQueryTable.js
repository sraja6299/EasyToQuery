({
    doInit : function(component, helper) {
        var Records = component.get('v.Records');
        var FieldName = component.get('v.fieldName');
        var outputText = component.find("outputTextId");
        var lookupName;
        console.log('Records--->' + JSON.stringify(Records));
        console.log('FieldName--->' + FieldName);
        
        
            for(var key in Records){
                var upper = key.toUpperCase();
                // check if it already wasn't uppercase
                if( upper !== key ){ 
                    Records[ upper ] = Records[key];
                    delete Records[key];
                }
            }
        console.log('Records--->' + JSON.stringify(Records));
        FieldName = FieldName.toUpperCase();
        var fieldsValue = Records[FieldName];
        if(fieldsValue == true){
            fieldsValue = 'true';
        }
        if(fieldsValue == false){
            fieldsValue = 'false';
        }
        console.log('fieldsValue--->' + fieldsValue);
        if(fieldsValue != undefined){
        if(fieldsValue.toString().includes('0000')){
            
            var action = component.get("c.getObjectName_Apex");
            action.setParams({ recordId : fieldsValue.toString() });
            action.setCallback(this, function(response) {
                var state = response.getState();
                console.log('state--->' + state);
                if (state === "SUCCESS") {
                   // console.log("From server: " + JSON.stringify(response.getReturnValue()));
                    var storedResponse = response.getReturnValue();
                    if( storedResponse != null){
                        lookupName = storedResponse[0].Name;
                        var localhost = window.location.hostname + '/lightning/r/' + component.get("v.objectName") + '/' + storedResponse[0].Id + '/view/';
                       	console.log('lookupName--->' + localhost);
                        component.set("v.lookupName",lookupName); 
                        component.set("v.baseUrl",localhost);
                        component.set("v.lookupId", storedResponse[0].Name)
                        outputText.set("v.lookupId",storedResponse[0].ID);
                        component.set("v.isLookup",true);
                    }
                }
                else if (state === "INCOMPLETE") {
                }
                else if (state === "ERROR") {
                    var errors = response.getError();
                    if (errors) {
                        if (errors[0] && errors[0].message) {
                            console.log("Error message: " + 
                                     errors[0].message);
                        }
                    } else {
                        console.log("Unknown error");
                    }
                }
            });
            $A.enqueueAction(action);

        }else{
            component.set("v.isLookup",false);
            outputText.set("v.value",fieldsValue);
        }
        } else{
            
        }                   
    }
})
