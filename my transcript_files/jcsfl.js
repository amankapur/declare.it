window.JCSL = new JCSFLv2_2();

//JCSFLv2_2_5329

function JCSFLv2_2()
{

var $ = this;


	this.debug = new function NAMESPACE__$debug()
	{
		//#region VARIABLE
		
			var dbgr; //$.debug.Debugger
		
		//#endregion
		
		//#region METHOD
		
			this.get_debugger = function()
			{		
				if (dbgr === undefined)
				{
					dbgr = new Debugger();
					
				}
				
				return dbgr;
			}
		
		//#endregion


		var Debugger = function $debug$$Debugger__CLASS()
		{typeof "$debug$$Debugger__CLASS";
			//#region VARIABLE
			
				var win; //DOMWindow
			
			//#endregion
			
			//#region METHOD
			
				this.init = function()
				{
					win = window.open("", "dw");
					
					if (win.location.href === "about:blank")
					{
						win.close();
						
						win = null;
					}
					
					if (win === null)
					{
						win = window.open("ui/common/scripts/jcsfl_debugger.htm", "dw");
					}
					
					//win.frames[1].document.write($.browser.get_agent().name);
					
					//$.element.attach_event(win.frames[0].document.getElementById("BTN_execute_immediate"), "click", test);
					
					$.element.attach_event(win.frames[0].document.getElementById("TXA_immeditate"), "keypress", test);
				}
				
				this.write = function(string)
				{
					win.frames[1].document.write(string + "<br />");
				}
				
				this.examine = function(object, depth)
				{
					$.vp(arguments, [{}, {type:"Number", default_value:0}]);
					
					//
					
					for (var attribute in object)
					{
						if (object.hasOwnProperty(attribute) == false) continue;
						
						//
						
						this.write(tab(depth) + attribute + " [" + $.GetType(object[attribute]) + "]"); // + " " + object[attribute]);
						
						if (attribute != "toJSONString")
						{
							this.examine(object[attribute], (depth + 1));
						}
						
						else
						{
						
						}
					}					
				}
				
			//#endregion
			
			//#region ROUTINE
			
				function tab(count)
				{
					var tabs = new String();
					
					//
					
					for (var i=0; i<count; i++)
					{
						tabs += "&nbsp;&nbsp;&nbsp;&nbsp;";
						//tabs += "<br />";
					}
					
					return tabs;
				}
				
				function test(event)
				{
					var returned;
					
					//
					
					if (event.keyCode != 13) return;
					
					//
					
					try
					{
						returned = eval(win.frames[0].document.getElementById("TXA_immeditate").value);
					}
					catch (error)
					{
						alert(error.description);
					}
					
					if (typeof(returned) == "undefined") return;
					
					win.frames[0].document.getElementById("TXA_immeditate").value = (win.frames[0].document.getElementById("TXA_immeditate").value + "\n" + returned.toString());
				}
			
			//#endregion

		}
	}

	this.reflection = new function NAMESPACE__$reflection()
	{
	var $reflection = this;
	
		//#region TYPE
		
			this.Type = function OBJECT()
			{
				//future implementation
			}
			
		//#endregion
		
		//#region METHOD
		
			this.get_function_code = function(func)
			{
				var to_string = function()
				{
					var source = func.toString();
					
					switch (source.substring(0, 1))
					{
						case "\n":
						{
							source = source.substr(1); //Explorer
							
							break;
						}
						case "(":
						{
							//todo: cleanup better to eliminate tabs + use $.String to trim
							
							source = source.substring(1, (source.length - 2)).replace(/^\s\s*/, ''); //Explorer?
							
							break;
						}
					}
					
					return source;
				}
				
				////
	
				if (typeof(func) != "function") throw new $.GenericError("A Function object must be provided to attain the source code.");
				
				if (func.toSource) return func.toSource(); //FireFox
				
				return to_string(); //Explorer, Chrome, Opera, Safari
			}
			
			this.has_constructor = function(pointer)
			{
				if (pointer == null) throw new $.NullReferenceError();
				
				return (typeof(pointer.constructor) != "undefined")
			}
			
			this.is_element = function(obj, include_text_node) //REVISE TO USE GetType()
			{
				//rewrite
				
				if (obj != null)
				{
					if (obj.nodeType != null)
					{
						if (obj.nodeType == 1) return true;
	
						if (($.vv(include_text_node, {type:"Boolean", default_value:false}) === true) && (obj.nodeType == 3)) return true;
					}
				}
	
				return false;
			}	
			
			this.is_text_node = function(obj)
			{
				if (obj != null)
				{
					if (obj.nodeType != null)
					{
						if (obj.nodeType == 3) return true;
					}
				}
	
				return false;
			}
			
			this.get_function_name = function(func)
			{
				if (typeof(func) != "function") throw new Error("funciton required");// $.GenericError("not a function!");
				
				//
	
				if (typeof(func.name) === "string")
				{
					//
					//applies to: FireFox, Chrome
					
					if (func.name.length === 0) return "{unnamed}";
					
					return func.name;
				}
				else
				{
					var code_block = $reflection.get_function_code(func).substring(8);
	
					var re = new RegExp("[a-z_\$]", "i");
	
					var parenthesi = code_block.indexOf("(");
					var alpha_char = code_block.search(re);
	
					var s; //String
	
					if (parenthesi > alpha_char)
					{
						s = code_block.substring(alpha_char, parenthesi);
					}
					else
					{	
						s = "{unnamed}";
					}
	
					return s;
				}
			}
			
			this.get_function_parameter_names = function(func)
			{
				var f = $reflection.get_function_code(func);
				
				if (f[0] === "(")
				{
					f = f.substr(1, (f.length - 3));
				}
				
				return f.substring((f.indexOf("(") + 1), f.indexOf(")")).replace(/ /g, "").split(",");
			}
			
			this.get_namespace_array = function(namespace_string)
			{
				try
				{			
					$.vp(arguments, {type:["Function", "String"]});
				}
				catch(e){throw e;}
				
				//
				
				if (typeof(namespace_string) == "function")
				{
					namespace_string = $.reflection.get_function_name(namespace_string);
				}
				
				//
				
				var qualification_char = "$";
				
				var arr = new $.Array("String", namespace_string.split(qualification_char));
				
				return arr;
			}
			
			this.validate_object_name = function(fullname)
			{
				try
				{
					$.vp(arguments, {type:"String"});
				}
				catch(e){throw e;}
				
				//
				
				//use regex here to validate object fullname
				
				var string_array = fullname.split("$");
				
				for (var i=0; i<string_array.length; i++)
				{
					if ($.reflection.validate_func_name(string_array[i]) == false) return false;
				}
				
				return true;
			}
			
			this.validate_func_name = function(func_name)
			{
				return new RegExp("^[_a-zA-Z]([_a-zA-Z0-9]+)?$").test(func_name);
			}
			
			function ignore_param_check(args)
			{
				//vp check func?!
				//alert($.GetType(args[args.length-1]));
				
				return ((args.length > args.callee.length) && (args[args.length-1] == "new ParamChecker()"))
			}
			
			this.load_objects = function reflection$load_objects(urls, names, version, load_callback, timeout)		
			{
				var callback = function(func)
				{
					objects.push(func);
					
					if (objects.length === names.length) load_callback(objects);
				}
				
				////
				
				try
				{
					$.vp
					(
						arguments,
						{
							type:		"Array-String"
						},
						{
							type:		"Array-String"
						}
						,
						{
							type:		["Number", "String"],
							optional:	true
						},
						{
							type:		"Function"
						},
						{
							type:		"Number",
							optional:	true
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				if (urls.length !== names.length) throw new $.InvalidOperationError("The urls and names lengths must be equal.");
				
				//
				
				var objects = [];
				
				for (var i=0; i<urls.length; i++)
				{
					$reflection.load_object(urls[i], names[i], version, callback, timeout);
				}
			}
			
			this.load_object = function reflection$load_object(url, name, version, load_callback, timeout)
			{
				var test_for_function = function()
				{
					try
					{
						lib_func = eval(full_name);
					}
					catch(e)
					{
						return false;
					}
					
					return true;
				}
				
				var wait_for_function = function()
				{
					if (test_for_function() === true)
					{				
						load_callback(lib_func);
					}
					else
					{
						//if (attempts > timeout) throw new $.GenericError("The library could not be loaded.\n\n" + name.replace(/\$/g, ".") + "\n\n" + url); //TODO: replace with LibraryLoad
						
						if (attempts > timeout) throw new $reflection.LibraryLoadError(name.replace(/\$/g, ".") + "\n\n" + url);
											
						//
	
						attempts++;
									
						window.setTimeout(arguments.callee, 100);
					}
				}
				
				var load_script = function(url)
				{
					//var load_error_handler = function()
					//{
					//	alert("JS Library load failure:\n\nurl");
					//	
					//	script.onerror = function(){};
					//}
					
					////
					
					var script = document.createElement("script");
					
					script.type		= "text/javascript";
					//script.onerror	= load_error_handler;
					script.src		= url;
					
					//TODO: use GET to check js file
					
					//
					//NOTE: If the url is invalid or non-existant then a JS Error is thrown.
					//		How to catch this error is not determined yet.
					//		Please make sure the path is valid.
					//TODO: somehow check path is valid
					
					document.getElementsByTagName("head")[0].appendChild(script);
					
					//return script; for readyState
				}			
				
				////
				
				try
				{
					$.vp
					(
						arguments,
						{
							type:		"String"
						},
						{
							type:		"String"
						},
						{
							type:		["Number", "String"],
							allow_null:	true
						},
						{
							type:		"Function"
						},
						{
							type:		"Number",
							optional:	function(){timeout=60000;}
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				var lib_func; //Function
				
				name = name.replace(/\./g, "$");
				
				var full_name = name;
				
				if (version != null)
				{
					name += ("v" + version.toString());
				}
				
				//
				
				if (test_for_function() === true)
				{
					load_callback(lib_func);
					
					return;
				}
				else
				{	
					load_script(url);
				}
				
				//
				
				timeout = (timeout / 100);
	
				attempts = 0;
				
				wait_for_function();	
			}
			
			this.function_exists = function reflection$function_exists(name)
			{
				try
				{
					eval(name);
				}
				catch (e)
				{
					return false;
				}
				
				return true;
			}
			
			this.LibraryLoadError = function $reflection$LibraryLoadError__CLASS(additional_message)
	        {
		        return new $.ErrorBase(this, "The library could not be loaded.", additional_message);
	        }
				
		//#endregion


		this.library = new function NAMESPACE__$reflection$library()
		{
			this.find_by_file = function(file)
			{
				var retobj;		//Object
				var scripts;	//DOMNodeList:script
				var src;		//String
				var indeox_of;	//Number
				
				//
				
				retobj = null;
				
				scripts = document.getElementsByTagName("script");
				
				for (var i=0; i<scripts.length; i++)
				{
					src = scripts[i].src;
					
					if (src === "") continue;
					
					//
					
					index_of = src.toLowerCase().indexOf(file.toLowerCase());
						
					if (index_of === -1) continue;
					
					//
					
					retobj = {url:src, path:"", file:"", version:""};
					
					retobj.path	= (src.substring(0, index_of));
					retobj.file	= (src.substr(index_of, file.length));
					
					index_of = src.indexOf("?ver=");
					
					if (index_of > -1)
					{
						retobj.version = src.substring(index_of+5);
					}
					
					break;
				}
				
				return retobj;
			}

		}
	}

	this.lang = new function NAMESPACE__$lang()
	{
	var $lang = this;
	
		//#region FIELD
		
			this.empty_function = function(){};
		
		//#endregion
		
		//#region METHOD
			
			this.extend = function $lang$extend(sub, base, override)
			{
				try
				{
					$.vp
					(
						arguments,
						{
							type:		$.Type.Object
						},
						{
							type:		$.Type.Object
						},
						{
							type:		$.Type.Object,
							optional:	function(){override=false;}
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				return this._extend.apply(this, arguments);
			}
			
			this._extend = function $lang$_extend(sub, base, override)
			{
				for (attribute in base)
				{
					//if (base_obj.hasOwnProperty(attribute) === false) continue;
							
					if ((sub[attribute] !== undefined) && (override === false)) continue;
	
					//
	
					sub[attribute] = base[attribute];
				}
				
				return sub;
			}
			
			this.inherit = function $lang$inherit(sub, base, arguments)
			{
				if (arguments == null)
				{
					base.call(sub);
				}
				else
				{
					base.apply(sub, arguments);
				}
				
				return $.lang._extend({}, sub);
			}
			
			this.inherit2 = function $lang$inherit2(sub, base, exclude_prototype)
			{
				try
				{
					$.vp(arguments, {type:$.Type.Object}, {type:$.Type.Object}, {type:$.Type.Boolean, optional:function(){exclude_protoype=false;}});
				}
				catch(e){throw e;}
	
				//
				
				for (var attribute in base)
				{
					if ((exclude_prototype === true) && (base.hasOwnProperty(attribute) === false)) continue;
							
					//
					
					if (sub[attribute] === undefined)
					{
						sub[attribute] = base[attribute];
						
						//sub[attribute] = function(){var a = base[attribute]; a.apply(sub, arguments);};
						
						//if (typeof(base[attribute]) === "function")
						//{					
						//	base[attribute] = c(base[attribute]);
						//}
					}
				}
							
				//
				
				//function c(method)
				//{
				//	return function(){method.call(sub, arguments);};
				//}
				
				//
				
				return base;
			}
			
			this.is_ud_object = function(object)
			{
			}
			
			this.is_null_or_undefined = function(obj) //deprecated ... == null works
			{
				if (arguments.length !== 1) throw new $.InvalidParameterTypeError("Expected one parameter to test.");
				
				return ((obj === undefined) || (obj === null));
			}
			this.is_nud = function(variant)	//deprecated!
			{
				return (variant == null);
			}
			
			this.for_each = function $lang$for_each(obj, func, context)
			{
				try
				{
					$.vp(arguments, {type:$.Type.Object}, {type:$.Type.Function}, {type:$.Type.Object, optional:function(){context=window;}});
				}
				catch(e){throw e;}
				
				//
				
				return this.__for_each(obj, func, context);
			}
	
			this.__for_each = function $lang$__for_each(obj, func, context)
			{
				var call_loop_function = function $lang$for_each$$call_loop_function()
				{
					result = func.apply(context, [attribute, obj]);
					
					//
					
					if ((func.break_out === true) || func.__out === true)
					{
						delete func["break_out"];
						delete func["breakout"];
						delete func["__out"];
						
						return true;
					}			
					else
					{
						return false;
					}
				}
				
				////
						
				var attribute;	//String
				var result;		//Variant
				
				//
				
				func.breakout = function(){func.breakout=true;};
				
				if ($.lang.is_array(obj) === true) //doesn't work for opera with DOMNodeList!
				{
					for (attribute=0; attribute<obj.length; attribute++)
					{
						if (call_loop_function() === true) break;
					}
				}
				else
				{			
					for (attribute in obj)
					{
						if (obj.hasOwnProperty(attribute) === false) continue;
						
						//
												
						if (call_loop_function() === true) break;
					}
				}
				
				return result;
			}
			
			this.for_item = function(obj, func, context)
			{
				var call_loop_function = function $lang$for_each$$call_loop_function()
				{
					result = func.apply(context, [obj[attribute], attribute]);
					
					//
					
					if (func.break_out === true)
					{
						delete func["break_out"];
						
						return true;
					}			
					else
					{
						return false;
					}
				}
				
				////
						
				var result;		//Variant
				
				//
				
				context = $.lang.ifnu(window, context);
				
				if ($.lang.is_array(obj) === true) //doesn't work for opera with DOMNodeList!
				{
					for (attribute=0; attribute<obj.length; attribute++)
					{
						if (call_loop_function() === true) break;
					}
				}
				else
				{			
					for (var attribute in obj)
					{
						if (obj.hasOwnProperty(attribute) === false) continue;
						
						//
												
						if (call_loop_function() === true) break;
					}
				}
				
				return result;
			}
			
			
					
			this.is_array = function(obj)
			{
				//return $.lang.array.__contains(["Array", "DOMNodeList"], $.GetType(obj));
				
				return ((obj != null) && ((obj.constructor === Array) || ($.GetType(obj) === "DOMNodeList")));
			}
			
			this.is_arguments = function(obj)  //TODO: implement
			{
				if (arguments.length === 0) throw new Error("is arguments can't check if no value specified");
				
				//
				
				//if ()
				//{
				//}
				//else
				//{
				//	return false;
				//}
			}
			
			this.is_interface_def = function(obj)
			{
				if (typeof(obj) !== "object") return false;
				
				for (var attribute in obj)
				{
					//check if attribute name is accessible through dot notation???
					
					if (typeof(obj[attribute]) !== "string") return false;
				}
				
				return true;
			}
			
			this.delay_execute = function $lang$delay_execute(func, milliseconds, context, args)
			{
				try
				{
					$.vp
					(
						arguments,
						{
							type:		"Function"
						},
						{
							type:		"Number",
							optional:	true
						},
						{
							type:		"Object",
							optional:	true
						},
						{
							type:		["Array", "Object"], //replace with [Array, Arguments]
							optional:	true
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				return this.__delay_execute(func, milliseconds, context, args);		
			}
	
			this.__delay_execute = function $lang$__delay_execute(func, milliseconds, context, args)
			{
				var run = function $lang$__delay_execute$$run()
				{
					canceller.expired = true;
					
					func.apply(context, args)
				}
				
				var canceller = function $lang$__delay_execute$$cancel()
				{
					if (canceller.expired) throw new $.InvalidOperationError("The canceller function can not be called after expiration or previous cancellation.");
					
					canceller.expired = true;
					
					clearTimeout(to_id);
				}
				
				////
							
				milliseconds	= $.lang.ifnu(0, milliseconds);
				context			= $.lang.ifnu(window, context);
				args			= $.lang.ifnu([], args);
				
				//
				
				var expires = new Date();
				
				expires.setMilliseconds(expires.getMilliseconds()+milliseconds);
				
				canceller.expires = expires;
	
				//
							
				var to_id = setTimeout(run, milliseconds);		
				
				return canceller;
			}
			
			this.repeat_execute = function $lang$repeat_execute(repeat, func, milliseconds, context, args)
			{
				var canceller = function()
				{
					for (var i=0; i<interval_ids.length; i++)
					{
						window.clearTimeout(interval_ids[i]);
					}
				}
				
				var caller = function()
				{
					var run = function()
					{
						//func.interval = interval;
						
						args[0] = (interval+1);
						
						func.apply(window, args);
					}
					
					////
					
					var interval = i;
					
					interval_ids.push(setTimeout(run, (milliseconds * (i + 1))));
				}
				
				////
				
				try
				{
					$.vp
					(
						arguments,
						{
							type:		"Number",
							elb:		0
						},
						{
							type:		"Function"
						},
						{
							type:		"Number"
						},
						{
							type:		"Object",
							allow_null:	true,
							optional:	function(){context=null;}
						},
						{
							type:		"Array",
							allow_null:	true,
							optional:	function(){args=null;}
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				args = $.lang.ifn([], args);
				
				args.push(null);
				
				//
				
				var interval_ids = new Array();
				
				for (var i=0; i<repeat; i++) //replace with Jenzabar.lang.loop
				{
					caller();
				}
				
				//
				
				return canceller;
			}
			
			this.__interval_execute = function $lang$__interval_execute(func, milliseconds, context, args)
			{
				var run = function()
				{
					func.apply(context, args);
					
					to_id = setTimeout(arguments.callee, milliseconds);
				}
				
				var canceller = function()
				{
					clearTimeout(to_id);
				}
				
				////
				
				var to_id; //Number
				
				//
				
				context = $.lang.ifn(window, context);
				args	= $.lang.ifn([], args);
				
				//
				
				run();
				
				return canceller;
			}
			
			this.parse_json = function $lang$parse_json(json_string, ignore_error)
			{
				if (json_string === "") return undefined;
				
				try
				{
					var obj = eval("(" + json_string + ")");
				}
				catch(e)
				{
					/*
					if (ignore_error)
					{
						return undefined;
					}
					else
					{
						throw new $.ObjectInstantiationError("The json string could not be evaluated.");
					}
					*/
					
					throw new $.ObjectInstantiationError("The json string could not be evaluated.");
				}
				
				return obj;
			}
			
					
			this.is_error = function $lang$is_error(variant)
			{
				return ((variant != null) && (variant.constructor != null) && (variant.constructor === Error));
			}
			
			this.return_value = function(obj, path)
			{
				try
				{
					$.vp(arguments, {type:"Object"}, {type:"String"});
				}
				catch(e){throw e;}
				
				//
				
				var nodes = path.split(".");
				
				var current_obj = obj;
				
				for (var i=0; i<nodes.length; i++)
				{
					current_obj = current_obj[nodes[i]];
				}
				
				//
				
				if (typeof(current_obj) == "function") return current_obj();
				
				return current_obj;
			}
			
			this.is_constructor = function $lang$is_constructor(func)
			{
				try
				{
					$.vp(arguments, {type: "Function"});
				}
				catch(e){throw e;}
				
				//
				
				return this._is_constructor(func);
			}
			
			this._is_constructor = function $lang$_is_constructor(func)
			{
				return ($.reflection.get_function_code(func).indexOf("this.") > -1);
			}
			
			this.ifu = function(value, object, member)
			{
				//make sure 'object' is object
							
				var x; //VaRiAnT
				
				if (typeof(member) == "string")
				{
					x = object[member];
				}
				else
				{
					x = object;
				}
				
				if (x !== undefined) return object;
				
				//
				
				if (typeof(value) == "function")
				{
					value = value();
				}
				
				if (typeof(member) == "string")
				{
					object[member] = value;
				}
				else
				{
					return value;
				}
			}
			
			this.ifn = function(value, object, member)
			{
				//make sure 'object' is object
							
				var x; //VaRiAnT
				
				if (typeof(member) == "string")
				{
					x = object[member];
				}
				else
				{
					x = object;
				}
				
				if (x !== null) return object;
				
				//
				
				if (typeof(value) == "function")
				{
					value = value();
				}
				
				if (typeof(member) == "string")
				{
					object[member] = value;
				}
				else
				{
					return value;
				}
			}
			
			this.ifnu = function(value, object, member)
			{
				//make sure 'object' is object
							
				var x; //VaRiAnT
				
				if (typeof(member) == "string")
				{
					x = object[member];
				}
				else
				{
					x = object;
				}
				
				if (x != null) return object;
				
				//
				
				if (typeof(value) == "function")
				{
					value = value();
				}
				
				if (typeof(member) == "string")
				{
					object[member] = value;
				}
				else
				{
					return value;
				}
			}
			
			this.rename_attribute = function(object, from, to)
			{
				object[to] = object[from];
				
				delete object[from];
			}
		
		//#endregion


		this.array = new function NAMESPACE__$lang$array()
		{
			//#region MEMBER
			
				this.contains = function $lang$array$contains(array, search_item, partial_match, match_function)
				{
					try
					{
						$.vp
						(
							arguments,
							{
								type:		[$.Type.array, GET_LIB_TYPE("$.Array")]
							},
							{
								type:		$.Type.Object
							},
							{
								type:		$.Type.Boolean,
								optional:	true
							},
							{
								type:		$.Type.Function,
								optional:	true
							}
						);
					}
					catch(e){throw e;}
					
					//
					
					return this.__contains(array, search_item, partial_match, match_function);
				}
				
				this.__contains = function $lang$array$__contains(array, search_item, partial_match, match_function)
				{
					for (var i=0; i<array.length; i++)
					{
						if (array[i] === search_item) return true;
		
						if ((partial_match === true) && (array[i].substr(0, search_item.length) === search_item)) return true;
						
						if ((match_function != null) && (match_function(i, array, search_item))) return true;
					}
		
					return false;
				}
		
				this.index_of = function $lang$array$index_of(array, search_item, partial_match, match_function)
				{
					try
					{
						$.vp
						(
							arguments,
							{
								type:		[$.Type.array, GET_LIB_TYPE("$.Array")]
							},
							{
								type:		$.Type.Object
							},
							{
								type:		$.Type.Boolean,
								optional:	true
							},
							{
								type:		$.Type.Function,
								optional:	true
							}
						);
					}
					catch(e){throw e;}
					
					//
					
					return this.__index_of(array, search_item, partial_match, match_function);
				}
				
				this.__index_of = function $lang$array$__index_of(array, search_item, partial_match, match_function)
				{
					for (var i=0; i<array.length; i++)
					{
						if (array[i] === search_item) return i;
		
						if ((partial_match === true) && (array[i].substr(0, search_item.length) === search_item))
						{
							return i;
						}
						else
						{				
							if ((match_function != null) && (match_function(i, array, search_item))) return i;
						}
					}
		
					return -1;
				}
				
				
		
				
				
						
				this.search = function $lang$array$search(array, search_function, return_item)
				{
					try
					{
						$.vp(arguments, {type:$.Type.array}, {type:$.Type.Function}, {type:$.Type.Boolean, optional:function(){return_item=false;}});
					}
					catch(e){throw e;}
					
					//
					
					for (var i=0; i<array.length; i++)
					{
						if (search_function(array[i]) === true)
						{
							if (return_item === true) return array[i];
							else return i;
						}
					}
					
					return -1;	
				}
				
				this.__validate_interface = function $lang$array$__validate_interface(array, interface_def)
				{
					var do_validation = function $lang$array$__validate_interface$$do_validation(i)
					{
						if ($.has_interface(interface_def, array[i]) === false)
						{
							do_validation.break_out = true;
							
							return false;
						}
						
						return true;
					}			
		
					///
		
					if (array.length === 0) return true;
					
					//
					
					return $.lang.for_each(array, do_validation);
				}
				
				this.__validate_type = function $lang$array$__validate_type(array, type)
				{
		function is_type(type, type_to_match)
		{
			switch (type_to_match)
			{
				case "DOMElement":
				{
					return (type.substring(0, 10) === "DOMElement");
				}
				case "DOMElement:Container":
				{
					return ((type.substring(0, 11) === "DOMElement:") && ($.lang.array.__contains($.element.containers, type)));
				}
				default:
				{
					return ($.GetType(array[i]) === type);
				}
			}
		}
					
					for (var i=0; i<array.length; i++)
					{
						if (is_type($.GetType(array[i]), type)) return true;
					}
					
					return false;
				}
				
				this.get_last = function $lang$array$get_last(array)
				{
					if (array.length === 0) throw new $.InvalidArgumentError("The last ordinal cannot be retrieved because the array is empty."); //refine
					
					return array[array.length - 1]; 
				}
				
				this.consolidate = function $lang$array$consolidate(target, source, comparor, splice_source)
				{
					try
					{
						$.vp
						(
							arguments,
							{
								type:		$.Type.array
							},
							{
								type:		$.Type.array
							},
							{
								type:		$.Type.Function
							},
							{
								type:		$.Type.Boolean,
								optional:	true
							}
						);
					}
					catch(e){throw e;}
					
					//
					
					for (var i=0; i<target.length; i++)
					{
						for (var ii=0; ii<source.length; ii++)
						{
							if (comparor(target[i], source[ii]) === true)
							{
								$.lang.extend(target[i], source[ii]);
								
								if (splice_source === true)
								{
									source.splice(ii, 1);
								}
								
								break;
							}
						}
					}
				}
				
				this.create_from_node_list = function(node_list)
				{
					var arr = [];
					
					for (var i=0; i<node_list.length; i++)
					{
						arr.push(node_list[i]);
					}
					
					return arr;
				}
				
				this.from_object = function(object, use_attribute)
				{
					var array = [];
					
					for (var attribute in object)
					{
						if (use_attribute === true)
						{
							array.push(attribute);
						}
						else
						{
							array.push(object[attribute]);
						}
					}
					
					return array;
				}
				
				this.join_on_array = function(array, array_attribute)
				{
					var arr = [];
					
					$.lang.for_item
					(
						array,
						function(item)
						{
							arr.push(item[array_attribute]);
						}
					)
					
					return Array.prototype.concat.apply(Array.prototype, arr);
				}
				
				this.convert = function(array, type)
				{
					switch (type)
					{
						case $.Type.Number:
						{
							for (var i=0; i<array.length; i++)
							{
								array[i] = parseFloat(array[i]);
							}
							
							break;
						}
					}
				}
				
				this.from_arguments = function(arguments_object)
				{
					return Array.prototype.slice.call(arguments_object);
				}
				
			//#endregion

		}

		this.string = new function NAMESPACE__$lang$string()
		{
			this.empty = "";
			
			this.strip_white_space = function string$strip_white_space(string)
			{
				try
				{
					$.vp(arguments, {type:"String"});
				}
				catch(e){throw e;}
				
				//
				
				return string.replace(/^\s*|\s*$/g,'');
			}
			
			this.extract_dimension = function(measurement)
			{
				if (measurement === "") return 0;
				
				var val = "";
				
				for (var i=0; i<measurement.length; i++)
				{
					if (isNaN(measurement.charAt(i))) continue;
					
					val += measurement.charAt(i);
				}
				
				return parseInt(val);
			}
		
		
		        function padleft(val, ch, num) {
		            var re = new RegExp(".{" + num + "}$");
		            var pad = "";
		            if (!ch) ch = " ";
		            do  {
		                pad += ch;
		            }while(pad.length < num);
		            return re.exec(pad + val)[0];
		        }
			
			this.pad_left = function(value, length, character)
			{
				try
				{
					$.vp
					(
						arguments,
						{
							type:		"String"
						},
						{
							type:		"Number"
						},
						{
							type:		"String",
							optional:	function(){character=" ";}
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				var regex = new RegExp(".{" + length + "}$");
				
				var pad = "";
				
		        do
		        {
					pad += character;
		        }
		        while (pad.length < length);
		        
		        return regex.exec(pad + value)[0];
			}
			
			this.pad_right = function(value, length, character)
			{	
				try
				{
					$.vp
					(
						arguments,
						{
							type:		"String"
						},
						{
							type:		"Number"
						},
						{
							type:		"String",
							optional:	function(){character=" ";}
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				var regex = new RegExp("^.{" + length + "}");
				
				var pad = "";
				
				do
				{
					pad += character;
				}
				while (pad.length < length);
				
				return regex.exec(value + pad)[0];
			}
			
			this.to_proper_case = function(str)
			{
				return
				str.toLowerCase().replace
				(
					new RegExp("^(.)|\s(.)/", "g"),
					function(chr)
					{
						return chr.toUpperCase();
					}
				);
			}
			
			this.trim = function(str)
			{
				return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
			}
			
			this.format = function(string, values)
			{
				//vp
				
				//
				
				for (var i=0; i<values.length; i++)
				{
					string = string.replace(new RegExp(("[{]" + i + "[}]"), "g"), values[i]);
					
					
				}
				
				return string;
			}
			
			this.enclose = function(string, encloser)
			{
				switch (encloser)
				{
					case "{":	return ("{" + string + "}");
					case "[":	return ("[" + string + "]");
					case "(":	return ("(" + string + ")");
					case "'":	return ("'" + string + "'");
				}
				
				return string;
			}
			this.enclose.round	= "(";
			this.enclose.square	= "[";
			this.enclose.curly	= "{";

		}

		this.math = new function NAMESPACE__$lang$math()
		{
			this.max = function lang$math$max()
			{
				var sort_desc = function(a, b)
				{
					return (b - a);
				}
		
				////
				
				return Array.prototype.slice.call(arguments).sort(sort_desc)[0];
			}
			
			this.round = function lang$math$round(num, dec)
			{
				var length; //Number
				
				if (dec < 1)
				{
					length = (dec.toString().length - 2);
					
					dec = (1 * (Math.pow(10, length)));
					
				}
				else
				{
					length = (dec.toString().length - 1);
					
					dec = (1 / (Math.pow(10, length)));
				}
		
				num *= dec;
		
				num = Math.round(num);
				
				num /= dec;
				
				//
				
				return num;
			}	
		
			this.precision = function lang$math$precision(num, dec)
			{
				try
				{
					$.vp
					(
						arguments,
						{
							type:	function(){return (!(isNaN(num)));}
						},
						{
							type:	$.Type.Number,
							elb:	0,
							iub:	1
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				num = num.toString();
				
				//Check whether the number is very close to zero.
				if (num.indexOf("E-") !== -1) num = "0";
				
				var length = (dec.toString().length - 2);
				
				if (num.indexOf(".") === -1)
				{
					num += ("." + $.lang.string.pad_right($.String.empty, length, "0"));
				}
				else
				{
					if (num.split(".")[1].length > length)
					{
						num = num.split(".")[0] + "." + num.split(".")[1].substring(0, length);
					}
					else
					{
						num = num.split(".")[0] + "." + $.lang.string.pad_right(num.split(".")[1], length, "0");
					}
				}
				
				if (num.slice(-1) !== "0")
				{
					num = parseFloat(num);
				}
				
				return num;			
			}
			
			this.sort = function(x, y)
			{
				return (x-y);
			}
			
			this.greatest = function(x, y)
			{
				if (x > y) return x;
				
				return y;
			}
		
			this.least = function(x, y)
			{
				if (x < y) return x;
				
				return y;
			}	

		}

		this.np = new function NAMESPACE__$lang$np()
		{
			this.apply = function(np, obj)
			{
				$.lang.for_each
				(
					np,
					function(attr)
					{
						obj[attr] = np[attr]
					}
				);
			}

		}

		this.time = new function NAMESPACE__$lang$time()
		{
			this.round = function(val)
			{	
				var components; //Array-Number
				
				//
				
				components = Array.prototype.concat(val.split(".")[0].split(":"), [val.split(".")[1]]); 
				
				$lang.array.convert(components, "Number");
				
				if (components[3] > 5000000) components[2]++;
				
				components.pop();
				
				if (components[0] === 0) components.shift();
				
				$lang.for_item
				(
					components,
					function(item, index)
					{
						if (item < 10) components[index] = ("0" + components[index]);
					}
				);
						
				return components.join(":");
			}

		}
	}

	this.namespacing = new function NAMESPACE__$namespacing()
	{
		this.append = function(source_obj, target_obj)
		{
			var attribute;	//Object
	
			//
			
			//vv
			
			//
			
			for (attribute in source_obj)
			{
				if (source_obj.hasOwnProperty(attribute) == false) continue;
									
				//
				
				target_obj.constructor.prototype[attribute] = source_obj[attribute];
				//target_obj.prototype[attribute] = source_obj[attribute];
			}
			
			//
			
			source_obj = null;
		}

	}

	this.browser = new function NAMESPACE__$browser()
	{
	var $browser = this;
	
		//\\
		
		//#region FIELD
		
			var _browser_agent;
			
		//#endregion
		
		//#region ENUM
		
			this.browser_enum =	{						//create custom ENUM object with reverse lookup capability
									"Unkown"	:0,
									"Explorer"	:1,
									"Firefox"	:2,
									"Opera"		:3,
									"Chrome"	:4,
									"Safari"	:5
								};
							
		//#endregion
		
		//#region METHOD
			
			this.get_agent = function $browser$get_agent()
			{
				if (_browser_agent == null)
				{
					_browser_agent = new BrowserAgent();
				}
				
				return _browser_agent;
			}
			
			this.false_function = function $browser$false_function()
			{
				return false;
			}
			
		//#endregion
		
		//#region OBJECT
		
			/*
			this.UnifierDef = function OBJECT(browser, func)
			{
				//#region FIELD
				
					this.browser = new String();
					this.func    = new Function();
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					this.__constructor = function jcsfl$browser$UnifierDef()
					{
						this.browser = browser;
						this.func    = func;
					}
					this.__constructor();
					
				//#endregion
			}
			*/
			
			this.Unifier = function $browser$Unifier(unification_object, context, throw_error)
			{
				//#region FIELD
				
					//this.unifier_defs = new $jcsfl.Array("jcsfl$browser$UnifierDef");
					
				//#endregion
				
				//#region METHOD
					
					/*
					this.call = function jcsfl$browser$Unifier$call(context)
					{
						for (var i=1; i<this.unifier_defs.length; i++)
						{
							if (this.unifier_defs[i].browser == $browser.get_agent().name)
							{
								return this.unifier_defs[i].func.call(context);
							}
						}
						
						return this.unifier_defs[0].func.call(context);
					}
					*/
					
					this.call = function()
					{
						var method; //Function
						
						//
						//instantiate the Unification Object if not yet instantiated
						
						if (typeof(unification_object) === "function")
						{
							unification_object = new unification_object();
						}
						
						//
						
						method = unification_object[$browser.get_agent().name.toLowerCase()];  //need to make case insensitive!!!   and check it is an actual functin to execute
						
						if (method === undefined)
						{
							method = unification_object["generic"];
						}
						
						if (method !== undefined)
						{
							if (context === null)
							{
								return method();
							}
							else
							{
								return method.call(context);
							}
						}
					}
					
				//#endregion
				
				//#region CONSTRUCTOR
				
					//this.call.apply(this, arguments);
					
					try
					{
						$.vp(arguments, [{type:["Object", "Function"]}, {type:"Object", allow_null:true, optional:function(){context=null;}}, {type:"Boolean", optional:function(){throw_error=true;}}]);
					}
					catch (e)
					{
						throw e;
					}
					
					//
					
					this.call();
					
				//#endregion
			}
			
			
			
			
			
			
			
			
					
			var BrowserAgent = function $browser$$BrowserAgent()
			{
				//#region FIELD
				
					this.vender;			//String
					this.name;				//String
					this.version_string;	//String
					this.version;			//Number
					this.uid;				//Number
					
					this.full_name;			//String
				
				//#endregion
				
				//#region ROUTINE
				
					var determine = function $browser$$BrowserAgent$determine()
					{
						var nav = window.navigator;
						
						if ((nav.appName === "Microsoft Internet Explorer") && (nav.appCodeName === "Mozilla"))
						{
							this.vendor			= "Microsoft";
							this.name			= "Explorer";
							this.version_string	= get_version_IE(window.navigator.userAgent);
							this.version		= parseFloat(this.version_string);
							this.uid			= (parseInt($browser.browser_enum["Explorer"] + "00") + this.version);
						}
						else if ((nav.appName === "Netscape") && (nav.appCodeName === "Mozilla") && (nav.vendor === ""))
						{
							this.vendor			= "Mozilla";
							this.name			= "Firefox";
							this.version_string	= get_version_FF(window.navigator.userAgent);
							this.version		= parseFloat(this.version_string);
							this.uid			= (parseInt($browser.browser_enum["Firefox"] + "00") + this.version);
						}
						else if (nav.appName === "Opera")
						{
							this.vendor			= "Opera";
							this.name			= "Opera";
							this.version_string	= get_version_OP(window.navigator.userAgent);
							this.version		= parseFloat(this.version_string);
							this.uid			= (parseInt($browser.browser_enum["Opera"] + "00") + this.version);
						}
						else if (nav.vendor === "Google Inc.")
						{
							this.vendor			= "Google";
							this.name			= "Chrome";
							this.version_string	= get_version_CH(window.navigator.userAgent);
							this.version		= parseFloat(this.version_string);
							this.uid			= (parseInt($browser.browser_enum["Chrome"] + "00") + this.version);
						}
						else if (nav.vendor === "Apple Computer, Inc.")
						{
							this.vendor			= "Apple";
							this.name			= "Safari";
							this.version_string	= get_version_SA(window.navigator.userAgent);
							this.version		= parseFloat(this.version_string);
							this.uid			= (parseInt($browser.browser_enum["Safari"] + "00") + this.version);
						}
						
						if (this.vendor.length === 0)
						{
							this.vendor = "unknown";
							
							this.full_name = this.vendor;
						}
						else
						{
							this.full_name = (this.vendor + " " + this.name + " v" + this.version);
						}
					}
				
					var get_version_IE = function $browser$$BrowserAgent$get_version_IE(user_agent)
					{
						var key = user_agent.indexOf("MSIE");
						
						return user_agent.substring((key + 5), user_agent.indexOf(";", key));
					}
					
					var get_version_FF = function $browser$$BrowserAgent$get_version_FF(user_agent)
					{
						var key = user_agent.indexOf("Firefox");
						
						return user_agent.substring((key + 8), user_agent.indexOf(" ", key));
					}
					
					var get_version_OP = function $browser$$BrowserAgent$get_version_OP(user_agent)
					{
						var key = user_agent.indexOf("Opera");
						
						return user_agent.substring((key + 6), (user_agent.indexOf("(", key) - 1));
					}
					
					var get_version_CH = function $browser$$BrowserAgent$get_version_CH(user_agent)
					{
						var key = user_agent.indexOf("Chrome");
						
						return user_agent.substring((key + 7), user_agent.indexOf(" ", key));
					}			
					
					var get_version_SA = function $browser$$BRowserAgent$get_version_SA(user_agent)
					{
						var key = user_agent.indexOf("Safari");
						
						return user_agent.substring((user_agent.substring(0, key).lastIndexOf("/") + 1), (key - 1));
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					determine.call(this);
				
				//#endregion
			}
		
		//#endregion

	}

	this.GetType = function $GetType(obj)
	{
		var resolve_full_name = function(fn)
		{
			fn = new $.String(fn);
			
			fn = fn.global_replace("__CLASS", "");
			fn = fn.global_replace("$$", "+").global_replace("$", ".");
			
			return (LIB_NAME + fn)
		}
		
		////
		
		if (obj === undefined) throw new Error("no object provided!");
		
		if (obj === null) return null;
		
		if (obj.nodeType)
		{
			switch (obj.nodeType)
			{
				case 1:
				{
					var element_type = ("DOMElement:" + obj.tagName.toLowerCase());
					
					if (element_type === "DOMElement:input")
					{
						var type_attribute = new String();
	
						//
	
						type_attribute = obj.getAttribute("type");
	
						element_type += ("_" + ((type_attribute === null) ? "text" : type_attribute));
					}
					
					return element_type;
				}
				case 3:  return "text_node";
				case 8:  return "DOMComment"
				case 9:  return "DOMDocument";
				case 11: return "DOMDocumentFragment";
				default: return "DOMUnknown";
			}
		}
		
		if (obj.constructor)
		{
			if (obj.constructor === Error)
			{
				//return (LIB_NAME + "." + ((obj.type.substr(0, 3) === "RPC") ? "ajax." : "") + obj.type); //refine
				
				fn = new $.String($.reflection.get_function_name(obj.__constructor.constructor));
				
				fn = fn.global_replace("__CLASS", "");
				fn = fn.global_replace("$$", "+").global_replace("$", ".");
				
				return (LIB_NAME + fn);
			}
				
			if (typeof(obj.constructor.toString) === "unknown")
			{
				switch (obj.constructor.toString())
				{
					case "[object XMLHttpRequest]":
					{
						return "XMLHttpRequest"; //ie, ...
					}
					case "[object HTMLCollection]":
					{
						return "DOMNodeList"; //ie, ...
					}
					case "[object Window]":
					{
						return "DOMWindow"; //ie, ...
					}
				}	
			}
			
			if (typeof(obj.toString) === "function")
			{
				switch (obj.toString())
				{
					case "[object Window]":
					{
						return "DOMWindow"; //FireFox
					}
					case "[object DOMWindow]":
					{
						return "DOMWindow"; //Safari
					}
					case "[object HTMLCollection]":
					{
						return "DOMNodeList"; //FireFox
					}
					case "[object NodeList]":
					{
						return "DOMNodeList"; //Opera, Safari
					}
				}
			
				//
				//DOMEventInterface
				
				if (obj.toString() === "[object MouseEvent]") //or if (obj.constructor == "[object MouseEventConstructor]")
				{ 
					return "DOMEventInterface"; //Chrome, Firefox, Opera, Safari
				}
				
				if (obj.toString() === "[object KeyboardEvent]") //or if (obj.constructor == "[object KeyboardEventConstructor]")
				{
					return "DOMEventInterface"; //Firefox, Chrome, Safari
				}
				
				if (obj.toString() === "[object KeyEvent]") //or if (obj.constructor == "[object KeyboardEventConstructor]")
				{
					return "DOMEventInterface"; //Opera
				}
			}
			
			//
			//determine from constructor
	
			var fn = $.reflection.get_function_name(obj.constructor);
			
			if (fn == "") return "Object";
	
			if (fn == "{unnamed}")
			{		
				var source = $.reflection.get_function_code(obj.constructor);
				
				try
				{
					var type = new RegExp("function\\s*\\([\\w\\d\\s$,]*\\)\\s*{\\s*typeof\\s*\"*[\\w\\d$+.]*\"*\\s*;").exec(source)[0];
				}
				catch(e){return "Object";}
				
				type =
				JCSL.lang.array.get_last
				(
					type
					.split("typeof ")[1]
					.replace(";", "")
					.replace(/\"/g, "")
					.replace(/\s/g, "")
					.replace(/\+/g, ".")
					.split(".")
				);
				
				/*
				GetType
				get_type
				
				GetFullName
				get_full_name
				
				GetTypeName
				get_type_name
				
				GetType should return a type representing object
				*/
				
				if (type.substr(0, 1) == "$")
				{
					return resolve_full_name(type);
				}
	
				return type;
			}
				
			//
						
			if (fn.substr(0, 1) == "$")
			{
				return resolve_full_name(fn);
			}
			
			return fn; //String, Array, Number, ...
		}
		
		if (obj === window) return "DOMWindow" //Explorer  ...check it works with external windows   //REVISE
		
		if ((typeof(obj) === "object") && (typeof(obj.length) === "number"))  return "DOMNodeList"; //Explorer   //REVISE
		
		if ($.dom_event.is_event_object(obj)) return "DOMEventInterface"; //Explorer  //REVISE
		
		return "unknown";	
		
		/*
		
		//////////////////////////////////////
		
		if (obj.nodeType == null)
		{
			if (obj.constructor == null)
			{
				if (obj === window) return "DOMWindow" //Explorer  ...check it works with external windows
				
				if ((typeof(obj) === "object") && (typeof(obj.length) === "number"))  return "DOMNodeList"; //Explorer
				
				if ($.dom_event.is_event_object(obj)) return "DOMEventInterface"; //Explorer
				
				return "unknown";
			}
			else
			{
				if (typeof(obj.constructor.toString) === "unknown")
				{
					switch (obj.constructor.toString())
					{
						case "[object XMLHttpRequest]":
						{
							return "XMLHttpRequest"; //ie, ...
						}
						case "[object HTMLCollection]":
						{
							return "DOMNodeList"; //ie, ...
						}
						case "[object Window]":
						{
							return "DOMWindow"; //ie, ...
						}
					}	
				}
				
				if (typeof(obj.toString) === "function")
				{
					switch (obj.toString())
					{
						case "[object Window]":
						{
							return "DOMWindow"; //FireFox
						}
						case "[object DOMWindow]":
						{
							return "DOMWindow"; //Safari
						}
						case "[object HTMLCollection]":
						{
							return "DOMNodeList"; //FireFox
						}
						case "[object NodeList]":
						{
							return "DOMNodeList"; //Opera, Safari
						}
					}
				
					//
					//DOMEventInterface
					
					if (obj.toString() === "[object MouseEvent]") //or if (obj.constructor == "[object MouseEventConstructor]")
					{ 
						return "DOMEventInterface"; //Chrome, Firefox, Opera, Safari
					}
					
					if (obj.toString() === "[object KeyboardEvent]") //or if (obj.constructor == "[object KeyboardEventConstructor]")
					{
						return "DOMEventInterface"; //Firefox, Chrome, Safari
					}
					
					if (obj.toString() === "[object KeyEvent]") //or if (obj.constructor == "[object KeyboardEventConstructor]")
					{
						return "DOMEventInterface"; //Opera
					}
				}
				
				//
				//determine from constructor
	
				var fn = $.reflection.get_function_name(obj.constructor);
	
				if (fn.length === 0)
				{
					var source = $.reflection.get_function_code(obj.constructor);
					
					return "";
				}
				
				//
				
				if (obj.constructor === Error)
				{
					//return (LIB_NAME + "." + ((obj.type.substr(0, 3) === "RPC") ? "ajax." : "") + obj.type); //refine
					
					fn = new $.String($.reflection.get_function_name(obj.__constructor.constructor));
					
					fn = fn.global_replace("__CLASS", "");
					fn = fn.global_replace("$$", "+").global_replace("$", ".");
					
					return (LIB_NAME + fn);
				}
				
				//
							
				if (fn.substr(0, 1) === "$")
				{
					fn = new $.String(fn);
					
					fn = fn.global_replace("__CLASS", "");
					fn = fn.global_replace("$$", "+").global_replace("$", ".");
					
					return (LIB_NAME + fn)
				}
				
				return fn; //String, Array, Number, ...
			}
		}
		else
		{
			switch (obj.nodeType)
			{
				case 1:
				{
					var element_type = ("DOMElement:" + obj.tagName.toLowerCase());
					
					if (element_type === "DOMElement:input")
					{
						var type_attribute = new String();
	
						//
	
						type_attribute = obj.getAttribute("type");
	
						element_type += ("_" + ((type_attribute === null) ? "text" : type_attribute));
					}
					
					return element_type;
				}
				case 3:  return "text_node";
				case 8:  return "DOMComment"
				case 9:  return "DOMDocument";
				case 11: return "DOMDocumentFragment";
				default: return "DOMUnknown";
			}
		}
		*/

	}

	this.has_interface = function $has_interface(interface_obj, obj)
	{
		try
		{
			$.vp(arguments, [{type:"Object", validation:function(){return $.lang.is_interface_def(interface_obj);}}, {type:"Object"}]);
		}
		catch (e)
		{
			throw e;
		}
	
		//
		
		return this.__has_interface(interface_obj, obj);
	}
	
	this.__has_interface = function $__has_interface(interface_obj, obj) //not used in vv anymore, OBSOLETE!?
	{
		/*
		var check_for_each_type = function $__has_interface$$check_for_each_type(allowed_type)
		{
			if (type === allowed_types[allowed_type])
			{
				check_for_each_type.break_out = true;
				
				return true;
			}
			
			return false;
		}
		
		////
		*/
		
		var attribute1;		//String
		var found;			//Boolean
		var allowed_types;	//Array
		
		//
		
		for (attribute1 in interface_obj)
		{
			//if (interface_obj.hasOwnProperty(attribute1) === false) continue; //refine
			
			//
			
			allowed_types = interface_obj[attribute1].split(",");
			
			if ((obj[attribute1] === undefined) && ($.lang.array.__contains(allowed_types, "undefined")))
			{
				continue;
			}
			
			found = false;
			
			for (attribute2 in obj)
			{
				if (attribute2 !== attribute1)
				{
					continue;
				}
				
				//
	
				//type = $.GetType(obj[attribute2]);
				
				//TODO: trim white space around qualifiers
				
				$.lang.for_each
				(
					allowed_types,
					function(attribute)
					{
						if (allowed_types[attribute] === "null")
						{
							allowed_types[attribute]=null;
						}
					}
				);
				
				//found = ($.lang.for_each(allowed_types, check_for_each_type));
				
				if ($.lang.array.__contains(allowed_types, $.GetType(obj[attribute2])))
				{
					found = true;
					
					continue;
				}
				
				/*
				for (var allowed_type in allowed_types)
				{
					if (type === allowed_types[allowed_type])
					{
						found = true;
						
						break;
					}
				}
				
				if (found === true)
				{
					break;
				}
				*/
				
				/*
				if (type === interface_obj[attribute1])
				{
					found = true;
					
					break;
				}
				*/
			}
			
			//
			
			if (found === false)
			{
				return false;
			}
		}
		
		return true;

	}

	this.String = function $String__CLASS(string)
	{typeof "$String__CLASS";
		//#region VARIABLE
		
			var _str; //String;
			
		//#endregion
		
		//#region ROUTINE
		
			var value = function(string)
			{
				return new $.String(string);
			}
			
			var clear = function()
			{
				return new $.String("");
			}
			
			var prepend = function(string)
			{
				return new $.String(string + this.valueOf());
			}
			
			var append = function(string)
			{
				return new $.String(_str.valueOf().concat(string));
			}
			
			var trim = function()
			{
				return new $.String(_str.valueOf().replace(/^\s\s*/, '').replace(/\s\s*$/, ''));
			}
			
			var namespaced = function()
			{
				return new $.String(_str.valueOf().replace(new RegExp("[A-Z]", "g"), function(character, index){return (" " + character);}).substr(1));
			}
			
			var global_replace = function(from, to)
			{
				return new $.String(_str.valueOf().replace(new RegExp(from.replace(/([\^\$\\\.\+\*\?\{\}\(\)\|\[\]])/g, '\\$1'), "g"), to));
			}
			
			var to_proper_case = function()
			{
				return new $.String(_str.valueOf().toLowerCase().replace(new RegExp("^(.)|\s(.)/", "g"), function(character){return character.toUpperCase();}));
			}
			
			var within = function(string_array) //DEPRECATED
			{
				return $.lang.array.contains(string_array, _str.valueOf());
			}
			
			var insert = function(index, string)
			{
				return new $.String(_str.valueOf().substring(0, index) + string + _str.valueOf().substr(index));
			}
			
			var substr = function(start, end)
			{
				return new $.String(_str.valueOf().substr(start, end));
			}	
		
		//#endregion
		
		//#region CONSTRUCTOR
	
			try
			{
				$.vp(arguments, {type:"String", allow_null:true});
			}
			catch(e){throw e;}
			
			//
			
			if (string === null)
			{
				_str = new String();
			}
			else
			{
				_str = new String(string);
			}
			
			//
			
			_str.value			= value;
			_str.clear			= clear;
			_str.prepend		= prepend;
			_str.append			= append;			
			_str.concat			= append;
			_str.trim			= trim;					
			_str.namespaced		= namespaced;
			_str.global_replace	= global_replace;
			_str.to_proper_case	= to_proper_case;
			_str.within			= within;
			_str.insert			= insert;
			_str.substr			= substr;
			
			//
			
			return _str;
		
		//#endregion

	}

	this.vv = function $vv(value, rules)
	{
		//expected_value					VaRiAnT
		//type								String, Array
		//allow_null						Boolean
		//allow_undefined					Boolean
		//default_value						VaRiAnT
		//default_value_must_match_type		Boolean
		
		var examine_node_list = function $vv$$examine_node_list()
		{
			var look_for_dom_node_list = function(property)
			{
				if ((rules.type[property].length > 12) && (rules.type[property].substring(0, 12) === "DOMNodeList:"))
				{
					arguments.callee.break_out = true;
					
					return rules.type[property].split(":")[1];
				}
				
				return null;
			}
			
			var compare_element = function(element)
			{
				if ($.GetType(value[element]) !== ("DOMElement:" + tagname))
				{
					arguments.callee.break_out = true;
					
					return false;
				}
				
				return true;
			}
			
			////
			
			var tagname = $.lang.__for_each(rules.type, look_for_dom_node_list);
			
			if (tagname === null) return false;
			
			return $.lang.for_each(value, compare_element);
		}
		
		var return_default_value = function $vv$$return_default_value()
		{
			rules.default_value = rules.value; //TEMPORARY
			
			if (rules.default_value === undefined)
			{
				if (value == null)
				{
					switch (typeof(rules.optional))
					{
						case $.NativeType.Function:
						{
							return rules.optional();
						}
						case $.NativeType.Boolean:
						{
							return value;
						}
					}
				}
				else
				{
					throw new $.InvalidTypeError("Expected value of type '" + new $.String(rules.type.toString()).global_replace(",", ", ") + "' instead of '" + ((value === undefined) ? "undefined" : $.GetType(value)) + "'." + ((typeof(rules.error_msg) === "string") ? ("\n" + rules.error_msg) : ""));
				}
			}
			else
			{
				var new_value;
				
				if (typeof(rules.default_value) === $.NativeType.Function)
				{
					new_value = rules.default_value();
				}
				else
				{
					new_value = rules.default_value;
				}
				
				if ($.lang.array.__contains(rules.type, $.GetType(new_value))) //duplicated... should be turned into function
				{
					if ((value === undefined) && (typeof(rules.optional) === $.NativeType.Function))
					{
						rules.optional(new_value);
						
						return rules.optional;
					}
					
					return new_value;
				}
				else
				{
					if (($.lang.array.__contains(rules.type, $.Type.DOMElement)) && ((type !== null) && (type.substring(0, 10) === $.Type.DOMElement))) //duplicated... should be turned into function
					{
						return new_value;
					}
					
					if ((type === $.Type.DOMNodeList) && (examine_node_list() === true)) return new_value;
	
					
					//
								
					if (rules.default_value_must_match_type === undefined)
					{
						/*
						if (rules.default_value === null)
						{
							if (rules.allow_null === true)
							{
								if ((value === undefined) && (typeof(rules.optional) === "function"))
								{
									rules.optional(new_value);
									
									return null;
								}
							}
							else
							{
								throw new Error("Either the rule 'default_value_must_match_type' or 'allow_null' must be specified for the given validation."); 
							}
						}
						else
						{
							throw new Error("The rule 'default_value_must_match_type' must be specified for the given validation."); 
						}
						*/
						
						throw new Error("The rule 'default_value_must_match_type' must be specified for the given validation."); 
					}
	
					if (rules.default_value_must_match_type === false)
					{
						if ((value === undefined) && (typeof(rules.optional) === $.NativeType.Function))
						{
							rules.optional(new_value);
							
							return rules.optional;
						}
						
						return new_value;
					}
					
					if (rules.default_value_must_match_type === true) throw new Error("The 'default_value' type must match the 'type'.");
				}
			}
		}
	
		////
		
		var type;	//String
		var po;		//Number
		
		//
		//if undefined value is allowed and value is undefined then return undefined
		
		if ((value === undefined) && (rules.allow_undefined === true)) return undefined;
		
		//
		//if null value is allowed and vairable is null then return null
		
		if ((value === null) && (rules.allow_null === true)) return null;
	
		//
		//if an 'expected_value' is defined and matches the given value return the value
		
		if (rules.expected_value !== undefined)
		{
			if (value === rules.expected_value) return value;
			
			return return_default_value();
		}
		
		//
		//if no type is defined then return the value
		
		if (rules.type === undefined) return value;
		
		//
		//validate 'type' and convert to Array if String was passed in
		
		switch (typeof(rules.type))
		{
			case $.NativeType.String:
			{
				rules.type = [rules.type];
				
				break;
			}
			case $.NativeType.Function: //TODO: upgrade to accept String type as return type
			{
				if (rules.type() === true) return value;
				
				return return_default_value();
			}
			default:
			{
				if ($.lang.is_array(rules.type) === false) throw new $.InvalidParameterTypeError("The 'type' rule must be of type String or Array.");
				
				//TODO: validate it's an array of strings!
				
				break;
			}
		}
			
		//
		//if value matches the type then return the value
	
		if (value !== undefined) //refine if 1/2
		{
			if ($.lang.array.__contains(rules.type, $.Type.Object) && value != null) return value; //refine if 2/2
			
			type = $.GetType(value); //may want to attept a typeof first for sake of performance... or refine GetType
			
			//
			//check for Object
				
			if (($.lang.array.__contains(rules.type, $.Type.Object)) && ($.lang.is_nud(value) === false)) //need to make sure it is a JS object and not a element...
			{
				if ($.lang.is_interface_def(rules.interface_def) === true) //throw error if rules.interface_def exists but not an interface_def ???
				{
					if ($.has_interface(rules.interface_def, value) === true) return value;
					
					throw new $.InvalidValueError("The object does not support the defined interface.");
				}
				
				return value;
			}
			
			//
			//check for Array
				
			if (($.lang.array.__contains(rules.type, $.Type.Array)) && (type === $.Type.Array))
			{
				if ($.lang.is_interface_def(rules.array_interface_def) === true) //throw error if rules.interface_def exists but not an interface_def ???
				{
					if ($.lang.array.__validate_interface(value, rules.array_interface_def) === true) return value;
					
					throw new $.InvalidValueError("The array contains an object that does not support the defined interface.");
					
					/*
					if ($.lang.for_each(value, x) === true)
					{
						return value;
					}
					else
					{
						throw new $.InvalidValueError("The array contains an object that does not support the defined interface.");
					}
					
					function x(i)
					{
						if ($.has_interface(rules.array_interface_def, value[i]) === false)
						{
							x.break_out = true;
							
							return false;
						}
						
						return true;
					}
					*/			
				}
				
				return value;
			}
			
			//
			//check for typed Arraa   todo: refine to support multiple typed Arrays
			
			po = $.lang.array.__index_of(rules.type, "Array-", true);
			
			if ((type === $.Type.Array) && (po > -1))
			{
				if ($.lang.array.__validate_type(value, rules.type[po].split("-")[1]) === true) return value;
				
				throw new $.InvalidValueError("The array contains an object that is not type consistant.");
			}
				
			if ($.lang.array.__contains(rules.type, $.Type.DOMElementContainer))
			{		
				if ($.lang.array.__contains($.element.containers, type)) return value;
			}
			
			if (($.lang.array.__contains(rules.type, $.Type.DOMElement)) && ((type !== null) && (type.substring(0, 10) === $.Type.DOMElement))) //duplicated... should be turned into function
			{
				return value;
			}
	
			if (type === $.Type.DOMNodeList)
			{		
				if (examine_node_list() === true) return value;
			}			
	
			
			if ($.lang.array.__contains(rules.type, type)) //duplicated... should be turned into function
			{
				switch (typeof(value))
				{
					case $.NativeType.Number:
					{
						if (typeof(rules.ilb) === $.NativeType.Number)
						{
							if (!(value >= rules.ilb)) throw new $.InvalidValueError("The value (" + value + ") must be greater than or equal to " + rules.ilb.toString() + ".");
						}
	
						if (typeof(rules.elb) === $.NativeType.Number)
						{
							if (!(value > rules.elb)) throw new $.InvalidValueError("The value (" + value + ") must be greater than " + rules.elb.toString() + ".");
						}
						
						if (typeof(rules.iub) === $.NativeType.Number)
						{
							if (!(value <= rules.iub)) throw new $.InvalidValueError("The value (" + value + ") must be less than or equal to " + rules.iub.toString() + ".");
						}
	
						if (typeof(rules.eub) === $.NativeType.Number)
						{
							if (!(value < rules.eub)) throw new $.InvalidValueError("The value (" + value + ") must be less than " + rules.eub.toString() + ".");
						}
					}
				}
				
				return value;
			}
		}	
		
		return return_default_value();

	}

	this.vp = function $vp(args, rules)
	{
		var check_optional_params = function $vp$$check_optional_params()
		{
			var param_diff = (args.callee.length - args.length);
			
			if (param_diff === 0) return true;
			
			for (var i=(rules.length-param_diff); i<rules.length; i++)
			{
				switch (typeof(rules[i].optional))
				{
					case "function":
					case "boolean":
					{
						continue;
					}
					default:
					{
						return false;
					}
				}
				
				/*
				if (typeof(rules[i].optional) !== "function")
				{
					return false;
				}
				*/
			}
			
			return true;
		}
		
		////
		
		//check args for rare case that rules is not an array but multiple rules_object params
		
		//
		
		//if (args.callee.length === 0)
		//{
		//	throw new $.GenericError("Parameter Validation (VP) requires the Function to have at least one parameter.");
		//}
		
		//
		
		
		
		//
		
		if ($.lang.is_array(rules) === false)
		{
			rules = $.lang.array.from_arguments(arguments).slice(1);
		}
			
		//
		
		if (rules.length !== args.callee.length) throw new $.GenericError("Rules parameter count must match Function parameter count.");
		
		if (check_optional_params() === false) throw new $.InvalidParameterTypeError("Parameter not optional."); //revise message
		
		//
		
		var param_names = $.reflection.get_function_parameter_names(args.callee);
		
		for (var i=0; i<rules.length; i++)
		{
			try
			{
				if ((args[i] === null) && (rules[i].allow_null !== true) && (rules[i].optional !== undefined))
				{
					$.vv(undefined, rules[i]);
				}
				else
				{
					$.vv(args[i], rules[i]);
				}
			}
			catch (e)
			{
				throw new $.InvalidParameterTypeError("Parameter: " + param_names[i] + "\n\n" + e.additionals[0], e); //inner exception message should append automatically! REVISE!
			}
		}

	}

	this.vpo = function $vpo()
	{
	
	
	
	
	
	
	
	
	

	}

	this.vo = function $vo(obj, def)
	{
		//vp
		//
		
		for (var i=1; i<arguments.length; i++)
		{
			obj[arguments[i].named] = $.vv(obj[arguments[i].named], arguments[i]);
		}

	}

	this.Array = function $Array__CLASS(type, array)
	{typeof "$Array__CLASS";
		//#region FUNCTION
		
			function create_array()
			{
				var arr; //Array
				
				//
				
				if ($.lang.is_null_or_undefined(array) === true)
				{
					arr = new Array();
				}
				else
				{
					arr = array;
					
					//check array members is compatible with type parameter
				}
				
				//
				
				arr._$push = arr.push;
				
				//
				
				arr.type = type;
				
				arr.push =	function $Array$push(item)
							{
								if ($.GetType(item) != this.type)
								{
									throw new $.InvalidTypeError("Expected \"" + this.type + "\", not \"" + $.GetType(item) + "\"");
								}
								
								this._$push(item);
							}
								
				arr.find =	function $Array$find(item)
							{
								if ($.GetType(item) != this.type)
								{
									throw new $.InvalidTypeError("Expected \"" + this.type + "\", not \"" + $.GetType(item) + "\"");
								}
								
								for (var i=0; i<this.length; i++)
								{
									if (this[i] == item)
									{
										return i;
									}
								}
								
								return -1;
							}
								
				arr.get_last = $Array$get_last;
				
				//
				
				return arr;
			}
			
			/*
			function jcsfl$Array$push(item)
			{
				if ($.GetType(item) != this.type)
				{
					throw new $.InvalidTypeError("Expected \"" + this.type + "\", not \"" + $.GetType(item) + "\"");
				}
				
				this._$push(item);
			}
			*/
			
			function $Array$get_last()
			{
				return this[this.length-1];
			}
			
		//#endregion
		
		//#region CONSTRUCTOR
		
			this.__constructor = function $Array(args)
			{
				try
				{
					$.vp(args, [{type:"String"}, {type:"Array", allow_null:true, allow_undefined:true, optional:function(){array=null;}}]);
				}
				catch (e)
				{
					throw e;
				}
							
				//
				
				return create_array();
			}
			return this.__constructor.call(this, arguments);
		
		//#endregion

	}

	this.layering = new function NAMESPACE__$layering()
	{
	var $layering = this;
			
		//\\
		
		//#region FIELD
		
			var manager;		//LayerManager
			
			var top_z_index;	//Number
		
		//#endregion
		
		//#region METHOD
		
			this.get_manager = function $layering$get_manager()
			{
				if (manager === undefined)
				{
					manager = new LayerManager();
				}
				
				return manager;
			}
			
			this.get_top_z_index = function $layering$get_top_z_index(parent)
			{
				var elements;	//DOMNodeList
				var length;		//Number
				var top;		//Number
				var i;			//Number
				var css;		//CSSStyleSheet
				var z_index;	//Number
				
				//
				
				try
				{
					$.vp(arguments, {
										type:		["DOMDocument", "DOMElement"],
										optional:	function(){parent=window.document;}
									});
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				top = 0;
				
				elements = parent.getElementsByTagName("*");
				
				length = elements.length;
				
				for (i=0; i<length; i++)
				{
					css = $.element._get_css(elements[i]);
					
					switch (css.position)
					{
						case "absolute":
						case "fixed":
						case "relative":
						case "static":
						{
							switch (css.zIndex)
							{
								case "auto":
								case "0":
								{
									break;
								}
								default:
								{
									zIndex = parseInt(css.zIndex);
									
									if (zIndex > top)
									{												
										top = zIndex;
									}
								}
							}
						}
					}
				}
							
				return top;
			}
			
		//#endregion
		
		//#region OBJECT
		
			this.Layer = function()
			{
				//#region PROPERTY
				
					this.index		= new Number();
					this.name		= new String();
					this.elements	= new Array();   //should be NodeList
				
				//#endregion
				
				//#region CONSTRUCTOR		
				//#endregion
			}
			
			function LayerManager()
			{
				//#region FIELD
				
					/*
					this.layers			= new $.Array("jcsfl$layering$Layer");  //FIX TO BE : jcsfl.Layer
					this.layer_indexes	= new $.Array("Number");		//test with no constructor parameter!
					*/
				
				//#endregion
				
				//#region METHOD
					
					this.request_layer = function()
					{
					}
					
					this.return_layer()
					{
					}
					
					/*
					this.refresh = function jcsfl$layering$LayerManager$refresh()
					{
						var list = new $.NodeList();
											
						//
						
						list = document.getElementsByTagName("*");
						
						this.layer_indexes.length = 0;
						this.layers.length        = 0;
						
						for (var i=0; i<list.length; i++)
						{
							var found = new Number();
							var zi	  = new Number();
							var layer = new $.layering.Layer();
							
							//
							
							zi = parseInt(list[i].style.zIndex);
							
							found = this.layer_indexes.find(zi);
							
							if (found == -1)
							{
								this.layer_indexes.push(zi);
								
								//
								
								this.layers.push(new $.layering.Layer());
								
								layer = this.layers[this.layers.length - 1];
								
								layer.index = zi;
								layer.name = "";
							}
							else
							{
								layer = this.layers[found];
							}
							
							layer.elements.push(list[i]);
							
							this.layer_indexes.sort().reverse();
						}
					}
					*/
					
				//#endregion
				
				//#region FUNCTION
				
					function compare_z(value1, value2)
					{
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
				//#endregion
			}
			
		//#endregion

	}

	this.object = new function NAMESPACE__$object()
	{
		this.attach_event = function(object_handle, event_name, function_pointer)
		{
			try
			{
				$.vp(arguments, [{type:["DOMElement", "DOMWindow", "DOMDocument"]}, {type:"String"}, {type:"Function"}]);
			}
			catch (e)
			{
				throw e;
			}
			
			//
			
			if (($.reflection.is_element(object_handle) === true) || ($.GetType(object_handle) === "DOMWindow") || ($.GetType(object_handle) === "DOMDocument"))
			{
				$.element.attach_event(object_handle, event_name, function_pointer);
			}
			else
			{
				if ($.GetType(object_handle[event_name]) === "Event")
				{
					object_handle[event_name].attach(function_pointer);
				}
				else
				{
					throw new Error("not an event!");
				}
			}
		}
	
		this.detach_event = function(object_handle, event_name, function_pointer) //old vv
		{
			try
			{
				$.vp(arguments, [{type:["DOMElement", "DOMWindow", "DOMDocument"]}, {type:"String"}, {type:"Function"}]);
			}
			catch (e)
			{
				throw e;
			}
	
			//
			
			if (($.reflection.is_element(object_handle) == true) || ($.GetType(object_handle) == "DOMWindow") || ($.GetType(object_handle) == "DOMDocument"))
			{
				$.element.detach_event(object_handle, event_name, function_pointer);
			}
			else
			{
				if ($.GetType(object_handle[event_name]) == "Event")
				{
					object_handle[event_name].detach(function_pointer);
				}
				else
				{
					throw new Error("not an event!");
				}
			}
		}
		
		this.fire_event = function()
		{
			//need to implement
		}
		
		this.get_attribute_count = function(obj, prototyped)
		{	
			try
			{
				$.vp
				(
					arguments,
					{
						type:		$.Type.Object
					},
					{
						type:		$.Type.Boolean,
						optional:	function(){prototyped=false;}
					}
				);
			}
			catch(e){throw e;}
			
			//
				
			var count = 0;
				
			for (var a in obj)
			{
				if (!obj.hasOwnProperty(a) && !prototyped) continue;
				
				count++;
			}
				
			return count;
		}
		
		this.search = function(object, search_function, return_value)
		{
			try
			{
				$.vp
				(
					arguments,
					{
						type:		$.Type.Object
					},
					{
						type:		$.Type.Function
					},
					{
						type:		$.Type.Boolean,
						optional:	function(){return_value=false;}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			for (var a in object)
			{
				if (!search_function(a)) continue;
				
				//
				
				if (return_value === true) return object[a]
				
				return a;
			}
			
			return null;	
		}
	
		this.set_position_properties = function $object$set_position_properties(object, position, units, adjustment)
		{
			if (units === undefined)
			{
				units = "px";
			}
			
			object.left = (position[0] + units);
			object.top  = (position[1] + units);
		}	
		
		this.clone = function $object$clone(base)
		{
			var o = {};
			
			$.lang.extend(o, base);
			
			return o;
			
			/*
			function clone(obj) //refine
			{
				var ClonedObject = function(){};
				
				ClonedObject.prototype = obj;
				
				return new ClonedObject;
				
			}
			*/			
		}
		
		this.deep_clone = function(object)
		{
			var new_obj = {};
			
			for (a in object)
			{
				if (object[a] && (typeof(object[a]) == $.NativeType.Object))
				{
					new_obj[a] = this.deep_clone(object[a]);
				}
				else
				{
					new_obj[a] = object[a]
				}
			}
			
			return new_obj;
		}			
	
		this.join = function x(object, delimeter)
		{
			try
			{
				$.vp
				(
					arguments,
					{
						type:		$.Type.Object
					},
					{
						type:		$.Type.String,
						optional:	function(){delimeter=",";}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			var str = $.String.empty;
			
			for (a in object)
			{
				str += (a + "=" + object[a] + delimeter);
			}
			
			return str.slice(0, -delimeter.length);
		}	


		this.StateHolder = function $object$StateHolder__CLASS(object, properties)
		{typeof "$object$StateHolder__CLASS";
			this.__constructor = function jcsfl$object$StateHolder()
			{
				var i; //Number
				
				//
				
				//vp object to make sure not null
				properties = $.vp(properties, "Array", null);					
				
				//
				
				for (i=0; i<properties.length; i++)
				{
					this[properties[i]] = object[properties[i]];
				}
		
			}
			this.__constructor();

		}
	}

	this.element = new function NAMESPACE__$element()
	{
	var $element = this;
	
		////
		
		this.containers = ["DOMElement:body", "DOMElement:div", "DOMElement:span", "DOMElement:td"];
		
		this.html_disable = function(elements, disable)
		{
			var disable_a = function(a)
			{
				alert(a.href);
			}	
		
	/*	
	function disableAnchor(obj, disable){
	  if(disable){
	    var href = obj.getAttribute("href");
	    if(href && href != "" && href != null){
	       obj.setAttribute('href_bak', href);
	    }
	    obj.removeAttribute('href');
	    obj.style.color="gray";
	  }
	  else{
	    obj.setAttribute('href', obj.attributes['href_bak'].nodeValue);
	    obj.style.color="blue";
	  }
	}
	*/	
		
			var i; //Number
			
			//
			
			//vp
			
			if (!($.lang.is_array(elements)))
			{
				elements = [elements];
			}
			
			if (disable === undefined)
			{
				disable = true;
			}
			
			//
			
			$.lang.for_item
			(
				elements,
				function(element)
				{
					switch (element.tagName.toLowerCase())
					{
						case "input":
						{
							element.disabled = disable;
							
							break;
						}
						case "a":
						{
							//disable_a(element);	TODO: disable HTML element
							
							break;
						}
					}
				}
			);
		}	
		
		var disabled = {};
	
		this.disable = function(element, style, region)
		{
			var do_disable = function()
			{
				var create_mask = function $$create_mask(left, top, width, height)
				{
					var detect = function(hidden)
					{
						if ($element.is_displayed(element) === !hidden)
						{
							if (hidden === true)
							{
								masking_div.style.display = "none";
							}
							else
							{
								masking_div.style.display = "";
							}
							
							$.lang.delay_execute(detect, 0, null, [!hidden]);
							
							return;
						}
						
						$.lang.delay_execute(detect, 0, null, [hidden]);
					}
					
					////
					
					var masking_div = document.body.appendChild(document.createElement("div"));
					
					var dims = {left:left, top:top, width:width, height:height};
					
					with (masking_div.style)
					{
						position		= "absolute";
							
						left			= (dims.left   + "px");
						top				= (dims.top    + "px");
						width			= (dims.width  + "px");
						height			= (dims.height + "px");
						
						zIndex			= (element.style.zIndex + 3); //use LayerManager or other calculation
						
						backgroundColor	= style.color;
						
						cursor			= style.cursor;
					}			
					
					//
					
					$element.change_opacity(masking_div, style.opacity);
					
					detect(true);
					
					return masking_div;
				}
				
				////
				
				if (disabled[element.id]) return;
	
				var masking_divs = [];
				
				var coordinates = $element.get_coordinates(element);
				
				if (region == null)
				{
					masking_divs[0] = create_mask(coordinates[0], coordinates[2], element.offsetWidth, element.offsetHeight);
				}
				else
				{
					masking_divs[0] = create_mask(	coordinates[0],	coordinates[2],	(region[0] - coordinates[0]),	element.offsetHeight			);
					masking_divs[1] = create_mask(	region[0],		coordinates[2],	(coordinates[1] - region[0]),	(region[2] - coordinates[2])	);
					masking_divs[2] = create_mask(	region[1],		region[2],		(coordinates[1] - region[1]),	(coordinates[3] - region[2])	);
					masking_divs[3] = create_mask(	region[0],		region[3],		(region[1] - region[0]),		(coordinates[3] - region[3])	);
				}
				
				disabled[element.id] = masking_divs;
			}
			
			////
									
			try
			{
				$.vp
				(
					arguments,
					{
						type:		[$.Type.DOMElement, "Array-DOMElement"]
					},
					{
						type:		$.Type.Object,
						optional:	function(){style={};}
					},
					{
						type:		$.Type.Array,
						optional:	true
					}
				);
			}
			catch(e){throw e;}
			
			//
					
			$.vo
			(
				style,
				{
					named:			$.element.css.Style.color,
					type:			$.Type.String,
					default_value:	$.element.css.Color.white
				},
				{
					named:			$.element.css.Style.opacity,
					type:			$.Type.Number,
					default_value:	0
				},
				{
					named:			$.element.css.Style.cursor,
					type:			$.Type.String,
					default_value:	$.String.empty
				}
			);
			
			if ($.lang.is_array(element))
			{
				var elements = element;
				
				for (var i=0; i<elements.length; i++)
				{
					element = elements[i];
					
					do_disable();
				}
			}
			else
			{
				do_disable();
			}
		}
	
		this.enable = function(element)
		{
			if (disabled[element.id])
			{
				for (var i=0; i<disabled[element.id].length; i++)
				{
					document.body.removeChild(disabled[element.id][i]);
				}
				
				delete disabled[element.id];
			}
			else
			{
				//throw error?
			}
		}
	
		this.disable_selecting = function(element, ignore_cursor)
		{
			try
			{
				$.vp(arguments, {type:$.Type.DOMElement}, {type:$.Type.Boolean, optional:function(){ignore_cursor=false}});
			}
			catch(e){throw e;}
			
			//
			
			new $.browser.Unifier(Unification, this);
			
			/*/
			*/
			
			function Unification()
			{
				function routine1()
				{
					//element.__TEMPORARY_FUNCTION_POINTER = (function(){return false;}); //exposes possible memmory leak by setting expando attribute to function, probably not?
					//$.element.attach_event(element, "selectstart", element.__TEMPORARY_FUNCTION_POINTER);
					
					document.__TEMPORARY_FUNCTION_POINTER = document.onselectstart;
					
					document.onselectstart = $.browser.false_function;
				}
				
				function routine2()
				{
					element.style.MozUserSelect = "none";
				}
				
				function routine3()
				{
					element.__TEMPORARY_FUNCTION_POINTER = element.onmousedown;
					
					element.onmousedown = $.browser.false_function;
				}
				
				////
			
				this.explorer	= routine1;
				this.firefox	= routine2;
				this.chrome		= routine3;
				this.opera		= routine3;
				this.safari		= routine3;			
			}
			
			//
			
			/*
			
			//element.__TEMPORARY_FUNCTION_POINTER = (function(){return false;}); //exposes possible memmory leak by setting expando attribute to function?
			//$.element.attach_event(element, "selectstart", element.__TEMPORARY_FUNCTION_POINTER);
			
			element.__TEMPORARY_FUNCTION_POINTER = element.onselectstart;
			element.onselectstart = function(){return false;}
			
			//
			
			element.unselectable = "on";
			element.style.MozUserSelect = "none";
			
			element.style.cursor = "default";
			
			//
			
			ignore_cursor = $.vv(ignore_cursor, "Boolean", true); //where the f is this used!?
			
			if (ignore_cursor == false)
			{
				element.style.cursor = "default";
			}
			*/
		}
	
		this.enable_selecting = function(element)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"});
			}
			catch (e)
			{
				throw (e);
			}
			
			//
			
			new $.browser.Unifier(Unification, this);
			
			/*/
			*/
			
			function Unification()
			{
				function routine1()
				{
					//$.element.detach_event(element, "selectstart", element.__TEMPORARY_FUNCTION_POINTER);
					//element.__TEMPORARY_FUNCTION_POINTER = null;
					//element.__TEMPORARY_FUNCTION_POINTER = undefined;
					
					document.onselectstart = document.__TEMPORARY_FUNCTION_POINTER;
	
					document.__TEMPORARY_FUNCTION_POINTER = null;
					document.__TEMPORARY_FUNCTION_POINTER = undefined;
	
				}
				
				function routine2()
				{
					element.style.MozUserSelect = "text";
				}
				
				function routine3()
				{
					element.onmousedown = element.__TEMPORARY_FUNCTION_POINTER;
					
					element.__TEMPORARY_FUNCTION_POINTER = null;
					element.__TEMPORARY_FUNCTION_POINTER = undefined;
				}
				
				////
				
				this.explorer	= routine1;
				this.firefox	= routine2;
				this.chrome		= routine3;
				this.opera		= routine3;
				this.safari		= routine3;			
			}
			
			//$.element.detach_event(element, "selectstart", element.__TEMPORARY_FUNCTION_POINTER);
			//element.__TEMPORARY_FUNCTION_POINTER = null;
			//element.__TEMPORARY_FUNCTION_POINTER = undefined;
			
			//element.onselectstart = element.__TEMPORARY_FUNCTION_POINTER;
			//element.__TEMPORARY_FUNCTION_POINTER = null;
			//element.__TEMPORARY_FUNCTION_POINTER = undefined;
			
			//				
			//
			//element.unselectable = "off";
			//element.style.MozUserSelect = "text";
			
			//element.style.cursor = "";
			
			//
			
			/*
			ignore_cursor = $.vv(ignore_cursor, "Boolean", false);
			
			if (ignore_cursor == false)
			{
				element.style.cursor = "default";
			}
			*/			
		}
	
		this.inspect_event = function $element$inspect_event(element, event)
		{
			try
			{
				$.vp(arguments, [{type:["DOMElement", "DOMDocument", "DOMWindow"]}, {type:"String"}]);
			}
			catch (e)
			{
				throw e;
			}
			
			//
			
			//return event_metabase.find_handlers(element, event);
			return $.element.EventMetabase.instance.find_handlers(element, event);		
		}
	
		this.fire_event = function(element, event, event_obj, parameters)
		{
			var handlers = $.element.EventMetabase.instance.find_handlers(element, event);
			
			for (var i=0; i<handlers.length; i++)
			{
				handlers[i].func.apply(element, Array.prototype.concat([event_obj], parameters));
			}
		}
	
		this.attach_event = function $element$attach_event(element, event, func, parameters)
		{
			var ie_event_caller = function $element$attach_event$$ie_event_caller() //could remove since IE8 (7?) also supports the event parameter and window.event
			{		
				var ret = func.apply(element, Array.prototype.concat([new $.dom_event.EventObj(window.event)], parameters));
	
				if (ret === false)
				{
					/* //IE does not implement preventDefault in accordance with WC3
					if (window.event.preventDefault)
					{
						window.event.preventDefault();
					}
					*/
					
					event.returnValue = false;
				}
	
				return ret;
			}
	
			var event_caller = function $element$attach_event$$event_caller(event)
			{
				var ret = func.apply(this, Array.prototype.concat([new $.dom_event.EventObj(event)], parameters));
	
				if (ret === false) event.preventDefault();
				
				return ret;
			}
			
			////
							
			try
			{
				$.vp
				(
					arguments,
					{
						type:		["DOMElement", "DOMDocument", "DOMWindow"]
					},
					{	type:		"String"
					},
					{
						type:		"Function"
					},
					{
						type:		"Array",
						optional:	function(){parameters=[];}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			if (event.substr(0, 2).toLowerCase() === "on")
			{
				event = event.substr(2);
			}
			
			//
			
			if (element.attachEvent)
			{
				//this.implements_dom_event
				
				element.attachEvent(("on" + event), ie_event_caller); //attachEvent does return a value
				
				$.element.EventMetabase.instance.add(element, event, func, ie_event_caller);
				
				return;
			}
			
			if (element.addEventListener)
			{
				//this.implements_dom_event
				
				element.addEventListener(event, event_caller, false);
				
				$.element.EventMetabase.instance.add(element, event, func, event_caller);
				
				return;
			}
			
			throw new $.GenericError("The object does not implement the DOM Level 2 Event Model.");
		}
		
		this.attach_events = function()
		{
			for (var i=0; i<arguments.length; i++)
			{
				$element.attach_event.apply($element, arguments[i])
			}
					
			/*
			try
			{
				$.vp(arguments, {type:"Array-Array"});
			}
			catch (e)
			{
				throw e;
			}
			
			//
					
			for (var i=0; i<binding_data.length-1; i++)
			{
				$element.attach_event.apply($element, binding_data[i]);
			}
			*/
		}
	
		this.detach_event = function $element$detach_event(element, event, func)
		{
			try
			{
				$.vp(arguments, {type:["DOMElement", "DOMDocument", "DOMWindow"]}, {type:"String"}, {type:"Function"});
			}
			catch(e){throw e;}
			
			////
			
			if (event.substr(0, 2).toLowerCase() === "on")
			{
				event = event.substr(2);
			}
			
			//
			
			var event_func = $.element.EventMetabase.instance.remove(element, event, func);
			
			if (event_func === null) throw new $.NullReferenceError("The element does not have event handlers for '" + event + "'.");
	
			//
			
			if (element.detachEvent)
			{
				//this.implements_dom_event
				
				element.detachEvent(("on" + event), event_func); //detachEvent does return a value
	
				return;
			}
			
			if (element.removeEventListener)
			{
				//this.implements_dom_event
				
				element.removeEventListener(event, event_func, false);
				
				return;
			}
			
			throw new $.GenericError("The object does not implement the DOM Level 2 Event Model.");
		}
		
		this.supports_dom_event = function $element$supports_dom_event(element, event)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"}, {type:"String"});
			}
			catch(e){throw e;}
			
			//
			
			return this._supports_dom_event(element, event);
		}
	
		this._supports_dom_event = function $element$_supports_dom_event(element, event)
		{
			var val; //Variant
			var has; //Boolean
			
			//
			
			if (event.substr(0, 2).toLowerCase() === "on")
			{
				event = event.substr(2);
			}
			
			//
			
			if (event in element)
			{
				//verify the attribute is an event!
				
				return true;
			}
			else
			{
				event = ("on" + event);
				
				if (event in element)
				{
					return true;
				}
				else
				{			
					//test
					//http://thinkweb2.com/projects/prototype/detecting-event-support-without-browser-sniffing/
					// for FireFox
					
					val = element.getAttribute(event);
				
					element.setAttribute(event, "return;");
				
					has = (typeof(element[event]) === "function");
				
					element.setAttribute(event, val);
				
					return has;
				}
			}
		}
		
		this.get_inner_text = function(element)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"});
			}
			catch(e){throw e;}
			
			//
	
			return $.element._get_inner_text(element);
		}
		
		this._get_inner_text = function(element)
		{
			if ("innerText" in element) return element.innerText;
			
			if ("textContent" in element) return element.textContent;
	
			throw new $.GenericError("Browser does not implement an 'innerText' or 'textContent' property.");
		}
	
		this.set_inner_text = function(element, text)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"}, {type:"String"});
			}
			catch(e){throw e;}
			
			//
	
			if (element.innerText !== undefined)
			{
				element.innerText = text;
				
				return;
			}
			
			if (element.textContent !== undefined)
			{
				element.textContent = text;
				
				return;
			}
	
			throw new $.GenericError("Browser does not implement an 'innerText' or 'textContent' property.");
		}
	
		this.proximity = function(element1, element2)
		{
			var ep1 = $.element.get_position(element1);
			var ep2 = $.element.get_position(element2);
			
			return (Math.abs(ep1[0] - ep2[0]) + Math.abs(ep1[1] - ep2[1]));
		}
	
		/*
		this.get_text_node = function $element$get_text_node(element)
		{
		return document.createTextNode($.element.get_text(element)); //need to get actual node if possible
		}
		*/
	
		this.contains = function(parent, child)
		{
			//vp
			
			if (parent == child) return false;
			
			if (parent.contains) return parent.contains(child);
	
			while (child && (parent != child) && (child != null)) //can child even be null?
			{
				child = child.parentNode;
			}
	
			return parent == child;
		}
		
		this.fade = function(element, opacity_start, opacity_end, milliseconds, opacity_step) //check vars
		{
			var do_opacity_change = function(opacity, interval)
			{
				setTimeout(function(){$.element.change_opacity(element, opacity);}, interval);
			}
			
			////
			
			try
			{
				$.vp
				(
					arguments,
					{
						type:		"DOMElement"
					},
					{
						type:		"Number"
					},
					{
						type:		"Number"
					},
					{
						type:		"Number"
					},
					{
						type:		"Number",
						optional:	function(){opacity_step=10;}
					}
				);
			}
			catch(e){throw e;}
			
			//
		
			var rate  = (milliseconds / Math.abs(opacity_end - opacity_start));
			var timer = 0;
	
			if (opacity_start > opacity_end)
			{
				for (var i=opacity_start; i>=opacity_end; i=(i-opacity_step))
				{
					do_opacity_change(i, (timer * rate * opacity_step));
					
					timer++;
				}
	
				return;
			}
	
			if (opacity_end > opacity_start)
			{
				for (var i=opacity_start; i<=opacity_end; i=(i+opacity_step))
				{
					do_opacity_change(i, (timer * rate * opacity_step));
	
					timer++;
				} 						
	
				return;
			}
		}
	
		this.change_opacity = function(element, opacity)
		{
			//test for browser
			
			element.style.opacity		= (opacity / 100);
			element.style.MozOpacity	= (opacity / 100);
			element.style.KhtmlOpacity	= (opacity / 100);
			element.style.filter		= "alpha(opacity=" + opacity + ")";
		}
	
		this.get_position = function(element)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"});
			}
			catch(e){throw e;}
			
			//
	
			return this.__get_position(element);
		}
		
		this.__get_position = function(element)
		{
			var offsetLeft	= element.offsetLeft;
			var offsetTop	= element.offsetTop;
	
			while (element.offsetParent != null)
			{
				var parent_element = element.offsetParent;
	
				offsetLeft += parent_element.offsetLeft;
				offsetTop  += parent_element.offsetTop;
	
				element = parent_element;
			}
	
			return [offsetLeft, offsetTop];
		}
		
		this.get_size = function(element)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"});
			}
			catch(e){throw e;}
			
			//
			
			return [element.offsetWidth, element.offsetHeight];
		}
		
		//
		//get scrollbar size method
		//
		
		this._set_attributes = function $element$create$_set_attributes(element, attributes)
		{
			var set_attribute = function $element$create$_set_attributes$$set_attribute(attribute)
			{
				if (typeof(attributes[attribute]) !== "string") return;
				
				//
				
				switch (attribute)
				{
					case "_text":
					{
						$.element.set_inner_text(element, attributes[attribute]);
					
						break;
					}
					default:
					{
						if (attribute.substr(0, 1) === "_")
						{
							element.setAttribute(attribute, attributes[attribute]);
							
							return;
						}
						
						if (attribute in element)
						{
							if (typeof(attributes[attribute]) !== "string") throw new $.InvalidTypeError("Expected a string value for HTML attribute.");
	
							element[attribute] = attributes[attribute];
						}
						else
						{
							throw new $.InvalidArgumentError("The element does not have a '" + attribute + "' attribute.");
						}					
					}
				}
			}
			
			$.lang.for_each(attributes, set_attribute);
		}
		
		this._set_styles = function $element$create$_set_styles(element, styles)
		{
			var set_style = function $element$create$_set_styles$$set_style(style)
			{
				switch (style)
				{
					case "_opacity": //remove
					case "opacity":
					{
						$.element.change_opacity(element, styles[style]);
						
						break;
					}
					default:
					{
						var s = style;
						
						if (style == "z_index") s = "zIndex";
						
						if (!(s in element.style)) throw new $.InvalidArgumentError("The element does not have a '" + s + "' style.");
						
						//
						
						if (!$.lang.array.__contains([$.NativeType.String, $.NativeType.Number], typeof(styles[style]))) throw new $.InvalidTypeError("Expected a string or number for DHTML style value.");
											
						element.style[s] = styles[style].toString(); //redundant for string
					}
				}		
			}
			
			////
			
			$.lang.for_each(styles, set_style);
		}
		
		this._set_events = function $element$create$_set_events(element, events)
		{
			var set_event = function $element$create$_set_events$$set_event(event)
			{
				if ($.element.supports_dom_event(element, event) === false) //move to attach_event?
				{
					throw new $.InvalidArgumentError("The element does not have a '" + event + "' or 'on" + event + "' event.");
				}
				
				if (typeof(events[event]) !== "function") //move to $.vp?, move to attach_event?
				{
					throw new $.InvalidTypeError("Expected a function for attachment to DOM event.");
				}
				
				//
							
				$.element.attach_event(element, event, events[event]);
			}
			
			////
			
			$.lang.for_each(events, set_event);
		}
	
		this.modify = function(element, attributes, styles, events)
		{
			try
			{
				$.vp
				(
					arguments,
					{
						type:		$.Type.DOMElement
					},
					{
						type:		$.Type.Object,
						optional:	true
					},
					{
						type:		$.Type.Object,
						optional:	true
					},
					{
						type:		$.Type.Object,
						optional:	true
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			$.element._modify(element, attributes, styles, events);
		}	
		
		this._modify = function(element, attributes, styles, events)
		{
			if (attributes != null)
			{
				$.element._set_attributes(element, attributes);
			}
			
			if (styles != null)
			{
				$.element._set_styles(element, styles);
			}
			
			if (events != null)
			{
				$.element._set_events(element, events);
			}
		}
		
		this.create = function(tag, parent, attributes, styles, events)
		{	
			try
			{
				//check: object attributes should be all string values for attributes, styles, events
				$.vp
				(
					arguments,
					{
						type:		"String"
					},
					{
						type:		"DOMElement",
						optional:	true
					},
					{
						type:		"Object",
						optional:	true
					},
					{
						type:		"Object",
						optional:	true
					},
					{
						type:		"Object",
						optional:	true
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			var new_tag = tag;
			
			if (new_tag == "button")
			{
			    new_tag = "input";
			}
			
			var element = document.createElement(new_tag);
			
			//
			//normalization code
			
			switch (tag.toLowerCase())
			{
				case "button":
				{
					if (element.type !== "button") element.type = "button";
					
					break;
				}
				case "table":
				{
					element.cellPadding = "0px";
					element.cellSpacing = "0px";
					
					break;
				}
			}
			
			//
			
			$.element._modify(element, attributes, styles, events);
					
			//		
	
			if (parent != null)
			{
				parent.appendChild(element);
			}
			
			return element;
		}
		
		this.get_coordinates = function(element)
		{
			var position = $element.get_position(element);
			var size	 = $element.get_size(element);
			
			return [position[0], (position[0] + size[0]), position[1], (position[1] + size[1])];
		}
		
		/*
		this.get_style = function(element)
		{
			if (typeof(element.currentStyle) == "undefined")
			{
				if (typeof(window.getComputedStyle) == "undefined")
				{
					return undefined;
				}
				else
				{
					return window.getComputedStyle(element, null);
				}
			}
			else
			{
				return element.currentStyle;
			}
		}
		*/
		
		this.create_placeholder = function(element)
		{
			var div = new $.Element("div");
			
			with (div.style)
			{
				width			= (element.offsetWidth + "px");
				height			= (element.offsetHeight + "px");
				
				//borderStyle		= "Solid";
				//borderWidth		= "1px";
				//borderColor		= "Blue";
				
				marginBottom	= "1em"; //adopt portlet class programatically
			}
			
			div.innerHTML = ".";
			
			//attach events to track window size and adjust Window object
			
			return element.parentNode.insertBefore(div, element.nextSibling);
		}
		
		this.get_html = function(element)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"});
			}
			catch(e){throw e;}
			
			//
			
			if (element.outerHTML) return element.outerHTML;
			
			//
			
			var _emptyTags = {"IMG":true, "BR":true, "INPUT":true, "META":true, "LINK":true, "PARAM":true, "HR":true};
	
			var attrs = element.attributes;
	
			var str = "<" + element.tagName;
	
			for (var i=0; i<attrs.length; i++)
			{
				str += " " + attrs[i].name + "=\"" + attrs[i].value + "\"";
			}
			
			if (_emptyTags[element.tagName]) return str + ">";
	
			return str + ">" + element.innerHTML + "</" + element.tagName + ">";
		}
		
		this.get_dim = function(style)
		{
			if (style.indexOf("px") > 0)
			{
				return parseInt(style.substr(0, (style.length - 2)));
			}
			else
			{
				throw new $.GenericError("Invalid style value provided.");
			}
			
		}
		
		this.get_h_padding = function $element$get_h_padding(element)
		{
			return (this.get_dim(element.style.paddingLeft) + this.get_dim(element.style.paddingRight));
		}
		
		this.swap = function $element$swap(element, old_element)
		{
			//TODO: vp, DOM check
			
			old_element.parentNode.replaceChild(element, old_element);
		}
		
		this.create_from_xml = function $element$create_from_xml(xml_doc)
		{
			var element; //DOMElement;
			
			//
			
			element = $.element.create("div", null, {innerHTML:xml_doc.xml});
			
			return element.childNodes[0];
		}
		
		this.create_from_html = function $element$create_from_xml(html)
		{
			var element;	//DOMElement;
			var fragment;	//DOMDocumentFragment
			
			//
			
			element = $.element.create("div", null, {innerHTML:$.lang.string.strip_white_space(html)});
			
			fragment = document.createDocumentFragment();
			
			fragment.appendChild(element.childNodes[0]);
			
			return fragment.childNodes[0];
		}
		
	
	
	
	
	
		this.find = function(properties, styles)
		{
			var check_properties = function(element)
			{
				var match = true;
				
				//
				
				for (property in properties)
				{
					switch (property)
					{
						case "parentNode":
						case "tagName":
						{
							continue;
						}
						case "_text":
						{
							match = ($element._get_inner_text(element) === properties[property]);
							
							break;
						}
						case "id":
						{
							if (properties[property] instanceof RegExp)
							{
								match = properties[property].test(element[property]);
							}
							else
							{
								if (properties[property].indexOf("*") > -1)
								{
									match = new RegExp(properties[property].replace("*", ".*")).test(element[property]);
								}
								else
								{
									match = (element[property] === properties[property]);
								}
							}
							
							break;
						}
						default:
						{
							if (!element[property]) continue;
							
							match = (element[property] === properties[property]);
							
							break;
						}
					}
							
					//
					
					if (match === false) break;
				}
				
				return match;
			}
	
			var check_styles = function(element)
			{
				var match = true;
				
				//
				
				for (style in styles)
				{
					if (element.style[style] !== styles[style])
					{
						match = false;
						
						break;
					}
				}
				
				return match;
			}
			
			////
				
			var parent_node;	//DOMElement
			var tag_name;		//String
			
			var elements;		//DOMNodeList
			var found;			//Array-DOMElement
			
			//
			
			try
			{
				$.vp
				(
					arguments,
					{
						type:		"Object",
						optional:	true
					},
					{
						type:		"Object",
						optional:	true
					}
				);
			}
			catch(e){throw e;}
				
			//
			
			if (properties != null)
			{
				if ((properties.parentNode != null) && ($.reflection.is_element(properties.parentNode)))
				{
					parent_node = properties.parentNode;
				}
				
				if ((properties.tagName != null) && (typeof(properties.tagName) === "string"))
				{
					tag_name = properties.tagName;
				}
			}
			
			if (parent_node == undefined)
			{
				parent_node = document;
			}
			
			if (tag_name === undefined)
			{
				tag_name = "*";
			}
			
			//
			
			elements = parent_node.getElementsByTagName(tag_name);
			
			found = [];
			
			if ((properties == null) && (styles == null))
			{
				found = elements;
			}
			else
			{
				for (var i=0; i<elements.length; i++)
				{
					if ((check_properties(elements[i])) && (check_styles(elements[i]))) found.push(elements[i]);
				}
			}
			
			//
			
			switch (found.length)
			{
				case 0:		return null;
				case 1:		return found[0]
				default:	return found;
			}
		}
		
		/*
		Finds element specified by tag_name and id supporting the use of the (*) wildcard
		*/
		this.find_by_id = function(id, tag_name)
		{
			try
			{
				$.vp
				(
					arguments,
					{
					
						type:		["String", "RegExp"]
					},
					{
						type:		"String",
						optional:	function(){tag_name="*";}
					}
				);
			}
			catch(e){throw e;}
			
			return $element.find({id:id, tagName:tag_name});
		}
	
		this.wait_for = function(id, callback)
		{
			var checking = function()
			{
				element = document.getElementById(id);
				
				if (element == null)
				{
					JCSL.lang.delay_execute(arguments.callee, 0);
					
					return;
				}
				
				callback(element);
			}
			
			////
			
			try
			{
				$.vp(arguments, {type:["String", "Function"]}, {type:"Function"});
			}
			catch(e){throw e;}
			
			//
			
			if (typeof(id) != "string")
			{
				id = id();
			}
			
			JCSL.lang.delay_execute(checking, 0);
		}
		
		this.ready = function(obj, ids, aliases)
		{
			var id_loaded = function(element)
			{
				obj[id_aliases[element.id]] = element;
			}
			
			////
					
			try
			{
				JCSL.vp(arguments, {type:"Object"}, {type:"Array-String"}, {type:"Array-String", optional:true});
			}
			catch(e){throw e;}
			
			//
			
			var id_aliases = {};
			
			for (var i=0; i<ids.length; i++)
			{
				if (aliases[i] == null)
				{
					id_aliases[ids[i]] = ids[i];
				}
				else
				{
					id_aliases[ids[i]] = aliases[i];
				}
				
				JCSL.element.wait_for(ids[i], id_loaded);
			}
		}
		
		this.insert_before = function $element$insert_before(element, reference_element)
		{
			reference_element.parentNode.insertBefore(element, reference_element);
			
		}
		
		this.insert_after = function $element$insert_after(element, reference_element)
		{
			if (reference_element.nextSibling === null)
			{
				reference_element.parentNode.appendChild(element);
			}
			else
			{
				reference_element.parentNode.insertBefore(element, reference_element.nextSibling);
			}
		}
		
		this.insert_after_next = function $element$insert_after(element, reference_element)
		{	
			if (reference_element.nextSibling === null)
			{
				reference_element.parentNode.appendChild(element);
			}
			else
			{
				reference_element = reference_element.nextSibling;
				
				//
				//IE inserts an " " node if html has /n
				//TODO: check for IE
				
				if (reference_element.nodeValue = " ")
				{
					reference_element = reference_element.nextSibling;
				}
				
				//
				
				if (reference_element.nextSibling === null)
				{
					reference_element.parentNode.appendChild(element);
				}
				else
				{
					reference_element.parentNode.insertBefore(element, reference_element.nextSibling);
				}
			}		
		}	
		
		this.remove = function $element$remove(element)
		{
			element.parentNode.removeChild(element);
		}
		
		this.is_displayed = function $element$is_displayed(element)
		{
			//$.vp
			
			//
			
			if ($.element._get_css(element).display === "none")
			{
				return false;
			}
			else
			{
				if ((element.parentNode === null) || (element.parentNode.style === undefined))
				{
					return true;
				}
				else
				{
					return this.is_displayed(element.parentNode);
				}
			}
		}
		
		this.clear = function $element$clear(element)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"});
			}
			catch (e)
			{
				throw e;
			}
			
			//
			
			this._clear(element);	
		}
		
		this._clear = function(element)
		{
			//
			//setting innerHTML to an empty string may work for other browsers but IE creates a dummy line break requiring below code... need to look into this further
			
			if (element.hasChildNodes())
			{
				while (element.childNodes.length >= 1)
				{
					element.removeChild(element.firstChild);
				} 
			}
		}
		
		this.get_css = function $element$_get_css(element)
		{
			try
			{
				$.vp(arguments, {type:"DOMElement"});
			}
			catch (e)
			{
				throw e;
			}
			
			//
			
			return this._get_css(element);	
		}
			
		this._get_css = function $element$get_css(element)
		{
			if ("currentStyle" in element)
			{
				return element.currentStyle;
			}
			
			if ("getComputedStyle" in window)
			{
				return window.getComputedStyle(element, null); //may need to revise to use different document.... determine document from element automatically?
			}
			
			throw new $.NotSupportedError("The browser does not support either 'element.currentStyle' or 'window.getComputedStyle'.");
		}
		
		this.compute_width = function(element)
		{
			if (element.style.width !== "")
			{
				return $.lang.string.extract_dimension(element.style.width);
			}
			else
			{
				return (element.offsetWidth - $.lang.string.extract_dimension(element.style.borderLeftWidth) - $.lang.string.extract_dimension(element.style.paddingLeft) - $.lang.string.extract_dimension(element.style.paddingRight) - $.lang.string.extract_dimension(element.style.borderRightWidth));
			}
			
		}
	
		this.find_by_tag_names = function(tag_names, container)
		{	
			try
			{
				$.vp
				(
					arguments,
					{
						type:		["String", "Array-String"]
					},
					{
						type:		["DOMDocument", "DOMDocumentFragment", "DOMElement"],
						optional:	function(){container=document;}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			if (typeof(tag_names) == "string") return container.getElementsByTagName(tag_names);
			
			//
	
			var arr = [];
	
			$.lang.for_each
			(
				tag_names,
				function(index)
				{
					arr = arr.concat($.lang.array.create_from_node_list(container.getElementsByTagName(tag_names[index])));
				}
			);
	
			return arr;
		}	
		
		this.find_by_data = function(field, value, container, tag_names)
		{
			try
			{
				$.vp
				(
					arguments,
					{
						type:		"String"
					},
					{
						type:		"String",
						optional:	function(){value="*";}
					},
					{
						type:		["DOMDocument", "DOMDocumentFragment", "DOMElement"],  //replace with DOMElement:DOMContainers
						optional:	function(){container=document;}
					},
					{
						type:		["String", "Array-String"],
						optional:	function(){tag_names="*";}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			var all = $.element.find_by_tag_names(tag_names, container);
			
			//
			
			var elements = [];
			
			for (var i=(all.length-1); i>=0; i--)
			{
				if (all[i].getAttribute("data-" + field) === null) continue;
				
				//
			
				if (value === "*")
				{
					elements.push(all[i]);
				}
				else
				{
					if (all[i].getAttribute("data-" + field) === value)
					{
						elements.push(all[i]);
	//hack
	if (field === "id") break;
					}
				}
			}
			
			//if (elements.length === 1) return elements[0];
			
			return elements;
	
			/*
			function y(element)
			{
				function yy(ss, e)
				{
					if ($.GetType(e) === "DOMUnknown")
					{
						throw "E";
					}
					
					alert($.GetType(e));
					
					if (e.parentNode != null)
					{
						yy(ss, e.parentNode);
					}
				}
				
				////
				
				var s;
				
				yy(s, element);
			}
			y(question_table.rows[2].cells[0].children[0].rows[0].cells[1]);
			*/
		}
		
		this.extract_text_nodes = function(element)
		{
			var iterate_nodes = function(nodes)
			{
				for (var i=0; i<nodes.length; i++)
				{
					if (nodes[i].nodeType === $.element.NodeType.TextNode)
					{
						arr.push(nodes[i]);
					}
					
					iterate_nodes(nodes[i].childNodes);
				}
			}
			
			////
			
			var arr = [];
			
			iterate_nodes(element.childNodes);
			
			return arr;
		}
		
		this.append = function(elements, reference_element)
		{
			if ($.lang.is_array(elements) === false)
			{
				elements = [elements];
			}
			
			//
			
			for (var i=0; i<elements.length; i++)
			{
				reference_element.appendChild(elements[i]);
			}
		}
		
		/*
		this.clone = function(element, id)
		{
			var e; //DOMElement
			
			//
			
			try
			{
				$.vp(arguments, [
									{
										type:		"DOMElement"
									},
									{
										type:		"String",
										optional:	function(){id="";}
									}
								]);
			}
			catch (e)
			{
				throw e;
			}
			
			//
			
			e = element.cloneNode(true);
			
			e.id = id;
			
			return e;
			
		}
		*/
		
		this.copy = function(element)
		{
			return $.element.create_from_html($.element.get_html(element));
		}
		
		this.clone = function(element)
		{
			return element.cloneNode(true);
		}
		
		this.replace = function(element, reference_element)
		{
			$.element._clear(reference_element);
			
			reference_element.appendChild(element);
		}
		
		this.transform_html = function(element, transform_func)
		{
			element.innerHTML = transform_func(element.innerHTML);
		}
		
		this.next_element = function(reference_element)
		{
			var find_element = function(current_element)
			{
				if (current_element === null)
				{
					return null;
				}
				
				if (current_element.nodeType === $.element.NodeType.TextNode)
				{
					return find_element(current_element.nextSibling);
				}
				else
				{
					return current_element;
				}
			}
			
			////
					
			return find_element(reference_element.nextSibling);
		}
		
		this.first_child_element = function(reference_element)
		{
			if (reference_element.childNodes.length === 0) return null;
			
			if (reference_element.childNodes[0].nodeType === $.element.NodeType.ElementNode)
			{
				return reference_element.childNodes[0];
			}
			else
			{
				return reference_element.childNodes[1];
			}
		}
		
		this.remove_prefix = function(id)
		{
			return id.substring(4);
		}
		
		//#region ENUM
		
			this.Type = new function()
			{
				this.span			= "span";
				this.input			= "input";
				this.option			= "option";
				this.div			= "div";
				this.button			= "button";
				this.image			= "img";
				this.anchor			= "a";
				this.table			= "table";
				this.table_head		= "thead";
				this.table_body		= "tbody";
				this.table_cell		= "td";
				this.table_hcell	= "th";
			}
			
			this.Attribute = new function()
			{
				this.parent_node = "parentNode";
			}
		
		//#endregion


		this.anchor = new function NAMESPACE__$element$anchor()
		{
			this.disable = function(anchors, cursor)
			{
				var i;			//Number
				var anchor;		//DOMElement:a
		
				//
				
				try
				{
					$.vp(arguments, [{type:["DOMElement:a", "DOMNodeList:a"]}, {type:"String", default_value:"", optional:function(value){cursor=value;}}]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if ($.GetType(anchors) === "DOMElement:a")
				{
					anchors = [anchors];
				}
				
				//
						
				for (i=0; i<anchors.length; i++)
				{
					anchor = anchors[i];
					
					//
					
					if (anchor.href.length > 0)
					{
						anchor.__href = anchor.href;
						anchor.href = "javascript:void(0);";
					}
		
					if ((anchor.onclick != null) && (anchor.onclick.length > 0))
					{
						anchor.__onclick = anchor.onclick;
						anchor.onclick = "void(0);";
					}
					
					//anchor.__style_color = anchor.style.color;
					//anchor.style.color = "Gray";
					
					anchor.__style_textDecoration = anchor.style.textDecoration;
					anchor.style.textDecoration = "none";
					
					//
					
					if (cursor !== "")
					{
						anchor.style.cursor = cursor;
					}
				}
			}
			
			this.enable = function(anchors, cursor)
			{
				var i;			//Number
				var anchor;		//DOMElement:a
		
				//
				
				try
				{
					$.vp(arguments, [{type:["DOMElement:a", "DOMNodeList:a"]}, {type:"String", default_value:"", optional:function(value){cursor=value;}}]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if ($.GetType(anchors) == "DOMElement:a")
				{
					anchors = [anchors];
				}
				
				//
						
				for (i=0; i<anchors.length; i++)
				{
					anchor = anchors[i];
					
					//
					
					if (anchor.href.length > 0)
					{
						anchor.__href = href;
						anchor.href = "javascript:";
					}
		
					if ((anchor.onclick != null) && (anchor.onclick.length > 0))
					{
						anchor.__onclick = anchor.onclick;
						anchor.onclick = "void(0);";
					}
					
					anchor.__style_color = anchor.style.color;
					anchor.style.color = "Gray";
					
					anchor.__style_textDecoration = anchor.style.textDecoration;
					anchor.style.textDecoration = "none";
					
					//
					
					if (cursor !== "")
					{
						anchor.style.cursor = cursor;
					}
					
					/*
					}
					else
					{
						href	= anchor.__href;
						onclick = anchor.__onclick;
		
						if (href.length > 0)
						{
							anchor.href = href;
							delete anchor["__href"];
						}
		
						if ((onclick != null) && (onclick.length > 0))
						{
							anchor.onclick = onclick;
							delete anchor["__onclick"];
						}
		
						anchor.style.color = anchor.__style_color;
						delete anchor["__style_color"];
					}
					*/
				}
			}

		}

		this.css = new function NAMESPACE__$element$css()
		{
			this.find_style_sheet_by_file = function(file_name, doc)
			{
				try
				{
					$.vp
					(
						arguments,
						{
							type:		$.Type.String
						},
						{
							type:		$.Type.DOMDocument,
							optional:	function(){doc=document;}
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				if (file_name.indexOf(".") === -1)
				{
					file_name += ".css";
				}
				
				var ss = doc.styleSheets;
				
				for (var i=0; i<ss.length; i++)
				{
					if (ss[i].href.substring(ss[i].href.lastIndexOf("/")+1) === file_name) return ss[i];
				}
				
				return null;
			}
		
			this.find_selector_by_name = function(selector, style_sheet)
			{
			    try
			    {
			        $.vp
			        (
			            arguments,
			            {
			                type:       $.Type.String
			            },
			            {
			                type:       $.Type.Object
			            }
			        );
			    }
			    catch(e){throw e;}
			
			    //
			
				var rules;	//Object
				
				if ("rules" in style_sheet)
				{
					rules = style_sheet.rules;
				}
		
				if ("cssRules" in style_sheet)
				{
					rules = style_sheet.cssRules;
				}
				
				//
				
				if ($.browser.get_agent().vendor === "Microsoft")
				{
					selector = selector.split(",")[0];
				}
				
				selector = selector.toLowerCase();
				
				//
				
				for (var i=0; i<rules.length; i++)
				{
					if (rules[i].selectorText.toLowerCase() === selector) return rules[i].style;
				}
			}
			
			//#region ENUM
			
				this.Display = new function()
				{	
					this.none		= "none";
					this.block		= "block";
					this.inline		= "inline";	
				}
				
				this.Visibility = new function()
				{
					this.visible	= "visible";
					this.hidden		= "hidden";
				}
				
				this.FontStyle = new function()
				{
					this.normal		= "normal";
					this.italic		= "italic";
				}
				
				this.FontWeight = new function()
				{
					this.bold		= "bold";
					this.normal		= "normal";
				}
				
				this.Position = new function()
				{
					this.sstatic	= "static";
					this.absolute	= "absolute";
					this.relative	= "relative";
					this.fixed		= "fixed";
				}
				
				this.Cursor = new function()
				{
					this.wait		= "wait";
					this.move		= "move";
					this.ddefault	= "default";
					this.hand		= "hand";
					this.pointer	= "pointer";
				}
				
				this.BorderStyle = new function()
				{
					this.solid		= "solid";
				}
				
				this.VerticalAlign = new function()
				{
					this.top		= "top";
				}
				
				this.TextAlign = new function()
				{
					this.right	= "right";
					this.center = "center";
				}
				
				this.Style = new function()
				{
					this.display			= "display";
					this.position			= "position";
					this.color				= "color";
					this.backgroundColor	= "backgroundColor";
					this.opacity			= "opacity";
					this.cursor				= "cursor";
					this.z_index			= "z_index";
				}
				
				this.Unit = new function()
				{
					//
					//relative units
					
					this.em			= "em"; //the computed font-size
					this.ex			= "ex"; //the height of a lowercase "x"
					this.px			= "px"; //pixels, relative to the viewing device
					this.percent	= "%";
					
					//
					//absolute units
					
					this.iin		= "in"; //inches (1 inch = 2.54 centimeters)
					this.cm			= "cm"; //centimeters
					this.mm			= "mm"; //mellimeters
					this.pt			= "pt"; //Point (1 point = 1/72 inches)
					this.pc			= "pc"; //Picas (1 pica = 12 points)
				}
				
				this.Color = new function()
				{
					this.white	= "White";
				}
				
				this.dimension = function(size, unit)
				{
					return (size + "px");
				}
			
			//#endregion

		}

		this.data = new function NAMESPACE__$element$data()
		{
			this.bind = function(elements, data_source, binder_functions)
			{
				var do_bind = function(element)
				{
					var value;				//String
					var new_value;			//String
					var binder;				//String
					var binder_function;	//Function
					
					//
					
					var bound = element.getAttribute("data-bound");
							
					if (bound === null) return;
					
					//
					
					if (bound === "")
					{
						value = bound;
					}
					else
					{
						if (bound.charAt(0) === "'")
						{
							value = bound.substr(1, (bound.length-2));
						}
						else
						{
							value = eval("data_source." + bound); //call a reusable function to eliminate eval
						}
					}
								
					//
					
					binder = element.getAttribute("data-bound_binder");
					
					if (binder !== null)
					{
						binder_function =
						$.lang.array.index_of
						(
							binder_functions,
							binder,
							null,
							function(index)
							{														
								return ($.reflection.get_function_name(binder_functions[index]) === binder);
							}
						);
		
						if (binder_function > -1)
						{
							new_value = binder_functions[binder_function].apply(window, [value]);
							
							if (new_value == null)
							{
								//leave value
								//value = ""; //replace with exception if undefined returned?
							}
							else
							{
								value = new_value;
							}
						}
						else
						{
							value = eval(element.getAttribute("data-bound_binder").replace(/%1/g, value)); //remove eval
						}
					}
					
					//
					
					switch (element.tagName)
					{
						case "SPAN":
						case "DIV":
						case "TD":
						{
							property = "innerHTML";
							
							break;
						}
						case "INPUT":
						{
							property = "input";
							
							break;
						}
					}
					
					//
					
					$.element.modify(element, new function(){this[property]=value.toString();});
				}
				
				////
				
				try
				{
					$.vp
					(
						arguments,
						{
							type:		["DOMElement", "Array-DOMElement"]
						},
						{
							type:		"Object"
						},
						{
							type:		"Array-Function",
							optional:	function(){binder_functions=[];}
						}
					);
				}
				catch(e){throw e;}
				
				//
				
				if (!$.lang.is_array(elements))   //turn into reusable function
				{
					elements = [elements]
				}
				
				$.lang.for_item
				(
					elements,
					do_bind
				);
			}

		}

		this.img = new function NAMESPACE__$element$img()
		{
			this.load_images = function $element$img$load_images(parent_element, image_path)
			{
				var elements;	//DOMNodeList:img
				var img;		//DOMElement:img
				var i;			//Number
									
				//
				
				elements = parent_element.getElementsByTagName("img");
				
				for (i=0; i<elements.length; i++)
				{
					img = elements[i];
					
					if (img.getAttribute("data-src"))
					{						
						img.src = (image_path + img.getAttribute("data-src"));
					}
				}
			}
			
			this.pre_load = function(images)
			{
				var i;
				var image;
				
				//
				
				if (typeof(images) === "string")
				{
					images = [images];
				}
				
				for (i=0; i<images.length; i++)
				{
					image = new Image();
					
					image.src = images[i];
				}
			}

		}

		this.input_text = new function NAMESPACE__$element$input_text()
		{
			this.hook_validation = function(elements, validate)
			{
				var find_notifier = function(input)
				{
					var siblings;
					var i;
					
					//
					
					siblings = input.parentNode.children;
					
					for (i=0; i<siblings.length; i++)
					{
						if ((siblings[i].getAttribute) && (siblings[i].getAttribute("_vn") === "true"))
						{
							return siblings[i];
						}		
					}
					
					return null;
					
					/*
					var check_next = function(sibling)
					{
						if (sibling.getAttribute("_vn") === "true")
						{
							return sibling;
						}
						else
						{
							check_next(sibling.nextSibling)
						}
					}
					
					////
					
					return check_next(input.nextSibling);
					*/
				}
		
				/*
				var blurred = function(event_args)
				{		
					var is_notified = function(element)
					{
						return ((element.nextSibling !== null) && (element.nextSibling.getAttribute !== undefined) && (element.nextSibling.getAttribute("_vn") === "true"))
					}
					
					////
					
					var validated;			//Boolean
					var group_validated;	//Boolen
					var i;					//Number
					
					//
						
					validated = new RegExp(this.getAttribute("data-validator_blur")).test(this.value);
									
					if (validated)
					{
						if (is_notified(this))
						{
							this.parentNode.removeChild(this.nextSibling);
						}		
					}
					else
					{
						if (is_notified(this) === false)
						{
							$.element.insert_after($.element.create("span", null, {_vn:"true", _text:this.getAttribute("data-validator_blur_msg")}, {marginLeft:"10px", color:"Red"}), this);
						}
					}
					
					//
					
					for (i=0; i<elements.length; i++)
					{
						group_validated = !is_notified(elements[i]);
						
						if (group_validated === false) break;
					}
					
					if (validate !== undefined)
					{
						validate(this, validated, group_validated);
					}
				}
				*/
				
				var key = function()
				{
					var is_notified = function(input)
					{
						//return ((element.nextSibling !== null) && (element.nextSibling.getAttribute !== undefined) && (element.nextSibling.getAttribute("_vn") === "true"));
						
						return (find_notifier(input) !== null);
					}
					
					var render_notifier = function()
					{
						var renderer; //VaRiAnT->String/Function
						
						//
						
						renderer = this.getAttribute("data-validator_renderer");
						
						if (renderer == null)
						{
							$.element.insert_after($.element.create("span", null, {_vn:"true", _text:this.getAttribute("data-validator_msg")}, {marginLeft:"10px", color:"Red"}), this);
						}
						else
						{
							renderer = eval(renderer);
												
							renderer.apply(window, [$.element.create("span", null, {_vn:"true", _text:this.getAttribute("data-validator_msg")}, {marginLeft:"10px", color:"Red"}), this]);
						}
					}
					
					////
					
					var group_validated;	//Boolen
					var i;					//Number
								
					//
									
					var validated = new RegExp(this.getAttribute("data-validator_key")).test(this.value);
									
					if (validated)
					{
						if (is_notified(this))
						{
							this.parentNode.removeChild(find_notifier(this));
						}		
					}
					else
					{
						if (is_notified(this) === false)
						{
							render_notifier.call(this);
						}
					}
					
					//
					
					for (i=0; i<elements.length; i++)
					{
						group_validated = !is_notified(elements[i]);
						
						if (group_validated === false) break;
					}
					
					if (validate !== undefined)
					{
						validate(this, validated, group_validated);
					}
				}
				
				////
				
				var i; //Number
				
				//
				
				for (i=0; i<elements.length; i++)
				{
					if (elements[i].getAttribute("data-validator_blur") !== null)
					{
						$.element.attach_event(elements[i], "change", blurred);			
					}
					
					if (elements[i].getAttribute("data-validator_key") !== null)
					{
						$.element.attach_event(elements[i], "keyup", key);
					}
				}
			}
			
			
			
		this.trigger_validation = function(input_element, value, validator)
		{
			try
			{
				$.vp
				(
					arguments,
					{
						type:		"DOMElement:input_text"
					},
					{
						type:		["String", "Number"],
						optional:	true
					},
					{
						type:		"String",
						optional:	function(){validator="key"}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			if (value != null)
			{
				input_element.value = value;
			}
			
			//
			
			var handler; //String
			
			switch (validator)
			{
				case "key":		handler = "keyup";
				case "blur":	handler = "change";
			}
		
			$.element.fire_event //TODO: should fire only the hooked validation function instead of the complete event handler
			(
				input_element,
				handler,
				null
			);
		}
		
			
			
			
		function k(e)
		{
		
		alert("kf_: " + e.get_key_code());
		
			switch (e.get_key_code()) //only FF and Opera regeister these keys
			{
				case 8:		//backspace
				case 46:	//delete
				case 35:	//end
				case 36:	//home
				case 37:	//arrow-left
				case 39:	//arrow-right
				{
					return true;
				}
			}
			
		alert("kf_: " + e.get_key_char());
		
			//return new RegExp(this.getAttribute("data-key_validation")).test(e.get_key_char());
		}
							
		
							
		function getCaretPos(el) {
		var rng, ii=-1;
		if(typeof el.selectionStart=="number") {
		ii=el.selectionStart;
		} else if (document.selection && el.createTextRange){
		rng=document.selection.createRange();
		rng.collapse(true);
		rng.moveStart("character", -el.value.length);
		ii=rng.text.length;
		}
		return ii-1;
		}	
		
		
			

		}

		this.select = new function NAMESPACE__$element$select()
		{
			this.get_selected_text = function $element$select$get_selected_text(select)
			{
				try
				{
					$.vp(arguments, {type:"DOMElement:select"});
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if (select.options.length === 0) return null;
				
				return select.options[select.selectedIndex].text;
			}
			
			this.populate = function $element$select$populate(select, array, value_field, text_field)
			{
				try
				{
					$.vp(arguments, {type:"DOMElement:select"}, {type:"Array"}, {type:"String"}, {type:"String"});
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				select.options.length = 0;
				
				for (var i=0; i<array.length; i++)
				{			
					$.element.create("option", select, {value:$.lang.return_value(array[i], value_field), _text:$.lang.return_value(array[i], text_field)});
				}
			}
			
			this.show_loading = function $ui$element$show_loading(selects)
			{
				try
				{
					$.vp(arguments, {type:"Array"});
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				for (var i=0; i<selects.length; i++)
				{
					selects[i].options.length = 0;
					
					$.element.create("option", selects[i], {_text:"Loading..."});
				}
			}

		}

		this.table = new function NAMESPACE__$element$table()
		{
			this._clear = function(table, confirm_function)
			{
				var rows; //Array
				
				//
				
				if (confirm_function == null)
				{
					while (table.rows.length > 0)
					{
						table.deleteRow(table.rows.length-1);
					}
				
					return;
				}
				
				//
				
				rows = [];
						
				$.lang.for_item
				(
					table.rows,
					function(row)
					{
						if (confirm_function(row))
						{
							rows.push(row);
						}
					}
				);		
				
				$.lang.for_item
				(
					rows,
					function(row)
					{
						table.deleteRow(row.rowIndex);
					}
				);
			}
			
			
			
			//DEPRECATED//
			this.create = function(table_data, cell_override, row_override) //, parent_element)
			{
				try
				{
					$.vp
					(
						arguments,
						{
							type:		["Array", "Object"],
							optional:	true
						},
						{
							type:		"Function",
							optional:	true
						},
						{
							type:		"Function",
							optional:	true
						}
					)
				}
				catch(e){throw e;}
				
				//
		
				var table = document.createElement("table");
				
				table.cellPadding = "0px";
				table.cellSpacing = "0px";
				
				//
				
				if (table_data !== undefined)
				{
					if ($.lang.is_array(table_data))
					{
						for (var i=0; i<table_data.length; i++)
						{
							table.insertRow(-1);
		
							for (var ii=0; ii<table_data[i].length; ii++)
							{
		var cell_data; //variant
		
								//
		
								cell_data = table_data[i][ii];
		
								if ($.lang.array.contains(["string", "number"], typeof(cell_data)))
								{
									cell_data = document.createTextNode(cell_data);
								}
								
								//
								
								if (($.reflection.is_element(cell_data, true) === false) && (cell_data !== null))
								{
									throw new $.InvalidParameterTypeError("Cell data must contain: DOMElement, DOMTextNode, String, or null value.");
								}
		
								//
		
								if (cell_data !== null)
								{
									table.rows[i].insertCell(-1).appendChild(cell_data);
									
									if (cell_override != null)
									{							
										cell_override(table.rows[i].cells[table.rows[i].cells.length-1]);
									}
								}
		
								/*
								if (cell_data !== null)
								{
									if (cell_override != null)
									{
										cell_override(cell_data);
									}
									
									table.rows[i].insertCell(-1).appendChild(cell_data);
								}
								*/
							}
							
							//
							
							if (row_override != null)
							{
								row_override(table.rows[table.rows.length-1]);
							}
						}
					}
					else
					{
						var row; //DOMElement:td
						
						for (i in table_data)
						{
							row = table.insertRow(-1);
							
							if (row_override !== undefined)
							{
								row_override(row);
							}
							
							//
							
							if ($.lang.array.__contains(["string", "number"], typeof(table_data[i])))
							{
								row.insertCell(-1).innerHTML = i;
								row.insertCell(-1).innerHTML = table_data[i];
								
								if (cell_override !== undefined)
								{
									cell_override(row.cells[0]);
									cell_override(row.cells[1]);
								}
							}
						}
					}
				}
				
				//
				
				//if (parent_element !== undefined)
				//{
				//	parent_element.appendChild(table);
				//}
				
				//
		
				return table;
			}
			
			this.populate = function(table, data, cell_override, row_override)
			{
				/*
				var call_override_function = function(override_function)
				{
					var returned; //Variant
					
					//
					
					if (override_function != null)
					{
						if (override_function === row_override)
						{
							returned = row_override(table.rows[i], data[i]);
						}
						
						if (override_function === cell_override)
						{
							returned = cell_override(table[i][ii], data[i][ii]);
						}
						
						if (returned === undefined)
						{
						}
					}
				}
				*/	
			
				var populate_cell = function(cell_data)
				{
					switch (typeof(cell_data))
					{
						case "string":
						case "number":
						{
							cell_data = document.createTextNode(cell_data);
							
							break;
						}
					}
					
					table.rows[i].cells[ii].appendChild(cell_data);
				}
				
				////
				
				var i, ii;		//Number
				var attribute;	
				
				//
				
				try
				{
					$.vp(arguments, [
										{
											type:		"DOMElement:table"
										},
										{
											type:		["Object", "Array"] //replace with Array of certain contents ex: DOMElement, String, Number, ...
										},
										{
											type:		"Function",
											optional:	function(){}
										},
										{
											type:		"Function",
											optional:	function(){}
										}
									]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if ($.lang.is_array(data))
				{
					for (i=0; i<data.length; i++)
					{
						table.insertRow(-1); //table.appendChild(document.createElement("tr"));
		
						if (row_override != null)
						{
							data[i] = row_override(table.rows[i], data[i]);
						}
										
						for (ii=0; ii<data[i].length; ii++)
						{
							table.rows[i].insertCell(-1); //table.rows[i].appendChild(document.createElement("tr"));
							
							if (cell_override != null)
							{
								data[i][ii] = cell_override(table.rows[i].cells[ii], data[i][ii]);
							}					
							
							populate_cell(data[i][ii]);
						}
					}
				}
				else
				{
					i = 0;
					
					for (attribute in data)
					{
						table.insertRow(-1); //table.appendChild(document.createElement("tr"));
						
						if (row_override != null)
						{
							data[attribute] = row_override(table.rows[i], data[attribute]);
						}
						
						//
						
						table.rows[i].insertCell(-1); //table.rows[i].appendChild(document.createElement("tr"));
						ii = 0;
						populate_cell(attribute);
						if (cell_override != null)
						{
							cell_override(table.rows[i].cells[ii], attribute);
						}
						
						ii = 1;
						table.rows[i].insertCell(-1); //table.rows[i].appendChild(document.createElement("tr"));
						populate_cell(data[attribute]);
						if (cell_override != null)
						{
							cell_override(table.rows[i].cells[ii], data[attribute]);
						}
						
						//
						
						i++;
					}
				}
				
				//
				
				return table;
			}
			
			this.create_row = function element$table$create_row(table, cell_data, attributes, styles, is_header)
			{
				var tr; //DOMElement:tr
				
				//
				
				try
				{
					$.vp
					(
						arguments,
						[
							{
								type:		"DOMElement:table",
								optional:	function(){}
							},
							{
								type:		"Array",
								optional:	function(){}
							},
							{
								type:		"Object",
								optional:	function(){}
							},
							{
								type:		"Object",
								optional:	function(){}
							},
							{
								type:		"Boolean",
								optional:	function(){}
							}
						]
					);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if (table == null)
				{
					tr = document.createElement("tr");
				}
				else
				{		
					if (table.getElementsByTagName("tbody").length === 0)
					{
						table.appendChild(document.createElement("tbody"));
					}
					
					table = table.getElementsByTagName("tbody")[0];
		
					//tr = table.insertRow(-1);
					tr = table.appendChild(document.createElement("tr"));
				}
						
				if (cell_data != null)
				{
					$.lang.for_each
					(
						cell_data,
						function(index)
						{
							return $.element.table.create_cell(tr, cell_data[index], null, null, null, is_header);
						}
					);
				}
				
				//
				
				if ((attributes != null) || (styles != null)) //refine!
				{
					$.element.modify(tr, attributes, styles);
				}
				
				//
				
				return tr;
			}
			
			this.create_cell = function element$table$create_cell(row, content, attributes, styles, events, is_header)
			{
				var populate_cell = function()
				{
					if (content != null)
					{
						switch (typeof(content))
						{
							case "number":
							case "string":
							{
								t_dh.innerHTML = content;
								
								break;
							}
							case "function":
							{
								content = content();
								
								populate_cell();
								
								break;
							}
							default:
							{
								t_dh.appendChild(content);
								
								break;
							}
						}
					}		
				}
				
				////
				
				var t_dh; //DOMElement:td
				
				//
				
				try
				{
					$.vp
					(
						arguments,
						[
							{
								type:		"DOMElement:tr"
							},
							{
								type:		["String", "Number", "DOMElement", "Function"],
								allow_null:	true,
								optional:	function(){}
							},
							{
								type:		"Object",
								optional:	function(){}
							},
							{
								type:		"Object",
								optional:	function(){}
							},
							{
								type:		"Object",
								optional:	function(){}
							},
							{
								type:		"Boolean",
								optional:	function(){is_header=false;}
							}
						]
					);
				}
				catch (e)
				{
					throw e;
				}
				
				//
						
				t_dh = document.createElement((is_header) ? "th" : "td");
				
				if (content != null)
				{
					populate_cell();
				}
				
				if ((attributes != null) || (styles != null)) //refine!
				{
					$.element.modify(t_dh, attributes, styles, events);
				}
				
				row.appendChild(t_dh);
				
				return t_dh;
			}
			
			this.insert_row = function(table, row, position)
			{
				var tr; //DOMElement:tr
				
				//
				
				try
				{
					$.vp
					(
						arguments,
						[
							{
								type:		"DOMElement:table"
							},
							{
								type:		"DOMElement:tr"
							},
							{
								type:		"Number",
								optional:	function(){position=0;}
							}
						]
					);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				tr = table.insertRow(position);
				
				tr.parentNode.replaceChild(row, tr);
			}
			
			this.borderize = function element$table$borderize(table, style, sides, rows)
			{
		 //TODO switch sides and row arguments to align with colorize
				var row;				//Number
				var col;				//Number
				
				var converted_style;	//Object
				
				//
				
				try
				{
					$.vp
					(
						arguments,
						[
							{
								type:		"DOMElement:table"
							},
							{
								type:		["String", "Object"]
							},
							{
								type:		["String", "Array-String"],
								optional:	$.lang.empty_function
							},
							{
								type:		["Number", "Array-Object"],
								optional:	$.lang.empty_function
							}
						]
					);
				}
				catch (e)
				{
					throw e;
				}
				
				//
						
				if ((rows == null) || (rows === -1))
				{
					if (typeof(style) === "string")
					{
						converted_style = {border:style};
					}
					else
					{
						converted_style = {borderColor:style.color, borderStyle:style.style, borderWidth:style.width};
					}
					
					//
					
					$.element.modify(table, null, converted_style);
					
					if (rows == null)
					{
						$.element.modify(table, null, {borderCollapse:"collapse"});
						
						for (row=0 ; row<table.rows.length; row++)
						{
							for (col=0; col<table.rows[row].cells.length; col++)
							{
								$.element.modify(table.rows[row].cells[col], null, converted_style);
							}
						}
					}
				}
				else
				{
					var i;
					var ii;
					var tr;
					
					//
					
					if (typeof(rows) !== "number")
					{
						throw new $.NotImplementedError();
					}
					
					//
					
					tr = table.rows[rows];
					
					if (typeof(sides) === "string")
					{
						sides = [sides];
					}
					
					//
					
					for(i=0; i<tr.cells.length; i++)
					{
						for (ii=0; ii<sides.length; ii++)
						{
							sides[ii] = $.lang.string.to_proper_case(sides[ii]);
							
							tr.cells[i].style["border" + sides[ii]] = style;
						}
					}		
				}
			}
		
			this.modify = function $element$table$borderize(table, style)
			{
				var row;				//Number
				var col;				//Number
				
				//
				
				try
				{
					$.vp(arguments, [{type:"DOMElement:table"}, {type:"Object"}]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				for (row=0 ; row<table.rows.length; row++)
				{
					for (col=0; col<table.rows[row].cells.length; col++)
					{
						$.element.modify(table.rows[row].cells[col], null, style);
					}
				}
			}
			
			this.colorize = function element$table$colorize(table, colors, rows)
			{
				var row;		//Number
				var modulas;	//Number
				var remainder;	//Number
				var rowss;		//Array
				
				//
				
				try
				{
					$.vp(arguments, [
										{
											type:		"DOMElement:table"
										},
										{
											type:		"Array-String"  //test Array-String
										},
										{
											type:		["Array-Number", "Array-DOMElement:tr"],
											optional:	function(){}
										}
									]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if (rows == null)
				{
					rowss = [];
									
					for (row=0; row<table.rows.length; row++)
					{
						if (table.rows[row].parentNode.nodeName.toUpperCase() === "THEAD")
						{
							continue;
						}
						
						if (table.rows[row].cells[0].nodeName === "TH")
						{
							continue;
						}
						
						rowss.push(table.rows[row]);
					}
				}
				else
				{
					rowss = rows;
				}
						
				//
				
				for (row=0; row<rowss.length; row++)
				{
					for (modulas=0; modulas<colors.length; modulas++)
					{
						if (colors[modulas] === null)
						{
							continue;
						}
						
						//
						
						for (remainder=0; remainder<colors[modulas].length; remainder++)
						{
							if (colors[modulas][remainder] === null)
							{
								continue;
							}
							
							//
							
							if (remainder === (row % modulas))
							{
								if (typeof(rowss[row]) === "number")
								{
									table.rows[rowss[row]].style.backgroundColor = colors[modulas][remainder];
								}
								else
								{
									rowss[row].style.backgroundColor = colors[modulas][remainder];
								}
								
								break;
							}
						}
					}
					
					
					
					//switch (row % 2)
					//{
						//case 0:
						//{
							//table.rowss[row].style.backgroundColor = colors[row % 2];
							
							//break;
						//}
						//case 1:
						//{
							//break;
						//}
					//}
				}
				
				//table.rows[row].style.backgroundColor = colors[row % 2];
			}
			
			this.populate_colgroup = function(table, cols)
			{
				var colgroup;	//DOMElement:colgroup
				var i;			//Number
				
				//
				
				colgroup = table.childNodes[0];
				
				if (colgroup.nodeName !== "COLGROUP")
				{
					colgroup = table.insertBefore(document.createElement("colgroup"), colgroup);
				}
				
				//
				
				$.element._clear(colgroup);
				
				for (i=0; i<cols.length; i++)
				{
					$.element.create("col", colgroup, null, cols[i]);
				}
			}	

		}

		this.EventMetabase = function $element$EventMetabase__CLASS()
		{typeof "$element$EventMetabase__CLASS";
			var $this = this;
			
			//#region OBJECT
			
				var EventMetabaseEntry = function(element, event, func, event_func)
				{
					this.element		= element;		//DOMElement
					this.event			= event;		//String
					this.func			= func;			//Function
					this.event_func		= event_func;	//Function
					
					//this.order			= order;		//Number	
				}
				
			//#endregion
			
			//#region VARIABLE
			
				var metabase = new Array();
			
			//#endregion
			
			//#region PROPERTY
			
				this.length	= 0;
			
			//#endregion
			
			//#region METHOD
			
				this.add = function(element, event, func, event_func)
				{
					metabase.push(new EventMetabaseEntry(element, event, func, event_func));
					
					this.length++;
				}
				
				this.remove = function(element, event, func)
				{
					var position;	//Number
					var event_func; //Function
					
					//
					
					position = find_entry(element, event, func);
					
					if (position > -1)
					{
						event_func = metabase[position].event_func;
					}
					
					if (event_func !== undefined)
					{
						this.length--;
						
						metabase[position] = undefined;
						
						return event_func;
					}
					
					return null;
				}
				
				this.find_handlers = function(element, event)
				{
					var handlers;	//Array
					var i;			//Numner
					
					//
					
					handlers = new Array();
					
					//
					
					for (i=0; i<metabase.length; i++)
					{
						if (metabase[i] !== undefined && metabase[i].element === element && metabase[i].event === event)
						{
							handlers.push(metabase[i]);
						}
					}
					
					//
					
					return handlers;
				}
			
			//#endregion
			
			///#region ROUTINE
			
				var find_entry = function(element, event, func)
				{
					var i; //Numner
					
					//
									
					for (i=0; i<metabase.length; i++)
					{
						if (metabase[i] !== undefined && metabase[i].element === element && metabase[i].event === event && metabase[i].func === func)
						{
							return i;
						}
					}
					
					//
					
					return -1;
				}
			
			//#endregion
			
			//#ergion CONSTRUCTOR
			
				//var event_metabase = new EventMetabase();
				
				if ($this.constructor.instance !== undefined)
				{
					throw new $.ObjectInstantiationError("The EventMetabase can only be instantiated by the framework.");
				}
				
				$this.constructor.instance = this;
			
			//#endregion

		}

		this.StateHolder = function $element$StateHolder__CLASS(element, attributes, styles)
		{typeof "$element$StateHolder__CLASS";
			//#region VARIABLE
			//#enregion
			
			//#region FIELD
			
				this.state; //Object
			
			//#endregion
			
			//#region property
			
				this.get_element = function()
				{
					return element;
				}
				
			//#endregion
			
			//#region METHOD
				
				this.apply = function $element$StateHolder(element)
				{
					try
					{
						$.vp(arguments, {type:"DOMElement", optional:true});
					}
					catch(e){throw e;}
					
					//
								
					element = $.lang.ifnu(this.get_element, element);
					
					var style; //DOMStyle
					
					if (styles != null)
					{
						style = this.state.style;
						
						delete this.state["style"];
					}
					
					$.element.modify(element, this.state, style);
				}
			
			//#endregion
			
			//#region ROUTINE
			
				var hold = function()
				{
					this.state = {};
					
					//
					
					if (attributes != null)
					{
						for	(var i=0; i<attributes.length; i++)
						{
							if ($.lang.array.__contains(["clientWidth", "clientHeight"], attributes[i])) throw new Error("need to implement for clientWidth & clientHeight");
							
							switch (attributes[i])
							{
								case "parentNode":
								{
									if ((element.parentNode !== null) && (element.parentNode.nodeType === 11))
									{
										this.state.parentNode = null;
										
										continue;
									}
		
									break;
								}
							}
							
							this.state[attributes[i]] = element[attributes[i]];
						}
					}
					
					if (styles != null)
					{
						this.state.style = {};
						
						var current_style = $.element.get_css(element);
						
						for (var i=0; i<styles.length; i++)
						{
							this.state.style[styles[i]] = current_style[styles[i]];
						}
					}
				}
			
			//#endregion
			
			//#region CONSTRUCTOR
						
				try
				{
					$.vp(arguments, {type:"DOMElement"}, {type:"Array", optional:true}, {type:"Array", optional:true});
				}
				catch(e){throw e;}
				
				//
				
				hold.call(this);
						
			//#endregion

		}
	}

	this.dom_event = new function NAMESPACE__$dom_event()
	{
		//#region METHOD
		
			this.cancel = function(event, value)  //like by Utility.js/preventDefault
			{
				try
				{
					$.vp(arguments, {type:"DOMEventInterface"}, {type:"Boolean", optional:true});
				}
				catch(e){throw e;}
				
				//
				
				if ((value === false) || (value == null))
				{
					if (event.preventDefault)
					{
						event.preventDefault();
						
						return;
					}
					
					if ("returnValue" in event)
					{
						event.returnValue = false;
						
						return;
					}
					
					throw new $.NotSupportedError("The browser implementation does not support known DOM Level II event cancellation.");
				}
			}
			
			this.is_event_object = function(object)
			{
				//
				//used by GetType, only works for IE!
				
				return ($.has_interface({"type":"String", "cancelBubble":"Boolean"}, object) === true);
			}
		
			this.get_source = function $dom_event$get_source(event)
			{
				if ("srcElement" in event) return event.srcElement;
	
				if ("currentTarget" in event) return event.currentTarget;
	
				return null;
			}
	
			this.get_target = function $dom_event$get_target(event)
			{
				if ("toElement" in event) return event.toElement;
	
				if ("target" in event) return event.target;
	
				return null;
			}
			
			this.determine_key_code = function $dom_event$determine_key_code(event)
			{
				if (event.keyCode === 0)
				{
					return event.charCode;
				}
				else
				{
					return event.keyCode;
				}
			}
			
			
			this.fire = function(element, event)
			{
				var init_mouse_event = function()
				{
					var event = document.createEvent("MouseEvent");
					
					event.initMouseEvent("click", true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
					
					return event;
				}
				
				var init_keyboard_event = function()
				{
					var event = document.createEvent("KeyboardEvent");
	
					event.initKeyEvent("keypress", true, true, null, false, false, false, false, 9, 0);
					
					return event;
				}
				
				////
							
				if (event.substring(0, 2) === "on")
				{
					event = event.substring(2);
				}
			
				switch (event)
				{
					case "click":
					{
						if (typeof(element[event]) === "object") return element[event]();
						else
						{				
							//
							//returns false if PreventDefault called
													
							return element.dispatchEvent(init_mouse_event());
						}
	
						break;
					}
					case "change": //TODO: refine/test
					{
						if (element.fireEvent)
						{
							element.fireEvent("change");
						}
						else return element.dispatchEvent(init_keyboard_event());
						
						break;
					}
				}
			}
		
		//#endregion
		
		//#region ENUM
			
			this.MouseButton = new function()
			{
				this.left	= 0;
			}
			
			this.Type = new function()
			{
				this.click		= "click";
				this.mouse_down	= "mousedown";
				this.mouse_up	= "mouseup";
				this.mouse_move	= "mousemove";
				this.resize		= "resize";
				this.key_press	= "keypress";
			}
			
		//#endregion


		this.EventObj = function $dom_event$EventObj__CLASS(event)
		{typeof "$dom_event$EventObj__CLASS";
			/*
			//#region VARIABLE
			
				var _event;			//DOMEvent
				
				var _source;		//DOMElement
				var _target;		//DOMElement
				
				var _mouse_button;	//Number
			
			//#endregion
			
			//#region
				
				this.event; //DOMEvent
			
			//#endregion
			
			//#region METHOD
			
				this.get_source = function $dom_event$EventObj$get_source()
				{
					if (_source === undefined)
					{
						_source = $.dom_event.get_source(_event);
					}
					
					return _source;
				}
				
				this.get_target = function $dom_event$EventObj$get_target()
				{
					if (_target === undefined)
					{
						_target = $.dom_event.get_target(_event);
					}
					
					return _target;
				}
			
				this.get_mouse_button = function $dom_event$EventObj$get_mouse_button()
				{
					var button; //Number
					
					//
					
					if (_mouse_button === undefined)
					{
						button = _event.button;
						
						if ($.browser.get_agent().name === "Explorer")
						{
							button--;
						}
						
						_mouse_button = button;
					}
											
					return _mouse_button;
				}
			
			//#endregion
			
			//#region CONSTRUCTOR
				
				_event = event;
					
				this.event = _event;
			
			//#endregion
			*/
			
			this.event = event;
			
			//
			
			var key_code; //Number
			var key_char; //String
			
			//
			
			this.source			= $.dom_event.get_source(event);
			this.target			= $.dom_event.get_target(event);
			
			this.screenX		= event.screenX;
			this.screenY		= event.screenY;
			
			this.clientX		= event.clientX;
			this.clientY		= event.clientY;
				
			this.get_key_code=	function()
								{
									if (key_code === undefined)
									{
										key_code = $.dom_event.determine_key_code(event);
									}
									
									return key_code;
								};
								
			this.get_key_char=	function()
								{
									if (key_char === undefined)
									{
										key_char = String.fromCharCode(this.get_key_code());
									}
									
									return key_char;
								};
			
			
			
			
		
			

		}
	}

	this.window = new function NAMESPACE__$window()
	{
		this.width = function() //deprecated
		{
			if (window.innerWidth !== undefined) return window.innerWidth;
	
			if (document.compatMode === 'CSS1Compat') return document.documentElement.clientWidth;
			
			return document.body.clientWidth;
			
			/*
			if (document.body)
			{
				return document.body.clientWidth;
			}
					
			return window.undefined; //throw exception
			*/
		}
		
		this.get_width = function()
		{
			if (window.innerWidth) return window.innerWidth;
	
			if (document.compatMode === 'CSS1Compat') return document.documentElement.clientWidth;
			
			return document.body.clientWidth;
		}
	
		this.height = function() //deprecated
		{
			if (window.innerHeight !== undefined) return window.innerHeight;
	
			if (document.compatMode === 'CSS1Compat') return document.documentElement.clientHeight;
			
			return document.body.clientHeight;
			
			/*
			if (document.body)
			{
				return document.body.clientHeight;
			}
	
			return window.undefined;  //throw exception
			*/
		}
		
		this.get_height = function()
		{
			if (window.innerHeight) return window.innerHeight;
	
			if (document.compatMode === 'CSS1Compat') return document.documentElement.clientHeight;
			
			return document.body.clientHeight;	
		}
		
		this.get_scroll_left = function()
		{
			return Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
		}
	
		this.get_scroll_top = function()
		{
			return Math.max(document.body.scrollTop, document.documentElement.scrollTop);
		}
		
		
		
		
	
		this.open = function(url)
		{
			try
			{
				$.vp(arguments, {type:"String"});
			}
			catch (e)
			{
				throw e;
			}
			
			//
			
			return window.open(url, "n", null, null);
		}
		
		this.generate_qs = function(object)
		{
			var str = "";
			
			for (var a in object)
			{
				str += ("&" + a + "=" + escape(object[a]));
			}
			
			return str.replace("&", "?");
		}
	
		this.parse_qs = function(window_object)
		{
			var qs = {};
			
			var x = window_object.location.search.replace("?", "").split("&");
			
			for (var i=0; i<x.length; i++)
			{
				var xx = x[i].split("=");
				
				for (var ii=0; ii<x.length; (ii=ii+2))
				{
					qs[xx[ii]] = unescape(xx[ii+1]);
				}
			}
			
			return qs;			
		}


		this.document = new function NAMESPACE__$window$document()
		{
		/*			
		this.disable_selecting = function jcsfl$window$document$disable_selecting()
		{
			window.document.body.onselectstart = function(){return false;};
		}
		*/
		
			this.get_base = function()
			{
				return document.getElementsByTagName("base")[0].href
			}
			
			this.get_body = function()
			{
				//may need to revise for universal support
		
				return document.getElementsByTagName("BODY")[0];
			}
			
			this.get_width = function()
			{
				var w = $.window.get_width();
				
				if (w > document.body.scrollWidth) return w;
				
				if (w === document.body.scrollWidth) return document.documentElement.scrollWidth;
				
				return document.documentElement.scrollWidth;
			}
			
			this.get_height = function()
			{
				var h = $.window.get_height();
				
				if (h > document.body.scrollHeight) return h;
				
				if (h === document.body.scrollHeight) return document.documentElement.scrollHeight;
				
				return document.documentElement.scrollHeight;
			}
		
		
		////
		this.width = function() //deprecated
		{
			var window_width;	//Number
		
			//
		
			window_width = $.window.width();
		
			if (window_width > document.body.scrollWidth)
			{
				return window_width;
			}
			else
			{
				return document.body.scrollWidth;
			}
		
			/*
			var body;			//DOMElement:body
			var window_width;	//Number
		
			//
		
			body = $.window.document.get_body();
		
			window_width = $.window.width();
		
			if (window_width > body.scrollWidth)
			{
				return window_width;
			}
			else
			{
				return body.scrollWidth;
			}
			*/
		}
		this.height = function() //deprecated
		{
			var window_height = $.window.get_height();
		
			if (window_height > document.body.scrollHeight) return window_height;
			
			return document.body.scrollHeight;
		}	
		////
		
			
		
			this.disable = function $window$document$disable(style)
			{	
				var resize_div = function $window$document$disable$$resize_div() //TODO: replace style paramters with order based parameters: opacity, color, cursor, z_index, 
				{
					with (div.style)
					{
						left	= "0px";
						top		= "0px";
						width	= ($.window.document.get_width() + "px");
						height	= ($.window.document.get_height() + "px");
					}
				}
			
				////
				
				try
				{
					$.vp(arguments, {type:"Object", optional:function(){style={};}});
					
					$.vo
					(
						style,
						{
							named:	$.element.css.Style.opacity,
							type:	$.Type.Number,
							value:	0
						},
						{
							named:	$.element.css.Style.color,
							type:	$.Type.String,
							value:	$.element.css.Color.white
						},
						{
							named:	$.element.css.Style.z_index,
							type:	$.Type.Number,
							value:	($.layering.get_top_z_index() + 1)
						},
						{
							named:	$.element.css.Style.cursor,
							type:	$.Type.String,
							value:	$.String.empty
						}
					);
				}
				catch(e){throw e;}
				
				/*
				if (style == null)
				{
					style = {};
				}
				else
				{
					style = $.object.deep_clone(style);
				}
				
				//
						
				try
				{		
					style.opacity	= $.vv(style.opacity, {type:"Number", default_value:0}).toString();
					style.color		= $.vv(style.color,   {type:"String", default_value:"White"});
					style.z_index	= $.vv(style.z_index, {type:"Number", default_value:($.layering.get_top_z_index() + 1)}).toString();
					style.cursor	= $.vv(style.cursor,  {type:"String", default_value:""});
				}
				catch(e){throw e;}
				*/
				
				//
				
				var mask_div_name = "DIV_cfl_document_disabler";
				
				var div = g$(mask_div_name);
				
				if (div === null)
				{
					$.lang.rename_attribute(style, $.element.css.Style.color, $.element.css.Style.backgroundColor);
				
					div = $.element.create($.element.Type.div, document.body, {id:mask_div_name});
				
					$.element._set_styles(div, style);
					$.element._set_styles(div, {position:$.element.css.Position.absolute});
				
					window.document.__resize_div__ = resize_div;
					
					$.object.attach_event(window, $.dom_event.Type.resize, window.document.__resize_div__); //executes resize twice for horizontal resize in IE (maybe FF) due to scrollbar recalc?		
					
					resize_div();
				}
				else
				{
					//throw new Error("already disabled");
					//$.element.change_opacity(div, style.opacity);
					
					//element.style.backgroundColor = style.color;
				}
				
				return div;
			}
			
		
			this.enable = function $window$document$enable()
			{
				var div = document.getElementById("DIV_cfl_document_disabler");
		
				if (div === null)
				{
					//throw error?
					
					return;
				}
		
				//
		
				$.object.detach_event(window, "resize", window.document.__resize_div__); //executes resize twice for horizontal resize in IE (maybe FF) due to scrollbar recalc?
		
				document.body.removeChild(div);
		
				div = null;
				
				//delete this.disable[style];
				
				//alert(window.document["__resize_div__"]);
				
				//
				
				/*
				if (!(($.browser.get_agent().name === "Explorer") && ($.browser.get_agent().version >= 7)))
				{
					select_elements = document.getElementsByTagName("select");
					
					for (i=0; i<select_elements.length; i++)
					{
						select_elements[i].style.visibility = "visible";
					}
				}
				*/
			}
		
			this.get_asp_net_form = function(doc_obj)
			{
				try
				{
					$.vp(arguments, {type:"DOMDocument", optional:function(){doc_obj=window.document;}});
				}
				catch(e){throw e;}
		
				//
		
				var f = doc_obj.forms;
				
				if (f.length > 1)
				{
				    return f["MAINFORM"];
				}
				else
					{
				    switch (f.length)
				    {
					case 1:
					{
						    return f[0];
					}
					    case 0:
					{
						    throw new Error("Can not find ASP.NET form!");
					}
				}
			}
			}
		
			this.append_to_postback = function(key, val, form)
			{
				//var hdn; //DOMElement:input_hidden
				
				//
				
				try
				{
					$.vp(arguments, {type:"String"}, {type:"String"}, {type:"DOMElement:form", optional:function(){form=$.window.document.get_asp_net_form();}});
				}
				catch(e){throw e;}
				
				//
		
				/*
				hdn = document.createElement("INPUT");
		
				hdn.setAttribute("type", "hidden");
				hdn.setAttribute("id", key);
				hdn.setAttribute("name", key); //may be required by ASP.Net
				hdn.setAttribute("value", val);
				*/
				
				form.appendChild($.element.create("input", form, {type:"hidden", id:key, name:key, value:val}));
			}
			
			this.remove_from_postback = function(key, form)
			{
				try
				{
					$.vp(arguments, {type:"String"}, {type:"DOMElement:form", optional:function(){form=$.window.document.get_asp_net_form();}});
				}
				catch(e){throw e;}
				
				//
				
				var field = document.getElementById(key);
				
				if (field === null)
				{
					return;
				}
				else
				{
					field.parentNode.removeChild(field);
				}
			}

		}
	}

	this.func = new function NAMESPACE__$func()
	{
		this.call = function jcsfl$func$call(func)
		{
			func = $jcsfl.vv(func, "Function", null, true);
	
			if (func != null)
			{
				func();
			}
		}

	}

	this.ajax = new function NAMESPACE__$ajax()
	{
	var $ajax = this;
	
		//
		//
		//
		
		this.get_http_request_object = function $ajax$get_http_request_object()
		{
			var hro; //XMLHTTPRequestObject
	
			try
			{
				hro = new XMLHttpRequest();
			}
			catch(e)
			{
				try
				{
					hro = new ActiveXObject("Msxml2.XMLHTTP");
				}
				catch(e)
				{
					try
					{
						hro = new ActiveXObject("Microsoft.XMLHTTP");
					}
					catch(e)
					{
						throw new Error("The XMLHttpRequest object could not be instantiated.");
					}
				}
			}
	
			return hro;
		}
		
		var determine_obc_error = function(hro, url)
		{
			switch (hro.status)
			{
				case 404:
				{
					return new $ajax.ResourceNotFoundError("", url);
				}
				case 500:
				{
					if (hro.responseText.match("Web Service method name is not valid.") !== null) return new $ajax.RPCInvalidMethodNameError("", url);
	
					if (hro.responseText.match("Missing parameter:") !== null) return new $ajax.RPCMissingParameterError("", url);
					
					return new $ajax.RPCServerExceptionError("", url, hro.responseText);
				}
			}
		}
		
		var out_of_band_call = function $ajax$$out_of_band_call(current_attempt, current_canceller, type, url, parameters, ignore_error, asynchronous, callback, time_out, attempts)
		{
			var callback_caller = function $ajax$$out_of_band_call$$callback_caller()
			{
				if (hro.readyState === 4)
				{
					obc_canceller();
				}
							
				callback(hro);
			}
			
			var canceller = function $ajax$$out_of_band_call$$canceller(use_callback)
			{
				//
				//If called without 'use_callback' parameter the obc is cancelled. If called with paramter subsequent attampts to complete the call are made.
				
				if ((use_callback !== out_of_band_call) && (arguments.callee.expired)) return;
				
				arguments.callee.expired = true;
				
				//
	
				if (!obc_canceller.expired)
				{
					obc_canceller();
				}
				
				//
				
				hro.onreadystatechange = null;
				
				hro.abort();
				
				//
				
				if (use_callback === out_of_band_call)
				{
					if ((attempts > 1) && (current_attempt <= attempts))
					{				
						out_of_band_call((current_attempt + 1), current_canceller, type, url, parameters, ignore_error, asynchronous, callback, time_out, attempts);
						
						return;
					}
				
					//
					
					callback(new $.ajax.RPCTimeOutError("", url, time_out));
				}			
			}
			
			var hro_send = function $ajax$$out_of_band_call$$hro_send(contents)
			{
				if (asynchronous === true)
				{
					if (time_out == null)
					{
						time_out = 60;
					}
				
					if (time_out >= 0)
					{
						obc_canceller = $.lang.__delay_execute(canceller, (time_out * 1000), null, [out_of_band_call]);
					}
				}
	
				hro.send(contents);
			}
			
			////
					
			var response;		//String
			var obc_canceller;	//Number
			
			//
			//build querystring to be used for out of band call
	
			var params; //String
	
			switch ($.GetType(parameters))
			{
				case null:
				{
					params = "";
					
					break;
				}
				case $.Type.Array:
				{
					//!need to implement
					
					/*
					for (var i=0; i<parameters.length; i++)
					{
						params += ("&" + parameters[i]);
					}
	
					params = params.slice(1);
					*/
					
					break;
				}
				case $.Type.String:
				{
					//validate parameters here!
					
					params = parameters;
					
					break;
				}
				default:
				{
					params = "";
					
					$.lang.for_each(parameters, function(property){params += ("&" + escape(property) + "=" + escape(parameters[property]));}); //refine
										
					params = params.slice(1);
				}
			}
					
			//
			//use XMLHTTPRequest object to make out of band call
			
			var hro = $ajax.get_http_request_object();
			
			if (callback !== null)
			{
				hro.onreadystatechange = callback_caller;
			}
							
			//
			
			switch (type)
			{
				case $ajax.RequestType.gget:
				{
					if (params !== "")
					{
						if (params[0] !== "?")
						{
							params = ("?" + params);
						}
					}
					
					//
					
					hro.open(type, (url + params), asynchronous);
					
					hro_send(null);
					
					break;
				}
				case $ajax.RequestType.post:
				{
					if (params[0] === "?")
					{
						params = params.slice(1);
					}
					
					//
	
					hro.open(type, url, asynchronous);
	
					hro.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					hro.setRequestHeader("Content-length", params.length);
					hro.setRequestHeader("Connection", "close");
					
					hro_send(params);
					
					break;
				}
			}
			
			//
			//check for out of band call server side Exception
			
			if (asynchronous === false)
			{
				if (ignore_error === false)
				{
					if (url.toLowerCase().indexOf(".asmx") === -1) //refinee
					{
						if (hro.responseText.indexOf("Server Error") > -1) //refine
						{
							var error_window; //DOMWindow
	
							//
	
							error_window = window.open("", "error");
	
							error_window.document.write(hro.responseText);
	
							//
	
							//TODO: revise for compatibility with XSS scanners
							/*
							error_window.document.body.innerHTML
							(("<div style='font-size:14px; font-weight:bold;'>" + "Server side out of band call Exception detected for: " + window.document.location + "</div><HR><div>See below for Exception specifics.</div>") + error_window.document.body.innerHTML);
							*/
						}
					}
					else
					{
						//
						//Exception or error returned by RPC
						
						switch (hro.status)
						{
							case 404:
							case 500:
							{
								throw determine_obc_error(hro, url);
							}
						}
					}
				}
				
				return hro;
			}
			else
			{
				return canceller;
			}
		}
		
		this.sync_get = function $ajax$sync_get(url, parameters, ignore_error, time_out)
		{
			try
			{
				$.vp
				(
					arguments,
					{
						type:		$.Type.String
					},
					{
						type:		[$.Type.String, $.Type.Array, $.Type.Object],
						optional:	function(){parameters=null;}
					},
					{
						type:		$.Type.Boolean,
						optional:	function(){ignore_error=false;}
					},
					{
						type:		$.Type.Number,
						optional:	true
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			try
			{
				var hro = out_of_band_call(1, null, $ajax.RequestType.gget, url, parameters, ignore_error, false, null, time_out, 1)
			}
			catch(e){throw e;}
			
			return hro;		
		}
		
		this.sync_get_as_xml = function $ajax$sync_get_as_xml(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_get(url, parameters, ignore_error, time_out);
			
			var response = hro.responseXML;
			
			hro = null;
			
			return response;
		}
		
		this.sync_get_as_text = function $ajax$sync_get_as_text(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_get(url, parameters, ignore_error, time_out);
			
			var response = hro.responseText;
			
			hro = null;
			
			return response;
		}
		
		this.sync_get_as_value = function $ajax$sync_get_as_value(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_get(url, parameters, ignore_error, time_out);
			
			var response = extract_string_value_from_xml(hro.responseXML);
			
			hro = null;
			
			return response;
		}
		
		this.sync_get_as_object = function $ajax$sync_get_as_object(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_get(url, parameters, ignore_error, time_out);
			
			var response = eval(extract_string_value_from_xml(hro.responseXML));
			
			hro = null;
			
			return response;
		}
	
		this.sync_post = function $ajax$sync_post(url, parameters, ignore_error, time_out)
		{
			try
			{
				$.vp
				(
					arguments,
					{
						type:		$.Type.String
					},
					{
						type:		[$.Type.String, $.Type.Array, $.Type.Object]
					},
					{
						type:		$.Type.Boolean,
						optional:	function(){ignore_error=false;}
					},
					{
						type:		$.Type.Number,
						optional:	true
					}
				);
			}
			catch(e){throw e;}
			
			//		
			
			try
			{
				var hro = out_of_band_call(1, null, $ajax.RequestType.post, url, parameters, ignore_error, false, null, time_out, 1)
			}
			catch(e){throw e;}
		
			return hro;
		}
		
		this.sync_post_as_xml = function $ajax$sync_post_as_xml(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_post(url, parameters, ignore_error, time_out);
			
			var response = hro.responseXML;
			
			hro = null;
			
			return response;
		}
		
		this.sync_post_as_text = function $ajax$sync_post_as_text(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_post(url, parameters, ignore_error, time_out);
			
			var response = hro.responseText;
			
			hro = null;
			
			return response;
		}
	
		this.sync_post_as_value = function $ajax$sync_post_as_value(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_post(url, parameters, ignore_error, time_out);
			
			var response = extract_string_value_from_xml(hro.responseXML);
			
			hro = null;
			
			return response;
		}
		
		this.sync_post_as_object = function $ajax$sync_post_as_object(url, parameters, ignore_error, time_out)
		{
			var hro = this.sync_post(url, parameters, ignore_error, time_out);
			
			var response = eval(extract_string_value_from_xml(hro.responseXML));
			
			hro = null;
			
			return response;
		}
		
		this.ReturnType	= new function()
		{
			this.xml	= "xml";
			this.text	= "text";
			this.value	= "value";
			this.object	= "object";
		}
		
		this.RequestType = new function()
		{
			this.gget	= "GET";
			this.post	= "POST";
		}
		
		//var async_call = function $ajax$async_call(current_attempt, type, url, parameters, ignore_error, callback, return_type, time_out, attempts)
		this.async_call = function $ajax$async_call(type, url, parameters, ignore_error, callback, return_type, time_out, attempts)
		{	
			var state_changed = function $ajax$async_call$$state_changed(returned)
			{		
				var create_object = function $ajax$async_call$$state_changed$$create_object()
				{
					var json = extract_string_value_from_xml(returned.responseXML);
					
					if (!isNaN(json))
					{
						callback(parseFloat(json));
						
						return;
					}
					
					if ((json.charAt(0) === "\"") && (json.charAt(json.length-1) === "\""))
					{
						callback(json.substr(1, (json.length-2)));
						
						return;
					}
					
					//
								
					try
					{
						var obj = $.lang.parse_json(json, true);
					}
					catch(e)
					{
						e.add_message(("url: " + url), true);
						
						obj = e;
					}
					
					callback(obj);
				}
				
				////
				
				if ($.GetType(returned) === (LIB_NAME + ".ajax.RPCTimeOutError")) //alternative: check for undefined here and create TimoutError here?
				{
	
					//if (current_attempt < attempts)
					//{
					//	async_call((current_attempt + 1), type, url, parameters, ignore_error, callback, return_type, time_out, attempts);
					//	
					//	return;
					//}
	
					if (ignore_error === false)
					{
						callback(returned);
					}
					
					return;
				}
				
				//
						
				switch (returned.readyState)
				{
					case 0: break;	//the request is not initialiazed
					case 1: break;	//the request has been set up
					case 2: break;	//the request has been sent
					case 3: break;	//the request is in process
					case 4:			//the request is complete
					{
						//
						//Exception or error returned by RPC
																					
						switch (returned.status)
						{
							case 404: //Not Found
							case 500: //Internal Server Error
							{
								callback(determine_obc_error(returned, url));
								
								break;
							}
							case 200: //OK
							{						
								if (callback !== null)
								{						
									switch (return_type)
									{							
										case $ajax.ReturnType.xml:
										{
											callback(returned.responseXML);
											
											break;
										}
										case $ajax.ReturnType.text:
										{
											callback(returned.responseText);
											
											break;
										}
										case $ajax.ReturnType.value:
										{
											callback(extract_string_value_from_xml(returned.responseXML));
											
											break;
										}
										case $ajax.ReturnType.object:
										{																		
											create_object();
											
											break;
										} 
									}
								}
														
								break;
							}
						}
					}
				}
			}
			
			////
					
			try
			{
				$.vp
				(
					arguments,
					{
						type:		$.Type.String //post or get
					},
					{
						type:		$.Type.String
					},
					{
						type:		[$.Type.String, $.Type.array, $.Type.Object],
						optional:	function(){parameters=null;}
					},
					{
						type:		$.Type.Boolean,
						optional:	function(){ignore_error=false;}
					},
					{
						type:		$.Type.Function,
						optional:	function(){callback=null;}
					},
					{
						type:		$.Type.String,
						optional:	function(){return_type=$ajax.ReturnType.xml}
					},
					{
						type:		$.Type.Number,
						optional:	true
					},
					{
						type:		$.Type.Number,
						optional:	function(){attempts=1;}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			return out_of_band_call(1, null, type, url, parameters, ignore_error, true, state_changed, time_out, attempts);
		}
		
		this.async_get_as_xml = function $ajax$async_get_as_xml(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("GET", url, parameters, ignore_error, callback, "xml", time_out, attempts);
		}
		
		this.async_get_as_text = function $ajax$async_get_as_text(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("GET", url, parameters, ignore_error, callback, "text", time_out, attempts);
		}
		
		this.async_get_as_value = function $ajax$async_get_as_value(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("GET", url, parameters, ignore_error, callback, "value", time_out, attempts);
		}
		
		this.async_get_as_object = function $ajax$async_get_as_object(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("GET", url, parameters, ignore_error, callback, "object", time_out, attempts);
		}
		
		this.async_post_as_xml = function $ajax$async_post_as_xml(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("POST", url, parameters, ignore_error, callback, "xml", time_out, attempts);
		}
		
		this.async_post_as_text = function $ajax$async_post_as_text(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("POST", url, parameters, ignore_error, callback, "text", time_out, attempts);
		}
		
		this.async_post_as_value = function $ajax$async_post_as_value(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("POST", url, parameters, ignore_error, callback, "value", time_out, attempts);
		}
		
		this.async_post_as_object = function $ajax$async_post_as_object(url, parameters, callback, ignore_error, time_out, attempts)
		{
			//$.vp by async_call
			
			//
			
			return this.async_call("POST", url, parameters, ignore_error, callback, "object", time_out, attempts);
		}
		
		var extract_string_value_from_xml = function $ajax$$extract_string_value_from_xml(xml)
		{
			//
			//Safari, Chrome
	
			if (xml === null) return $.String.empty;
			
			//
			//IE
	
			if ("text" in xml) return xml.text; //IE
			
			//
			//Opera
			
			if (xml.childNodes.length === 0) return $.String.empty;
			
			//
			//FF
			
			var node_index = 0;
			
			if (xml.childNodes[0].nodeType === 7)
			{
				node_index++;
			}
	
			//
			
			var node_value = $.String.empty;
			
			if (xml.childNodes[node_index].childNodes[0].nodeValue.indexOf("XML Parsing Error: no element found") === -1)
			{
				node_value += xml.childNodes[node_index].childNodes[0].nodeValue;
			}
			else
			{
				return $.String.empty;
			}
	
			for (var i=1; i<xml.childNodes[node_index].childNodes.length; i++)
			{
				node_value += xml.childNodes[node_index].childNodes[i].nodeValue;
			}
	
			return node_value;
		}
		
		//
		//
		
		this.insert_namespace = function(html, naspa) //revise
		{
			return html.replace(/\$this/g, naspa);
		}
		
		//
		
		this.RPCFailedError = function $ajax$RPCFailedError(additional_message, url)
		{
			return new $.ErrorBase(this, ("Remote procedure call failed.\n\n" + url), additional_message);
		}
		
		this.RPCInvalidMethodNameError = function $ajax$RPCInvalidMethodNameError(additional_message, url)
		{
			return new $.ErrorBase(this, ("Remote procedure call method name was not valid.\n\n" + url), additional_message);
		}
		
		this.RPCMissingParameterError = function $ajax$RPCMissingParameterError(additional_message, url)
		{
			return new $.ErrorBase(this, ("Remote procedure call is missing a parameter.\n\n" + url), additional_message);
		}
		
		this.RPCServerExceptionError = function $ajax$RPCServerExceptionError(additional_message, url, exception_message)
		{	
			var disect_exception_message = function()
			{
				/*
				var show_exception = function()
				{
					var w = window.open("");
					
					w.document.write(error_base.exception.message.replace(/\n/g, "<br />"));
					w.document.write("<br /><br />");
					w.document.write("<hr />");
					w.document.write(exception_message.replace(/\r\n/g, "<br />"));		
				}
				
				var is = function(error_text)
				{				
					return (this.message.toLowerCase().indexOf(error_text.toLowerCase()) > -1);
				}
				
				////
				
				var ex = exception_message.substr(0, exception_message.indexOf(" at "));
				
				if (ex.length > 100)
				{
					ex = (ex.substr(0, 97) + "...");
				}
				
				error_base.add_message(ex, true);
				
				//
				
				ex = exception_message.substr(0, exception_message.indexOf(":"));
				
				error_base.exception =
				{
					message:	exception_message.substring
								(
									(exception_message.indexOf(":") + 2),
									$.lang.math.least
									(
										(exception_message.indexOf("\n") - 1),
										(exception_message.indexOf(" ---> ") - 1)
									)
								),
					output:		exception_message,
					fullname:	ex,
					type:		$.lang.array.get_last(ex.substr(ex.lastIndexOf(".") + 1).split("+")),
					is:			is
				};
	
				//
				
				if (exception_message.indexOf(" --->") == -1)
				{
					error_base.inner_exception = null;
					
				}
				else
				{
					error_base.inner_exception =
					{
						message:	"",
						fullname:	exception_message.substring((exception_message.indexOf(" ---> ") + 6), (exception_message.indexOf("\n") - 1)),
						type:		""
					};
				}
				
				//
				
				error_base.show_exception = show_exception;
				*/
	
				var is = function(error_text)
				{				
					return (this.message.toLowerCase().indexOf(error_text.toLowerCase()) > -1);
				}
				
				var create_inner_exception = function(obj, which)
				{
					var exception =	{};
					
					exception.fullname  = exceptions[which].split(": ")[0];
					exception.message	= exceptions[which].split(": ")[1];
					exception.type		= $.lang.array.get_last($.lang.array.get_last(exception.fullname.split(".")).split("+"))
					exception.stack		= stacks[which];
					exception.is		= is;
					
					if (which == 0)
					{
						obj.exception	= exception;
						obj.output		= exception_message;
					}
					else
					{
						obj.inner_exception = exception
					}
					
					which++;
					
					if (which < exceptions.length)
					{
						create_inner_exception(exception, which);
					}
					else
					{
						exception.inner_exception = null;
					}
				}
				
				////
							
				var exceptions	= exception_message.substring(0, (exception_message.indexOf("\n") - 1)).split(" ---> ");
				var stacks		= exception_message.substr((exception_message.indexOf("\n") - 1)).split("--- End of inner exception stack trace ---");
				
				create_inner_exception(error_base, 0)
			}
			
			////
			
			var error_base = new $.ErrorBase(this, ("Server processing resulted in exception.\n\n" + url), additional_message);
			
			if (typeof(exception_message) == "string") disect_exception_message();
			
			return error_base;
		}
		
		this.RPCTimeOutError = function $ajax$RPCTimeOutError(additional_message, url, time_out)
		{
			return new $.ErrorBase(this, ("Remote procedure call timed out.\n\nms:" + time_out + " sec\n\n" + url), additional_message);
		}
	
		this.RPCGenericError = function $ajax$RPCGenericError(additional_message, url)
		{
			return new $.ErrorBase(this, ("Error occurred calling the remote procedure.\n\n" + url), additional_message);
		}	
	
		this.ResourceNotFoundError = function $ajax$ResourceNotFoundError(additional_message, url)
		{
			return new $.ErrorBase(this, ("404: The resource cannot be found.\n\n" + url), additional_message);
		}


		this.presentation = new function NAMESPACE__$ajax$presentation()
		{
			this.Mask = function(url, parameters, callback, element, modifiers)
			{
				//#region ROUTINE
				
					var pre_callback = function(returned)
					{
						if (Jenzabar.lang.is_error(returned))
						{
							/*
							switch (returned.type)
							{
								case "RPCServerException":
								{
									returned.show_exception();
									
									return;
									
									break;
								}
								default:
								{
									throw returned;
								}
							}
							*/
							
							throw returned;
						}
						
						Jenzabar.element.enable(element);
						
						callback(returned);
					}
				
				//#endregion
				
				//#region METHOD
				
					this.run = function()
					{
						Jenzabar.element.disable(element, {color:"White", opacity:"60"});
				
						Jenzabar.ajax.async_post_as_object(url, parameters, pre_callback);
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
					
					try
					{
					}
					catch  (e)
					{
						throw e;
					}
		
				//#endregion
			}
			
			this.Animation = function()
			{
			}

		}

		this.RPCall = function $ajax$RPCall__CLASS($np)
		{typeof "$ajax$RPCall__CLASS";
			var $func = this.constructor;
			var $this = this;
			
			//#region VARIABLE
			
				var executing		= false;	//
				
				var canceller;					//Function
				
				var notifier_stop;				//Function
			
			//#endregion
			
			//#region ROUTINE
			
				var do_callback = function(returned)
				{
					canceller = undefined;
					
					//
					
					$func.current.splice($.lang.array.index_of($func.current, $this.url), 1);
					
					//
					
					if (typeof(notifier_stop) === "function") notifier_stop();
					
					//
					
					executing = false;
					
					//
					
					if ($.lang.is_error(returned))
					{
						$this.error(returned);
						
						$this.errored.fire(returned);
					}
					else
					{
						$this.complete(returned);
						
						$this.completed.fire(returned);
					}
				}
			
			//#endregion
			
			//#region FIELD
		
				this.url			= "";					//
				this.parameters		= null;					//Array, Object
				this.ignore_error	= null;					//Boolean
				this.return_type	= "object";				//
				this.time_out		= null;					//Number
				this.attempts		= null;					//Number
				
				this.errored		= new $.Event(this);	//
				this.completed		= new $.Event(this);	//
				
				this.notifier;								//Function
			
			//#endregion
			
			//#region PROPERTY
			
				this.get_executing = function()
				{
					return executing;
				}
			
			//#endregion
			
			//#region METHOD
			
				this.execute = function()
				{
					if (executing === true)
					{
						throw new $.InvalidOperationError("The remote procedure call is already executing.");
					}
					
					//
					
					if (!$func.current)
					{
						$func.current = [];
					}
		
					if ($.lang.array.contains($func.current, this.url))
					{
						throw new $.InvalidOperationError("The remote procedure call is already executing.");
					}
					
					$func.current.push(this.url);
		
					//
					
					executing = true;
					
					//
					
					if ($.lang.array.contains(["undefined", "function"], typeof(this.notifier)))
					{
						if ($.lang._is_constructor(this.notifier))
						{
							notifier_stop = new this.notifier();
							//this.rpc.calls[$np.url].notification_stop = new $np.notifier();
						}
						else
						{
							notifier_stop = this.notifier();
							//this.rpc.calls[$np.url].notification_stop = $np.notifier();
						}
						
						if (!$.lang.array.contains(["undefined", "function"], typeof(notifier_stop)))
						{
							throw new $.InvalidTypeError("The notifier must return a function pointer.");
						}
					}
					else
					{
						throw new $.InvalidTypeError("The notifier property must be undefiend or a function pointer.");
					}
					
					canceller = $.ajax.async_call("POST", this.url, this.parameters, this.ignore_error, do_callback, this.return_type, this.time_out, this.attempts);
				}
				
				this.cancel = function()
				{
					if (canceller === undefined)
					{
						throw new $.InvalidOperation("The RPC has not been executed.");
					}
					
					canceller();
					
					$func.current.splice($.lang.array.index_of($func.current, this.url), 1);
				}
				
				this.complete = function(returned)
				{
				}
					
				this.error = function(returned)
				{
				}
			
			//#endregion
			
			//#region CONSTRUCTOR
			
				$.lang.np.apply($np, this);		
			
			//#endregion

		}
	}

	this.ErrorBase = function $ErrorBase__CLASS(err, message, additional_message, inner_error)
	{typeof "$ErrorBase__CLASS";
		var create_stack = function $ErrorBase$$create_stack()
		{
			var func;	//Function
			var stack;	//Array
			var count;	//Number
	
			//
	
			func	= arguments.callee.caller.caller.caller;
			stack	= $.Array("Function");  //causes recursion						
			count	= 0;
									
			while (func !== null)
			{
				if (count > 25) break;
				
				//
				
				if (func === $.vp) //move logic to $.vp
				{
				}
				else
				{
					stack.push(func);
				}
				
				//
				//try/catch for FF and maybe others, IE just returns null
				
				try
				{
					func = func.caller;
				}
				catch (e)
				{
					func = null;
				}
				
				//
				
				count++;
			}
	
			return stack;
		}
	
		var create_stack_list = function $ErrorBase$$create_stack_list(stack) //remove last function if Error?
		{
			var func_name;	//$.String
			var stack_list;	//String
			var i;			//Number
	
			//
							
			stack_list = "";
			
			for (i=0; i<stack.length; i++)
			{
				func_name = new $.String($.reflection.get_function_name(stack[i]));
				
				//
				
				if (func_name.slice(-7) === "__CLASS")
				{
	
					func_name = func_name.substr(0, func_name.lastIndexOf("__CLASS"));
					
				}
				
				//
				//rename functions metadata name to human readability
				
				if (func_name.substr(0, 1) == "$")
				{
					func_name = func_name.prepend("LIB");
				}
				
				func_name = func_name.global_replace("$$", "+");
				func_name = func_name.global_replace("$", ".");
				
				//
				
				if (i === 0)
				{
					stack_list += "->\t";
				}
				else
				{
					stack_list += "\t";
				}
				
				stack_list += func_name;
				stack_list += "\n";
			}
			
			return stack_list;
		}
		
		var add_message = function $ErrorBase$$add_message(message, skip_line)
		{
			if ((typeof(message) === "string") && (message.length > 0))
			{
				this.additionals.push(message);
				
				if (skip_line === true)
				{
					message = ("\n" + message);
				}
						
				this.message = new $.String(this.message).insert(this.message.indexOf(stack_header), ("\n" + message)).toString();
			}
			
			//
			//.description for backward compatibility (IE)
		
			error.description = error.message;
		}
		
		////
		
		var error;			//Error
		var stack_header;	//String
		
		//
		
		try
		{
			$.vp(arguments, [
								{type:"Object"},
								{type:"String"},
								{type:"String", optional:function(){additional_message="";}},
								{type:"Object", optional:function(){inner_error=null;}}
							]);
							
							//ToDo: validate error is an $.Error object
		}
		catch (e)
		{
			throw e;
		}
		
		//
		
		error = new Error();
		
		error.__constructor			= err;
		
		error.type					= $.reflection.get_namespace_array($.reflection.get_function_name(err.constructor)).get_last().split("Error")[0];
		error.name					= new $.String(error.type.split("Error")[0]).namespaced().toString();
		
		error.message				= (error.type.split("Error")[0] + "\n\n" + message);
		error.additionals			= new Array();
		
		error.add_message			= add_message;
		
		//
		
		if ((typeof(inner_error) !== "undefined") && (inner_error !== null))
		{
			error.inner_error = inner_error;
			
			error.message = ("*" + error.message);
		}
		
		//
	
		stack_header = "\n\nSTACK:\n\n";
		
		error.message += stack_header;
	
		if (typeof(arguments.callee.caller) === "function")
		{
			error.stack = create_stack();
			
			if (error.stack.length > 0)
			{
				error.message += create_stack_list(error.stack);
			}
		}
		else
		{
			error.message += "[UNAVAILABLE]";
		}
		
		//
		
		add_message.apply(error, [additional_message, true]);
		
		//
		
		//$ErrorBase.errors.push(this);
		
		return error;

	}

	this.GenericError = function $GenericError__CLASS(additional_message)
	{typeof "$GenericError__CLASS";
		return new $.ErrorBase(this, "A generic error occurred.", additional_message);

	}

	this.ObjectInstantiationError = function $ObjectInstantiationError__CLASS(additional_message)
	{typeof "$ObjectInstantiationError__CLASS";
		//return new $.ErrorBase(this, "The object was executed as a function instead of being instantiated.", additional_message).error
		
		return new $.ErrorBase(this, "The object could not be instantiated.", additional_message);

	}

	this.InvalidTypeError = function $InvalidTypeError__CLASS(additional_message)
	{typeof "$InvalidTypeError__CLASS";
		return new $.ErrorBase(this, "Type incompatibility detected.", additional_message);

	}

	this.InvalidValueError = function $InvalidValueError__CLASS(additional_message)
	{typeof "$InvalidValueError__CLASS";
		return new $.ErrorBase(this, "The given type is valid but the value is not.", additional_message);

	}

	this.InvalidParameterTypeError = function $InvalidParameterTypeError__CLASS(additional_message, inner_error)
	{typeof "$InvalidParameterTypeError__CLASS";
		return new $.ErrorBase(this, "Parameter must match expected type.", additional_message, inner_error);

	}

	this.NullReferenceError = function $NullReferenceError__CLASS(additional_message)
	{typeof "$NullReferenceError__CLASS";
		return new $.ErrorBase(this, "Can not reference null object.", additional_message);

	}

	this.InvalidArgumentError = function $InvalidArgumentError__CLASS(additional_message, inner_error)
	{typeof "$InvalidArgumentError__CLASS";
		return new $.ErrorBase(this, "Provided argument is invalid.", additional_message, inner_error);

	}

	this.InvalidConstructorError = function $InvalidConstructorError__CLASS(additional_message)
	{typeof "$InvalidConstructorError__CLASS";
		return new $.ErrorBase(this, "Defined constructors must be of type Function or String.", additional_message);

	}

	this.InvalidOperationError = function $InvalidOperationError__CLASS(additional_message)
	{typeof "$InvalidOperationError__CLASS";
		return new $.ErrorBase(this, "The operation is invalid.", additional_message);

	}

	this.NotImplementedError = function $NotImplementedError__CLASS(additional_message)
	{typeof "$NotImplementedError__CLASS";
		return new $.ErrorBase(this, "Not Implemented.", additional_message);

	}

	this.NotSupportedError = function $NotSupportedError__CLASS(additional_message)
	{typeof "$NotSupportedError__CLASS";
		return new $.ErrorBase(this, "Feature not supported by current browser.", additional_message);

	}

	this.Element = function $Element__CLASS(tag_name)
	{typeof "$Element__CLASS";
		//#region FUNCTION
		
			function create_element(tag_name)
			{
				var element = null;
				
				//
				
				element = document.createElement(tag_name);
	
				element.GetType = function(){return $.GetType(this);}
				
				element.create	= this.create;
				
				element.attach_event = function(event_name, function_pointer){$.element.attach_event(this, event_name, function_pointer);};
				element.detach_event = function(event_name, function_pointer){$.element.detach_event(this, event_name, function_pointer);};
				
				return element;
			}
		
		//#endregion
		
		//#region METHOD
		
			this.create = function jcsfl$Element$create(tag_name)
			{
				if ($.GetType(this) != "Element")
				{
					throw new $.GenericError("The element is already created.");
				}
				
				return create_element.call(this, tag_name);
			}
		
		//#endregion
		
		//#region CONSTRUCTOR
		
			this.__constructor = function Element()
			{
				tag_name = $.vv(tag_name, "String", null, true);
				
				if (tag_name == null) return;
				
				//check valid tag_name passed, create custom enum!
				
				return create_element.call(this, tag_name);
			}
			return this.__constructor();
		
		//#endregion

	}

	this.Event = function $Event__CLASS(sender)
	{typeof "$Event__CLASS";
		//#region FIELD
		
			var _functions;	//Array
			var _contexts;	//Array
		
		//#endregion
					
		//#region METHOD
		
			this.attach = function $Event$attach(func, context)
			{
				try
				{
					$.vp
					(
						arguments,
						{type:"Function"},
						{type:"Object", optional:function(){context=null;}}
					);
				}
				catch(e){throw e;}
				
				//
				
				for (var i=0; i<_functions.length; i++)
				{
					if (_functions[i] === func) return;
				}
	
				_functions.push(func);
				_contexts.push(context);
			}
			
			this.detach = function $Event$detach(func)
			{
				try
				{
					$.vp(arguments, {type:"Function"});
				}
				catch(e){throw e;}
				
				//
				
				for (var i=0; i<_functions.length; i++)
				{
					if (_functions[i] !== func) continue;
					
					_functions[i] = null;
					_contexts[i] = null;
				}
			}
		
			this.fire = function $Event$fire()
			{
				var return_val;	//Variant
				
				for (var i=0; i<_functions.length; i++)
				{
					if (_functions[i] !== null)
					{
						if (_contexts[i] === null)
						{
							return_val = _functions[i].apply(sender, arguments);
						}
						else
						{
							return_val = _functions[i].apply(_contexts[i], arguments);
						}
						
						if (return_val === false)
						{
							break;
						}
					}
				}
				
				return return_val;
			}
		
		//#endregion
		
		//#region CONSTRUCTOR
			
			try
			{
				$.vp(arguments, {type:"Object"});
			}
			catch(e){throw e;}
			
			//
			
			_functions = [];
			_contexts  = [];
			
		//#endregion

	}

	this.ui = new function NAMESPACE__$ui()
	{
		//#region
		
			this.Measurement = function $ui$Measurement(dimension, unit)
			{
				//#region PROPERTY
				
					this.dimension; //Number
					this.unit;		//String
					
					this.unit_type;	//$.ui.Measurement.UnitType
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					try
					{
						$.vp(arguments, {type:"Number"}, {type:"String"});
					}
					catch(e){throw e;}
					
					//
					
					this.dimension	= dimension;
					this.unit		= unit;
					
					switch (this.unit.toLowerCase())
					{
						case "px": this.unit_type = $.ui.Measurement.UnitType.Pixel;
					}
					
				//#endregion
			}
			
			this.Measurement.parse_measurement = function(measurement_string)
			{
				try
				{
					$.vp(arguments, {type:"String"});
				}
				catch(e){throw e;}
				
				//
				
				var begin_unit;	//Number
	
				for (var i=0; i<measurement_string.length; i++)
				{
					if (isNaN(measurement_string.substr(i, 1)))
					{
						begin_unit = i;
					}
				}
				
				//return {dimension:measurement.substring(0, (begin_unit-1)), unit:measurement.substring(begin_unit-1)};
				
				return new $.ui.Measurement(parseFloat(measurement_string.substring(0, (begin_unit-1))), measurement_string.substring(begin_unit-1));
			}
			
			this.Measurement.UnitType = new function $ui$Measurement$UnitType__ENUM()
			{
				this.Pixel		= 0;
				this.Point		= 1;
				this.Pica		= 2;
				this.Inch		= 3;
				this.Mm			= 4;
				this.Cm			= 5;
				this.Percentage	= 6;
				this.Em			= 7;
				this.Ex			= 8;
			}
			
		//#endregion


		this.Window = function $ui$Window__CLASS(body_div, dragging_div)
		{typeof "$ui$Window__CLASS";
			var $this = this;
			
			//#region FIELD
			
				this.window_div;	//DOMElement:div
				this.dragging_div;	//DOMElement:div
				
				this.modal			= false;
				this.fixed			= false;
				this.sized			= false;
				
				this.can_postback	= false;
				
				this.top;			//Number
				this.left;			//Number
				
				this.fade			= false;
				
				this.is_initiated	= false;
				this.is_opened		= false;
			
				this.draggable		= true;
				this.drag_handler;	//$.DraggableObjectHandler
		
				this.opening		= new $.Event(this);		
				this.opened			= new $.Event(this);
				
				this.closing		= new $.Event(this);
				this.closed			= new $.Event(this);
						
				//this.start_drag	= new $.Event(this);
				//this.end_drag		= new $.Event(this);
				
				//this.affixed		= new $.Event(this);
				//this.unfixed		= new $.Event(this);
		
			//#endregion
			
			//#region VARIABLE
			
				//var window_div_state;	//$.element.StateHolder
			
			//#endregion
			
			//#region METHOD
			
				this.open = function $ui$Window$open(compliant_element, render_controls)
				{
					try
					{
						$.vp
						(
							arguments,
							{
								type:		"DOMElement",
								allow_null:	true,
								error_msg:	"The parameter is required for 508 compliance."
							},
							{
								type:		"Boolean",
								optional:	function(){render_controls=false;}
							}
						);
					}
					catch(e){throw e;}
					
					//
					
					if (this.is_opened === true) throw new $.GenericError("Window already opened.");
					
					//
					
					$.vv(this.opening, {type:GET_LIB_TYPE("$.Event")}).fire();
					
					//
					
					this._render();
					
					try
					{
						$.vv(this.window_div, {type:"DOMElement:div"});
					}
					catch(e)
					{
						e.add_message("The overriden render method must set the window_div.");
						
						throw e;
					}
					
					//
					
					this._activate();
					
					//
					
		////move some of this logic to ._show()
					
					if (this.can_postback)
					{
						$.window.document.get_asp_net_form().appendChild(this.window_div);
					}
					else
					{
						document.body.appendChild(this.window_div);
					}
					
					//
					
					this._show();
					
					//
					
					if (compliant_element !== null)
					{
						$.element.insert_after(this.window_div, compliant_element);
					}
		////			
								
					//
								
					if (render_controls === true) //move to ._render after revising ProgressBar control
					{
						$.ui.controls.render(this.window_div);
					}
								
					//
					
					if ((this.draggable === true) && (this.dragging_div != null))
					{			
						this.drag_handler = new $.DraggableObjectHandler(this.window_div, this.dragging_div, null, true);
					}
					
					//
					
					$.vv(this.opened, {type:GET_LIB_TYPE("$.Event")}).fire();			
		
					//
					
					this._focus();
					
					//
					
					this.is_opened = true;			
				}
				
				this.open_and_render_controls = function $ui$Window$open_and_render_controls(compliant_element)
				{
					this.open(compliant_element, true);
				}
				
				this.close = function $ui$Window$close()
				{
					$.vv($this.closing, {type:GET_LIB_TYPE("$.Event")}).fire();
					
					//
								
					$this._hide();
					
					$this._deactivate();
					
					//
					
					$.vv($this.closed, {type:GET_LIB_TYPE("$.Event")}).fire();
					
					$this.is_opened = false;
				}
				
				this.reposition = function $ui$Window$$reposition()
				{
					var wd = $this.window_div;
					
					if (wd.offsetHeight > $.window.get_height())
					{
						wd.style.position	= $.element.css.Position.absolute;
						wd.style.top		= $.element.css.dimension(0);
						
						window.scrollTo($.window.get_scroll_left(), 0);
					}
					else
					{
						wd.style.top = ((($.window.get_height() / 2) - (wd.offsetHeight / 2)) + $.element.css.Unit.px);	
					}
					
					if (wd.offsetWidth > $.window.get_width())
					{
						wd.style.position	= $.element.css.Position.absolute;
						wd.style.left		= $.element.css.dimension(0);
						
						window.scrollTo(0, $.window.get_scroll_top());
					}
					else
					{
						wd.style.left = ((($.window.get_width() / 2) - (wd.offsetWidth / 2)) + $.element.css.Unit.px);
					}
				}
						
				//#region private
		
					this._init = function()
					{
					}
			
					this._activate = function ui$Window$_activate()
					{
						if (this.modal !== true) return;
						
						$.window.document.disable();
					}
					
					this._render = function $ui$Window$_render()
					{
						throw new $.NotImplementedError("The abstract render method must be implemented by the inheriting object.");
					}
					
					this._focus = function()
					{
					}
										
					this._show = function $ui$Window$_show()
					{
						var style = this.window_div.style;
						
						style.position	= ((this.fixed === true) ? $.element.css.Position.fixed : $.element.css.Position.absolute);
						style.zIndex	= ($.layering.get_top_z_index() + 1);
						
						if (this.fade === true)
						{
							$.element.change_opacity(this.window_div, 0);
							
							$.element.fade(this.window_div, 0, 100, 500, 10);
						}
						
						style.display = $.String.empty;				
						
						//
						
						//if (this.imitate_display)
						//{
						//	this._show.imitate_display_canceller = $.element.imitate(this.window_div, this.imitate_display, ["display"]);
						//}
						
						//if (this.imitate_location)
						//{					
						//	this._show.imitate_location_canceller = $.element.imitate(this.window_div, this.imitate_location, ["location"]);
						//}
						//else
						//{
							//if ((typeof(this.left) === "number") && (typeof(this.top) === "number")) //refine!!
							if ((this.left != null)  && (this.top != null))
							{
								this.window_div.style.left = this.left;
								this.window_div.style.top  = this.top;
							}
							else
							{
								this.reposition();
							
								$.element.attach_event(window, $.dom_event.Type.resize, this.reposition);
							}
							
							//
							
							if (this.sized === true)
							{
								this.window_div.style.width  = this.window_div.clientWidth;
								this.window_div.style.height = this.window_div.clientHeight;
							}
						//}
					}
					
					this._deactivate = function $ui$Window$_deactivate()
					{
						if (this.modal === true)
						{
							$.window.document.enable();
						}
					}
					
					this._hide = function $ui$Window$_hide()
					{
						this.window_div.parentNode.removeChild(this.window_div);
						
						//
		
						//if (this.imitate_display)
						//{
						//	this._show.imitate_display_canceller();
						//	
						//	this._show.imitate_display_canceller = undefined;
						//}
						
						//
										
						//if (this.imitate_location)
						//{
						//	this._show.imitate_location_canceller();
						//	
						//	this._show.imitate_location_canceller = undefined;
						//}
						//else
						//{
							//if ((typeof(this.left) === "number") && (typeof(this.top) === "number")) //refine!!
							if ((this.left != null) && (this.top != null)) //refine!!
							{
							}
							else
							{
								$.element.detach_event(window, $.dom_event.Type.resize, this.reposition);
							}
						//}
					}
				
				//#endregion
			
			//#endregion
			
			//vp!!!

		}

		this.windows = new function NAMESPACE__$ui$windows()
		{


			this.DialogWindow = function $ui$windows$DialogWindow__CLASS(div, title)
			{typeof "$ui$windows$DialogWindow__CLASS";
				var $this = this;
				var $base = $.lang.inherit(this, $.ui.Window);
			
				//#region VARIABLE
				
					var div_state;			//$.element.StateHolder
					
				//#endregion
				
				//#region PROPERTY
					
					this.show_close			= true;
					
					this.content;			//DOMElement
					this.content_container;	//DOMElement:Container
					this.title_span;		//DOMElement:Span
					
					this.preserve_div		= true;
					
					this.styling;			//Object
				
				//#endregion
				
				//#region METHOD
				
					//#region private
			
						this._render = function()
						{
							var close = function() //may not need
							{
								$this.close();
							}
							
							////
										
							var outer_div = $.element.create($.element.Type.div, null, {className:$.ui.windows.DialogWindow.styling.outer_frame}, {display:$.element.css.Display.none});
							
							var inner_div = $.element.create($.element.Type.div, outer_div, {className:$.ui.windows.DialogWindow.styling.inner_frame});
							
							var table = $.element.table.create([[$.String.empty, $.String.empty], [$.String.empty]]);
							
							$.element.modify(table.rows[0].cells[0], {className:$.ui.windows.DialogWindow.styling.title}, {paddingLeft:$.element.css.dimension(3), cursor:$.element.css.Cursor.ddefault});
							$.element.modify(table.rows[0].cells[1], {className:$.ui.windows.DialogWindow.styling.title}, {paddingLeft:$.element.css.dimension(10), paddingRight:$.element.css.dimension(3), textAlign:$.element.css.TextAlign.right});
											
							if ((this.show_close === false) && (this.title_span.innerHTML === $.String.empty)) //only required for IE?
							{
								this.title_span.innerHTML = "&nbsp;";
							}
							
							table.rows[0].cells[0].appendChild(this.title_span);
							
							if (this.show_close === true)
							{
								if ($this.constructor.close_icon !== undefined)
								{
									$.element.create($.element.Type.image, table.rows[0].cells[1], {src:$this.constructor.close_icon}, {cursor:$.element.css.Cursor.hand}, {click:close});
								}
								else
								{
									$.element.create($.element.Type.anchor, table.rows[0].cells[1], {_text:"close", href:"javascript:"}, null, {click:close});
								}
							}
							
							$.element.modify(table.rows[1].cells[0], {colSpan:"2", className:"DialogWindow_Body"});
							
							inner_div.appendChild(table);
							
							outer_div.appendChild(inner_div);
							
							//
							
							this.content_container	= table.rows[1].cells[0]
							
							//
							
							this.window_div	  = outer_div;
							this.dragging_div = table.rows[0];
						}
						
						this._show = function()
						{			
							try
							{
								$.vv(this.content_container, {type:"DOMElement"}); //should be DOMElement:Container
							}
							catch(e)
							{
								e.add_message("The overriden render method must set the content_container.");
								
								throw e;
							}
							
							//
							
							if (this.preserve_div === true)
							{
								div_state = new $.element.StateHolder(this.content, [$.element.Attribute.parent_node], [$.element.css.Style.position, $.element.css.Style.display]);
							}
							
							//
							
							this.content.style.position = $.element.css.Position.sstatic;
							this.content.style.display  = $.element.css.Display.block;
							
							this.content_container.appendChild(this.content);
											
							//
							
							$base._show.call(this);
						}
						
						this._hide = function()
						{			
							if (this.preserve_div === true)
							{
								if (div_state.state.parentNode !== null) //should be automatically handled by .apply below
								{
									div_state.state.parentNode.appendChild(this.content);
								}
								
								div_state.apply();
							}
			
							$base._hide.call(this);
						}
					
						this.set_title = function(title)
						{
							$.element.set_inner_text(this.title_span, title);
						}
						
						this.get_title = function()
						{
							return $.element.get_inner_text(this.title_span);
						}
					
					//#endregion
					
				//#endregion
				
				//#region CONSTRUCTOR
				
					try
					{
						$.vp
						(
							arguments,
							{
								type:		"DOMElement:div", //can be any DOMElement
								optional:	true
							},
							{
								type:		"String",
								optional:	function(){title=$.String.empty;}
							}
						);
					}
					catch(e){throw e;}
					
					//
							
					if (div != null)
					{
						this.content = div;
					}
					
					this.title_span = $.element.create($.element.Type.span, null, {_text:title});
					
				//#endregion
	
			}

			this.MessageBox = function $ui$windows$MessageBox__CLASS(title, message, callback, buttons, modifiers)
			{typeof "$ui$windows$MessageBox__CLASS";
				var $this = this;
				var $base = $.lang.inherit(this, $.ui.Window);
				
				//#region VARIABLE
				
					var buttons_div;	//DOMElement:div
					var close_index;	//Number
				
				//#endregion
				
				//#region FIELD
					
					this.show_close		= true;
					this.message_div;	//DOMElement:div
				
				//#endregion
				
				//#region PROPERTY
			
					this.set_message_html = function(html)
					{
						try
						{
							$.vp(arguments, {type:"String"});
						}
						catch (e){throw e;}
						
						//
						
						this.message_div.innerHTML = html;
																			
						this.reposition();
					}
					
				//#endregion
				
				//#region METHOD
			
					//#region private
				
						this._render = function()
						{
							var callback_creator = function(index)
							{
								return function()
								{
									$this.close();
									
									//
									//handle close button click if occured
									
									if (index === -1)
									{
										if (close_index === -1) return;
										
										index = close_index;
									}
									
									//
															
									if (buttons[index].callback)
									{
										buttons[index].callback();
										
										return;
									}
									
									if (callback !== null)
									{
									    if (buttons[index].value)
									    {
									        callback(buttons[index].value);
									        
									        return;
									    }
									    
										callback(buttons[index].caption);
									}
								}
							}
			
							////
																			
							$.lang.ifu("", modifiers, "width");
							$.lang.ifu("", modifiers, "height");
										
							//
							
							var outer_div = $.element.create("div", null, {className:$.ui.windows.DialogWindow.styling.outer_frame}, {display:"none"});
							
							var inner_div = $.element.create("div", outer_div, {className:$.ui.windows.DialogWindow.styling.inner_frame});
							
							var table = $.element.table.create([["", ""], [""], [""]]);
							
							$.element.modify(table.rows[0].cells[0], {className:$.ui.windows.DialogWindow.styling.title}, {paddingLeft:"3px", cursor:"default"});
							$.element.modify(table.rows[0].cells[1], {className:$.ui.windows.DialogWindow.styling.title}, {paddingLeft:"10px", paddingRight:"3px", textAlign:"right"});
											
							if (title === "")
							{
								table.rows[0].cells[0].innerHTML = "&nbsp;"; //for IE!
							}
							else
							{
								table.rows[0].cells[0].innerHTML = title;
							}
							
							if (this.show_close === true)
							{				
								close_index = -1;
								
								if ($.ui.windows.DialogWindow.close_icon !== undefined)
								{
									$.element.create("img", table.rows[0].cells[1], {src:$.ui.windows.DialogWindow.close_icon}, {cursor:"pointer"}, {click:callback_creator(close_index)});
								}
								else
								{
									$.element.create("a", table.rows[0].cells[1], {_text:"close", href:"javascript:"}, null, {click:callback_creator(close_index)});
								}
							}
							
							$.element.modify(table.rows[1].cells[0], {colSpan:"2", className: "DialogWindow_Body"});
							
							$this.message_div = $.element.create("div", table.rows[1].cells[0], {innerHTML:message}, {margin:"5px"});
							
							//
							
							$.element.modify(table.rows[2].cells[0], {colSpan:"2"}, {textAlign:"center"});
							
							//
							
							inner_div.appendChild(table);
							
							outer_div.appendChild(inner_div);
							
							//
							
							buttons_div = $.element.create("div", table.rows[2].cells[0], null, {width:"100%", margin:"5px"});
							
							for (var i=0; i<buttons.length; i++)
							{
								$.element.create
								(
									"input",
									buttons_div,
									{
										type:			"Button",
										value:			((buttons[i].caption === undefined) ? "" : buttons[i].caption)
									},
									{
										width:			((buttons[i].width === undefined) ? "75px" : (buttons[i].width + "px")),
										marginLeft:		"2px",
										marginRight:	"2px"
									},
									{
										click:			callback_creator(eval(i))
									}
								);
								
								if (($this.show_close === true) && (buttons[i].is_close === true))
								{
									close_index = i;
								}
							}
							
							//
							
							this.window_div	  = outer_div;
							this.dragging_div = table.rows[0];
						}
						
						this._activate = function()
						{
							if ((typeof(modifiers.color) == "string") && (typeof(modifiers.opacity) == "number")) //TODO: refine
							{
								$.window.document.disable({color:modifiers.color, opacity:modifiers.opacity});
							}
							else
							{
								$.window.document.disable(JCSL.JICS.DocumentProcessing);
							}
						}
									
						this._focus = function()
						{
							buttons_div.children[0].focus();	
						}
					
					//#endregion		
					
				//#endregion
			
				//#region CONSTRUCTION
				
					try
					{
						$.vp
						(
							arguments,
							{
								type:					"String",
								optional:				function(){title="";}
							},
							{
								type:					"String",
								optional:				function(){message="";}
							},
							{
								type:					"Function",
								allow_null:				true,
								optional:				function(){callback=null;}
							},
							{
								type:					"Array",
								array_interface_def:	{
															caption:	"null,String",
															value:      "undefined,Number",
															width:		"undefined,Number",
															callback:	"undefined,Function",
															enter:		"undefined,Boolean"
														},
								allow_null:				true,
								optional:				function(){buttons=[{caption:"OK"}];}
							},
							{
								type:					"Object",
								optional:				function(){modifiers={};}
							}
						);
					}
					catch (e){throw e;}
					
					//
					
					this.modal = true;
					this.fixed = true;
					
				//#endregion
			
	
			}

			this.InputBox = function $ui$windows$InputBox__CLASS(title, message, callback, buttons, modifiers)
			{typeof "$ui$windows$InputBox__CLASS";
				var $this = this;
				var $base = $.lang.inherit(this, $.ui.Window);
				
				//#region VARIABLE
				
					var input_element;	//DOMElement:input_text
					var close_index;	//Number
					
				//#region
				
				//#region FIELD
				
					this.show_close		= true; //move to Window?
					this.is_password	= false;
				
				//#endregion
				
				//#region PROPERTY
			
					this.get_value = function()
					{
						if (input_element === undefined) return "";
						
						return input_element.value;
					}
					
					this.get_input_element = function()
					{
						return input_element;
					}
						
				//#endregion
				
				//#region METHOD
				
					//#region private
					
						this._render = function()
						{
							var callback_creator = function(index)
							{
								return function()
								{
									$this.close();
									
									//
									//handle close button click if occured
									
									if (index === -1)
									{
										if (close_index === -1) return;
										
										index = close_index;
									}
									
									//
															
									if (buttons[index].callback)
									{
										buttons[index].callback();
										
										return;
									}
									
									if (callback !== undefined)
									{
										callback(buttons[index].caption);
									}
								}
							}
			
							var input__key_press = function(event)
							{
								if ((event.event.keyCode !== 13) || (!buttons.length > 0)) return;
								
								JCSL.dom_event.fire(buttons_div.children[0], "click");
							}
							
							////
							
							$.lang.ifu("",		modifiers, "width");
							$.lang.ifu("",		modifiers, "height");
							$.lang.ifu("250px", modifiers, "input_width");
											
							//
							
							var outer_div = $.element.create("div", null, {className:$.ui.windows.DialogWindow.styling.outer_frame}, {display:"none"});
							
							var inner_div = $.element.create("div", outer_div, {className:$.ui.windows.DialogWindow.styling.inner_frame});
							
							var table = $.element.table.create([["", ""], [""], [""]]);
							
							$.element.modify(table.rows[0].cells[0], {className:$.ui.windows.DialogWindow.styling.title}, {paddingLeft:"3px", cursor:"default"});
							$.element.modify(table.rows[0].cells[1], {className:$.ui.windows.DialogWindow.styling.title}, {paddingLeft:"10px", paddingRight:"3px", textAlign:"right"});
							
							if (title === "")
							{
								table.rows[0].cells[0].innerHTML = "&nbsp;" //for IE!
							}
							else
							{
								table.rows[0].cells[0].innerHTML = title;
							}
							
							if (this.show_close === true)
							{				
								close_index = -1;
								
								if ($.ui.windows.DialogWindow.close_icon !== undefined)
								{
									$.element.create("img", table.rows[0].cells[1], {src:$.ui.windows.DialogWindow.close_icon}, {cursor:"pointer"}, {click:callback_creator(close_index)});
								}
								else
								{
									$.element.create("a", table.rows[0].cells[1], {_text:"close", href:"javascript:"}, null, {click:callback_creator(close_index)});
								}
							}
							
							$.element.modify(table.rows[1].cells[0], {colSpan:"2", className: "DialogWindow_Body"});
							
							$.element.create("div", table.rows[1].cells[0], {innerHTML:message}, {margin:"5px", width:"400px"});
							
							//
							
							$.element.modify(table.rows[2].cells[0], {colSpan:"2"}, {textAlign:"center"});
			
							input_element = $.element.create("input", table.rows[2].cells[0], {type:(($this.is_password === true) ? "password" : "text")}, {width:modifiers.input_width, margin:"10px"}, {keypress:input__key_press});
							
							//
							
							inner_div.appendChild(table);
							
							outer_div.appendChild(inner_div);
							
							//
							
							var buttons_div = $.element.create("div", table.rows[2].cells[0], null, {width:"100%", margin:"5px"});
							
							for (var i=0; i<buttons.length; i++)
							{
								$.element.create
								(
									"input",
									buttons_div,
									{
										type:			"Button",
										value:			((buttons[i].caption === undefined) ? "" : buttons[i].caption)
									},
									{
										width:			((buttons[i].width === undefined) ? "75px" : (buttons[i].width + "px")),
										marginLeft:		"2px",
										marginRight:	"2px"
									},
									{
										click:			callback_creator(eval(i))
									}
								);
								
								if (($this.show_close === true) && (buttons[i].is_close === true))
								{
									close_index = i;
								}
							}
							
							//
							
							this.window_div	  = outer_div;
							this.dragging_div = table.rows[0];				
						}
						
						this._activate = function()
						{
							if ((typeof(modifiers.color) == "string") && (typeof(modifiers.opacity) == "number")) //refine
							{
								$.window.document.disable({color:modifiers.color, opacity:modifiers.opacity});
							}
							else
							{
								$.window.document.disable(JCSL.JICS.DocumentProcessing);
							}			
						}
						
						this._focus = function()
						{
							input_element.focus();
						}
					
					//#endregion
					
				//#endregion
					
				//#region CONSTRUCTION
				
					try
					{
						$.vp
						(
							arguments,
							{
								type:					"String",
								optional:				function(){title="";}
							},
							{
								type:					"String",
								optional:				function(){message="";}
							},
							{
								type:					"Function",
								optional:				function(){callback=null;}
							},
							{
								type:					"Array",
								array_interface_def:	{
															caption:	"String,undefined",
															width:		"Number,undefined",
															callback:	"Function,undefined",
															is_close:	"Boolean,undefined"
														},
								optional:				function(){buttons = [{caption:"OK"}, {caption:"Cancel"}];}
							},
							{
								type:					"Object",
								optional:				function(){modifiers={};}
							}
						);
					}
					catch(e){throw e;}
					
					//
					
					this.modal	= true;
					this.fixed	= true;
					
				//#endregion
	
			}

			this.ContextMenu = function $ui$windows$ContextMenu__CLASS(element, items, callback, disabled)
			{typeof "$ui$windows$ContextMenu__CLASS";
				//#region FIELD
				
					var div; //DOMElement:div
				
				//#endregion
				
				//#region ROUTINE
				
					var element__click = function $ui$controls$ContextMenu$$element__click(event)
					{
						render((event.clientX + $.window.get_scroll_left() - 5), (event.clientY + $.window.get_scroll_top() - 5));
					}
					
					var render = function $ui$controls$ContextMenu$$render(x, y)
					{
						var create_item = function $ui$controls$ContextMenu$$render$$create_item(item)
						{
							var mouse_click = function $ui$controls$ContextMenu$$render$$create_item$$mouse_click(event)
							{
								destroy();
								
								callback($.element.get_inner_text(this), element);
							}
							
							var mouse_over = function $ui$controls$ContextMenu$$render$$create_item$$mouse_over(event)
							{
								this.style.backgroundColor	= "#163175";
								this.style.color			= "White";
							}
							
							var mouse_out = function $ui$controls$ContextMenu$$render$$create_item$$mouse_out(event)
							{
								this.style.backgroundColor	= "";
								this.style.color			= "";
							}
			
							////
							
							$.element.create("div", div, {_text:items[item]}, {paddingTop:"2px", paddingBottom:"2px", paddingLeft:"10px", paddingRight:"10px", cursor:"default"}, {click:mouse_click, mouseover:mouse_over, mouseout:mouse_out});
						}
			
						////
			
						div = $.element.create("div", document.body, null, {position:"absolute", left:(x + "px"), top:(y + "px"), backgroundColor:"#D4D0C8", padding:"3px", borderStyle:"Solid", borderWidth:"1px", borderColor:"Black"});
			
						$.element.attach_event(window.document, "mouseover", mouse_out);
						
						$.lang.__for_each(items, create_item);
					}
					
					var destroy = function $ui$controls$ContextMenu$$destroy()
					{
						$.element.detach_event(window.document, "mouseover", mouse_out);
						
						div.parentNode.removeChild(div);
					}
					
					var mouse_out = function $ui$controls$ContextMenu$$mouse_out(event)
					{
						if ((this !== null) && ((event.target === div) || (event.target.parentNode === div))) return;			
						
						destroy();
					}
				
				//#endregion
				
				//#region METHOD
				
					this.enable = function $ui$controls$ContextMenu$enable()
					{
						$.element.attach_event(element, "click", element__click);
					}
					
					this.disable = function $ui$controls$ContextMenu$disable()
					{
						$.element.detach_event(element, "click", element__click);
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
						
					try
					{
						$.vp(arguments, [
											{type:"DOMElement"},
											{type:"Array-String"},
											{type:"Function"},
											{
												type:		"Boolean",
												optional:	function(){disabled=false;}
											}
										]);
					}
					catch (e)
					{
						throw e;
					}
					
					//
					
					if (disabled === false)
					{
						this.enable();
					}
				
				//#endregion	
	
			}

			this.WaitBox = function $ui$windows$WaitBox__CLASS(message, image, modifiers)
			{typeof "$ui$windows$WaitBox__CLASS";
				var $this = this;
				var $base = $.lang.inherit(this, $.ui.Window);
				
				//#region PROPERTY
				
					this.message_div;	//DOMElement:div
					this.image;			//String
				
				//#endregion
				
				//#region METHOD
					
					//#region private
				
						this._activate = function()
						{			
							$.window.document.disable(JCSL.JICS.DocumentProcessing); //should just be inherited?
						}
									
						this._render = function()
						{
							if (modifiers.width  === undefined) modifiers.width  = "";
							if (modifiers.height === undefined) modifiers.height = "";
										
							//
							
							var window_div = $.element.create("div", null, {className:$.ui.windows.DialogWindow.styling.outer_frame}, {width:modifiers.width, height:modifiers.height});
							
							//
							
							var table = $.element.table.create([["", ""]]);
							
							table.cellPadding = "2px";
							
							if (typeof(this.image) === "string") //validate is URL
							{
								$.element.create("img", table.rows[0].cells[0], {src:this.image});
							}
							
							table.rows[0].cells[1].innerHTML = message;
							table.rows[0].cells[1].className = $.ui.windows.MessageBox.message_style;
							
							table.rows[0].cells[1].style.cursor = "default";
							
							$.element.create("div", window_div, {className:$.ui.windows.DialogWindow.styling.inner_frame}).appendChild(table);
							
							//
							
							this.message_div = table;
							this.window_div  = window_div;
						}
						
						this.open = function()
						{
							$base.open.apply(this, arguments);
							
							return this.close;
						}
					
					//#endregion		
					
				//#endregion
			
				//#region CONSTRUCTION
				
					try
					{
						$.vp
						(
							arguments,
							{
								type:		"String",
								optional:	function(){message="";}
							},
							{
								type:		"String",
								optional:	true
							},
							{
								type:		"Object",
								optional:	function(){modifiers={};}
							}
						);
					}
					catch(e){throw e;}
					
					//
					
					this.modal = true;
					this.fixed = true;
					
					this.image = image;
					
				//#endregion
	
			}
		}

		this.ToolTip = function $ui$ToolTip__CLASS(element, enabled)
		{typeof "$ui$ToolTip__CLASS";
			//#region variable
				
				var $ToolTip = this;
			
				//var _element; //DOMElement
				//var _enabled; //Boolean
				
				var timer_id;	//Number
				
				var tt_element;	//DOMElement
				
				var displayed;	//Boolean
			
			//#endregion
			
			//#region property
			
				this.time_to_display	= 1000;
				this.tip				= "";
			
			//#endregion
			
			//#region method
			
				this.enable = function()
				{
					$.element.attach_event(element, "mouseover", mouse_over);
				}
				
				this.disable = function()
				{
				}
			
			//#endregion
			
			//#region function
			
				function mouse_over(event)
				{
					var x = event.clientX;
					var y = event.clientY;
					
					$.element.attach_event(element, "mouseout",  mouse_out);
					
					timer_id = window.setTimeout(function(){display(x, y);}, $ToolTip.time_to_display, event);
				}
				
				function mouse_out()
				{
					window.clearTimeout(timer_id);
					
					//
					
					if (tt_element !== null)
					{
						element.parentNode.removeChild(tt_element);
						
						tt_element = null;
						
						$ToolTip.enable();
					}
				}
				
				function display(x, y)
				{
					$.element.detach_event(element, "mouseover", mouse_over);
					
					window.clearTimeout(timer_id);
					
					displayed = true;
					
					//
					
					tt_element = document.createElement("div");
					
					tt_element.style.position = "absolute";
					
					tt_element.style.left = ((x + 5) + "px");
					tt_element.style.top  = ((y + 25) + "px");
					
					tt_element.style.borderColor = "Black";
					tt_element.style.borderStyle = "Solid";
					tt_element.style.borderWidth = "1px";
					
					tt_element.style.padding = "1px";
					
					tt_element.style.backgroundColor = "#FFFFE1";
					
					tt_element.appendChild(document.createTextNode($ToolTip.tip));
					
					//
					
					element.parentNode.insertBefore(tt_element, element);
				}
			
			//#endregion
			
			//#region constructor
				
				try
				{
					$.vp(arguments, [{type:"DOMElement"}, {type:"Boolean", optional:function(){enabled=true;}}]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				//_element = element;
				//_enabled = enabled;
				
				//
				
				tt_element = null;
				displayed = false;
				
				//
				
				if (enabled === true)
				{
					this.enable();
				}
				
			//#endregion

		}

		this.controls = new function NAMESPACE__$ui$controls()
		{
		var $controls = this;
		
			////
			
			this.render = function $ui$controls$render(container, expando)
			{
				var instantiate = function $ui$controls$render$$instantiate(div)
				{
					var control;
					var control_class;
					
					//
					
					if (expando === false)
					{
						if ((divs[div].className !== undefined) && (divs[div].className.substr(0, 8) === "control:"))
						{
							if ($controls[divs[div].className.split(":")[1]] === undefined)
							{
								throw new $.ObjectInstantiationError("The control '" + divs[div].className.split(":")[1] + "' is not defined in the controls namespace.");
							}
							else
							{
								if (window.controls === undefined)
								{
									window.controls = new Object();
								}
		
								window.controls[divs[div].id] = new $controls[divs[div].className.split(":")[1]](divs[div]);
							}
						}
					}
					else
					{			
						control_class = divs[div].getAttribute("data-control_class")
						
						if (control_class !== null)
						{
							control_class = control_class.split(":")[1];
							
							if ((control_class === undefined) || ($controls[control_class] === undefined))
							{
								throw new $.ObjectInstantiationError("The control '" + control_class + "' is not defined in the controls namespace.");
							}
							else
							{
								if (!window.controls)
								{
									window.controls = new Object();
								}
		
								window.controls[divs[div].id] = new $controls[control_class](divs[div]);
							}
						}
					}
				}
				
				////
				
				var divs; //DOMNodeList:div
				
				//
				
				try
				{
					$.vp(arguments, [
										{
											type:		$.element.containers
										},
										{
											type:		"Boolean",
											optional:	function(){expando=true;}
										}
									]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				divs = container.getElementsByTagName("div");
							
				$.lang.for_each(divs, instantiate);
			}


			this.ProgressBar = function $ui$controls$ProgressBar__CLASS(div)
			{typeof "$ui$controls$ProgressBar__CLASS";
				//#region FIELD
					
					var outer;	//DOMElement:div
					var inner;	//DOMElement:div
					var text;	//DOMElement:span
					
					var border	//Number
						= 1;
				
				//#endregion
				
				//#region PROPERTY
				
					this.show_text	= false;	//Boolean
					this.percent	= null;		//Number
				
				//#endregion
				
				//#region ROUTINE
				
					var render = function $ui$controls$ProgressBar$$render()
					{
						var div_size; //Array
						
						//
						
						//if (div.control_object !== undefined)
						//{
							div.innerHTML = "";
							
							//may want to throw error if it is already rendered
						//}
						
						//
						
						div_size = $.element.get_size(div);
						
						if ((div_size[0] === 0) || (div_size[1] === 0))
						{
							throw new $.GenericError("The ProgressBar control can not be rendered when either the height or width is 0.");
						}
						
						//
						
						outer = div;  //= document.createElement("div");
						
						//
						
						outer.align = "left";
									
						outer.style.backgroundColor = "White";
						
						outer.style.width  = ((div_size[0] - (2 * border)) + "px");
						outer.style.height = ((div_size[1] - (2 * border)) + "px");
						
						outer.style.borderWidth	= "1px";
						outer.style.borderColor = "Black";
						outer.style.borderStyle = "Solid";
						
						//
						
						text = document.createElement("div");
						
						text.style.position		= "absolute";
						text.style.color		= "White";
						text.style.fontWeight	= "Bold";
						text.style.paddingLeft	= "2px";
						
						outer.appendChild(text);
						
						//
						
						inner = document.createElement("div");
						
						inner.style.backgroundColor = (($.element.get_css(outer).color === "") ? "Green" : $.element.get_css(outer).color);
						inner.style.width			= "0px";
						inner.style.height			= outer.style.height;
						
						outer.appendChild(inner);
					}
					
				//#endregion
					
				//#region METHOD
					
					this.set_percent = function $ui$controls$ProgressBar$set_percent(percent)
					{
						try
						{
							$.vp(arguments, {type:"Number", ilb:0, iub:100});
						}
						catch (e)
						{
							throw e;
						}
						
						//
						
						if (percent === 0)
						{
							inner.style.width = "0px";
						}
						else
						{
							//inner.style.width = ((($.element.get_size(outer)[0] * (percent / 100)) - (2 * border)) + "px");
							inner.style.width = ((outer.clientWidth * (percent / 100)) + "px");
						}
						
						$.element.set_inner_text(text, Math.round(percent).toString() + "%");
						
						//
						
						this.percent = percent;
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					this.percent = 0;
					
					render();
				
				//#endregion
	
			}

			this.ButtonBar = function $ui$controls$ButtonBar__CLASS(div, buttons)
			{typeof "$ui$controls$ButtonBar__CLASS";
				var _base = $.lang.inherit(this, $.ui.Control);
				
				//#region ROUTINE
				
					this.render = function $ui$controls$buttonBar$render()
					{
						var table; //DOMElement:table
						
						//
						
						table = $.element.table.create([buttons]);
						
						alert($.element.get_html(table));
						
						div.appendChild(table);
						
						//
						
						_base.render();	
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					try
					{
						$.vp(arguments, [{type:"DOMElement:div"}, {type:"Array"}])
					}
					catch (e)
					{
						throw e;
					}
						
				//#endregion
	
			}

			this.Chart = function $ui$controls$Chart__CLASS(url)
			{typeof "$ui$controls$Chart__CLASS";
				var $this = this;
				
				//#region PROPERTY
					
					this.Width;			//String
					this.Height;		//String
					
					this.color;			//String
			
					this.prerender		= new $.Event(this);		
					this.rendering		= new $.Event(this);
					this.rendered		= new $.Event(this);
					this.errored		= new $.Event(this);
					
					this.loading_image;	//DOMElement:img
					
				//#endregion
				
				//#region METHO
				
					this.render = function $ui$controls$Chart$render(container)
					{
						var callback = function $ui$controls$Chart$render$$ajax_callback(result)
						{
							if ($.lang.is_error(result))
							{
								$.element.modify(container, {innerHTML:"Chart load failure"}, {fontSize:"75%"});
								
								$this.errored.fire(result);
								
								return;
							}
							
							//
							
							$this.rendering.fire();
							
							//
							
							//if (this.loading_image !== undefined)
							//{
							//	container.removeChild($this.loading_image);
							//}				
															
							container.innerHTML = result;
							
							//
							
							$this.rendered.fire();
						}
						
						var create_chart_def = function()
						{
							var chart_temp;
							
							//
							
							chart_temp = $.object.clone($this)
							
							delete chart_temp["loading_image"];
							
							//
											
							if (chart_temp.Width === undefined)
							{
								if ($.element.get_css(container).width === "auto")
								{
									throw new $.InvalidValueError("The Chart width must be defined by either the containing element (container) or by setting the .Width property.");
								}
							
								chart_temp.Width  = {value: $.ui.Measurement.parse_measurement($.element.get_css(container).width).dimension, type:$.ui.Measurement.parse_measurement($.element.get_css(container).width).unit_type};
							}
							else
							{
								chart_temp.Width  = {value: $.ui.Measurement.parse_measurement($this.Width).dimension,  type:$.ui.Measurement.parse_measurement($this.Width ).unit_type};
							}
											
							if (chart_temp.Height === undefined)
							{
								if ($.element.get_css(container).height === "auto")
								{
									throw new $.InvalidValueError("The Chart height must be defined by either the containing element (container) or by setting the .Height property.");
								}
								
								chart_temp.Height = {value: $.ui.Measurement.parse_measurement($.element.get_css(container).height).dimension, type:$.ui.Measurement.parse_measurement($.element.get_css(container).height).unit_type};
							}
							else
							{
								chart_temp.Height = {value: $.ui.Measurement.parse_measurement($this.Height).dimension, type:$.ui.Measurement.parse_measurement($this.Height).unit_type};
							}
															
							return JSON.stringify(chart_temp);
						}
			
						////
						
						try
						{
							$.vp(arguments, {type:"DOMElement:Container"});
						}
						catch (e)
						{
							throw e;
						}
			
						//
						
						container.innerHTML = "";
						
						$this.prerender.fire();
						
						//
						
						if (this.loading_image !== undefined)
						{
							container.appendChild(this.loading_image);
						}
						
						//
						
						$.ajax.async_post_as_text(url, {chart_def:create_chart_def()}, callback);	
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
					
					try
					{
						$.vp(arguments, {type:"String", optional:function(){url=$this.constructor.url;}});
					}
					catch (e)
					{
						throw e;
					}
					
				//#endregion	
	
			}

			this.ToggleImage = function $ui$controls$ToggleImage__CLASS(state_defs)
			{typeof "$ui$controls$ToggleImage__CLASS";
				var $ToggleImage = this;
				
				//#region PROERTY
				
					this.init = new $.Event(this);
				
				//#endregion
				
				//region VARIABLE
				
					var state;
				
				//#endregion
				
				//#region METHOD
				
					this.render = function(container)
					{
						var img__click = function(event_args)
						{
							if (state === undefined)
							{
								$ToggleImage.init.fire();
								
								state = true;
							}
							
							state = (!state);
							
							//
									
							if (state === false)
							{
								for (i=0; i<imgs.length; i++)
								{
									imgs[i].src = state_defs[1].image;
								}
								
								if (state_defs[0].func != null)
								{
									state_defs[0].func.apply
									(
										this,
										[
											event_args,
											((state_defs[0].value === undefined) ? state : state_defs[0].value)
										]
									);
								}
								
							}
							else
							{
								for (i=0; i<imgs.length; i++)
								{
									imgs[i].src = state_defs[0].image;
								}
								
								if (state_defs[1].func != null)
								{
									state_defs[1].func.apply
									(
										this,
										[
											event_args,
											((state_defs[1].value === undefined) ? state : state_defs[1].value)
										]
									);
								}
							}
						}
						
						////
												
						try
						{
							$.vp(arguments, {type:["DOMElement:Container", "Array-DOMElement:Container"]});
						}
						catch (e)
						{
							throw e;
						}
						
						//
						
						var imgs;	//Array-DOMElement:image
						var i;		//Number
						
						//
						
						if (!($.lang.is_array(container)))
						{
							container = [container];
						}
						
						//
						
						imgs = [];
						
						for (i=0; i<container.length; i++)
						{
							imgs[i] = $.element.create("img", container[i], {src:state_defs[0].image}, null, {click:img__click});
							//imgs[i] = $.element.create("img", container[i], null, null, {click:img__click});
							
							container[i].style.cursor = "pointer";
						}
						
						//img__click();
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					try
					{
						$.vp(arguments, [{type:"Array-Object"}]);
					}
					catch (e)
					{
						throw e;
					}
				
				//#endregion
	
			}

			this.Tabs = function $ui$controls$Tabs__CLASS(tabs_definition, default_tab)
			{typeof "$ui$controls$Tabs__CLASS";
				var $this = this;
				var $base = $.lang.inherit(this, $.ui.Control);
				
				//#region VARIABLE
				
					var tabs;				//Array-Object
					
					var loading_image;		//DOMElement:img
				
				//#endregion
				
				//#region FIELD
					
					this.body_div;			//DOMElement:div
					this.selected_tab;		//Number
					
					this.tab_margin			= "7px";
					this.tab_height			= "20px";
					this.tab_width			= "170px"
					
					this.caption_div		= $.element.create("div", null, {_text:" "}, {marginRight:"5px", textAlign:"right"});
			
					this.init				= new $.Event(this);		
					this.selecting			= new $.Event(this);
					this.selected			= new $.Event(this);
						
				//#endregion
				
				//#region PROPERTY
				
					this.get_tabs = function()
					{
						return tabs;
					}
				
				//#endregion
				
				//#region ROUTINE
				
					var close_tab = function()
					{
						if ($this.selected_tab === -1) return;
						
						//
						
						if (tabs[$this.selected_tab].element)
						{
							tabs[$this.selected_tab].element.style.display = "none";
						}
						
						$.element.modify(tabs[$this.selected_tab].div, null, {lineHeight:"24px", backgroundColor:"#E7E3E7", borderBottom:"1px solid #ADA6AD"});
						
						$this.selected_tab = -1;
					}
				
				//#endregion
				
				//#region METHOD
				
					this.render = function ui$controls$Tab$render(container)
					{
						var create_tab = function(index)
						{
							var click = function(event_args, refresh)
							{
								//
								//ignore tab click if target tab already selected
								
								if ((refresh !== true) && ($this.selected_tab === index)) return;
								
								//
								
								if (tabs[index].inited === false)
								{
									if ($this.init.fire(index) === false) return;
									
									tabs[index].inited = true;
								}
			
								if ($this.selecting.fire(index) === false) return;
								
								//
								
								close_tab();
								
								//
								
								$.element.modify(tabs[index].div, null, {lineHeight:"27px", backgroundColor:"white", borderBottom:"1px solid White"});
								
								//
								
			//$this.show_loading(index);
			
								//
								
								$.vv(tabs[index].element, {type:"DOMElement:div", allow_undefined:true}); //move to constructor?
								
								if (tabs[index].element !== undefined) tabs[index].element.style.display = "";
								
								//
			
			
								$this.selected.fire(index);
								
								$this.selected_tab = index;
							}
							
							////
											
							var ttd = $.element.table.create_cell(table.rows[0], null, null, {width:$this.tab_width, textAlign:"center", verticalAlign:"bottom"}, {click:click});
							
							var div_style =
							{
								backgroundColor:	"#E7E3E7",
								
								lineHeight:			"24px",
								
								paddingLeft:		"5px",
								paddingRight:		"5px",
								
								marginLeft:			$this.tab_margin,
								
								borderStyle:		"solid",
								borderWidth:		"1px 1px 0px 1px",
								borderColor:		"#ADA6AD",
								
								borderBottom:		"1px solid #ADA6AD",
								
								cursor:				"pointer"
							};
															
							tabs[index] =
							{
								ttd:		ttd,
								div:		$.element.create($.element.Type.div, ttd, {_text:tabs_definition[index].caption}, div_style),
								inited:		false,
								caption:	tabs_definition[index].caption,
								element:	tabs_definition[index].div,
								select:		function(refresh)
											{
												click.apply(ttd, [null, refresh]);
											}
							};
						}
						
						////
						
						$base.render.apply(this, arguments);
						
						//
						
						$this.container.innerHTML = "";
						
						var table = $.element.table.create();
						
						$.element.modify(table, null, {position:"relative", width:"100%"});
						
						//table.style.position = "relative";
						
						table.insertRow(-1);
						
						//
						
						tabs = [];
						
						$.lang.for_each(tabs_definition, create_tab);			
						
						$.element.table.create_cell(table.rows[0], null, null, {height:"34px"});
						
						$.element.table.create_cell(table.rows[0]).appendChild($this.caption_div);
						
						//
									
						$this.container.appendChild(table);
						
						$.element.create("div", $this.container, null, {width:"100%", borderTop:"1px Solid #ADA6AD", marginTop:"-1px", marginBottom:"15px"});
						
						//
						
						if (default_tab !== undefined)
						{
							$.dom_event.fire(tabs[default_tab].ttd, "click");
						}			
					}
					
					this.set_loading_image = function(image)
					{
						//vp: String, DOMElement:img
						
						//
									
						if (typeof(image == "string"))
						{			
							$.element.img.pre_load(image);
							
							loading_image = image;
						}
						//else
						//{
						//	loading_image = image;
						//}
					}
					
					this.show_loading = function(tab_index)
					{
						var div = tabs[tab_index].div;
								
						if (loading_image === undefined)
						{
							//$.element.create("span", tabs[tab_index].div, {_text:"-Loading"}, {marginLeft:"5px"});
						}
						else
						{
							if (div.childNodes.length === 2) return;
			
							div.style.width = (($.element.compute_width(div) + 15) + "px");
			
							$.element.create("img", div, {src:loading_image}, {position:"relative", marginLeft:"5px"});
						}
					}
					
					this.hide_loading = function(tab_index)
					{
						var div = tabs[tab_index].div;
						
						if (loading_image === undefined)
						{
						}
						else
						{
							if (div.childNodes.length == 1) return;
							
							//setTimeout
							//(
							//	function()
							//	{
									$.element.remove(div.childNodes[1]);
									
									div.style.width = (($.element.compute_width(div) - 15) + "px");
							//	},
							//	100
							//);
						}
					}
					
					this.select = function(index, refresh)
					{
						if (index === -1)
						{
							close_tab();
							
							return;
						}
						
						//
						
						$.dom_event.fire(tabs[index].ttd, "click", [refresh]);
					}
					
					/*
					this.hide = function ui$controls$Tab$hide()
					{
						var i; //Number
						
						//
						
						for (i=0; i<tabs_definition.length; i++)
						{
							if (tabs_definition[i].div !== undefined)
							{
								tabs_definition[i].div.style.display = "none";
							}
						}
					}
					
					this.show = function ui$controls$Tab$show()
					{
						if (selected === undefined)
						{
							alert("first for tabs");
						}
					}
					*/
					
				//#endregion
				
				//#region CONSTRUCTOR
				
					//$.vp
					
					//
					
					$this.selected_tab = -1;
					
				//#endregion
	
			}
		}

		this.element = new function NAMESPACE__$ui$element()
		{
			this.SelectLinker = function $ui$element$SelectLinker(matrix, select_array)
			{
				//#region FIELD
				
					var SelectLinker = this;
				
				//#endregion
				
				//#region PROPERTY
				
					this.selection_change	= new $.Event(this);
				
					this.populating			= new $.Event(this);
					this.populated			= new $.Event(this);
					
					this.separator			= "|";
				
				//#endregion
				
				//#region ROUTINE
							
					var selection_change = function $ui$element$SelectLinker$$selection_change(event, index)
					{
						var search = function $ui$element$SelectLinker$$selection_change$$search(item)
						{
							if (item.val === select_array[i].value)
							{
								return true;
							}
						}
												
						////
										
						var item;
						var current_sub_matrix;
						var i;
						
						//
						
						if (index > -1) //may only want to trigger if selected by user!
						{				
							SelectLinker.selection_change.fire(select_array[index]);
						}
						
						//
						//clear all drop-downs
						
						for (i=(index + 1); i<select_array.length; i++)
						{
							select_array[i].options.length = 0;
						}
													
						//
										
						current_sub_matrix = matrix;
						
						for (i=0; i<(index + 1); i++)
						{
							if (current_sub_matrix.options === null) //check is array instead
							{
								break;
							}
							else
							{
								current_sub_matrix = $.lang.array.search(current_sub_matrix.options, search, true);
							}					
						}
						
						if ((index > -1) && (select_array[index].value === ""))
						{
							return;
						}
						
						if ((index + 1) >= select_array.length)
						{
							return;	
						}
						
						SelectLinker.populating.fire(select_array[(index + 1)]);
						
						//
						//populate the current select if options exist
						
						if (current_sub_matrix.options !== null)
						{				
							for (i=0; i<current_sub_matrix.options.length; i++)
							{
								$.element.create("option", select_array[(index + 1)], {_text:current_sub_matrix.options[i].text, value:current_sub_matrix.options[i].val});
							}
						}
						
						SelectLinker.populated.fire(select_array[(index + 1)]);
						
						selection_change(null, (index+1));
					}
					
					var transform = function()
					{
						var attribute;	//String
						var tm;			//Object
						
						//
						
						tm = {};
						
						x(matrix, tm);
						
						function x(matrix, tm)
						{
							if (matrix === null)
							{
								return;
							}
							
							tm.options = new Array();
							
							for (attribute in matrix)
							{
								tm.options.push({val: attribute.split(SelectLinker.separator)[1], text: attribute.split(SelectLinker.separator)[0], options: null});
								
								x(matrix[attribute], tm.options[(tm.options.length - 1)]);				
							}
						}
						
						//alert(JSON.stringify(tm));
						
						return tm;
					}
					
					/*
					var selection_change = function $ui$element$SelectLinker$$selection_change(event, dd_index)
					{
						var search = function(attribute)
						{
							if (attribute.split(SelectLinker.separator)[0] === select_array[i].value)
							{
								return true;
							}
						}
												
						////
						
						var item;
						var current_sub_matrix;
						var i;
						
						//
						//fire selection change event
		
						//if (dd_index > -1)
						//{
						//	SelectLinker.selection_change.fire(select_array[dd_index]);
						//}
						
						//
						//clear all drop-downs
						
						for (i=(dd_index + 1); i<select_array.length; i++)
						{
							select_array[i].options.length = 0;
						}
													
						//
						
						current_sub_matrix = matrix;
						
						for (i=0; i<(dd_index + 1); i++)
						{
							current_sub_matrix = $.object.search(current_sub_matrix, search, true);
							
							if (current_sub_matrix === null)
							{
								return; //break;
							}
						}
						
						//if (current_sub_matrix.options === null)
						//{
						//	return;
						//}
						
						//SelectLinker.populating.fire(select_array[(dd_index + 1)]);
						
						//if (current_sub_matrix === -1)
						//{
						//	return;
						//}
						
						for (var option in current_sub_matrix)
						{
							var vt; //Array
							
							//
							
							vt = option.split(SelectLinker.separator);
							
							$.element.create("option", select_array[(dd_index + 1)], {_text: vt[1], value: vt[0]});
						}
						
						//SelectLinker.populated.fire();
						
						//
						
						selection_change(null, (dd_index+1));				
					}
					*/
				
				//#endregion
				
				//#region METHOD
				
					this.enable = function $ui$element$SelectLinker$enable()
					{
						var i; //Number
						
						//
						
						for (i=0; i<(select_array.length); i++)
						{
							if ($.element.inspect_event(select_array[i], "change").length === 0)
							{
								$.element.attach_event(select_array[i], "change", selection_change, [i]);
							}
						}
						
						selection_change(null, -1);
					}
					
					this.get_matrix = function $ui$element$SelectLinker$get_matrix()
					{
						return matrix.options;
					}
					
				//#endregion
				
				//#region CONSTRUCTOR
						
					matrix = transform();
				
				//#endregion
			}

		}

		this.Control = function $ui$Control__CLASS()
		{typeof "$ui$Control__CLASS";
			//#region PROPERTY
			
				this.id_prefix; //TODO: generate random string for default
				
				this.container;	//DOMElement
						
				this.init_render	= new $.Event(this);
				this.rendering;
				this.rendered		= new $.Event(this);
			
			//#endregion
			
			//#region METHOD
			
				this.render = function()
				{
					this.container = arguments[0];
					
					this.init_render.fire();
				}
				
			//#endregion

		}

		this.patterns = new function NAMESPACE__$ui$patterns()
		{
			this.Disable = function $ui$patterns$Disable(element, callback)
			{
				//#region method
				
					this.callback = function $ui$patterns$disable$callback(returned)
					{
						$.element.enable(element);
						
						if (callback !== undefined)
						{
							callback(returned);
						}
					}
					
				//#endregion
				
				//#region CONSTRUCTOR
				
					$.element.disable(element, {color:"White", opacity:60, cursor:"wait"}); //use predefined
				
				//#endregion
				
				return this.callback;
			}
		
			this.DisableDocument = function $ui$patterns$Disable(callback)
			{
				//#region method
				
					this.callback = function $ui$patterns$disable$callback(returned)
					{
						$.window.document.enable();
						
						if (callback !== undefined)
						{
							callback(returned);
						}
					}
					
				//#endregion
				
				//#region CONSTRUCTOR
				
					$.window.document.disable({opacity:60, cursor:"wait"}); //use predefined
				
				//#endregion
				
				return this.callback;
			}
		
			this.Animate = function $ui$patterns$Animate(image, element, style, display_function, message, callback)
			{	
				//#region VARIABLE
				
					var span;	//DOMElement:span
					
				//#endregion
				
				//#region METHOD
				
					this.callback = function()
					{
						$.element.remove(span);
						
						if (callback != null) callback.apply(window, arguments);
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					try
					{
						$.vp
						(
							arguments,
							{
								type:		"String"
							},
							{
								type:		"DOMElement"
							},
							{
								type:		"Object",
								optional:	function(){style={};}
							},
							{
								type:		"Function",
								optional:	function(){display_function=$.element.insert_after;}
							},
							{
								type:		"String",
								optional:	function(){message="";}
							},
							{
								type:		"Function",
								optional:	true
							}
						);
					}
					catch(e){throw e;}
				
					//
										
					span = $.element.create("span", null, null, style);
					
					span.appendChild
					(
						$.element.table.populate
						(
							$.element.create("table"),
							[[$.element.create("img", null, {src:image}), message]],
							function(td, data) //move
							{
								if (td.cellIndex === 1) td.style.paddingLeft = "5px";
								
								return data;
							}
						)
					);
					
					display_function(span, element);
					
					return this.callback;
				
				//#endregion
			}
			
			//OBSOLETE
			this.Animate.after = function(element, absolute)
			{
				return function(img)
				{
					if (absolute === true) img.style.position = "absolute";
					
					$.element.insert_after(img, element);
				}
			}	
			
			//OBSOLETE
			this.Animate.append = function(element)
			{
				return function(img)
				{
					element.appendChild(img);
				}
			}

		}

		this.CachedControl = function $ui$CachedControl__CLASS()
		{typeof "$ui$CachedControl__CLASS";
			var $this = this;
			var $base = $.lang.inherit(this, $.ui.Control);
			
			//#region VARIABLE
			
				var elements;		//Object
				var bound_elements;	//Array
			
			//#endregion
			
			//#region FIELD
			
				this._element;		//DOMElement
				
				this.init_render;	//$.Event
				
			//#endregion
			
			//#region ROUTINE
			
				var build_elements_collection = function()
				{
					var nl;			//DOMNodeList
					var i;			//Number
					var data_id;	//String
					var data_bound;	//String
					
					//
					
					elements = {};
					bound_elements = [];
					
					//
					
					nl = $this._element.getElementsByTagName("*");
					
					for (i=0; i<nl.length; i++)
					{
						data_id = nl[i].getAttribute("data-id");
						
						if (data_id !== null)
						{
							elements[data_id] = nl[i];
						}
						
						//
						
						data_bound = nl[i].getAttribute("data-bound");
						
						if (data_bound !== null)
						{
							bound_elements.push(nl[i])
						}
					}
				}
			
			//#endregion
			
			//#region METHOD
			
				this.render = function()
				{
					if (typeof(this.constructor._html) !== "string")
					{
						$.lang.delay_execute(this.render, 0, this, arguments);
						
						return;
					}
					
					//
					
					this._element = $.element.create_from_html(this.constructor._html);
									
					build_elements_collection();
					
					$base.render.apply(this, arguments);
					
					this._render.apply(this);
				}
				
				this.bind = function(data_source, binder_functions)
				{		
					$.element.data.bind(bound_elements, data_source, binder_functions);
				}		
				
				this.g$ = function(id)
				{
					if (id === undefined) return elements;
					
					return elements[id];
				}
			
			//#endregion
			
			//#region CONSTRUCTOR
			
				$.ui.caching.load_html(this.constructor);
			
			//#endregion

		}

		this.Imitator = function $ui$Imitator__CLASS(element, reference_element, imitator_function)
		{typeof "$ui$Imitator__CLASS";
			var $this = this;
			
			//#region VARIABLE
			
				var imitator_function; //Function
			
			//#endregion
			
			//#region CONSTRUCTOR
			
				try
				{
					$.vp(arguments, [
										{type:"Object"},
										{type:"Object"},
										{
											type:		"Function",
											optional:	function(){imitator_function=$this.constructor.display;}
										}
									]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
						
				return $.lang.__interval_execute(imitator_function, 0, null, [element, reference_element]);
						
			//#endregion

		}

		this.caching = new function NAMESPACE__$ui$caching()
		{
			this.load_object = function(url, file_name, version, name, load_callback)
			{
			
				var callback = function(constructor)
				{
					constructor.url = url;
					constructor.version = version;
								
					//
					
					if (constructor.load) constructor.load();
								
					if (load_callback != null) load_callback(constructor);
				}
				
				////
				
				if (url.slice(-1) !== "/")
				{
					url += "/";
				}
				
				//
				//load_object avoids downloading .js file if the constructor is already present
				
				$.reflection.load_object((url + file_name + "?ver=" + version), name, null, callback);	
			}
			
			this.load_html = function(object_constructor, file_name, callback_pointer)
			{
				var callback = function(returned)
				{
					//TODO: check for error
					
					//
					
					object_constructor._html = returned;
					
					if (callback_pointer != null) callback_pointer();
				}
				
				////
								
				try
				{
					$.vp
					(
						arguments,
						[
							{type:"Function"},
							{type:"String", optional:true},
							{type:"Function", optional:true}
						]
					);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if (typeof(object_constructor._html) === "string")
				{
					if (callback_pointer != null) callback_pointer();
					
					return;
				}
				
				//
				
				if (file_name == null)
				{
					//
					//use object name to determine html file name
					
					file_name = ($.lang.array.get_last($.reflection.get_namespace_array(object_constructor)) + ".htm");
				}
				
				$.ajax.async_get_as_text((object_constructor.url + file_name + "?" + "ver=" + object_constructor.version), null, callback);
			}

		}
	}

	this.DraggableObjectHandler = function $DraggableObjectHandler__CLASS(body_element, dragging_element, boundry_element, enabled, modifiers)
	{	
		var $this = this;
	
		//#region VARIABLE
		
			var _is_enabled;				//Boolean
			var _is_dragged;				//Boolean, specifies if the draggable object has been dragged out of its original position
			
			var position_element;			//Array
			var position_mouse;				//Array
			
			var _body_element_state;		//$.StateHolder;
			//var _state_dragging_element;	//$.StateHolder;
			
			var placeholder_div;			//Boolean
			
			var h_diff;						//Number
			var v_diff;						//Number
			
			var h_boundry_reached;			//Number
			
	
		//#endregion
		
		//#region FIELD
			
			this.dc					= [];
			
			this.enabled;			//$.Event
			this.disabled;			//$.Event
			this.drag_start;		//$.Event
			this.drag;				//$.Event
			this.drag_end;			//$.Event
			
			this.boundry_reached;	//$.Event
			
			this.auto_position		= true;
			
			this.h_draggable		= true;
			this.v_draggable		= true;
			
			this.placeholder		= false;
			
			this.replaceable		= true;
			this.replace_proximity	= 5;
			
			this.cursor				= $.element.css.Cursor.move;
		
		//#endregion
		
		//#region METHOD
	
			this.enable = function()
			{
				//fire enabled event!
				
				//body_element.style.zIndex = 5; //should get from LayerManger!
				
				$.object.attach_event(dragging_element, $.dom_event.Type.mouse_down, start_drag);
				
				//
				
				_is_enabled = true;
			}
	
			this.disable = function()
			{
				$.object.detach_event(dragging_element, $.dom_event.Type.mouse_down, start_drag);
				
				end_drag();
				
				//
				
				_is_enabled = false;
				
				//
				
				//fire disable event!
			}
			
			this.is_enabled = function()
			{
				return _is_enabled;
			}
		
		//#endregion
		
		//#region ROUTINE
	
			function start_drag(event)
			{
				var generic_auto_position = function()
				{
					body_element.style.position = $.element.css.Position.absolute;
				}
				
				var opera_auto_position = function()
				{
					var top = $.element.get_position(body_element)[1];
					
					generic_auto_position();
					
					body_element.style.top = (top + "px");
				}
				
				////
				
				//if (_is_dragged === false)
				//{
					//
					//preserve state of the draggable element
					
					//_body_element_state = new $.element.StateHolder(body_element, ["clientWidth", "clientHeight", "style.zIndex", "style.position"]);
					
					//_body_element_state.offsetLeft = $.element.get_position(body_element)[0];
					//_body_element_state.offsetTop  = $.element.get_position(body_element)[1];
					
					//
					
					//if ($this.placeholder === true)
					//{
					//	create_placeholder();
					//}
					
					//with (body_element.style)
					//{
					//	//zIndex		= "5"; //should get this value from LayerManager
					//	
					//	left		= (_body_element_state.offsetLeft + "px");
					//	top			= (_body_element_state.offsetTop + "px");					
					//}
					
					//
					//redimension if object went from inline to absolute/relative???
					
					//width		= (_body_element_state.clientWidth  + "px");
					//height	= (_body_element_state.clientHeight + "px");					
					
					//
				
					//_is_dragged = true;
				//}
				
				////
	
				$this.drag_start.fire(event);
	
				//
				
				_body_element_state = new $.element.StateHolder(body_element, null, ["position", "left", "top"]);
							
				if ($this.auto_position === true)
				{
					switch (_body_element_state.state.style.position)
					{
						case $.element.css.Position.absolute:
						{
							break;
						}
						case $.element.css.Position.fixed:
						{
							body_element.style.top  = ((body_element.offsetTop  + $.window.get_scroll_top())  + "px");
							body_element.style.left = ((body_element.offsetLeft + $.window.get_scroll_left()) + "px");
						}
						default:
						{
							new $.browser.Unifier
							(
								{
									generic:	generic_auto_position,
									opera:		opera_auto_position
								}
							);
						}
					}				
				}
	
				if (!($.lang.array.contains([$.element.css.Position.absolute], body_element.style.position))) throw new $.GenericError("The draggable body element must have a style.position of 'absolute'."); //untested:  or 'relative'
	
				//
				
				position_element = $.element.get_position(body_element);
				position_mouse	 = [event.screenX, event.screenY];
				
				//
				
				$.element.disable_selecting(window.document.body);
				
				//_state_dragging_element = new $.element.StateHolder(document.body, ["style.cursor"]);
				//dragging_element.style.cursor = $this.cursor;
				
				//
				
				$.object.attach_event(window.document, $.dom_event.Type.mouse_move, dragging);
				$.object.attach_event(window.document, $.dom_event.Type.mouse_up,   end_drag);
				
				//document.body.onmouseout = function(event){if (new $.event.EventObj(event).get_source() == document.body){alert("docout");}}
				
	//$.element.attach_event(document.body, "mouseout", function(){document.getElementById("userName").value = $.GetType(new $.event.EventObj(event).get_target());});
				
				//$.element.attach_event(document.body, "mouseout", f);
				
				//
				
				//if ($.GetType(dragging_element) == "element:img")
				//{
					new $.browser.Unifier
					(
						{
							"explorer":	function(){dragging_element.ondrag = $.browser.false_function},
							"firefox":	function(){event.event.preventDefault();}
						}
					);
				//}
	
			}
			
			function end_drag(event)
			{   
				$.element.detach_event(window.document, $.dom_event.Type.mouse_move, dragging);
				$.element.detach_event(window.document, $.dom_event.Type.mouse_up,   end_drag);
				
				//
	
				/*
				if (($this.placeholder === true) && ($this.replaceable === true))
				{
					if ($.element.proximity(body_element, placeholder_div) < $this.replace_proximity)
					{
						placeholder_div.parentNode.replaceChild(body_element, placeholder_div);
						
						//
						
						with (body_element.style)
						{
							zIndex		= _body_element_state.style.zIndex;
							
							position	= _body_element_state.style.position;
							
							left		= "auto";
							top			= "auto";
							
							width		= "auto";
							height		= "auto";
						}
						
						//
						
						_is_dragged = false;
					}
				}
				*/
				
				//
				
				
				//
				
				$.element.enable_selecting(window.document.body);
				
				//dragging_element.style.cursor = _state_dragging_element.style.cursor;
				
				//
				
				h_boundry_reached  = undefined;
				
				//
				
				$this.drag_end.fire(event);
				
				//
							
				if ($this.auto_position === true) //below should be handled by implementing object
				{
					switch (_body_element_state.state.style.position)
					{
						case $.element.css.Position.absolute:
						{
							break;
						}
						case $.element.css.Position.fixed:
						{
							body_element.style.top  = ((body_element.offsetTop  - $.window.get_scroll_top())  + "px");
							body_element.style.left = ((body_element.offsetLeft - $.window.get_scroll_left()) + "px");
							
							break;
						}
						default:
						{
							body_element.style.left = $.String.empty;
							
							break;
						}
					}
					
					body_element.style.position = _body_element_state.state.style.position;
				}
			}
	
			function dragging(event)
			{
				var left;		//Number
				var tc;			//Number
				var boundry;	//Number
				
				//
				
				//perform vv
				
				//
							
				if ($this.h_draggable === true)
				{
					h_diff = (event.screenX - position_mouse[0]);
					
					left = (position_element[0] + h_diff);
					
					//
					
					if (boundry_element !== null)
					{				
						tc = ($.element.get_position(boundry_element)[0] + modifiers.left_boundry);
						
						if ((h_diff < 0) && (tc >= left))
						{
							//end_drag(null); uncomment for a different effect
							
							left = tc;
							
							//
							
							boundry = 0;
						}
						else
						{
							if (h_boundry_reached === 0)
							{
								h_boundry_reached = undefined;
							}
						}
						
						tc = (($.element.get_coordinates(boundry_element)[1] - modifiers.right_boundry) - body_element.offsetWidth);
						
						if ((h_diff > 0) && (left >= tc))
						{
							//end_drag(null); uncomment for a different effect
							
							left = tc;
							
							//
							
							boundry = 1;
						}
						else
						{
							if (h_boundry_reached === 1)
							{
								h_boundry_reached = undefined;
							}
						}
					}
					
					body_element.style.left = (left + "px");
					
					if ((h_boundry_reached !== boundry) && (boundry !== undefined))
					{
						h_boundry_reached = boundry;
						
						$this.boundry_reached.fire(boundry);
						
						//end_drag(event);
						
						return;
					}				
				}
				
				//
				//handle vertical movement
				
				if ($this.v_draggable === true)
				{
					body_element.style.top = ((position_element[1] - (position_mouse[1] - event.screenY)) + "px");
				}
				
				//
				
				$this.drag.fire(event);
			}
							
			function create_placeholder()
			{
				var div; //$.Element:div
				
				//
				
				div = $.Element($.element.Style.div);
				
				with (div.style)
				{
					width			= (_body_element_state.clientWidth + "px");
					height			= (_body_element_state.clientHeight + "px");
					
					borderStyle		= $.element.css.BorderStyle.solid;
					borderWidth		= "1px";
					borderColor		= "Blue";
					
					marginBottom	= "1em"; //adopt portlet class programatically
				}
				
				//div.setAttribute("class", "portlet");
				
				//attach events to track window size and adjust Window object
				
				placeholder_div = body_element.parentNode.insertBefore(div, body_element);
			}
			
			function re_placed()
			{
				
			}
	
		//#endregion
		
		//#region CONSTRUCTOR
		
			try
			{
				$.vp
				(
					arguments,
					{
						type:		"DOMElement"
					},
					{
						type:		"DOMElement",
						optional:	true
					},
					{
						type:		"DOMElement",
						optional:	true
					},
					{
						type:		"Boolean",
						optional:	function(){enabled=true;}
					},
					{
						type:		"Object",
						optional:	function(){modifiers={};}
					}
				);
			}
			catch(e){throw e;}
			
			//
			
			dragging_element = $.lang.ifnu(body_element, dragging_element);
			
			//
			//initialize events using the body_element as the sender of the event
			
			this.enabled			= new $.Event(body_element);
			this.disabled			= new $.Event(body_element);
			this.drag_start			= new $.Event(body_element);
			this.drag				= new $.Event(body_element);
			this.drag_end			= new $.Event(body_element);
			
			this.boundry_reached	= new $.Event(body_element);
			
			//
					
			if (($.element.contains(body_element, dragging_element) === false) && (body_element !== dragging_element)) throw new $.GenericError("Dragging element must be contained withiin body element.");
			
			if ((boundry_element !== null) && ($.element.contains(boundry_element, body_element) === false)) throw new $.GenericError("Body element must be contained withiin boundry element.");
			
			if (!("left_boundry" in modifiers))
			{
				modifiers.left_boundry = 0;
			}
			
			if (!("right_boundry" in modifiers))
			{
				modifiers.right_boundry = 0;
			}
			
			//
			
			position_element	= [];
			position_mouse		= [];
			
			//
						
			if (enabled === true)
			{
				this.enable();
			}
			
			_is_dragged = false;
	
		//#endregion

	}

	this.ResizableObjectHandler = function $ResizableObjectHandler__CLASS(element)
	{typeof "$ResizableObjectHandler__CLASS";
	var $ResizableObjectHandler = this;
	
		//#region VARIABLE
	
			var _dragger_element;	//Element
			var _position; 			//Array
	
			var _element_state; 	//$.element.StateHolder
			var _body_state;		//$.element.StateHolder
	
		//#endregion
		
		//#region PROPERTY
		
			this.resizing_anchor_size	= null;	//Number
			this.keep_ratio				= null; //Boolean
			
			this.anchors				= null; //Array
			
			this.resizing				= null; //$.Event
			
	//intellisense for current module?
		
		//endregion
	
		//#region ROUTINE
	
	
	
	
	
	
			var drag_start = function(e)
			{
				_position		= [this.offsetLeft, this.offsetTop];
				
				_element_state	= new $.element.StateHolder(element, ["offsetWidth", "offsetHeight", "style.cursor"]);
				_body_state		= new $.element.StateHolder(document.body, ["style.cursor"]);
				
				//
				
				element.style.cursor		= this.style.cursor;
				document.body.style.cursor	= this.style.cursor;		
				
			}
	
			var drag = function(e)
			{
				var width;  //Number
				var height; //Number
				
				/*
				if (Math.abs(element.offsetWidth - (_element_state.offsetWidth + (_dragger_element.offsetLeft - _position[0]))) > 2)
				{
				element.style.width  = ((_element_state.offsetWidth  + (_dragger_element.offsetLeft - _position[0])) + "px");
				}
	
					if (Math.abs(element.offsetHeight - (_element_state.offsetHeight + (_dragger_element.offsetTop  - _position[1]))) > 2)
				{
				element.style.height = ((_element_state.offsetHeight + (_dragger_element.offsetTop  - _position[1])) + "px");
				}
				*/
	
				//TODO: use containing div and delay script to achieve smooth draggin neffect
	
	
	
				switch(this._so.location)
				{
					case 1:
					{
						width  = (_element_state.offsetWidth + (this.offsetLeft - _position[0]));
						height = _element_state.offsetHeight;
						
						break;
					}
					case 2:
					{
						break;
					}
					case 3:
					{
						break;
					}
					case 4:
					{
						break;
					}
					case 5:
					{
						width  = (_element_state.offsetWidth + (this.offsetLeft - _position[0]));
						height = _element_state.offsetHeight;
	
						element.style.width = (width + "px");
	
						break;
					}
					case 6:
					{
						break;
					}
					case 7:
					{
						break;
					}
					case 8:
					{
						width  = (_element_state.offsetWidth + (this.offsetLeft - _position[0]));
						height = (_element_state.offsetHeight + (this.offsetTop - _position[1]));
	
						if (width < height)
						{
							height = width;
						}
						else
						{
							width = height;
						}
						
						break;
					}
				}
	
	
	
						element.style.width = (width + "px");
						element.style.height = (height + "px");
	
	
	
	
	
	
	
	
				/*
				if (width < height)
				{
					height = width;
				}
				else
				{
					width = height;
				}
				*/
				
				
				
	
				element_drag(null);
			}
	
			var drag_end = function(e)
			{
				drag.call(this, null);
	
				_position		= null;
	
				//
				
				element.style.cursor		= _element_state.states["style.cursor"];
				//document.body.style.cursor	= ""; //use StatHolder.reapply
				document.body.style.cursor	= _body_state.states["style.cursor"];
				
				_element_state  = null;
				_body_state		= null;
			}
			
			
			
			
	
			var element_drag = function(e)
			{	
				for (var i=0; i<$ResizableObjectHandler.anchors.length; i++)
				{
					if ($ResizableObjectHandler.anchors[i].enabled == true)
					{
						$ResizableObjectHandler.anchors[i].reposition();
					}
				}
			}
	
		//#endregion
	
		//#region METHOD
	
			this.enable = function()
			{
				for (var i=0; i<8; i++)
				{
					if (this.anchors[i].enabled == true)
					{
						this.anchors[i].activate();
					}
				}
	
	
				//
				
				
				
				
				
				
				//_dragger_element.dragging_handler = new J.DraggableObjectHandler(_dragger_element);
	
				//_dragger_element.dragging_handler.drag_start.attach(drag_start);
				//_dragger_element.dragging_handler.drag.attach(drag);
				//_dragger_element.dragging_handler.drag_end.attach(drag_end);
	
				//_dragger_element.dragging_handler.enable();
				
				
				
				
				
				
				
				
				
				//
	
				element.style.cursor = "move";
	
				element.dragging_handler.drag.attach(element_drag);
			}
	
			this.disable = function()
			{
				element.dragging_handler.drag.detach(element_drag);
			}
	
		//#endregion
		
		//#region CLASS
		
			var DraggingAnchor = function(resizeable_object_handler, location)
			{
				//#region VARIABLE
				
					var _dragger_element; //DOMElement:div
				
				//#endregion
				
				//#region PROPERTY
	
					this.location			= null; //Number
					this.enabled			= null;	//Boolean			
					this.style				= null; //Object
					
					this.dragging_handler	= null; //$.DraggableObjectHandler
				
				//#endregion
				
				//#region ROUTINE
				
					this.activate = function()
					{
						_dragger_element.dragging_handler.enable();
						
						_dragger_element.dragging_handler.drag_start.attach(drag_start);
						_dragger_element.dragging_handler.drag.attach(drag);
						_dragger_element.dragging_handler.drag_end.attach(drag_end);
						
						//
						
						this.enabled = true;
					}
					
					this.deactivate = function()
					{
						_dragger_element.dragging_handler.disable();
						
						this.enabled = false;
					}
				
				//#endregion
				
				//#region METHOD
				
					this.reposition = function()
					{
						switch (location)
						{
							case 1: //left-top
							{
								_dragger_element.style.left = (J.element.get_coordinates(element)[0] + "px");
								_dragger_element.style.top = (J.element.get_coordinates(element)[2] + "px");
								
								_dragger_element.style.cursor = "nw-resize";
								
								break;
							}
							case 2: //center-top
							{
								_dragger_element.style.left = ((J.element.get_coordinates(element)[0] + ((element.offsetWidth - resizeable_object_handler.resizing_anchor_size) / 2) ) + "px");
								_dragger_element.style.top = (J.element.get_coordinates(element)[2] + "px");
								
								_dragger_element.style.cursor = "n-resize";
								
								break;
							}
							case 3: //right-top
							{
								_dragger_element.style.left = ((J.element.get_coordinates(element)[1] - resizeable_object_handler.resizing_anchor_size) + "px");
								_dragger_element.style.top = (J.element.get_coordinates(element)[2] + "px");
								
								_dragger_element.style.cursor = "ne-resize";
								
								break;
							}
							case 4: //left-center
							{
								_dragger_element.style.left = (J.element.get_coordinates(element)[0] + "px");
								_dragger_element.style.top = (((J.element.get_coordinates(element)[2] + ((element.offsetHeight - resizeable_object_handler.resizing_anchor_size) / 2)) ) + "px");
								
								_dragger_element.style.cursor = "e-resize";
	
								break;
							}
							case 5: //right-center
							{
								_dragger_element.style.left = ((J.element.get_coordinates(element)[1] - resizeable_object_handler.resizing_anchor_size) + "px");
								_dragger_element.style.top = (((J.element.get_coordinates(element)[2] + ((element.offsetHeight - resizeable_object_handler.resizing_anchor_size) / 2)) ) + "px");
								
								_dragger_element.style.cursor = "w-resize";
							
								break;
							}
							case 6: //left-botton
							{
								_dragger_element.style.left = (J.element.get_coordinates(element)[0] + "px");
								_dragger_element.style.top = ((J.element.get_coordinates(element)[3] - resizeable_object_handler.resizing_anchor_size) + "px");
								
								_dragger_element.style.cursor = "sw-resize";
								
								break;
							}
							case 7: //center-bottom
							{
								_dragger_element.style.left = ((J.element.get_coordinates(element)[0] + ((element.offsetWidth - resizeable_object_handler.resizing_anchor_size) / 2) ) + "px");
								_dragger_element.style.top = ((J.element.get_coordinates(element)[3] - resizeable_object_handler.resizing_anchor_size) + "px");
								
								_dragger_element.style.cursor = "s-resize";
								
								break;
							}
							case 8: //right-bottom
							{
								_dragger_element.style.left = ((J.element.get_coordinates(element)[1] - resizeable_object_handler.resizing_anchor_size) + "px");
								_dragger_element.style.top = ((J.element.get_coordinates(element)[3] - resizeable_object_handler.resizing_anchor_size) + "px");
								
								_dragger_element.style.cursor = "se-resize";
								
								break;
							}
						}
					}
				
				//#endregion
				
				//#region CONSTRUCTOR
				
					;(
					function()
					{
						this.location	= location;
						this.enabled	= true;
						
						//
					
						_dragger_element = J.element.create("div", document.body);
						
						_dragger_element._so = this;
	
						with (_dragger_element.style)
						{
							position = "absolute";
	
							width  = ((resizeable_object_handler.resizing_anchor_size - 2) + "px");
							height = ((resizeable_object_handler.resizing_anchor_size - 2) + "px");
	
							fontSize = "0px";
	
							backgroundColor = "White";
	
							borderStyle = "Solid";
							borderWidth = "1px";
							borderColor = "Black";
	
							zIndex = (element.style.zIndex + 1);
						}
						
						this.reposition();
						
						this.style = _dragger_element.style;
						
						//
						
						_dragger_element.dragging_handler = new $.DraggableObjectHandler(_dragger_element);
					}
					).call(this);
				
				//#endregion
			}
		
		//#endregion
		
		//#region CONSTRUCTOR
	
			;(
			function ResizableObject_constructor()
			{
				this.resizing_anchor_size	= 8;
				this.keep_ratio				= true;
				
				//
				
				this.anchors = new Array();
				
				for (var i=0; i<8; i++)
				{
					this.anchors[i] = new DraggingAnchor(this, (i + 1));
				}
	
		
				
			}
			).call(this);
	
		//#endregion

	}

	this.JICS = new function NAMESPACE__$JICS()
	{
	var $JICS = this;
	
		//#region variable
			
			var portlet_view_div;	//DOMElement:div
			
			var session_monitor;	//JCSL.JICS.SessionMonitor
		
		//#endregion
		
		//#region OBJECT
		
			var SessionMonitor = function()
			{
				//#region VARIABLE
				
					var $this = this;
					
					//
					
					var started					= false;
					var count_down_time			= 5;
					var timed_out_canceller;	//Function
					var prompted				= false;
				
				//endregion
				
				//#region PROPERTY
				
					this.get_prompted = function()
					{
						return prompted;
					}
				
				//#endregion
				
				//#region ROUTINE
	
					var minute_to_millisecond = function(minute)
					{
						return (minute * 60000);
					}
					
					var do_start = function()
					{
						var timed_out = function()
						{
							var count_down = function(remaining)
							{
								if (remaining === -1)
								{
									mb.close();
									
									mb = new $.ui.windows.MessageBox($.String.empty, "Your session has expired. You will need to log in again to continue working. Click 'OK' to continue.", mb_feedback);
									
									mb.show_close = false;
									mb.open(null);
																	
									return;
								}
								
								//
								
								if (remaining === undefined)
								{
									remaining = count_down_time;
									
									mb.set_message_html(mb.message_div.innerHTML.replace(("--"), ("-" + remaining + "-")));
								}
								else
								{
									mb.set_message_html(mb.message_div.innerHTML.replace(("-" + (remaining+1) + "-"), ("-" + remaining + "-")));
								}
								
								count_down_canceller = $.lang.delay_execute(count_down, 60000, null, [remaining - 1]);
							}
							
							var mb_feedback = function(button)
							{
								var callback = function(returned)
								{
									if (returned === true)
									{
										do_start();
										
										wb.close();
										
										return;
									}
									
									//
									
									window.location.href = window.location.href;
								}
								
								////
								
								switch (button)
								{
									case "OK":
									{
										if (!count_down_canceller.expired) count_down_canceller();
																			
										var wb = new $.ui.windows.WaitBox("Please wait while the server is contacted.", "UI/Common/Images/AJAXImages/L03b_green.gif");
										
										wb.open(null);
										
										call_session_keep_alive(callback);
																			
										break;
									}
									case "Logout":
									{
										$.window.document.disable({color:$.element.css.Color.white, opacity:66}); //TODO: retrieve dsiable settings from MessageBox object defaults property
										
										window.location.href = document.getElementById("logout").href;
										
										break;
									}
								}
							}
							
							////
							
							var count_down_canceller; //Function
													
							//
									
							prompted = true;
							
							var mb = new $.ui.windows.MessageBox("", "Your session will expire in <span style=\"font-weight:bold;\">--</span> minutes. Press 'OK' to continue your session or 'Logout' to end it.", mb_feedback, [{caption:"OK"}, {caption:"Logout"}]);
							
							mb.show_close = false;
							
							mb.open(null);
							
							count_down();
						}
					
						////
											
						prompted = false;				
	
						timed_out_canceller = JCSL.lang.delay_execute(timed_out, (minute_to_millisecond(Portal.timeout)-minute_to_millisecond(count_down_time)-10000));					
					}
	
					var call_session_keep_alive = function(callback_pointer)
					{
						$.ajax.async_post_as_object
						(
							(window.Portal.url + "/UI/Services/PortalServices.asmx/session_keep_alive"),
							null,
							callback_pointer
						);
					}
														
				//#endregion
				
				//#region METHOD
				
					this.start = function()
					{
						var client_activity_notification = function()
						{
							var reset_timeout = function()
							{
								var callback = function(returned)
								{
									if (returned === true)
									{
										if (!timed_out_canceller.expired) timed_out_canceller();
										
										do_start();
										
										return;
									}
									
									//session keep alive failed! replace with a message stating session has been abandoned by the server...
								}
								
								////
														
								call_session_keep_alive(callback);
							}
							
							////
												
							if ((client_activity_notification_canceller !== undefined) && (client_activity_notification_canceller.expired === false))
							{
								client_activity_notification_canceller();
								
								client_activity_notification_canceller = undefined;
							}
							
							if (prompted === true) return;
																									
							//
							
							var activity_delay = 30000;
							
							var d = new Date();
							
							d.setMilliseconds(d.getMilliseconds() + activity_delay);
													
							if (d > timed_out_canceller.expires)  //if popup in less than 30
							{
								client_activity_notification_canceller = JCSL.lang.delay_execute(reset_timeout, 0);
								
								return;
							}
							
							client_activity_notification_canceller = JCSL.lang.delay_execute(reset_timeout, activity_delay);
						}
						
						////
						
						var client_activity_notification_canceller; //Function
						
						//
						//Guest account does not need session monitoring
						
						if (window.Portal.uid === null) return;
						
						//					
						
						if (started) throw new JCSL.InvalidOperationError("The SessionMonitor is already started.");
						
						started = true;
						
						//
						//Events for reseting timeout based on client side activity
						
						JCSL.element.attach_event(document, $.dom_event.Type.click,		client_activity_notification);
						JCSL.element.attach_event(document, $.dom_event.Type.key_press,	client_activity_notification);
						
						//
						
						count_down_time = 5;
											
						do_start();
					}
				
				//#endregion
			}
		
		//#endregion
		
		//#region PROPERTY
		
			this.get_session_monitor = function()
			{
				if (session_monitor === undefined)
				{
					session_monitor = new SessionMonitor();
				}
				
				return session_monitor;
			}
			
		//#endregion
		
		//#region METHOD
			
			this.get_globalized_string = function $JICS$get_globalized_string(key, element, callback, error_text)
			{
				var ajax_callback = function(returned)
				{			
					if (callback !== undefined)
					{
						callback(returned);
					}
					
					if ($.lang.is_error(returned))
					{
						if (error_text !== undefined)
						{
							element.innerHTML = error_text;
						}
					}
					else
					{
						element.innerHTML = returned;
					}
				};
				
				////
				
				try
				{
					$.vp
					(
						arguments,
						{
							type:		$.Type.String
						},
						{
							type:		$.Type.DOMElement
						},
						{
							type:		$.Type.Function,
							optional:	true
						},
						{
							type:		$.String.empty,
							optional:	true
						}
					);
				}
				catch(e){throw e;}
				
				//
										
				$.ajax.async_post_as_text
				(
					(window.Portal.url + "/UI/Services/PortletServices.asmx/get_globalized_string"),
					{
						key: key
					},
					ajax_callback,
					false,
					20,
					3
				);
			};
		
		//#endregion
		
		//#region OBJECT
			
			/*
			this.SessionExpiredPattern = function $JICS$SessionExpiredPattern(callback)
			{
				//#region ROUTINE
				
					var pre_callback = function(returned)
					{
						if ($.lang.is_error(returned))
						{
							if (returned.exception === "System.Security.SecurityException")
							{
								var mb_callback = function()
								{
									$.window.document.disable({color:"White", opacity:66}); //TODO: retrieve dsiable settings from MessageBox object defaults property
									
									window.location.replace(window.location.href.substr(0, window.location.href.indexOf("?")));
								}
								
								////
															
								new $.ui.windows.MessageBox("Your session has expired. You will now be redirected.", mb_callback).open(null);
								
								return;
							}
						}
						
						//
						
						if (callback !== undefined)
						{
							callback(returned);
						}
					}
				
				//#endregion
				
				return pre_callback;
			}	
			*/
			
			this.TimeOutPattern = function $JICS$TimeOutPattern(callback, fall_through)
			{
				var pre_callback = function(returned)
				{
					if ($.lang.is_error(returned))
					{
						if (returned.type == "RPCTimeOut")
						{
							var mb_callback = function()
							{
								if (fall_through !== true) return;
								
								if (typeof(callback) == $.NativeType.Function)
								{
									callback(returned);
								}
							}
							
							////
														
							new $.ui.windows.MessageBox($.String.empty, "Your request could not be made due to an unresponsive server. Please check you connection and try again.", mb_callback).open(null);
						}
					}
				}
				
				return pre_callback;
			}
		
			this.Portlet = function $JICS$Portlet(element_id_prefix)
			{
				//#region METHOD
				
					this.get_element = function $JICS$Portlet$get_element(id)
					{
						try
						{
							$.vp(arguments, {type:$.Type.String});
						}
						catch(e){throw e;}
						
						//
						//refine to search only the Portlet's containing DIV, not the whole document!
						
						var element = document.getElementById(id);
						
						if (element !== null) return element;
						
						//
						
						element = document.getElementById(element_id_prefix + "." + id);
						
						if (element === null)
						{
							element = this.FindControl(id);
							
							if (element === null) return undefined;
							
							element = element.get_element();
						}
						
						return element;
					}
					
					
					this.get_div = function()
					{
						if (portlet_view_div === undefined)
						{
							portlet_view_div = document.getElementById(element_id_prefix + ".DIVmain"); //refine
							
							//
							//assuming the wrapper div (DIVmain) exists
	
							if (portlet_view_div === null) throw new $.GenericError("The DIVmain wrapper div does not exist.");
						}
						
						return portlet_view_div;
					}
					
					/*
					this.disable = function(style)
					{
						var portlet_view_div;
						
						//
						
						try
						{
							$.vp(arguments, {type:"Object", allow_null:true, optional:function(){style=null;}});
						}
						catch (e)
						{
							throw e;
						}
						
						//
						
						portlet_view_div = this.get_div();
						
						$.element.disable(portlet_view_div, style);
					}
					
					this.enable = function()
					{
						var portlet_view_div;
						
						//
						
						portlet_view_div = this.get_div();
						
						$.element.enable(portlet_view_div);
					}				
					*/
					
				//#endregion
				
				//#region CONSTRUCTOR
				
				//#endregion
			}
		
		//#region
		
		//
		
		this.rpc = function($np) //TODO: document
		{
			var callback = function(returned)
			{
				var callback_caller = function()
				{
					if ($np.err_callback === undefined)
					{
						if (typeof($np.callback) != $.NativeType.Function) throw new $.InvalidParameterTypeError("The 'callback' argument must be a function undefined.");
						
						$np.callback(returned);
					}
					else
					{
						if ($np.err_callback !== null)
						{
							if (typeof($np.err_callback) != $.NativeType.Function) throw new $.InvalidParameterTypeError("The 'err_callback' argument must be a function or null value.");
							
							$np.err_callback(returned);
						}
					}
				}
				
				////
							
				if (call in $JICS.rpc.calls)
				{
					if (typeof($JICS.rpc.calls[call].notification_stop) == $.NativeType.Function)
					{
						$JICS.rpc.calls[call].notification_stop();
					}
					
					delete $JICS.rpc.calls[call];
				}
				
				//
				//handle if error returned
										
				if ($.lang.is_error(returned))
				{			
					if ($np.error === undefined)
					{
						if (Portal.debug_mode === true)
						{
							var exception = (returned.exception == null) ? {fullname:"none", message:""} : ((returned.exception.inner_exception == null) ? returned.exception : returned.exception.inner_exception);
							
							if
							(
								confirm
								(
									"*This message is displayed because the Portal is in DEBUG mode and a server side exception was thrown.*\n\n" +
									returned.message +
									"\n\nException:\n\n" +
									exception.fullname +
									"\n" +
									exception.message +
									"\n\nDebug?"
								)
							)
							{throw returned}
						}
						
						//
											
						if (returned.type == "RPCTimeOut")
						{					
							$JICS.TimeOutPattern($np.err_callback, true)(returned);
							
							return;
						}
						
						if (($np.err_message == null) || (returned.exception.type == "ServerSideException"))
						{
							callback_caller();
							
							return;
						}
						
						//
						
						if (typeof($np.err_message) == $.NativeType.String)
						{					
							new $.ui.windows.MessageBox($.String.empty, $JICS.rpc.compose_message($np.err_message), callback_caller).open(null);
							
							return;
						}
	
						throw new $.InvalidParameterTypeError("The 'err_message' argument must be a string or null value."); 
					}
					
					if (typeof($np.error[returned.type]) == $.NativeType.Function)
					{
						$np.error[returned.type]();
					}
					else
					{
						$np.error[returned.type][returned.exception.type]();
					}
					
					return;
				}
				
				if (typeof($np.callback) == $.NativeType.Function)
				{
					$np.callback(returned);
				}
			}
			
			////
					
			try
			{
				$.vo
				(
					$np,
					{
						named:	"method",
						type:	$.Type.String,
						value:	$.ajax.RequestType.post
					},
					{
						named:	"return_type",
						type:	$.Type.String,
						value:	$.ajax.ReturnType.object
					}
				);
			}
			catch(e){throw e;}
			
			//
	
			var call = ($np.url + "?" + $.object.join($np.parameters, "&"));		
	
			//if (typeof(this.rpc.calls[call]) == $.NativeType.Object)
			if (call in this.rpc.calls)
			{
				this.rpc.calls[call].canceller();
				
				if (typeof(this.rpc.calls[call].notification_stop) == $.NativeType.Function)
				{
					this.rpc.calls[call].notification_stop();
				}
			}
			
			this.rpc.calls[call] = {};
			
			//
			
			if (typeof($np.notifier) == $.NativeType.Function)
			{
				if ($.lang._is_constructor($np.notifier))
				{
					this.rpc.calls[call].notification_stop = new $np.notifier();
				}
				else
				{
					this.rpc.calls[call].notification_stop = $np.notifier();
				}
			}
			
			//
	
			var canceller = $.ajax.async_call
			(
				$np.method,
				$np.url,
				$np.parameters,
				$np.ignore_error,
				callback,//
				$np.return_type,
				$np.time_out,
				$np.attempts
			);
			
			//
			
			if (call in this.rpc.calls) 
			{
				this.rpc.calls[call].canceller = canceller;
			}
			
			//
			
			return canceller;
		};
		
		this.rpc.calls = {};
		
		
		
		
		
		this.rpc.compose_message = function(message)
		{
			var m = $.String.empty;
			
			if (message.charAt(0) == "+")
			{
				m += "An unexpected error occured";
				m += message.substring(1);
				
				return m;
			}
			
			return message;
		}
	
		
		
		
		
		//
		
		this.init = function()
		{
			$.ui.windows.MessageBox.window_style  = "MessageBox_Body"; //obsolete
			$.ui.windows.MessageBox.message_style = "MessageBox_Text"; //obsolete
			
			$.ui.windows.DialogWindow.styling =
			{
				outer_frame:	"DialogWindow_OuterFrame",
				inner_frame:	"DialogWindow_InnerFrame",
				title:			"DialogWindow_Title",
				body:			"DialogWindow_Body"
			}
			
			//
	
			$.ui.windows.DialogWindow.close_icon = "UI/Common/Images/PortletImages/Titlebar/close.gif";
		}();
		
		this.DocumentProcessing = {cursor:$.element.css.Cursor.wait, color:$.element.css.Color.white, opacity:60};  //replace these value with ApplicationStyle CSS


		this.portlet = new function NAMESPACE__$JICS$portlet()
		{
			//#region variable
			
				var portlet_view_div; //DOMElement:div
			
			//#endregion
			
			//#region method
			
				this.get_div = function()
				{
					if (portlet_view_div === undefined)
					{
						portlet_view_div = document.getElementById(this.client_side_namespace + ".DIVmain");
						
						//
						//assuming the wrapper div (DIVmain) exists
		
						if (portlet_view_div == null)
						{
							throw new $.GenericError("The DIVmain wrapper div does not exist.");
						}
					}
					
					return portlet_view_div;
				}
				
				this.disable = function(style)
				{
					var portlet_view_div;
					
					//
					
					try
					{
						$.vp(arguments, {type:"Object", allow_null:true, optional:function(){style=null;}});
					}
					catch (e)
					{
						throw e;
					}
					
					//
					
					portlet_view_div = this.get_div();
					
					Jenzabar.element.disable(portlet_view_div, style);
				}
				
				this.enable = function()
				{
					var portlet_view_div;
					
					//
					
					portlet_view_div = this.get_div();
					
					Jenzabar.element.enable(portlet_view_div);
				}
			
			//#endregion

		}

		this.RPCall = function $JICS$RPCall__CLASS($np)
		{typeof "$JICS$RPCall__CLASS";
			var $this = this;
			var $base = $.lang.inherit(this, $.ajax.RPCall, arguments);
			
			//#region CONSTRUCTOR
			
				this.error = function(error)
				{
					var feedback = function(button)
					{
						if (button === "Retry")
						{
							$this.execute();
						}
					}
		
					////
					
					var mb; //$.ui.windows.MessageBox
					
					if (error.type === "RPCTimeOut")
					{
						mb = new $.ui.windows.MessageBox
						(
							"Your request could not be made due to an unresponsive server. Please check you connection and try again.",
							feedback,
							[
								{
									caption: "Cancel"
								},
								{
									caption: "Retry"
								}
							]
						);
						
						mb.open(null);
					}
				}
			
			//#endergion

		}
	}

	this.Dictionary = function $Dictionary__CLASS(type)
	{typeof "$Dictionary__CLASS";
		//#region FIELD
		
			var keys	= new Array();
			var values	= new Array();
		
		//#endregion
		
		//#region PROPERTY
			
			this.keys			= null;
			this.values			= null;
			
			this.length			= 0;
			
			this.throw_error	= true;
		
		//#endregion
		
		//#region METHOD
		
			this.recompose = function $Dictionary$recompose()
			{
			}
			
			this.add = function $Dictionary$add(key, value)
			{
				try
				{
					$.vp(arguments, [{type:"String"}, {type:type}]);
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				if (this.has_key(key) === true)
				{
					throw new $.InvalidArgumentError("The key '" + key + "' already exists in the dictionary.");
				}
				
				//
				
				keys.push(key);
				values.push(value);
				
				//
				
				this.keys	= keys;
				this.values	= values;
				
				this.length++;
			}
			
			this.parse_object = function(object)
			{
				var attribute; //String
				
				//
				
				for (attribute in object)
				{
					this.add(attribute, object[attribute]);
				}
			}
			
			this.remove = function $Dictionary$remove(key)
			{
				var position;
				
				//
				
				try
				{
					$.vp(arguments, {type:"String"});
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				position = $.lang.array.index_of(keys, key);
				
				if (position === -1)
				{
					throw new $.InvalidArgumentError("The key '" + key + "' was not found.");
				}
				
				//
				
				keys.splice(position, 1);
				values.splice(position, 1);
				
				//
				
				this.keys	= keys;
				this.values	= values;
				
				this.length--;
			}
			
			/*
			this.remove_by_value = function $Dictionary$remove_by_value(value)
			{
			}
			
			this.remove_by_position = function $Dictionary$remove_by_position(position)
			{
				try
				{
					//bounds!
				}
				catch (e)
				{
					throw e;
				}
			}
			*/
			
			this.get_enumerator = function $Dictionary$get_enumerator()
			{
				var obj;	//Object
				var i;		//Number
				
				//
				
				obj = new Object();
				
				for (i=0; i<keys.length; i++)
				{
					obj[keys[i]] = null;
				}
				
				return obj; 
			}
			
			this.has_key = function $Dictionary$has_key(key)
			{
				return $.lang.array.contains(keys, key);
			}
			
			this.get_value = function $Dictionary$get_value(key)
			{
				var position; //Number
				
				//
				
				try
				{
					$.vp(arguments, {type:"String"});
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				position = $.lang.array.index_of(keys, key);
				
				if (position > -1)
				{
					return values[position]
				}
				else
				{
					if (this.throw_error === true)
					{
						throw new $.InvalidArgumentError("The key '" + key + "' was not found in the dictionary.");
					}
					else
					{
						return undefined;
					}
				}			
			}
			
			this.get_key = function $Dictionary$get_key(value)
			{
				var position; //Number
				
				//
				
				try
				{
					$.vp(arguments, {type:type});
				}
				catch (e)
				{
					throw e;
				}
				
				//
				
				position = $.lang.array.index_of(values, value);
				
				if (position > -1)
				{
					return keys[position]
				}
				else
				{
					if (this.throw_error === true)
					{
						throw new $.InvalidArgumentError("The value '" + value + "' was not found in the dictionary.");
					}
					else
					{
						return undefined;
					}
				}			
			}
		
		//#endregion
		
		//#region CONSTRUCTOR
		
			$.vp(arguments, {type:["String", "Array"], optional:function(){type="Object";}});
		
		//#endregion

	}

	this.regex = new function NAMESPACE__$regex()
	{
		this.exec = function(text, regex1, regex2)
		{
			var result1; //String
			var result2; //String
			
			//
			
			result1 = regex1.exec(text);
			
			if ((result1 === null) || (result1.length > 1)) return null;
			
			result2 = regex2.exec(result1[0]);
			
			if ((result2 === null) || (result2.length > 1)) return null;
			
			return result2[0];
		}

	}
	new this.element.EventMetabase();
	

	this.ErrorBase.errors = new Array();	

	//#region FIELD
	
		var LIB_NAME		= "JCSFL";
		
		//var $				= this;
		
	//#endregion
	
	//#region ROUTINE
	
		function GET_LIB_TYPE(type)
		{
			return type.replace("$", LIB_NAME);
		}
	
	//#endregion
	
	
	this.NativeType = new function()
	{
		this.undefined	= "undefined";
		this.object		= "object";
		this.bboolean	= "boolean";
		this.number		= "number";
		this.string		= "string";
		this.ffunction	= "function";
		
		//
		
		this.Undefined	= "undefined";
		this.Object		= "object";
		this.Boolean	= "boolean";
		this.Number		= "number";
		this.String		= "string";
		this.Function	= "function";
	}
	
	this.Type = new function()
	{
		this.string			= "String";
		this.number			= "Number";
		this.object			= "Object";
		this.ffunction		= "Function";
		this.bboolean		= "Boolean";
		this.array			= "Array";
		
		//
		
		this.String					= "String";
		this.Number					= "Number";
		this.Object					= "Object";
		this.Function				= "Function";
		this.Boolean				= "Boolean";
		this.Array					= "Array";
		
		this.DOMDocument            = "DOMDocument";
		
		this.DOMNodeList			= "DOMNodeList";
		
		this.DOMElement				= "DOMElement";
		this.DOMElementContainer	= "DOMElement:Container";
	}
	
	this.nl = "\n"
	
	
	
	
	
	//#region PROPERTY
	
		this.max_z_index = 2147483647;
		
		this.current_dialog_window = null;
		
		this.relative_to_portal = "../../../";	//move to JICS
		
		this.path_images = "ui/common/images/"; //move to JICS
		
		
	//#endregion
	
	//#region METHOD
	
		this.last_error = function $last_error()
		{
			return this.ErrorBase.errors[this.ErrorBase.errors.length-1];
		}
		
		this.test_error = function $test_error(object)
		{
			if ($.lang.is_error(object) === true)
			{
				if (("__constructor" in object) && (object.__constructor.constructor === $.ErrorBase))
				{
					return object.type; 
				}
			}
			
			return null;
		}
	
	//#endregion
	
	
	$.ui.CachedControl.load = function load(url, file_name, version, name, load_callback)
	{	
		$.ui.caching.load_object.apply(null, arguments);
	}

	//$.ui.CachedWindow.load = function load(url, file_name, version, name, load_callback)
	//{	
	//	$.ui.caching.load_object.apply(null, arguments);
	//}
	
	/*
	$.ui.CachedControl.load_html = function(control_constructor, file_name)
	{
		$.ui.caching.load_html.apply(null, arguments);		
	}
	
	$.ui.CachedWindow.load_html = function(control_constructor, file_name)
	{
		$.ui.caching.load_html.apply(null, arguments);		
	}
	*/
	
	
	$.ui.controls.Chart.ChartSeriesType = new function $ui$controls$Chart$ChartSeriesType__ENUM()
	{
		this.Point				= 0;
		this.FastPoint			= 1;
		this.Bubble				= 2;
		this.Line				= 3;
		this.Spline				= 4;
		this.StepLine			= 5;
		this.FastLine			= 6;
		this.Bar				= 7;
		this.StackedBar			= 8;
		this.StackedBar100		= 9;
		this.Column				= 10;
		this.StackedColumn		= 11;
		this.StackedColumn100	= 12;
		this.Area				= 13;
		this.SplineArea			= 14;
		this.StackedArea		= 15;
		this.StackedArea100		= 16;
		this.Pie				= 17;
		this.Doughnut			= 18;
		this.Stock				= 19;
		this.Candlestick		= 20;
		this.Range				= 21;
		this.SplineRange		= 22;
		this.RangeBar			= 23;
		this.RangeColumn		= 24;
		this.Radar				= 25;
		this.Polar				= 26;
		this.ErrorBar			= 27;
		this.BoxPlot			= 28;
		this.Renko				= 29;
		this.ThreeLineBreak		= 30;
		this.Kagi				= 31;
		this.PointAndFigure		= 32;
		this.Funnel				= 33;
		this.Pyramid			= 34;
	}
	$.ui.controls.Chart.AxisEnabled = new function $ui$controls$Chart$AxisEnabled__ENUM()
	{
		this.Auto	= 0;
		this.True	= 1;
		this.False	= 2;
	}	
	
	$.element.NodeType = new function $element$NodeTypes__ENUM()
	{
		this.ElementNode					= 1;
		this.AttributeNode					= 2;
		this.TextNode						= 3;
		this.CDataSectionNode				= 4;
		this.EntityReferenceNode			= 5;
		this.EntityNode						= 6;
		this.ProcessingInstructionNode		= 7;
		this.CommentNode					= 8;
		this.DocumentNode					= 9;
		this.DocumentTypeNode				= 10;
		this.DocumentFragmentNode			= 11;
		this.NotationNode					= 12;
	}
	
	//$.ui.windows.MessageBox.style = null;
	
	
	
	
	/*		
	this.m$create_event = function(obj, event_name, event_handler, event_function)
	{
		obj["_" + event_name]		= event;
		obj["add_" + event_name]	= add;
		obj["remove_" + event_name] = remove;
		
		//
		
		function add(handler)
		{
			this.get_events().addHandler(event_name, handler);
		}
		
		function remove(handler)
		{
			this.get_events().removeHandler(event_name, handler);
		}
		
		function event()
		{
			var handler;
			
			//
			
			if (typeof(event_function) === "undefined")
			{
				//if (eval(obj[event_name + "_event").call(obj) === false) return;
			}
			else
			{
				if (event_function.call(obj) === false) return;
			}
			
			//
			
			handler = this.get_events().getHandler(event_name);
			
			if (handler != null)
			{
				handler(this, new event_handler(arguments[0]));
			}		
		}
	}
	*/
	
	
	$.ui.Imitator.display = function(element, reference_element)
	{
		//TODO: refine 
		
		if ($.element.is_displayed(reference_element))
		{
			if (element.style.display !== "")
			{			
				element.style.display = "";
			}
		}
		else
		{
			if (element.style.display !== "none")
			{
				element.style.display = "none";
			}
		}
	}
	
	

	window.g$ = function(id){return document.getElementById(id);};
	
	window.c$ = $.element.create;
	window.f$ = $.element.find;
	window.m$ = $.element.modify

	
	$.ui.controls.Chart.url = "UI/Pages/Chart/Chart.aspx";	
	
	$.String.empty = "";
	
    window.namespace =
    {
        create:
        function(ns, func)
        {
            if (!window.Jenzabar)
            {
                window.Jenzabar = {};
            }
            
            //
        
            var ns = ns.split(".");
            
            if (ns[0] == "Jenzabar")
            {
                ns.shift();
            }
            
            var co = window.Jenzabar;
            
            for (var i=0; i<ns.length; i++)
            {
                if (co[ns[i]]) continue;
                
                var n = {};
                
                co[ns[i]] = n;
                
                co = n;
            }
            
            if (func == null) return co;
            
            co.OnClick = func;
        }
        ,
        exists:
        function(ns)
        {
            try
            {
                eval(ns);
            }
            catch (e)
            {
                return false;
            }
            
            return true;
        }
    };	
}
