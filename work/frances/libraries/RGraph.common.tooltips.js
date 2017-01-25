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

    if (typeof(RGraph) == 'undefined') RGraph = {isRGraph:true,type:'common'};
    
    /**
    * This is used in two functions, hence it's here
    */
    RGraph.tooltips = {};
    RGraph.tooltips.padding   = '3px';
    RGraph.tooltips.font_face = 'Tahoma';
    RGraph.tooltips.font_size = '10pt';


    /**
    * Shows a tooltip next to the mouse pointer
    * 
    * @param canvas object The canvas element object
    * @param text   string The tooltip text
    * @param int     x      The X position that the tooltip should appear at. Combined with the canvases offsetLeft
    *                       gives the absolute X position
    * @param int     y      The Y position the tooltip should appear at. Combined with the canvases offsetTop
    *                       gives the absolute Y position
    * @param int     idx    The index of the tooltip in the graph objects tooltip array
    */
    RGraph.Tooltip = function (canvas, text, x, y, idx)
    {
        /**
        * chart.tooltip.override allows you to totally take control of rendering the tooltip yourself
        */
        if (typeof(canvas.__object__.Get('chart.tooltips.override')) == 'function') {
            return canvas.__object__.Get('chart.tooltips.override')(canvas, text, x, y, idx);
        }

        /**
        * This facilitates the "id:xxx" format
        */
        text = RGraph.getTooltipTextFromDIV(text);

        /**
        * First clear any exising timers
        */
        var timers = RGraph.Registry.Get('chart.tooltip.timers');

        if (timers && timers.length) {
            for (i=0; i<timers.length; ++i) {
                clearTimeout(timers[i]);
            }
        }
        RGraph.Registry.Set('chart.tooltip.timers', []);

        /**
        * Hide the context menu if it's currently shown
        */
        if (canvas.__object__.Get('chart.contextmenu')) {
            RGraph.HideContext();
        }

        // Redraw the canvas?
        if (canvas.__object__.Get('chart.tooltips.highlight')) {
            RGraph.Redraw(canvas.id);
        }

        var effect = canvas.__object__.Get('chart.tooltips.effect').toLowerCase();

        if (effect == 'snap' && RGraph.Registry.Get('chart.tooltip') && RGraph.Registry.Get('chart.tooltip').__canvas__.id == canvas.id) {

            if (   canvas.__object__.type == 'line'
                || canvas.__object__.type == 'radar'
                || canvas.__object__.type == 'scatter'
                || canvas.__object__.type == 'rscatter'
                ) {

                var tooltipObj = RGraph.Registry.Get('chart.tooltip');
                
        
                tooltipObj.style.width  = null;
                tooltipObj.style.height = null;
        
                tooltipObj.innerHTML = text;
                tooltipObj.__text__  = text;
        
                /**
                * Now that the new content has been set, re-set the width & height
                */
                RGraph.Registry.Get('chart.tooltip').style.width  = RGraph.getTooltipWidth(text, canvas.__object__) + 'px';
                RGraph.Registry.Get('chart.tooltip').style.height = RGraph.Registry.Get('chart.tooltip').offsetHeight + 'px';
                
            
                var currentx = parseInt(RGraph.Registry.Get('chart.tooltip').style.left);
                var currenty = parseInt(RGraph.Registry.Get('chart.tooltip').style.top);
            
                var diffx = x - currentx - ((x + RGraph.Registry.Get('chart.tooltip').offsetWidth) > document.body.offsetWidth ? RGraph.Registry.Get('chart.tooltip').offsetWidth : 0);
                var diffy = y - currenty - RGraph.Registry.Get('chart.tooltip').offsetHeight;
            
                // Position the tooltip
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.2)) + 'px"', 25);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.4)) + 'px"', 50);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.6)) + 'px"', 75);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 0.8)) + 'px"', 100);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.left = "' + (currentx + (diffx * 1.0)) + 'px"', 125);
            
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.2)) + 'px"', 25);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.4)) + 'px"', 50);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.6)) + 'px"', 75);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 0.8)) + 'px"', 100);
                setTimeout('RGraph.Registry.Get("chart.tooltip").style.top = "' + (currenty + (diffy * 1.0)) + 'px"', 125);
            
            } else {
        
                alert('[TOOLTIPS] The "snap" effect is only supported on the Line, Rscatter, Scatter and Radar charts (tried to use it with type: ' + canvas.__object__.type);
            }

            /**
            * Fire the tooltip event
            */
            RGraph.FireCustomEvent(canvas.__object__, 'ontooltip');

            return;
        }

        /**
        * Hide any currently shown tooltip
        */
        RGraph.HideTooltip();


        /**
        * Show a tool tip
        */
        var tooltipObj  = document.createElement('DIV');
        tooltipObj.className             = canvas.__object__.Get('chart.tooltips.css.class');
        tooltipObj.style.display         = 'none';
        tooltipObj.style.position        = 'absolute';
        tooltipObj.style.left            = 0;
        tooltipObj.style.top             = 0;
        tooltipObj.style.backgroundColor = 'rgba(255,255,239,0.9)';
        tooltipObj.style.color           = 'black';
        if (!document.all) tooltipObj.style.border = '';
        tooltipObj.style.visibility      = 'visible';
        tooltipObj.style.paddingLeft     = RGraph.tooltips.padding;
        tooltipObj.style.paddingRight    = RGraph.tooltips.padding;
        tooltipObj.style.fontFamily      = RGraph.tooltips.font_face;
        tooltipObj.style.fontSize        = RGraph.tooltips.font_size;
        tooltipObj.style.zIndex          = 3;
        tooltipObj.style.borderRadius       = '5px';
        tooltipObj.style.MozBorderRadius    = '5px';
        tooltipObj.style.WebkitBorderRadius = '5px';
        tooltipObj.style.WebkitBoxShadow    = 'rgba(96,96,96,0.5) 0 0 15px';
        tooltipObj.style.MozBoxShadow       = 'rgba(96,96,96,0.5) 0 0 15px';
        tooltipObj.style.boxShadow          = 'rgba(96,96,96,0.5) 0 0 15px';
        tooltipObj.style.filter             = 'progid:DXImageTransform.Microsoft.Shadow(color=#666666,direction=135)';
        tooltipObj.style.opacity            = 0;
        tooltipObj.style.overflow           = 'hidden';
        tooltipObj.innerHTML                = text;
        tooltipObj.__text__                 = text; // This is set because the innerHTML can change when it's set
        tooltipObj.__canvas__               = canvas;
        tooltipObj.style.display            = 'inline';
        
        if (typeof(idx) == 'number') {
            tooltipObj.__index__ = idx;
            
            /**
            * Just for the line chart
            */
            if (canvas.__object__.type == 'line') {
                var index2 = idx;
                
                while (index2 >= canvas.__object__.data[0].length) {
                    index2 -= canvas.__object__.data[0].length;
                }
                
                tooltipObj.__index2__ = index2;
            }
        }

        document.body.appendChild(tooltipObj);
        
        var width  = tooltipObj.offsetWidth;
        var height = tooltipObj.offsetHeight;

        if ((y - height - 2) > 0) {
            y = y - height - 2;
        } else {
            y = y + 2;
        }

        /**
        * Set the width on the tooltip so it doesn't resize if the window is resized
        */
        tooltipObj.style.width = width + 'px';
        //tooltipObj.style.height = 0; // Initially set the tooltip height to nothing

        /**
        * If the mouse is towards the right of the browser window and the tooltip would go outside of the window,
        * move it left
        */
        if ( (x + width) > document.body.offsetWidth ) {
            x = x - width - 7;
            var placementLeft = true;
            
            if (canvas.__object__.Get('chart.tooltips.effect') == 'none') {
                x = x - 3;
            }

            tooltipObj.style.left = x + 'px';
            tooltipObj.style.top  = y + 'px';

        } else {
            x += 5;

            tooltipObj.style.left = x + 'px';
            tooltipObj.style.top = y + 'px';
        }


        if (effect == 'expand') {

            tooltipObj.style.left        = (x + (width / 2)) + 'px';
            tooltipObj.style.top         = (y + (height / 2)) + 'px';
            leftDelta                    = (width / 2) / 10;
            topDelta                     = (height / 2) / 10;

            tooltipObj.style.width              = 0;
            tooltipObj.style.height             = 0;
            //tooltipObj.style.boxShadow          = '';
            //tooltipObj.style.MozBoxShadow       = '';
            //tooltipObj.style.WebkitBoxShadow    = '';
            //tooltipObj.style.borderRadius       = 0;
            //tooltipObj.style.MozBorderRadius    = 0;
            //tooltipObj.style.WebkitBorderRadius = 0;
            tooltipObj.style.opacity = 1;

            // Progressively move the tooltip to where it should be (the x position)
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) - leftDelta) + 'px' }", 250));
            
            // Progressively move the tooltip to where it should be (the Y position)
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) - topDelta) + 'px' }", 250));

            // Progressively grow the tooltip width
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.1) + "px'; }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.2) + "px'; }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.3) + "px'; }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.4) + "px'; }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.5) + "px'; }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.6) + "px'; }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.7) + "px'; }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.8) + "px'; }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 0.9) + "px'; }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + width + "px'; }", 250));

            // Progressively grow the tooltip height
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.1) + "px'; }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.2) + "px'; }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.3) + "px'; }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.4) + "px'; }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.5) + "px'; }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.6) + "px'; }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.7) + "px'; }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.8) + "px'; }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 0.9) + "px'; }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + height + "px'; }", 250));
            
            // When the animation is finished, set the tooltip HTML
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').innerHTML = RGraph.Registry.Get('chart.tooltip').__text__; }", 250));
        
        } else if (effect == 'contract') {

            tooltipObj.style.left = (x - width) + 'px';
            tooltipObj.style.top  = (y - (height * 2)) + 'px';
            tooltipObj.style.cursor = 'pointer';

            leftDelta = width / 10;
            topDelta  = height / 10;

            tooltipObj.style.width  = (width * 5) + 'px';
            tooltipObj.style.height = (height * 5) + 'px';

            tooltipObj.style.opacity = 0.2;

            // Progressively move the tooltip to where it should be (the x position)
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = (parseInt(RGraph.Registry.Get('chart.tooltip').style.left) + leftDelta) + 'px' }", 250));

            // Progressively move the tooltip to where it should be (the Y position)
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = (parseInt(RGraph.Registry.Get('chart.tooltip').style.top) + (topDelta*2)) + 'px' }", 250));

            // Progressively shrink the tooltip width
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 5.5) + "px'; }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 5.0) + "px'; }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 4.5) + "px'; }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 4.0) + "px'; }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 3.5) + "px'; }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 3.0) + "px'; }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 2.5) + "px'; }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 2.0) + "px'; }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + (width * 1.5) + "px'; }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.width = '" + width + "px'; }", 250));

            // Progressively shrink the tooltip height
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 5.5) + "px'; }", 25));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 5.0) + "px'; }", 50));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 4.5) + "px'; }", 75));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 4.0) + "px'; }", 100));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 3.5) + "px'; }", 125));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 3.0) + "px'; }", 150));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 2.5) + "px'; }", 175));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 2.0) + "px'; }", 200));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + (height * 1.5) + "px'; }", 225));
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.height = '" + height + "px'; }", 250));

            // When the animation is finished, set the tooltip HTML
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').innerHTML = RGraph.Registry.Get('chart.tooltip').__text__; }", 250));

            /**
            * This resets the pointer
            */
            RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.cursor = 'default'; }", 275));

        } else if (effect == 'snap') {

            /*******************************************************
            * Move the tooltip
            *******************************************************/
            for (var i=1; i<=10; ++i) {
                RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.left = '" + (x * 0.1 * i) + "px'; }", 15 * i));
                RGraph.Registry.Get('chart.tooltip.timers').push(setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.top = '" + (y * 0.1 * i) + "px'; }", 15 * i));
            }

            tooltipObj.style.left = 0 - tooltipObj.offsetWidth + 'px';
            tooltipObj.style.top  = 0 - tooltipObj.offsetHeight + 'px';

        } else if (effect != 'fade' && effect != 'expand' && effect != 'none' && effect != 'snap' && effect != 'contract') {
            alert('[COMMON] Unknown tooltip effect: ' + effect);
        }

        if (effect != 'none') {
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.1; }", 25);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.2; }", 50);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.3; }", 75);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.4; }", 100);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.5; }", 125);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.6; }", 150);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.7; }", 175);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.8; }", 200);
            setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 0.9; }", 225);
        }

        setTimeout("if (RGraph.Registry.Get('chart.tooltip')) { RGraph.Registry.Get('chart.tooltip').style.opacity = 1;}", effect == 'none' ? 50 : 250);

        /**
        * If the tooltip it self is clicked, cancel it
        */
        tooltipObj.onmousedown = function (e)
        {
            e = RGraph.FixEventObject(e)
            e.stopPropagation();
        }
        
        tooltipObj.onclick = function (e)
        {
            if (e.button == 0) {
                e = RGraph.FixEventObject(e);
                e.stopPropagation();
            }
        }

        /**
        * Install the function for hiding the tooltip.
        */
        document.body.onmousedown = function (event)
        {
            var tooltip = RGraph.Registry.Get('chart.tooltip');

            if (tooltip) {
                RGraph.HideTooltip();

                // Redraw if highlighting is enabled
                if (tooltip.__canvas__.__object__.Get('chart.tooltips.highlight')) {
                    RGraph.Redraw();
                }
            }
        }

        /**
        * If the window is resized, hide the tooltip
        */
        window.onresize = function ()
        {
            var tooltip = RGraph.Registry.Get('chart.tooltip');

            if (tooltip) {
                tooltip.parentNode.removeChild(tooltip);
                tooltip.style.display = 'none';                
                tooltip.style.visibility = 'hidden';
                RGraph.Registry.Set('chart.tooltip', null);

                // Redraw the graph if necessary
                if (canvas.__object__.Get('chart.tooltips.highlight')) {
                    RGraph.Clear(canvas);
                    canvas.__object__.Draw();
                }
            }
        }

        /**
        * Keep a reference to the tooltip
        */
        RGraph.Registry.Set('chart.tooltip', tooltipObj);

        /**
        * Fire the tooltip event
        */
        RGraph.FireCustomEvent(canvas.__object__, 'ontooltip');
    }
    
    
    /**
    * 
    */
    RGraph.getTooltipTextFromDIV = function (text)
    {
        var result = /^id:(.*)/.exec(text);

        if (result && result[1] && document.getElementById(result[1])) {
            text = document.getElementById(result[1]).innerHTML;
        }
        
        return text;
    }


    /**
    * This function handles the tooltip text being a string, function, or an array of functions.
    */
    RGraph.parseTooltipText = function (tooltips, idx)
    {
        // Get the tooltip text
        if (typeof(tooltips) == 'function') {
            var text = tooltips(idx);
        
        } else if (typeof(tooltips) == 'object' && tooltips && typeof(tooltips[idx]) == 'function') {
            var text = tooltips[idx](idx);
        
        } else if (typeof(tooltips) == 'object' && tooltips) {
            var text = String(tooltips[idx]);

        } else {
            var text = '';
        }
        
        if (text == 'undefined') {
            text = '';
        }

        return text;
    }


    /**
    * 
    */
    RGraph.getTooltipWidth = function (text, obj)
    {
        var div = document.createElement('DIV');
            div.className             = obj.Get('chart.tooltips.css.class');
            div.style.paddingLeft     = RGraph.tooltips.padding;
            div.style.paddingRight    = RGraph.tooltips.padding;
            div.style.fontFamily      = RGraph.tooltips.font_face;
            div.style.fontSize        = RGraph.tooltips.font_size;
            div.style.visibility      = 'hidden';
            div.style.position        = 'absolute';
            div.style.top            = '300px';
            div.style.left             = 0;
            div.style.display         = 'inline';
            div.innerHTML             = RGraph.getTooltipTextFromDIV(text);
        document.body.appendChild(div);

        return div.offsetWidth;
    }


    /**
    * Hides the currently shown tooltip
    */
    RGraph.HideTooltip = function ()
    {
        var tooltip = RGraph.Registry.Get('chart.tooltip');

        if (tooltip) {
            tooltip.parentNode.removeChild(tooltip);
            tooltip.style.display = 'none';                
            tooltip.style.visibility = 'hidden';
            RGraph.Registry.Set('chart.tooltip', null);
        }
    }






    /**
    * The BAR chart onmousemove event Bar chart tooltips can now
    * be based around the onmousemove event
    */
    RGraph.InstallBarTooltipEventListeners = function (obj)
    {
        /**
        * Install the window onclick handler
        */
        var window_onclick_func = function (){RGraph.Redraw();};
        window.addEventListener('click', window_onclick_func, false);
        RGraph.AddEventListener('window_' + obj.id, 'click', window_onclick_func);


        var canvas_onmousemove = function (e)
        {
            e = RGraph.FixEventObject(e);
    
            var canvas    = document.getElementById(e.target.id);
            var obj       = canvas.__object__;
            
            if (obj.__bar__) {
                var lineObj = obj;
                obj = obj.__bar__;
                obj.__line__ = lineObj;
            }

            var barCoords = obj.getBar(e);
    
            /**
            * If there are bar coords AND the bar has height
            */
    
            if (barCoords && barCoords[4] > 0) {

                /**
                * Get the tooltip text
                */
                var text = RGraph.parseTooltipText(obj.Get('chart.tooltips'), barCoords[5]);

    
                if (text) {
                    canvas.style.cursor = 'pointer';
                } else {
                    canvas.style.cursor = 'default';
                }
                
                /**
                * Hide the currently displayed tooltip if the index is the same
                */
                if (   RGraph.Registry.Get('chart.tooltip')
                    && RGraph.Registry.Get('chart.tooltip').__canvas__.id != obj.id
                    && obj.Get('chart.tooltips.event') == 'onmousemove') {
    
                    RGraph.Redraw();
                    RGraph.HideTooltip();
                }
    
                /**
                * This facilitates the tooltips using the onmousemove event
                */
    
                if (   obj.Get('chart.tooltips.event') == 'onmousemove'
                    && (
                           (RGraph.Registry.Get('chart.tooltip') && RGraph.Registry.Get('chart.tooltip').__index__ != barCoords[5])
                        || !RGraph.Registry.Get('chart.tooltip')
                       )
                    && text) {
                    /**
                    * Show a tooltip if it's defined
                    */
                    RGraph.Redraw(obj);

                    if (obj.Get('chart.tooltips.highlight')) {
                        obj.context.beginPath();
                        obj.context.strokeStyle = obj.Get('chart.highlight.stroke');
                        obj.context.fillStyle   = obj.Get('chart.highlight.fill');
                        obj.context.strokeRect(barCoords[1], barCoords[2], barCoords[3], barCoords[4]);
                        obj.context.fillRect(barCoords[1], barCoords[2], barCoords[3], barCoords[4]);
                
                        obj.context.stroke();
                        obj.context.fill();
                    }
    
                    RGraph.Tooltip(canvas, text, e.pageX, e.pageY, barCoords[5]);
                }
            } else if (obj.__line__ && obj.__line__.getPoint && obj.__line__.getPoint(e)) {
                canvas.style.cursor = 'pointer';
            } else {
                canvas.style.cursor = 'default';
            }
        }
        RGraph.AddEventListener(obj.id, 'mousemove', canvas_onmousemove);
        obj.canvas.addEventListener('mousemove', canvas_onmousemove, false);



        /**
        * Install the onclick event handler for the tooltips
        */
        if (obj.Get('chart.tooltips.event') == 'onclick') {

            var canvas_onclick = function (e)
            {
                var e = RGraph.FixEventObject(e);

                // If the button pressed isn't the left, we're not interested
                if (e.button != 0) return;

                e = RGraph.FixEventObject(e);

                var canvas    = document.getElementById(this.id);
                var obj       = canvas.__object__;

                if (obj.__bar__) {
                    obj = obj.__bar__;
                }

                var barCoords = obj.getBar(e);

                /**
                * Redraw the graph first, in effect resetting the graph to as it was when it was first drawn
                * This "deselects" any already selected bar
                */
                RGraph.Redraw();

                /**
                * Loop through the bars determining if the mouse is over a bar
                */
                if (barCoords) {

                    /**
                    * Get the tooltip text
                    */
                    var text = RGraph.parseTooltipText(obj.Get('chart.tooltips'), barCoords[5]);

                    /**
                    * Show a tooltip if it's defined
                    */
                    if (text && text != 'undefined') {
                        if (obj.Get('chart.tooltips.highlight')) {

                            obj.context.beginPath();
                                obj.context.strokeStyle = obj.Get('chart.highlight.stroke');
                                obj.context.fillStyle   = obj.Get('chart.highlight.fill');
                                obj.context.strokeRect(barCoords[1], barCoords[2], barCoords[3], barCoords[4]);
                                obj.context.fillRect(barCoords[1], barCoords[2], barCoords[3], barCoords[4]);
                            obj.context.stroke();
                            obj.context.fill();
                        }

                        RGraph.Tooltip(canvas, text, e.pageX, e.pageY, barCoords[5]);
                    }
                }

                /**
                * Stop the event bubbling
                */
                e.stopPropagation();
            }
            RGraph.AddEventListener(obj.id, 'click', canvas_onclick);
            obj.canvas.addEventListener('click', canvas_onclick, false);
        }
    }



    /**
    * The LINE chart tooltips event handlers
    * 
    * @param object obj The graph object
    */
    RGraph.InstallLineTooltipEventListeners = function (obj)
    {
        var canvas_onmousemove_func = function (e)
        {
            e = RGraph.FixEventObject(e);
    
            var canvas  = e.target;
            var context = canvas.getContext('2d');
            var obj     = canvas.__object__;
            var point   = obj.getPoint(e);
    
            if (obj.Get('chart.tooltips.highlight')) {
                RGraph.Register(obj);
            }

            if (   point
                && typeof(point[0]) == 'object'
                && typeof(point[1]) == 'number'
                && typeof(point[2]) == 'number'
                && typeof(point[3]) == 'number'
               ) {
    
                // point[0] is the graph object
                var xCoord = point[1];
                var yCoord = point[2];
                var idx    = point[3];
    
                if ((obj.Get('chart.tooltips')[idx] || typeof(obj.Get('chart.tooltips')) == 'function')) {
    
                    var text = RGraph.parseTooltipText(obj.Get('chart.tooltips'), idx);
    
    
                    // No tooltip text - do nada
                    if (text.match(/^id:(.*)$/) && RGraph.getTooltipTextFromDIV(text).substring(0,3) == 'id:') {
                        return;
                    }
    
                    // Chnage the pointer to a hand
                    canvas.style.cursor = 'pointer';

                    /**
                    * If the tooltip is the same one as is currently visible (going by the array index), don't do squat and return.
                    */
    
                    if (   RGraph.Registry.Get('chart.tooltip')
                        && RGraph.Registry.Get('chart.tooltip').__index__ == idx
                        && RGraph.Registry.Get('chart.tooltip').__canvas__.id == canvas.id
                        && RGraph.Registry.Get('chart.tooltip').__event__
                        && RGraph.Registry.Get('chart.tooltip').__event__ == 'mousemove') {
    
                        return;
                    }
    
                    /**
                    * Redraw the graph
                    */
                    if (obj.Get('chart.tooltips.highlight') || obj.__bar__) {
                        
                        RGraph.Redraw();
                        
                        if (obj.__bar__) {
                            RGraph.Clear(obj.canvas);
                            obj.__bar__.Draw();
                        }
                    }
    
                    // SHOW THE CORRECT TOOLTIP
                    RGraph.Tooltip(canvas, text, e.pageX, e.pageY, idx);
    
                    // Store the tooltip index on the tooltip object
                    RGraph.Registry.Get('chart.tooltip').__index__ = Number(idx);
    
                    /**
                    * This converts idx into the index that is not greater than the
                    * number of items in the data array
                    */
                    while (idx >= obj.data[0].length) {
                        idx -= obj.data[0].length
                    }
    
                    RGraph.Registry.Get('chart.tooltip').__index2__ = idx;
                    
                    /**
                    * Set the source event
                    */
                    RGraph.Registry.Get('chart.tooltip').__event__ = 'mousemove';
    
                    /**
                    * Highlight the graph
                    */
                    if (obj.Get('chart.tooltips.highlight')) {
                    
                        context.beginPath();
                        context.moveTo(xCoord, yCoord);
                        context.arc(xCoord, yCoord, 2, 0, 6.28, 0);
                        context.strokeStyle = obj.Get('chart.highlight.stroke');
                        context.fillStyle = obj.Get('chart.highlight.fill');
                        context.stroke();
                        context.fill();
                    }
                    
                    e.stopPropagation();
                    return;
                }
            }
            
            /**
            * Not over a hotspot?
            */
            canvas.style.cursor = 'default';
        }
        obj.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
        RGraph.AddEventListener(obj.id, 'mousemove', canvas_onmousemove_func);
    }