// an int that can be used to generate a uniqueId
var unqId=0;
var keepThisCalendarOpen;
var cbCount = 0;
var inpReloadName = '';
function newId(){return 'unq'+(++unqId);}
function curId(){return 'unq'+(unqId);}
function nextElement(o){
	var x=o;
	while(x=x.nextSibling)
		if(x.nodeType==1)
			return x;
	return null;
}

function doLoad() {
	if(document.getElementById){
		var un=document.getElementById('userName');
		if(un)
			un.focus();
		initSideBar();
		initToolbars();
		initSecTable();
		initPrincipalSelector();
		initMoveCopyDelete();
		initGridCheckAll();
		//initFormDoublePostPrevention();
	}
	document.onclick=function(){
		var x=this.getElementsByTagName('iframe');
		for(var i=0;i<x.length;i++)
			if(x[i].parentNode.className=='date'&&x[i]!=keepThisCalendarOpen)
				x[i].style.visibility='hidden';
		keepThisCalendarOpen=null;
	}
	document.resize=function(){
		initPrincipalSelector();
	}
//	document.getElementById('MAINFORM').action=document.location.href;
}
function initFormDoublePostPrevention(){
	var validationOK = true;
	
	for(var i=0;i<document.forms.length;i++){
		document.forms[i].onsubmit2=document.forms[i].onsubmit;
		document.forms[i].onsubmit=function(){
			if (window.ValidatorCommonOnSubmit) validationOK = ValidatorCommonOnSubmit();
			if (validationOK)
			{
				if(this.hasBeenSubmitted) return false;
				this.hasBeenSubmitted=true;
				if(this.onsubmit2) return this.onsubmit2();
				return true;
			}
			else
				return false;
		}
	}	
}
function initPrincipalSelector(){
	var navRoot = document.getElementsByTagName('ul');
	for( var z=0;z<navRoot.length;z++){
		if(navRoot[z].className.indexOf('root')>-1){
			var lis=navRoot[z].getElementsByTagName('li');
			for(i=0; i<lis.length; i++){
				if(lis[i].getElementsByTagName('ul').length>0){
					var tog=document.createElement('a');
					tog.onclick=function() {
						if(this.parentNode.className=='hasKids open')
							this.parentNode.className='hasKids closed';
						else
							this.parentNode.className='hasKids open';
					}
					tog.className='tog';
					lis[i].insertBefore(tog,lis[i].firstChild);
					if(lis[i].getElementsByTagName('strong').length==0)
						lis[i].className='hasKids closed';
					else
						lis[i].className='hasKids open';
				}
			}
		}
	}
}
function initSideBar(){
	var ql=document.getElementById('quickLinks');
	if(ql){
		var dd=ql.getElementsByTagName('dl');
		for(var i=0;i<dd.length;i++)
			dd[i].className='closed';
		var dt=ql.getElementsByTagName('dt');
		for(var i=0;i<dt.length;i++){
			dt[i].onclick=function () {
				this.parentNode.className=this.parentNode.className=='open'?'closed':'open';
			}
		}
	}
}
function initToolbars(){
	var navRoot = document.getElementsByTagName('ul');
	for( var z=0;z<navRoot.length;z++){
		if(navRoot[z].className.indexOf('menu')>-1){
			var lis=navRoot[z].getElementsByTagName('li');
			for(i=0; i<lis.length; i++){
				if(lis[i].getElementsByTagName('ul').length>0){
					lis[i].onmouseover=function() {
						this.getElementsByTagName('a')[0].className='hasKids active';
						var x=this.getElementsByTagName('ul');
						if(x.length>0){
							x[0].style.display='block';
							this.className='open';
						}
					}
					lis[i].onmouseout=function() {
						this.getElementsByTagName('a')[0].className='hasKids';
						var x=this.getElementsByTagName('ul');
						for(var i=0;i<x.length;i++)
							x[i].style.display='none';
						this.className='';
					}
					var a=lis[i].getElementsByTagName('a')[0];
					a.onclick=function(){
						return false;
					}
					a.className='hasKids';
				}
			}
		}
	}
	var navRoot = document.getElementsByTagName('div');
	for( var z=0;z<navRoot.length;z++){
		if(navRoot[z].className=='pTool'&&navRoot[z].getElementsByTagName('ul').length>0){
			navRoot[z].onmouseover=function() {
				this.getElementsByTagName('a')[0].className='hasKids active';
				this.getElementsByTagName('ul')[0].style.visibility='visible';
				if(toggleHtmlSelectElements)toggleHtmlSelectElements('hidden');
			}
			navRoot[z].onmouseout=function() {
				this.getElementsByTagName('a')[0].className='hasKids';
				this.getElementsByTagName('ul')[0].style.visibility='hidden';
				if(toggleHtmlSelectElements)toggleHtmlSelectElements('visible');
			}
		}
	}
}
function initSecTable(){
	var r=document.getElementsByTagName('table');
	for(var i=0;i<r.length;i++){
		if(r[i].className=='secTable'){
			var rows=r[i].getElementsByTagName('tbody')[0].getElementsByTagName('tr');
			for(var x=0;x<rows.length;x++){
				var check=rows[x].getElementsByTagName('input')[0];
				if(check.parentNode.className=='admin'){
					check.onclick=function(){
						var cb=this.parentNode.parentNode.getElementsByTagName('input');
						for(var z=1;z<cb.length;z++){
							if(this.checked){
								cb[z].wasChecked=cb[z].checked;
								cb[z].checked=true;
								cb[z].disabled=true;
							}
							else{
								cb[z].checked=cb[z].wasChecked;
								cb[z].disabled=false;
							}							
						}
					}
				}
			}
		}
	}
}
function initMoveCopyDelete(){
	var s=document.getElementsByTagName('select');
	for(var i=0;i<s.length;i++){
		if(s[i].className=='mcdAction'){
			s[i].onchange=function(){
				var spans=this.parentNode.getElementsByTagName('span');
				if(this.value=='d' || this.value=='s'){
					spans[1].style.display='none';
					spans[2].style.display='inline';
				}
				else{
					spans[1].style.display='inline';
					spans[2].style.display='none';
				}
			}
		}
	}
}
function initGridCheckAll(){
	var t=document.getElementsByTagName('thead');
	for(var i=0;i<t.length;i++){
		var c=t[i].getElementsByTagName('input');
		for(var x=0;x<c.length;x++){
			if((c[x].type=='checkbox')&&(!c[x].onclick)){
				c[x].onclick=function(){
					var t=this;
					while(t=t.parentNode)
						if(t.tagName=='TABLE')
							break;
					var c=t.getElementsByTagName('input')
					for(var z=0;z<c.length;z++){
						if(c[z]!=this&&c[z].type=='checkbox'){
							c[z].checked=this.checked;
						}
					}					
				}
			}
		}
	}
}


// START Header Expand Collapse Code
function sectTog(o){
 if(o.alt=='-')
   shrink(o);
 else
   grow(o);
 return false;
}
function grow(o){
  o.alt='-';
  o.title = o.hideText;
  o.src=o.src.replace('expand.gif','collapse.gif');
  var x=o.parentNode.parentNode;
  var s=x;
  while(s=s.nextSibling){
    if(s.tagName&&s.tagName==x.tagName)
		return;
    if(s.style)
		s.style.display='';
  }  
}
function shrink(o){
  o.alt='+';
  o.title = o.showText;
  o.src=o.src.replace('collapse.gif','expand.gif');
  var x=o.parentNode.parentNode;
  var s=x;
  while(s=s.nextSibling){
    if(s.tagName&&s.tagName==x.tagName)
		return;
    if(s.style)
		s.style.display='none';
  }  
}
// END Header Expand/Collapse Code



// START Multi File Upload Control
function multiFileToggleAll(o) {
	var x = o.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('input');
	for( i = 1 ; i < x.length ; i++ )
		x[i].checked = o.checked;
}
function multiFileToggleOne(o) {
	var x = o.parentNode.parentNode.parentNode.parentNode.getElementsByTagName('input');
	x[0].checked = true;
	for( i = 1 ; i < x.length ; i++ )
		x[0].checked = x[0].checked & x[i].checked;
}
// END Multi File Upload Control

// START Calendar General JS
function cal(o) {
    var parent = o;
    while (parent.offsetParent != null) parent = parent.offsetParent;

    if (o.nextSibling.offsetWidth > (parent.offsetWidth - o.nextSibling.offsetLeft))
	{
		o.nextSibling.style.top = o.nextSibling.offsetTop + o.offsetHeight + "px";
		o.nextSibling.style.left = parent.offsetWidth - o.nextSibling.offsetWidth + "px";
	}
	//o.nextSibling.style.display='block';
	//o.nextSibling.style.visibility='visible';
	//if((o.nextSibling.style.display=o.nextSibling.style.display=='block'?'none':'block')=='block')
	if((o.nextSibling.style.visibility=o.nextSibling.style.visibility=='visible'?'hidden':'visible')=='visible')
	{
		//alert(o.nextSibling.innerHTML);
		//window.frames[o.nextSibling.name].show_calendar(o.previousSibling);
		o.nextSibling.contentWindow.show_calendar(o.previousSibling);
	}
	keepThisCalendarOpen=o.nextSibling;
}
// END Calendar General JS

// START GroupedDataGrid JS
function gridTog(o) {
	var x = o.parentNode.parentNode.parentNode.parentNode.parentNode;
	while( x=x.nextSibling  ){
		if( x.className == 'gfoot' || x.className == 'ghead' ){
			break;
		}
		if(x.style.display=='none') {
		    o.src = gridToggleImagePath + 'collapse.gif';
			x.style.display='';
			o.alt = o.HideText;
		}
		else {
		    o.src = gridToggleImagePath + 'expand.gif';
			x.style.display='none';
			o.alt = o.ShowText;
		}
	}
}
function gg_ExpCol(o){
	var row=nextElement(o.parentNode.parentNode);
	if(row&&row.className.indexOf('subItem')>-1){
		row.style.display=row.style.display=='none'?'':'none';
		if(o.src){
			o.src=row.style.display=='none'?'ui/common/images/plus.gif':'ui/common/images/minus.gif';
		}
	}
}

//Triggers the collapse column event for all Collapsable
//anchor tags in a parent element
function Collapse(tblName,endsWith)
{
	var tbl = document.getElementById(tblName);
	if(tbl != null){
		var anchors = tbl.getElementsByTagName('a');
	
		for(var i = 0 ; i < anchors.length ; i++ )
		{
			var strID = new String(anchors[i].id);
			if(strID.indexOf(endsWith,0) > -1)
			{
				gg_ExpCol(anchors[i]);
			}
		}
	}
}

// END GroupedDatGrid JS

// START DisplayIndicator (DateRangeEdit)
function hideEnd(o) {
	var x = o.parentNode.parentNode.parentNode.nextSibling;
	var ctl = x.getElementsByTagName('input');
	if( o.checked )
		ctl[0].checked = true;
	for( i = 0 ; i < ctl.length ; i++ )
		ctl[i].disabled = o.checked;
    ctl = x.getElementsByTagName('img');
    for (i = 0; i < ctl.length; i++)
        ctl[i].disabled = o.checked;
    ctl = x.getElementsByTagName('select');
	for( i = 0 ; i < ctl.length ; i++ )
	    ctl[i].disabled = o.checked;
}
function hideEndX(o) {
	var ctl = document.getElementsByName(o.name);
	for (i = 0; i < ctl.length; i++)
	    if (ctl[i].id.indexOf("Later") > 0) 
	    {
	        hideEnd(ctl[i]);
	        return;
	    }
}
function hideStart(o) {
	if(o.value=='endNow'){
		var x = o.parentNode.parentNode.parentNode.previousSibling;
		var ctl = o.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('input');
		for( i = 0 ; i < ctl.length ; i++ )
			ctl[i].disabled = o.checked;
        ctl = o.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('img');
        for (i = 0; i < ctl.length; i++)
            ctl[i].disabled = o.checked;
        ctl = o.parentNode.parentNode.parentNode.previousSibling.getElementsByTagName('select');
		for( i = 0 ; i < ctl.length ; i++ )
			ctl[i].disabled = o.checked;
	}
}
function hideStartX(o) {
	var ctl = document.getElementsByName(o.name);
	hideStart(ctl[1]);
}

function showSelAct(selActGroup, selActClass) {
    //Show the selection Action with the given cssClass
    //Hide all other selectionAction based on Group

    $("." + selActGroup).hide();
    $("." + selActClass).show();
}

// END DisplayIndicator (DateRangeEdit)


// START TabbedPanel
function removeTextNodes(nodeList) {
	var r = [];
	for( i = 0 ; i < nodeList.length ; i++ )
		if( nodeList[i].nodeType != 3 )
			r[r.length] = nodeList[i];
	return r;
}
function tabClick(o,i) {
	var c = removeTextNodes(o.parentNode.parentNode.parentNode.childNodes);
	c[0].value=i-1;
	for( x = 2 ; x < c.length ; x++ )
	{
		c[x].style.display = x-1 == i ? 'block' : 'none';
		}
	c = removeTextNodes(c[1].childNodes);
	for( x = 0 ; x < c.length ; x++ )
	{
		c[x].className = '';	
	}
	o.parentNode.className = 'selected';
}
// END TabbedPanel


// START CollapsiblePanel
function cp_toggle(o){
	var c=o.parentNode.nextSibling;
	if(c.style.display=='block'){
		//o.className='expand';
		o.title = o.ExpandText;
		//o.innerHTML='+';
		o.src = cpToggleImagePath + 'expand.gif';
		c.style.display='none';
	}
	else{
		//o.className='collapse';
		o.title = o.CollapseText;
		//o.innerHTML='-';
		o.src = cpToggleImagePath + 'collapse.gif';
		c.style.display='block';
	}
	return false;
}
// END CollapsiblePanel

// START CollapsibleText
function ct_toggle(o) {
    var t = o.parentNode.childNodes[0];
    var c = o.parentNode.childNodes[1];
    if (c.style.display == 'inline') {
        o.title = o.ExpandText;
        o.src = cpToggleImagePath + 'expand.gif';
        c.style.display = 'none';
        t.style.display = 'inline';
   }
    else {
        o.title = o.CollapseText;
        o.src = cpToggleImagePath + 'collapse.gif';
        c.style.display = 'inline';
        t.style.display = 'none';
    }
    return false;
}
// END CollapsibleText

function doCheck(o,v){
	var x=o.getElementsByTagName('input');
	for(var i=0;i<x.length;i++)
		if(x[i].type=='checkbox')
			x[i].checked=v;
}

// START Security Grid
function secTog(o){
	var d='block';
	var e=o.parentNode;
	if(o.src.indexOf('close')>-1){
		o.src=o.src.replace('close','open');
		d='none';
	}
	else{
		o.src=o.src.replace('open','close');
	}
	while(e=e.nextSibling)
		e.style.display=d;
}
// END Security Grid

function checkNumeric(obj, errMsg)
{
	var numberfield = obj;
	if (isNaN(obj.value))
	{
		alert(errMsg);
		numberfield.select();
		numberfield.focus();
		return false;
	}
	else
	{
		return true;
	}
}

function UpdateCheckBoxCount(cBox) {
	if (cBox.checked == true) 
	{
		cbCount++; 
	}
	else 
	{
		cbCount--;
	}
}

    function limitText (textObj, maxCharacters){
        if(textObj.value.length<maxCharacters){
            textObj.pref=textObj.value
        }else{
            textObj.value= new String(textObj.value).substr(0,maxCharacters);
        }
    }
function validateMCDClick(o,id){
	if(o.parentNode.getElementsByTagName('select')[0].value=='d'){
		var gg=document.getElementById(id);
		if(gg){
			var c=gg.getElementsByTagName('input');
			for(var i=0;i<c.length;i++){
				if(c[i].type=='checkbox'&&c[i].checked){
					if(confirm('Are you sure you want to delete the selected items?'))
						return true;
					return false;
				}				
			}
		}
	}
	return true;
}

function orderListBox (listBoxId, direction)
{
	var listBox = document.getElementById(listBoxId);
	if ((listBox != null) && (listBox.selectedIndex >= 0))
	{
		var newIndex = listBox.selectedIndex + direction;
		if ((newIndex >= 0) && (newIndex < listBox.options.length))
		{
			//Swap the two items within the select box.
			var tempText = listBox.options[newIndex].text;
			var tempValue = listBox.options[newIndex].value;
			listBox.options[newIndex].text = listBox.options[listBox.selectedIndex].text;
			listBox.options[newIndex].value = listBox.options[listBox.selectedIndex].value;
			listBox.options[listBox.selectedIndex].text = tempText;
			listBox.options[listBox.selectedIndex].value = tempValue;
			
			//Swap the two items in the hidden postback variables.
			orderListBoxSetHidden(listBox, listBox.selectedIndex);
			orderListBoxSetHidden(listBox, newIndex);
			
			//Make sure the selected index remains on the same item.
			listBox.selectedIndex = newIndex;
		}
	}
}

function orderListBoxSetHidden (listBox, index)
{
	document.getElementById(listBox.id + '_text' + index).value = listBox.options[index].text;
	document.getElementById(listBox.id + '_value' + index).value = listBox.options[index].value;
}

function PrincipalSelectorCheckboxSwitch(everyoneBox,containerID)
{
	var table = document.getElementById(containerID);
	var checkboxes = table.getElementsByTagName('input');
	var guesttablecell = GetGuestTableCell(table); 
	var guestcheckbox = null;
	if (guesttablecell != null)
		guestcheckbox = guesttablecell.childNodes[0];
	
	for(var i=0;i<checkboxes.length;i++){
		if(checkboxes[i].type=='checkbox'
		  && checkboxes[i].id != everyoneBox.id)
		{
		    if(guestcheckbox == null || (guestcheckbox != null && checkboxes[i].id   != guestcheckbox.id))
		    {
		        checkboxes[i].checked = everyoneBox.checked
				checkboxes[i].disabled = everyoneBox.checked;
		    }
		}				
	}
}

function GetGuestTableCell(table)
{
	//handles more then more Principal selector on a page
    var items = table.getElementsByTagName('td');
    for(var i=0; i<items.length; i++)
    {
        if(items[i].id == 'GuestUserCell')
            return items[i];
    }
    return null;
}

function CheckLength(id, maxCharacters, forcontrol)
{
	var editor1 = document.getElementById(id);
	var content = editor1.getHTML();		
	if(content.length < maxCharacters){
        return true;
    }
    else{
		alert("You have exceeded the limit of " + maxCharacters + " characters for the " + forcontrol);
        return false;
    }
}

function CheckLengthGeneric(id, maxCharacters, forcontrol)
{
	var ctr = document.getElementById(id);
	if(ctr.value.length < maxCharacters){
        return true;
    }
    else{
		alert("You have exceeded the limit of " + maxCharacters + " characters for the " + forcontrol);
        return false;
    }
}

function ValidateLoginUserName()
 { 
    var userName = document.getElementById('userName').value;   
    if (userName == ''|| userName == "guest") 
    { 
        alert('Please enter your User Name.'); 
        return false;
    }     
    return true; 
}

var ValidateDynamicRegEx_control = null;
var ValidateDynamicRegEx_savedText = null;

//This method saves the previous value of the text box, to be retrieved if a bad key is pressed later.
function ValidateDynamicRegEx_Save (control)
{
	ValidateDynamicRegEx_control = control.id;
	ValidateDynamicRegEx_savedText = control.value;
}

//This method dynamically checks a RegEx against a control value, and corrects it and/or displays an alert message.
function ValidateDynamicRegEx (control, regEx, autoCorrect, message)
{
	//If the control's text matches the RegEx, then just exit the method.
	if ( (control.value.length == 0) || (control.value.match(regEx)) )
		return;

	//If requested, do a dynamic correction on the text in the control.
	if (autoCorrect)
	{
		//Reload the text that was there before the key was pressed.
		var text = (ValidateDynamicRegEx_control == control.id) ? ValidateDynamicRegEx_savedText : control.value;

		//Correct the text if necessary.
		while ((text.length > 0) && (!text.match(regEx)))
			text = text.substr(0, text.length - 1);

		control.value = text;
	}

	//If a message was passed in, then display it now.
	if (message != null)
		alert(message);
}

function ValidateEmptyText(ctrId, msg, supposeToBeEmpty)
{
    var ctr = document.getElementById(ctrId);
    
    if(
        (supposeToBeEmpty && (ctr == null || ctr.value.length > 0 || ctr.value.match(/[^\s]/)) ) 
        ||
        (!supposeToBeEmpty && (ctr == null || ctr.value.length < 1 || !ctr.value.match(/[^\s]/)))
     )
    {
            alert(msg);
            return false;
    }
    else
       return true;    

}

function ToggleEmulationBtn(emulateDDL,emulateBTN)
{
    var ddl = document.getElementById(emulateDDL);
    var btn = document.getElementById(emulateBTN);
    if(ddl != null && btn != null)
    {
        btn.style.visibility = (ddl.selectedIndex > 0) ? "visible" : "hidden";
    }
}

function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
        window.onload = function() {
            if (oldonload) {
                oldonload();
            }
            func();
        }
    }
}

function UpdateEditorTextArea(txtEditor) {
    //used with cute soft editor to sync content during asyncpostback
    var ed = document.getElementById(txtEditor);
    ed.setHTML(ed.getHTML());
}

function PopulateTextBoxEditor(editorId, text, onCompleteAction) {
    if (editorId == null) {
        alert('editorId field required in PopulateTextBox call.');
        return;
    }

    var editor = document.getElementById(editorId);

    if (editor == null) {
        alert('For PopulateTextBox call, unable to find TextBoxEditor with ID: ' + editorId);
        return;
    };

    if (typeof(editor.setHTML) == "function") {
        if (text == null || text == '') text = ' ';
        editor.setHTML(text);

        if (onCompleteAction != null) onCompleteAction();
    }
    else {
        window.setTimeout(
            'PopulateTextBoxEditor(' + CreateStringParameter(editorId) + ', ' + CreateStringParameter(text) + ', ' + onCompleteAction + ')',
            200);
    }
}

function CreateStringParameter(text) {
    if (text == null) {
        return 'null';
    }
    else {
        return '\'' + text.replace(/'/g, "\\'").replace(/\n/g, "\\n").replace(/\r/g, "\\r") + '\'';
    }
}

function ResetEleVal(ele, val) {
    $('#' + ele).val(val);
}
function ResetEleChecked(ele, isChecked) {
    if (isChecked) {
        $("#" + ele).attr('checked', true);
    }
    else {
        $("#" + ele).removeAttr("checked");
    }
}
function EleRemoveClass(ele) {
    $("#" + ele).removeClass();
}
function ApplyStyleToEle(ele, style) {
    $("#" + ele).addClass(style);
}
function WriteMsgToEle(ele, msg) {
    $('#' + ele).text(msg);
}
function ResetTxtVal(ele, val) {
    $('#' + ele).text(val);
}
function ResetDatePicker(d, h, m, ampm) {
    $('#' + d).val("");
    $('#' + h).val("11");
    $('#' + m).val("55");
    $('#' + ampm).val("AM");
}
function ToggleDivDisabled(ele, state) {
    if (state) {
        $('#' + ele + ' :input').attr('disabled', true);
    }
    else {
        $('#' + ele + ' :input').removeAttr('disabled');
    }
}
function HideShowEle(ele, doShow) {
    if (doShow) {
        $('#' + ele).show();
    }
    else {
        $('#' + ele).hide();
    }
}
function ResetDatePickerPopulate(d, h, m, ampm, dVal, hVal, mVal, ampmVal) {
    $('#' + d).val(dVal);
    $('#' + h).val(hVal);
    $('#' + m).val(mVal);
    $('#' + ampm).val(ampmVal);
}