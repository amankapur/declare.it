function MM_swapImgRestore()
{
	var i,x,a=document.MM_sr;
	for(i=0;a&&i<a.length&&(x=a[i])&&x.oSrc;i++)
	{
		if(x.src)
			x.src=x.oSrc;
		else
			x.background=x.oSrc;
	}
}

function MM_swapImage()
{	
	var i,j=0,x,a=MM_swapImage.arguments; document.MM_sr=new Array;
	for(i=0;i<(a.length-2);i+=3)
	{
		if ((x=MM_findObj(a[i]))!=null)
		{
			document.MM_sr[j++]=x;
			if(x.src)
			{
				x.oSrc=x.src;
				x.src=a[i+2];
			}
			else
			{
				x.oSrc=x.background;
				x.background=a[i+2];
			}
		}
	}
}

function MM_findObj(n, d) {
  var p,i,x;  if(!d) d=document; if((p=n.indexOf("?"))>0&&parent.frames.length) {
    d=parent.frames[n.substring(p+1)].document; n=n.substring(0,p);}
  if(!(x=d[n])&&d.all) x=d.all[n]; for (i=0;!x&&i<d.forms.length;i++) x=d.forms[i][n];
  for(i=0;!x&&d.layers&&i<d.layers.length;i++) x=MM_findObj(n,d.layers[i].document);
  if(!x && d.getElementById) x=d.getElementById(n); return x;
}

function MM_dragLayer(objName,x,hL,hT,hW,hH,toFront,dropBack,cU,cD,cL,cR,targL,targT,tol,dropJS,et,dragJS) {
  var i,j,aLayer,retVal,curDrag=null,curLeft,curTop,IE=document.all,NS4=document.layers;
  var NS6=(!IE&&document.getElementById), NS=(NS4||NS6); if (!IE && !NS) return false;
  retVal = true; if(IE && event) event.returnValue = true;
  if (MM_dragLayer.arguments.length > 1) {
    curDrag = MM_findObj(objName); if (!curDrag) return false;
    if (!document.allLayers) { document.allLayers = new Array();
      with (document) if (NS4) { for (i=0; i<layers.length; i++) allLayers[i]=layers[i];
        for (i=0; i<allLayers.length; i++) if (allLayers[i].document && allLayers[i].document.layers)
          with (allLayers[i].document) for (j=0; j<layers.length; j++) allLayers[allLayers.length]=layers[j];
      } else {
        if (NS6) { var spns = getElementsByTagName("span"); var all = getElementsByTagName("div"); 
          for (i=0;i<spns.length;i++) if (spns[i].style&&spns[i].style.position) allLayers[allLayers.length]=spns[i];}
        for (i=0;i<all.length;i++) if (all[i].style&&all[i].style.position) allLayers[allLayers.length]=all[i]; 
    } }
    curDrag.MM_dragOk=true; curDrag.MM_targL=targL; curDrag.MM_targT=targT;
    curDrag.MM_tol=Math.pow(tol,2); curDrag.MM_hLeft=hL; curDrag.MM_hTop=hT;
    curDrag.MM_hWidth=hW; curDrag.MM_hHeight=hH; curDrag.MM_toFront=toFront;
    curDrag.MM_dropBack=dropBack; curDrag.MM_dropJS=dropJS;
    curDrag.MM_everyTime=et; curDrag.MM_dragJS=dragJS;
    curDrag.MM_oldZ = (NS4)?curDrag.zIndex:curDrag.style.zIndex;
    curLeft= (NS4)?curDrag.left:(NS6)?parseInt(curDrag.style.left):curDrag.style.pixelLeft; 
    if (String(curLeft)=="NaN") curLeft=0; curDrag.MM_startL = curLeft;
    curTop = (NS4)?curDrag.top:(NS6)?parseInt(curDrag.style.top):curDrag.style.pixelTop; 
    if (String(curTop)=="NaN") curTop=0; curDrag.MM_startT = curTop;
    curDrag.MM_bL=(cL<0)?null:curLeft-cL; curDrag.MM_bT=(cU<0)?null:curTop-cU;
    curDrag.MM_bR=(cR<0)?null:curLeft+cR; curDrag.MM_bB=(cD<0)?null:curTop+cD;
    curDrag.MM_LEFTRIGHT=0; curDrag.MM_UPDOWN=0; curDrag.MM_SNAPPED=false; //use in your JS!
    document.onmousedown = MM_dragLayer; document.onmouseup = MM_dragLayer;
    if (NS) document.captureEvents(Event.MOUSEDOWN|Event.MOUSEUP);
  } else {
    var theEvent = ((NS)?objName.type:event.type);
    if (theEvent == 'mousedown') {
      var mouseX = (NS)?objName.pageX : event.clientX + document.body.scrollLeft;
      var mouseY = (NS)?objName.pageY : event.clientY + document.body.scrollTop;
      var maxDragZ=null; document.MM_maxZ = 0;
      for (i=0; i<document.allLayers.length; i++) { aLayer = document.allLayers[i];
        var aLayerZ = (NS4)?aLayer.zIndex:parseInt(aLayer.style.zIndex);
        if (aLayerZ > document.MM_maxZ) document.MM_maxZ = aLayerZ;
        var isVisible = (((NS4)?aLayer.visibility:aLayer.style.visibility).indexOf('hid') == -1);
        if (aLayer.MM_dragOk != null && isVisible) with (aLayer) {
          var parentL=0; var parentT=0;
          if (NS6) { parentLayer = aLayer.parentNode;
            while (parentLayer != null && parentLayer.style.position) {             
              parentL += parseInt(parentLayer.offsetLeft); parentT += parseInt(parentLayer.offsetTop);
              parentLayer = parentLayer.parentNode;
          } } else if (IE)
			{
				parentLayer = aLayer.parentElement;       
            while (parentLayer != null && parentLayer.style.position) {
              parentL += parentLayer.offsetLeft; parentT += parentLayer.offsetTop;
              parentLayer = parentLayer.parentElement; } }
              
	      style.pixelLeft = offsetLeft; //Fixes strange bug (Downey)
	      style.pixelTop = offsetTop; //Fixes strange bug (Downey)
          var tmpX=mouseX-(((NS4)?pageX:((NS6)?parseInt(style.left):style.pixelLeft)+parentL)+MM_hLeft);
          var tmpY=mouseY-(((NS4)?pageY:((NS6)?parseInt(style.top):style.pixelTop)+parentT)+MM_hTop);
          if (String(tmpX)=="NaN") tmpX=0; if (String(tmpY)=="NaN") tmpY=0;
          var tmpW = MM_hWidth;  if (tmpW <= 0) tmpW += ((NS4)?clip.width :offsetWidth);
          var tmpH = MM_hHeight; if (tmpH <= 0) tmpH += ((NS4)?clip.height:offsetHeight);
          if ((0 <= tmpX && tmpX < tmpW && 0 <= tmpY && tmpY < tmpH) && (maxDragZ == null
              || maxDragZ <= aLayerZ)){curDrag = aLayer; maxDragZ = aLayerZ;}
			   } }
      if (curDrag) {
        document.onmousemove = MM_dragLayer; if (NS4) document.captureEvents(Event.MOUSEMOVE);
        curLeft = (NS4)?curDrag.left:(NS6)?parseInt(curDrag.style.left):curDrag.style.pixelLeft;
        curTop = (NS4)?curDrag.top:(NS6)?parseInt(curDrag.style.top):curDrag.style.pixelTop;
        if (String(curLeft)=="NaN") curLeft=0; if (String(curTop)=="NaN") curTop=0;
        MM_oldX = mouseX - curLeft; MM_oldY = mouseY - curTop;
        document.MM_curDrag = curDrag;  curDrag.MM_SNAPPED=false;
        if(curDrag.MM_toFront) {
          eval('curDrag.'+((NS4)?'':'style.')+'zIndex=document.MM_maxZ+1');
          if (!curDrag.MM_dropBack) document.MM_maxZ++; }
        retVal = false; if(!NS4&&!NS6) event.returnValue = false;
    } } else if (theEvent == 'mousemove') {
      if (document.MM_curDrag) with (document.MM_curDrag) {
        var mouseX = (NS)?objName.pageX : event.clientX + document.body.scrollLeft;
        var mouseY = (NS)?objName.pageY : event.clientY + document.body.scrollTop;
        newLeft = mouseX-MM_oldX; newTop  = mouseY-MM_oldY;
        if (MM_bL!=null) newLeft = Math.max(newLeft,MM_bL);
        if (MM_bR!=null) newLeft = Math.min(newLeft,MM_bR);
        if (MM_bT!=null) newTop  = Math.max(newTop ,MM_bT);
        if (MM_bB!=null) newTop  = Math.min(newTop ,MM_bB);
        MM_LEFTRIGHT = newLeft-MM_startL; MM_UPDOWN = newTop-MM_startT;
        if (NS4) {left = newLeft; top = newTop;}
        else if (NS6){style.left = newLeft; style.top = newTop;}
        else {style.pixelLeft = newLeft; style.pixelTop = newTop;}
        if (MM_dragJS) eval(MM_dragJS);
        retVal = false; if(!NS) event.returnValue = false;
    } } else if (theEvent == 'mouseup') {
      document.onmousemove = null;
      if (NS) document.releaseEvents(Event.MOUSEMOVE);
      if (NS) document.captureEvents(Event.MOUSEDOWN); //for mac NS
      if (document.MM_curDrag) with (document.MM_curDrag) {
      	
      	//If a position marker is present, it will be used to track the location so it is remebered between postbacks.
      	var positionField = MM_findObj(id + "_PopupPosition");
		if(positionField) {positionField.value = (style.pixelLeft + "," + style.pixelTop);}
		
        if (typeof MM_targL =='number' && typeof MM_targT == 'number' &&
            (Math.pow(MM_targL-((NS4)?left:(NS6)?parseInt(style.left):style.pixelLeft),2)+
             Math.pow(MM_targT-((NS4)?top:(NS6)?parseInt(style.top):style.pixelTop),2))<=MM_tol) {
          if (NS4) {left = MM_targL; top = MM_targT;}
          else if (NS6) {style.left = MM_targL; style.top = MM_targT;}
          else {style.pixelLeft = MM_targL; style.pixelTop = MM_targT;}
          MM_SNAPPED = true; MM_LEFTRIGHT = MM_startL-MM_targL; MM_UPDOWN = MM_startT-MM_targT; }
        if (MM_everyTime || MM_SNAPPED) eval(MM_dropJS);
        if(MM_dropBack) {if (NS4) zIndex = MM_oldZ; else style.zIndex = MM_oldZ;}
        retVal = false; if(!NS) event.returnValue = false; }
      document.MM_curDrag = null;
    }
    if (NS) document.routeEvent(objName);
  } return retVal;
}

function MM_showHideLayers() {
  var i,p,v,obj,args=MM_showHideLayers.arguments;
  for (i=0; i<(args.length-2); i+=3) if ((obj=MM_findObj(args[i]))!=null) { v=args[i+2];
		//If a state marker is present, it will be used to track the state so it is remebered between postbacks.
      	var stateField = MM_findObj(obj.id + "_PopupState");	  
		if (obj.style)
		{
			obj=obj.style;
			v=(v=='show')?'visible':(v=='hide')?'hidden':v;
			if(stateField) {stateField.value = v;}
		}
		obj.visibility=v;
    }
}



function preventDefault(event, value)
{
	if ((event != null && typeof(event.type) === "string") && (value === false || value == null))
	{		
		if (event.preventDefault)
		{
			event.preventDefault();
		}
		else if ("returnValue" in event)
		{
			event.returnValue = false;
		}
		else
		{
			throw new Error("The browser does not support known DOM Level II event cancellation.");
		}
	}
	
	return value;
}


function AttachEvent(object_handle, event_name, function_pointer) //obsolete will be removed when dependencies updated to use jQuery
{
	if (object_handle.attachEvent)
	{
		if (event_name.substr(0, 2).toLowerCase() != "on")
		{
			event_name = ("on" + event_name);
		}
		
		return object_handle.attachEvent(event_name, function_pointer);
	}
	else if (object_handle.addEventListener)
	{
		object_handle.addEventListener(event_name, function_pointer, false);
	}
}

function DetachEvent(object_handle, event_name, function_pointer) //obsolete will be removed when dependencies updated to use jQuery
{
	if (object_handle.detachEvent)
	{
		object_handle.detachEvent(("on" + event_name), function_pointer);
	}
	else if (object_handle.removeEventListener)
	{
		object_handle.removeEventListener(event_name, function_pointer, false);
	}
}

		
		
		// input is expected to be a html text input		
function checkDate(input, allowBlank, dateFormat){
    if (allowBlank == true)
    {
        if (input.value == "")
            return;
    }
    
    var dayFirst = false;
    if(dateFormat.substring(0,2).toLowerCase() == "dd"){
        dayFirst = true;
    }
    var validformat; 
    if(dayFirst) {
        validformat = /^([0]?[1-9]|[1|2][0-9]|[3][0|1])[/]([0]?[1-9]|[1][0-2])[/]([0-9]{4}|[0-9]{2})$/ ;
    }
    else {
        validformat = /^([0]?[1-9]|[1][0-2])[/]([0]?[1-9]|[1|2][0-9]|[3][0|1])[/]([0-9]{4}|[0-9]{2})$/ ;
    }
    if (!validformat.test(input.value))
    {
        alert("Invalid Date Format. Please correct.");
        //document.getElementById(input.id).value = "";
		input.value = "";
    }
    else { //Detailed check for valid date ranges
        var monthfield, dayfield;
        if (dayFirst){
            dayfield = input.value.split("/")[0];
            monthfield = input.value.split("/")[1];
        } else {
            monthfield = input.value.split("/")[0];
            dayfield = input.value.split("/")[1];
        } 
        var yearfield=input.value.split("/")[2];
        var dayobj = new Date(yearfield, monthfield-1, dayfield);
        if ((dayobj.getMonth()+1!=monthfield)||(dayobj.getDate()!=dayfield)||(dayobj.getFullYear()!=yearfield))
        {
            alert("Invalid Day, Month, or Year range detected. Please correct.");
            //getElementById(input.id).value = "";
			//input.value = "";
        }        
    }   
}

    function getQueryStringVariable(variable) 
	{   
        var query = window.location.search.substring(1);
   
        var vars = query.split("&");
   
        for (var i=0;i<vars.length;i++) 
        {
            var pair = vars[i].split("=");   
            if (pair[0] == variable)    
                return pair[1];   
        }     
    }






function start_portlet_view_life_cycle(portlet_view_unique_name, type_name)
{
	function detect_load()
	{
		if (div.offsetHeight === 0)
		{
			setTimeout(detect_load, 0);
		}
		else
		{
			portlet_view.load();
		}
	}
	
	////
	
	var portlet_view;	//Object
	var div;			//DOMElement:div
	
	//
	
	if (!(window[portlet_view_unique_name] instanceof eval(type_name)))
	{
		setTimeout(arguments.callee, 0);
		
		return;
	}
	
	//
			
	portlet_view = window[portlet_view_unique_name];
	
	if (typeof(portlet_view.init) === "function")
	{
		portlet_view.init();
	}
	
	if (portlet_view.load instanceof Function)
	{
		if (typeof(portlet_view.get_div) === "function")
		{
			div = portlet_view.get_div();
		}
		
		if (div != null)
		{
			detect_load();
		}
	}
}
