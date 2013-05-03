var xmlHttp; 
var requestURL = '/AJAX/AJAXserver.aspx?action=';
var nameArr = new Array();
var arrayIndex = 0;
var MAX_USERS_SHOWN = 100;
var sender = '';
var ctrlToUpdate = '';

// Future TODO: grab hostids when retrieving all users so that you don't need to keep going back to the server for it.

// General AJAX code

function processRequest(req)
{
	if (req.length > 0)
	{
		xmlHttp = GetXmlHttpObject(stateChangeHandler);
		xmlHttp.open('GET', req, true);
		xmlHttp.send(null);
	}
}

function isAJAXRequestProcessing()
{
	return (
			(xmlHttp != null) && 
			(xmlHttp.readyState != 4) &&
			(xmlHttp.readyState != 'complete')
			);
}

function stateChangeHandler() 
{ 
	if (xmlHttp.readyState == 4 || xmlHttp.readyState == 'complete')
	{
		switch(xmlHttp.status)
		{
			case 200:
				if (xmlHttp.responseXML.documentElement != null)
				{
					if (sender == 'TimecardApprovalSubmit')
					{
						/* do nothing */
					}
					else if (sender == 'TimecardApproval')
					{
						PopulateTimecardDropdown(xmlHttp.responseXML.documentElement);
					}
					else
					{
						UpdateHostId(xmlHttp.responseXML.documentElement);
						RepopulateRoles(xmlHttp.responseXML.documentElement);
						RepopulateAvailableUsers(xmlHttp.responseXML.documentElement);
					}
				}
				break;
			case 404:
				alert ("Error code: " + xmlHttp.status + ".  The requested URL could not be found.");
				break;
			case 500:
				var errorWin = window.open('', 'errorWin');
                errorWin.document.body.innerHTML = xmlHttp.responseText;
				break;
			default:
				alert("There was a problem retrieving data from the server. Error code: " + xmlHttp.status );
				break;
		}
	} 
} 

function GetXmlHttpObject(handler) 
{ 
	var objXmlHttp = null;
	
	if (window.XMLHttpRequest)
	{
		objXmlHttp=new XMLHttpRequest();
		objXmlHttp.onload = handler;
		objXmlHttp.onerror = handler;
		objXmlHttp.onreadystatechange = handler;
	}
	else if (window.ActiveXObject)
	{
		try
		{
			objXmlHttp=new ActiveXObject("Msxml2.XMLHTTP");
		}
		catch(e)
		{
			objXmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
		}
			
		objXmlHttp.onreadystatechange = handler;
	}
	
	//Return the instantiated object
	return objXmlHttp;
}

// User Selector code

function Push (val)
{
	if (arrayIndex == 0)
	{
		nameArr[arrayIndex] = '';
	}
		
	arrayIndex++;
	nameArr[arrayIndex] = val;
}

function Pop ()
{
	arrayIndex--;
	var retval = nameArr[arrayIndex];
	return retval;
}

function contextChange(filterMsg, firstNameId, lastNameId, checkId, uncheckId)
{
	// Clear out the user stack
	while (arrayIndex > 0)
		Pop();
	
	var txtUserLastName = document.getElementById(lastNameId);
	txtUserLastName.value = '';
	var txtUserFirstName = document.getElementById(firstNameId);
	txtUserFirstName.value = '';
	var searchText = txtUserLastName.value + txtUserFirstName.value;
	var check = document.getElementById(checkId);
	check.checked = true;
	var uncheck = document.getElementById(uncheckId);
	uncheck.checked = false;

	var dn = GetDN();

	var lbAvailableUsersId = 'lbAvailableUsers';

	ClearList(lbAvailableUsersId);

	var lbAvailableUsers = document.getElementById(lbAvailableUsersId);
	var optionItem = new Option(filterMsg, filterMsg, false, false);
	lbAvailableUsers.options[0] = optionItem;

	ChangeControlState(0);

	myRequestURL = '..' + requestURL + 'context';
	myRequestURL += '&dn=' + dn;
	myRequestURL += '&lastuser=';
	myRequestURL += '&searchtext=' + searchText;
	myRequestURL += '&sender=US';
	
	processRequest(myRequestURL);
}

function searchChange(filterMsg, sender)
{
	// Clear out the user stack
	while (arrayIndex > 0)
		Pop();
	
	var txtUserLastName = document.getElementById('txtUserLastName');
	var txtUserFirstName = document.getElementById('txtUserFirstName');
	var ddlRoles = document.getElementById('ddlRoles');
	
	var txtlen = txtUserLastName.value.length + txtUserFirstName.value.length;
	
	if ((txtlen == 1) || (sender == ddlRoles))
	{
		var lbAvailableUsersId = 'lbAvailableUsers';

		ClearList(lbAvailableUsersId);
		
		var lbAvailableUsers = document.getElementById(lbAvailableUsersId);
		var optionItem = new Option( filterMsg, filterMsg,  false, false);
		lbAvailableUsers.options[0] = optionItem;
		
		ChangeControlState(0);
	}
	
	var searchText = txtUserLastName.value + ',' + txtUserFirstName.value;
	var role = ddlRoles.options[ddlRoles.selectedIndex].value;
	var dn = GetDN();
	
	myRequestURL = '..' + requestURL + 'data';
	myRequestURL += '&dn=' + dn;
	myRequestURL += '&lastuser=';
	myRequestURL += '&searchtext=' + searchText;
	myRequestURL += '&role=' + role;
	myRequestURL += '&sender=US';
	
	processRequest(myRequestURL);
}

function selectedUserChange(ctrl)
{
	var index = -1;
	
	if (ctrl != null)
	{
		for (var count = 0; count < ctrl.options.length; count++)
		{
			if (ctrl.options[count].selected)
			{
				index = count;
				break;
			}
		}
		
		var contextdn = GetDN();

		if (index > -1)
		{
			myRequestURL = '..' + requestURL + 'hostid';
			myRequestURL += '&dn=' + ctrl.options[index].value;
			myRequestURL += '&lastuser=';
			myRequestURL += '&searchtext=' + contextdn;
			myRequestURL += '&role=';
			myRequestURL += '&sender=US';
	
			processRequest(myRequestURL);
		}
	}
}

function resetForm(msg)
{
	var txtUserLastName = document.getElementById('txtUserLastName');
	txtUserLastName.value = '';
	
	var txtUserFirstName = document.getElementById('txtUserFirstName');
	txtUserFirstName.value = '';
	
	var ddlRoles = document.getElementById('ddlRoles');
	ddlRoles.selectedIndex = 0;
	
	var lbAvailableUsers = document.getElementById('lbAvailableUsers');
	lbAvailableUsers.selectedIndex = -1;
	
	searchChange(msg, this);
}

function nextPage(filterMsg)
{
	var lnkbtnMore = document.getElementById('lnkbtnMore');
	var enabled = lnkbtnMore.getAttribute('enabled');
	if (enabled == 'True')
	{
		var lbAvailUsers = document.getElementById('lbAvailableUsers');
		var usersLength = lbAvailUsers.options.length;
		
		var lastUser = lbAvailUsers.options[usersLength - 1].text;
		//var commaLocation = lastUser.indexOf(',');
		//lastUser = lastUser.substr(0, commaLocation);
		Push (lastUser);
	
		var txtUserLastName = document.getElementById('txtUserLastName');
		var txtUserFirstName = document.getElementById('txtUserFirstName');
		var searchText = txtUserLastName.value + ',' + txtUserFirstName.value;
		var lbAvailableUsersId = 'lbAvailableUsers';

		ClearList(lbAvailableUsersId);
		
		var lbAvailableUsers = document.getElementById(lbAvailableUsersId);
		var optionItem = new Option( filterMsg, filterMsg,  false, false);
		lbAvailableUsers.options[0] = optionItem;
		lbAvailableUsers.options[0].selected = true;
		
		ChangeControlState(0);

		var ddlRoles = document.getElementById('ddlRoles');
		var role = ddlRoles.options[ddlRoles.selectedIndex].value;
		var dn = GetDN();
	
		myRequestURL = '..' + requestURL + 'data';
		myRequestURL += '&dn=' + dn;
		myRequestURL += '&lastuser=' + lastUser;
		myRequestURL += '&searchtext=' + searchText;
		myRequestURL += '&role=' + role;
		myRequestURL += '&sender=US';
		myRequestURL += '&';
		var time = new Date();
		myRequestURL += time.getMilliseconds();
	
		processRequest(myRequestURL);
	}
}

function previousPage(filterMsg)
{
	var lnkbtnPrevious = document.getElementById('lnkbtnPrevious');
	var enabled = lnkbtnPrevious.getAttribute('enabled');
	if (enabled == 'True')
	{
		var lbAvailUsers = document.getElementById('lbAvailableUsers');
		var lastUser = Pop();
	
		var txtUserLastName = document.getElementById('txtUserLastName');
		var txtUserFirstName = document.getElementById('txtUserFirstName');
		var searchText = txtUserLastName.value + ',' + txtUserFirstName.value;
		
		var lbAvailableUsersId = 'lbAvailableUsers';

		ClearList(lbAvailableUsersId);
		
		var lbAvailableUsers = document.getElementById(lbAvailableUsersId);
		var optionItem = new Option( filterMsg, filterMsg,  false, false);
		lbAvailableUsers.options[0] = optionItem;
		lbAvailableUsers.options[0].selected = true;
		
		ChangeControlState(0);
	
		var ddlRoles = document.getElementById('ddlRoles');
		var role = ddlRoles.options[ddlRoles.selectedIndex].value;
		var dn = GetDN();
	
		myRequestURL = '..' + requestURL + 'data';
		myRequestURL += '&dn=' + dn;
		myRequestURL += '&lastuser=' + lastUser;
		myRequestURL += '&searchtext=' + searchText;
		myRequestURL += '&role=' + role;
		myRequestURL += '&sender=US';
		myRequestURL += '&';
		var time = new Date();
		myRequestURL += time.getMilliseconds();
	
		processRequest(myRequestURL);
	}
}

function PostData(page)
{
	var lbSelectedUsers = document.getElementById('lbSelectedUsers');
	var retxml = '';
	
	for (var count = 0; count < lbSelectedUsers.options.length; count++)
	{
		if (lbSelectedUsers.options[count] != null)
		{
			var name = encodeURI(lbSelectedUsers.options[count].text);
			var dn = encodeURI(lbSelectedUsers.options[count].value);
			retxml += '<user><displayname>' + name + '</displayname>';
			retxml += '<dn>' + dn + '</dn></user>';
		}
	}
	
	xmlHttp = GetXmlHttpObject(stateChangeHandler); 
	xmlHttp.open("POST", page, false);
	xmlHttp.setRequestHeader("Content-Type", "text/xml"); //application/x-www-form-urlencoded"); 
//	xmlHttp.setRequestHeader("Content-length", xmlResponse.length);
	retxml = "<?xml version='1.0' encoding='UTF-8' ?><root>" + retxml + "</root>";
	
	xmlHttp.send(retxml);
	
	return true;
}

function RepopulateAvailableUsers(dataNode)
{
	var lbAvailableUsersId = 'lbAvailableUsers';

	var userlist = dataNode.getElementsByTagName('user');
	if (userlist != null)
	{
		if (userlist.length > 0)
		{
			ClearList(lbAvailableUsersId);
			
			var nameValue; 
			var valueValue;
			var optionItem;
			var lbAvailableUsers = document.getElementById(lbAvailableUsersId);

			for (var count = 0; count < userlist.length; count++)
			{
				nameValue = userlist[count].getAttribute('name');
   				valueValue = userlist[count].getAttribute('value'); 
				optionItem = new Option( nameValue, valueValue,  false, false);
				lbAvailableUsers.options[count] = optionItem;
			}
			
			ChangeControlState(userlist.length);
		}
		else 
		{
			// if we're just retrieving the hostid, don't clear the list.
			var hostid = dataNode.getElementsByTagName('hostid')[0].firstChild;
			if (hostid == null)
			{
				ClearList(lbAvailableUsersId);
				ChangeControlState(0);
			}
		}
	}
	else 
	{
		ClearList(lbAvailableUsersId);
		ChangeControlState(0);
	}
}

function RepopulateRoles(dataNode)
{
	var ddlRolesId = 'ddlRoles';
	
	var rolelist = dataNode.getElementsByTagName('role');
	if (rolelist != null)
	{
		if (rolelist.length > 0)
		{
			ClearList(ddlRolesId);
			
			var nameValue; 
			var valueValue;
			var optionItem;
			var ddlRoles = document.getElementById(ddlRolesId);

			for (var count = 0; count < rolelist.length; count++)
			{
				nameValue = rolelist[count].getAttribute('name');
   				valueValue = rolelist[count].getAttribute('value'); 
				optionItem = new Option( nameValue, valueValue,  false, false);
				ddlRoles.options[count] = optionItem;
			}
			
			ChangeControlState(rolelist.length);
		}
	}
}

function UpdateHostId(dataNode)
{
	var nameSpan = document.getElementById('nameSpan');
	var username = dataNode.getElementsByTagName('username')[0].firstChild;
	if (username != null)
	{
		username = username.nodeValue;
		
		nameSpan.innerHTML = "&nbsp;&nbsp;<B>" + username + "</B>";
		var hostid = dataNode.getElementsByTagName('hostid')[0].firstChild.nodeValue;
		nameSpan.innerHTML += "&nbsp;&nbsp;" + hostid + "";
		var userroles = dataNode.getElementsByTagName('userroles')[0].firstChild.nodeValue;
		nameSpan.innerHTML += "<BR>&nbsp;&nbsp;" + userroles + "";
	}
	else
	{
		var selectusertext = document.getElementById('selectusertext');
		nameSpan.innerHTML = selectusertext.value;
//		nameSpan.Text = "";
	}
}

function ChangeControlState(numUsers)
{
	if (numUsers < MAX_USERS_SHOWN)
	{
		DisableControl('lnkbtnMore');
	}
	else
	{
		EnableControl('lnkbtnMore');
	}

	if (arrayIndex <= 0)
	{
		DisableControl('lnkbtnPrevious');
	}
	else
	{
		EnableControl('lnkbtnPrevious');
	}		
	
	changeButtonState('btnAdd', 'lbAvailableUsers');
	changeButtonState('btnRemove', 'lbSelectedUsers');
}

function EnableControl(cid)
{
    var ctrl = document.getElementById(cid);
    ctrl.setAttribute('enabled', 'True');
	ctrl.style.cursor = 'pointer';
	ctrl.style.color='blue';
}

function DisableControl(cid)
{
    var ctrl = document.getElementById(cid);
    ctrl.setAttribute('enabled', 'False');
	ctrl.style.cursor = 'default';
	ctrl.style.color = 'gray';
}

function changeButtonState(btnid, lbid)
{
    var disabled = false;

    if (arguments.length > 2) {
        var selected = document.getElementById(arguments[2]);
        if ((arguments[3] != null) && (arguments[3] > 0) && (selected.length >= arguments[3])) {
            disabled = true;
        }
    }

    if (!disabled) {
        var selectedOption = false;

        var lb = document.getElementById(lbid);
        for (var count = 0; count < lb.options.length; count++) {
            if (lb.options[count].selected) {
                selectedOption = true;
                break;
            }
        }

        if (!selectedOption) disabled = true;
    }

    var btn = document.getElementById(btnid);
    btn.disabled = disabled;
}

function GetDN()
{
	var dn;
	var rbAllUsers = document.getElementById('allUsers');
	
	if (rbAllUsers != null)
	{
		if (rbAllUsers.checked)
		{
			var RootDN = document.getElementById('rootDN');
			dn = RootDN.value;
		}
		else
		{
			var ContextDN = document.getElementById('contextDN');
			dn = ContextDN.value;
		}
	}
	else
	{
		var ContextDN = document.getElementById('contextDN');
		if (ContextDN != null)
			dn = ContextDN.value;
		else
		{	
			var RootDN = document.getElementById('rootDN');
			dn = RootDN.value;
		}
	}
	
	return dn;
}

function addSelected(limit)
{
	var btnAdd = document.getElementById('btnAdd');
	if (!btnAdd.disabled)
	{
		var lbAvailableUsers = document.getElementById('lbAvailableUsers');
		var lbSelectedUsers = document.getElementById('lbSelectedUsers');
		for (var count = 0; count < lbAvailableUsers.options.length; count++)
		{
			if (lbAvailableUsers.options[count].selected)
			{
				var nameValue = lbAvailableUsers.options[count].text;
	   			var valueValue = lbAvailableUsers.options[count].value; 
				optionItem = new Option( nameValue, valueValue,  false, false);
				
				var containsValue = false;
				for (var count1 = 0; count1 < lbSelectedUsers.options.length; count1++)
				{
					if ((lbSelectedUsers.options[count1].text == nameValue)
						&& (lbSelectedUsers.options[count1].value == valueValue))
					{
						containsValue = true;
						break;
					}
				}

				if (!containsValue)
					lbSelectedUsers.options[lbSelectedUsers.length] = optionItem;
			}
		}

		changeButtonState('btnAdd', 'lbAvailableUsers', 'lbSelectedUsers', limit);
	}
}

function removeSelected()
{
	var btnRemove = document.getElementById('btnRemove');
	if(!btnRemove.disabled)
	{
		var selectedArr = new Array();
		var selectedIndex = 0;
		var lbSelectedUsers = document.getElementById('lbSelectedUsers');
		var lbAvailableUsers = document.getElementById('lbAvailableUsers');
		
		for (var count = 0; count < lbSelectedUsers.options.length; count++)
		{
			if (lbSelectedUsers.options[count].selected)
			{
				selectedArr[selectedIndex] = count;
				selectedIndex++;
			}
		}

		for (var count = 0; count < lbAvailableUsers.options.length; count++) {
		    if (lbAvailableUsers.options[count].selected) {
		        lbAvailableUsers.options[count].selected = false;
		    }
		}
		
		for(selectedIndex = selectedArr.length - 1; selectedIndex >= 0; selectedIndex--)
		{
			lbSelectedUsers.options[selectedArr[selectedIndex]] = null;
		}
		
		changeButtonState('btnRemove', 'lbSelectedUsers');
	}
}


// DHTML Popup Code

var messageBoxMask = null;
var messageBoxContainer = null;
var messageBoxIsShown = false;
var tabIndexes = new Array();
var activeableTags = new Array("A","BUTTON","TEXTAREA","INPUT","IFRAME");  
var oldOnScroll = null;

//Call this method to show the full-screen DHTML popup.
//  title - the text to show in the title bar.
//  message - the text to display within the window.
//  buttonText - an array of strings for each button to display.
//  buttonAction - an array of strings with methods to call when the associated button is clicked.
function showDHTMLAlert(title, message, buttonText, buttonAction) 
{
    if(messageBoxMask == null && messageBoxContainer == null)
    {
        initMessageBox(title, message, buttonText, buttonAction);
    }
    
    messageBoxIsShown = true;
    messageBoxMask.style.display = "block";
    messageBoxContainer.style.display = "block";
    
    disableTabIndexes();
    hideSelectBoxes();
    centerMessageBox();
    setMaskSize();
}

//Call this method to close an opened DHTML popup.
function hideDHTMLAlert()
{
    messageBoxIsShown = false;
    var body = document.getElementsByTagName("BODY")[0];
    body.style.overflow = "";
    
    ActiveTabIndexes();        
    displaySelectBoxes();
    RefreshSession();
    
    if (messageBoxMask == null || messageBoxContainer == null)
    {
        return;
    }
    
    messageBoxMask.style.display = "none";
    messageBoxContainer.style.display = "none";
    window.onscroll = oldOnScroll
} 

function initMessageBox(title, message, buttonText, buttonAction)
{
    body = document.getElementsByTagName('BODY')[0];
    mBoxmask = document.createElement('div');
    mBoxmask.id = 'messageBoxMask';
    mBoxcont = document.createElement('div');
    mBoxcont.id = 'messageBoxContainer';
    
    var buttons = '';
    if ((buttonText != null) && (buttonAction != null) && (buttonText.length == buttonAction.length))
    {
		for (i = 0; i < buttonText.length; i++)
		{
			buttons += '<input type="submit" id="button' + i + '" onclick="' + buttonAction[i] + '" value="' + buttonText[i] + '" style="margin: 0px 15px;"/>';
		}
    }
    if (buttons != '')
    {
		buttons = '<tr><td id="messageBoxMainControls" colspan="2">' + buttons + '</td></tr>'
    }
    
    mBoxcont.innerHTML = '' +
        '<table id="messageBoxInner">' +
            '<tr id="messageBoxTitleBar">' +
                '<td id="messageBoxTitle">' + title + '</td>' +
                '<td id="messageBoxTitleControls">' +
                    '<img id="closebutton" src="UI/Common/Images/closebutton.gif" onclick="hideDHTMLAlert();" />' +
                '</td>' +
            '</tr>' + 
            '<tr><td id="messageBoxText" colspan="2">' + message + '</td></tr>' +
            buttons + 
        '</table>';
    body.appendChild(mBoxmask);
    body.appendChild(mBoxcont);

    messageBoxMask = document.getElementById("messageBoxMask");
    messageBoxContainer = document.getElementById("messageBoxContainer");

    if (!document.all) 
    {
        document.onkeypress = keyDownHandler;
    } 
    
    if (window.addEventListener)
    {
        window.addEventListener("resize", centerMessageBox, false);
        window.addEventListener("scroll", centerMessageBox, false);
    } 
    else if (window.attachEvent)
    {
        window.attachEvent("on" + "resize", centerMessageBox);
        window.attachEvent("on" + "scroll", centerMessageBox);
    }
    
    oldOnScroll = window.onscroll;
    window.onscroll = centerMessageBox; 
}

function setMaskSize() 
{
    var body = document.getElementsByTagName("BODY")[0];
    var fullHeight = getWinHeight();
    var fullWidth = getWinWidth();

    if (fullHeight > body.scrollHeight) 
    {
        mBoxHeight = fullHeight;
    } 
    else 
    {
        mBoxHeight = body.scrollHeight;
    }

    if (fullWidth > body.scrollWidth) 
    {
        mBoxWidth = fullWidth;
    } 
    else 
    {
        mBoxWidth = body.scrollWidth;
    }

    messageBoxMask.style.height = mBoxHeight + "px";
    messageBoxMask.style.width = mBoxWidth + "px";
}

function centerMessageBox() 
{
    if (messageBoxIsShown == true) 
    {
        var width = messageBoxContainer.offsetWidth;
        var height = messageBoxContainer.offsetHeight;
        var scTop = parseInt(getScrollTop(),10);
        var scLeft = parseInt(getScrollLeft(),10);
        var titleBarHeight = parseInt(document.getElementById("messageBoxTitleBar").offsetHeight, 10);
        var fullHeight = getWinHeight();
        var fullWidth = getWinWidth();

        setMaskSize();
        
        messageBoxContainer.style.top = (scTop + ((fullHeight - (height + titleBarHeight)) / 2)) + "px";
        messageBoxContainer.style.left =  (scLeft + ((fullWidth - width) / 2)) + "px";
    }
}

function hideAndKeepSession(keepSession)
{
	if (keepSession)
		hideDHTMLAlert();
	else
		DropSession();
}

function keyDownHandler(e) 
{
    if (messageBoxIsShown && e.keyCode == 9)  return false;
} 

function disableTabIndexes() 
{
    if (document.all) 
    {
        var i = 0;
        for (var j = 0; j < activeableTags.length; j++) 
        {
            var tagElements = document.getElementsByTagName(activeableTags[j]);
            for (var k = 0 ; k < tagElements.length; k++) 
            {
                tabIndexes[i] = tagElements[k].tabIndex;
                tagElements[k].tabIndex = "-1";
                i++;
            }
        }
    }
} 

function ActiveTabIndexes() 
{
    if (document.all) 
    {
        var i = 0;
        for (var j = 0; j < activeableTags.length; j++) 
        {
            var tagElements = document.getElementsByTagName(activeableTags[j]);
            for (var k = 0 ; k < tagElements.length; k++) 
            {
                tagElements[k].tabIndex = tabIndexes[i];
                tagElements[k].tabEnabled = true;
                i++;
            }
        }
    }
} 

function hideSelectBoxes() 
{
	function GetBrowserType() //needs to be revised... better ways to check for browser exist
	{
		switch (navigator.appName)
		{
			case "Microsoft Internet Explorer":
			{
				return "ie";
			}
			case "Netscape": //mozilla - firefox
			{
				return "netscape";
			}
			default:
			{
				return "other";
			}
		}
	}
		
    for(var i = 0; i < document.forms.length; i++) 
    {
        for(var j = 0; j < document.forms[i].length; j++)
        {
            if(document.forms[i].elements[j].tagName == "SELECT") 
            {
                document.forms[i].elements[j].style.visibility = "hidden";
            }
        }
    }
    
    //
    //hides IFrame windows if Acrobat .pdf is loaded because timeout window (DHTML layer) cannot overlap "windowed" control
    
    var iframes = document.getElementsByTagName("IFRAME");
    
    for (var i=0; i<iframes.length; i++)
    {
		switch (GetBrowserType())
		{
			case "ie":
			{
				//this try/catch is a unique IE technique to dermine if a .pdf is loaded by trying to access the document object
				
				try
				{
					iframes[i].contentWindow.document;
				}
				catch (e)
				{
					iframes[i].style.visibility = "hidden";
				}
			
				break;
			}
			case "netscape":
			{
				if (iframes[i].contentDocument.location.href.toLowerCase().indexOf(".pdf") != -1)
				{
					iframes[i].style.visibility = "hidden";
				}
				
				break;
			}
		}
	}
} 

function displaySelectBoxes() 
{
    for(var i = 0; i < document.forms.length; i++) 
    {
        for(var j = 0; j < document.forms[i].length; j++)
        {
            if(document.forms[i].elements[j].tagName == "SELECT") 
            {
                document.forms[i].elements[j].style.visibility = "visible";
            }
        }
    }
    
	//
	//un-hides IFrames upon closing of time-out window
    
	var iframes = document.getElementsByTagName("IFRAME");
   
   for (var i=0; i<iframes.length; i++)
   {	
		iframes[i].style.visibility = "visible";
	}
} 

function getWinHeight() 
{
     if (window.innerHeight!=window.undefined) 
     {
         return window.innerHeight;
     }
     if (document.compatMode=='CSS1Compat')
     {
          return document.documentElement.clientHeight;
     }
     if (document.body) 
     {
         return document.body.clientHeight; 
     }

     return window.undefined; 
}

function getWinWidth() 
{
     var offset = 17;
     var width = null;
     
     if (window.innerWidth!=window.undefined) 
     {
         return window.innerWidth;
     } 
     
     if (document.compatMode=='CSS1Compat') 
     {
         return document.documentElement.clientWidth; 
     }
     
     if (document.body) 
     {
         return document.body.clientWidth; 
     }
}

function getScrollTop() 
{
     if (self.pageYOffset) 
     {
          return self.pageYOffset;
     }
     else if (document.documentElement && document.documentElement.scrollTop)
     {
          return document.documentElement.scrollTop;
     }
     else if (document.body)
     {
          return document.body.scrollTop;
     }
}

function getScrollLeft() 
{
     if (self.pageXOffset)
     {
          return self.pageXOffset;
     }
     else if (document.documentElement && document.documentElement.scrollLeft)
     {
          return document.documentElement.scrollLeft;
     }
     else if (document.body) 
     {
          return document.body.scrollLeft;
     }
}


// Session Timeout Popup Code

/* Obsolete
function keepSession() 
{
	showDHTMLAlert(
			'Session Timeout', 
			'Your session is about to time out. Please click "Keep Working" to refresh your session and continue working, or click "Logout".', 
			['Keep Working', 'Logout'], 
			['hideAndKeepSession(true)', 'hideAndKeepSession(false)']
		);
	
    window.setTimeout("DropSession();", 1000 * 60 * 5);
}
*/

function DropSession()
{
    if (messageBoxIsShown)
    {
	    var pattern =  /^\/([A-Za-z0-9]+)[\/]?/;
	    var result = pattern.exec(location.pathname);
	    window.location = result[0] + '?tool=droppedSession';
	}
}

function RefreshSession()
{   
    processRequest('AJAX/AJAXserver.aspx?action=' + 'keepSession');
}


// Timecard Approval portlet code

function GetPayPeriods(payGroupID, payPeriodID, strURL)
{   
	ctrlToUpdate = payPeriodID;
	sender = 'TimecardApproval';
	
	var payGroup = document.getElementById(payGroupID);

	if (payGroup.options[payGroup.selectedIndex].value == '')
		return;

	myRequestURL = strURL + requestURL + 'payperiod';
	myRequestURL += '&paygroup=' + payGroup.options[payGroup.selectedIndex].value;
	myRequestURL += '&sender=PTA';
	myRequestURL += '&noCache=' + (new Date).getTime() + Math.random();
    processRequest(myRequestURL);
}

function GetEmployees(payGroupID, payPeriodID, employeeID, strURL)
{
	ctrlToUpdate = employeeID;
	sender = 'TimecardApproval';
	
	var payGroup = document.getElementById(payGroupID);
	var payPeriod = document.getElementById(payPeriodID);
	
	if (
		(payGroup.options[payGroup.selectedIndex].value == '') || 
		(payPeriod.options[payPeriod.selectedIndex].value == '')
		)
		return;

	myRequestURL = strURL + requestURL + 'employees';
	myRequestURL += '&paygroup=' + payGroup.options[payGroup.selectedIndex].value;
	myRequestURL += '&payperiod=' + payPeriod.options[payPeriod.selectedIndex].value;
	myRequestURL += '&sender=PTA';
	myRequestURL += '&noCache=' + (new Date).getTime() + Math.random();
    processRequest(myRequestURL);
}

function PopulateTimecardDropdown(dataNode)
{
	var ctrl = document.getElementById(ctrlToUpdate);
	
	var itemlist = dataNode.getElementsByTagName('item');
	if (itemlist != null)
	{
		if (itemlist.length > 0)
		{
			ClearList(ctrlToUpdate);

			var textValue; 
			var valueValue;
			var optionItem;

			for (var count = 0; count < itemlist.length; count++)
			{
				textValue = itemlist[count].getAttribute('text');
   				valueValue = itemlist[count].getAttribute('value'); 
				optionItem = new Option(textValue, valueValue, false, false);
				ctrl.options[count] = optionItem;
			}
		}
	}

	//This allows a control to do something else once it's finished being updated.
	if (ctrl.onupdated) ctrl.onupdated();	
}

// Helper methods
function ClearList(id)
{
	var ctrl = document.getElementById(id);
	for (var count = ctrl.options.length-1; count >-1; count--)
	{
		ctrl.options[count] = null;
	}
}
