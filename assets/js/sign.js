$sign = {};
// console.debug('inc-sign');


$sign.capture_signature = function(textbox, canvas, box, trash){

//textbox
    var sign = document.getElementById(textbox);
    var cord;
    cord = sign.value.split(",");
//canvas    
    var cap = document.getElementById(canvas);
    var ctx = cap.getContext("2d");
    
    for (i=0; i<cord.length; i+=2){
        if (cord[i] == "/"){
            
            ctx.moveTo(cord[i+2],cord[i+3]);
            ctx.lineTo(cord[i+2],cord[i+3]);
            ctx.stroke();
        }else{
            ctx.moveTo(cord[i],cord[i+1]);
            ctx.lineTo(cord[i+2],cord[i+3]);
            ctx.stroke();
        }
        
    }
		//alert(cap+":"+cord);
		//canvas overlay    
    $("#"+box).css({"z-index":"504"});
	$("#"+trash).hide();
};

$sign.clear_signature = function(canvas,textbox) {
  document.getElementById(textbox).value = "";
  var s = document.getElementById(canvas);
  var w = s.width;
  s.width = 10;
  s.width = w;
};



//------------------------------------------------------------------------------

/**
 *  SIGNATURE JS functions used for EForm
 *
 */
var cord = new Array();
var tcord = new Array();
 
/*$(document).ready(function () {
  initialize('obj_sign1','obj_cord1');
  initialize('obj_sign2','obj_cord2');
});
*/ 
 
function sign_initialize(canvas, textbox) {
   // get references to the canvas element as well as the 2D drawing context
   var signtext = document.getElementById(textbox);
   var sigCanvas = document.getElementById(canvas);
   var context = sigCanvas.getContext("2d");
      context.strokeStyle = 'Black';

   // This will be defined on a TOUCH device such as iPad or Android, etc.
   var is_touch_device = 'ontouchstart' in document.documentElement;

   if (is_touch_device) {
      // create a drawer which tracks touch movements
      var drawer = {
         isDrawing: false,
         touchstart: function (coors) {
            context.beginPath();
            cord.push(coors.x +','+ coors.y);
            context.moveTo(coors.x, coors.y);
            this.isDrawing = true;
         },
         touchmove: function (coors) {
            if (this.isDrawing) {
            cord.push(coors.x +','+ coors.y);
               context.lineTo(coors.x, coors.y);
               context.stroke();
            }
         },
         touchend: function (coors) {
            if (this.isDrawing) {
               this.touchmove(coors);
               this.isDrawing = false;
                  cord.push("/");
                  cord.push("/");
            }
         }
      };

      // create a function to pass touch events and coordinates to drawer
      function draw(event) {

         // get the touch coordinates.  Using the first touch in case of multi-touch
         var coors = {
            x: event.targetTouches[0].pageX,
            y: event.targetTouches[0].pageY
         };

         // Now we need to get the offset of the canvas location
         var obj = sigCanvas;

         if (obj.offsetParent) {
            // Every time we find a new object, we add its offsetLeft and offsetTop to curleft and curtop.
            do {
               coors.x -= obj.offsetLeft;
               coors.y -= obj.offsetTop;
            }
    // The while loop can be "while (obj = obj.offsetParent)" only, which does return null
    // when null is passed back, but that creates a warning in some editors (i.e. VS2010).
            while ((obj = obj.offsetParent) != null);
         }

         // pass the coordinates to the appropriate handler
         drawer[event.type](coors);
      }


      // attach the touchstart, touchmove, touchend event listeners.
      sigCanvas.addEventListener('touchstart', draw, false);
      sigCanvas.addEventListener('touchmove', draw, false);
      sigCanvas.addEventListener('touchend', function (coors) {
      cord.push("/");
      cord.push("/,");
      signtext.value += cord;
      localStorage.setItem(signtext.id,signtext.value);
      cord = [];
      }, false);

      // prevent elastic scrolling
      sigCanvas.addEventListener('touchmove', function (event) {
         event.preventDefault();
      }, false); 
   }
   else {

      // start drawing when the mousedown event fires, and attach handlers to
      // draw a line to wherever the mouse moves to
      $("#"+canvas).mousedown(function (mouseEvent) {
         var position = getPosition(mouseEvent, sigCanvas);
          cord.push(position.X);
          cord.push(position.Y);
          //alert(position.X +':'+ position.Y);
         context.moveTo(position.X, position.Y);
         context.beginPath();

         // attach event handlers
         $(this).mousemove(function (mouseEvent) {
            drawLine(mouseEvent, sigCanvas, context);
         }).mouseup(function (mouseEvent) {
          //alert("array");
          //document.write(cord.join("\n"));
          cord.push("/");
          cord.push("/,");
          finishDrawing(mouseEvent, sigCanvas, context);
          signtext.value += cord;
          localStorage.setItem(signtext.id,signtext.value);
          console.log(signtext.id+"_dateTimeStart");
          if (!localStorage.getItem(signtext.id+"_dateTimeStart")) localStorage.setItem(signtext.id+"_dateTimeStart",$common.getDateTime());
          //console.log($common.getDateTime());
          cord = [];
         }).mouseout(function (mouseEvent) {
            finishDrawing(mouseEvent, sigCanvas, context);
            cord.push("/");
            cord.push("/,");
         });
      });

   }
}


// works out the X, Y position of the click inside the canvas from the X, Y position on the page
function getPosition(mouseEvent, sigCanvas) {
   var x, y;
   if (mouseEvent.pageX != undefined && mouseEvent.pageY != undefined) {
      x = mouseEvent.pageX;
      y = mouseEvent.pageY;
   } else {
      x = mouseEvent.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
      y = mouseEvent.clientY + document.body.scrollTop + document.documentElement.scrollTop;
   }

   return { X: x - sigCanvas.offsetLeft, Y: y - sigCanvas.offsetTop };
}

 
// draws a line to the x and y coordinates of the mouse event inside
// the specified element using the specified context
function drawLine(mouseEvent, sigCanvas, context) {
   var position = getPosition(mouseEvent, sigCanvas);
          cord.push(position.X);
          cord.push(position.Y);
      //alert(position.X);
      //alert(position.Y);
   context.lineTo(position.X, position.Y);
      context.stroke();

}

// draws a line from the last coordiantes in the path to the finishing
// coordinates and unbind any event handlers which need to be preceded
// by the mouse down event
function finishDrawing(mouseEvent, sigCanvas, context) {
   // draw the line to the finishing coordinates
  //drawLine(mouseEvent, sigCanvas, context);

   context.closePath();

   // unbind any events which could draw
   $(sigCanvas).unbind("mousemove")
               .unbind("mouseup")
               .unbind("mouseout");
}
