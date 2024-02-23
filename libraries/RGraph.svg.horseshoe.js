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

    RGraph     = window.RGraph || {isrgraph:true,isRGraph:true,rgraph:true};
    RGraph.SVG = RGraph.SVG || {};

// Module pattern
(function (win, doc, undefined)
{
    RGraph.SVG.Horseshoe = function (conf)
    {
        //
        // A setter that the constructor uses (at the end)
        // to set all of the properties
        //
        // @param string name  The name of the property to set
        // @param string value The value to set the property to
        //
        this.set = function (name, value)
        {
            if (arguments.length === 1 && typeof name === 'object') {
                for (i in arguments[0]) {
                    if (typeof i === 'string') {
                        
                        name  = ret.name;
                        value = ret.value;

                        this.set(name, value);
                    }
                }
            } else {

                // Go through all of the properties and make sure
                // that they're using the correct capitalisation
                name = this.properties_lowercase_map[name.toLowerCase()] || name;

                var ret = RGraph.SVG.commonSetter({
                    object: this,
                    name:   name,
                    value:  value
                });
                
                name  = ret.name;
                value = ret.value;

                this.properties[name] = value;
            }

            return this;
        };








        //
        // A getter.
        // 
        // @param name  string The name of the property to get
        //
        this.get = function (name)
        {
            // Go through all of the properties and make sure
            // that they're using the correct capitalisation
            name = this.properties_lowercase_map[name.toLowerCase()] || name;

            return this.properties[name];
        };







        this.type            = 'horseshoe';
        this.min             = RGraph.SVG.stringsToNumbers(conf.min);
        this.max             = RGraph.SVG.stringsToNumbers(conf.max);
        this.value           = RGraph.SVG.stringsToNumbers(conf.value);
        this.currentValue    = null; // Used by animations
        this.id              = conf.id;
        this.uid             = RGraph.SVG.createUID();
        this.container       = document.getElementById(this.id);
        this.layers          = {}; // MUST be before the SVG tag is created!
        this.svg             = RGraph.SVG.createSVG({object: this,container: this.container});
        this.svgAllGroup     = RGraph.SVG.createAllGroup(this);
        this.clipid          = null; // Used to clip the canvas
        this.isRGraph        = true;
        this.isrgraph        = true;
        this.rgraph          = true;
        this.width           = Number(this.svg.getAttribute('width'));
        this.height          = Number(this.svg.getAttribute('height'));
        this.colorsParsed    = false;
        this.originalColors  = {};
        this.gradientCounter = 1;
        this.nodes           = {};
        this.firstDraw        = true; // After the first draw this will be false

        // Bounds checking
        if (this.value > this.max) this.value = this.max;
        if (this.value < this.min) this.value = this.min;







        // Add this object to the ObjectRegistry
        RGraph.SVG.OR.add(this);

        // Set the DIV container to be inline-block
        this.container.style.display = 'inline-block';

        this.properties =
        {
            radius:                null,
            centerx:               null,
            centery:               null,
            width:                 10,

            marginLeft:            15,
            marginRight:           15,
            marginTop:             15,
            marginBottom:          15,

            backgroundColor:       null,
            colors:                ['black','#eee'],
            
            textFont:              'Arial, Verdana, sans-serif',
            textSize:              70,
            textColor:             'black',
            textBold:              false,
            textItalic:            false,
            text:                  null,

            labelsCenter:          true,
            labelsCenterFont:      null,
            labelsCenterSize:      null,
            labelsCenterColor:     null,
            labelsCenterBold:      null,
            labelsCenterItalic:    null,
            labelsCenterUnitsPre:  '',
            labelsCenterUnitsPost: '',
            labelsCenterDecimals:  0,
            labelsCenterPoint:     '.',
            labelsCenterThousand:  ',',
            labelsCenterSpecific:  null,
            labelsCenterSpecificFormattedDecimals:     0,
            labelsCenterSpecificFormattedPoint:        '.',
            labelsCenterSpecificFormattedThousand:     ',',
            labelsCenterSpecificFormattedUnitsPre:     '',
            labelsCenterSpecificFormattedUnitsPost:    '',
            labelsCenterOffsetx:   0,
            labelsCenterOffsety:   0,
            
            ends:                  true,
            endsRadius:            null,
            endsStroke:            null,
            endsColor:             null,

            adjustable:            false,
            
            clip: null
        };



        //
        // Add the reverse look-up table  for property names
        // so that property names can be specified in any case.
        //
        this.properties_lowercase_map = [];
        for (var i in this.properties) {
            if (typeof i === 'string') {
                this.properties_lowercase_map[i.toLowerCase()] = i;
            }
        }




        //
        // Copy the global object properties to this instance
        //
        RGraph.SVG.getGlobals(this);





        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
        if (RGraph.SVG.FX && typeof RGraph.SVG.FX.decorate === 'function') {
            RGraph.SVG.FX.decorate(this);
        }





        // Add the responsive function to the object
        this.responsive = RGraph.SVG.responsive;





        var properties = this.properties;








        //
        // The draw method draws the Bar chart
        //
        this.draw = function ()
        {
            // Fire the beforedraw event
            RGraph.SVG.fireCustomEvent(this, 'onbeforedraw');


            // Reset this to prevent it from growing
            this.nodes = {};

            // Should be the first(ish) thing that's done in the
            // .draw() function except for the onbeforedraw event
            // and the installation of clipping.
            this.width  = Number(this.svg.getAttribute('width'));
            this.height = Number(this.svg.getAttribute('height'));



            // Create the defs tag if necessary
            RGraph.SVG.createDefs(this);



            // Add these
            this.graphWidth  = this.width  - properties.marginLeft - properties.marginRight;
            this.graphHeight = this.height - properties.marginTop  - properties.marginBottom;



            // Work out the center point
            this.centerx = (this.graphWidth / 2) + properties.marginLeft;
            this.centery = (this.graphHeight / 2) + properties.marginTop;
            this.radius  = Math.min(this.graphWidth / 2, this.graphHeight / 2);



            // Allow the user to override the calculated centerx/y/radius
            this.centerx = typeof properties.centerx === 'number' ? properties.centerx : this.centerx;
            this.centery = typeof properties.centery === 'number' ? properties.centery : this.centery;
            this.radius  = typeof properties.radius  === 'number' ? properties.radius  : this.radius;

            //
            // Allow the centerx/centery/radius to be a plus/minus
            //
            if (typeof properties.radius  === 'string' && properties.radius.match(/^\+|-\d+$/) )  this.radius  += parseFloat(properties.radius);
            if (typeof properties.centerx === 'string' && properties.centerx.match(/^\+|-\d+$/) ) this.centerx += parseFloat(properties.centerx);
            if (typeof properties.centery === 'string' && properties.centery.match(/^\+|-\d+$/) ) this.centery += parseFloat(properties.centery);
            
            
            
            // Parse the colors for gradients
            RGraph.SVG.resetColorsToOriginalValues({object:this});
            this.parseColors();
            
            
            
            
            
            
            
            






            // Install clipping if requested
            if (this.properties.clip) {

                this.clipid = RGraph.SVG.installClipping(this);

                // Add the clip ID to the all group
                this.svgAllGroup.setAttribute(
                    'clip-path',
                    'url(#{1})'.format(this.clipid)
                );
            }
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            





            // Draw the meter
            this.drawMeter();




            // Draw the labels
            this.drawLabels();








            //
            // Ajusting
            //
            if (properties.adjustable && !this.adjusting_event_listeners_installed) {
                
                this.adjusting_mousedown = false;
                
                var obj = this;

                var func = function (e)
                {
                    var div     = e.currentTarget,
                        mouseX  = e.offsetX,
                        mouseY  = e.offsetY;
                        
                        if (RGraph.SVG.ISFF) {
                            mouseX = e.pageX - e.currentTarget.offsetLeft;
                            mouseY = e.pageY - e.currentTarget.offsetTop;
                        }

                    var radius = RGraph.SVG.TRIG.getHypLength({
                        x1: mouseX,
                        y1: mouseY,
                        x2: obj.centerx,
                        y2: obj.centery,
                        object: obj
                    });

                    if (radius > obj.radius) {
                        return;
                    }

                    var value = obj.getValue(e);


                    obj.value        = value;
                    obj.currentValue = value;

                    RGraph.SVG.redraw(obj.svg);
                };




                this.container.addEventListener('mousedown', function (e)
                {
                    obj.adjusting_mousedown = true;
                    func(e);

                    // Fire the beforedraw event
                    RGraph.SVG.fireCustomEvent(obj, 'onadjustbegin');

                }, false);
                
                this.container.addEventListener('mousemove', function (e)
                {
                    if (obj.adjusting_mousedown) {
                        func(e);

                        // Fire the beforedraw event
                        RGraph.SVG.fireCustomEvent(obj, 'onadjust');
                    }
                }, false);
                
                window.addEventListener('mouseup', function (e)
                {
                    obj.adjusting_mousedown = false;
                        
                    // Fire the beforedraw event
                    RGraph.SVG.fireCustomEvent(obj, 'onadjustend');

                }, false);
                
                this.adjusting_event_listeners_installed = true;
            }








            //
            // Allow the addition of custom text via the
            // text: property.
            //
            RGraph.SVG.addCustomText(this);














            //
            // Fire the onfirstdraw event
            //
            if (this.firstDraw) {
                this.firstDraw = false;
                RGraph.SVG.fireCustomEvent(this, 'onfirstdraw');
            }




            // Fire the draw event
            RGraph.SVG.fireCustomEvent(this, 'ondraw');







            //
            // Install any inline responsive configuration. This
            // should be last in the draw function - even after
            // the draw events.
            //
            RGraph.SVG.installInlineResponsive(this);











            return this;
        };








        //
        // New create() shortcut function
        // For example:
        //    this.create('rect,x:0,y:0,width:100,height:100'[,parent]);
        //
        // @param str string The tag definition to parse and create
        // @param     object The (optional) parent element
        // @return    object The new tag
        //
        this.create = function (str)
        {
            var def = RGraph.SVG.create.parseStr(this, str);
            def.svg = this.svg;
            
            // By default the parent is the SVG tag - but if
            // requested then change it to the tag that has
            // been given
            if (arguments[1]) {
                def.parent = arguments[1];
            }

            return RGraph.SVG.create(def);
        };








        //
        // Draws the meter
        //
        this.drawMeter = function ()
        {
            var width = typeof properties.width === 'number' ? properties.width : this.radius / 2;
            
            // Allow for +/-xx style width
            if (typeof properties.width === 'string') {
                width += Number(properties.width);
            }
            
            
            // First thing to do is clear the canvas to the backgroundColor
            if (properties.backgroundColor) {
                var rect = RGraph.SVG.create({
                    svg: this.svg,
                    type: 'rect',
                    parent: this.svgAllGroup, 
                    attr: {
                        fill: properties.backgroundColor,
                        x: 0,
                        y: 0,
                        width: this.width,
                        height: this.height
                    }
                });
            }
        



    
            //
            // Draw the background circular bar (the light gray one)
            //
            var path = RGraph.SVG.TRIG.getArcPath3({
                cx:     this.centerx,
                cy:     this.centery,
                radius: this.radius,
                start:  0,
                end:    RGraph.SVG.TRIG.TWOPI,
                lineto: false
            });
    
            var path2 = RGraph.SVG.TRIG.getArcPath3({
                cx:     this.centerx,
                cy:     this.centery,
                radius: this.radius - properties.width,
                start:  RGraph.SVG.TRIG.TWOPI,
                end:    0,
                anticlockwise: true
            });
    

            RGraph.SVG.create({
                svg: this.svg,
                parent: this.svgAllGroup,
                type: 'path',
                attr: {
                    d: path + ' ' + path2 + ' z',
                    fill: properties.colors[1]
                }
            });
        
        
        
            //
            // Draw the indicator bar
            //
            var angle = ( (this.value - this.min) / (this.max - this.min) ) * RGraph.SVG.TRIG.TWOPI

            var path = RGraph.SVG.TRIG.getArcPath3({
                cx:     this.centerx,
                cy:     this.centery,
                radius: this.radius,
                start:  0,
                end:    angle,
                lineto: false
            });
    
            var path2 = RGraph.SVG.TRIG.getArcPath3({
                cx:     this.centerx,
                cy:     this.centery,
                radius: this.radius - properties.width,
                start:  angle,
                end:    0,
                anticlockwise: true
            });
    

            RGraph.SVG.create({
                svg: this.svg,
                parent: this.svgAllGroup,
                type: 'path',
                attr: {
                    d: path + ' ' + path2 + ' z',
                    fill: properties.colors[0]
                }
            });
            
            
            
            
            //
            // Draw the circles at each end of the bar
            //
            if (properties.ends) {            
                // Start of bar
                RGraph.SVG.create({
                    svg: this.svg,
                    parent: this.svgAllGroup,
                    type: 'circle',
                    attr: {
                        cx: this.centerx,
                        cy:this.centery - this.radius + (properties.width / 2),
                        r:  typeof properties.endsRadius === 'number' ? properties.endsRadius : properties.width * 1.5,
                        fill: (properties.endsColor || properties.colors[0]),
                        stroke: typeof properties.endsStroke === 'string' ? properties.endsStroke : (properties.backgroundColor || 'white'),
                        'stroke-width': 3
                    }
                });
                
                // End of bar
                var endpoint = RGraph.SVG.TRIG.getRadiusEndPoint({
                    angle:  angle - RGraph.SVG.TRIG.HALFPI,
                    radius: this.radius - (properties.width / 2)
                });
                
                // Get the endpoint for the end of the bar
                endpoint[0] += this.centerx;
                endpoint[1] += this.centery;            

                RGraph.SVG.create({
                    svg: this.svg,
                    parent: this.svgAllGroup,
                    type: 'circle',
                    attr: {
                            cx: endpoint[0],
                            cy: endpoint[1],
                             r:  typeof properties.endsRadius === 'number' ? properties.endsRadius : properties.width * 1.5,
                          fill: (properties.endsColor || properties.colors[0]),
                        stroke: typeof properties.endsStroke === 'string' ? properties.endsStroke : (properties.backgroundColor || 'white'),
                'stroke-width': 3
                    }
                });
            }
            
            
            
            // Store the new value as the currentValue
            this.currentValue = this.value;
        };








        //
        // Draw the labels
        //
        this.drawLabels = function ()
        {
             // Draw the center label
            if (properties.labelsCenter) {

                var label = RGraph.SVG.numberFormat({
                    object:    this,
                    num:       this.value.toFixed(properties.labelsCenterDecimals),
                    prepend:   properties.labelsCenterUnitsPre,
                    append:    properties.labelsCenterUnitsPost,
                    point:     properties.labelsCenterPoint,
                    thousand:  properties.labelsCenterThousand,
                    formatter: properties.labelsCenterFormatter
                });





                if (properties.labelsCenterSpecific) {
                    properties.labelsCenterSpecific = RGraph.SVG.labelSubstitution({
                        object:    this,
                        text:      properties.labelsCenterSpecific,
                        index:     0,
                        value:     this.value,
                        decimals:  properties.labelsCenterSpecificFormattedDecimals  || 0,
                        unitsPre:  properties.labelsCenterSpecificFormattedUnitsPre  || '',
                        unitsPost: properties.labelsCenterSpecificFormattedUnitsPost || '',
                        thousand:  properties.labelsCenterSpecificFormattedThousand  || ',',
                        point:     properties.labelsCenterSpecificFormattedPoint     || '.'
                    });
                }




                // Get the text configuration
                var textConf = RGraph.SVG.getTextConf({
                    object: this,
                    prefix: 'labelsCenter'
                });

                var text = RGraph.SVG.text({
                    object: this,
                    parent: this.svgAllGroup,
                    tag:    'labels.center',
                    
                    text:   typeof properties.labelsCenterSpecific === 'string' ? properties.labelsCenterSpecific : label,
                    
                    x:      this.centerx + properties.labelsCenterOffsetx,
                    y:      this.centery + properties.labelsCenterOffsety,
                    
                    valign: 'center',
                    halign: 'center',

                    font:   textConf.font,
                    size:   textConf.size,
                    bold:   textConf.bold,
                    italic: textConf.italic,
                    color:  textConf.color
                });

                // Store a reference to the center label
                this.nodes.labelsCenter = text;
            }
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (!Object.keys(this.originalColors).length) {
                this.originalColors = {
                    colors:          RGraph.SVG.arrayClone(properties.colors),
                    backgroundColor: RGraph.SVG.arrayClone(properties.backgroundColor)
                }
            }


            // colors
            var colors = properties.colors;

            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = RGraph.SVG.parseColorLinear({
                        object: this,
                         color: colors[i],
                         start: this.centerx - this.radius,
                           end: this.centerx + this.radius,
                           direction: 'horizontal'
                    });
                }
            }
            
            // Background color
            properties.backgroundColor = RGraph.SVG.parseColorLinear({
                object: this,
                color: properties.backgroundColor,
                start: properties.marginLeft,
                  end: this.width - properties.marginRight,
                  direction: 'horizontal'
            });
        };








        //
        // Using a function to add events makes it easier to facilitate method
        // chaining
        //
        // @param string   type The type of even to add
        // @param function func
        //
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }

            RGraph.SVG.addCustomEventListener(this, type, func);

            return this;
        };








        //
        // Used in chaining. Runs a function there and then - not waiting for
        // the events to fire (eg the onbeforedraw event)
        //
        // @param function func The function to execute
        //
        this.exec = function (func)
        {
            func(this);

            return this;
        };








        //
        // This function returns the pertinent angle for a particular click (or other mouse event)
        // 
        // @param obj e The event object
        //                      OR
        //        int e An integer value for
        //              which to the relevant
        //              angle
        //
        this.getAngle = function (e)
        {
            if (typeof e === 'number') {
                var angle = ((e - this.min) / (this.max - this.min)) * RGraph.SVG.TRIG.TWOPI;
                    angle -= RGraph.SVG.TRIG.HALFPI;

            } else {
                var mouseX = e.offsetX,
                    mouseY = e.offsetY;
    
                var angle = RGraph.SVG.TRIG.getAngleByXY({
                    cx: this.centerx,
                    cy: this.centery,
                    x:  mouseX,
                    y:  mouseY
                });
                
                angle -= RGraph.SVG.TRIG.HALFPI;
            }
    
            return angle;
        };








        //
        // This function returns the pertinent value for a particular click (or other mouse event)
        // 
        // @param obj e The event object
        //              
        //
        this.getValue = function (e)
        {
            // Treat the argument as an angle (given in radians)
            if (typeof e === 'number') {
                var angle = e;
                
            // Treat the argument as an event object
            } else {
                // Get the angle of the click
                var angle = this.getAngle(e);
            }

            // Calculate the value based on the angle and min/max values
            var value = (((angle + RGraph.SVG.TRIG.HALFPI) / RGraph.SVG.TRIG.TWOPI) * (this.max - this.min)) + this.min;

            // Ensure that the value is in range
            value = Math.max(value, this.min);
            value = Math.min(value, this.max);

            return value;
        };








        //
        // This function returns the pertinent radius (from the centerx/y) of a given event object
        // (eg from a click or mouse event).
        // 
        // @param obj e The event object
        //
        this.getRadius = function (e)
        {
            var x = e.offsetX,
                y = e.offsetY;

            var radius = RGraph.SVG.TRIG.getHypLength({
                x1: x,
                y1: y,
                x2: this.centerx,
                y2: this.centery
            });
            
            return radius;
        };








        //
        // Segmented donut Grow
        // 
        // This effect gradually increases the represented value
        // 
        // @param              An object of options - eg: {frames: 60}
        // @param function     An optional callback function
        //
        this.grow = function ()
        {
            var obj = this;

            this.currentValue = typeof this.currentValue === 'number' ? this.currentValue : this.min;

            // Limit value to the max and min values
            this.value = Math.min(this.value, this.max);
            this.value = Math.max(this.value, this.min);

            var opt      = arguments[0] || {},
                frames   = opt.frames || 60,
                frame    = 0,
                diff     = this.value - this.currentValue,
                step     = diff / frames,
                callback = arguments[1] || function () {},
                initial  = this.currentValue



            function iterator ()
            {
                obj.value = initial + (frame++ * step);
    
                RGraph.SVG.redraw(obj.svg);

                if (frame++ >= frames) {
                    this.currentValue = this.value;
                    callback(obj);
                } else {
                    RGraph.SVG.FX.update(iterator);
                }
            }
            
            iterator();
            
            return this;
        };








        //
        // This function handles clipping to scale values. Because
        // each chart handles scales differently, a worker function
        // is needed instead of it all being done centrally in the
        // RGraph.clipTo.start() function.
        //
        // @param string clip The clip string as supplied by the
        //                    user in the chart configuration
        //
        this.clipToScaleWorker = function (clipPath)
        {
            // The Regular expression is actually done by the
            // calling RGraph.clipTo.start() function  in the core
            // library
            if (RegExp.$1 === 'min') from = this.min; else from = Number(RegExp.$1);
            if (RegExp.$2 === 'max') to   = this.max; else to   = Number(RegExp.$2);

            var a1 = this.getAngle(from),
                a2 = this.getAngle(to);

            // Change the radius if the number is "min"
            if (RegExp.$1 === 'min') {
                a1 = this.getAngle(this.min);
            }

            // Change the radius if the number is "max"
            if (RegExp.$2 === 'max') {
                a2 = this.getAngle(this.max);
            }

    
            var path = RGraph.SVG.TRIG.getArcPath3({
                cx:     this.centerx,
                cy:     this.centery,
                radius: Math.max(this.width, this.height),
                start:  a1 + RGraph.SVG.TRIG.HALFPI,
                end:    a2 + RGraph.SVG.TRIG.HALFPI,
                anticlockwise: false
            });
    

            RGraph.SVG.create({
                svg: this.svg,
                parent: clipPath,
                type: 'path',
                attr: {
                    d: 'M {1} {2} {3} z'.format(
                        this.centerx,
                        this.centery,
                        path
                    )
                }
            });
            
            // Now set the clip-path attribute on the
            // all-elements group
            this.svgAllGroup.setAttribute(
                'clip-path',
                'url(#' + clipPath.id + ')'
            );
        };








        //
        // Set the options that the user has provided
        //
        for (i in conf.options) {
            if (typeof i === 'string') {
                this.set(i, conf.options[i]);
            }
        }
    
    
    
        return this;
    };








// End module pattern
})(window, document);