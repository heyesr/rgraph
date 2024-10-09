    // o---------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:                |
    // |                                                                                 |
    // |                       https://www.rgraph.net/license.html                       |
    // |                                                                                 |
    // | RGraph is dual-licensed under the Open Source GPL license. That means that it's |
    // | free to use and there are no restrictions on what you can use RGraph for!       |
    // | If the GPL license does not suit you however, then there's an inexpensive       |
    // | commercial license option available. See the URL above for more details.        |
    // o---------------------------------------------------------------------------------o

    RGraph        = window.RGraph || {isrgraph:true,isRGraph:true,rgraph:true};
    RGraph.SVG    = RGraph.SVG    || {};
    RGraph.SVG.FX = RGraph.SVG.FX || {};


// Module pattern
(function (win, doc, undefined)
{
    RGraph.SVG.REG = {
        store: {
            'rgraph-svg-runonce-functions': []
        }
    };

    // ObjectRegistry
    RGraph.SVG.OR = {objects: []};
    
    // Used to categorise trigonometery functions
    RGraph.SVG.TRIG        = {};
    RGraph.SVG.TRIG.HALFPI = Math.PI * .4999;
    RGraph.SVG.TRIG.PI     = RGraph.SVG.TRIG.HALFPI * 2;
    RGraph.SVG.TRIG.TWOPI  = RGraph.SVG.TRIG.PI * 2;
    
    RGraph.SVG.events = [];


    // This allows you to set globalconfiguration values that are copied to
    // all objects automatically.
    RGraph.SVG.GLOBALS = {};
    
    // This allows the GET import methods to be added
    RGraph.SVG.GET = {};


    RGraph.SVG.ISFF     = navigator.userAgent.indexOf('Firefox') != -1;
    RGraph.SVG.ISOPERA  = navigator.userAgent.indexOf('Opera') != -1;
    RGraph.SVG.ISCHROME = navigator.userAgent.indexOf('Chrome') != -1;
    RGraph.SVG.ISSAFARI = navigator.userAgent.indexOf('Safari') != -1 && !RGraph.SVG.ISCHROME;
    RGraph.SVG.ISWEBKIT = navigator.userAgent.indexOf('WebKit') != -1;

    RGraph.SVG.ISIE     = navigator.userAgent.indexOf('Trident') > 0 || navigator.userAgent.indexOf('MSIE') > 0;
    RGraph.SVG.ISIE9    = navigator.userAgent.indexOf('MSIE 9') > 0;
    RGraph.SVG.ISIE10   = navigator.userAgent.indexOf('MSIE 10') > 0;
    RGraph.SVG.ISIE11UP = navigator.userAgent.indexOf('MSIE') == -1 && navigator.userAgent.indexOf('Trident') > 0;
    RGraph.SVG.ISIE10UP = RGraph.SVG.ISIE10 || RGraph.SVG.ISIE11UP;
    RGraph.SVG.ISIE9UP  = RGraph.SVG.ISIE9 || RGraph.SVG.ISIE10UP;
    
    // Some commonly used bits of info
    RGraph.SVG.MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    RGraph.SVG.MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];
    RGraph.SVG.DAYS_SHORT   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
    RGraph.SVG.DAYS_LONG    = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];








    //
    // Create an SVG tag
    //
    RGraph.SVG.createSVG = function (opt)
    {
        var container = opt.container,
            obj       = opt.object;

        //
        // If the SVG tag already exists then just return it.
        // Don't neglect to add the groups to the chart object
        //
        if (container.__svg__) {
            
            // Add the (10) groups that facilitate "background
            // layers"
            for (var i=1; i<=10; ++i) {    
                // Store a reference to the group on the chart object
                obj.layers['background' + i] = container.__svg__['background' + i];
            }
            
            return container.__svg__;
        }

        var svg = doc.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute('width', container.offsetWidth);
            svg.setAttribute('height', container.offsetHeight);
            svg.setAttribute('version', '1.1');
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", 'xmlns', 'http://www.w3.org/2000/svg');
            svg.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:xlink", "http://www.w3.org/1999/xlink");
            svg.__object__    = obj;
            svg.__container__ = container;
            
            // Set some style
            svg.style.top      = 0;
            svg.style.left     = 0;
            svg.style.position = 'absolute';

        container.appendChild(svg);

        container.__svg__    = svg;
        container.__object__ = obj;

        var style = getComputedStyle(container);
        if (style.position !== 'absolute' && style.position !== 'fixed' && style.position !== 'sticky') {
            container.style.position = 'relative';
        }

        // Add the (10) groups that facilitate "background layers"
        for (var i=1; i<=10; ++i) {
            
            var group = RGraph.SVG.create({
                svg: svg,
                type: 'g',
                attr: {
                    className: 'background' + i
                }
            });

            // Store a reference to the group
            obj.layers['background' + i] = group;
            svg['background' + i]        = group;
        }

        return svg;
    };








    //
    // Creates the all group that all of the charts elements
    // sit within
    //
    // @param object The SVG tag
    //
    RGraph.SVG.createAllGroup = function (obj)
    {
        // Add the group tag to the SVG that contains all of the elements
        var group = RGraph.SVG.create({
            svg: obj.svg,
            type: 'g',
            attr: {
                className: 'all-elements all-elements-' + obj.type + ' all-elements-' + obj.id + ' all-elements-' + obj.uid
            }
        });
        
        obj.svg.svgAllGroup = group;
        
        return group;
    };








    //
    // Create a defs tag inside the SVG
    //
    RGraph.SVG.createDefs = function (obj)
    {
        if (!obj.svg.defs) {

            var defs = RGraph.SVG.create({
                svg: obj.svg,
                type: 'defs'
            });
    
            obj.svg.defs = defs;
        }

        return obj.svg.defs;
    };








    //
    // Creates a tag depending on the args that you give
    //
    //@param opt object The options for the function
    //
    RGraph.SVG.create = function (opt)
    {
        var ns  = "http://www.w3.org/2000/svg";

        
        var tag = doc.createElementNS(ns, opt.type);

        // Add the attributes
        for (var o in opt.attr) {
            if (typeof o === 'string') {
            
                var name = o;

                if (o === 'className') {
                    name = 'class';
                }
                if ( (opt.type === 'a' || opt.type === 'image') && o === 'xlink:href') {
                    tag.setAttributeNS('http://www.w3.org/1999/xlink', o, String(opt.attr[o]));
                } else {
                    if (RGraph.SVG.isNullish(opt.attr[o])) {
                        opt.attr[o] = '';
                    }
                    tag.setAttribute(name, String(opt.attr[o]));
                }
            }
        }
        
        // Add the style
        for (var o in opt.style) {
            if (typeof o === 'string') {
                tag.style[o] = String(opt.style[o]);
            }
        }

        if (opt.parent) {
            opt.parent.appendChild(tag);
        } else {
            opt.svg.appendChild(tag);
        }

        return tag;
    };
    //
    // Parse a string form of a tag like this:
    //
    // circle = RGraph.SVG.create.parseStr(
    //     obj,
    //     '<circle cx="65" cy="90" r="50">'
    // )
    //
    RGraph.SVG.create.parseStr = function (obj, str)
    {
        // Either an SVG tag object or an RGraph object can be
        // given
        var svg = obj.isrgraph ? obj.svg : obj;

        // Get rid of the closing tag if its present
        var str = arguments[1].replace(/<\/[-a-z]+>/, '');

        // First, extract the style attribute if its present
        str.match(/style="([^"]*)"/);
        var style = RegExp.$1;
        str = str.replace(/style="[^"]*"/,'');
        
        // Special case for stroke-dasharray: replace spaces with
        // double pipe
        str = str.replace(/stroke-dasharray="([0-9 ]+)"/,function (str, match)
        {
            str = match.replace(/ /, '||');
            return 'stroke-dasharray="' + str + '"';
        });

        // Split the string on spaces
        var parts = str.split(/ +/);

        // Extract the tagName
        var tagName = parts[0].replace('<','').replace('>','').trim();            

        // Get rid of the final angle bracket
        parts[parts.length - 1] = parts[parts.length - 1].replace('>','');

        // Loop through the attributes
        for (var i=1,attr={},name,value; i<parts.length; ++i) {

            [name, value] = parts[i].split('="');

            if (name) {

                // Get rid of surrounding quotes
                value = value.replace(/^"/,'').replace(/"$/,'');

                // Convert to a number
                if (value.match(/^[-0-9.]+$/)) {
                    value = Number(value);
                }
                
                // Take out double-pipe from the value
                if (name === 'stroke-dasharray') {
                    value = value.replace('||', ' ');
                }

                attr[name] = value;
            }
        }

        // Convert the style into an array
        var styleObj = {};
        let tmp = style.split(/ *; */);
        for (let i=0; i<tmp.length; ++i) {
            tmp[i] = tmp[i].split(/ *: */)
            styleObj[tmp[i][0]] = tmp[i][1];
        }

        

        return {
            attr:   attr,
            type:   tagName,
            parent: svg,
            style:  styleObj
        };
    };







    //
    // The function that creates the path string
    //
    // @param coords array The array that contains X/Y pair
    //                     coordinates
    //
    RGraph.SVG.create.pathString = function (coords, initial = 'M')
    {
        var path = '{1} {2} {3}'.format(
            initial,
            coords[0][0],
            coords[0][1]
        );

        for (var i=0; i<coords.length; ++i) {
            path += ` L ${coords[i][0]} ${coords[i][1]}`;
        }

        return path;
    };








    //
    // Function that adds up all of the offsetLeft and offsetTops to get
    // X/Y coords for the mouse
    //
    //@param object e The event object
    //@return array   The X/Y coordinate pair representing the mouse
    //                location in relation to the SVG tag.
    //
    RGraph.SVG.getMouseXY = function(e)
    {
        // This is necessary for IE9
        if (!e.target) {
            return;
        }

        var el      = e.target,
            offsetX = 0,
            offsetY = 0,
            x,
            y;


        //if (typeof el.offsetParent !== 'undefined') { 
        //    do {
        //        offsetX += el.offsetLeft;
        //        offsetY += el.offsetTop;
        //    } while ((el = el.offsetParent));
        //}

        //x = e.pageX;
        //y = e.pageY;
        x = e.offsetX;
        y = e.offsetY;


        x -= 2 * (parseInt(document.body.style.borderLeftWidth) || 0);
        y -= 2 * (parseInt(document.body.style.borderTopWidth) || 0);

        // Return a javascript array with x and y defined
        return [x, y];
    };








    //
    // Draws an X axis
    //
    //@param The chart object
    //
    RGraph.SVG.drawXAxis = function (obj, opt = {})
    {
        var properties = obj.properties;

        // Draw the axis
        if (properties.xaxis && opt.xaxis !== false) {

            var y = obj.type === 'hbar' ? obj.height - properties.marginBottom : obj.getYCoord(obj.scale.min < 0 && obj.scale.max < 0 ? obj.scale.max : (obj.scale.min > 0 && obj.scale.max > 0 ? obj.scale.min : 0));

            var axis = RGraph.SVG.create({
                svg: obj.svg,
                parent: obj.svgAllGroup,
                type: 'path',
                attr: {
                    d: 'M{1} {2} L{3} {4}'.format(
                        properties.marginLeft,
                        y,
                        obj.width - properties.marginRight,
                        y
                    ),
                    fill: properties.xaxisColor,
                    stroke: properties.xaxisColor,
                    'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
                    'shape-rendering': 'crispEdges',
                    'stroke-linecap': 'square'
                }
            });


            // HBar X axis
            if (obj.type === 'hbar') {
                var width  = obj.graphWidth / obj.data.length,
                    x      = properties.marginLeft,
                    startY = (obj.height - properties.marginBottom),
                    endY   = (obj.height - properties.marginBottom) + properties.xaxisTickmarksLength;

            // Line/Bar/Waterfall/Scatter X axis
            } else {
                var width  = obj.graphWidth / obj.data.length,
                    x      = properties.marginLeft,
                    startY = obj.getYCoord(0) - (properties.yaxisScaleMin < 0 ? properties.xaxisTickmarksLength : 0),
                    endY   = obj.getYCoord(0) + properties.xaxisTickmarksLength;
                    
                if (obj.scale.min < 0 && obj.scale.max <= 0) {
                    startY = properties.marginTop;
                    endY   = properties.marginTop - properties.xaxisTickmarksLength;
                }

                if (obj.scale.min > 0 && obj.scale.max > 0) {
                    startY = obj.getYCoord(obj.scale.min);
                    endY   = obj.getYCoord(obj.scale.min) + properties.xaxisTickmarksLength;
                }

                if (obj.mirrorScale) {
                    startY = obj.height / 2 -  properties.xaxisTickmarksLength;
                    endY   = obj.height / 2 + properties.xaxisTickmarksLength;
                }
            }












            // Draw the tickmarks
            if (properties.xaxisTickmarks) {

                // The HBar uses a scale
                if (properties.xaxisScale) {
                
                    var zeroXCoord = obj.getXCoord(0);
                    var xmincoord  = obj.getXCoord(obj.min);

                    for (var i=0; i<(typeof properties.xaxisLabelsPositionEdgeTickmarksCount === 'number' ? properties.xaxisLabelsPositionEdgeTickmarksCount : (obj.scale.numlabels + (properties.yaxis && properties.xaxisScaleMin === 0 ? 0 : 1))); ++i) {

                        if (obj.type === 'hbar') {
                            var dataPoints = obj.data.length;
                        }
                    
                        x = properties.marginLeft + ((i+(properties.yaxis && properties.xaxisScaleMin === 0 && properties.yaxisPosition === 'left' ? 1 : 0)) * (obj.graphWidth / obj.scale.numlabels));

                        // Allow Manual specification of number of tickmarks
                        if (typeof properties.xaxisLabelsPositionEdgeTickmarksCount === 'number') {
                            dataPoints = properties.xaxisLabelsPositionEdgeTickmarksCount;
                            var gap    = (obj.graphWidth / properties.xaxisLabelsPositionEdgeTickmarksCount );
                            x          = (gap * i) + properties.marginLeft + gap;
                            
                            // Allow for the Y axis being on the right so the tickmarks
                            // have to be adjusted
                            if (properties.yaxisPosition === 'right') {
                                x -= gap;
                            }
                        }
                        
                        // Don't draw a tick at the zero position
                        if (
                                properties.yaxis
                            && (x < (zeroXCoord + 2) && x > (zeroXCoord - 2))
                           ) {
                            continue;
                        }
                        

                        
                        // Don't draw a tick at the zero position (another case)
                        if (
                                properties.yaxis
                            && obj.min > 0
                            && obj.max > obj.min
                            && i === 0
                           ) {
                            continue;
                        }
                        
                        // Don't draw a tick at the zero position (another case)
                        if (
                                properties.yaxis
                            && obj.max < 0
                            && obj.min < obj.max
                            && i === 5
                           ) {
                            continue;
                        }

                        RGraph.SVG.create({
                            svg: obj.svg,
                            parent: obj.svgAllGroup,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    x,
                                    startY,
                                    x,
                                    endY
                                ),
                                stroke: properties.xaxisColor,
                                'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
                                'shape-rendering': "crispEdges"
                            }
                        });
                        
                    }

                    // Draw an extra tickmark in some conditions. This
                    // is a bit of a edge-case
                    if (   properties.yaxisPosition === 'right'
                        && properties.xaxisScaleMin < 0
                        && properties.xaxisScaleMax > 0
                       ) {


                        RGraph.SVG.create({
                            svg: obj.svg,
                            parent: obj.svgAllGroup,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    obj.width - properties.marginRight,
                                    startY,
                                    obj.width - properties.marginRight,
                                    endY
                                ),
                                stroke: properties.xaxisColor,
                                'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }



                } else {

                    // This style is used by Bar and Scatter charts
                    if (properties.xaxisLabelsPosition === 'section') {

                        if (obj.type === 'bar' || obj.type === 'waterfall') {
                            var dataPoints = obj.data.length;
                        } else if (obj.type === 'line'){
                            var dataPoints = obj.data[0].length;
                        } else if (obj.type === 'scatter') {
                            var dataPoints = properties.xaxisLabels ? properties.xaxisLabels.length : 10;
                        }
                        
                        // Allow Manual specification of number of tickmarks
                        if (typeof properties.xaxisLabelsPositionSectionTickmarksCount === 'number') {
                            dataPoints = properties.xaxisLabelsPositionSectionTickmarksCount;
                        }

                        for (var i=0; i<dataPoints; ++i) {
        
                            // Allow for a right hand Y axis so move the tickmarks to the left
                            if (properties.yaxisPosition === 'right') {
                                x = properties.marginLeft + (properties.marginInnerLeft || 0) + (i * ( (obj.graphWidth - (properties.marginInnerLeft || 0) - (properties.marginInnerRight || 0) ) / dataPoints));
                            } else {
                                x = properties.marginLeft + (properties.marginInnerLeft || 0) + ((i+1) * ( (obj.graphWidth - (properties.marginInnerLeft || 0) - (properties.marginInnerRight || 0) ) / dataPoints));
                            }


                            RGraph.SVG.create({
                                svg: obj.svg,
                                parent: obj.svgAllGroup,
                                type: 'path',
                                attr: {
                                    d: 'M{1} {2} L{3} {4}'.format(
                                        x + 0.001,
                                        startY,
                                        x,
                                        endY
                                    ),
                                    stroke: properties.xaxisColor,
                                    'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
                                    'shape-rendering': "crispEdges"
                                }
                            });
                        }
                        
                        
                        // Draw an extra tickmark if the X axis is on the right but not being shown
                        if (properties.yaxisPosition === 'right' && !properties.yaxis) {
                            RGraph.SVG.create({
                                svg: obj.svg,
                                parent: obj.svgAllGroup,
                                type: 'path',
                                attr: {
                                    d: 'M{1} {2} L{3} {4}'.format(
                                        obj.width - properties.marginRight  + 0.001,
                                        startY,
                                        obj.width - properties.marginRight  + 0.001,
                                        endY
                                    ),
                                    stroke: properties.xaxisColor,
                                    'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
                                    'shape-rendering': "crispEdges"
                                }
                            });
                        }

                    // This style is used by line charts
                    } else if (properties.xaxisLabelsPosition === 'edge') {

                        if (typeof properties.xaxisLabelsPositionEdgeTickmarksCount === 'number') {
                            var len = properties.xaxisLabelsPositionEdgeTickmarksCount;
                        } else {
                            var len = obj.data && obj.data[0] && obj.data[0].length ? obj.data[0].length : 0;
                        }
    
                        for (var i=0; i<len; ++i) {

                            var gap = ( (obj.graphWidth) / (len - 1));

                            if (properties.yaxisPosition === 'right') {
                                x = properties.marginLeft + (i * gap);

                                // If the X position is within 3 pixels of the X position of the Y
                                // axis then skip it
                                if (properties.yaxis && x > (obj.width - properties.marginRight - 3) && x < (obj.width - properties.marginRight + 3)) {
                                    continue;
                                }
                            } else {
                                x = properties.marginLeft + ((i+1) * gap);
                            }
                            
                            // For some reason a tickmark is being drawn in the right margin
                            // so this prevents that.
                            if ( (!properties.yaxisPosition || properties.yaxisPosition === 'left') && x > (obj.width - properties.marginRight)) {
                                continue;
                            }
                            RGraph.SVG.create({
                                svg: obj.svg,
                                parent: obj.svgAllGroup,
                                type: 'path',
                                attr: {
                                    d: 'M{1} {2} L{3} {4}'.format(
                                        x + 0.001,
                                        startY,
                                        x,
                                        endY
                                    ),
                                    stroke: properties.xaxisColor,
                                    'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
                                    'shape-rendering': "crispEdges"
                                }
                            });
                        }
                    }
                }






                // Draw an extra tick if the Y axis is not being shown
                if (properties.yaxis === false || (properties.marginInnerLeft || 0) > 0) {
                    RGraph.SVG.create({
                        svg: obj.svg,
                        parent: obj.svgAllGroup,
                        type: 'path',
                        attr: {
                            d: 'M{1} {2} L{3} {4}'.format(
                                properties.marginLeft + (properties.marginInnerLeft || 0) + 0.001,
                                startY,
                                properties.marginLeft + (properties.marginInnerLeft || 0),
                                endY
                            ),
                            stroke: obj.properties.xaxisColor,
                            'stroke-width': typeof properties.xaxisLinewidth === 'number' ? properties.xaxisLinewidth : 1,
                            'shape-rendering': "crispEdges",
                            parent: obj.svgAllGroup,
                        }
                    });
                }
            }
        }











        //
        // Draw the labels
        //
        if (opt.labels !== false) {

            // Get the text configuration
            var textConf = RGraph.SVG.getTextConf({
                object: obj,
                prefix: 'xaxisLabels'
            });
    
            //
            // Draw an X axis scale
            //
            if (properties.xaxisScale) {
    
                if (obj.type === 'scatter') {
                    obj.xscale = RGraph.SVG.getScale({
                        object:    obj,
                        numlabels: properties.xaxisLabelsCount,
                        unitsPre:  properties.xaxisScaleUnitsPre,
                        unitsPost: properties.xaxisScaleUnitsPost,
                        max:       properties.xaxisScaleMax,
                        min:       properties.xaxisScaleMin,
                        point:     properties.xaxisScalePoint,
                        round:     properties.xaxisScaleRound,
                        thousand:  properties.xaxisScaleThousand,
                        decimals:  properties.xaxisScaleDecimals,
                        strict:    typeof properties.xaxisScaleMax === 'number',
                        formatter: properties.xaxisScaleFormatter
                    });
                    
                    
                    
                    
                    
                    
                    
                    var segment = obj.graphWidth / properties.xaxisLabelsCount
                    
                    for (var i=0; i<obj.xscale.labels.length; ++i) {
                    
                        var x = properties.marginLeft + (segment * i) + segment + properties.xaxisLabelsOffsetx;
                        var y = (obj.height - properties.marginBottom) + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
                    
                        RGraph.SVG.text({
                            
                            object: obj,
                            parent: obj.svgAllGroup,
                            tag:    'labels.xaxis',
                            
                            text:   obj.xscale.labels[i],
                            
                            x:      x,
                            y:      y,
                            
                            halign: 'center',
                            valign: 'top',
    
                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.italic,
                            color:  textConf.color
                        });
                    }
                    
                    
                    
                    
    
                    // Add the minimum label if labels are enabled
                    if (properties.xaxisLabelsCount > 0) {
                        var y   = obj.height - properties.marginBottom + properties.xaxisLabelsOffsety + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10),
                            str = RGraph.SVG.numberFormat({
                                object:     obj,
                                num:        properties.xaxisScaleMin.toFixed(properties.xaxisScaleDecimals),
                                prepend:    properties.xaxisScaleUnitsPre,
                                append:     properties.xaxisScaleUnitsPost,
                                point:      properties.xaxisScalePoint,
                                thousand:   properties.xaxisScaleThousand,
                                formatter:  properties.xaxisScaleFormatter
                            });
    
                        var text = RGraph.SVG.text({
                            
                            object: obj,
                            parent: obj.svgAllGroup,
                            tag:    'labels.xaxis',
                            
                            text: typeof properties.xaxisScaleFormatter === 'function' ? (properties.xaxisScaleFormatter)(this, properties.xaxisScaleMin) : str,
                            
                            x: properties.marginLeft + properties.xaxisLabelsOffsetx,
                            y: y,
                            
                            halign: 'center',
                            valign: 'top',
    
                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.italic,
                            color:  textConf.color
                        });
                    }
                
                
                // =========================================================================
                } else {
    
                    var segment = obj.graphWidth / properties.xaxisLabelsCount,
                        scale   = obj.scale;
    
                    for (var i=0; i<scale.labels.length; ++i) {
    
                        var x = properties.marginLeft + (segment * i) + segment + properties.xaxisLabelsOffsetx;
                        var y = (obj.height - properties.marginBottom) + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
    
                        // If the Y axis is positioned on the RHS then the
                        // labels should be reversed (HBar)
                        if (   (obj.type === 'hbar' || (obj.type === 'scatter' && properties.xaxis))
                            && properties.yaxisPosition === 'right'
                           ) {
                            x = obj.width - properties.marginRight - (segment * i) - segment + properties.xaxisLabelsOffsetx;
                        }
    
                        RGraph.SVG.text({
                            
                            object: obj,
                            parent: obj.svgAllGroup,
                            
                            text:   obj.scale.labels[i],
                            x:      x,
                            y:      y,
                            halign: 'center',
                            valign: 'top',
                            
                            tag:    'labels.xaxis',
                            
                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.italic,
                            color:  textConf.color
                        });
                        
                    }
                    
                    
                    
                    
        
                    // Add the minimum label if labels are enabled
                    if (properties.xaxisLabelsCount > 0) {
                        var y   = obj.height - properties.marginBottom + properties.xaxisLabelsOffsety + (properties.xaxis ? properties.xaxisTickmarksLength + 6 : 10),
                            str = RGraph.SVG.numberFormat({
                                object:     obj,
                                num:        properties.xaxisScaleMin.toFixed(properties.xaxisScaleDecimals),
                                prepend:    properties.xaxisScaleUnitsPre,
                                append:     properties.xaxisScaleUnitsPost,
                                point:      properties.xaxisScalePoint,
                                thousand:   properties.xaxisScaleThousand,
                                formatter:  properties.xaxisScaleFormatter
                            });
    
                        var text = RGraph.SVG.text({
                            
                            object: obj,
                            parent: obj.svgAllGroup,
                            tag:    'labels.xaxis',
                            
                            text: typeof properties.xaxisScaleFormatter === 'function' ? (properties.xaxisScaleFormatter)(this, properties.xaxisScaleMin) : str,
    
                            x: properties.yaxisPosition === 'right' ? obj.width - properties.marginRight + properties.xaxisLabelsOffsetx : properties.marginLeft + properties.xaxisLabelsOffsetx,
                            y: y,
                            
                            halign: 'center',
                            valign: 'top',
                            
                            font:   textConf.font,
                            size:   textConf.size,
                            bold:   textConf.bold,
                            italic: textConf.talic,
                            color:  textConf.color
                        });
                    }
                }
    
            //
            // Draw the X axis labels
            //
            } else {
                if (typeof properties.xaxisLabels === 'object' && !RGraph.SVG.isNullish(properties.xaxisLabels) ) {
    
                    var angle = properties.xaxisLabelsAngle;
    
                    // Loop through the X labels
                    if (properties.xaxisLabelsPosition === 'section') {
                    
                        var segment = (obj.width - properties.marginLeft - properties.marginRight - (properties.marginInnerLeft || 0) - (properties.marginInnerRight || 0) ) / properties.xaxisLabels.length;
                    
                        for (var i=0; i<properties.xaxisLabels.length; ++i) {
                        
                            var x = properties.marginLeft + (properties.marginInnerLeft || 0) + (segment / 2) + (i * segment);
    
                            if (obj.scale.max <=0 && obj.scale.min < obj.scale.max) {
                                var y = properties.marginTop - (RGraph.SVG.ISFF ? 5 : 10)  - (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
                                var valign = 'bottom';
                            } else {
                                var y = obj.height - properties.marginBottom + (RGraph.SVG.ISFF ? 5 : 10) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
                                var valign = 'top';
                            }
    
                            RGraph.SVG.text({
                                object:     obj,
                                parent:     obj.svgAllGroup,
                                tag:        'labels.xaxis',
                                text:       properties.xaxisLabels[i],
                                x:          x + properties.xaxisLabelsOffsetx,
                                y:          y,
                                valign:     (typeof angle === 'number' && angle) ? 'center' : valign,
                                halign:     (typeof angle === 'number' && angle) ? 'right' : 'center',
                                angle:      angle,
                                size:       textConf.size,
                                italic:     textConf.italic,
                                font:       textConf.font,
                                bold:       textConf.bold,
                                color:      textConf.color
                            });
                        }
    
                    } else if (properties.xaxisLabelsPosition === 'edge') {
        
                        if (obj.type === 'line') {
                            var hmargin = properties.marginInner;
                        } else {
                            var hmargin = 0;
                        }
        
        
        
                        var segment = (obj.graphWidth - hmargin - hmargin) / (properties.xaxisLabels.length - 1);
    
                        for (var i=0; i<properties.xaxisLabels.length; ++i) {
                        
                            var x = properties.marginLeft + (i * segment) + hmargin;
    
                            if (obj.scale.max <= 0 && obj.scale.min < 0) {
                                valign = 'bottom';
                                y = properties.marginTop - (RGraph.SVG.ISFF ? 5 : 10) - (properties.xaxisTickmarksLength - 5)  - (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety
                            } else {
                                valign = 'top';
                                y = obj.height - properties.marginBottom + (RGraph.SVG.ISFF ? 5 : 10) + (properties.xaxisTickmarksLength - 5) + (properties.xaxisLinewidth || 1) + properties.xaxisLabelsOffsety;
                            }
    
                            RGraph.SVG.text({
                                object: obj,
                                parent: obj.svgAllGroup,
                                tag:    'labels.xaxis',
                                text: properties.xaxisLabels[i],
                                x: x + properties.xaxisLabelsOffsetx,
                                y: y,
                                valign: (typeof angle === 'number' && angle) ? 'center' : valign,
                                halign: (typeof angle === 'number' && angle) ? 'right' : 'center',
                                angle: angle,
                                size:   textConf.size,
                                italic: textConf.italic,
                                font:   textConf.font,
                                bold:   textConf.bold,
                                color:  textConf.color
                            });
                        }
                    }
                }
            }
    
            // Save this so that it can be used for the title
            var labelsY = y + properties.xaxisLabelsOffsety;
        }

























        //
        // DRAW THE TITLE
        //
        if (properties.xaxisTitle && opt.title !== false) {

            // Get the size of the X axis labels
            var textConf_labels = RGraph.SVG.getTextConf({
                object: obj,
                prefix: obj.type === 'hbar' ? 'yaxisLabels' : 'xaxisLabels'
            });

            var x = properties.marginLeft + ((obj.width - properties.marginLeft - properties.marginRight) / 2) + (properties.xaxisTitleOffsetx || 0);
            var y = labelsY + (textConf_labels.size * 1.5);

            
            // Get the size of the X axis title
            //if (properties.xaxisScale || (properties.xaxisLabels && properties.xaxisLabels.length) ) {
            var textConf = RGraph.SVG.getTextConf({
                object: obj,
                prefix: 'xaxisTitle'
            });
            //}


            // Specific X and Y coordinates for the title
            if (typeof properties.xaxisTitleX === 'number') x = properties.xaxisTitleX;
            if (typeof properties.xaxisTitleY === 'number') y = properties.xaxisTitleY;

            RGraph.SVG.text({
                object: obj,
                parent: obj.svgAllGroup,
                tag:    'xaxisTitle',
                text:   String(properties.xaxisTitle),
                x:      x + (properties.xaxisTitleOffsetx || 0),
                y:      y + (properties.xaxisTitleOffsety || 0),
                valign: typeof properties.xaxisTitleValign === 'string' ? properties.xaxisTitleValign : 'top',
                halign: typeof properties.xaxisTitleHalign === 'string' ? properties.xaxisTitleHalign : 'center',
                size:   textConf.size,
                italic: textConf.italic,
                font:   textConf.font,
                bold:   textConf.bold,
                color:  textConf.color
            });
        }
    };








    //
    // Draws an Y axis
    //
    //@param The chart object
    //
    RGraph.SVG.drawYAxis = function (obj, opt = {})
    {
        var properties = obj.properties;

        if (properties.yaxis && opt.yaxis !== false) {

            // The X coordinate that the Y axis is positioned at
            if (obj.type === 'hbar') {
                
                var x = obj.getXCoord(properties.xaxisScaleMin > 0 ? properties.xaxisScaleMin : 0);
    
                if (properties.xaxisScaleMin < 0 && properties.xaxisScaleMax <= 0) {
                    x = obj.getXCoord(properties.xaxisScaleMax);
                }
            } else {
                if (properties.yaxisPosition === 'right') {
                    var x = obj.width - properties.marginRight;
                } else {
                    var x = properties.marginLeft;
                }
            }


            var axis = RGraph.SVG.create({
                svg: obj.svg,
                parent: obj.svgAllGroup,
                type: 'path',
                attr: {
                    d: 'M{1} {2} L{3} {4}'.format(
                        x,
                        properties.marginTop,
                        x,
                        obj.height - properties.marginBottom
                    ),
                    stroke: properties.yaxisColor,
                    fill: properties.yaxisColor,
                    'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
                    'shape-rendering': "crispEdges",
                    'stroke-linecap': 'square'
                }
            });

    
    
    

    

            if (obj.type === 'hbar') {

                var height = (obj.graphHeight - properties.marginInnerTop - properties.marginInnerBottom) / (properties.yaxisLabels.length || properties.yaxisTickmarksCount),
                    y      = properties.marginTop + properties.marginInnerTop,
                    len    = properties.yaxisLabels.length,
                    startX = obj.getXCoord(0) + (properties.xaxisScaleMin < 0 ? properties.yaxisTickmarksLength : 0),
                    endX   = obj.getXCoord(0) - properties.yaxisTickmarksLength;

                // Now change the startX/endX if the Y axisPosition is right
                if (properties.yaxisPosition == 'right') {
                    startX = obj.getXCoord(0) + (properties.xaxisScaleMax > 0 && properties.xaxisScaleMin < 0 ? -3 : 0);
                    endX   = obj.getXCoord(0) + properties.yaxisTickmarksLength;
                }

                // Edge case
                if (properties.xaxisScaleMin < 0 && properties.xaxisScaleMax <=0) {
                    startX = obj.getXCoord(properties.xaxisScaleMax);
                    endX   = obj.getXCoord(properties.xaxisScaleMax) + 5;
                }

                // Edge case
                if (properties.xaxisScaleMin > 0 && properties.xaxisScaleMax > properties.xaxisScaleMin && properties.yaxisPosition === 'left') {
                    startX = obj.getXCoord(properties.xaxisScaleMin);
                    endX   = obj.getXCoord(properties.xaxisScaleMin) -3;
                }
                
                // A custom number of tickmarks
                if (typeof properties.yaxisLabelsPositionSectionTickmarksCount === 'number') {
                    len    = properties.yaxisLabelsPositionSectionTickmarksCount;
                    height = (obj.graphHeight - properties.marginInnerTop - properties.marginInnerBottom) / len;
                }








                //
                // Draw the tickmarks
                //
                if (properties.yaxisTickmarks) {

                    for (var i=0; i<(len || properties.yaxisTickmarksCount); ++i) {

                        // Draw the Y axis tickmarks for the HBar
                        var tick = RGraph.SVG.create({
                            svg: obj.svg,
                            parent: obj.svgAllGroup,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX,
                                    y,
                                    endX,
                                    y + 0.001
                                ),
                                stroke: properties.yaxisColor,
                                'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
                                'shape-rendering': "crispEdges"
                            }
                        });

                        y += height;
                    }
    
    
                    // Draw an extra tick if the X axis position is not zero or
                    // if the xaxis is not being shown
                    if (properties.xaxis === false) {

                        if (obj.type === 'hbar' && properties.xaxisScaleMin <= 0 && properties.xaxisScaleMax < 0) {
                            var startX = obj.getXCoord(properties.xaxisScaleMax);
                            var endX   = obj.getXCoord(properties.xaxisScaleMax) + properties.yaxisTickmarksLength;

                        } else {
                            var startX = obj.getXCoord(0) - properties.yaxisTickmarksLength;
                            var endX   = obj.getXCoord(0) + (properties.xaxisScaleMin < 0 ? properties.yaxisTickmarksLength : 0);

                            if (properties.yaxisPosition === 'right') {
                                var startX = obj.getXCoord(0) - (obj.scale.min === 0 && !obj.mirrorScale ? 0 : properties.yaxisTickmarksLength);
                                var endX   = obj.getXCoord(0) + properties.yaxisTickmarksLength;
                            }
                        }

                        var axis = RGraph.SVG.create({
                            svg: obj.svg,
                            parent: obj.svgAllGroup,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX,
                                    Math.round(obj.height - properties.marginBottom - parseFloat(properties.marginInnerBottom)),

                                    endX,
                                    Math.round(obj.height - properties.marginBottom - parseFloat(properties.marginInnerBottom))
                                ),
                                stroke: obj.properties.yaxisColor,
                                'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                }







            //
            // Bar, Line etc types of chart
            //
            } else {

                var height = obj.graphHeight / properties.yaxisLabelsCount,
                    y      = properties.marginTop,
                    len    = properties.yaxisLabelsCount,
                    startX = properties.marginLeft,
                    endX   = properties.marginLeft - properties.yaxisTickmarksLength;

                // Adjust the startX and endX positions for when the Y axis is
                // on the RHS
                if (properties.yaxisPosition === 'right') {
                    startX = obj.width - properties.marginRight;
                    endX   = startX + properties.yaxisTickmarksLength;
                }

                // A custom number of tickmarks
                if (typeof properties.yaxisLabelsPositionEdgeTickmarksCount === 'number') {
                    len    = properties.yaxisLabelsPositionEdgeTickmarksCount;
                    height = obj.graphHeight / len;
                }

                //
                // Draw the tickmarks
                //
                if (properties.yaxisTickmarks) {

                
                    for (var i=0; i<len; ++i) {
                        
                        //var zeropoint = obj.getYCoord(obj.min);
                        
                        // Egde case
                        if ( 
                               !(obj.max <= 0 && obj.min < obj.max && y === obj.properties.marginTop)
                            && !(obj.min < 0 && obj.max > 0 && y <= (obj.getYCoord(0) + 1) && y >= (obj.getYCoord(0) - 1) )
                           ) {
    
                            // Avoid a tickmark at zero                        
                            //if (y > (zeropoint - 2) && y < (zeropoint + 2) && i === 0) {
                            //    y += height;
                            //    continue;
                            //}
    
                            // Draw the axis
                            var axis = RGraph.SVG.create({
                                svg: obj.svg,
                                parent: obj.svgAllGroup,
                                type: 'path',
                                attr: {
                                    d: 'M{1} {2} L{3} {4}'.format(
                                        startX,
                                        y,
                                        endX,
                                        y
                                    ),
                                    stroke: properties.yaxisColor,
                                    'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
                                    'shape-rendering': "crispEdges"
                                }
                            });
                        }
                        
                        y += height;
                    }
    
    
                    // Draw an extra tick if the X axis position is not zero or
                    // if the xaxis is not being shown
                    if (    (properties.yaxisScaleMin !== 0 || properties.xaxis === false || obj.mirrorScale)
                        && !(obj.scale.min > 0 && obj.scale.max > 0) ) {
                        
                        // Adjust the startX and endX positions for when the Y axis is
                        // on the RHS
                        if (properties.yaxisPosition === 'right') {
                            startX = obj.width - properties.marginRight;
                            endX   = startX + properties.yaxisTickmarksLength;
                        }

                        var axis = RGraph.SVG.create({
                            svg: obj.svg,
                            parent: obj.svgAllGroup,
                            type: 'path',
                            attr: {
                                d: 'M{1} {2} L{3} {4}'.format(
                                    startX,
                                    obj.height - properties.marginBottom,
                                    endX,
                                    obj.height - properties.marginBottom
                                ),
                                stroke: properties.yaxisColor,
                                'stroke-width': typeof properties.yaxisLinewidth === 'number' ? properties.yaxisLinewidth : 1,
                                'shape-rendering': "crispEdges"
                            }
                        });
                    }
                }
            }
        }


        if (opt.labels !== false) {

            // Get the text configuration
            var textConf = RGraph.SVG.getTextConf({
                object: obj,
                prefix: 'yaxisLabels'
            });
    
    
            //
            // Draw the Y axis labels
            //
            if (properties.yaxisScale) {
    
                var segment = (obj.height - properties.marginTop - properties.marginBottom) / properties.yaxisLabelsCount;
    
                for (var i=0; i<obj.scale.labels.length; ++i) {
    
                    var y = obj.height - properties.marginBottom - (segment * i) - segment;
    
                    RGraph.SVG.text({
                        
                        object: obj,
                        parent: obj.svgAllGroup,
                        tag:    'labels.yaxis',
                        
                        text:   obj.scale.labels[i],
    
                        x:      properties.yaxisPosition === 'right'
                                    ? (obj.width - properties.marginRight + 7 + (properties.yaxis ? (properties.yaxisTickmarksLength - 3) : 0) + properties.yaxisLabelsOffsetx)
                                    : (properties.marginLeft - 7 - (properties.yaxis ? (properties.yaxisTickmarksLength - 3) : 0) + properties.yaxisLabelsOffsetx),
                        y:      y + properties.yaxisLabelsOffsety,
    
                        halign: properties.yaxisLabelsHalign || (properties.yaxisPosition === 'right' ? 'left' : 'right'),
                        valign: properties.yaxisLabelsValign || 'center',
                        
                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color
                    });
                }
    
    
    
    
                //
                // Add the minimum label
                //
                var y   = obj.height - properties.marginBottom,
                    // Changed this to use obj.scale.min instead of properties.yaxisScaleMin
                    // on 11/11/18 because mirrored scales had zero as the bottom
                    // value when it should have been a mirror of the top value
                    str = (properties.yaxisScaleUnitsPre + obj.scale.min.toFixed(properties.yaxisScaleDecimals).replace(/\./, properties.yaxisScalePoint) + properties.yaxisScaleUnitsPost);
                    
                // Fix a bugettte that's showing the - sign after the unitsPre - should
                // be showing them before
                str = str.replace(properties.yaxisScaleUnitsPre + '-', '-' + properties.yaxisScaleUnitsPre);
    
                var text = RGraph.SVG.text({
                    
                    object: obj,
                    parent: obj.svgAllGroup,
                    tag:    'labels.yaxis',
                    
                    text: typeof properties.yaxisScaleFormatter === 'function' ? (properties.yaxisScaleFormatter)(this, properties.yaxisScaleMin) : str,
                    
                    x: properties.yaxisPosition === 'right'
                           ? (obj.width - properties.marginRight + 7 + (properties.yaxis ? (properties.yaxisTickmarksLength - 3) : 0) + properties.yaxisLabelsOffsetx)
                           : (properties.marginLeft - 7 - (properties.yaxis ? (properties.yaxisTickmarksLength - 3) : 0) + properties.yaxisLabelsOffsetx),
                    y: y + properties.yaxisLabelsOffsety,
    
                    halign: (properties.yaxisPosition === 'right' ? 'left' : 'right'),
                    valign: 'center',
                    
                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    color:  textConf.color
                });
            
            
            //
            // Draw Y axis labels (eg when specific labels are defined or
            // the chart is an HBar
            //
            } else if (properties.yaxisLabels && properties.yaxisLabels.length) {
    
                for (var i=0; i<properties.yaxisLabels.length; ++i) {
    
                    var segment = (obj.graphHeight - (properties.marginInnerTop || 0) - (properties.marginInnerBottom || 0) ) / properties.yaxisLabels.length,
                        y       = properties.marginTop + (properties.marginInnerTop || 0) + (segment * i) + (segment / 2) + properties.yaxisLabelsOffsety,
                        x       = properties.marginLeft - 7 - (properties.yaxisLinewidth || 1) + properties.yaxisLabelsOffsetx,
                        halign  = 'right';
                    
                    if (properties.yaxisPosition === 'right') {
                        halign = 'left';
                        x      = obj.width - properties.marginRight + 7 + (properties.yaxisLinewidth || 1) + properties.yaxisLabelsOffsetx;
                    }
    
                    // HBar labels
                    if (
                           obj.type === 'hbar'
                        && (
                              (obj.scale.min < obj.scale.max && obj.scale.max <= 0)
                            || properties.yaxisPosition === 'right'
                           )
                        ) {
    
                        halign = 'left';
                        x      = obj.width - properties.marginRight + 7 + properties.yaxisLabelsOffsetx;
                    
                    // HBar labels (again?)
                    } else if (obj.type === 'hbar' && !properties.yaxisLabelsSpecific) {
                        var segment = (obj.graphHeight - (properties.marginInnerTop || 0) - (properties.marginInnerBottom || 0) ) / (properties.yaxisLabels.length);
                        y = properties.marginTop + (properties.marginInnerTop || 0) + (segment * i) + (segment / 2) + properties.yaxisLabelsOffsety;
    
                    // Specific scale
                    } else {
                        var segment = (obj.graphHeight - (properties.marginInnerTop || 0) - (properties.marginInnerBottom || 0) ) / (properties.yaxisLabels.length - 1);
                        y = obj.height - properties.marginBottom - (segment * i) + properties.yaxisLabelsOffsety;
                    }
    
                    var text = RGraph.SVG.text({
    
                        object: obj,
                        parent: obj.svgAllGroup,
                        tag:    'labels.yaxis',
                        
                        text:   properties.yaxisLabels[i] ? properties.yaxisLabels[i] : '',
    
                        x:      x,
                        y:      y,
    
                        halign: halign,
                        valign: 'center',
    
                        font:   textConf.font,
                        size:   textConf.size,
                        bold:   textConf.bold,
                        italic: textConf.italic,
                        color:  textConf.color
                    });
                }
            }
        }
























        //
        // Draw the title
        //
        if (properties.yaxisTitle && opt.title !== false) {
            
            //
            // Get the text width of the labels so that the position of the title
            // can be adjusted
            //
            if (obj.scale && obj.scale.labels) {

                var textConf = RGraph.SVG.getTextConf({
                    object: obj,
                    prefix: 'yaxisLabels'
                });

                var maxLabelLength = RGraph.SVG.measureText({
                    text:   obj.scale.labels[obj.scale.labels.length - 1],
                    bold:   textConf.bold,
                    font:   textConf.font,
                    size:   textConf.size,
                    italic: textConf.italic
                })[0];
            }


            // If the chart is an HBar chart then the maximum length of the labels
            // needs to be calculated so that the Y axis title doesn't overlap them
            if ((obj.type === 'hbar' && properties.yaxisLabels && properties.yaxisLabels.length)) {
                maxLabelLength = (function (labels)
                {
                    var textConf = RGraph.SVG.getTextConf({
                        object: obj,
                        prefix: 'yaxisLabels'
                    });

                    for (var i=0,max=0; i<labels.length; ++i) {
                        var dim = RGraph.SVG.measureText({
                            text:   labels[i],
                            bold:   textConf.bold,
                            font:   textConf.font,
                            size:   textConf.size,
                            italic: textConf.italic
                        });

                        max = Math.max(max, dim[0]);
                    }

                    return max;
                })(properties.yaxisLabels);
            }

            var x = properties.yaxisPosition === 'right' ? (obj.width - properties.marginRight) + 5 + maxLabelLength + 10 : properties.marginLeft - 5 - maxLabelLength - 10;
            var y = ((obj.height - properties.marginTop - properties.marginBottom) / 2) + properties.marginTop;


            // Specific X and Y coordinates for the title
            if (typeof properties.yaxisTitleOffsetx === 'number') x += properties.yaxisTitleOffsetx;
            if (typeof properties.yaxisTitleOffsety === 'number') y += properties.yaxisTitleOffsety;

            // Specific X and Y coordinates for the title
            if (typeof properties.yaxisTitleX === 'number') x = properties.yaxisTitleX;
            if (typeof properties.yaxisTitleY === 'number') y = properties.yaxisTitleY;



            // Get the Y axis title configuration
            var textConf = RGraph.SVG.getTextConf({
                object: obj,
                prefix: 'yaxisTitle'
            });

            // Draw the text
            RGraph.SVG.text({

              object:     obj,
              parent:     obj.svgAllGroup,
              tag:        'yaxis.title',

                font:   textConf.font,
                size:   textConf.size,
                bold:   textConf.bold,
                italic: textConf.italic,
                color:  textConf.color,

                x:          x,
                y:          y,

                text:       properties.yaxisTitle.toString(),
                
                valign:     properties.yaxisTitleValign || 'bottom',
                halign:     properties.yaxisTitleHalign || 'center',
                
                angle: properties.yaxisPosition === 'right' ? 270 : 90
            });
        }
    };








    //
    // Parses a string or an array of strings for links and
    // linkifies it.
    //
    // @param string str The text to get the link out of
    //
    RGraph.SVG.extractLink = function (str)
    {
        if (str.match(/<a /) && str.match(/href="(.+?)"/i) ) {
        
            var anchor = RegExp.$1;

            // Get the text
            var text = str.replace(/<a .+>((.|\r|\n)*)<\/a>/i, '$1');

            // Determine if a target has been specified
            // and if so use it.
            if (str.match(/target="(.*?)"/)) {
                var target = RegExp.$1
            } else {
                var target = "_self";
            }

        } else {
            var text   = str;
            var anchor = null;
        }

        return {
            text: text,
            href: anchor,
            target: target
        };
    };







    //
    // Draws the background
    //
    // @param The chart object
    //
    RGraph.SVG.drawBackground = function (obj)
    {
        var properties = obj.properties;

        // Set these properties so that if it doesn't exist things don't fail
        if (typeof properties.variant3dOffsetx !== 'number') properties.variant3dOffsetx = 0;
        if (typeof properties.variant3dOffsety !== 'number') properties.variant3dOffsety = 0;




        if (properties.backgroundColor) {

            RGraph.SVG.create({
                svg:  obj.svg,
                parent: obj.svgAllGroup,
                type: 'rect',
                attr: {
                    x: -1 + properties.variant3dOffsetx + properties.marginLeft,
                    y: -1 - properties.variant3dOffsety + properties.marginTop,
                    width: parseFloat(obj.svg.getAttribute('width')) + 2 - properties.marginLeft - properties.marginRight,
                    height: parseFloat(obj.svg.getAttribute('height')) + 2 - properties.marginTop - properties.marginBottom,
                    fill: properties.backgroundColor
                }
            });
        }













        // Render a background image
        // <image xlink:href="firefox.jpg" x="0" y="0" height="50px" width="50px"/>
        if (properties.backgroundImage) {
        
            var attr = {
                'xlink:href': properties.backgroundImage,
                //preserveAspectRatio: 'xMidYMid slice',
                preserveAspectRatio: properties.backgroundImageAspect || 'none',
                x: properties.marginLeft,
                y: properties.marginTop
            };

            if (properties.backgroundImageStretch) {

                attr.x      = properties.marginLeft + properties.variant3dOffsetx;
                attr.y      = properties.marginTop + properties.variant3dOffsety;
                attr.width  = obj.width - properties.marginLeft - properties.marginRight;
                attr.height = obj.height - properties.marginTop - properties.marginBottom;

            } else {

                if (typeof properties.backgroundImageX === 'number') {
                    attr.x =  properties.backgroundImageX + properties.variant3dOffsetx;
                } else {
                    attr.x =  properties.marginLeft + properties.variant3dOffsetx;
                }

                if (typeof properties.backgroundImageY === 'number') {
                    attr.y =  properties.backgroundImageY + properties.variant3dOffsety;
                } else {
                    attr.y =  properties.marginTop + properties.variant3dOffsety;
                }

                if (typeof properties.backgroundImageW === 'number') {
                    attr.width =  properties.backgroundImageW;
                }
                 

                if (typeof properties.backgroundImageH === 'number') {
                    attr.height =  properties.backgroundImageH;
                }

            }

            //
            // Account for the chart being 3d
            //
            if (properties.variant === '3d') {
                attr.x += properties.variant3dOffsetx;
                attr.y -= properties.variant3dOffsety;
            }



            var img = RGraph.SVG.create({
                svg:  obj.svg,
                parent: obj.svgAllGroup,
                type: 'image',
                attr: attr,
                style: {
                    opacity: typeof properties.backgroundImageOpacity === 'number' ? properties.backgroundImageOpacity : 1
                }
            });
            
            // Set the width and height if necessary
            if (!properties.backgroundImageStretch) {
                var img2    = new Image();
                img2.src    = properties.backgroundImage;
                img2.onload = function ()
                {
                    if (properties.backgroundImageW === 'number') img.setAttribute('width', properties.backgroundImageW);
                    if (properties.backgroundImageH === 'number') img.setAttribute('height', properties.backgroundImageH);
                };
            }
        }











        if (properties.backgroundGrid) {

            var parts = [];



            // Add the horizontal lines to the path
            if (properties.backgroundGridHlines) {

                if (typeof properties.backgroundGridHlinesCount === 'number') {
                    var count = properties.backgroundGridHlinesCount;
                } else if (obj.type === 'hbar' || obj.type === 'bipolar') {
                    if (typeof properties.yaxisLabels === 'object' && !RGraph.SVG.isNullish(properties.yaxisLabels) && properties.yaxisLabels.length) {
                        var count = properties.yaxisLabels.length;
                    } else if (obj.type === 'hbar') {
                        var count = obj.data.length;
                    } else if (obj.type === 'bipolar') {
                        var count = obj.left.length;
                    }
                } else {
                    var count = properties.yaxisLabelsCount || 5;
                }

                for (var i=0; i<=count; ++i) {

                    parts.push('M{1} {2} L{3} {4}'.format(
                        properties.marginLeft + properties.variant3dOffsetx,
                        properties.marginTop + (obj.graphHeight / count) * i - properties.variant3dOffsety,
                        obj.width - properties.marginRight + properties.variant3dOffsetx,
                        properties.marginTop + (obj.graphHeight / count) * i - properties.variant3dOffsety
                    ));
                }


                // Add an extra background grid line to the path - this its
                // underneath the X axis and shows up if its not there.
                parts.push('M{1} {2} L{3} {4}'.format(
                    properties.marginLeft + properties.variant3dOffsetx,
                    obj.height - properties.marginBottom - properties.variant3dOffsety,
                    obj.width - properties.marginRight + properties.variant3dOffsetx,
                    obj.height - properties.marginBottom - properties.variant3dOffsety
                ));
            }



            // Add the vertical lines to the path
            if (properties.backgroundGridVlines) {

                if (obj.type === 'line' && RGraph.SVG.isArray(obj.data[0])) {
                    var len = obj.data[0].length;
                } else if (obj.type === 'hbar') {
                    var len = properties.xaxisLabelsCount || 10;
                } else if (obj.type === 'bipolar') {
                    var len = properties.xaxisLabelsCount || 10;
                } else if (obj.type === 'scatter') {
                    var len = (properties.xaxisLabels && properties.xaxisLabels.length) || 10;
                } else if (obj.type === 'waterfall') {
                    var len = obj.data.length;

                } else {
                    var len = obj.data.length;
                }

                var count = typeof properties.backgroundGridVlinesCount === 'number' ? properties.backgroundGridVlinesCount : len;

                if (properties.xaxisLabelsPosition === 'edge') {
                    count--;
                }
            
                for (var i=0; i<=count; ++i) {
                    parts.push('M{1} {2} L{3} {4}'.format(
                        properties.marginLeft + ((obj.graphWidth / count) * i) + properties.variant3dOffsetx,
                        properties.marginTop - properties.variant3dOffsety,
                        properties.marginLeft + ((obj.graphWidth / count) * i) + properties.variant3dOffsetx,
                        obj.height - properties.marginBottom - properties.variant3dOffsety
                    ));
                }
            }





            // Add the box around the grid
            if (properties.backgroundGridBorder) {
                parts.push('M{1} {2} L{3} {4} L{5} {6} L{7} {8} z'.format(
                    
                    properties.marginLeft + properties.variant3dOffsetx,
                    properties.marginTop  - properties.variant3dOffsety,
                    
                    obj.width - properties.marginRight + properties.variant3dOffsetx,
                    properties.marginTop - properties.variant3dOffsety,
                    
                    obj.width - properties.marginRight + properties.variant3dOffsetx,
                    obj.height - properties.marginBottom - properties.variant3dOffsety,
                    
                    properties.marginLeft + properties.variant3dOffsetx,
                    obj.height - properties.marginBottom - properties.variant3dOffsety
                ));
            }

            
            // Get the dash array if its defined to be dotted or dashed
            var dasharray;

            if (properties.backgroundGridDashed) {
                dasharray = [3,5];
            } else if (properties.backgroundGridDotted) {
                dasharray = [1,3];
            } else if (properties.backgroundGridDashArray) {
                dasharray = properties.backgroundGridDashArray;
            } else {
                dasharray = '';
            }


            // Now draw the path
            var grid = RGraph.SVG.create({
                svg: obj.svg,
                parent: obj.svgAllGroup,
                type: 'path',
                attr: {
                    className: 'rgraph_background_grid',
                    d: parts.join(' '),
                    stroke: properties.backgroundGridColor,
                    fill: 'rgba(0,0,0,0)',
                    'stroke-width': properties.backgroundGridLinewidth,
                    'shape-rendering': "crispEdges",
                    'stroke-dasharray': dasharray
                },
                style: {
                    pointerEvents: 'none'
                }
            });

        }



//
// Draw the backgroundBorder if requested
//
if (properties.backgroundBorder) {
    
    var color     = RGraph.SVG.isString(properties.backgroundBorderColor) ? properties.backgroundBorderColor : '#aaa';
    var linewidth = RGraph.SVG.isNumber(properties.backgroundBorderLinewidth) ? properties.backgroundBorderLinewidth : 1;
    var dasharray = '';
    
    // Dashed background border
    if (properties.backgroundBorderDashed) {
        dasharray = '3 5';
    }
    
    // Dotted background grid
    if (properties.backgroundBorderDotted) {
        dasharray = '1 3';
    }
    
    // Custom linedash
    if (RGraph.SVG.isArray(properties.backgroundBorderDashArray)) {
        dasharray = properties.backgroundBorderDashArray;
    }

    obj.create(
        '<rect x="{1}" y="{2}" width="{3}" height="{4}" fill="transparent" stroke="{5}" stroke-width="{6}" {7} {8} style="pointer-events: none"'.format(
            obj.properties.marginLeft,
            obj.properties.marginTop,
            obj.width - obj.properties.marginLeft - obj.properties.marginRight,
            obj.height - obj.properties.marginTop - obj.properties.marginBottom,
            color,
            linewidth,
            obj.properties.backgroundBorderDashed ? 'stroke-dasharray="3 5"' : '',
            obj.properties.backgroundBorderDotted && !obj.properties.backgroundBorderDashed ? 'stroke-dasharray="1 3"' : ''
        )
    );
}




        // Draw the title and subtitle
        if (obj.type !== 'bipolar') {
            RGraph.SVG.drawTitle(obj);
        }
    };








    //
    // Returns true/false as to whether the given variable is null or not
    // 
    // @param mixed arg The argument to check
    //
    RGraph.SVG.isNull = function (arg)
    {
        // must BE DOUBLE EQUALS - NOT TRIPLE
        if (arg == null || typeof arg === 'object' && !arg) {
            return true;
        }
        
        return false;
    };








    //
    // Returns true/false as to whether the given variable is
    // null or not. This function also returns true if the
    // variable is undefined
    // 
    // @param mixed obj The argument to check
    //
    RGraph.SVG.isNullish = function (obj)
    {
        // Check for undefined
        if (RGraph.SVG.isUndefined(obj)) {
            return true;
        }

        // Check for null
        if (RGraph.SVG.isNull(obj)) {
            return true;
        }
    
        return false;
    };








    //
    // Returns an appropriate scale. The return value is actualy an object consisting of:
    //  scale.max
    //  scale.min
    //  scale.scale
    // 
    // @param  opt object Configuration properties for the function
    // @return     object An object containg scale information
    //
    RGraph.SVG.getScale = function (opt)
    {
        var obj          = opt.object,
            properties   = obj.properties,
            numlabels    = opt.numlabels,
            unitsPre     = opt.unitsPre,
            unitsPost    = opt.unitsPost,
            max          = Number(opt.max),
            min          = Number(opt.min),
            strict       = opt.strict,
            decimals     = Number(opt.decimals),
            point        = opt.point,
            thousand     = opt.thousand,
            originalMax  = max,
            round        = opt.round,
            scale        = {max:1,labels:[],values:[]},
            formatter    = opt.formatter;


        //
        // Special case for 0
        // 
        // ** Must be first **
        //

        if (max === 0 && min === 0) {

            var max = 1;

            for (var i=0; i<numlabels; ++i) {

                var label = ((((max - min) / numlabels) * (i + 1)) + min).toFixed(decimals);

                scale.labels.push(unitsPre + label + unitsPost);
                scale.values.push(parseFloat(label))
            }

        //
        // Manually do decimals
        //
        } else if (max <= 1 && !strict) {

            var arr = [
                1,0.5,
                0.10,0.05,
                0.010,0.005,
                0.0010,0.0005,
                0.00010,0.00005,
                0.000010,0.000005,
                0.0000010,0.0000005,
                0.00000010,0.00000005,
                0.000000010,0.000000005,
                0.0000000010,0.0000000005,
                0.00000000010,0.00000000005,
                0.000000000010,0.000000000005,
                0.0000000000010,0.0000000000005
            ], vals = [];



            for (var i=0; i<arr.length; ++i) {
                if (max > arr[i]) {
                    i--;
                    break;
                }
            }


            scale.max    = arr[i]
            scale.labels = [];
            scale.values = [];


            for (var j=0; j<numlabels; ++j) {
                
                var value = ((((arr[i] - min) / numlabels) * (j + 1)) + min).toFixed(decimals);

                scale.values.push(value);
                scale.labels.push(RGraph.SVG.numberFormat({
                    object: obj,
                    num: value,
                    prepend: unitsPre,
                    append: unitsPost,
                    point: properties.yaxisScalePoint,
                    thousand: properties.yaxisScaleThousand,
                    formatter: formatter
                }));
            }




        } else if (!strict) {

            //
            // Now comes the scale handling for integer values
            //

            // This accommodates decimals by rounding the max up to the next integer
            max = Math.ceil(max);

            var interval = Math.pow(10, Math.max(1, Number(String(Number(max) - Number(min)).length - 1)) );
            var topValue = interval;

            while (topValue < max) {
                topValue += (interval / 2);
            }

            // Handles cases where the max is (for example) 50.5
            if (Number(originalMax) > Number(topValue)) {
                topValue += (interval / 2);
            }

            // Custom if the max is greater than 5 and less than 10
            if (max <= 10) {
                topValue = (Number(originalMax) <= 5 ? 5 : 10);
            }
    
    
            // Added 02/11/2010 to create "nicer" scales
            if (obj && typeof round == 'boolean' && round) {
                topValue = 10 * interval;
            }

            scale.max = topValue;


            for (var i=0; i<numlabels; ++i) {

                var label = RGraph.SVG.numberFormat({
                    object: obj,
                    num: ((((i+1) / numlabels) * (topValue - min)) + min).toFixed(decimals),
                    prepend: unitsPre,
                    append: unitsPost,
                    point: point,
                    thousand: thousand,
                    formatter: formatter
                });

                scale.labels.push(label);
                scale.values.push(((((i+1) / numlabels) * (topValue - min)) + min).toFixed(decimals));
            }

        } else if (typeof max === 'number' && strict) {

            //
            // ymax is set and also strict
            //
            for (var i=0; i<numlabels; ++i) {
                
                scale.labels.push(RGraph.SVG.numberFormat({
                    object: obj,
                    formatter: formatter,
                    num: ((((i+1) / numlabels) * (max - min)) + min).toFixed(decimals),
                    prepend: unitsPre,
                    append: unitsPost,
                    point: point,
                    thousand: thousand
                }));


                scale.values.push(
                    ((((i+1) / numlabels) * (max - min)) + min).toFixed(decimals)
                );
            }

            // ???
            scale.max = max;
        }

        
        scale.unitsPre  = unitsPre;
        scale.unitsPost = unitsPost;
        scale.point     = point;
        scale.decimals  = decimals;
        scale.thousand  = thousand;
        scale.numlabels = numlabels;
        scale.round     = Boolean(round);
        scale.min       = min;

        //
        // Convert all of the scale values to numbers
        //
        for (var i=0; i<scale.values.length; ++i) {
            scale.values[i] = parseFloat(scale.values[i]);
        }

        return scale;
    };








    //
    // Pads/fills the array
    // 
    // @param  array arr The array
    // @param  int   len The length to pad the array to
    // @param  mixed     The value to use to pad the array (optional)
    //
    //RGraph.SVG.arrayFill = 
    //RGraph.SVG.arrayPad  = function (opt)
    //{
    //    var arr   = opt.array,
    //        len   = opt.length,
    //        value = (typeof opt.value === 'undefined' ? null : opt.value);

    //    if (arr.length < len) {            
    //        for (var i=arr.length; i<len; i+=1) {
    //            arr[i] = value;
    //        }
    //    }
    //    
    //    return arr;
    //};








    //
    // A convenient way to get the last element in the array:
    //
    // foo = [8,6,6,7,4,2,3,8];
    // RGraph.arrayLast(foo); // 8
    //
    // @param array array The array to get the last element from
    //
    RGraph.SVG.arrayLast = function (array)
    {
        return array[array.length - 1];
    };








    //
    // An array sum function
    // 
    // @param  array arr The  array to calculate the total of
    // @return int       The summed total of the arrays elements
    //
    RGraph.SVG.arraySum = function (arr)
    {
        // Allow integers
        if (typeof arr === 'number') {
            return arr;
        }
        
        // Account for null
        if (RGraph.SVG.isNullish(arr)) {
            return 0;
        }

        var i, sum, len = arr.length;

        for(i=0,sum=0;i<len;sum+=arr[i++]);

        return sum;
    };








    //
    // Returns the maximum numeric value which is in an array. This function IS NOT
    // recursive
    // 
    // @param  array arr The array (can also be a number, in which case it's returned as-is)
    // @param  int       Whether to ignore signs (ie negative/positive)
    // @return int       The maximum value in the array
    //
    RGraph.SVG.arrayMax = function (arr)
    {
        var max = null
        
        if (typeof arr === 'number') {
            return arr;
        }
        
        if (RGraph.SVG.isNullish(arr)) {
            return 0;
        }

        for (var i=0,len=arr.length; i<len; ++i) {
            if (typeof arr[i] === 'number') {

                var val = arguments[1] ? Math.abs(arr[i]) : arr[i];

                if (typeof max === 'number') {
                    max = Math.max(max, val);
                } else {
                    max = val;
                }
            }
        }

        return max;
    };








    //
    // Returns the minimum numeric value which is in an array
    // 
    // @param  array arr The array (can also be a number, in which case it's returned as-is)
    // @param  int       Whether to ignore signs (ie negative/positive)
    // @return int       The minimum value in the array
    //
    RGraph.SVG.arrayMin = function (arr)
    {
        var max = null,
            min = null,
            ma  = Math;
        
        if (typeof arr === 'number') {
            return arr;
        }
        
        if (RGraph.SVG.isNullish(arr)) {
            return 0;
        }

        for (var i=0,len=arr.length; i<len; ++i) {
            if (typeof arr[i] === 'number') {

                var val = arguments[1] ? Math.abs(arr[i]) : arr[i];
                
                if (typeof min === 'number') {
                    min = Math.min(min, val);
                } else {
                    min = val;
                }
            }
        }

        return min;
    };








    //
    // Returns the maximum value which is in an array
    // 
    // @param  array arr The array
    // @param  int   len The length to pad the array to
    // @param  mixed     The value to use to pad the array (optional)
    //
    RGraph.SVG.arrayFill =
    RGraph.SVG.arrayPad = function (args)
    {
        if (arguments.length === 1) {
            var arr = args.array,
                val = args.value,
                len = args.length;
        } else {
            var arr = arguments[0],
                len = arguments[1],
                val = arguments[2];
        }

        if (arr.length < len) {
            
            var val = typeof val !== 'undefined' ? val : null;
            
            for (var i=arr.length; i<len; i+=1) {
                arr[i] = val;
            }
        }

        return arr;
    };








    //
    // An array sum function
    // 
    // @param  array arr The  array to calculate the total of
    // @return int       The summed total of the arrays elements
    //
    RGraph.SVG.arraySum = function (arr)
    {
        // Allow integers
        if (typeof arr === 'number') {
            return arr;
        }
        
        // Account for null
        if (RGraph.SVG.isNullish(arr)) {
            return 0;
        }

        var i, sum, len = arr.length;

        for(i=0,sum=0;i<len;sum+=arr[i++]);

        return sum;
    };








    //
    // Takes any number of arguments and adds them to one big linear array
    // which is then returned
    // 
    // @param ... mixed The data to linearise. You can strings, booleans, numbers or arrays
    //
    RGraph.SVG.arrayLinearize = function ()
    {
        var arr  = [],
            args = arguments

        for (var i=0,len=args.length; i<len; ++i) {

            if (typeof args[i] === 'object' && args[i]) {
                for (var j=0,len2=args[i].length; j<len2; ++j) {
                    var sub = RGraph.SVG.arrayLinearize(args[i][j]);
                    
                    for (var k=0,len3=sub.length; k<len3; ++k) {
                        arr.push(sub[k]);
                    }
                }
            } else {
                arr.push(args[i]);
            }
        }

        return arr;
    };








    //
    // Takes one off the front of the given array and returns the new array.
    // 
    // @param array arr The array from which to take one off the front of array 
    // 
    // @return array The new array
    //
    RGraph.SVG.arrayShift = function(arr)
    {
        var ret = [];
        
        for(var i=1,len=arr.length; i<len; ++i) {
            ret.push(arr[i]);
        }
        
        return ret;
    };








    //
    // Reverses the order of an array
    // 
    // @param array arr The array to reverse
    //
    RGraph.SVG.arrayReverse = function (arr)
    {
        if (!arr) {
            return;
        }

        var newarr=[];

        for(var i=arr.length - 1; i>=0; i-=1) {
            newarr.push(arr[i]);
        }
        
        return newarr;
    };









    //
    // An updated clone function that works better
    //
    // @param array mixed The variable to clone and
    //                    return a copy of. Doesn't
    //                    clone objects.
    // @param maxdepth int The maximumdepth recursion sahould go
    //
    RGraph.SVG.arrayClone = function (array, objects = false, maxdepth = 5)
    {
        // This is here to limit recurusion
        if (maxdepth < 0) {
            return;
        }

        var ret = null;

        // Account for undefined values
        if (typeof array === 'undefined') {
            return undefined;
        }

        // Account for null values
        if (typeof array === 'object' && !array) {
            return null;
        }


        switch(typeof array)
        {
            case 'string':
                ret = (function (str){return String(str)})(array);
                break;
            
            case 'number':
                ret = (function (num){return Number(num)})(array);
                break;

            case 'boolean':
                ret = array;
                break;

            case 'object':
                if (array.constructor.toString().indexOf('Array') >= 0) {
                    ret = new Array();  
                    for (var i=0; i<array.length; ++i) {
                        ret[i] = RGraph.SVG.arrayClone(array[i], objects, maxdepth - 1);
                    }
                } else if (array.constructor.toString().indexOf('Object') > 0 && objects) {
                    ret = new Object();
                    for (var i in array) {
                        ret[i] = RGraph.SVG.arrayClone(array[i], true, maxdepth - 1);
                    }
                }
                break;
            
            case 'function':
                ret = array;
                break;
        }

        return ret;
    };








    //
    // Converts an the truthy values to falsey values and vice-versa
    //
    RGraph.SVG.arrayInvert = function (arr)
    {
        for (var i=0,len=arr.length; i<len; ++i) {
            arr[i] = !arr[i];
        }

        return arr;
    };








    //
    // An array_trim function that removes the empty elements off
    //both ends
    //
    RGraph.SVG.arrayTrim = function (arr)
    {
        var out = [], content = false;

        // Trim the start
        for (var i=0; i<arr.length; i++) {
        
            if (arr[i]) {
                content = true;
            }
        
            if (content) {
                out.push(arr[i]);
            }
        }
        
        // Reverse the array and trim the start again
        out = RGraph.SVG.arrayReverse(out);

        var out2 = [], content = false ;
        for (var i=0; i<out.length; i++) {
        
            if (out[i]) {
                content = true;
            }
        
            if (content) {
                out2.push(out[i]);
            }
        }
        
        // Now reverse the array and return it
        out2 = RGraph.SVG.arrayReverse(out2);

        return out2;
    };








    //
    // Determines if the given object is an array or not
    // 
    // @param mixed obj The variable to test
    //
    RGraph.SVG.isArray = function (obj)
    {
        if (obj && obj.constructor) {
            var pos = obj.constructor.toString().indexOf('Array');
        } else {
            return false;
        }

        return obj != null &&
               typeof pos === 'number' &&
               pos > 0 &&
               pos < 20;
    };








    //
    // Returns the absolute value of a number. You can also pass in an
    // array and it will run the abs() function on each element. It
    // operates recursively so sub-arrays are also traversed.
    // 
    // @param array arr The number or array to work on
    //
    RGraph.SVG.abs = function (value)
    {
        if (typeof value === 'string') {
            value = parseFloat(value) || 0;
        }

        if (typeof value === 'number') {
            return Math.abs(value);
        }

        if (typeof value === 'object') {
            for (i in value) {
                if (   typeof i === 'string'
                    || typeof i === 'number'
                    || typeof i === 'object') {

                    value[i] = RGraph.SVG.abs(value[i]);
                }
            }
            
            return value;
        }
        
        return 0;
    };








    //
    // Formats a number with thousand seperators so it's easier to read
    //
    // @param opt object The options to the function
    //
    RGraph.SVG.numberFormat = function (opt)
    {
        var obj                = opt.object,
            prepend            = opt.prepend ? String(opt.prepend) : '',
            append             = opt.append ? String(opt.append) : '',
            output             = '',
            decimal_seperator  = typeof opt.point === 'string' ? opt.point : '.',
            thousand_seperator = typeof opt.thousand === 'string' ? opt.thousand : ',',
            num                = opt.num
            decimals_trim      = opt.decimals_trim;

        RegExp.$1   = '';

        if (typeof opt.formatter === 'function') {
            return opt.formatter(obj, num);
        }

        // Ignore the preformatted version of "1e-2"
        if (String(num).indexOf('e') > 0) {
            return String(prepend + String(num) + append);
        }

        // We need then number as a string
        num = String(num);
        
        // Take off the decimal part - we re-append it later
        if (num.indexOf('.') > 0) {
            var tmp = num;
            num     = num.replace(/\.(.*)/, ''); // The front part of the number
            decimal = tmp.replace(/(.*)\.(.*)/, '$2'); // The decimal part of the number
        } else {
            decimal = '';
        }

        // Thousand seperator
        //var seperator = arguments[1] ? String(arguments[1]) : ',';
        var seperator = thousand_seperator;
        
        //
        // Work backwards adding the thousand seperators
        //
        var foundPoint;
        for (i=(num.length - 1),j=0; i>=0; j++,i--) {
            var character = num.charAt(i);
            
            if ( j % 3 == 0 && j != 0) {
                output += seperator;
            }
            
            //
            // Build the output
            //
            output += character;
        }
        
        //
        // Now need to reverse the string
        //
        var rev = output;
        output = '';
        for (i=(rev.length - 1); i>=0; i--) {
            output += rev.charAt(i);
        }

        // Tidy up
        //output = output.replace(/^-,/, '-');
        if (output.indexOf('-' + thousand_seperator) == 0) {
            output = '-' + output.substr(('-' + thousand_seperator).length);
        }

        // Reappend the decimal
        if (decimal.length) {
            output =  output + decimal_seperator + decimal;
            decimal = '';
            RegExp.$1 = '';
        }

        //
        // Trim the decimals if it's all zeros
        //
        if (decimals_trim) {
            output = output.replace(/0+$/,'');
            output = output.replace(/\.$/,'');
        }

        // Minor bugette
        if (output.charAt(0) == '-') {
            output = output.replace(/-/, '');
            prepend = '-' + prepend;
        }

        return prepend + output + append;
    };








    //
    // A function that adds text to the chart
    //
    RGraph.SVG.text = function (opt)
    {
        // Get the defaults for the text function from RGraph.SVG.text.defaults object
        for (var i in RGraph.SVG.text.defaults) {
            if (typeof i === 'string' && typeof opt[i] === 'undefined') {
                opt[i] = RGraph.SVG.text.defaults[i];
            }
        }

        var   obj = opt.object,
           parent = opt.parent || opt.object.svgAllGroup,
             size = typeof opt.size === 'number' ? opt.size + 'pt' : (typeof opt.size === 'string' ? opt.size.replace(/pt$/,'') : 12) + 'pt',
             bold = opt.bold ? 'bold' : 'normal',
             font = opt.font ? opt.font : 'sans-serif',
           italic = opt.italic ? 'italic' : 'normal',
           halign = opt.halign,
           valign = opt.valign,
              str = opt.text,
                x = opt.x,
                y = opt.y,
            color = opt.color ? opt.color : (opt.link ? 'blue' : 'black'),
       background = opt.background || null,
backgroundRounded = opt.backgroundRounded || 0,
          padding = opt.padding || 0,
             link = opt.link || '',
       linkTarget = opt.linkTarget || '_blank',
           events = (opt.events === true || opt.link ? true : false),
           angle  = opt.angle;




        
        
        //
        // Change numbers to strings
        //
        if (typeof str === 'number') {
            str = String(str);
        }
        
        //
        // Change null values to an empty string
        //
        if (RGraph.SVG.isNullish(str)) {
            str = '';
        }
        
        //
        // If the string starts with a carriage return add a
        // unicode non-breaking space to the start of it.
        //
        if (str && str.substr(0,2) == '\r\n' || str.substr(0,1) === '\n') {
            str = "\u00A0" + str;
        }




        // Horizontal alignment
        if (halign === 'right') {
            halign = 'end';
        } else if (halign === 'center' || halign === 'middle') {
            halign = 'middle';
        } else {
            halign = 'start';
        }

        // Vertical alignment
        if (valign === 'top') {
            valign = 'hanging';
        } else if (valign === 'center' || valign === 'middle') {
            valign = 'central';
            valign = 'middle';
        } else {
            valign = 'bottom';
        }

        //
        // If a link has been specified then the text node should
        // be a child of an <a> node
        if (link) {
            
            var a = RGraph.SVG.create({
                svg: obj.svg,
                type: 'a',
                parent: parent,
                attr: {
                    'xlink:href': link,
                    target: linkTarget
                }
            });
            
            // Configure the appearance of the links
            if (opt.object.properties.textLinkBold)                       bold    = 'bold';
            if (opt.object.properties.textLinkItalic)                     italic  = 'italic';
            if (opt.object.properties.textLinkFont)                       font    = opt.object.properties.textLinkFont;
            if (RGraph.SVG.isNumber(opt.object.properties.textLinkSize))  size    = opt.object.properties.textLinkSize;
            if (RGraph.SVG.isString(opt.object.properties.textLinkColor)) {color  = opt.object.properties.textLinkColor} else {color = 'blue'; };

        } else if (str.match(/<a /)) {

            var link = RGraph.SVG.extractLink(str);

            // Set the text to that which doesn't have
            // the <a> wrapper
            str = link.text;
            
            
            if (link.href) {

                var a = RGraph.SVG.create({
                    svg: obj.svg,
                    type: 'a',
                    parent: parent,
                    attr: {
                        'xlink:href': link.href,
                        target: link.target
                    }
                });
                
                events = true;
                
                // Configure the appearance of the links
                if (opt.object.properties.textLinkBold)                       bold   = 'bold';
                if (opt.object.properties.textLinkItalic)                     italic = 'italic';
                if (opt.object.properties.textLinkFont)                       font   = opt.object.properties.textLinkFont;
                if (RGraph.SVG.isNumber(opt.object.properties.textLinkSize))  size   = opt.object.properties.textLinkSize;
                if (RGraph.SVG.isString(opt.object.properties.textLinkColor)) {color  = opt.object.properties.textLinkColor} else {color = 'blue'; };

            }
        }

        //
        // Text does not include carriage returns
        //
        if (str && str.indexOf && str.indexOf("\n") === -1) {

            var text = RGraph.SVG.create({
                svg: obj.svg,
                parent: link ? a : opt.parent,
                type: 'text',
                attr: {
                    tag: opt.tag ? opt.tag : '',        // This is the same as the below
                    'data-tag': opt.tag ? opt.tag : '', // This is the same as the above
                    fill: color,
                    x: x,
                    y: y,
                    'font-size':         size,
                    'font-weight':       bold,
                    'font-family':       font,
                    'font-style':        italic,
                    'text-anchor':       halign,
                    'dominant-baseline': valign,
                    'text-decoration': link && link.href && opt.object.properties.textLinkUnderline ? 'underline' : 'none'
                }
            });
    
            var textNode = document.createTextNode(str);
            text.appendChild(textNode);

            if (!events) {
                text.style.pointerEvents = 'none';
            }


        
        //
        // Includes carriage returns
        //
        } else if (str && str.indexOf) {// <-- Is this intentional???
            
            // Measure the text
            var dimensions = RGraph.SVG.measureText({
                text: 'My',
                bold: bold,
                font: font,
                size: size
            });
            
            var lineHeight = dimensions[1];

            str = str.split(/\r?\n/);





            //
            // Account for the carriage returns and move the text
            // up as required
            //
            if (valign === 'bottom') {
                y -= str.length * lineHeight;
            }

            if (valign === 'center' || valign === 'middle') {
                y -= (str.length * lineHeight) / 2;
            }





            var text = RGraph.SVG.create({
                svg: obj.svg,
                parent: link ? a : opt.parent,
                type: 'text',
                attr: {
                    tag: opt.tag ? opt.tag : '',
                    fill: (link && link.href) ? (opt.object.properties.textLinkColor || 'blue') : color,
                    x: x,
                    y: y,
                    'font-size':         size,
                    'font-weight':       bold,
                    'font-family':       font,
                    'font-style':        italic,
                    'text-anchor':       halign,
                    'dominant-baseline': valign,
                    
                    // TODO Add a test for the textLinkUnderline
                    //      property here
                    'text-decoration': link && link.href && opt.object.properties.textLinkUnderline? 'underline' : 'none'
                }
            });

            if (!events) {
                text.style.pointerEvents = 'none';
            }


            for (var i=0; i<str.length; ++i) {

                var tspan = RGraph.SVG.create({
                    svg: obj.svg,
                    parent: text,
                    type: 'tspan',
                    attr: {
                        x: x,
                        dy: dimensions ? (dimensions[1] * (i ? 1 : 0)) + 3 : 0
                    }
                });

                var textNode = document.createTextNode(str[i]);
                tspan.appendChild(textNode);

                if (!events) {
                    tspan.style.pointerEvents = 'none';
                }

                var dimensions = RGraph.SVG.measureText({
                    text: str[i],
                    bold: bold,
                    font: font,
                    size: parseInt(size)
                });
            }
        }
        
        
        // Now add the rotation if necessary
        if (typeof angle === 'number' && angle && text) {
            text.setAttribute('x', 0);
            text.setAttribute('y', 0);
            text.setAttribute('transform', 'translate({1} {2}) rotate({3})'.format(x, y, -1 * angle));
        }



        //
        // Add a background color if specified
        //

        if (typeof background === 'string') {

            var parent = link ? a : parent;

            var bbox = text.getBBox(),
                rect = RGraph.SVG.create({
                    svg:    obj.svg,
                    parent: parent,
                    type:   'rect',
                    attr: {
                        x:      bbox.x - padding,
                        y:      bbox.y - padding,
                        width:  bbox.width + (padding * 2),
                        height: bbox.height + (padding * 2),
                        fill:   background,
                        rx: backgroundRounded,
                        ry: backgroundRounded
                    }
                });

                
                if (!events) {
                    rect.style.pointerEvents = 'none';
                }

            text.parentNode.insertBefore(rect, text);
        }



        if (RGraph.SVG.ISIE && (valign === 'hanging') && text) {
            text.setAttribute('y', y + (text.scrollHeight / 2));

        } else if (RGraph.SVG.ISIE && valign === 'middle' && text) {
            text.setAttribute('y', y + (text.scrollHeight / 3));
        }




        if (RGraph.SVG.ISFF && text) {
            Y = y + (text.scrollHeight / 3);
        }
        
        return text;
    };
    
    RGraph.SVG.text.defaults = {};








    //
    // Helps you get hold of the SPAN tag nodes that hold the text on the chart
    //
    RGraph.SVG.text.find = function (opt)
    {
        // Search criteria should include:
        //  o text (literal string and regex)
        if (typeof opt.object === 'object' && opt.object.isRGraph) {
            var svg = opt.object.svg;
        } else if (typeof opt.svg === 'object' && opt.svgAllGroup) {
            var svg    = opt.svg;
            opt.object = svg.__object__;
        }
        
        // Look for text nodes based on the text
        var nodes = svg.getElementsByTagName('text');
        var found = [];

        for (var i=0,len=nodes.length; i<len; ++i) {

            var text = false,
                tag  = false;

            // Exact match or regex on the text
            if (typeof opt.text === 'string' && nodes[i].innerHTML === opt.text) {
                text = true;
            } else if (typeof opt.text === 'object' && nodes[i].innerHTML.match(opt.text)) {
                text = true;
            } else if (typeof opt.text === 'undefined') {
                text = true;
            }


            // Exact match or regex on the tag
            if (typeof opt.tag === 'string' && nodes[i].getAttribute('tag') === opt.tag) {
                tag = true;
            } else if (typeof opt.tag === 'object' && nodes[i].getAttribute('tag').match(opt.tag)) {
                tag = true;
            } else if (typeof opt.tag === 'undefined') {
                tag = true;
            }


            // Did all of the conditions pass?
            if (text === true && tag === true) {
                found.push(nodes[i])
            }
        }

        // If a callback has been specified then call it whilst
        // passing it the text
        if (typeof opt.callback === 'function') {
            (opt.callback)({nodes: found,object: opt.object});
        }

        return found;
    };








    //
    // Creates a UID that is applied to the object
    //
    RGraph.SVG.createUID = function ()
    {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c)
        {
            var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
            return v.toString(16);
        });
    };








    //
    // Determines if the SVG DIV container is fixed
    //
    RGraph.SVG.isFixed = function (svg)
    {
        var obj = svg.parentNode,
            i   = 0;

        while (obj && obj.tagName.toLowerCase() != 'body' && i < 99) {

            if (obj.style.position === 'fixed') {
                return obj;
            }
            
            obj = obj.offsetParent;
        }

        return false;
    };








    //
    // Sets an object in the RGraph registry
    // 
    // @param string name The name of the value to set
    //
    RGraph.SVG.REG.set = function (name, value)
    {
        RGraph.SVG.REG.store[name] = value;
        
        return value;
    };








    //
    // Gets an object from the RGraph registry
    // 
    // @param string name The name of the value to fetch
    //
    RGraph.SVG.REG.get = function (name)
    {
        return RGraph.SVG.REG.store[name];
    };








    //
    // Removes white-space from the start aqnd end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.trim = function (str)
    {
        return RGraph.SVG.ltrim(RGraph.SVG.rtrim(str));
    };








    //
    // Trims the white-space from the start of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.ltrim = function (str)
    {
        return str.replace(/^(\s|\0)+/, '');
    };








    //
    // Trims the white-space off of the end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.rtrim = function (str)
    {
        return str.replace(/(\s|\0)+$/, '');
    };








    //
    // Hides the currently shown tooltip
    //
    RGraph.SVG.hideTooltip = function ()
    {
        var tooltip = RGraph.SVG.REG.get('tooltip');

        if (tooltip && tooltip.parentNode) {
            tooltip.parentNode.removeChild(tooltip);
            
            tooltip.style.display    = 'none';                
            tooltip.style.visibility = 'hidden';
            
            RGraph.SVG.REG.set('tooltip', null);
        }

        if (tooltip && tooltip.__object__) {
            RGraph.SVG.removeHighlight(tooltip.__object__);
        }
    };








    //
    // Creates a shadow
    //
    RGraph.SVG.setShadow = function (options)
    {
        var obj     = options.object,
            id      = options.id,
            offsetx = options.offsetx  || 0,
            offsety = options.offsety  || 0,
            blur    = options.blur     || 0,
            color   = options.color    || 'gray';

        var filter = RGraph.SVG.create({
            svg: obj.svg,
            parent: obj.svg.defs,
            type: 'filter',
            attr: {
                id: id,
                x: -1000,
                y: -1000,
                width: 2000,
                height: 2000
            }
        });

        RGraph.SVG.create({
            svg: obj.svg,
            parent: filter,
            type: 'feDropShadow',
            attr: {
                dx: offsetx,
                dy: offsety,
                stdDeviation: blur,
                'flood-color': color,
            }
        });
    };








    //
    // Takes a sequential index and returns the group/index variation of it. Eg if you have a
    // sequential index from a grouped bar chart this function can be used to convert that into
    // an appropriate group/index combination
    // 
    // @param nindex number The sequential index
    // @param data   array  The original data (which is grouped)
    // @return              The group/index information
    //
    RGraph.SVG.sequentialIndexToGrouped = function (index, data)
    {
        var group         = 0,
            grouped_index = 0;

        while (--index >= 0) {

            if (RGraph.SVG.isNullish(data[group])) {
                group++;
                grouped_index = 0;
                continue;
            }

            // Allow for numbers as well as arrays in the dataset
            if (typeof data[group] == 'number') {
                group++
                grouped_index = 0;
                continue;
            }
            

            grouped_index++;
            
            if (grouped_index >= data[group].length) {
                group++;
                grouped_index = 0;
            }
        }

        return [group, grouped_index];
    };








    //
    // This is the reverse of the above function - converting
    // group/index to a sequential index
    //
    // @return number The sequential index
    //
    RGraph.SVG.groupedIndexToSequential = function (opt)
    {
        var dataset = opt.dataset,
            index   = opt.index,
            obj     = opt.object;

        for (var i=0,seq=0; i<=dataset; ++i) {
            for (var j=0; j<obj.data[dataset].length; ++j) {
                
                if (i === dataset && j === index) {
                    return seq;
                }
                seq++;
            }
        }
        
        return seq;
    };








    //
    // Takes any number of arguments and adds them to one big linear array
    // which is then returned
    //
    // @param ... mixed The data to linearise. You can strings, booleans, numbers or arrays
    //
    RGraph.SVG.arrayLinearize = function ()
    {
        var arr  = [],
            args = arguments

        for (var i=0,len=args.length; i<len; ++i) {

            if (typeof args[i] === 'object' && args[i]) {
                for (var j=0,len2=args[i].length; j<len2; ++j) {
                    var sub = RGraph.SVG.arrayLinearize(args[i][j]);
                    
                    for (var k=0,len3=sub.length; k<len3; ++k) {
                        arr.push(sub[k]);
                    }
                }
            } else {
                arr.push(args[i]);
            }
        }

        return arr;
    };








    //
    // This function converts coordinates into the type understood by
    // SVG for drawing arcs
    //@param object options An object consisting of:
    //                       o cx:    The center X coordinate
    //                       o cy:    The center Y coordinate
    //                       o angle: The angle
    //                       o r:     The radius
    //
    RGraph.SVG.TRIG.toCartesian = function (options)
    {
        return {
            x: options.cx + (options.r * Math.cos(options.angle)),
            y: options.cy + (options.r * Math.sin(options.angle))
        };
    };








    //
    // This function, when given the x1,x2,y1,y2 coordinates will return
    //the diagonal length between the two using pythagorous.
    //
    RGraph.SVG.TRIG.getHypLength = function (opt)
    {
        var h = Math.abs(opt.x2 - opt.x1)
            v = Math.abs(opt.y2 - opt.y1),
            r = Math.sqrt(
                  (h * h)
                + (v * v)
            );

        return r;
    };








        // This takes centerx, centery, x and y coordinates and returns the
        // appropriate angle relative to the canvas angle system. Remember
        // that the canvas angle system starts at the EAST axis
        // 
        // @param  number cx  The centerx coordinate
        // @param  number cy  The centery coordinate
        // @param  number x   The X coordinate (eg the mouseX if coming from a click)
        // @param  number y   The Y coordinate (eg the mouseY if coming from a click)
        //
        // @return number     The relevant angle (measured in in RADIANS)
        //
        RGraph.SVG.TRIG.getAngleByXY = function (opt)
        {
            var cx = opt.cx,
                cy = opt.cy,
                x  = opt.x,
                y  = opt.y;

            var angle = Math.atan((y - cy) / (x - cx));

            if (x >= cx && y >= cy) {
                angle += RGraph.SVG.TRIG.HALFPI;
            } else if (x >= cx && y < cy) {
                angle = angle + RGraph.SVG.TRIG.HALFPI;
            } else if (x < cx && y < cy) {
                angle = angle + RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI;
            } else {
                angle = angle + RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI;
            }

            return angle;
        };








    //
    // Gets a path that is usable by the SVG A path command
    //
    // @patam object options The options/arg to the function
    //
    // NB ** Still used by the Pie chart and the semi-circular Meter **
    //
    RGraph.SVG.TRIG.getArcPath = function (options)
    {
        //
        // Make circles start at the top instead of the right hand side
        //
        options.start -= 1.57;
        options.end   -= 1.57;

        var start = RGraph.SVG.TRIG.toCartesian({
            cx:    options.cx,
            cy:    options.cy,
            r:     options.r,
            angle: options.start}
        );

        var end = RGraph.SVG.TRIG.toCartesian({
            cx:    options.cx,
            cy:    options.cy,
            r:     options.r,
            angle: options.end
        });

        var diff = options.end - options.start;
        
        // Initial values
        var largeArc = '0';
        var sweep    = '0';

        if (options.anticlockwise && diff > 3.14) {
            largeArc = '0';
            sweep    = '0';
        } else if (options.anticlockwise && diff <= 3.14) {
            largeArc = '1';
            sweep    = '0';
        } else if (!options.anticlockwise && diff > 3.14) {
            largeArc = '1';
            sweep    = '1';
        } else if (!options.anticlockwise && diff <= 3.14) {
            largeArc = '0';
            sweep    = '1';
        }
        
        if (options.start > options.end && options.anticlockwise && diff <= 3.14) {
            largeArc = '0';
            sweep    = '0';
        }

        if (options.start > options.end && options.anticlockwise && diff > 3.14) {
            largeArc = '1';
            sweep    = '1';
        }


        if (typeof options.moveto === 'boolean' && options.moveto === false) {
            var d = [
                "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y
            ];
        } else {
            var d = [
                "M", start.x, start.y, 
                "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y
            ];
        }
        
        if (options.array === true) {
            return d;
        } else {
            return d.join(" ");
        }
    };








    //
    // Gets a path that is usable by the SVG A path command
    //
    // @patam object options The options/arg to the function
    //
    RGraph.SVG.TRIG.getArcPath2 = function (options)
    {
        //
        // Make circles start at the top instead of the right hand side
        //
        options.start -= 1.57;
        options.end   -= 1.57;

        var start = RGraph.SVG.TRIG.toCartesian({
            cx:    options.cx,
            cy:    options.cy,
            r:     options.r,
            angle: options.start
        });

        var end = RGraph.SVG.TRIG.toCartesian({
            cx:    options.cx,
            cy:    options.cy,
            r:     options.r,
            angle: options.end
        });

        var diff = Math.abs(options.end - options.start);
        
        // Initial values
        var largeArc = '0';
        var sweep    = '0';

        //TODO Put various options here for the correct combination of flags to use
        if (!options.anticlockwise) {
            if (diff > RGraph.SVG.TRIG.PI) {
                largeArc = '1';
                sweep    = '1';
            } else {
                largeArc = '0';
                sweep    = '1';
            }
        } else {
            if (diff > RGraph.SVG.TRIG.PI) {
                largeArc = '1';
                sweep    = '0';
            } else {
                largeArc = '0';
                sweep    = '0';
            }
        }

        if (typeof options.lineto === 'boolean' && options.lineto === false) {
            var d = [
                "M", start.x, start.y,
                "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y
            ];
        } else {
            var d = [
                "M", options.cx, options.cy,
                "L", start.x, start.y, 
                "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y
            ];
        }

        if (options.array === true) {
            return d;
        } else {
            return d.join(" ");
        }
    };








    //
    // Gets a path that is usable by the SVG A path command
    //
    // @param object options The options/arg to the function
    //
    RGraph.SVG.TRIG.getArcPath3 = function (options)
    {
        // Make sure the args are numbers
        options.cx     = Number(options.cx);
        options.cy     = Number(options.cy);
        options.start  = Number(options.start);
        options.end    = Number(options.end);

        if (typeof options.radius === 'number') {
            options.r = options.radius;
        }

        //
        // Make circles start at the top instead of the
        // right-hand-side
        //
        options.start -= (Math.PI / 2);
        options.end   -= (Math.PI / 2);

        var start = RGraph.SVG.TRIG.toCartesian({
            cx:    options.cx,
            cy:    options.cy,
            r:     options.r,
            angle: options.start
        });

        var end = RGraph.SVG.TRIG.toCartesian({
            cx:    options.cx,
            cy:    options.cy,
            r:     options.r,
            angle: options.end
        });

        var diff = Math.abs(options.end - options.start);

        // Initial values
        var largeArc = '0';
        var sweep    = '0';

        //TODO Put various options here for the correct combination of flags to use
        if (!options.anticlockwise) {
            if (diff > RGraph.SVG.TRIG.PI) {
                largeArc = '1';
                sweep    = '1';
            } else {
                largeArc = '0';
                sweep    = '1';
            }
        } else {
            if (diff > RGraph.SVG.TRIG.PI) {
                largeArc = '1';
                sweep    = '0';
            } else {
                largeArc = '0';
                sweep    = '0';
            }
        }

        if (typeof options.lineto === 'boolean' && options.lineto === false) {
            if (typeof options.moveto === 'boolean' && options.moveto === false) {
                var d = [
                    "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y
                ];
            } else {
                var d = [
                    "M", start.x, start.y,
                    "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y
                ];
            }
        } else {
            var d = [
                "L", start.x, start.y,
                "A", options.r, options.r, 0, largeArc, sweep, end.x, end.y
            ];
        }

        if (options.array === true) {
            return d;
        } else {
            return d.join(" ");
        }
    };








    //
    // This function gets the end point (X/Y coordinates) of a given radius.
    // You pass it the center X/Y and the radius and this function will return
    // the endpoint X/Y coordinates.
    // 
    // @param number r     The length of the radius
    // @param number angle The angle to use
    //
    RGraph.SVG.TRIG.getRadiusEndPoint = function (opt)
    {
        // Allow for two arguments style
        if (arguments.length === 1) {
            
            if (typeof opt.radius === 'number') {
                opt.r = opt.radius;
            }

            var angle = opt.angle,
                r     = opt.r;

        } else if (arguments.length === 4) {

            var angle = arguments[0],
                r     = arguments[1];
        }

        var x = Math.cos(angle) * r,
            y = Math.sin(angle) * r;

        return [x, y];
    };








    //
    // Converts the given number of degrees to radians. Angles in SVG are
    // measured in radians.
    // 
    // @param  opt object An object consisting of:
    //                      o degrees
    //
    RGraph.SVG.TRIG.toRadians = function (opt)
    {
        return opt.degrees * (Math.PI / 180);
    };








    // Usage: RGraph.SVG.TRIG.toDegrees(3.14) // 180ish
    //
    // @param  opt object An object consisting of:
    //                      o radians
    //
    RGraph.SVG.TRIG.toDegrees = function (opt)
    {
        return opt.radians * (180 / Math.PI);
    };








    //
    // Draws a segment for you. Similar arguments to the canvas
    // arc() function.
    //
    //@param object opt The options for the function. This should
    //                  be an object that consists of:
    //                   centerx: The centerx coordinate
    //                   centery: The centery coordinate
    //                   radius:  The radius if the segment
    //                   start:   The start angle of the segment
    //                   end:     The end angle of the segment
    //
    RGraph.SVG.TRIG.drawSegment = function (opt)
    {
        var attr  = opt.attr;
        var style = opt.style;

        var path = RGraph.SVG.TRIG.getArcPath3({
            cx:            opt.cx,
            cy:            opt.cy,
            radius:        opt.radius,
            start:         Math.min(opt.start, opt.end),
            end:           Math.max(opt.start, opt.end),
            anticlockwise: false,
            lineto:        true
        });

        var element = RGraph.SVG.create({
            svg: scp1.svg,
            type: 'path',
            attr: {
                ...attr,
                d: 'M {1} {2} {3} z'.format(
                    opt.cx,
                    opt.cy,
                    path
                )
            },
            style: {
                ...style
            }
        });
        
        return element;
    };







    //
    // This function draws the title. This function also draws the subtitle.
    //
    RGraph.SVG.drawTitle = function (obj)
    {
        var properties = obj.properties;

        // Work out the X cooordinate for the title and subtitle
        var x      = ((obj.width - properties.marginLeft - properties.marginRight) / 2) + properties.marginLeft,
            y      = properties.marginTop - 10,
            valign = 'bottom';

        // If theres key defined then move the title up
        if (!RGraph.SVG.isNullish(obj.properties.key)) {
            y -= 20;
        }

        // If X axis is at the top then move the title up
        if (   typeof obj.properties.yaxisScaleMax === 'number'
            && obj.properties.yaxisScaleMax <= 0
            && obj.properties.yaxisScaleMin < obj.properties.yaxisScaleMax
           ) {
            valign = 'top';
            y = obj.height - obj.properties.marginBottom + 10;
        }

        // Custom X coordinate
        if (typeof properties.titleX === 'number') {
            x = properties.titleX;
        }

        // Custom Y coordinate
        if (typeof properties.titleY === 'number') {
            y = properties.titleY;
        }
        
        // Custom X coordinate
        if (typeof properties.titleOffsetx === 'number') {
            x += properties.titleOffsetx;
        }

        // Custom Y coordinate
        if (typeof properties.titleOffsety === 'number') {
            y += properties.titleOffsety;
        }

        // Move the Y coord up if there's a subtitle
        if (typeof properties.titleSubtitle === 'string' || typeof properties.titleSubtitle === 'number') {
            var titleSubtitleDim = RGraph.SVG.measureText({
                bold:   properties.titleSubtitleBold,
                italic: properties.titleSubtitleItalic,
                size:   properties.titleSubtitleSize,
                font:   properties.titleSubtitleFont,
                text:   'Mg'
            });
            
            y -= titleSubtitleDim[1];
        }



        // Draw the title
        if (properties.title) {

            RGraph.SVG.text({
                object: obj,
                svg:    obj.svg,
                parent: obj.svgAllGroup,
                tag:    'title',
                text:   properties.title.toString(),
                x:      x,
                y:      y,
                halign: properties.titleHalign || 'center',
                valign: valign,
                color:  properties.titleColor  || properties.textColor,
                size:   typeof properties.titleSize === 'number' ? properties.titleSize : properties.textSize + 4,
                bold:   typeof properties.titleBold === 'boolean' ? properties.titleBold : properties.textBold,
                italic: typeof properties.titleItalic === 'boolean' ? properties.titleItalic : properties.textItalic,
                font:   properties.titleFont || properties.textFont
            });
        }




        // Draw the subtitle if there's one defined
        if (
               (typeof properties.title === 'string' || typeof properties.title === 'number')
            && (typeof properties.titleSubtitle === 'string' || typeof properties.titleSubtitle === 'number')
           ) {

            RGraph.SVG.text({
                object: obj,
                svg:    obj.svg,
                parent: obj.svgAllGroup,
                tag:    'subtitle',
                text:   properties.titleSubtitle,
                x:      x,
                y:      y + 5,
                halign: properties.titleHalign || 'center',
                valign: 'top',
                size:   typeof properties.titleSubtitleSize === 'number' ? properties.titleSubtitleSize : properties.textSize - 2,
                color:  properties.titleSubtitleColor || properties.textColor,
                bold:   typeof properties.titleSubtitleBold === 'boolean' ? properties.titleSubtitleBold : properties.textBold,
                italic: typeof properties.titleSubtitleItalic === 'boolean' ? properties.titleSubtitleItalic : properties.textItalic,
                font:   properties.titleSubtitleFont || properties.textFont
            });
        }
    };








    //
    // Removes white-space from the start and end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.trim = function (str)
    {
        return RGraph.SVG.ltrim(RGraph.SVG.rtrim(str));
    };








    //
    // Trims the white-space from the start of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.ltrim = function (str)
    {
        return String(str).replace(/^(\s|\0)+/, '');
    };








    //
    // Trims the white-space off of the end of a string
    // 
    // @param string str The string to trim
    //
    RGraph.SVG.rtrim = function (str)
    {
        return String(str).replace(/(\s|\0)+$/, '');
    };








    //
    // This parses a single color value
    //
    RGraph.SVG.parseColorLinear = function (opt)
    {
        var obj   = opt.object,
            color = opt.color;

        if (!color || typeof color !== 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {
            
            var parts = RegExp.$1.split(':'),
                diff  = 1 / (parts.length - 1);

            if (opt && opt.direction && opt.direction === 'horizontal') {
                var grad = RGraph.SVG.create({
                    type: 'linearGradient',
                    parent: obj.svg.defs,
                    attr: {
                        id: 'RGraph-linear-gradient-' + obj.uid + '-' + obj.gradientCounter,
                        x1: opt.start || 0,
                        x2: opt.end || '100%',
                        y1: 0,
                        y2: 0,
                        gradientUnits: opt.gradientUnits || "userSpaceOnUse"
                    }
                });

            } else {

                var grad = RGraph.SVG.create({
                    type: 'linearGradient',
                    parent: obj.svg.defs,
                    attr: {
                        id: 'RGraph-linear-gradient-' + obj.uid + '-' + obj.gradientCounter,
                        x1: 0,
                        x2: 0,
                        y1: opt.start || 0,
                        y2: opt.end || '100%',
                        gradientUnits: opt.gradientUnits || "userSpaceOnUse"
                    }
                });
            }

            // Add the first color stop
            var stop = RGraph.SVG.create({
                type: 'stop',
                parent: grad,
                attr: {
                    offset: '0%',
                    'stop-color': RGraph.SVG.trim(parts[0])
                }
            });

            // Add the rest of the color stops
            for (var j=1,len=parts.length; j<len; ++j) {
                
                RGraph.SVG.create({
                    type: 'stop',
                    parent: grad,
                    attr: {
                        offset: (j * diff * 100) + '%',
                        'stop-color': RGraph.SVG.trim(parts[j])
                    }
                });
            }
        }
        
        color = grad ? 'url(#RGraph-linear-gradient-' + obj.uid + '-' + (obj.gradientCounter++) + ')' : color;

        return color;
    };








    //
    // This parses a single color value
    //
    RGraph.SVG.parseColorRadial = function (opt)
    {
        var obj   = opt.object,
            color = opt.color;

        if (!color || typeof color !== 'string') {
            return color;
        }

        if (color.match(/^gradient\((.*)\)$/i)) {

            var parts = RegExp.$1.split(':'),
                diff  = 1 / (parts.length - 1);


            var grad = RGraph.SVG.create({
                type: 'radialGradient',
                parent: obj.svg.defs,
                attr: {
                    id: 'RGraph-radial-gradient-' + obj.uid + '-' + obj.gradientCounter,
                    gradientUnits: opt.gradientUnits || 'userSpaceOnUse',
                    cx: opt.cx || obj.centerx,
                    cy: opt.cy || obj.centery,
                    fx: opt.fx || obj.centerx,
                    fy: opt.fy || obj.centery,
                    r:  opt.r  || obj.radius
                }
            });

            // Add the first color stop
            var stop = RGraph.SVG.create({
                type: 'stop',
                parent: grad,
                attr: {
                    offset: '0%',
                    'stop-color': RGraph.SVG.trim(parts[0])
                }
            });

            // Add the rest of the color stops
            for (var j=1,len=parts.length; j<len; ++j) {
                
                RGraph.SVG.create({
                    type: 'stop',
                    parent: grad,
                    attr: {
                        offset: (j * diff * 100) + '%',
                        'stop-color': RGraph.SVG.trim(parts[j])
                    }
                });
            }
        }
        
        color = grad ? 'url(#RGraph-radial-gradient-' + obj.uid + '-' + (obj.gradientCounter++) + ')' : color;

        return color;
    };








    //
    // Reset all of the color values to their original values
    // 
    // @param object
    //
    RGraph.SVG.resetColorsToOriginalValues = function (opt)
    {
        var obj = opt.object;
        
        // TODO This appears to be BORKED
        if (obj.originalColors) {
            // Reset the colors to their original values
            for (var j in obj.originalColors) {
                if (typeof j === 'string') {
                    obj.properties[j] = RGraph.SVG.arrayClone(obj.originalColors[j]);
                }
            }
        }

        //
        // If the function is present on the object to reset specific
        // colors - use that
        //
        if (typeof obj.resetColorsToOriginalValues === 'function') {
            obj.resetColorsToOriginalValues();
        }

        // Hmmm... Should this be necessary? I don't think it will
        // do any harm to leave it in.
        obj.originalColors = {};



        // Reset the colorsParsed flag so that they're parsed for gradients again
        obj.colorsParsed = false;
        
        // Reset the gradient counter
        // 
        // TAKEN OUT ON 6th JULY 2023 SO THAT GRADIENTS ARE
        // RE-PARSED WHEN THE .responsive() FUNCTION RUNS
        //
        //obj.gradientCounter = 1;
    };








    //
    // Clear the SVG tag by deleting all of its
    // child nodes
    //
    // @param [OPTIONAL] svg The SVG tag (same as what is returned
    //                   by document.getElementById() )
    // @param string [OPTIONAL] An opttional color with which to
    //                          clear the background to (by adding
    //                          a <rect> that covers the entire
    //                          drawing area.
    //
    RGraph.SVG.clear = function ()
    {
        // No arguments given - so clear all of the registered
        // SVG tags.
        if (arguments.length === 0) {
            for (var i=0; i<RGraph.SVG.OR.objects.length; i++) {
                RGraph.SVG.clear(RGraph.SVG.OR.objects[i].svg);
            }
            
            return;
        
        // An SVG tag has been given
        } else {
            var svg   = arguments[0];
            var color = arguments[1] ? arguments[1] : null;
        }

        // Allow the svg to be a string
        if (typeof svg === 'string') {
            var div = document.getElementById(svg);
            var svg = div.__svg__;
        }

        // Clear all the layer nodes
        for (var i=1; i<=100; ++i) {
            if (svg && svg['background' + i]) {
                
                // Clear all the nodes within this group
                svg['background' + i].replaceChildren();
            } else {
                break;
            }
        }

        const groups = svg.getElementsByClassName('all-elements');

        for (let i=0; i<groups.length; ++i) {
            groups[i].replaceChildren();
        }
        
        //
        // Add a background color if requested
        //
        // TODO This needs more testing to see if it works
        //      satisfactorily
        if (color) {

            RGraph.SVG.create({
                svg: svg,
                type: 'rect',
                attr: {
                    x: -10,
                    y: -10,
                    width: svg.parentNode.offsetWidth + 20,
                    height: svg.parentNode.offsetHeight + 20,
                    fill: color
                }
            });
        }
    };








    //
    // The reset function is like the clear function but also clears the
    // ObjectRegistry for this canvas
    //
    RGraph.SVG.reset = function ()
    {
        // Reset all registered SVG tags
        if (arguments.length === 0) {
            for (var i=0; i<RGraph.SVG.OR.objects.length; i++) {
                RGraph.SVG.reset(RGraph.SVG.OR.objects[i].svg);
            }

            return;

        // Reset a single SVG tag
        } else {
            var svg = arguments[0];
        }

        // Allow the svg to be a string
        if (typeof svg === 'string') {
            var div = document.getElementById(svg);
            var svg = div.__svg__;
        }

        // Get rid of this reference
        svg.parentNode.__svg__ = null;

        RGraph.SVG.clear(svg);

        // Make sure every element is removed from the SVG tag
        while (svg.lastChild) {
            svg.removeChild(svg.lastChild);
        }

        // Remove the SVG tag from the ObjectRegistry
        RGraph.SVG.OR.clear(svg);
        
        // Get rid of the SVG tag itself
        svg.parentNode.removeChild(svg);
    };








    //
    // Adds an event listener
    // 
    // @param object obj   The graph object
    // @param string event The name of the event, eg ontooltip
    // @param object func  The callback function
    //
    RGraph.SVG.addCustomEventListener = function (obj, name, func)
    {
        // Initialise the events array if necessary
        if (typeof RGraph.SVG.events[obj.uid] === 'undefined') {
            RGraph.SVG.events[obj.uid] = [];
        }
        
        // Prepend "on" if necessary
        if (name.substr(0, 2) !== 'on') {
            name = 'on' + name;
        }

        RGraph.SVG.events[obj.uid].push({
            object: obj,
            event:  name,
            func:   func
        });

        return RGraph.SVG.events[obj.uid].length - 1;
    };








    //
    // Used to fire one of the RGraph custom events
    // 
    // @param object obj   The graph object that fires the event
    // @param string event The name of the event to fire
    //
    RGraph.SVG.fireCustomEvent = function (obj, name)
    {
        if (obj && obj.isRGraph) {

            if (name.substr(0,2) !== 'on') {
                name = 'on' + name;
            }

            if (   typeof obj.uid === 'string'
                && typeof RGraph.SVG.events === 'object'
                && typeof RGraph.SVG.events[obj.uid] === 'object'
                && RGraph.SVG.events[obj.uid].length > 0) {

                for(var j=0,len=RGraph.SVG.events[obj.uid].length; j<len; ++j) {
                    if (RGraph.SVG.events[obj.uid][j] && RGraph.SVG.events[obj.uid][j].event === name) {
                        RGraph.SVG.events[obj.uid][j].func(obj);
                    }
                }
            }
        }
    };








    //
    // Clears all the custom event listeners that have been registered
    // 
    // @param string optional Limits the clearing to this object UID
    //
    RGraph.SVG.removeAllCustomEventListeners = function ()
    {
        var uid = arguments[0];

        if (uid && RGraph.SVG.events[uid]) {
            RGraph.SVG.events[uid] = {};
        } else {
            RGraph.SVG.events = [];
        }
    };








    //
    // Clears a particular custom event listener
    // 
    // @param object obj The graph object
    // @param number i   This is the index that is return by .addCustomEventListener()
    //
    RGraph.SVG.removeCustomEventListener = function (obj, i)
    {
        if (   typeof RGraph.SVG.events === 'object'
            && typeof RGraph.SVG.events[obj.uid] === 'object'
            && typeof RGraph.SVG.events[obj.uid][i] === 'object') {
            
            RGraph.SVG.events[obj.uid][i] = null;
        }
    };








    //
    // Removes the highlight from the chart added by tooltips (possibly others too)
    //
    RGraph.SVG.removeHighlight = function (obj)
    {
        var highlight = RGraph.SVG.REG.get('highlight');

        if (highlight && RGraph.SVG.isArray(highlight) && highlight.length) {
            for (var i=0,len=highlight.length; i<len; ++i) {
                if (highlight[i].parentNode) {
                    //obj.svg.removeChild(highlight[i]);
                    highlight[i].parentNode.removeChild(highlight[i]);
                }
            }
        } else if (highlight && highlight.parentNode) {
            if (obj.type === 'scatter') {
                highlight.setAttribute('stroke0width', '0');
                highlight.setAttribute('stroke', 'transparent');
                highlight.setAttribute('fill', 'transparent');
            } else {
                highlight.parentNode.removeChild(highlight);
            }
        }
    };








    //
    // Removes the highlight from the chart added by tooltips (possibly others too)
    //
    RGraph.SVG.redraw = function ()
    {
        if (arguments.length === 1) {

            var svg = arguments[0];

            if (svg.parentNode) {
                RGraph.SVG.clear(svg);

                var objects = RGraph.SVG.OR.get('id:' + svg.parentNode.id);

                for (var i=0,len=objects.length; i<len; ++i) {

                    // Reset the colors to the original values
                    RGraph.SVG.resetColorsToOriginalValues({object: objects[i]});
    
                    objects[i].draw();
                }
            }
        } else {

            var tags = RGraph.SVG.OR.tags();

            for (var i in tags) {
                RGraph.SVG.redraw(tags[i]);
            }
        }
    };








    //
    // A better, more flexible, date parsing function
    //
    //@param  string str The string to parse
    //@return number     A number, as returned by Date.parse()
    //
    RGraph.SVG.parseDate = function (str)
    {
        var d = new Date();

        // Initialise the default values
        var defaults = {
            seconds: '00',
            minutes: '00',
              hours: '00',
               date: d.getDate(),
              month: d.getMonth() + 1,
               year: d.getFullYear()
        };

        // Create the months array for turning textual months back to numbers
        var months       = ['january','february','march','april','may','june','july','august','september','october','november','december'],
            months_regex = months.join('|');

        for (var i=0; i<months.length; ++i) {
            months[months[i]] = i;
            months[months[i].substring(0,3)] = i;
            months_regex = months_regex + '|' + months[i].substring(0,3);
        }

        // These are the seperators allowable for d/m/y and y/m/d dates
        // (Its part of a regexp so the position of the square brackets
        //  is crucial)
        var sep = '[-./_=+~#:;,]+';


        // Tokenise the string
        var tokens = str.split(/ +/);

        // Loop through each token checking what it is
        for (var i=0,len=tokens.length; i<len; ++i) {
            if (tokens[i]) {
                
                // Year
                if (tokens[i].match(/^\d\d\d\d$/)) {
                    defaults.year = tokens[i];
                }

                // Month
                var res = isMonth(tokens[i]);
                if (typeof res === 'number') {
                    defaults.month = res + 1; // Months are zero indexed
                }

                // Date
                if (tokens[i].match(/^\d?\d(?:st|nd|rd|th)?$/)) {
                    defaults.date = parseInt(tokens[i]);
                }

                // Time
                if (tokens[i].match(/^(\d\d):(\d\d):?(?:(\d\d))?$/)) {
                    defaults.hours   = parseInt(RegExp.$1);
                    defaults.minutes = parseInt(RegExp.$2);
                    
                    if (RegExp.$3) {
                        defaults.seconds = parseInt(RegExp.$3);
                    }
                }

                // Dateformat: XXXX-XX-XX
                if (tokens[i].match(new RegExp('^(\\d\\d\\d\\d)' + sep + '(\\d\\d)' + sep + '(\\d\\d)$', 'i'))) {
                    defaults.date  = parseInt(RegExp.$3);
                    defaults.month = parseInt(RegExp.$2);
                    defaults.year  = parseInt(RegExp.$1);

                }

                // Dateformat: XX-XX-XXXX
                if (tokens[i].match(new RegExp('^(\\d\\d)' + sep + '(\\d\\d)' + sep + '(\\d\\d\\d\\d)$','i') )) {
                    defaults.date  = parseInt(RegExp.$1);
                    defaults.month = parseInt(RegExp.$2);
                    defaults.year  = parseInt(RegExp.$3);
                }
            }
        }

        // Now put the defaults into a format thats recognised by Date.parse()
        str = '{1}/{2}/{3} {4}:{5}:{6}'.format(
            defaults.year,
            String(defaults.month).length     === 1 ? '0' + (defaults.month) : defaults.month,
            String(defaults.date).length      === 1 ? '0' + (defaults.date)      : defaults.date,
            String(defaults.hours).length     === 1 ? '0' + (defaults.hours)     : defaults.hours,
            String(defaults.minutes).length   === 1 ? '0' + (defaults.minutes)   : defaults.minutes,
            String(defaults.seconds).length   === 1 ? '0' + (defaults.seconds)   : defaults.seconds
        );

        return Date.parse(str);

        //
        // Support functions
        //
        function isMonth(str)
        {
            var res = str.toLowerCase().match(months_regex);

            return res ? months[res[0]] : false;
        }
    };








    // The ObjectRegistry add function
    RGraph.SVG.OR.add = function (obj)
    {
        RGraph.SVG.OR.objects.push(obj);

        return obj;
    };








    // The ObjectRegistry function that returns all of the objects. Th argument
    // can aither be:
    //
    // o omitted  All of the registered objects are returned
    // o id:XXX  All of the objects on that SVG tag are returned
    // o type:XXX All the objects of that type are returned
    //
    RGraph.SVG.OR.get = function ()
    {
        // Fetch objects that are on a particular SVG tag
        if (typeof arguments[0] === 'string' && arguments[0].substr(0, 3).toLowerCase() === 'id:') {
            
            var ret = [];

            for (var i=0; i<RGraph.SVG.OR.objects.length; ++i) {
                if (RGraph.SVG.OR.objects[i] && RGraph.SVG.OR.objects[i].id === arguments[0].substr(3)) {
                    ret.push(RGraph.SVG.OR.objects[i]);
                }
            }

            return ret;
        }


        // Fetch objects that are of a particular type
        //
        // TODO Allow multiple types to be specified
        if (typeof arguments[0] === 'string' && arguments[0].substr(0, 4).toLowerCase() === 'type') {
            
            var ret = [];
            
            for (var i=0; i<RGraph.SVG.OR.objects.length; ++i) {
                if (RGraph.SVG.OR.objects[i].type === arguments[0].substr(5)) {
                    ret.push(RGraph.SVG.OR.objects[i]);
                }
            }
            
            return ret;
        }


        // Fetch an object that has a specific UID
        if (typeof arguments[0] === 'string' && arguments[0].substr(0, 3).toLowerCase() === 'uid') {
            
            var ret = [];
            
            for (var i=0; i<RGraph.SVG.OR.objects.length; ++i) {
                if (RGraph.SVG.OR.objects[i].uid === arguments[0].substr(4)) {
                    ret.push(RGraph.SVG.OR.objects[i]);
                }
            }
            
            return ret;
        }

        return RGraph.SVG.OR.objects;
    };







    //
    // Clear the ObjectRegistry of charts
    //
    // @param [OPTIONAL] string You can optionally give an ID so only objects
    //                          pertaining to that SVG tag are cleared.
    //
    RGraph.SVG.OR.clear = function ()
    {
        // Clear the ObjectRegistry of objects for a particular ID
        if (typeof arguments[0] === 'string') {
            for (var i=0; i<RGraph.SVG.OR.objects.length; ++i) {
                if (RGraph.SVG.OR.objects[i].id === arguments[0]) {
                    RGraph.SVG.OR.objects[i] = null;
                }
            }
        
        // If an RGraph object is given then clear that object
        } else if (typeof arguments[0] === 'object') {
            for (var i=0; i<RGraph.SVG.OR.objects.length; ++i) {
                if (RGraph.SVG.OR.objects[i].uid === arguments[0].uid) {
                    RGraph.SVG.OR.objects[i] = null;
                }
            }

        // Clear the entire ObjectRegistry
        } else {
            RGraph.SVG.OR.objects = [];
        }
    };








    // The ObjectRegistry function that returns all of the registeredt SVG tags
    //
    RGraph.SVG.OR.tags = function ()
    {
        var tags = [];

        for (var i=0; i<RGraph.SVG.OR.objects.length; ++i) {
            if (RGraph.SVG.OR.objects[i] && !tags[RGraph.SVG.OR.objects[i].svg.parentNode.id]) {
                tags[RGraph.SVG.OR.objects[i].svg.parentNode.id] = RGraph.SVG.OR.objects[i].svg;
            }
        }

        return tags;
    };








    //
    // This function returns a two element array of the SVG x/y position in
    // relation to the page
    // 
    // @param object svg
    //
    RGraph.SVG.getSVGXY = function (svg)
    {
        var x  = 0,
            y  = 0,
            el = svg.parentNode; // !!!












        // If the getBoundingClientRect function is available - use that
        //
        if (svg.getBoundingClientRect) {
            
            var rect = svg.getBoundingClientRect();

            // Add the the current scrollTop and scrollLeft becuase the getBoundingClientRect()
            // method is relative to the viewport - not the document
            var scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
                scrollTop  = window.pageYOffset || document.documentElement.scrollTop;

            return [rect.x + scrollLeft, rect.y + scrollTop];
        }















/*
        do {

            x += el.offsetLeft;
            y += el.offsetTop;

            // Account for tables in webkit
            if (el.tagName.toLowerCase() == 'table' && (RGraph.SVG.ISCHROME || RGraph.SVG.ISSAFARI)) {
                x += parseInt(el.border) || 0;
                y += parseInt(el.border) || 0;
            }

            el = el.offsetParent;

        } while (el && el.tagName && el.tagName.toLowerCase() != 'body');


        var paddingLeft = svg.style.paddingLeft ? parseInt(svg.style.paddingLeft) : 0,
            paddingTop  = svg.style.paddingTop ? parseInt(svg.style.paddingTop) : 0,
            borderLeft  = svg.style.borderLeftWidth ? parseInt(svg.style.borderLeftWidth) : 0,
            borderTop   = svg.style.borderTopWidth  ? parseInt(svg.style.borderTopWidth) : 0;

        if (navigator.userAgent.indexOf('Firefox') > 0) {
            x += parseInt(document.body.style.borderLeftWidth) || 0;
            y += parseInt(document.body.style.borderTopWidth) || 0;
        }

        return [x + paddingLeft + borderLeft, y + paddingTop + borderTop];
*/
    };








    //
    // This function is a compatibility wrapper around
    // the requestAnimationFrame function.
    //
    // @param function func The function to give to the
    //                      requestAnimationFrame function
    //
    RGraph.SVG.FX.update = function (func)
    {
        win.requestAnimationFrame =
            win.requestAnimationFrame ||
            win.webkitRequestAnimationFrame ||
            win.msRequestAnimationFrame ||
            win.mozRequestAnimationFrame ||
            (function (func){setTimeout(func, 16.666);});
        
        win.requestAnimationFrame(func);
    };








    //
    // This function returns an easing multiplier for effects so they eas out towards the
    // end of the effect.
    // 
    // @param number frames The total number of frames
    // @param number frame  The frame number
    //
    RGraph.SVG.FX.getEasingMultiplier = function (frames, frame, pow=3)
    {
        var multiplier = Math.pow(Math.sin((frame / frames) * RGraph.SVG.TRIG.HALFPI), pow);

        return multiplier;
    };








    //
    // Measures text by creating a DIV in the document and adding the relevant
    // text to it, then checking the .offsetWidth and .offsetHeight.
    // 
    // @param  object opt An object containing the following:
    //                        o text( string) The text to measure
    //                        o bold (bool)   Whether the text is bold or not
    //                        o font (string) The font to use
    //                        o size (number) The size of the text (in pts)
    // 
    // @return array         A two element array of the width and height of the text
    //
    RGraph.SVG.measureText = function (opt)
    {
        //text, bold, font, size
        var text   = opt.text   || '',
            bold   = opt.bold   || false,
            italic = opt.italic || false,
            font   = opt.font   || 'sans-serif',
            size   = opt.size   || 12,
            str    = text + ':' + italic + ':' + bold + ':' + font + ':' + size;

        // Add the sizes to the cache as adding DOM elements is costly and causes slow downs
        if (typeof RGraph.SVG.measuretext_cache === 'undefined') {
            RGraph.SVG.measuretext_cache = [];
        }

        if (opt.cache !== false && typeof RGraph.SVG.measuretext_cache == 'object' && RGraph.SVG.measuretext_cache[str]) {
            return RGraph.SVG.measuretext_cache[str];
        }

        
        if (!RGraph.SVG.measuretext_cache['text-span'] || opt.cache === false) {
            var span = document.createElement('SPAN');
                span.style.position   = 'absolute';
                span.style.padding    = 0;
                span.style.display    = 'inline';
                span.style.top        = '-200px';
                span.style.left       = '-200px';
                span.style.lineHeight = '1em';
            document.body.appendChild(span);
            
            // Now store the newly created DIV
            RGraph.SVG.measuretext_cache['text-span'] = span;

        } else if (RGraph.SVG.measuretext_cache['text-span']) {
            var span = RGraph.SVG.measuretext_cache['text-span'];

            // Clear the contents of the SPAN tag
            while(span.firstChild){
                span.removeChild(span.firstChild);
            }
        }

        //span.innerHTML        = text.replace(/\r?\n/g, '<br />');
        span.insertAdjacentHTML('afterbegin', String(text).replace(/\r?\n/g, '<br />'));

        span.style.fontFamily = font;
        span.style.fontWeight = bold ? 'bold' : 'normal';
        span.style.fontStyle  = italic ? 'italic' : 'normal';
        span.style.fontSize   = String(size).replace(/pt$/, '') + 'pt';

        var sizes = [span.offsetWidth, span.offsetHeight];

        //document.body.removeChild(span);
        RGraph.SVG.measuretext_cache[str] = sizes;

        return sizes;
    };








    //
    // This function converts an array of strings to an array of numbers. Its used by the meter/gauge
    // style charts so that if you want you can pass in a string. It supports various formats:
    // 
    // '45.2'
    // '-45.2'
    // ['45.2']
    // ['-45.2']
    // '45.2,45.2,45.2' // A CSV style string
    // 
    // @param number frames The string or array to parse
    //
    RGraph.SVG.stringsToNumbers = function (str)
    {
        // An optional seperator to use intead of a comma
        var sep = arguments[1] || ',';



        // Remove preceding square brackets
        if (typeof str === 'string' && str.trim().match(/^\[ *\d+$/)) {
            str = str.replace('[', '');
        }
        
        
        // If it's already a number just return it
        if (typeof str === 'number') {
            return str;
        }





        if (typeof str === 'string') {
            if (str.indexOf(sep) != -1) {
                str = str.split(sep);
            } else {
                str = parseFloat(str);

                if (isNaN(str)) {
                    str = null;
                }
            }
        }






        if (typeof str === 'object'  && !RGraph.SVG.isNullish(str)) {
            for (var i=0,len=str.length; i<len; i+=1) {
                str[i] = RGraph.SVG.stringsToNumbers(
                    str[i],
                    sep
                );
            }
        }

        return str;
    };








    // This function allows for numbers that are given as a +/- adjustment
    RGraph.SVG.getAdjustedNumber = function (opt)
    {
        var value = opt.value,
            prop  = opt.prop;
    
        if (typeof prop === 'string' && match(/^(\+|-)([0-9.]+)/)) {
            if (RegExp.$1 === '+') {
                value += parseFloat(RegExp.$2);
            } else if (RegExp.$1 === '-') {
                value -= parseFloat(RegExp.$2);
            }
        }
        
        return value;
    };








    // NOT USED ANY MORE
    RGraph.SVG.attribution=function(){return;};








    //
    // Parse a gradient and returns the various parts
    // 
    // @param string str The gradient string
    //
    RGraph.SVG.parseGradient = function (str)
    {
    };








    //
    // Generates a random number between the minimum and maximum
    // 
    // @param number min The minimum value
    // @param number max The maximum value
    // @param number     OPTIONAL Number of decimal places
    //
    RGraph.SVG.random = function (opt)
    {
        if (RGraph.SVG.isObject(opt)) {
            var min = opt.min,
                max = opt.max,
                dp  = opt.dp || opt.decimals || 0;
        
        } else if (RGraph.SVG.isNumber(opt)) {
            var min = opt,
                max = arguments[1],
                dp  = arguments[2]  || 0;
        }
        
        var r = Math.random();
        
        return Number((((max - min) * r) + min).toFixed(dp));
    };








    //
    // Fill an array full of random numbers
    //
    RGraph.SVG.arrayRandom  = function (opt)
    {
        var num = opt.num,
            min = opt.min,
            max = opt.max,
            dp  = opt.dp || opt.decimals || 0;

        for(var i=0,arr=[]; i<num; i+=1) {
            arr.push(RGraph.SVG.random({min: min, max: max, dp: dp}));
        }
        
        return arr;
    };








    //
    // This function is called by each objects setter so that common BC
    // and adjustments are centralised. And there's less typing for me too.
    //
    // @param object opt An object of options to the function, which are:
    //                    object: The chart object
    //                    name:   The name of the config parameter
    //                    value:  The value thats being set
    //
    RGraph.SVG.commonSetter = function (opt)
    {
        var obj   = opt.object,
            name  = opt.name,
            value = opt.value;

        // The default event for tooltips is click
        if (name === 'tooltipsEvent'&& value !== 'click' && value !== 'mousemove') {
            value = 'click';
        }

        return {
            name:  name,
            value: value
        };
    };








    //
    // Generates logs for... log charts
    //
    // @param object opt The options:
    //                     o num  The number
    //                     o base The base
    //
    RGraph.SVG.log = function (opt)
    {
        var num  = opt.num,
            base = opt.base;

        return Math.log(num) / (base ? Math.log(base) : 1);
    };








    //
    // Creates a donut path and reurns it. This method creates a
    // <path> element and returns that element (it does add to
    // the <svg> document.
    //
    // @param opt object An object consisting of these options:
    //                    o cx
    //                    o cy
    //                    o innerRadius
    //                    o outerRadius
    //                    o stroke
    //                    o fill
    //
    RGraph.SVG.donut = function (opt)
    {
        var arcPath1 = RGraph.SVG.TRIG.getArcPath3({
            cx: opt.cx,
            cy: opt.cy,
            r: opt.outerRadius,
            start: 0,
            end: RGraph.SVG.TRIG.TWOPI,
            anticlockwise: false,
            lineto: false
        });

        var arcPath2 = RGraph.SVG.TRIG.getArcPath3({
            cx: opt.cx,
            cy: opt.cy,
            r: opt.innerRadius,
            start: RGraph.SVG.TRIG.TWOPI,
            end: 0,
            anticlockwise: true,
            lineto: false
        });

        //
        // Create the red circle
        //
        var path = RGraph.SVG.create({
            svg: opt.svg,
            type: 'path',
            parent: opt.parent ? opt.parent : null,
            attr: {
                d: arcPath1 + arcPath2,
                stroke: opt.stroke || 'transparent',
                fill: opt.fill || 'transparent',
             opacity: typeof opt.opacity === 'number' ? opt.opacity : 1
            }
        });

        return path;
    };








    //
    // Copy the globals (if any have been set) from the global object to
    // this instances configuration
    //
    RGraph.SVG.getGlobals = function (obj)
    {
        var properties = obj.properties;
        
        for (var i in RGraph.SVG.GLOBALS) {
            if (typeof i === 'string') {
                obj.set(i, RGraph.SVG.arrayClone(RGraph.SVG.GLOBALS[i]));
            }
        }
    };








    //
    // This function adds a link to the SVG document
    //
    // @param object opt The various options to the function
    //
    RGraph.SVG.link = function (opt)
    {
        var a = RGraph.SVG.create({
            svg: bar.svg,
            type: 'a',
            parent: bar.svgAllGroup,
            attr: {
                'xlink:href': href,
                target:       target
            }
        });
        
        var text = RGraph.SVG.create({
            svg: bar.svg,
            type: 'text',
            parent: a,
            attr: {
                x: x,
                y: y,
                fill: fill
            }
        });
        
        //text.innerHTML = text;
        text.insertAdjacentHTML('afterbegin', String(text));
    };








    // This function is used to get the errorbar MAXIMUM value. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsMaxValue = function (opt)
    {
        var obj        = opt.object,
            properties = obj.properties,
            index      = opt.index;

        if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNullish(properties.errorbars) && typeof properties.errorbars[index] === 'number') {
            var value = properties.errorbars[index];
        } else if (   typeof properties.errorbars === 'object'
                   && !RGraph.SVG.isNullish(properties.errorbars)
                   && typeof properties.errorbars[index] === 'object'
                   && !RGraph.SVG.isNullish(properties.errorbars[index])
                   && typeof properties.errorbars[index].max === 'number'
                  ) {
            var value = properties.errorbars[index].max;
        } else {
            var value = 0;
        }
        
        return value;
    };








    // This function is used to get the errorbar MINIMUM value. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsMinValue = function (opt)
    {
        var obj        = opt.object,
            properties = obj.properties,
            index      = opt.index;

        if (   typeof properties.errorbars === 'object'
            && !RGraph.SVG.isNullish(properties.errorbars)
            && typeof properties.errorbars[index] === 'object'
            && !RGraph.SVG.isNullish(properties.errorbars[index])
            && typeof properties.errorbars[index].min === 'number'
           ) {
            var value = properties.errorbars[index].min;
        } else {
            var value = null;
        }
        
        return value;
    };








    // This function is used to get the errorbar color. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsColor = function (opt)
    {
        var obj        = opt.object,
            properties = obj.properties,
            index      = opt.index;

        var color = properties.errorbarsColor || 'black';

        if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNullish(properties.errorbars) && typeof properties.errorbars[index] === 'object' && !RGraph.SVG.isNullish(properties.errorbars[index]) && typeof properties.errorbars[index].color === 'string') {
            color = properties.errorbars[index].color;
        }
        
        return color;
    };








    // This function is used to get the errorbar linewidth. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsLinewidth = function (opt)
    {
        var obj        = opt.object,
            properties = obj.properties,
            index      = opt.index;

        var linewidth = properties.errorbarsLinewidth || 1

        if (typeof properties.errorbars === 'object' && !RGraph.SVG.isNullish(properties.errorbars) && typeof properties.errorbars[index] === 'object' && !RGraph.SVG.isNullish(properties.errorbars[index]) && typeof properties.errorbars[index].linewidth === 'number') {
            linewidth = properties.errorbars[index].linewidth;
        }

        return linewidth;
    };








    // This function is used to get the errorbar capWidth. Its in the common
    // file because it's used by multiple chart libraries
    //
    // @param object opt An object containing the arguments to the function
    //         o object: The chart object
    //         o index:  The index to fetch
    RGraph.SVG.getErrorbarsCapWidth = function (opt)
    {
        var obj        = opt.object,
            properties = obj.properties,
            index      = opt.index;

        var capwidth = properties.errorbarsCapwidth || 10

        if (   typeof properties.errorbars === 'object'
            && !RGraph.SVG.isNullish(properties.errorbars)
            && typeof properties.errorbars[index] === 'object'
            && !RGraph.SVG.isNullish(properties.errorbars[index])
            && typeof properties.errorbars[index].capwidth === 'number'
            ) {

            capwidth = properties.errorbars[index].capwidth;
        }

        return capwidth;
    };








    // Allows the conversion of older names and values to newer
    // ones.
    //
    // *** When adding this to a new chart library there needs to be
    // *** two changes done:
    // ***  o Add the list of aliases as a object variable (eg this.aliases = {}; )
    // ***  o The bit that goes in the setter that calls the
    // ***    RGraph.SVG.propertyNameAlias() function - copy this from the Bar chart object
    //
    RGraph.SVG.propertyNameAlias = function () {};















    //
    // This is here so that if the tooltip library has not
    // been included, this function will show an alert
    //informing the user
    //
    if (typeof RGraph.SVG.tooltip !== 'function') {
        RGraph.SVG.tooltip = function ()
        {
            $a('The tooltip library has not been included!');
        };
    }








    //
    // The responsive function. This installs the rules as stipulated
    // in the rules array.
    //
    // @param object conf An object map of properties/arguments for the function.
    //                    This should consist of:
    //                     o maxWidth
    //                     o width
    //                     o height
    //                     o options
    //                     o css
    //                     o parentCss
    //                     o callback
    //
    RGraph.SVG.responsive = function (conf)
    {
        var obj = this;


        //
        // Sort the configuration so that it descends in order of biggest screen
        // to smallest
        //
        conf.sort(function (a, b)
        {
            var aNull = RGraph.SVG.isNullish(a.maxWidth);
            var bNull = RGraph.SVG.isNullish(b.maxWidth);
            
            if (aNull && bNull) return 0;
            if (aNull && !bNull) return -1;
            if (!aNull && bNull) return 1;

            return b.maxWidth - a.maxWidth;
        });

        //
        // Preparse the configuration adding any missing minWidth values to the configuration
        //
        for (var i=0; i<conf.length; ++i) {
            if (conf[i+1] && typeof conf[i+1].maxWidth === 'number') {
                conf[i].minWidth = conf[i+1].maxWidth;
            } else if (!conf[i+1]) {
                conf[i].minWidth = 0;
            }
        }

        //
        // Loop through the configurations
        //
        for (var i=0; i<conf.length; ++i) {
        
            // Set the minimum and maximum
            conf[i].minWidth = RGraph.SVG.isNullish(conf[i].minWidth) ?      0 : conf[i].minWidth;
            conf[i].maxWidth = RGraph.SVG.isNullish(conf[i].maxWidth) ? 100000 : conf[i].maxWidth;
            
            // Create the media query string
            var str = 'screen and (min-width: %1px) and (max-width: %2px)'.format(
                conf[i].minWidth,
                conf[i].maxWidth
            );
        
            var mediaQuery = window.matchMedia(str);
            (function (index)
            {
                mediaQuery.addListener(function (e)
                {
                    if (e.matches) {
                        matchFunction(conf[index]);
                    }
                });
            })(i);
            
            // An Initial test
            if (   document.documentElement.clientWidth >= conf[i].minWidth
                && document.documentElement.clientWidth < conf[i].maxWidth) {
                matchFunction(conf[i]);
            }
        }

        //
        // If a rule matches - this is the function that runs
        //
        function matchFunction (rule)
        {
            // If a width is defined for this rule set it
            if (typeof rule.width === 'number') {
                obj.svg.setAttribute('width',  rule.width);
                obj.container.style.width = rule.width + 'px';
            }


            //
            // If a height is defined for this rule set it
            //
            if (typeof rule.height === 'number') {
                obj.svg.setAttribute('height',  rule.height);
                obj.container.style.height = rule.height + 'px';
            }





            // Are there any options to be set?
            //
            if (typeof rule.options === 'object') {
                for (var j in rule.options) {
                    if (typeof j === 'string') {
                        obj.set(j, rule.options[j]);

                        // Set the original colors to the new colors
                        // if necessary
                        if (j === 'colors' && obj.originalColors) {
                            obj.originalColors = RGraph.SVG.arrayClone(rule.options[j]);
                        }
                    }
                }
            }





            //
            // This function simply sets a CSS property on the object.
            // It accommodates certain name changes
            //
            var setCSS = function (el, name, value)
            {
                var replacements = [
                    ['float', 'cssFloat']
                ];
                
                // Replace the name if necessary
                for (var i=0; i<replacements.length; ++i) {
                    if (name === replacements[i][0]) {
                        name = replacements[i][1];
                    }
                }

                el.style[name] = value;
            };




            //
            // Are there any CSS properties to set on the SVG tag?
            //
            if (typeof rule.css === 'object') {
                for (var j in rule.css) {
                    if (typeof j === 'string') {
                        setCSS(obj.svg.parentNode, j, rule.css[j])
                    }
                }
            }



            //
            // Are there any CSS properties to set on the SVGs PARENT tag?
            //
            if (typeof rule.parentCss === 'object') {
                for (var j in rule.parentCss) {
                    if (typeof j === 'string') {
                        setCSS(obj.svg.parentNode.parentNode, j, rule.parentCss[j])
                    }
                }
            }




            // Redraw the chart - with SVG this is done by the redraw() function
            RGraph.SVG.redraw();




            // Run the callback function if it's defined
            if (typeof rule.callback === 'function') {
                (rule.callback)(obj);
            }
        }
        
        // Returning the object facilitates chaining
        return obj;
    };








    //
    // This function can be used to resize the canvas when the screen size changes. You
    // specify various rules and they're then checked.
    //
    RGraph.SVG.responsiveOld = function (conf)
    {
        var opt = arguments[1] || {},
            
            // This function is added to each object in their constructors so the this
            // variable is the chart object.
            obj   = this,
            
            // The func variable becomes the function that is fired by the resize event
            func  = null,
            
            // This is the timer reference
            timer = null;
        
        // The resizie function will run This many milliseconds after the
        // resize has "finished"
        opt.delay = typeof opt.delay === 'number' ? opt.delay : 200;

        // [TODO] Store defaults that are used if there's no match
        var func = function ()
        {
            // This is set to true if a rule matches
            var matched = false;

            // Loop through all of the rules
            for (var i=0; i<conf.length; ++i) {

                //
                // If a maxWidth is stipulated test that
                //
                if (!matched && (document.documentElement.clientWidth <= conf[i].maxWidth || RGraph.SVG.isNullish(conf[i].maxWidth))) {
                
                    matched = true;
                    
                    // If a width is defined for this rule set it
                    if (typeof conf[i].width === 'number') {                        
                        obj.svg.setAttribute('width',  conf[i].width);
                        obj.container.style.width = conf[i].width + 'px';
                    }




                    //
                    // If a height is defined for this rule set it
                    //
                    if (typeof conf[i].height === 'number') {
                        obj.svg.setAttribute('height',  conf[i].height);
                        obj.container.style.height = conf[i].height + 'px';
                    }




                    //
                    // Are there any options to be set?
                    //
                    if (typeof conf[i].options === 'object' && typeof conf[i].options === 'object') {
                        for (var j in conf[i].options) {
                            if (typeof j === 'string') {

                                obj.set(j, conf[i].options[j]);
                            }
                        }
                    }




                    //
                    // This function simply sets a CSS property on the object.
                    // It accommodates certain name changes
                    //
                    var setCSS = function (el, name, value)
                    {
                        var replacements = [
                            ['float', 'cssFloat']
                        ];
                        
                        // Replace the name if necessary
                        for (var i=0; i<replacements.length; ++i) {
                            if (name === replacements[i][0]) {
                                name = replacements[i][1];
                            }
                        }

                        el.style[name] = value;
                    };




                    //
                    // Are there any CSS properties to set on the SVG tag?
                    //
                    if (typeof conf[i].css === 'object') {
                        for (var j in conf[i].css) {
                            if (typeof j === 'string') {
                                setCSS(obj.svg.parentNode, j, conf[i].css[j])
                            }
                        }
                    }

                    //
                    // Are there any CSS properties to set on the SVGs PARENT tag?
                    //
                    if (typeof conf[i].parentCss === 'object') {
                        for (var j in conf[i].parentCss) {
                            if (typeof j === 'string') {
                                setCSS(obj.svg.parentNode.parentNode, j, conf[i].parentCss[j])
                            }
                        }
                    }



                    // Redraw the chart with SVG this is done by the redraw() function
                    RGraph.SVG.redraw();

                    // Run the callback function if it's defined
                    if (typeof conf[i].callback === 'function') {
                        (conf[i].callback)(obj);
                    }
                }
            }
        }






        // Install the resize event listener
        window.addEventListener('resize', function ()
        {
            // Set a new timer in order to fire the func() function
            if (opt.delay > 0) {
                // Clear the timeout
                clearTimeout(timer);
                
                // Start a new timer going
                timer = setTimeout(func, opt.delay);
            
            // If you don't want a delay before the resizing occurs
            // then set the delay to zero and it will be fired immediately
            } else {
                func();
            }
        });

        
        // Call the function initially otherwise it may never run
        func();
        
        // This facilitates chaining
        return obj;
    };








    //
    // You can now specify your reponsive configuration inline,
    // with the rest of your charts configuration.
    //
    // @param object obj The chart object
    //
    RGraph.SVG.installInlineResponsive = function (obj)
    {
        if (RGraph.SVG.isArray(obj.properties.responsive)) {
            RGraph.SVG.runOnce('install-responsive-configuration-' + obj.uid, function ()
            {
                obj.responsive(obj.properties.responsive);
            });
        }
    };








    //
    // This function gets the text properties when given a relevant prefix.
    // So if you give it 'text' as the prefix you'll get the:
    //
    //  o textFont
    //  o textSize
    //  o textColor
    //  o textBold
    //  o textItalic
    //
    // ...properties. On the other hand if you give it 'yaxisScaleLabels'
    // as the prefix you'll get:
    //
    //  o yaxisScaleLabelsFont
    //  o yaxisScaleLabelsSize
    //  o yaxisScaleLabelsColor
    //  o yaxisScaleLabelsBold
    //  o yaxisScaleLabelsItalic
    // 
    // @param  args object An object consisting of:
    //                      o object
    //                      o prefix
    //
    RGraph.SVG.getTextConf = function (args)
    {
        var obj        = args.object,
            properties = obj.properties,
            prefix     = args.prefix;

        // Has to be a seperate var statement
        var font   = typeof properties[prefix + 'Font']   === 'string'  ? properties[prefix + 'Font']   : properties.textFont,
            size   = typeof properties[prefix + 'Size']   === 'number'  ? properties[prefix + 'Size']   : properties.textSize,
            color  = typeof properties[prefix + 'Color']  === 'string'  ? properties[prefix + 'Color']  : properties.textColor,
            bold   = typeof properties[prefix + 'Bold']   === 'boolean' ? properties[prefix + 'Bold']   : properties.textBold,
            italic = typeof properties[prefix + 'Italic'] === 'boolean' ? properties[prefix + 'Italic'] : properties.textItalic;

        return {font: font, size: size, color: color, bold: bold, italic: italic};
    };








    //
    // Label substitution. This allows you to use dynamic
    // labels if you want like this:
    //
    // ...
    // names: ['Richard','Jerry','Lucy'],
    // xaxisLabels: '%{names:[%{index}]}: %{value_formatted}'
    // ...
    //
    //@param object args This can be an object which contains the following
    //                   things:
    //                           args.text      The text on which to perform the substitution on
    //                                          (ie the original label)
    //                           args.object    The chart object
    //                           args.index     The index of the label
    //                           args.value     The value of the data point
    //                           args.decimals  The number of decimals
    //                           args.point     The decimal character
    //                           args.thousand  The thousand separator
    //                           args.unitsPre  The units that are prepended to the number
    //                           args.unitsPost The units that are appended to the number
    //                          
    //
    RGraph.SVG.labelSubstitution = function (args)
    {
          //////////////////////
         // Must be a string //
        //////////////////////
        var text = String(args.text);

          /////////////////////////////////////////////////////////////////
         // If there's no template tokens in the string simply reurn it //
        /////////////////////////////////////////////////////////////////
        if (!text.match(/%{.*?}/)) {
            return text;
        }

          //////////////////////////////////////////
         // This allows for escaping the percent //
        //////////////////////////////////////////
        var text = text.replace(/%%/g, '___--PERCENT--___');





          ////////////////////////////////////
         // Replace the index of the label //
        ////////////////////////////////////
        text = text.replace(/%{index}/g, args.index);



          ////////////////////////////////////////////////////////////////////
         // Do property substitution when there's an index to the property //
        ////////////////////////////////////////////////////////////////////
        var reg = /%{prop(?:erty)?:([_a-z0-9]+)\[([0-9]+)\]}/i;

        while (text.match(reg)) {

            var property = RegExp.$1,
                index    = parseInt(RegExp.$2);

            if (args.object.properties[property]) {
                text = text.replace(
                    reg,
                    args.object.properties[property][index] || ''
                );

            // Get rid of the text if there was nothing to replace the template bit with
            } else {
                text = text.replace(reg,'');
            }
                
            RegExp.lastIndex = null;
        }


          ////////////////////////////////////
         // Replace this: %{property:xxx}% //
        ////////////////////////////////////
        while (text.match(/%{property:([_a-z0-9]+)}/i)) {
            var str = '%{property:' + RegExp.$1 + '}';
            text    = text.replace(str, args.object.properties[RegExp.$1]);
        }



         ////////////////////////////////
        // Replace this: %{prop:xxx}% //
        ///////////////////////////////
        while (text.match(/%{prop:([_a-z0-9]+)}/i)) {
            var str = '%{prop:' + RegExp.$1 + '}';
            text    = text.replace(str, args.object.properties[RegExp.$1]);
        }



          /////////////////////////////////////////////////////////
         // Replace this: %{value} and this: %{value_formatted} //
        ////////////////////////////////////////////////////////
        while (text.match(/%{value(?:_formatted)?}/i)) {
            
            var value = args.value;

            if (text.match(/%{value_formatted}/i)) {







                text = text.replace(
                    '%{value_formatted}',
                    typeof value === 'number' ? RGraph.SVG.numberFormat({
                        object:    args.object,
                        num:       value.toFixed(args.decimals),
                        thousand:  args.thousand  || ',',
                        point:     args.point     || '.',
                        prepend:  args.unitsPre  || '',
                        append: args.unitsPost || ''
                    }) : null
                );

            } else {
                text = text.replace('%{value}', value);
            }
        }
















          ////////////////////////////////////////////////////////////////
         // Do global substitution when there's an index to the global //
        ////////////////////////////////////////////////////////////////
        var reg = /%{global:([_a-z0-9.]+)\[([0-9]+)\]}/i;

        while (text.match(reg)) {

            var name  = RegExp.$1,
                index = parseInt(RegExp.$2);

            if (eval(name)[index]) {
                text = text.replace(
                    reg,
                    eval(name)[index] || ''
                );

            // Get rid of the text if there was nothing to replace the template bit with
            } else {
                text = text.replace(reg,'');
            }
                
            RegExp.lastIndex = null;
        }
















          //////////////////////////////////////////////////
         // Do global substitution when there's no index //
        //////////////////////////////////////////////////
        var reg = /%{global:([_a-z0-9.]+)}/i;

        while (text.match(reg)) {

            var name = RegExp.$1;

            if (eval(name)) {
                text = text.replace(
                    reg,
                    eval(name) || ''
                );

            // Get rid of the text if there was nothing to replace the template bit with
            } else {
                text = text.replace(reg,'');
            }
                
            RegExp.lastIndex = null;
        }
        
        
        
        
        
        
        
        
        
        
        
        
        
        
        



        ///////////////////////////////////
        // And lastly - call any functions
        // MUST be last
        //////////////////////////////////
        var regexp = /%{function:([_A-Za-z0-9]+)\((.*?)\)}/;
        
        // Temporarily replace carriage returns and line feeds with CR and LF
        // so the the s option is not needed
        text = text.replace(/\r/,'|CR|');
        text = text.replace(/\n/,'|LF|');

        while (text.match(regexp)) {

            var str  = RegExp.$1 + '(' + RegExp.$2 + ')';
            
            for (var i=0,len=str.length; i<len; ++i) {
                str  = str.replace(/\r?\n/, "\\n");
            }
            
            RGraph.SVG.REG.set('label-templates-function-object', args.object);

            var func = new Function ('return ' + str);
            var ret  = func();

            text = text.replace(regexp, ret)
        }

        // Replace CR and LF with a space
        text = text.replace(/\|CR\|/, ' ');
        text = text.replace(/\|LF\|/, ' ');







        
        // Replace line returns with br tags
        //text = text.replace(/\r?\n/g, '<br />'); Pretty sure this doesn't need doing here
        text = text.replace(/___--PERCENT--___/g, '%')


        return text.toString();
    };








    //
    //
    // Adds custom text to the chart based on whats
    // in the objects text: property.
    //
    //@param object obj The chart object
    //
    RGraph.SVG.addCustomText = function (obj)
    {
        if (RGraph.SVG.isArray(obj.properties.text) && obj.properties.text.length) {
            for (var i=0; i<obj.properties.text.length; ++i) {
                
                var conf = obj.properties.text[i];
                
                // Add the object to the config
                conf.object = obj;

                // Set the color to black if it's not set
                if (typeof conf.color !== 'string' || !conf.color.length) {
                    conf.color = 'black';
                }

                RGraph.SVG.text(conf);
            }
        }
    };








    //
    // This function sets CSS styles on a DOM element
    //
    // @param element    mixed  This can either be a string or a DOM
    //                          object
    // @param properties object This should be an object map of
    //                          the CSS properties to set.
    //                          JavaScript property names should
    //                          be used.
    //
    RGraph.SVG.setCSS = function (element, properties)
    {
        if (typeof element === 'string') {
            element = document.getElementById(element);
        }

        for (i in properties) {
            if (typeof i === 'string') {
                element.style[i] = properties[i];
            }
        }
    };








    //
    // A set of functions which help you get data from the GET
    // string (the query string).
    //
    RGraph.SVG.GET.raw = function ()
    {
        return location.search;
    };








    RGraph.SVG.GET.parse = function ()
    {
        if (!RGraph.SVG.isNullish(RGraph.SVG.GET.__parts__)) {
            return RGraph.SVG.GET.__parts__;
        }

        var raw   = RGraph.SVG.GET.raw().replace(/^\?/, '');
        var parts = raw.split(/\&/);
        
        // Loop thru each part splitting it
        for (var i=0; i<parts.length; ++i) {
            var tmp = parts[i].split('=');

            parts[tmp[0]] = decodeURI(tmp[1]);
        }
        
        // Store the parsed query-string
        RGraph.SVG.GET.__parts__ = parts;
        
        return parts;
    };








    //
    // Get a string of text from the query string. No special
    // processing is done here.
    //
    // @param string key The part to get
    //
    RGraph.SVG.GET.text =
    RGraph.SVG.GET.string = function (key)
    {
        var parts = RGraph.SVG.GET.parse();
        
        if (!parts[key]) {
            return null;
        }

        return String(parts[key]);
    };








    //
    //  This fetches a number from the query string. It
    // trims leading zeros and reurns a number (not a
    // string).
    //
    // @param string key The part to get 
    //
    RGraph.SVG.GET.number = function (key)
    {
        var parts = RGraph.SVG.GET.parse();
        
        if (!parts[key]) {
            return null;
        }

        return Number(parts[key]);
    };








    //
    // Fetches a JSON object from the query string. It must be
    // valid JSON and is an easy way to pass multiple values
    //using the query string. For example:
    //
    // /foo.html?json={"data":[4,8,6],"labels":["John","Luis","Bob"]}
    // 
    // @param string key The part to get
    //
    RGraph.SVG.GET.json =
    RGraph.SVG.GET.object = function (key)
    {
        var parts = RGraph.SVG.GET.parse();
        
        if (!parts[key]) {
            return null;
        }

        return JSON.parse(parts[key]);
    };








    //
    // This allows you to easily pass a  list of numbers over the
    // query string. For example:
    //
    // /test.html?data=5,8,6,3,5,4,6
    //
    // @param string key      The part to get
    // @param string OPTIONAL The seperator to use (defaults to a
    //                        comma)
    //
    RGraph.SVG.GET.list  =
    RGraph.SVG.GET.array = function (key)
    {
        var parts = RGraph.SVG.GET.parse();
        
        if (!parts[key]) {
            return null;
        }
        
        
        if (!arguments[1]) {
            var sep = ',';
        } else {
            var sep = arguments[1];
        }
        
        var arr = parts[key].split(sep);
        
        // Remove any starting or trailing square brackets
        arr[0] = arr[0].replace(/^\[/, '');
        arr[arr.length - 1] = arr[arr.length - 1].replace(/\]$/, '');

        // Convert strings to numbers
        for (var i=0; i<arr.length; ++i) {
            
            // Get rid of surrounding quotes
            arr[i] = arr[i].replace(/^('|")/,'');
            arr[i] = arr[i].replace(/('|")$/,'');

            if (Number(arr[i])) {
                arr[i] = Number(arr[i]);
            }
        }

        return arr;
    };








    //
    // Removes the tooltip highlight from the chart. This
    // function is called by each objects .removeHighlight()
    // function.
    //
    RGraph.SVG.removeHighlight = function ()
    {
        var highlight = RGraph.SVG.REG.get('highlight');

        // The highlight is an array
        if (RGraph.SVG.isArray(highlight)) {
            for (var i=0; i<highlight.length; ++i) {
                if (highlight[i] && highlight[i].parentNode) {
                    highlight[i].parentNode.removeChild(highlight[i]);
                }
            }

        } else if (highlight) {

            if (highlight && highlight.parentNode) {
                highlight.parentNode.removeChild(highlight);
            }
        }
            
        RGraph.SVG.REG.set('highlight', null);
    };








    //
    // This function is very similar to the canvas clipTo()
    // function and helps make clipping SVG tags easy.
    //
    // @param object obj        The RGraph chart object
    // @param object dimensions The area that you want to clip to
    //
    RGraph.SVG.clipTo = function (obj, dimensions)
    {
        // A counter that is used in the clip ID
        if (!RGraph.SVG.clipTo.counter) {
            RGraph.SVG.clipTo.counter = 1;
        } else {
            RGraph.SVG.clipTo.counter++;
        }

        var id = 'rgraph_clip_' + RGraph.SVG.clipTo.counter;

        if (typeof dimensions === 'string') {
            
            if (dimensions === 'tophalf') {
            
                // Create the  clipPath element that sits
                // inside the <def> tag
                var clip = RGraph.SVG.create({
                    svg: obj.svg,
                    type: 'clipPath', // This is case sensitive!
                    parent: obj.svg.defs,
                    attr: {
                        id: id
                    }
                });
                
                // Create the shape element for the clip area
                RGraph.SVG.create({
                    svg: obj.svg,
                    parent: clip,
                    type: 'rect',
                    attr: {
                        // These coordinates create a <rect>
                        // that is the same size as the top
                        // half of the SVG tag
                        x: 0,
                        y: 0,
                        width: obj.width,
                        height: (obj.height / 2)
                    }
                });
                
                // Now set the clip-path attribute on the first
                // Line charts all-elements group
                obj.svgAllGroup.setAttribute(
                    'clip-path',
                    'url(#' + id + ')'
                );
            
            
            
            
            } else if (dimensions === 'bottomhalf') {


                // Create the  clipPath element that sits
                // inside the <def> tag
                var clip = RGraph.SVG.create({
                    svg: obj.svg,
                    type: 'clipPath', // This is case sensitive!
                    parent: obj.svg.defs,
                    attr: {
                        id: id
                    }
                });
                
                // Create the shape element for the clip area
                RGraph.SVG.create({
                    svg: obj.svg,
                    parent: clip,
                    type: 'rect',
                    attr: {
                        // These coordinates create a <rect>
                        // that is the same size as the top
                        // half of the SVG tag
                        x: 0,
                        y: (obj.height / 2),
                        width: obj.width,
                        height: (obj.height / 2)
                    }
                });
                
                // Now set the clip-path attribute on the first
                // Line charts all-elements group
                obj.svgAllGroup.setAttribute(
                    'clip-path',
                    'url(#' + id + ')'
                );
            }
        }
    };








    //
    // This function allows the drawing of custom lines
    //
    RGraph.SVG.drawHorizontalLines = function (obj)
    {
        var lines = obj.properties.horizontalLines,
            avg,x,y,label,halign,valign,hmargin = 10,vmargin = 5,
            position,textFont,textSize,textColor,textBold,textItalic,
            data,linewidth;

        if (lines) {

            //
            // Set some defaults for the configuration of
            // each line
            //
            var defaults = {
                dotted:             false,
                dashed:             true,
                color:              '#666', // Same as labelColor property below
                linewidth:          1,
                label:              'Average (%{value})',
                labelPosition:      'top right',
                labelColor:         '#666', // Same as color property above
                labelValueDecimals: 2,
                labelOffsetx:       0,
                labelOffsety:       0
            };
        
        
            // Loop through each line to be drawn
            for (let i=0; i<obj.properties.horizontalLines.length; ++i) {

                var conf       = lines[i],
                    textFont   = conf.labelFont  || obj.properties.textFont,
                    textColor  = conf.labelColor || defaults.labelColor,
                    textSize   = conf.labelSize  || obj.properties.textSize - 4,
                    textBold   = typeof conf.labelBold   === 'boolean' ? conf.labelBold   : obj.properties.textBold,
                    textItalic = typeof conf.labelItalic === 'boolean' ? conf.labelItalic : obj.properties.textItalic;









                switch (obj.type) {
                    case 'line':
                        // Calculate the Y coord if we've been
                        // given a numeric value
                        if (typeof conf.value === 'number') {
                            y = obj.getYCoord(conf.value);
                        
                        } else if(conf.value === 'average') {
                            avg        = RGraph.SVG.arraySum(obj.originalData[0]) /  obj.originalData[0].length;
                            y          = obj.getYCoord(avg);
                        }
                        break;
                        
                    
                    
                    case 'bar':
                        // Calculate the Y coord if we've been
                        // given a numeric value
                        if (typeof conf.value === 'number') {
                            y = obj.getYCoord(conf.value);

                        } else if (conf.value === 'average') {

                            // Calculate the average value of all
                            // of the
                            // values. Grouped charts are treated
                            // slightly differently to stacked
                            // charts.
                            var total = 0;
                            obj.data.map(v => {

                                if (RGraph.SVG.isNumber(v)) {
                                    total += v;
                                } else if (RGraph.SVG.isArray(v)) {
                                    total += RGraph.SVG.arraySum(v);
                                }
                            });


                            var num = 0;
                            for (let i=0; i<obj.data.length; ++i) {
                                if (obj.properties.grouping === 'grouped') {
                                    num += RGraph.SVG.isArray(obj.data[i]) ? obj.data[i].length : 1 ;
                                } else if (obj.properties.grouping === 'stacked') {
                                    ++num;
                                }
                            }

                            avg        = total / num;
                            y          = obj.getYCoord(avg);


                        }
                        break;






                    case 'scatter':
                        // Calculate the Y coord if we've been
                        // given a numeric value
                        if (typeof conf.value === 'number') {
                            y = obj.getYCoord(conf.value);

                        } else if (conf.value === 'average') {
                            // Use the map() function to get an
                            // average value from the first dataset
                            var sum = 0;
                            obj.data[0].forEach(v => sum += v.y);

                            avg = sum / obj.data[0].length;
                            y   = obj.getYCoord(avg);
                        }
                        break;
                }










                //
                // Dotted or dashed lines
                //
                linedash = '';

                if (conf.dotted === true) {
                    linedash = '1 3';
                }
                
                if (conf.dashed === true || (typeof conf.dashed === 'undefined' && typeof conf.dotted === 'undefined') ) {
                    linedash = '6 6';
                }










                //
                // Draw the line
                //
                RGraph.SVG.create({
                    svg:    obj.svg,
                    type:   'line',
                    parent: obj.svgAllGroup,
                    attr: {
                        x1:                 obj.properties.marginLeft,
                        y1:                 y,
                        x2:                 obj.width - obj.properties.marginRight,
                        y2:                 y,
                        'stroke-width':     typeof conf.linewidth === 'number' ? conf.linewidth : defaults.linewidth,
                        'stroke-dasharray': linedash,
                        stroke:             conf.color || defaults.color
                    }
                });





                //
                // Draw the label
                //




                // These chart types only
                if (['bar','line','scatter'].includes(obj.type)) {
                    
                    
                    // Default pos for the label
                    if (!conf.labelPosition) {
                        conf.labelPosition = defaults.labelPosition;
                    }



                    if (typeof conf.labelPosition === 'string' && conf.labelPosition.indexOf('left') >= 0) {
                        textX  = obj.properties.marginLeft + hmargin;
                        halign = 'left';
                    } else if (typeof conf.labelPosition === 'string' && conf.labelPosition.indexOf('center') >= 0) {
                        textX  = ((obj.width - obj.properties.marginLeft - obj.properties.marginRight) / 2) + obj.properties.marginLeft;
                        halign = 'center';
                    } else {
                        textX  = obj.width - obj.properties.marginRight - hmargin;
                        halign = 'right';
                    }


                    if (typeof conf.labelPosition === 'string' && conf.labelPosition.indexOf('bottom') >= 0) {
                        textY  = y + vmargin;
                        valign = 'top';
                    } else {
                        textY  = y - vmargin;
                        valign = 'bottom';
                    }
                }

                // Account for linewidth
                linewidth = typeof conf.linewidth === 'number' ? conf.linewidth : defaults.linewidth;

                var num = RGraph.SVG.numberFormat({
                    object:    obj,
                    num:       (typeof conf.value === 'number' ? conf.value : avg).toFixed(typeof conf.labelValueDecimals === 'number' ? conf.labelValueDecimals : defaults.labelValueDecimals),
                    prepend:   conf.labelValueUnitsPre,
                    append:    conf.labelValueUnitsPost,
                    thousand:  conf.labelValueThousand,
                    point:     conf.labelValuePoint,
                    formatter: conf.labelValueFormatter
                });




                //
                // Draw the label
                //
                RGraph.SVG.text({
                    object:     obj,
                    parent:     obj.svgAllGroup,
                    tag:        'horizontal.line',
                    text:       (typeof conf.label === 'string' ? conf.label : defaults.label).replace('%{value}', num),
                    x:          textX + parseFloat(conf.labelOffsetx || defaults.labelOffsetx),
                    y:          textY - (linewidth / 2) + parseFloat((conf.labelPosition.indexOf('top') !== -1 ? (-1 * conf.labelOffsety) : conf.labelOffsety) || defaults.labelOffsety),
                    halign:     halign,
                    valign:     valign,
                    font:       textFont,
                    size:       textSize,
                    bold:       textBold,
                    italic:     textItalic,
                    color:      textColor,
                    background: 'rgba(255,255,255,0.75)',
                    padding:    1
                });
            }
        }
    };







    
    //
    // This small function allows you to easily run a function
    // once only
    //
    // @param string id     A unique identifier that is used to
    //                      identify this function so that it only
    //                      runs once
    // @param function func The function that should be run
    //                      (immediately) only once
    //
    RGraph.SVG.runOnce = function (id, func)
    {
        if (RGraph.SVG.REG.get('rgraph-svg-runonce-functions')[id]) {
            return;
        }

        RGraph.SVG.REG.get('rgraph-svg-runonce-functions')[id] = func;
        
        return func();
    };
    //
    // Produce a rounded rectangle
    //
    //  @param options An object of various options
    //                 for the rectangle:
    //                   svg:       The SVG tag
    //                   x:         The X coordinate
    //                   y:         The Y coordinate
    //                   width:     The width of the rectangle
    //                   height:    The height of the rectangle
    //                   radius:    The radius of the corners. At
    //                              most this is the minimum of half
    //                              the width and half the height.
    //                              This can be a number, an array
    //                              of a single number or an array
    //                              of four numbers.
    //                   stroke:    The stroke colour of the rect
    //                   fill:      The fill colour of the rect
    //                   linewidth: The line width of the stroke
    //
    // @return The path node (after it has been added to the scene)
    //
    // Example usage:
    //
    //    var node = RGraph.SVG.roundRect({
    //        svg: bar.svg,
    //        attr: {
    //            x: 100,
    //            y: 50,
    //            width: 150,
    //            height: 200,
    //            radius: 15,
    //            stroke: 'black',
    //            fill: 'yellow',
    //            linewidth: 1
    //        }
    //    });
    //    
    RGraph.SVG.roundRect = function (options)
    {
        var tl, tr, bl, br;
        
        // Allow for the x/y/width/height/radius being specified
        // outside of the attr object.
        if (options.attr && options.x)      options.attr.x      = options.x;
        if (options.attr && options.y)      options.attr.y      = options.y;
        if (options.attr && options.width)  options.attr.width  = options.width;
        if (options.attr && options.height) options.attr.height = options.height;
        if (options.attr && options.radius) options.attr.radius = options.radius;
        
        if (!options.x      && RGraph.SVG.isNumber(options.attr.x))      options.x      = options.attr.x;
        if (!options.y      && RGraph.SVG.isNumber(options.attr.y))      options.y      = options.attr.y;
        if (!options.width  && RGraph.SVG.isNumber(options.attr.width))  options.width  = options.attr.width;
        if (!options.height && RGraph.SVG.isNumber(options.attr.height)) options.height = options.attr.height;
        if (!options.radius && (RGraph.SVG.isNumber(options.attr.radius) || RGraph.SVG.isArray(options.attr.radius)) ) options.radius = options.attr.radius;

        // Determine which corners are to be rounded
        if (   RGraph.SVG.isNumber(options.radius)
            || (RGraph.SVG.isArray(options.radius) && options.radius.length < 4 && RGraph.SVG.isNumber(options.radius[0])) ) {
            
            if (RGraph.SVG.isArray(options.radius)) {
                options.radius = options.radius[0];
            }

            tl = Math.min(options.radius, Math.min(options.width, options.height) / 2);
            tr = Math.min(options.radius, Math.min(options.width, options.height) / 2);
            br = Math.min(options.radius, Math.min(options.width, options.height) / 2);
            bl = Math.min(options.radius, Math.min(options.width, options.height) / 2);
        
        // Two numbers given for the radius - top and bottom
        } else if (RGraph.SVG.isArray(options.radius) && options.radius.length >= 4) {
            tl = Math.min(options.radius[0], Math.min(options.width, options.height) / 2);
            tr = Math.min(options.radius[1], Math.min(options.width, options.height) / 2);
            br = Math.min(options.radius[2], Math.min(options.width, options.height) / 2);
            bl = Math.min(options.radius[3], Math.min(options.width, options.height) / 2);
        } else {

            //
            // Set all the corners to 0
            //
            tl = tr = br = bl = 0;
        }
        
        //
        // Build the path for the rounded rect
        //
        var path = 'M {1} {2} '.format(
            options.x + (options.width / 2),
            options.y
        );
        
        path += ' ' + RGraph.SVG.TRIG.getArcPath3({
            cx: options.x + options.width - tr,
            cy: options.y + tr,
            start: 0,
            end: RGraph.SVG.TRIG.HALFPI,
            radius: tr
        });

        path += ' ' + RGraph.SVG.TRIG.getArcPath3({
            cx: options.x + options.width - br,
            cy: options.y + options.height - br,
            start: RGraph.SVG.TRIG.HALFPI,
            end: RGraph.SVG.TRIG.PI,
            radius: br
        });

        path += ' ' + RGraph.SVG.TRIG.getArcPath3({
            cx: options.x + bl,
            cy: options.y + options.height - bl,
            start: RGraph.SVG.TRIG.PI,
            end: RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI,
            radius: bl
        });

        path += ' ' + RGraph.SVG.TRIG.getArcPath3({
            cx: options.x + tl,
            cy: options.y + tl,
            start: RGraph.SVG.TRIG.PI + RGraph.SVG.TRIG.HALFPI,
            end: RGraph.SVG.TRIG.TWOPI,
            radius: tl
        });








        path += ' ' + path + ' z';





        //
        // Determine the attributes that are applied to the <path>
        // element if they've been passed.
        //
        if (options.attr) {
            var attr = options.attr;
            attr.d = path;
        } else {
            var attr = {d: path};
        }

        //
        // Add the path to the svg
        //
        var path = RGraph.SVG.create({
            svg: options.svg,
            parent: options.parent ? options.parent : null,
            type: 'path',
            attr: attr // Apply the attributes that were defined
                       // above
        });





        return path;
    };








    //
    // This function handles the installation of clipping
    //
    RGraph.SVG.installClipping = function (obj)
    {
        var id       = 'rgraph-clipping-' + RGraph.SVG.random(0, 9999999);
        var clipPath = obj.create(
            '<clipPath id="{1}">'.format(id), obj.svg.defs
        );

        if (RGraph.SVG.isString(obj.properties.clip)) {
            
            // TOPHALF
            if (obj.properties.clip === 'tophalf') {
                var halfHeight   = (obj.height - obj.properties.marginTop - obj.properties.marginBottom) * 0.5;
                var clipPathRect = obj.create('<rect x="0" y="0" width="{1}" height="{2}">'.format(obj.width, halfHeight + obj.properties.marginTop), clipPath);
    
            // BOTTOM HALF
            } else if (obj.properties.clip === 'bottomhalf') {
                var halfHeight   = (obj.height - obj.properties.marginTop - obj.properties.marginBottom) * 0.5;
                var clipPathRect = obj.create('<rect x="0" y="{1}" width="{2}" height="{3}">'.format(obj.properties.marginTop + halfHeight,obj.width,halfHeight + obj.properties.marginBottom),clipPath);
            
            // LEFT HALF
            } else if (obj.properties.clip === 'lefthalf') {
                var halfWidth    = (obj.width - obj.properties.marginLeft - obj.properties.marginRight) * 0.5;
                var clipPathRect = obj.create('<rect x="0" y="0" width="{1}" height="{2}">'.format(obj.properties.marginLeft + halfWidth, obj.height), clipPath);
            
            
            // RIGHT HALF
            } else if (obj.properties.clip === 'righthalf') {
                var halfWidth    = (obj.width - obj.properties.marginLeft - obj.properties.marginRight) * 0.5;
                var clipPathRect = obj.create('<rect x="{1}" y="0" width="{2}" height="{3}">'.format(obj.properties.marginLeft + halfWidth, halfWidth + obj.properties.marginRight, obj.height),clipPath);
            
            // HORIZONTAL PERCENTAGES
            } else if (obj.properties.clip.match(/^x:([-.0-9minax]+)%?-([.0-9minax]+)%?$/i)) {

                // Accommodate the min/max keywords
                var from = RegExp.$1,
                    to   = RegExp.$2;

                from = from.replace(/min/, '-200');
                from = from.replace(/max/, '200');
                to   = to.replace(/min/, '-200');
                to   = to.replace(/max/, '200');

                from   = Number(from);
                to     = Number(to);

                var width  = obj.width - obj.properties.marginLeft - obj.properties.marginRight,
                    x      = (from / 100) * width + obj.properties.marginLeft,
                    y      = 0,
                    width  = ((to - from)  / 100) * (obj.width - obj.properties.marginLeft - obj.properties.marginRight),
                    height = obj.height;

                var clipPathRect = obj.create('<rect x="{1}" y="{2}" width="{3}" height="{4}">'.format(
                    x, y, width, height
                ),clipPath);
            
            // VERTICAL PERCENTAGES
            } else if (obj.properties.clip.match(/^y:([-.0-9minax]+)%?-([.0-9minax]+)%?/i)) {
    
                // Accommodate the min/max keywords
                var from = RegExp.$1,
                    to   = RegExp.$2;

                from = from.replace(/min/, '-200');
                from = from.replace(/max/, '200');
                to   = to.replace(/min/, '-200');
                to   = to.replace(/max/, '200');

                from   = Number(from);
                to     = Number(to);

                var x      = 0,
                    width  = obj.width,
                    //y1     = ((to - from) / 100) * (obj.height - obj.properties.marginTop - obj.properties.marginBottom),
                    y2     = (to / 100) * (obj.height - obj.properties.marginTop - obj.properties.marginBottom);
                    y      = obj.height - obj.properties.marginBottom - y2,
                    height = (obj.height - obj.properties.marginTop - obj.properties.marginBottom) * ( (to - from) / 100);

                var clipPathRect = obj.create('<rect x="{1}" y="{2}" width="{3}" height="{4}">'.format(
                    x, y, width, height
                ),clipPath);















            // RADIAL PERCENTAGES
            } else if (obj.properties.clip.match(/^r(?:adius)?:([-.0-9minax]+)%?-([.0-9minax]+)%?/i)) {
            
                // Accommodate the min/max keywords
                var from = RegExp.$1,
                    to   = RegExp.$2;
            
                from = from.replace(/min/, '0');
                from = from.replace(/max/, '2000');
                to   = to.replace(/min/, '0');
                to   = to.replace(/max/, '2000');
            
                from   = Number(from);
                to     = Number(to);
            
                // Get the radius, centerx and centery from the
                // object
                if (!RGraph.SVG.isNumber(obj.centerx) || !RGraph.SVG.isNumber(obj.centery) || !RGraph.SVG.isNumber(obj.radius)) {
                    alert('[RGRAPH CLIPPING] To use the r: syntax the object (Type: {1}, ID: {2}, UID: {3}) must support the centerx, centery and radius properties.'.format(
                        obj.type,
                        obj.id,
                        obj.uid
                    ));
                }
            
                var centerx = obj.centerx,
                    centery = obj.centery,
                    r1      = (from / 100) * obj.radius,
                    r2      = (to / 100) * obj.radius;
            
                var donut = RGraph.SVG.donut({
                    svg: obj.svg,
                 parent: clipPath,
                     cx: centerx,
                     cy: centery,
            innerRadius: r1,
            outerRadius: r2
                });












            //
            // CLIP TO A SEGMENT
            //
            } else if (obj.properties.clip.match(/^(?:segment|arc): *([-.0-9degrad]+) *, *([-.0-9degrad]+) *, *([-.0-9degrad]+) *, *([-.0-9degrad]+) *, *([-.0-9degrad]+)$/i)) {
                
                var centerx = RegExp.$1,
                    centery = RegExp.$2,
                    radius  = RegExp.$3,
                    start   = RegExp.$4,
                    end     = RegExp.$5;

                // If radians has been stipulated then get rid of it
                start = start.replace(/rad$/, '');
                end   = end.replace(/rad$/, '');
                
                // Convert degrees to radians for the start angle
                if (start.match(/deg$/)) {
                    start = parseFloat(start);
                    start = start * (RGraph.SVG.TRIG.PI / 180);
                }
                
                // Convert degrees to radians for the end angle
                if (end.match(/deg$/)) {
                    end = parseFloat(end);
                    end = end * (RGraph.SVG.TRIG.PI / 180);
                }
                
                // Limit the end angle to TWOPI
                if (end > RGraph.SVG.TRIG.TWOPI) end = RGraph.SVG.TRIG.TWOPI;

                // Create an arc path
                var path = RGraph.SVG.TRIG.getArcPath3({
                    cx:     centerx,
                    cy:     centery,
                    r:      radius,
                    start:  start,
                    end:    end,
                    anticlockwise: false,
                    lineto: true
                });
                
                // Add the path to the all group
                var arc = RGraph.SVG.create({
                    svg:    obj.svg,
                    parent: clipPath,
                    type:   'path',
                    attr: {
                        d: str = 'M {1} {2} {3} z'.format(centerx, centery, path)
                    }
                });












            //
            // CLIP TO A CIRCLE
            //
            } else if (obj.properties.clip.match(/^circle: *([-.0-9]+) *, *([-.0-9]+) *, *([-.0-9]+)$/i)) {
                
                var centerx = RegExp.$1,
                    centery = RegExp.$2,
                    radius  = RegExp.$3;
                
                // Add the path to the all group
                var circle = RGraph.SVG.create({
                    svg:    obj.svg,
                    parent: clipPath,
                    type:   'circle',
                    attr: {
                        cx: centerx,
                        cy: centery,
                         r: radius
                    }
                });
                
                // Add the path to the all group
                var circle = RGraph.SVG.create({
                    svg:    obj.svg,
                    parent: obj.svgAllGroup,
                    type:   'circle',
                    attr: {
                        cx: centerx,
                        cy: centery,
                         r: radius,
                         fill: 'none',
                         stroke: '#ddd',
                         'stroke-linewidth': 1
                    }
                });









            // SCALE BASED CLIPPING
            //
            // Clip to scale values - since all of the
            // charts handle scales differently this is
            // handled by worker functions on each object
            //
            } else if (obj.properties.clip.match(/^(?:scale: *)([-.0-9min]+) *- *([-.0-9max]+) *$/)) {

                if (obj.clipToScaleWorker) {
                    obj.clipToScaleWorker(clipPath);
                } else {
                    console.log('The scale: clipping option isn\'t implemented for this chart type (' + obj.type + ')');
                }

            } else {
                // An SVG path string
                var path = RGraph.SVG.create({
                    svg: obj.svg,
                    type: 'path',
                    parent: clipPath,
                    attr: {
                        d: obj.properties.clip
                    }
                });
            }
        
        // An array of four numbers
        } else if (   RGraph.SVG.isArray(obj.properties.clip)
                   && obj.properties.clip.length === 4
                   && RGraph.SVG.isNumber(obj.properties.clip[0])
                   && RGraph.SVG.isNumber(obj.properties.clip[1])
                   && RGraph.SVG.isNumber(obj.properties.clip[2])
                   && RGraph.SVG.isNumber(obj.properties.clip[3])
                  ) {

            var clipPathRect = obj.create('<rect x="{1}" y="{2}" width="{3}" height="{4}">'.format(
                obj.properties.clip[0],
                obj.properties.clip[1],
                obj.properties.clip[2],
                obj.properties.clip[3]
            ),clipPath);
        
        // A 2D array of path coordinates (x/y pairs)
        //    eg [[0,0],[100,0],[100,100],[0,100]]
        } else if (   RGraph.SVG.isArray(obj.properties.clip)
                   && RGraph.SVG.isArray(obj.properties.clip[0])
                   && obj.properties.clip[0].length === 2
                  ) {
            var str   = RGraph.SVG.create.pathString(obj.properties.clip);
            var path = RGraph.SVG.create({
                svg: obj.svg,
                type: 'path',
                parent: clipPath,
                attr: {
                    d: str
                }
            });
        }

        return id;
    };








    //
    // A convenient function tat can be used to draw images
    // on the SVG
    //
    // @param opt An object of options that you can give to
    //            the image. Tese are documented on the docs
    //            page on the website:
    //
    //            https://www.rgraph.net/svg/drawimage.html
    //
    RGraph.SVG.drawImage = function (opt)
    {
        // Check that the necessary options have been supplied
        if (   !opt.object
            || !RGraph.SVG.isNumber(opt.x)
            || !RGraph.SVG.isNumber(opt.y)
            || !opt.src
           ) {
            alert('[DRAWIMAGE] You must give the object, src, x and y properties in the options to the drawImage function');
            return;
        }

        var borderRadius          = opt.borderRadius || 0;
        var clipPath              = '';
        var padding               = opt.padding || 0;
        
        // Need to get the width and height of the image so
        // create an offscreen image and set it to the image
        // so that the dimensions can then be garnered
        if (!opt.width || !opt.height) {
            var img = new Image();
            img.src = opt.src;
            img.onload = function ()
            {
                if (typeof opt.width !== 'number') {
                    opt.width  = this.width;
                }

                if (typeof opt.height !== 'number') {
                    opt.height = this.height;
                }
                
                draw();
            }
        } else {
            draw();
        }









        function draw ()
        {
            // If the borderRadius is greater than zero then add
            // some clipping so the image doesn't spill over the
            // border
            if (borderRadius > 0) {

                // A counter that is used in the clip ID
                if (!RGraph.SVG.clipTo.counter) {
                    RGraph.SVG.clipTo.counter = 1;
                } else {
                    RGraph.SVG.clipTo.counter++;
                }

                var clipID = 'rgraph_clip_' + RGraph.SVG.clipTo.counter;

                // Create the  clipPath element that sits
                // inside the <def> tag
                var clip = RGraph.SVG.create({
                    svg: opt.object.svg,
                    type: 'clipPath', // This is case sensitive!
                    parent: opt.object.svg.defs,
                    attr: {
                        id: clipID
                    }
                });
                
                // Create the shape element for the clip area
                RGraph.SVG.create({
                    svg: opt.object.svg,
                    parent: clip,
                    type: 'rect',
                    attr: {
                        x:      opt.x - padding,
                        y:      opt.y - padding,
                        width:  opt.width + padding + padding,
                        height: opt.height + padding + padding,
                        rx:     borderRadius,
                        ry:     borderRadius
                    }
                });
                
                var clipPath = 'url(#' + clipID + ')';
            }

            //
            // Create a clip area first so that the image doesn't
            // spill over the border

            // Add a background color
            if (opt.backgroundColor) {

                // The width of the border needs to
                // be accounted for
                var extraWidth = (opt.borderWidth || 1) / 2

                var background = RGraph.SVG.create({
                    svg:    opt.object.svg,
                    parent: opt.object.svgAllGroup,
                    type:   'rect',
                    attr: {
                        x:      opt.x - extraWidth - padding,
                        y:      opt.y - extraWidth - padding,
                        width:  opt.width + extraWidth + extraWidth + padding + padding,
                        height: opt.height + extraWidth + extraWidth + padding + padding,
                        stroke: 'transparent',
                        fill: opt.backgroundColor,
                        'stroke-width': 0,
                        rx: opt.border ? borderRadius : 0,
                        ry: opt.border ? borderRadius : 0
                    },
                    style: opt.opacity ? {opacity: opt.opacity} : null
                });
            }

            //
            // Add the IMAGE
            //
            var img = RGraph.SVG.create({
                svg:    opt.object.svg,
                parent: opt.object.svgAllGroup,
                type:   'image',
                attr:   {
                    'xlink:href': opt.src,
                    x:            opt.x,
                    y:            opt.y,
                    width:        opt.width,
                    height:       opt.height,
                    'clip-path':  (clipPath && opt.border && opt.borderRadius > 0) ? clipPath : ''
                },
                style: opt.opacity ? {opacity: opt.opacity} : null
            });



            // Add the border if requested so that it appears over
            // the image
            if (opt.border) {
                // The width of the border needs to
                // be accounted for
                var extraWidth = (opt.borderWidth || 1) / 2
                var border = RGraph.SVG.create({
                    svg:    opt.object.svg,
                    parent: opt.object.svgAllGroup,
                    type:   'rect',
                    attr: {
                        x:      opt.x - extraWidth - padding,
                        y:      opt.y - extraWidth - padding,
                        width:  opt.width + extraWidth + extraWidth + padding + padding,
                        height: opt.height + extraWidth + extraWidth + padding + padding,
                        stroke: opt.borderColor || 'black',
                        fill: 'transparent',
                        'stroke-width': opt.borderWidth || 1,
                        rx: borderRadius,
                        ry: borderRadius
                    }
                });
            }
        }
        
        return img;
    };








// End module pattern
})(window, document);








    //
    // Loosly mimicks the PHP function print_r();
    //
    window.$p = function (obj)
    {
        var indent = (arguments[2] ? arguments[2] : '    ');
        var str    = '';
    
        var counter = typeof arguments[3] == 'number' ? arguments[3] : 0;
        
        if (counter >= 5) {
            return '';
        }
        
        switch (typeof obj) {
            
            case 'string':    str += obj + ' (' + (typeof obj) + ', ' + obj.length + ')'; break;
            case 'number':    str += obj + ' (' + (typeof obj) + ')'; break;
            case 'boolean':   str += obj + ' (' + (typeof obj) + ')'; break;
            case 'function':  str += 'function () {}'; break;
            case 'undefined': str += 'undefined'; break;
            case 'null':      str += 'null'; break;
            
            case 'object':
                // In case of null
                if (RGraph.SVG.isNullish(obj)) {
                    str += indent + 'null\n';
                } else {
                    str += indent + 'Object {' + '\n'
                    for (j in obj) {
                        str += indent + '    ' + j + ' => ' + window.$p(obj[j], true, indent + '    ', counter + 1) + '\n';
                    }
                    str += indent + '}';
                }
                break;
            
            
            default:
                str += 'Unknown type: ' + typeof obj + '';
                break;
        }
    
    
        //
        // Finished, now either return if we're in a recursed call, or alert()
        // if we're not.
        //
        if (!arguments[1]) {
            alert(str);
        }
        
        return str;
    };







    //
    // A shorthand for the default alert() function
    //
    window.$a = function (v)
    {
        alert(v);
    };








    //
    // Short-hand for console.log
    //
    // @param mixed v The variable to log to the console
    //
    window.$c =
    window.$cl = function (v)
    {
        return console.log(v);
    };








    //
    // Polyfill for the String.protfotype.substr() method which may not be included on some devices
    //
    // @param  number start  The start index. Zero-indexed and can also be negtive - in which case
    //                       the counting starts from the end of the string
    // @param  number length The length of the string to extract
    // @return string        The new string
    //
    if (typeof ''.substr !== 'function') {
        String.prototype.substr = function (start, length)
        {
            start = start >=0 ? start : this.length + start;
            return this.substring(start, start + length);
 
        };
    }








    //
    // A basic string formatting function. Use it like this:
    // 
    // var str = '{1} {2} {3}'.format('a', 'b', 'c');
    //
    // Outputs: a b c
    //
    String.prototype.format = function()
    {

        //
        // Allow for this type of formatting: {myVar}
        //
        if (arguments.length === 0) {
        
            var s = this;
        
            // Allow for {myVar} style
            if (s.match(/{[a-z0-9]+?}/i)) {
                var s = this.replace(/{[a-z0-9]+?}/gi, function(str, idx)
                {
                    str = str.substr(1)
                    str = str.substr(0, str.length - 1)
    
                    return window[str];
                });
            }

            return s;
        }





        var args = arguments;
        
        var s = this.replace(/{(\d+)}/g, function(str, idx)
        {
          return typeof args[idx - 1] !== 'undefined' ? args[idx - 1] : str;
        });
        
        
        // Save percentage signs that are escaped with either another
        // percent or a backslash
        s = s.replace(/(?:%|\\)%(\d)/g,'__PPEERRCCEENNTT__$1');
        
        s = s.replace(/%(\d+)/g, function(str, idx)
        {
          return typeof args[idx - 1] !== 'undefined' ? args[idx - 1] : str;
        });
        
        // Now replace those saved percentage signs with a percentage sign
        return s.replace('__PPEERRCCEENNTT__', '%');
    };








    // Some utility functions that help identify the type of an object
    //
    // Note that isUndefined() should be used like this or you'll get an
    // error (ie with the window. prefix):
    //
    //        RGraph.SVG.isUndefined(window.foo)
    //
    RGraph.SVG.isString    = function (obj){return typeof obj === 'string';};
    RGraph.SVG.isNumber    = function (obj){return typeof obj === 'number';};
    RGraph.SVG.isTextual   = function(obj){return (typeof obj === 'string' || typeof obj === 'number');};
    RGraph.SVG.isNumeric   = function(value){value=String(value);return Boolean(value.match(/^[-.0-9]+$/))||Boolean(value.match(/^[-.0-9]+e[-0-9]+$/))||(value==='Infinity')||(value==='-Infinity')||Boolean(value.match(/^[-.0-9]+x[0-9a-f]+$/i));};
    RGraph.SVG.isBool      =
    RGraph.SVG.isBoolean   = function(obj){return typeof obj === 'boolean';};
    //RGraph.SVG.isArray Defined above
    RGraph.SVG.isObject    = function (obj){return typeof obj === 'object' && obj.constructor.toString().toLowerCase().indexOf('object') > 0;};
    //RGraph.SVG.isNull  Defined above
    RGraph.SVG.isFunction  = function (obj){return typeof obj === 'function';};
    RGraph.SVG.isUndefined = function (obj){return typeof obj === 'undefined';};