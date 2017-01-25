    /**
    * o------------------------------------------------------------------------------o
    * | This file is part of the RGraph package - you can learn more at:             |
    * |                                                                              |
    * |                          http://www.rgraph.net                               |
    * |                                                                              |
    * | This package is licensed under the RGraph license. For all kinds of business |
    * | purposes there is a small one-time licensing fee to pay and for non          |
    * | commercial  purposes it is free to use. You can read the full license here:  |
    * |                                                                              |
    * |                      http://www.rgraph.net/LICENSE.txt                       |
    * o------------------------------------------------------------------------------o
    */
    
    /**
    * This is a library of a few functions that make it easier to do
    * effects like fade-ins or eaxpansion.
    */

    /**
    * Initialise the various objects
    */
    if (typeof(RGraph) == 'undefined') RGraph = {isRGraph:true,type:'common'};
    RGraph.Effects = {}
    RGraph.Effects.Fade           = {}
    RGraph.Effects.jQuery         = {}
    RGraph.Effects.jQuery.HBlinds = {}
    RGraph.Effects.jQuery.VBlinds = {}
    RGraph.Effects.jQuery.Slide   = {}
    RGraph.Effects.Pie            = {}
    RGraph.Effects.Bar            = {}
    RGraph.Effects.HBar           = {}
    RGraph.Effects.Line           = {}
    RGraph.Effects.Fuel           = {}


    /**
    * Fadein
    * 
    * This function simply uses the CSS opacity property - initially set to zero and
    * increasing to 1 over the period of 1 second
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.Fade.In = function (obj)
    {
        var canvas = obj.canvas;

        // Initially the opacity should be zero
        canvas.style.opacity = 0;
        
        // Draw the chart
        RGraph.Clear(obj.canvas);
        obj.Draw();
        
        // Now fade the chart in
        for (var i=1; i<=10; ++i) {
            setTimeout('document.getElementById("' + canvas.id + '").style.opacity = ' + (i * 0.1), i * 100);
        }
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Fadeout
    * 
    * This function is a reversal of the above function - fading out instead of in
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.Fade.Out = function (obj)
    {
        var canvas = obj.canvas;
        
        // Draw the chart
        RGraph.Clear(obj.canvas);
        obj.Draw();
        
        // Now fade the chart in
        for (var i=10; i>=0; --i) {
            setTimeout('document.getElementById("' + canvas.id + '").style.opacity = ' + (i * 0.1), (10 - i) * 50);
        }
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Expand
    * 
    * This effect is like the tooltip effect of the same name. I starts in the middle
    * and expands out to full size.
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.jQuery.Expand = function (obj)
    {
        // Check for jQuery
        if (typeof(jQuery) == 'undefined') {
            alert('[ERROR] Could not find jQuery object - have you included the jQuery file?');
        }
        
        var canvas = obj.canvas;
        
        if (!canvas.__div_placeholder__) {
            var div    = RGraph.Effects.ReplaceCanvasWithDIV(canvas);
            canvas.__div_placeholder__ = div;
        } else {
            div = canvas.__div_placeholder__;
        }

        canvas.style.position = 'relative';
        canvas.style.top = (canvas.height / 2) + 'px';
        canvas.style.left = (canvas.width / 2) + 'px';


        canvas.style.width = 0;
        canvas.style.height = 0;


        canvas.style.opacity = 0;

        RGraph.Clear(obj.canvas);
        obj.Draw();

        $('#' + obj.id).animate({
            opacity: 1,
            width: parseInt(div.style.width) + 'px',
            height: parseInt(div.style.height) + 'px',
            left: '-=' + (obj.canvas.width / 2) + 'px',
            top: '-=' + (obj.canvas.height / 2) + 'px'
        }, 1000);
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * A function used to replace the canvas witha Div, which inturn holds the canvas. This way the page
    * layout doesn't shift in the canvas is resized.
    * 
    * @param object canvas The canvas to replace.
    */
    RGraph.Effects.ReplaceCanvasWithDIV  = function (canvas)
    {
        if (!canvas.replacementDIV) {
            // Create the place holder DIV
            var div    = document.createElement('DIV');
                div.style.width = canvas.width + 'px';
                div.style.height = canvas.height + 'px';
                div.style.cssFloat = canvas.style.cssFloat;
                div.style.left = canvas.style.left;
                div.style.top = canvas.style.top;
                //div.style.position = canvas.style.position;
                div.style.display = 'inline-block';
            canvas.parentNode.insertBefore(div, canvas);
            
    
            // Remove the canvas from the document
            canvas.parentNode.removeChild(canvas);
            
            // Add it back in as a child of the place holder
            div.appendChild(canvas);
            
            // Reset the positioning information on the canvas
            canvas.style.position = 'relative';
            canvas.style.left = (div.offsetWidth / 2) + 'px';
            canvas.style.top = (div.offsetHeight / 2) + 'px';
            canvas.style.cssFloat = '';
        
            // Add a reference to the canvas to the DIV so that repeated plays of the anumation
            // don't keep replacing the canvas with a new DIV
            canvas.replacementDIV = div;

        } else {
            var div = canvas.replacementDIV;
        }
        
        return div;
    }


    /**
    * Snap
    * 
    * Similar to the tooltip effect of the same name, this moves the canvas in from the top left corner
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.jQuery.Snap = function (obj)
    {
        var delay = 500;

        var div = RGraph.Effects.ReplaceCanvasWithDIV(obj.canvas);
        
        obj.canvas.style.position = 'absolute';
        obj.canvas.style.top = 0;
        obj.canvas.style.left = 0;
        obj.canvas.style.width = 0;
        obj.canvas.style.height = 0;
        obj.canvas.style.opacity = 0;
        
        var targetLeft   = div.offsetLeft;
        var targetTop    = div.offsetTop;
        var targetWidth  = div.offsetWidth;
        var targetHeight = div.offsetHeight;

        RGraph.Clear(obj.canvas);
        obj.Draw();

        $('#' + obj.id).animate({
            opacity: 1,
            width: targetWidth + 'px',
            height: targetHeight + 'px',
            left: targetLeft + 'px',
            top: targetTop + 'px'
        }, delay);
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay + 50);
        }
    }


    /**
    * Reveal
    * 
    * This effect issmilat to the Expand effect - the canvas is slowly revealed from
    * the centre outwards
    * 
    * @param object obj The chart object
    */
    RGraph.Effects.jQuery.Reveal = function (obj)
    {
        var opts   = arguments[1] ? arguments[1] : null;
        var delay  = 1000;
        var canvas = obj.canvas;
        var xy     = RGraph.getCanvasXY(obj.canvas);
        
        var divs = [
                    ['reveal_left', xy[0], xy[1], obj.canvas.width  / 2, obj.canvas.height],
                    ['reveal_right',(xy[0] + (obj.canvas.width  / 2)),xy[1],(obj.canvas.width  / 2),obj.canvas.height],
                    ['reveal_top',xy[0],xy[1],obj.canvas.width,(obj.canvas.height / 2)],
                    ['reveal_bottom',xy[0],(xy[1] + (obj.canvas.height  / 2)),obj.canvas.width,(obj.canvas.height / 2)]
                   ];
        
        for (var i=0; i<divs.length; ++i) {
            var div = document.createElement('DIV');
                div.id = divs[i][0];
                div.style.width =  divs[i][3]+ 'px';
                div.style.height = divs[i][4] + 'px';
                div.style.left   = divs[i][1] + 'px';
                div.style.top   = divs[i][2] + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = opts && typeof(opts['color']) == 'string' ? opts['color'] : 'white';
            document.body.appendChild(div);
        }

        RGraph.Clear(obj.canvas);
        obj.Draw();

        $('#reveal_left').animate({width: 0}, delay);
        $('#reveal_right').animate({left: '+=' + (obj.canvas.width / 2),width: 0}, delay);
        $('#reveal_top').animate({height: 0}, delay);
        $('#reveal_bottom').animate({top: '+=' + (obj.canvas.height / 2),height: 0}, delay);
        
        // Remove the DIVs from the DOM 100ms after the animation ends
        setTimeout(
            function ()
            {
                document.body.removeChild(document.getElementById("reveal_top"))
                document.body.removeChild(document.getElementById("reveal_bottom"))
                document.body.removeChild(document.getElementById("reveal_left"))
                document.body.removeChild(document.getElementById("reveal_right"))
            }
            , delay);
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], delay + 50);
        }
    }


    /**
    * Horizontal Blinds (open)
    * 
    * @params object obj The graph object
    */
    RGraph.Effects.jQuery.HBlinds.Open = function (obj)
    {
        var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = RGraph.getCanvasXY(canvas);
        var height = canvas.height / 5;
        
        /**
        * First draw the chart
        */
        RGraph.Clear(obj.canvas);
        obj.Draw();

        for (var i=0; i<5; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  canvas.width + 'px';
                div.style.height = height + 'px';
                div.style.left   = xy[0] + 'px';
                div.style.top   = (xy[1] + (canvas.height * (i / 5))) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({height: 0}, delay);
        }

        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Horizontal Blinds (close)
    * 
    * @params object obj The graph object
    */
    RGraph.Effects.jQuery.HBlinds.Close = function (obj)
    {
        var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = RGraph.getCanvasXY(canvas);
        var height = canvas.height / 5;

        for (var i=0; i<5; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  canvas.width + 'px';
                div.style.height = 0;
                div.style.left   = xy[0] + 'px';
                div.style.top   = (xy[1] + (canvas.height * (i / 5))) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({height: height + 'px'}, delay);
        }
        
        setTimeout(function () {RGraph.Clear(obj.canvas);}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Vertical Blinds (open)
    * 
    * @params object obj The graph object
    */
    RGraph.Effects.jQuery.VBlinds.Open = function (obj)
    {
        var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = RGraph.getCanvasXY(canvas);
        var width  = canvas.width / 10;
        
        /**
        * First draw the chart
        */
        RGraph.Clear(obj.canvas);
        obj.Draw();

        for (var i=0; i<10; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  width + 'px';
                div.style.height = canvas.height + 'px';
                div.style.left   = (xy[0] + (canvas.width * (i / 10))) + 'px';
                div.style.top   = (xy[1]) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({width: 0}, delay);
        }

        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_5'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_6'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_7'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_8'));}, delay + 100);
        setTimeout(function () {document.body.removeChild(document.getElementById('blinds_9'));}, delay + 100);
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Vertical Blinds (close)
    * 
    * @params object obj The graph object
    */
    RGraph.Effects.jQuery.VBlinds.Close = function (obj)
    {
        var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 1000;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = RGraph.getCanvasXY(canvas);
        var width  = canvas.width / 10;
        
        // Don't draw the chart

        for (var i=0; i<10; ++i) {
            var div = document.createElement('DIV');
                div.id = 'blinds_' + i;
                div.style.width =  0;
                div.style.height = canvas.height + 'px';
                div.style.left   = (xy[0] + (canvas.width * (i / 10))) + 'px';
                div.style.top   = (xy[1]) + 'px';
                div.style.position = 'absolute';
                div.style.backgroundColor = color;
            document.body.appendChild(div);

            $('#blinds_' + i).animate({width: width}, delay);
        }

        setTimeout(function () {RGraph.Clear(obj.canvas, color);}, delay + 100);

        if (opts['remove']) {
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_0'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_1'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_2'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_3'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_4'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_5'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_6'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_7'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_8'));}, delay + 100);
            setTimeout(function () {document.body.removeChild(document.getElementById('blinds_9'));}, delay + 100);
        }
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Pie chart grow
    * 
    * Gradually increases the pie chart radius
    * 
    * @params object obj The graph object
    */
    RGraph.Effects.Pie.Grow = function (obj)
    {
        var canvas  = obj.canvas;
        var opts   = arguments[1] ? arguments[1] : [];
        var delay  = 250;
        var frames = 25;
        var color  = opts['color'] ? opts['color'] : 'white';
        var xy     = RGraph.getCanvasXY(canvas);
        
        canvas.style.visibility = 'hidden';
        canvas.style.opacity = 0;
        obj.Draw();
        var radius = obj.getRadius();
        RGraph.Clear(obj.canvas);
        canvas.style.visibility = 'visible';

        obj.Set('chart.radius', 0)
        
        setTimeout(function () {canvas.style.opacity = 1;}, delay / frames);


        for (var i=0; i<frames; ++i) {
            setTimeout(function ()
            {
                RGraph.Clear(obj.canvas);
                //obj.canvas.width = obj.canvas.width;
                obj.Set('chart.radius', obj.Get('chart.radius') + (radius / frames));
                obj.Draw();
            }, i * (delay / frames))
        }
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 300);
        }
    }


    /**
    * Grow
    * 
    * The Bar chart Grow effect gradually increases the values of the bars
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.Bar.Grow = function (obj)
    {
        // Save the data
        obj.original_data = RGraph.array_clone(obj.data);
        
        // Zero the data
        obj.__animation_frame__ = 0;

        // Stop the scale from changing by setting chart.ymax (if it's not already set)
        if (obj.Get('chart.ymax') == null) {

            var ymax = 0;

            for (var i=0; i<obj.data.length; ++i) {
                if (RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'stacked') {
                    ymax = Math.max(ymax, RGraph.array_sum(obj.data[i]));
                } else if (RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'grouped') {
                    ymax = Math.max(ymax, RGraph.array_max(obj.data[i]));
                } else {
                    ymax = Math.max(ymax, obj.data[i]);
                }
            }
            
            ymax = RGraph.getScale(ymax)[4];
            
            obj.Set('chart.ymax', ymax);
        }

        function Grow ()
        {
            var numFrames = 30;

            if (!obj.__animation_frame__) {
                obj.__animation_frame__  = 0;
                obj.__original_hmargin__ = obj.Get('chart.hmargin');
                obj.__hmargin__          = ((obj.canvas.width - obj.Get('chart.gutter.left') - obj.Get('chart.gutter.right')) / obj.data.length) / 2;
                obj.Set('chart.hmargin', obj.__hmargin__);
            }

            // Alter the Bar chart data depending on the frame
            for (var j=0; j<obj.original_data.length; ++j) {
                if (typeof(obj.data[j]) == 'object') {
                    for (var k=0; k<obj.data[j].length; ++k) {
                        obj.data[j][k] = (obj.__animation_frame__ / numFrames) * obj.original_data[j][k];
                    }
                } else {
                    obj.data[j] = (obj.__animation_frame__ / numFrames) * obj.original_data[j];
                }
            }

            /**
            * Increment the hmargin to the target
            */
            obj.Set('chart.hmargin', ((1 - (obj.__animation_frame__ / numFrames)) * (obj.__hmargin__ - obj.__original_hmargin__)) + obj.__original_hmargin__);


            RGraph.Clear(obj.canvas);
            obj.Draw();

            if (obj.__animation_frame__ < numFrames) {
                obj.__animation_frame__ += 1;
                
                if (location.href.indexOf('?settimeout') > 0) {
                    setTimeout(Grow, 40);
                } else {
                    RGraph.Effects.UpdateCanvas(Grow);
                }
            }
        }
        
        RGraph.Effects.UpdateCanvas(Grow);
    }


    /**
    * A wrapper function that encapsulate requestAnimationFrame
    * 
    * @param function func The animation function
    */
    RGraph.Effects.UpdateCanvas = function (func)
    {
        // Standard
        if (typeof(window.requestAnimationFrame) == 'function') {
            window.requestAnimationFrame(func);
        // IE 10+
        } else if (typeof(window.msRequestAnimationFrame) == 'function') {
            window.msRequestAnimationFrame(func);
        // Chrome
        } else if (typeof(window.webkitRequestAnimationFrame) == 'function') {
            window.webkitRequestAnimationFrame(func);
        // Firefox
        } else if (window.mozRequestAnimationFrame && 0) { // Seems rather slow in FF6 - so disabled
            window.mozRequestAnimationFrame(func);
        // Default fallback to setTimeout
        } else {
            setTimeout(func, 16.666);
        }
    }


    /**
    * Grow
    * 
    * The Fuel chart Grow effect gradually increases the values of the Fuel chart
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.Fuel.Grow = function (fuelObj)
    {
        function Grow ()
        {
            var numFrames = 35;

            if (!fuelObj.__animation_frame__) {
                fuelObj.__animation_frame__ = 0;
                fuelObj.__min__             = fuelObj.min;
                fuelObj.__value__           = fuelObj.value;
            }


            fuelObj.value = fuelObj.__min__ + (((fuelObj.__value__ - fuelObj.__min__) / numFrames) * fuelObj.__animation_frame__);

            RGraph.Clear(fuelObj.canvas);
            fuelObj.Draw();

            if (fuelObj.__animation_frame__ < numFrames) {
                fuelObj.__animation_frame__ += 1;
                RGraph.Effects.UpdateCanvas(Grow);
            }
        }
        
        RGraph.Effects.UpdateCanvas(Grow);
    }


    /**
    * The Animate function. Similar to the jQuery Animate() function - simply pass it a
    * map of the properties and their target values, and this function will animate
    * them to get to those values.
    * 
    * @param object obj The chart object
    * @param object map A map (an associative array) of the properties and their target values.
    * @param            An optional function which will be called when the animation is complete
    */
    RGraph.Effects.Animate = function (obj, map)
    {
        obj.Draw();

        RGraph.Effects.__total_frames__  = 30;

        function Animate_Iterator (func)
        {
            var id = [obj.id +  '_' + obj.type];

            // Very first time in - initialise the arrays
            if (typeof(RGraph.Effects.__current_frame__ ) == 'undefined') {
                RGraph.Effects.__current_frame__   = new Array();
                RGraph.Effects.__original_values__ = new Array();
                RGraph.Effects.__diffs__           = new Array();
                RGraph.Effects.__steps__           = new Array();
                RGraph.Effects.__callback__        = new Array();
            }

            // Initialise the arrays for THIS animation (not necessrily the first in the page)
            if (!RGraph.Effects.__current_frame__[id]) {
                RGraph.Effects.__current_frame__[id] = RGraph.Effects.__total_frames__;
                RGraph.Effects.__original_values__[id] = {};
                RGraph.Effects.__diffs__[id]           = {};
                RGraph.Effects.__steps__[id]           = {};
                RGraph.Effects.__callback__[id]        = func;
            }

            for (var i in map) {
                if (typeof(map[i]) == 'string' || typeof(map[i]) == 'number') {

                    // If this the first frame, record the proginal value
                    if (RGraph.Effects.__current_frame__[id] == RGraph.Effects.__total_frames__) {
                        RGraph.Effects.__original_values__[id][i] = obj.Get(i);
                        RGraph.Effects.__diffs__[id][i]           = map[i] - RGraph.Effects.__original_values__[id][i];
                        RGraph.Effects.__steps__[id][i]           = RGraph.Effects.__diffs__[id][i] / RGraph.Effects.__total_frames__;
                    }

                    obj.Set(i, obj.Get(i) + RGraph.Effects.__steps__[id][i]);

                    RGraph.Clear(obj.canvas);
                    obj.Draw();
                }
            }

            // If the current frame number is above zero, run the animation iterator again
            if (--RGraph.Effects.__current_frame__[id] > 0) {
                RGraph.Effects.UpdateCanvas(Animate_Iterator);
            
            // Optional callback
            } else {

                if (typeof(RGraph.Effects.__callback__[id]) == 'function') {
                    (RGraph.Effects.__callback__[id])(obj);
                }
                
                // Get rid of the arrays
                RGraph.Effects.__current_frame__[id]   = null;
                RGraph.Effects.__original_values__[id] = null;
                RGraph.Effects.__diffs__[id]           = null;
                RGraph.Effects.__steps__[id]           = null;
                RGraph.Effects.__callback__[id]        = null;

            }
        }

        Animate_Iterator(arguments[2]);
    }


    /**
    * Slide in
    * 
    * This function is a wipe that can be used when switching the canvas to a new graph
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.jQuery.Slide.In = function (obj)
    {
        RGraph.Clear(obj.canvas);
        obj.Draw();

        var canvas = obj.canvas;
        var div    = RGraph.Effects.ReplaceCanvasWithDIV(obj.canvas);
        var delay = 1000;
        div.style.overflow= 'hidden';
        var direction = typeof(arguments[1]) == 'object' && typeof(arguments[1]['direction']) == 'string' ? arguments[1]['direction'] : 'left';
        
        canvas.style.position = 'relative';
        
        if (direction == 'left') {
            canvas.style.left = (0 - div.offsetWidth) + 'px';
            canvas.style.top  = 0;
        } else if (direction == 'top') {
            canvas.style.left = 0;
            canvas.style.top  = (0 - div.offsetHeight) + 'px';
        } else if (direction == 'bottom') {
            canvas.style.left = 0;
            canvas.style.top  = div.offsetHeight + 'px';
        } else {
            canvas.style.left = div.offsetWidth + 'px';
            canvas.style.top  = 0;
        }
        
        $('#' + obj.id).animate({left:0,top:0}, delay);
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Slide out
    * 
    * This function is a wipe that can be used when switching the canvas to a new graph
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.jQuery.Slide.Out = function (obj)
    {
        var canvas = obj.canvas;
        var div    = RGraph.Effects.ReplaceCanvasWithDIV(obj.canvas);
        var delay = 1000;
        div.style.overflow= 'hidden';
        var direction = typeof(arguments[1]) == 'object' && typeof(arguments[1]['direction']) == 'string' ? arguments[1]['direction'] : 'left';
        
        canvas.style.position = 'relative';
        canvas.style.left = 0;
        canvas.style.top  = 0;
        
        if (direction == 'left') {
            $('#' + obj.id).animate({left: (0 - canvas.width) + 'px'}, delay);
        } else if (direction == 'top') {
            $('#' + obj.id).animate({left: 0, top: (0 - div.offsetHeight) + 'px'}, delay);
        } else if (direction == 'bottom') {
            $('#' + obj.id).animate({top: (0 + div.offsetHeight) + 'px'}, delay);
        } else {
            $('#' + obj.id).animate({left: (0 + canvas.width) + 'px'}, delay);
        }
        
        /**
        * Callback
        */
        if (typeof(arguments[2]) == 'function') {
            setTimeout(arguments[2], 1050);
        }
    }


    /**
    * Unfold
    * 
    * This effect gradually increases the X/Y coordinatesfrom 0
    * 
    * @param object obj The chart object
    */
    RGraph.Effects.Line.Unfold = function (obj)
    {
        obj.Set('chart.animation.factor', 0);
        RGraph.Effects.Animate(obj, {'chart.animation.factor': 0.999}, arguments[2]);
    }


    /**
    * Grow
    * 
    * The HBar chart Grow effect gradually increases the values of the bars
    * 
    * @param object obj The graph object
    */
    RGraph.Effects.HBar.Grow = function (obj)
    {
        // Save the data
        obj.original_data = RGraph.array_clone(obj.data);
        
        // Zero the data
        obj.__animation_frame__ = 0;

        // Stop the scale from changing by setting chart.ymax (if it's not already set)
        if (obj.Get('chart.xmax') == 0) {

            var xmax = 0;

            for (var i=0; i<obj.data.length; ++i) {
                if (RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'stacked') {
                    xmax = Math.max(xmax, RGraph.array_sum(obj.data[i]));
                } else if (RGraph.is_array(obj.data[i]) && obj.Get('chart.grouping') == 'grouped') {
                    xmax = Math.max(xmax, RGraph.array_max(obj.data[i]));
                } else {
                    xmax = Math.max(xmax, RGraph.array_max(obj.data[i]));
                }
            }

            xmax = RGraph.getScale(xmax)[4];
            
            obj.Set('chart.xmax', xmax);
        }
        
        /**
        * Turn off shadow blur for the duration of the animation
        */
        if (obj.Get('chart.shadow.blur') > 0) {
            var __original_shadow_blur__ = obj.Get('chart.shadow.blur');
            obj.Set('chart.shadow.blur', 0);
        }

        function Grow ()
        {
            var numFrames = 30;

            if (!obj.__animation_frame__) {
                obj.__animation_frame__  = 0;
                obj.__original_vmargin__ = obj.Get('chart.vmargin');
                obj.__vmargin__          = ((obj.canvas.height - obj.Get('chart.gutter.top') - obj.Get('chart.gutter.bottom')) / obj.data.length) / 2;
                obj.Set('chart.vmargin', obj.__vmargin__);
            }

            // Alter the Bar chart data depending on the frame
            for (var j=0; j<obj.original_data.length; ++j) {
                if (typeof(obj.data[j]) == 'object') {
                    for (var k=0; k<obj.data[j].length; ++k) {
                        obj.data[j][k] = (obj.__animation_frame__ / numFrames) * obj.original_data[j][k];
                    }
                } else {
                    obj.data[j] = (obj.__animation_frame__ / numFrames) * obj.original_data[j];
                }
            }

            /**
            * Increment the vmargin to the target
            */
            obj.Set('chart.vmargin', ((1 - (obj.__animation_frame__ / numFrames)) * (obj.__vmargin__ - obj.__original_vmargin__)) + obj.__original_vmargin__);


            RGraph.Clear(obj.canvas);
            obj.Draw();

            if (obj.__animation_frame__ < numFrames) {
                obj.__animation_frame__ += 1;
                
                RGraph.Effects.UpdateCanvas(Grow);
            
            // Turn any shadow blur back on
            } else {
                if (typeof(__original_shadow_blur__) == 'number' && __original_shadow_blur__ > 0) {
                    obj.Set('chart.shadow.blur', __original_shadow_blur__);
                    RGraph.Clear(obj.canvas);
                    obj.Draw();
                }
            }
        }
        
        RGraph.Effects.UpdateCanvas(Grow);
    }