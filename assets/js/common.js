$common = {};
// console.debug('inc-common');
$common.console = function(mode,msg) {
  var debug = 1;
  if (!debug) {
    return;
  }
  
  if(mode==='log') {
    console.log(msg);
  }
  
  if(mode==='debug') {
    console.debug(msg);
  }
};

$common.getDate = function() {
	console.debug('getDateTime');
	var now     = new Date(); 
	var year    = now.getFullYear();
	var month   = now.getMonth()+1; 
	var day     = now.getDate();
	if(month.toString().length === 1) {
			var month = '0'+month;
	}
	if(day.toString().length === 1) {
			var day = '0'+day;
	}   
	
	var dateTime = year+'-'+month+'-'+day;   
	return dateTime;
};

$common.getDateTime = function() {
	console.debug('getDateTime');
	var now     = new Date(); 
	var year    = now.getFullYear();
	var month   = now.getMonth()+1; 
	var day     = now.getDate();
	var hour    = now.getHours();
	var minute  = now.getMinutes();
	var second  = now.getSeconds(); 
	if(month.toString().length === 1) {
			var month = '0'+month;
	}
	if(day.toString().length === 1) {
			var day = '0'+day;
	}   
	if(hour.toString().length === 1) {
			var hour = '0'+hour;
	}
	if(minute.toString().length === 1) {
			var minute = '0'+minute;
	}
	if(second.toString().length === 1) {
			var second = '0'+second;
	}   
	
	var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;   
	return dateTime;
};

$common.formatDateTime = function(stringDate) {
	console.debug('formatDateTime');
  //console.debug(stringDate.toDateString());
	var now     = new Date(stringDate); 
  var tzo     = now.getTimezoneOffset();
  
  console.log(now);
	var year    = now.getFullYear();
	var month   = now.getMonth()+1; 
	var day     = now.getDate();
	var hour    = now.getHours();
	var minute  = now.getMinutes();
	var second  = now.getSeconds(); 
  
  //adjust hour based on timezone
  hour = hour + (tzo/60);
  
	if(month.toString().length === 1) {
			var month = '0'+month;
	}
	if(day.toString().length === 1) {
			var day = '0'+day;
	}   
	if(hour.toString().length === 1) {
			var hour = '0'+hour;
	}
	if(minute.toString().length === 1) {
			var minute = '0'+minute;
	}
	if(second.toString().length === 1) {
			var second = '0'+second;
	}   
	
	var dateTime = year+'-'+month+'-'+day+' '+hour+':'+minute+':'+second;   
	return dateTime;
};

$common.formatDate1 = function(stringDate) {
	console.debug('formatDate1');
  //console.debug(stringDate.toDateString());
	var now     = new Date(stringDate);
  
	var year    = now.getFullYear();
	var month   = now.getMonth(); 
	var day     = now.getDate();
  
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var dateTime = day+'-'+months[month]+'-'+year;   
	return dateTime;
};

$common.formatDate2 = function(stringDate) {
	console.debug('formatDate1');
  //console.debug(stringDate.toDateString());
	var now     = new Date(stringDate);
  
	var year    = now.getFullYear();
	var month   = now.getMonth(); 
	var day     = now.getDate();
  
  var months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
	var dateTime = months[month]+' '+day+', '+year;   
	return dateTime;
};


$common.validateFields = function(fields) {
	var arrayLength = fields.length;
  var passed=0;
  for (var i = 0; i < arrayLength; i++) {
    //console.log(fields[i]);
    if($('#'+fields[i]).val()==="") {
      var caption = $('#'+fields[i]).attr("caption");
      //$common.alert("'"+caption + "' is a required field.");
      alert("Please fill up '"+caption + "'.");
      $('#'+fields[i]).focus();
      return 0;
    }
    else {
      passed++;
    }
  }
  return passed;
};


$common.getResults = function(obj) {
	var result = '';
	for ( property in obj ) {
		var prop = "";
		if(property.indexOf("obj_") ===-1) {
			//prop = "obj_";
		}
		result += prop+property + "::==";
		result += obj[property] + ";;";
	}
	return result;
};


$common.resetForm = function() {
	console.debug('resetForm');
	
	var inputs = document.getElementsByTagName("input");
	for (var i = 0; i < inputs.length; i++) {
		if(inputs[i].type==="radio" || inputs[i].type==="checkbox") {
			inputs[i].checked = false;
		}
		else {
			inputs[i].value = "";
		}
	}
	var selects = document.getElementsByTagName("select");
	for (var i = 0; i < selects.length; i++) {
		selects[i].value = "";
	}
	var textareas = document.getElementsByTagName("textarea");
	for (var i = 0; i < textareas.length; i++) {
		textareas[i].value = "";
	}
}; 


$common.resetFormExcFlds = function(excFields) {
	console.debug('resetFormExcFlds');
	
  var inputs = document.getElementsByTagName("input");
  for (var i = 0; i < inputs.length; i++) {
    if(excFields.indexOf(inputs[i].id) < 0){
      if(inputs[i].type==="radio" || inputs[i].type==="checkbox") {
        inputs[i].checked = false;
      }
      else {
        inputs[i].value = "";
      }
    }
  }
  var selects = document.getElementsByTagName("select");
  for (var i = 0; i < selects.length; i++) {
    if(excFields.indexOf(selects[i].id) < 0){
      selects[i].value = "";
    }
  }
  var textareas = document.getElementsByTagName("textarea");
  for (var i = 0; i < textareas.length; i++) {
    if(excFields.indexOf(textareas[i].id) < 0){
      textareas[i].value = "";
    }
  }
		
};


$common.removeElement = function(node) {
  var elem = document.getElementById(node);
	elem.remove();
};


$common.positionCanvas = function(withSign,canvas,trash,addleft,box) {
  if (addleft===undefined) addleft=0;
  var ws_left = $('#'+withSign).position().left;
  var ws_width = $('#'+withSign).width();
  var obj_width = $('#'+canvas).width();
  console.log(withSign+': '+ws_left);
  var new_left = ws_width - obj_width + addleft;
  $('#'+canvas).css({left: ws_left+(new_left/2), position:'absolute'});
  var obj_left_new = $('#'+canvas).position().left;
  $('#'+trash).css({left: obj_left_new+obj_width+2, position:'absolute'});
  if (addleft!==undefined) {
	$('#'+box).css({left: obj_left_new, position:'absolute'});
  }
};


$common.positionCanvas2 = function(canvas, textbox) {
	var tp = $("#container_"+canvas).offset().top;
	var lft = $("#container_"+canvas).offset().left+5;
	var canvas_top = tp+18;
	var canvas_left = lft+24;
	$("#"+canvas).css({top: canvas_top, left: canvas_left, position:'absolute', display:'inline'});
	$("#"+canvas+"_box").css({top: canvas_top, left: canvas_left, position:'absolute', display:'inline'});
	console.log('canvas_top: '+canvas_top);
	//alert('canvas_left: '+canvas_left);
	
	var tp_c = $("#container_"+canvas).height();
	var lft_c = $("#"+canvas).width();
	var obj = document.getElementById(canvas);
	console.log(obj.offsetLeft);
	//top:obj.offsetTop, left:obj.offsetLeft,
	var x_top = -tp_c+18;
	var x_left = 5;
	$("#"+canvas+"_trash").css({ position:'relative', top:x_top, left:x_left});
}


$common.setValue = function(elm,value) {
/*  if(document.getElementById(elm).type==="radio" && document.getElementById(elm).value == value){
	document.getElementById(elm).checked = true;
	document.getElementById(elm).readOnly=true;
  }
  if(document.getElementById(elm).type==="checkbox" && value == "true") {
	inputs[i].checked = true;
  } */
  //alert("setValue");
  document.getElementById(elm).value = value;
};

$common.getValue = function(elm) {
//alert("getValue");
  return document.getElementById(elm).value;
};

$common.getText = function(elm) {
//alert("getText");
  var e = document.getElementById(elm);
  return e.options[e.selectedIndex].text;
};

$common.setValueFromObj = function(to,from) {
//alert("setValueFromObj");
  $common.setValue(to,$common.getValue(from));
};

$common.setValueFromObjText = function(to,from) {
//alert("setValueFromObjText");
  $common.setValue(to,$common.getText(from));
};


$common.objSelect = function(id,json_str) {
  //alert(id);alert(json_str);
  
  var $el = $("#"+id);
  //alert($el.text());
  $el.empty(); // remove old options
  //alert('mt');
  $el.append($("<option></option>").attr("value", '').text('---'));
  //alert('test');
  jQuery.each(json_str, function(i, val) {
    //alert(val["code"]);
    $el.append($("<option></option>").attr("value", val["code"]).text(val["desc"]));
    //alert(val["desc"]);
    /*var spec = $("#obj_specialty_desc").val();
    //alert(spec);
    if(spec==val["specialty_description"]) {
      //alert(spec);
      $el.append($("<option selected></option>").attr("value", val["specialty_code"]).text(val["specialty_description"]));
    }
    else {
      $el.append($("<option></option>").attr("value", val["specialty_code"]).text(val["specialty_description"]));
    }*/
  });
};


$common.onInputNumber = function(attrSum,idTotal) {
  $common.console('debug', 'onInputNumber');
  
  var ttl=0;
  $("input["+attrSum+"]").each( function () {
    var qty = $(this).val();
    qty = Number(qty);
    ttl = ttl+qty;
  });
  $('#'+idTotal).val(ttl);
  $common.console('debug', 'Sum: '+ttl);
};

$common.alert = function(msg) {
  console.log(msg);
  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(msg);
  iframe.parentNode.removeChild(iframe);  
};

$common.debug = function(msg) {
  console.log(msg);
  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  window.frames[0].window.alert(msg);
  iframe.parentNode.removeChild(iframe);  
};

$common.confirm = function(msg) {
  console.log(msg);
  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("src", 'data:text/plain,');
  document.documentElement.appendChild(iframe);
  var r = window.frames[0].window.confirm(msg);
  iframe.parentNode.removeChild(iframe);  
  return r;
};



/**
 * Function to reset scale when submit button is tapped
 */
$common.resetScale = function(obj) {
  document.getElementById(obj).focus();
  var sViewport = '<meta name="viewport" content="width=1024, initial-scale=1, minimum-scale=1, maximum-scale=1" />';
  var jViewport = $('meta[name="viewport"]');
  if (jViewport.length > 0) {
    jViewport.replaceWith(sViewport);
  }
  else {
    $('head').append(sViewport);
  }
};


var CommonUrl = function () {
  // This function is anonymous, is executed immediately and 
  // the return value is assigned to QueryString!
  var query_string = {};
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i=0;i<vars.length;i++) {
    var pair = vars[i].split("=");
    	// If first entry with this name
    if (typeof query_string[pair[0]] === "undefined") {
      query_string[pair[0]] = pair[1];
    	// If second entry with this name
    } else if (typeof query_string[pair[0]] === "string") {
      var arr = [ query_string[pair[0]], pair[1] ];
      query_string[pair[0]] = arr;
    	// If third or later entry with this name
    } else {
      query_string[pair[0]].push(pair[1]);
    }
  } 
    return query_string;
} ();