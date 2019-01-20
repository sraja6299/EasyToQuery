({
    doinit : function(c, e, h) {
        h.doinit_helper(c,e,h);		
    },
    handleChangeDualList: function (c,e,h) {
        var no_of_field =0;
        var selectedOptionValue = e.getParam("value");
        c.set("v.selectedFields", '');
        console.log('selectedOptionValue--->' + JSON.stringify(selectedOptionValue));
        if(!$A.util.isEmpty(selectedOptionValue) && selectedOptionValue != null){
            no_of_field = selectedOptionValue.length;
        }
        c.set("v.selectedFields", selectedOptionValue);
        /*if(no_of_field > 5){
             alert('Please select any five fields only.');
             return;
         }else{
             
         }*/
        var optionsDualList_js = c.get("v.optionsDualList");
        var selectedFieldNameList = [];
        if(!$A.util.isEmpty(optionsDualList_js) && optionsDualList_js != undefined && !$A.util.isEmpty(selectedOptionValue) && selectedOptionValue != undefined){
            for(var i=0;i<selectedOptionValue.length; i++){
                for(var j=0;j<optionsDualList_js.length; j++){
                    if(selectedOptionValue[i] == optionsDualList_js[j].value){
                        var optionsDualList_obj = {};
                        optionsDualList_obj.value = optionsDualList_js[j].value;
                        optionsDualList_obj.label = optionsDualList_js[j].label;
                        
                        selectedFieldNameList.push(optionsDualList_obj);
                    }
                }
            } 
            if(!$A.util.isEmpty(selectedFieldNameList) && selectedFieldNameList != undefined && selectedFieldNameList.lenght != 0){
                c.set("v.selectedFieldNameList",selectedFieldNameList);
            }
            console.log('selectedFieldNameList---->' + JSON.stringify(selectedFieldNameList));
        }
    },
    getRecords : function(c,e,h){ 
        var selectedfields = c.get("v.selectedFields");
        var FieldlabelListwrap = c.get("v.FieldlabelListwrap");
        var selectedLabel =[];
        var selectedLabelApi =[];
        if(!$A.util.isEmpty(selectedfields) && selectedfields != undefined && !$A.util.isEmpty(FieldlabelListwrap) && FieldlabelListwrap != undefined)
            for(var i=0;i<selectedfields.length;i++){
                for(var j=0; j<FieldlabelListwrap.length; j++){
                    if(selectedfields[i] == FieldlabelListwrap[j].fieldName){ 
                        selectedLabel.push(FieldlabelListwrap[j]);
                        selectedLabelApi.push(FieldlabelListwrap[j].fieldName);
                        c.set("v.isSerialNo",true);
                    }
                }
            }
        c.set("v.mycolumns",selectedLabel);
        c.set("v.selectedLabelApi",selectedLabelApi); 
        if(!$A.util.isEmpty(selectedfields) && selectedfields != undefined){
            h.getRecords_helper(c,e,h,selectedfields);
        }
        
    },
    onChangeObject : function(c,e,h){
        var selectedvalue = e.getSource().get("v.value"); 
        var objectNameList = c.get("v.objectNameList");
        var selectedvalueLabel;
        if(!$A.util.isEmpty(selectedvalue) && selectedvalue != undefined){
            for(var i=0;i<objectNameList.length; i++){
                if(selectedvalue == objectNameList[i].value){
                    selectedvalueLabel = objectNameList[i].label;
                }
            }
            c.set('v.ObjectLabel' , selectedvalueLabel);
            selectedvalueLabel = 'GET ' + selectedvalueLabel;
            c.set("v.getButtonLabel",selectedvalueLabel); 
            c.set("v.isSerialNo",false);
            h.getFieldName_helper(c,e,h,selectedvalue);
        }
        
    },
    handleSelectRecordMenu : function(c,e,h){
        var parcedValue = e.getParam("value").split(','); 
        var recordId = parcedValue[0];
        var label = parcedValue[1];
        var name = parcedValue[2];
        console.log('recordId--->' + recordId);
        console.log('label--->' + label);
        console.log('name--->' + name);  
        if(label === 'Edit') {
            h.editRecord_Helper(c, e, h, recordId,name);
        } else if(label === 'Delete') {
            h.deleteRecord_Helper(c, e, h, recordId);
        }
    },
    filterSearch: function(c, e, h) {
        var data = c.get("v.filteredData"),
            term = c.get("v.filter"),
            results = data, regex;
        console.log('data--->' + JSON.stringify(data));
        console.log('term--->' + term);
        var selectedFieldName = c.find("selectedFieldName");
        if(selectedFieldName != undefined)
            var fieldName  = selectedFieldName.get("v.value").toString().toUpperCase();
        console.log('fieldName--->' + fieldName);
        try {
            regex = new RegExp(term, "i");
            // filter checks each row, constructs new array where function returns true
            results = data.filter(row=>regex.test(row.NAME));
            console.log('results--->' + results);
        } catch(e) {
            // invalid regex, use full list
        }
        c.set("v.mydata", results);
    },
    listViewSelect : function(c,e,h){
        var selectedvalueaura = c.find("selectedFieldNamerecordView");
        var noofRecords;
        if(!$A.util.isEmpty(selectedvalueaura) && selectedvalueaura != undefined){
            noofRecords = selectedvalueaura.get("v.value");
        }
        
        if(!$A.util.isEmpty(noofRecords) && noofRecords != undefined){
            h.getselectedRecords(c,e,h,noofRecords);
        }
    },
    nextAndPreviousRowList : function(c,e,h){
        var selectedListView_ref = c.find("selectedFieldNamerecordView");
        var selectedListView = 0;
        var whichOne = e.getSource().getLocalId();
        if(selectedListView_ref != undefined){
            selectedListView = selectedListView_ref.get("v.value");
        }  
        if(selectedListView != undefined && !$A.util.isEmpty(selectedListView) && selectedListView > 0){
            if(whichOne == 'nextrowlistbutton'){
                h.nextRowList_helper(c,e,h,selectedListView);
            }else if(whichOne == 'previousrowlistbutton'){
                h.previousRowList_helper(c,e,h,selectedListView); 
            }     
        }        
    }, 
    createSingleRecords : function(c,e,h){
        var whichOne = e.currentTarget.id;
        console.log('whichOne--->' + whichOne);
        switch(whichOne){
            case "Account": 
                h.createSingleRecords_helper(c,e,h,"Account");
                break;
            case "Contact":
                h.createSingleRecords_helper(c,e,h,"Contact");
                break;
            case "Opportunities":
                h.createSingleRecords_helper(c,e,h,"Opportunities");
                break;
            case "Others":
                var objectNameList = c.get("v.objectNameList");
                //console.log('optionsDualList-->' + JSON.stringify(optionsDualList));
                var objectNameList_dup =[];
                if(objectNameList != undefined && !$A.util.isEmpty(objectNameList)){
                    for(var i=0;i<objectNameList.length; i++){
                        if(objectNameList[i].label != 'Account' && objectNameList[i].label != 'Contact' && objectNameList[i].label != 'Opportunities'){
                            objectNameList_dup.push(objectNameList[i]);
                        }
                    }
                }
                //console.log('objectNameList_dup-->' + JSON.stringify(objectNameList_dup));
                
                objectNameList_dup =  objectNameList_dup.sort(function(a, b) {
                    var nameA = a.label.toUpperCase(); // ignore upper and lowercase
                    var nameB = b.label.toUpperCase(); // ignore upper and lowercase
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }
                    
                    // names must be equal
                    return 0;
                });
                
                c.set("v.objectListCreate",objectNameList_dup);
                c.set("v.isCreateOtherObject",true);
                break;
            default:
                console.log('default');
        }
    },
    selectedObject_create : function(c,e,h){
        var selectedObjId = c.find("obects_created");
        var selectedObj;
        if(selectedObjId != undefined){
            selectedObj = selectedObjId.get("v.value");
        }
        if(selectedObj != undefined){
            h.createSingleRecords_helper(c,e,h,selectedObj);
        }
    },
    downloadCS : function(c,e,h){
        var mydata = c.get("v.mydata");
        if(mydata != undefined && !$A.util.isEmpty(mydata)){
            var csv = h.downloadCS_Helper(c,e,h,mydata);
            console.log('csv--->>>' + csv);
            var hiddenElement = document.createElement('a');
          hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
          hiddenElement.target = '_self'; // 
          hiddenElement.download = 'ExportData.csv';  // CSV file Name* you can change it.[only name not .csv] 
          document.body.appendChild(hiddenElement); // Required for FireFox browser
    	  hiddenElement.click(); // using click() js function to download csv file
        }
    }
    
})
