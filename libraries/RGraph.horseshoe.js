    // o--------------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:               |
    // |                                                                                |
    // |                         https://www.rgraph.net                                 |
    // |                                                                                |
    // | RGraph is licensed under the Open Source MIT license. That means that it's     |
    // | totally free to use and there are no restrictions on what you can do with it!  |
    // o--------------------------------------------------------------------------------o

    RGraph = window.RGraph || {isrgraph:true,isRGraph:true,rgraph:true};

    //
    // The bar chart constructor
    //
    RGraph.Horseshoe = function (conf)
    {
        var id                 = conf.id
        var canvas             = document.getElementById(id);
        var min                = conf.min;
        var max                = conf.max;
        var value              = conf.value;

        // id, min, max, value
        // Get the canvas and context objects
        this.id                = id;
        this.canvas            = canvas;
        this.context           = this.canvas.getContext ? this.canvas.getContext("2d", {alpha: (typeof id === 'object' && id.alpha === false) ? false : true}) : null;
        this.canvas.__object__ = this;
        this.type              = 'horseshoe';
        this.min               = RGraph.stringsToNumbers(min);
        this.max               = RGraph.stringsToNumbers(max);
        this.value             = RGraph.stringsToNumbers(value);
        this.centerx           = null;
        this.centery           = null;
        this.radius            = null;
        this.isRGraph          = true;
        this.isrgraph          = true;
        this.rgraph            = true;
        this.currentValue      = null;
        this.uid               = RGraph.createUID();
        this.canvas.uid        = this.canvas.uid ? this.canvas.uid : RGraph.createUID();
        this.colorsParsed      = false;
        this.coordsText        = [];
        this.original_colors   = [];
        this.firstDraw         = true; // After the first draw this will be false
        
        //
        // If the value is zero set it to very
        // slightly more than zero so the meter
        // is drawn correctly.
        //
        // Likewise with the maximum value
        //
        if (this.value <= 0.0000001) {
            this.value = 0.0000001;
        }
        


        // Various config type stuff
        this.properties =
        {
            radius:                             null,
            centerx:                            null,
            centery:                            null,
            width:                              10,

            marginLeft:                            15,
            marginRight:                           15,
            marginTop:                             15,
            marginBottom:                          15,

            backgroundColor:                       null,
            colors:                                ['black','#eee'],
            
            textFont:                              'Arial, Verdana, sans-serif',
            textSize:                              70,
            textColor:                             'black',
            textBold:                              false,
            textItalic:                            false,
            textAccessible:                        true,
            textAccessibleOverflow:                'visible',
            textAccessiblePointerevents:           false,
            text:                                  null,

            labelsCenter:                              true,
            labelsCenterFont:                          null,
            labelsCenterSize:                          null,
            labelsCenterColor:                         null,
            labelsCenterBold:                          null,
            labelsCenterItalic:                        null,
            labelsCenterUnitsPre:                      '',
            labelsCenterUnitsPost:                     '',
            labelsCenterDecimals:                      0,
            labelsCenterPoint:                         '.',
            labelsCenterThousand:                      ',',
            labelsCenterSpecific:                      '',
            labelsCenterSpecificFormattedDecimals:     0,
            labelsCenterSpecificFormattedPoint:        '.',
            labelsCenterSpecificFormattedThousand:     ',',
            labelsCenterSpecificFormattedUnitsPre:     '',
            labelsCenterSpecificFormattedUnitsPost:    '',
            labelsCenterOffsetx:                       0,
            labelsCenterOffsety:                       0,
            
            endsRadius:                         null,
            endsColor:                          null,

            contextmenu:                        null,

            annotatable:                           false,
            annotatableColor:                      'black',

            adjustable:                           false,

            clearto:                               'rgba(0,0,0,0)'
        }


        // Check for support
        if (!this.canvas) {
            alert('[HORSESHOE] No canvas support');
            return;
        }




        // Easy access to  properties and the path function
        var properties = this.properties;
        this.path      = RGraph.pathObjectFunction;
        
        
        
        //
        // "Decorate" the object with the generic effects if the effects library has been included
        //
        if (RGraph.Effects && typeof RGraph.Effects.decorate === 'function') {
            RGraph.Effects.decorate(this);
        }
        
        
        
        // Add the responsive method. This method resides in the common file.
        this.responsive = RGraph.responsive;


        //
        // A setter
        //
        this.set = function (name)
        {
            var value = typeof arguments[1] === 'undefined' ? null : arguments[1];

            // the number of arguments is only one and it's an
            // object - parse it for configuration data and return.
            if (arguments.length === 1 && typeof arguments[0] === 'object') {
                for (i in arguments[0]) {
                    if (typeof i === 'string') {
                        this.set(i, arguments[0][i]);
                    }
                }

                return this;
            }

            properties[name] = value;

            return this;
        };








        //
        // A getter
        // 
        // @param name  string The name of the property to get
        //
        this.get = function (name)
        {
            return properties[name];
        };








        //
        // The function you call to draw the bar chart
        //
        this.draw = function ()
        {
            //
            // Fire the onbeforedraw event
            //
            RGraph.fireCustomEvent(this, 'onbeforedraw');



            // Translate half a pixel for antialiasing purposes - but only if it hasn't been
            // done already
            //
            // MUST be the first thing done!
            //
            if (!this.canvas.__rgraph_aa_translated__) {
                this.context.translate(0.5,0.5);
            
                this.canvas.__rgraph_aa_translated__ = true;
            }


            //
            // Constrain the value to be within the min and max
            //
            if (this.value > this.max) this.value = this.max;
            if (this.value < this.min) this.value = this.min;
    
            //
            // Set the current value
            //
            this.currentValue = this.value;



            //
            // Make the margins easy to access
            //
            this.marginLeft   = properties.marginLeft;
            this.marginRight  = properties.marginRight;
            this.marginTop    = properties.marginTop;
            this.marginBottom = properties.marginBottom;
            
            this.centerx = ((this.canvas.width - this.marginLeft - this.marginRight) / 2) + this.marginLeft;
            this.centery = ((this.canvas.height - this.marginBottom - this.marginTop) / 2) + this.marginTop;
            this.radius  = Math.min(
                (this.canvas.width - this.marginLeft - this.marginRight) / 2,
                (this.canvas.height - this.marginTop - this.marginBottom) / 2
            );
                
            //
            // Stop this growing uncontrollably
            //
            this.coordsText = [];
    
    
    
            //
            // Custom centerx, centery and radius
            //
            if (typeof properties.centerx === 'number') this.centerx = properties.centerx;
            if (typeof properties.centery === 'number') this.centery = properties.centery;
            if (typeof properties.radius  === 'number') this.radius  = properties.radius;
    
    
            //
            // Parse the colors for gradients. Its down here so that the center X/Y can be used
            //
            if (!this.colorsParsed) {
    
                this.parseColors();
    
                // Don't want to do this again
                this.colorsParsed = true;
            }
    

            //
            // Draw the meter and its labels
            //
            this.drawMeter();
            this.drawLabels();

            //
            // Setup the context menu if required
            //
            if (properties.contextmenu) {
                RGraph.showContext(this);
            }




            //
            // Add custom text thats specified
            //
            RGraph.addCustomText(this);




    
    


            //
            // This installs the event listeners
            //
            RGraph.installEventListeners(this);



            //
            // Fire the onfirstdraw event
            //
            if (this.firstDraw) {
                this.firstDraw = false;
                RGraph.fireCustomEvent(this, 'onfirstdraw');
                this.firstDrawFunc();
            }




            //
            // Fire the RGraph draw event
            //
            RGraph.fireCustomEvent(this, 'ondraw');



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
        // Draws the meter
        //
        this.drawMeter = function ()
        {
            var angle = this.getAngle(this.currentValue);





            // First thing to do is clear the canvas to the backgroundColor
            if (properties.backgroundColor) {
                this.path(
                    'fs % fr -5 -5 % %',
                    properties.backgroundColor,
                    this.canvas.width + 10,
                    this.canvas.height + 10
                );
            }




            // Draw the gray background circle
            this.path(
                'b a % % % 0 6.29 false a % % % 6.29 0 true f %',
                
                this.centerx,
                this.centery,
                this.radius,
                
                this.centerx,
                this.centery,
                this.radius - properties.width,
                
                properties.colors[1]
            );




            // Draw the black indicator line
            this.path(
                
                'b a % % % % % false a % % % % % true f %',
                
                this.centerx,
                this.centery,
                this.radius,
                RGraph.TWOPI - RGraph.HALFPI,
                angle,

                this.centerx,
                this.centery,
                this.radius - properties.width,
                angle,
                RGraph.TWOPI - RGraph.HALFPI,
                
                properties.colors[0]
            );




            // Draw the bulb at the START of the indicator line
            this.path(
                'b lw 3 a % % % 0 % false f % s white',
                this.centerx,
                this.centery - this.radius + (properties.width / 2),
                typeof properties.endsRadius === 'number' ? properties.endsRadius : (properties.width * 1.5),
                RGraph.TWOPI,
                typeof properties.endsColor === 'string' ? properties.endsColor : properties.colors[0]
            );




            // Draw the bulb at the END of the indicator line
            // (get the coordsinates to draw it at first).
            var coords = RGraph.getRadiusEndPoint(
                this.centerx,
                this.centery,
                angle,
                this.radius - (properties.width / 2)
            );




            this.path(
                'b lw 3 a % % % 0 % false f % s white',
                coords[0],
                coords[1],
                typeof properties.endsRadius === 'number' ? properties.endsRadius : (properties.width * 1.5),
                RGraph.TWOPI,
                typeof properties.endsColor === 'string' ? properties.endsColor : properties.colors[0]
            );


            // Reset the linewidth back to 1
            this.context.lineWidth = 1;
        };








        //
        // This function draws the text labels
        //
        this.drawLabels = function ()
        {
            if (!properties.labelsCenter) {
                return;
            }


            if (properties.labelsCenterSpecific) {
                properties.labelsCenterSpecific = RGraph.labelSubstitution({
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
            var textConf = RGraph.getTextConf({
                object: this,
                prefix: 'labelsCenter'
            });

            // Draw the large center label
            RGraph.text({

             object: this,

                font:   textConf.font,
                italic: textConf.italic,
                bold:   textConf.bold,
                size:   textConf.size,
                color:  textConf.color,

                  x: this.centerx + properties.labelsCenterOffsetx,
                  y: this.centery + properties.labelsCenterOffsety,

               text: properties.labelsCenterSpecific ? properties.labelsCenterSpecific : RGraph.numberFormat({
                   object:    this,
                   number:    this.value.toFixed(properties.labelsCenterDecimals),
                   unitspre:  properties.labelsCenterUnitsPre,
                   unitspost: properties.labelsCenterUnitsPost,
                   point:     properties.labelsCenterPoint,
                   thousand:  properties.labelsCenterThousand
               }),

             halign: 'center',
             valign: 'center',

         accessible: properties.textAccessible
            });
        };








        //
        // A placeholder function
        // 
        // @param object The event object
        //
        this.getShape = function (e) {};








        //
        // This function returns the pertinent value for a particular click (or other mouse event)
        // 
        // @param obj e The event object
        //
        this.getValue = function (e)
        {
            if (typeof e === 'number') {
                var angle = e;
                    angle += RGraph.HALFPI;
            } else {
                var mouseXY = RGraph.getMouseXY(e);
                
                var angle   = RGraph.getAngleByXY(
                    this.centerx,
                    this.centery,
                    mouseXY[0],
                    mouseXY[1]
                );
            
                // Adjust the angle because canvas angles
                // start at the east axis
                angle += RGraph.HALFPI;
                if (angle > RGraph.TWOPI) {
                    angle -= RGraph.TWOPI;
                }
            }

            // Calculate the value based on the angle and min/max values
            var value = ((angle / RGraph.TWOPI) * (this.max - this.min)) + this.min;

            // Ensure that the value is in range
            value = Math.max(value, this.min);
            value = Math.min(value, this.max);

            return value;
        };








        //
        // The getObjectByXY() worker method. Don't call this call:
        // 
        // RGraph.ObjectRegistry.getObjectByXY(e)
        // 
        // @param object e The event object
        //
        this.getObjectByXY = function (e)
        {
            var mouseXY = RGraph.getMouseXY(e);
    
            // Work out the radius
            var radius = RGraph.getHypLength(
                this.centerx,
                this.centery,
                mouseXY[0],
                mouseXY[1]
            );
            
            if (radius > this.radius) {
                return null;
            }
            
            return this;
        };








        //
        // This method handles the adjusting calculation for when the mouse is moved
        // 
        // @param object e The event object
        //
        this.adjusting_mousemove = function (e)
        {
            //
            // Handle adjusting for the Bar
            //
            if (properties.adjustable && RGraph.Registry.get('adjusting') && RGraph.Registry.get('adjusting').uid == this.uid) {
                this.value = this.getValue(e);
                RGraph.clear(this.canvas);
                RGraph.redrawCanvas(this.canvas);
                RGraph.fireCustomEvent(this, 'onadjust');
            }
        };








        //
        // This method returns the appropriate angle for a value
        // 
        // @param number value The value
        //                   OR
        //        object value An event object
        //
        this.getAngle = function (value)
        {
            if (typeof value === 'number') {
                
                // Higher than max
                if (value > this.max || value < this.min) {
                    return null;
                }
    
                var angle = (((value - this.min) / (this.max - this.min)) * RGraph.TWOPI) - RGraph.HALFPI;
            
            // An event object has been given
            } else {
                var mouseX = value.offsetX,
                    mouseY = value.offsetY;
    
                var angle = RGraph.getAngleByXY({
                    cx: this.centerx,
                    cy: this.centery,
                    x:  mouseX,
                    y:  mouseY
                });
            }

            if (value === this.max) angle -= 0.00001;
            if (value === this.min) angle += 0.00001;
            
            if (angle > (RGraph.PI + RGraph.HALFPI) ) {
                angle -= RGraph.TWOPI;
            }
            
            return angle;
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function ()
        {
            // Save the original colors so that they can be restored when the canvas is reset
            if (this.original_colors.length === 0) {
                this.original_colors.backgroundColor  = RGraph.arrayClone(properties.backgroundColor);
                this.original_colors.colors           = RGraph.arrayClone(properties.colors);
            }

            // Parse the background color
            properties.backgroundColor = this.parseSingleColorForGradient(properties.backgroundColor);

    
            // Parse colors
            var colors = properties.colors;

            if (colors && colors.length) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = this.parseSingleColorForGradient(colors[i]);
                }
            }
        };








        //
        // Use this function to reset the object to the post-constructor state. Eg reset colors if
        // need be etc
        //
        this.reset = function ()
        {
        };








        //
        // This parses a single color value
        //
        this.parseSingleColorForGradient = function (color)
        {
            if (!color || typeof color != 'string') {
                return color;
            }

            if (color.match(/^gradient\((.*)\)$/i)) {

                // Allow for JSON gradients
                if (color.match(/^gradient\(({.*})\)$/i)) {
                    return RGraph.parseJSONGradient({
                        object: this,
                        def:    RegExp.$1,
                        radial: true
                    });
                }

                var parts = RegExp.$1.split(':');
                
                // Create the gradient
                var grad = this.context.createLinearGradient(
                    properties.marginLeft,
                    0,
                    this.canvas.width - properties.marginLeft - properties.marginRight,
                    0
                );
                
                var diff = 1 / (parts.length - 1);
                
                grad.addColorStop(0, RGraph.trim(parts[0]));
                
                for (var j=1,len=parts.length; j<len; ++j) {
                    grad.addColorStop(j * diff, RGraph.trim(parts[j]));
                }
            }
    
            return grad ? grad : color;
        };








        //
        // Using a function to add events makes it easier to facilitate method chaining
        // 
        // @param string   type The type of even to add
        // @param function func 
        //
        this.on = function (type, func)
        {
            if (type.substr(0,2) !== 'on') {
                type = 'on' + type;
            }
            
            if (typeof this[type] !== 'function') {
                this[type] = func;
            } else {
                RGraph.addCustomEventListener(this, type, func);
            }

            return this;
        };








        //
        // This function runs once only
        // (put at the end of the file (before any effects))
        //
        this.firstDrawFunc = function ()
        {
        };








        //
        // Meter Grow
        // 
        // This effect gradually increases the represented value
        // 
        // @param              An object of options - eg: {frames: 60}
        // @param function     An optional callback function
        //
        this.grow = function ()
        {
            var obj = this;

            obj.currentValue = obj.currentValue || obj.min;

            var opt      = arguments[0] || {},
                frames   = opt.frames || 30,
                frame    = 0,
                diff     = obj.value - obj.currentValue,
                step     = diff / frames,
                callback = arguments[1] || function () {},
                initial  = obj.currentValue



            function iterator ()
            {
                obj.value = initial + (frame++ * step);
    
                RGraph.clear(obj.canvas);
                RGraph.redrawCanvas(obj.canvas);
            
                if (frame <= frames) {
                    RGraph.Effects.updateCanvas(iterator);
                } else {
                    callback(obj);
                }
            }
            
            iterator();
            
            return this;
        };








        //
        // Register the object
        //
        RGraph.register(this);








        //
        // This is the 'end' of the constructor so if the first argument
        // contains configuration data - handle that.
        //
        RGraph.parseObjectStyleConfig(this, conf.options);
    };