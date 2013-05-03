//common javascript, which can be useful for all portlets

// used to set for all checkboxes checked property to blnChecked
function checkAllCheckboxes(blnChecked)
{
	var x = document.getElementsByTagName('input');
	for(i=0;i<x.length;i++){
		if(x[i].type=='checkbox'){
			x[i].checked = blnChecked;
		}
	}
}

// used to determine if at least one check box is checked
function anyChecked() {
    var x = document.getElementsByTagName('input');
    for (i = 0; i < x.length; i++) {
        if (x[i].type == 'checkbox' && x[i].checked) {
            return true;
        }
    }
    return false;
}

// used to set for all checkboxes which name contains txtNamePart
//checked property to blnChecked
function checkAllCheckboxesWithName(blnChecked, txtNamePart)
{
	var x = document.getElementsByTagName('input');
	//for safety
	if(txtNamePart==null){
		txtNamePart = "";
	}
	for(i=0;i<x.length;i++){
		if(x[i].type=='checkbox' && x[i].name.indexOf(txtNamePart)>=0){
			x[i].checked = blnChecked;
		}
		if(x[i].type=='radio' && x[i].name.indexOf(txtNamePart)>=0){
			x[i].checked = blnChecked;
		}
	}
}

// used to determine if at least one check box is checked 
//which name contains txtNamePart
function anyCheckedWithName(txtNamePart) {
    var x = document.getElementsByTagName('input');
    //for safety
    if (txtNamePart == null) {
        txtNamePart = "";
    }
    for (i = 0; i < x.length; i++) {
        if (x[i].type == 'checkbox' && x[i].name.indexOf(txtNamePart) >= 0 && x[i].checked) {
            return true;
        }
        if (x[i].type == 'radio' && x[i].name.indexOf(txtNamePart) >= 0 && x[i].checked) {
            return true;
        }
    }
    return false;
}

// used to set for all checkboxes which id contains txtIdPart
//checked property to blnChecked
function checkAllCheckboxesWithID(blnChecked, txtIdPart)
{
	var x = document.getElementsByTagName('input');
	//for safety
	if(txtIdPart==null){
		txtIdPart = "";
	}
	for(i=0;i<x.length;i++){
		if(x[i].type=='checkbox' && x[i].id!=null && x[i].id.indexOf(txtIdPart)>=0){
			x[i].checked = blnChecked;
		}
		if(x[i].type=='radio' && x[i].id!=null && x[i].id.indexOf(txtIdPart)>=0){
			x[i].checked = blnChecked;
		}
	}
}

// used to determine if at least one check box is checked 
//which id contains txtIdPart
function anyCheckedWithID(txtIdPart) {
    var x = document.getElementsByTagName('input');
    //for safety
    if (txtIdPart == null) {
        txtIdPart = "";
    }
    for (i = 0; i < x.length; i++) {
        if (x[i].type == 'checkbox' && x[i].id != null && x[i].id.indexOf(txtIdPart) >= 0 && x[i].checked) {
            return true;
        }
        if (x[i].type == 'radio' && x[i].id != null && x[i].id.indexOf(txtIdPart) >= 0 && x[i].checked) {
            return true;
        }
    }
    return false;
}

// used to set for all control for tag txtTagName which name contains txtNamePart
//visibility
function setControlsVisibilityWithNames(blnVisible, txtTagName, txtNamePart1, txtNamePart2)
{
	var x = document.getElementsByTagName(txtTagName);
	//for safety
	if(txtNamePart1==null){
		txtNamePart1 = "";
	}
	if(txtNamePart2==null){
		txtNamePart2 = "";
	}	
	for(i=0;i<x.length;i++){
		if(x[i].id.indexOf(txtNamePart1)>=0 && x[i].id.indexOf(txtNamePart2)>=0 && x[i].getAttribute('Type') != 'checkbox'){
			x[i].style.display = (blnVisible) ? 'block' : 'none';
			x[i].style.visibility = (blnVisible) ? 'visible' : 'hidden';
		}
	}
}

// used to set for all control for tag txtTagName which name contains txtNamePart
//visibility
function setControlsVisibilityWithName(blnVisible, txtTagName, txtNamePart)
{
	setControlsVisibilityWithNames(blnVisible, txtTagName, txtNamePart, "")
}

// used to set visibility for all controls in the same data grid row as objControl
// for tag txtTagName which name contains txtNamePart;
//Use Ex: if datagrid contains checkboxes and input; and we need to set input visibility based
// on checkbox status in the row
function setControlsVisibilityInTheSameRow(objControl, blnVisible, txtTagName, txtNamePart)
{
	// ids in datagrid consists of several section divided by '_';
	var str = objControl.id;
	if(!str){
		return;
	}
	var index = objControl.id.lastIndexOf('_');
	// get substring including _
	str = str.substr(0,index+1);
	setControlsVisibilityWithNames(blnVisible, txtTagName, str, txtNamePart);
}

// used to set visibility for all controls in the same data grid row as objControl
// for tag txtTagName;
//Use Ex: if datagrid contains checkboxes and input; and we need to set input visibility based
// on checkbox status in the row
function setControlsVisibilityInTheSameRow(objControl, blnVisible, txtTagName)
{
	// ids in datagrid consists of several section divided by '_';
	var str = objControl.id;
	if(!str){
		return;
	}
	var index = objControl.id.lastIndexOf('_');
	// get substring including _
	str = str.substr(0,index+1);
	setControlsVisibilityWithName(blnVisible, txtTagName, str);
}

// check value of obj to be correct AD object name, if not - 
// shows message and put focus on obj
function checkADObjectName(obj, errMsg)
{
//must be the same as CPConstants.AD_NAME_VALIDATION_EXPR
    var re = /[<>]+/;
	if (obj.value.match(re)) {
		alert(errMsg);
		obj.select();
		obj.focus();
		return false;
	}
	else
	{
		return true;
	}
}
/* used to move up/down selected items in listbox
objList - listbox
dir - direction 1=up, -1=down;
errNothingSelected - if passed and nothing is selected this message will be shown as alert
*/
function moveSelectedInList(objList, dir, errNothingSelected) {
   dir = (dir>0)? 1: -1;
   if ( objList.length == -1) {  // If the list is empty
      return;
   } 
   else {
		var arrSelected = new Array();
		var arrSelectedIndex = 0;
		// get all selected vals
		for(var i=0; i<objList.options.length;i++){
			opt = objList.options[i];
			if(opt.selected){
				arrSelected[arrSelectedIndex] = i;
				arrSelectedIndex++;
			}
		}
		// move all selected vals
		var selected = null;
		// if direction is to move down - rearrange order
		if(dir<0){
			arrSelected.reverse();
		}
		// if nothing selected and error message is passed - show it
		if(arrSelected.length == 0 && errNothingSelected!=null && errNothingSelected!=""){
			alert(errNothingSelected);
			return;
		}
		for(var i=0; i<arrSelected.length;i++){
			selected = arrSelected[i];
			if ( objList.length == 0 ) {  // If there's only one in the list
				// do nothing
			} 
			else {  // There's more than one in the list, rearrange the list order
				if ( (selected == objList.length-1) && (dir==-1) ) {
					//The last entry in the list cannot be moved down. - do nothing
				} 
				else if((selected == 0) && (dir==1)) {
					//The first entry in the list cannot be moved up. - do nothing
				}
				else {
					// Get the text/value of the one directly below the hightlighted entry as
					// well as the highlighted entry; then flip them
					var moveText1 = objList[selected-dir].text;
					var moveText2 = objList[selected].text;
					var moveValue1 = objList[selected-dir].value;
					var moveValue2 = objList[selected].value;
					objList[selected].text = moveText1;
					objList[selected].value = moveValue1;
					objList[selected-dir].text = moveText2;
					objList[selected-dir].value = moveValue2;
					objList.options[selected].selected = false;
					objList.options[selected-dir].selected = true; // Select the one that was selected before
				}  // Ends the check for selecting one which can be moved
			}  // Ends the check for there being something selected
		} // end move all elements
	} 
}

/* add an item to listbox
 objList - listbox; itemText - item text; itemValue - item value; selected - id item should be selected
*/ 
function addLBItem(objList,itemText, itemValue, selected) {
	if(objList!=null && objList.options!=null){
		var optionObject = new Option(itemText, itemValue, false, selected)
		var optionRank = objList.options.length
		objList.options[optionRank]=optionObject
    }
}
/* delete an item from listbox
objList - listbox; itemIndex - item index
*/
function deleteLBItem(objList,itemIndex) {
	if(objList!=null && objList.options!=null){
		if (objList.options.length!=0 && objList.options.length > itemIndex) { 
			objList.options[itemIndex]=null 
		}
    }
}
/*select all items in given listbox
*/
function SelectAllLBItems(objForm, objListName)
{
	if(objForm[objListName]!=null && objForm[objListName].options!=null){
		var intCount = objForm[objListName].options.length;
		for (i = 0; i < intCount; i++)
			objForm[objListName].options[i].selected = true;
	}
}
/* find all listboxes with id prefix as listboxesPrefix
and move selected items from them to objToList listbox
*/
function moveSelItemsFromListboxes(objToList, listboxesPrefix){
	//for safety check params
	if(listboxesPrefix==null){
		listboxesPrefix = "";
	}
	
	if(objToList==null){
		return;
	}
	var toName = objToList.name;
	
	var x = document.getElementsByTagName('select');
	// loop thru all listboxes
	for(i=0;i<x.length;i++){
		if(x[i].id!=null && x[i].id!=objToList.id && x[i].id.indexOf(listboxesPrefix)>=0 && x[i].options!=null){
			// loop thru all listbox items
			for(var j=0; j<x[i].options.length;j++){
				opt = x[i].options[j];
				if(opt.selected){
					// copy selected and delete from parent listbox
					addLBItem(objToList, opt.text, opt.value, false);
					deleteLBItem(x[i],j);
					j--;
				}
			}
		}
	}
}
/* find element with given id and change it's class to given class
*/
function ChangeElementClass(id, ClassName){
	var o = document.getElementById(id);
	if(typeof(o)!='undefined'){
		o.className=ClassName;
	}
	return true;
}
/* replace in id1 string idpart2search to string idpart2replace 
find element by that new id and change it's class to given class
*/
function SearchNChangeElementClass(id1, idpart2search, idpart2replace, className){
	if(id1==null || idpart2search==null || idpart2replace==null)
		return false;

	var id=id1;
	id = id.replace(idpart2search, idpart2replace);
	
	ChangeElementClass(id, className);
	
	return true;
}

/*If set to zero is true, we find the input box that resembles the
value passed as inpID and set it's value to zero
*/
function setTextBoxToZero(SetToZero, inpID) {
    var x = document.getElementsByTagName('input');
    if (SetToZero) {
        for (i = 0; i < x.length; i++) {
            if (x[i].id.indexOf('MIN' + inpID) >= 0) {
                x[i].value = '0';
                x[i].readOnly = 'readOnly'
                return;
            }
        }
    }
    else {
        for (i = 0; i < x.length; i++) {
            if (x[i].id.indexOf('MIN' + inpID) >= 0) {
                x[i].value = '0';
                x[i].readOnly = ''
                return;
            }
        }

    }

}

/*If ReadOnly is true, we find the input box that resembles the
value passed as inpID and set it's value to zero and make it readOnly.
Otherwise we set it to the value passed in and make it editable
*/
function setTextBoxAttendance(ReadOnly, inpID, amt) {
    var x = document.getElementsByTagName('input');
    for (i = 0; i < x.length; i++) {
        if (x[i].id.indexOf('MIN' + inpID) >= 0) {
            if (ReadOnly) {
                x[i].value = "0";
                x[i].readOnly = 'readOnly'
            }
            else {
                x[i].value = amt;
                x[i].readOnly = ''
            }
            return;
        }
    }
}

function doVis(ele, state){
	ele = document.getElementById(ele);
	if(ele != null){
		switch(state){
			case 0:
				ele.style.display = "none";
				break;
			case 1:
				ele.style.display = "block";
				break;
		}
	}
}

String.format = function()
{
	if( arguments.length == 0 ){
		return null;
	}
		
	var str = arguments[0];
	for(var n = 1; n < arguments.length; n++)
	{
		var re = new RegExp('\\{' + (n - 1) + '\\}','gm');
		str = str.replace(re, arguments[n]);
	}
	return str;
}

function doVis(ele, state){
	ele = document.getElementById(ele);
	if(ele != null){
		switch(state){
			case 0:
				ele.style.display = "none";
				break;
			case 1:
				ele.style.display = "block";
				break;
		}
	}
}
