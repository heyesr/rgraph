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
    
    if (typeof(RGraph) == 'undefined') RGraph = {};

    /**
    * The pie chart constructor
    * 
    * @param data array The data to be represented on the pie chart
    */
    RGraph.Pie = function (id, data)
    {
        this.id                = id;
        this.canvas            = document.getElementById(id);
        this.context           = this.canvas.getContext("2d");
        this.canvas.__object__ = this;
        this.total             = 0;
        this.subTotal          = 0;
        this.angles            = [];
        this.data              = data;
        this.properties        = [];
        this.type              = 'pie';
        this.isRGraph          = true;


        /**
        * Compatibility with older browsers
        */
        RGraph.OldBrowserCompat(this.context);

        this.properties = {
            'chart.colors':                 ['red', '#ddd', '#0f0', 'blue', 'pink', 'yellow', 'black', 'cyan'],
            'chart.strokestyle':            '#999',
            'chart.linewidth':              1,
            'chart.labels':                 [],
            'chart.labels.sticks':          false,
            'chart.labels.sticks.length':   7,
            'chart.labels.sticks.color':    '#aaa',
            'chart.labels.center':          null,
            'chart.labels.center.bold':     true,
            'chart.labels.center.font':     'Arial',
            'chart.labels.center.size':     14,
            'chart.segments':               [],
            'chart.gutter.left':            25,
            'chart.gutter.right':           25,
            'chart.gutter.top':             25,
            'chart.gutter.bottom':          25,
            'chart.title':                  '',
            'chart.title.background':       null,
            'chart.title.hpos':             null,
            'chart.title.vpos':             0.5,
            'chart.title.bold':             true,
            'chart.title.font':             null,
            'chart.shadow':                 false,
            'chart.shadow.color':           'rgba(0,0,0,0.5)',
            'chart.shadow.offsetx':         3,
            'chart.shadow.offsety':         3,
            'chart.shadow.blur':            3,
            'chart.text.size':              10,
            'chart.text.color':             'black',
            'chart.text.font':              'Arial',
            'chart.contextmenu':            null,
            'chart.tooltips':               [],
            'chart.tooltips.event':         'onclick',
            'chart.tooltips.effect':        'fade',
            'chart.tooltips.css.class':     'RGraph_tooltip',
            'chart.tooltips.highlight':     true,
            'chart.highlight.style':        'explode',
            'chart.highlight.style.2d.fill': 'rgba(255,255,255,0.5)',
            'chart.highlight.style.2d.stroke': 'rgba(255,255,255,0)',
            'chart.centerx':                null,
            'chart.centery':                null,
            'chart.radius':                 null,
            'chart.border':                 false,
            'chart.border.color':           'rgba(255,255,255,0.5)',
            'chart.key':                    null,
            'chart.key.background':         'white',
            'chart.key.position':           'graph',
            'chart.key.halign':             'right',
            'chart.key.shadow':             false,
            'chart.key.shadow.color':       '#666',
            'chart.key.shadow.blur':        3,
            'chart.key.shadow.offsetx':     2,
            'chart.key.shadow.offsety':     2,
            'chart.key.position.gutter.boxed': true,
            'chart.key.position.x':         null,
            'chart.key.position.y':         null,
            'chart.key.color.shape':        'square',
            'chart.key.rounded':            true,
            'chart.key.linewidth':          1,
            'chart.key.colors':             null,
            'chart.annotatable':            false,
            'chart.annotate.color':         'black',
            'chart.align':                  'center',
            'chart.zoom.factor':            1.5,
            'chart.zoom.fade.in':           true,
            'chart.zoom.fade.out':          true,
            'chart.zoom.hdir':              'right',
            'chart.zoom.vdir':              'down',
            'chart.zoom.frames':            25,
            'chart.zoom.delay':             16.666,
            'chart.zoom.shadow':            true,
            'chart.zoom.mode':              'canvas',
            'chart.zoom.thumbnail.width':   75,
            'chart.zoom.thumbnail.height':  75,
            'chart.zoom.thumbnail.fixed':   false,
            'chart.zoom.background':        true,
            'chart.zoom.action':            'zoom',
            'chart.resizable':              false,
            'chart.resize.handle.adjust':   [0,0],
            'chart.resize.handle.background': null,
            'chart.variant':                'pie',
            'chart.variant.donut.color':    'white',
            'chart.exploded':               [],
            'chart.effect.roundrobin.multiplier': 1,
            'chart.events.click':             null,
            'chart.events.mousemove':         null
        }

        /**
        * Calculate the total
        */
        for (var i=0,len=data.length; i<len; i++) {
            this.total += data[i];
        }


        /**
        * Set the .getShape commonly named method
        */
        this.getShape = this.getSegment;
    }


    /**
    * A generic setter
    */
    RGraph.Pie.prototype.Set = function (name, value)
    {
        if (name == 'chart.highlight.style.2d.color') {
            name = 'chart.highlight.style.2d.fill';
        }

        this.properties[name] = value;
    }


    /**
    * A generic getter
    */
    RGraph.Pie.prototype.Get = function (name)
    {
        if (name == 'chart.highlight.style.2d.color') {
            name = 'chart.highlight.style.2d.fill';
        }

        return this.properties[name];
    }


    /**
    * This draws the pie chart
    */
    RGraph.Pie.prototype.Draw = function ()
    {
        /**
        * Fire the onbeforedraw event
        */
        RGraph.FireCustomEvent(this, 'onbeforedraw');


        /**
        * This is new in May 2011 and facilitates indiviual gutter settings,
        * eg chart.gutter.left
        */
        this.gutterLeft   = this.Get('chart.gutter.left');
        this.gutterRight  = this.Get('chart.gutter.right');
        this.gutterTop    = this.Get('chart.gutter.top');
        this.gutterBottom = this.Get('chart.gutter.bottom');

        /**
        * Clear all of this canvases event handlers (the ones installed by RGraph)
        */
        RGraph.ClearEventListeners(this.id);


        this.radius           = this.Get('chart.radius') ? this.Get('chart.radius') : this.getRadius();
        // this.centerx now defined below
        this.centery          = ((this.canvas.height - this.gutterTop - this.gutterBottom) / 2) + this.gutterTop;
        this.subTotal         = 0;
        this.angles           = [];

        /**
        * Allow the specification of a custom centery
        */
        if (typeof(this.Get('chart.centery')) == 'number') {
            this.centery = this.Get('chart.centery');
        }
        
        /**
        * Alignment (Pie is center aligned by default) Only if centerx is not defined - donut defines the centerx
        */
        if (this.Get('chart.align') == 'left') {
            this.centerx = this.radius + this.gutterLeft;
        
        } else if (this.Get('chart.align') == 'right') {
            this.centerx = this.canvas.width - this.radius - this.gutterRight;
        
        } else {
            this.centerx = this.canvas.width / 2;
        }
        
        /**
        * Allow the specification of a custom centerx
        */
        if (typeof(this.Get('chart.centerx')) == 'number') {
            this.centerx = this.Get('chart.centerx');
        }

        /**
        * Draw the title
        */

        RGraph.DrawTitle(this.canvas,
                         this.Get('chart.title'),
                         (this.canvas.height / 2) - this.radius - 5,
                         this.centerx,
                         this.Get('chart.title.size') ? this.Get('chart.title.size') : this.Get('chart.text.size') + 2);

        /**
        * Draw the shadow if required
        */
        if (this.Get('chart.shadow') && 0) {
        
            var offsetx = document.all ? this.Get('chart.shadow.offsetx') : 0;
            var offsety = document.all ? this.Get('chart.shadow.offsety') : 0;

            this.context.beginPath();
            this.context.fillStyle = this.Get('chart.shadow.color');

            this.context.shadowColor   = this.Get('chart.shadow.color');
            this.context.shadowBlur    = this.Get('chart.shadow.blur');
            this.context.shadowOffsetX = this.Get('chart.shadow.offsetx');
            this.context.shadowOffsetY = this.Get('chart.shadow.offsety');
            
            this.context.arc(this.centerx + offsetx, this.centery + offsety, this.radius, 0, 6.28, 0);
            
            this.context.fill();
            
            // Now turn off the shadow
            RGraph.NoShadow(this);
        }

        /**
        * The total of the array of values
        */
        this.total = RGraph.array_sum(this.data);

        for (var i=0,len=this.data.length; i<len; i++) {
            
            var angle = ((this.data[i] / this.total) * (Math.PI * 2));

            // Draw the segment
            this.DrawSegment(angle,this.Get('chart.colors')[i],i == (this.data.length - 1), i);
        }

        RGraph.NoShadow(this);


        /**
        * Redraw the seperating lines
        */
        this.DrawBorders();

        /**
        * Now draw the segments again with shadow turned off. This is always performed,
        * not just if the shadow is on.
        */

        for (var i=0; i<this.angles.length; i++) {
    
            this.context.beginPath();
                this.context.strokeStyle = this.Get('chart.strokestyle');
                this.context.fillStyle = this.Get('chart.colors')[i];
                this.context.arc(this.angles[i][2],
                                 this.angles[i][3],
                                 this.radius,
                                 (this.angles[i][0]),
                                 (this.angles[i][1]),
                                 false);
                if (this.Get('chart.variant') == 'donut') {

                    this.context.arc(this.angles[i][2],
                                     this.angles[i][3],
                                     this.radius / 2,
                                     (this.angles[i][1]),
                                     (this.angles[i][0]),
                                     true);
                    
                } else {
                    this.context.lineTo(this.angles[i][2], this.angles[i][3]);
                }
            this.context.closePath();
            this.context.fill();
            this.context.stroke();
        }


        /**
        * Draw label sticks
        */
        if (this.Get('chart.labels.sticks')) {
            
            this.DrawSticks();
            
            // Redraw the border going around the Pie chart if the stroke style is NOT white
            var strokeStyle = this.Get('chart.strokestyle');
            var isWhite     = strokeStyle == 'white' || strokeStyle == '#fff' || strokeStyle == '#fffffff' || strokeStyle == 'rgb(255,255,255)' || strokeStyle == 'rgba(255,255,255,0)';

            if (!isWhite || (isWhite && this.Get('chart.shadow'))) {
               // Again (?)
              this.DrawBorders();
           }
        }

        /**
        * Draw the labels
        */
        this.DrawLabels();
        
        
        /**
        * Setup the context menu if required
        */
        if (this.Get('chart.contextmenu')) {
            RGraph.ShowContext(this);
        }

        /**
        * Install the clickand mousemove event listeners
        */
        RGraph.InstallUserClickListener(this, this.Get('chart.events.click'));
        RGraph.InstallUserMousemoveListener(this, this.Get('chart.events.mousemove'));

        /**
        * Tooltips
        */
        if (this.Get('chart.tooltips').length) {

            /**
            * Register this object for redrawing
            */
            RGraph.Register(this);
            
            RGraph.PreLoadTooltipImages(this);
        
            /**
            * The onclick event
            */
            //this.canvas.onclick = function (e)
            var canvas_onclick_func = function (e)
            {
                RGraph.HideZoomedCanvas();

                e = RGraph.FixEventObject(e);

                var mouseCoords = RGraph.getMouseXY(e);

                var canvas  = e.target;
                var context = canvas.getContext('2d');
                var obj     = e.target.__object__;



                /**
                * If it's actually a donut make sure the hyp is bigger
                * than the size of the hole in the middle
                */
                if (obj.Get('chart.variant') == 'donut' && Math.abs(hyp) < (obj.radius / 2)) {
                    return;
                }

                /**
                * The angles for each segment are stored in "angles",
                * so go through that checking if the mouse position corresponds
                */
                var isDonut = obj.Get('chart.variant') == 'donut';
                var hStyle  = obj.Get('chart.highlight.style');
                var segment = obj.getSegment(e);


                if (segment) {

                    var x     = mouseCoords[0] - segment[0];
                    var y     = mouseCoords[1] - segment[1];
                    var theta = Math.atan(y / x); // RADIANS
                    var hyp   = y / Math.sin(theta);


                    if (   RGraph.Registry.Get('chart.tooltip')
                        && segment[5] == RGraph.Registry.Get('chart.tooltip').__index__
                        && RGraph.Registry.Get('chart.tooltip').__canvas__.__object__.id == obj.id) {

                        return;

                    } else {
                        RGraph.Redraw();
                    }

                    /**
                    * If a tooltip is defined, show it
                    */
    
                    /**
                    * Get the tooltip text
                    */
                    var text = RGraph.parseTooltipText(obj.Get('chart.tooltips'), segment[5]);
    
                    if (text) {
                        RGraph.Tooltip(canvas, text, e.pageX, e.pageY, segment[5]);
                    }


                    /**
                    * Do the highlighting
                    */
                    if (text) {
                        if (hStyle == '2d') {
                            
                            obj.highlight_segment(segment);
    
                        } else if (hStyle == 'explode') {
    
                            
                           obj.Explode(segment[5], 25);
    
                            setTimeout(function () {obj.Set('chart.exploded', []);}, document.all ? 1000 : 500);
                            
                            e.stopPropagation();
                            e.cancelBubble = true;
                            //return false;
    
                        } else {
    
                            context.lineWidth = 2;
    
                            /**
                            * Draw a white segment where the one that has been clicked on was
                            */
                            context.fillStyle = 'white';
                            context.strokeStyle = 'white';
                            context.beginPath();
                                //context.moveTo(segment[0], segment[1]);
                                context.arc(segment[0], segment[1], segment[2], obj.angles[segment[5]][0], obj.angles[segment[5]][1], false);
                                obj.Get('chart.variant') == 'donut' ? context.arc(segment[0], segment[1], segment[2] / 2, obj.angles[segment[5]][1], obj.angles[segment[5]][0], true) : context.lineTo(segment[0], segment[1]);
                            context.stroke();
                            context.fill();
    
                            context.lineWidth = 1;
    
                            context.shadowColor   = '#666';
                            context.shadowBlur    = 3;
                            context.shadowOffsetX = 3;
                            context.shadowOffsetY = 3;
    
                            // Draw the new segment
                            context.beginPath();
                                context.fillStyle   = obj.Get('chart.colors')[segment[5]];
                                context.strokeStyle = obj.Get('chart.strokestyle');
                                context.arc(segment[0] - 3, segment[1] - 3, segment[2], obj.angles[segment[5]][0], obj.angles[segment[5]][1], false);
                                obj.Get('chart.variant') == 'donut' ? context.arc(segment[0] - 3, segment[1] - 3, segment[2] / 2, obj.angles[segment[5]][1], obj.angles[segment[5]][0], true) : context.lineTo(segment[0], segment[1]);
                            context.closePath();
                            
                            context.stroke();
                            context.fill();
                            
                            // Turn off the shadow
                            RGraph.NoShadow(obj);
                            
                            /**
                            * If a border is defined, redraw that
                            */
                            if (obj.Get('chart.border')) {
                                context.beginPath();
                                context.strokeStyle = obj.Get('chart.border.color');
                                context.lineWidth = 5;
                                context.arc(segment[0] - 3, segment[1] - 3, obj.radius - 2, obj.angles[i][0], obj.angles[i][1], 0);
                                context.stroke();
                            }
                        }
                    }


                    /**
                    * Need to redraw the key?
                    */
                    if (obj.Get('chart.key') && obj.Get('chart.key').length && obj.Get('chart.key.position') == 'graph') {
                        RGraph.DrawKey(obj, obj.Get('chart.key'), obj.Get('chart.colors'));
                    }

                    e.stopPropagation();

                    return;
                } else if (obj.Get('chart.tooltips.event') == 'onclick') {
                    RGraph.Redraw();
                }
            }
            var event_name = this.Get('chart.tooltips.event') == 'onmousemove' ? 'mousemove' : 'click';

            this.canvas.addEventListener(event_name, canvas_onclick_func, false);
            RGraph.AddEventListener(this.id, event_name, canvas_onclick_func);






            /**
            * The onmousemove event for changing the cursor
            */
            //this.canvas.onmousemove = function (e)
            var canvas_onmousemove_func = function (e)
            {
                RGraph.HideZoomedCanvas();

                e = RGraph.FixEventObject(e);
                
                var obj     = e.target.__object__;
                var segment = obj.getSegment(e);

                if (segment) {
                    var text = RGraph.parseTooltipText(obj.Get('chart.tooltips'), segment[5]);
                    
                    if (text) {
                        e.target.style.cursor = 'pointer';
                        return;
                    }
                }

                /**
                * Put the cursor back to null
                */
                e.target.style.cursor = 'default';
            }
            this.canvas.addEventListener('mousemove', canvas_onmousemove_func, false);
            RGraph.AddEventListener(this.id, 'mousemove', canvas_onmousemove_func);









            /**
            * The window onclick function
            */
            var window_onclick_func = function (e)
            {
                // Taken out on 02/10/11
                //RGraph.HideZoomedCanvas();

                e = RGraph.FixEventObject(e);

                RGraph.Redraw();

                /**
                * Put the cursor back to null
                */
                //e.target.style.cursor = 'default';
            }
            window.addEventListener('click', window_onclick_func, false);
            RGraph.AddEventListener('window_' + this.id, 'click', window_onclick_func);
        }


        /**
        * If a border is pecified, draw it
        */
        if (this.Get('chart.border')) {
            this.context.beginPath();
            this.context.lineWidth = 5;
            this.context.strokeStyle = this.Get('chart.border.color');

            this.context.arc(this.centerx,
                             this.centery,
                             this.radius - 2,
                             0,
                             6.28,
                             0);

            this.context.stroke();
        }
        
        /**
        * Draw the kay if desired
        */
        if (this.Get('chart.key') != null) {
            //this.Set('chart.key.position', 'graph');
            RGraph.DrawKey(this, this.Get('chart.key'), this.Get('chart.colors'));
        }

        RGraph.NoShadow(this);
        
        /**
        * Draw the center label if it's specified
        */
        this.DrawCenterLabel();
        
        /**
        * If the canvas is annotatable, do install the event handlers
        */
        if (this.Get('chart.annotatable')) {
            RGraph.Annotate(this);
        }
        
        /**
        * This bit shows the mini zoom window if requested
        */
        if (this.Get('chart.zoom.mode') == 'thumbnail' || this.Get('chart.zoom.mode') == 'area') {
            RGraph.ShowZoomWindow(this);
        }

        
        /**
        * This function enables resizing
        */
        if (this.Get('chart.resizable')) {
            RGraph.AllowResizing(this);
        }


        /**
        * Fire the RGraph ondraw event
        */
        RGraph.FireCustomEvent(this, 'ondraw');
    }


    /**
    * Draws a single segment of the pie chart
    * 
    * @param int degrees The number of degrees for this segment
    */
    RGraph.Pie.prototype.DrawSegment = function (radians, color, last, index)
    {
        var context  = this.context;
        var canvas   = this.canvas;
        var subTotal = this.subTotal;
            radians  = radians * this.Get('chart.effect.roundrobin.multiplier');

        context.beginPath();

            context.fillStyle   = color;
            context.strokeStyle = this.Get('chart.strokestyle');
            context.lineWidth   = 0;
            
            if (this.Get('chart.shadow')) {
                RGraph.SetShadow(this, this.Get('chart.shadow.color'),this.Get('chart.shadow.offsetx'), this.Get('chart.shadow.offsety'), this.Get('chart.shadow.blur'));
            }

            /**
            * Exploded segments
            */
            if ( (typeof(this.Get('chart.exploded')) == 'object' && this.Get('chart.exploded')[index] > 0) || typeof(this.Get('chart.exploded')) == 'number') {
                var explosion = typeof(this.Get('chart.exploded')) == 'number' ? this.Get('chart.exploded') : this.Get('chart.exploded')[index];
                var x         = 0;
                var y         = 0;
                var h         = explosion;
                var t         = (subTotal + (radians / 2)) - 1.57;
                var x         = (Math.cos(t) * explosion);
                var y         = (Math.sin(t) * explosion);
            
                this.context.moveTo(this.centerx + x, this.centery + y);
            } else {
                var x = 0;
                var y = 0;
            }
            
            /**
            * Calculate the angles
            */
            var startAngle = (subTotal) - 1.57;
            var endAngle   = (((subTotal + radians))) - 1.57;

            context.arc(this.centerx + x,
                        this.centery + y,
                        this.radius,
                        startAngle,
                        endAngle,
                        0);

            if (this.Get('chart.variant') == 'donut') {
    
                context.arc(this.centerx + x,
                            this.centery + y,
                            (this.radius / 2),
                            endAngle,
                            startAngle,
                            true);
            } else {
                context.lineTo(this.centerx + x, this.centery + y);
            }

        this.context.closePath();


        // Keep hold of the angles
        this.angles.push([subTotal - (Math.PI / 2), subTotal + radians - (Math.PI / 2), this.centerx + x, this.centery + y]);


        
        //this.context.stroke();
        this.context.fill();

        /**
        * Calculate the segment angle
        */
        this.Get('chart.segments').push([subTotal, subTotal + radians]);
        this.subTotal += radians;
    }

    /**
    * Draws the graphs labels
    */
    RGraph.Pie.prototype.DrawLabels = function ()
    {
        var hAlignment = 'left';
        var vAlignment = 'center';
        var labels     = this.Get('chart.labels');
        var context    = this.context;

        /**
        * Turn the shadow off
        */
        RGraph.NoShadow(this);
        
        context.fillStyle = 'black';
        context.beginPath();

        /**
        * Draw the key (ie. the labels)
        */
        if (labels && labels.length) {

            var text_size = this.Get('chart.text.size');

            for (i=0; i<labels.length; ++i) {
            
                /**
                * T|his ensures that if we're given too many labels, that we don't get an error
                */
                if (typeof(this.angles) == 'undefined') {
                    continue;
                }

                // Move to the centre
                context.moveTo(this.centerx,this.centery);
                
                var a = this.angles[i][0] + ((this.angles[i][1] - this.angles[i][0]) / 2);

                /**
                * Alignment
                */
                if (a < 1.57) {
                    hAlignment = 'left';
                    vAlignment = 'center';
                } else if (a < 3.14) {
                    hAlignment = 'right';
                    vAlignment = 'center';
                } else if (a < 4.71) {
                    hAlignment = 'right';
                    vAlignment = 'center';
                } else if (a < 6.28) {
                    hAlignment = 'left';
                    vAlignment = 'center';
                }

                var angle = ((this.angles[i][1] - this.angles[i][0]) / 2) + this.angles[i][0];

                /**
                * Handle the additional "explosion" offset
                */
                if (typeof(this.Get('chart.exploded')) == 'object' && this.Get('chart.exploded')[i] || typeof(this.Get('chart.exploded')) == 'number') {

                    var t = ((this.angles[i][1] - this.angles[i][0]) / 2);
                    var seperation = typeof(this.Get('chart.exploded')) == 'number' ? this.Get('chart.exploded') : this.Get('chart.exploded')[i];

                    // Adjust the angles
                    var explosion_offsetx = (Math.cos(angle) * seperation);
                    var explosion_offsety = (Math.sin(angle) * seperation);
                } else {
                    var explosion_offsetx = 0;
                    var explosion_offsety = 0;
                }
                
                /**
                * Allow for the label sticks
                */
                if (this.Get('chart.labels.sticks')) {
                    explosion_offsetx += (Math.cos(angle) * this.Get('chart.labels.sticks.length'));
                    explosion_offsety += (Math.sin(angle) * this.Get('chart.labels.sticks.length'));
                }


                context.fillStyle = this.Get('chart.text.color');

                RGraph.Text(context,
                            this.Get('chart.text.font'),
                            text_size,
                            this.centerx + explosion_offsetx + ((this.radius + 10)* Math.cos(a)) + (this.Get('chart.labels.sticks') ? (a < 1.57 || a > 4.71 ? 2 : -2) : 0),
                            this.centery + explosion_offsety + (((this.radius + 10) * Math.sin(a))),
                            labels[i],
                            vAlignment,
                            hAlignment);
            }
            
            context.fill();
        }
    }


    /**
    * This function draws the pie chart sticks (for the labels)
    */
    RGraph.Pie.prototype.DrawSticks = function ()
    {
        var context  = this.context;
        var offset   = this.Get('chart.linewidth') / 2;
        var exploded = this.Get('chart.exploded');
        var sticks   = this.Get('chart.labels.sticks');

        for (var i=0; i<this.angles.length; ++i) {

            // This allows the chart.labels.sticks to be an array as well as a boolean
            if (typeof(sticks) == 'object' && !sticks[i]) {
                continue;
            }

            var radians = this.angles[i][1] - this.angles[i][0];

            context.beginPath();
            context.strokeStyle = this.Get('chart.labels.sticks.color');
            context.lineWidth   = 1;

            var midpoint = (this.angles[i][0] + (radians / 2));

            if (typeof(exploded) == 'object' && exploded[i]) {
                var extra = exploded[i];
            } else if (typeof(exploded) == 'number') {
                var extra = exploded;
            } else {
                var extra = 0;
            }

            context.lineJoin = 'round';
            context.lineWidth = 1;

            context.arc(this.centerx,
                        this.centery,
                        this.radius + this.Get('chart.labels.sticks.length') + extra,
                        midpoint,
                        midpoint + 0.001,
                        0);
            context.arc(this.centerx,
                        this.centery,
                        this.radius + extra,
                        midpoint,
                        midpoint + 0.001,
                        0);

            context.stroke();
        }
    }


    /**
    * The (now Pie chart specific) getSegment function
    * 
    * @param object e The event object
    */
    RGraph.Pie.prototype.getSegment = function (e)
    {
        RGraph.FixEventObject(e);

        // The optional arg provides a way of allowing some accuracy (pixels)
        var accuracy = arguments[1] ? arguments[1] : 0;

        var obj         = e.target.__object__;
        var canvas      = obj.canvas;
        var context     = obj.context;
        var mouseCoords = RGraph.getMouseXY(e);
        var r           = obj.radius;
        var angles      = obj.angles;
        var ret         = [];

        for (var i=0; i<angles.length; ++i) {

            var x     = mouseCoords[0] - angles[i][2];
            var y     = mouseCoords[1] - angles[i][3];
            var theta = Math.atan(y / x); // RADIANS
            var hyp   = y / Math.sin(theta);
            var hyp   = (hyp < 0) ? hyp + accuracy : hyp - accuracy;


            /**
            * Account for the correct quadrant
            */
            if (x < 0 && y >= 0) {
                theta += Math.PI;
            } else if (x < 0 && y < 0) {
                theta += Math.PI;
            }

            if (theta > (2 * Math.PI)) {
                theta -= (2 * Math.PI);
            }

            if (theta >= angles[i][0] && theta < angles[i][1]) {

                hyp = Math.abs(hyp);

                if (!hyp || (obj.radius && hyp > obj.radius) ) {
                    return null;
                }

                if (obj.type == 'pie' && obj.Get('chart.variant') == 'donut' && (hyp > obj.radius || hyp < (obj.radius / 2) ) ) {
                    return null;
                }



                ret[0] = angles[i][2];
                ret[1] = angles[i][3];
                ret[2] = obj.radius;
                ret[3] = angles[i][0] - (2 * Math.PI);
                ret[4] = angles[i][1];
                ret[5] = i;


                
                if (ret[3] < 0) ret[3] += (2 * Math.PI);
                if (ret[4] > (2 * Math.PI)) ret[4] -= (2 * Math.PI);
                
                ret[3] = ret[3];
                ret[4] = ret[4];

                return ret;
            }
        }
        
        return null;
    }


    RGraph.Pie.prototype.DrawBorders = function ()
    {
        if (this.Get('chart.linewidth') > 0) {

            this.context.lineWidth = this.Get('chart.linewidth');
            this.context.strokeStyle = this.Get('chart.strokestyle');

            for (var i=0,len=this.angles.length; i<len; ++i) {
                this.context.beginPath();
                    this.context.arc(this.angles[i][2],
                                     this.angles[i][3],
                                     this.radius,
                                     (this.angles[i][0]),
                                     (this.angles[i][0] + 0.001),
                                     0);
                    this.context.arc(this.angles[i][2],
                                     this.angles[i][3],
                                     this.Get('chart.variant') == 'donut' ? this.radius / 2: this.radius,
                                     this.angles[i][0],
                                     this.angles[i][0],
                                     0);
                this.context.closePath();
                
                this.context.stroke();
            }
        }
    }


    /**
    * Returns the radius of the pie chart
    */
    RGraph.Pie.prototype.getRadius = function ()
    {
        return Math.min(this.canvas.height - this.Get('chart.gutter.top') - this.Get('chart.gutter.bottom'), this.canvas.width - this.Get('chart.gutter.left') - this.Get('chart.gutter.right')) / 2;
    }


    /**
    * A programmatic explode function
    * 
    * @param object obj   The chart object
    * @param number index The zero-indexed number of the segment
    * @param number size  The size (in pixels) of the explosion
    */
    RGraph.Pie.prototype.Explode = function (index, size)
    {
        var obj = this;
        
        this.Set('chart.exploded', []);
        this.Get('chart.exploded')[index] = 0;

        for (var o=0; o<size; ++o) {
            setTimeout(
                function ()
                {
                    obj.Get('chart.exploded')[index] += 1;
                    RGraph.Clear(obj.canvas);
                    obj.Draw();
                }, o * (document.all ? 25 : 16.666));
        }
        
        /**
        * Now set the property accordingly
        */
        //setTimeout(
        //    function ()
        //    {
        //        obj.Set('chart.exploded', []);
        //    }, size * (document.all ? 50 : 20)
        //)
    }


    /**
    * This function highlights a segment
    * 
    * @param array segment The segment information that is returned by the pie.getSegment(e) function
    */
    RGraph.Pie.prototype.highlight_segment = function (segment)
    {
        var context = this.context;

        context.beginPath();
    
        context.strokeStyle = this.Get('chart.highlight.style.2d.stroke');
        context.fillStyle   = this.Get('chart.highlight.style.2d.fill');
    
        context.moveTo(segment[0], segment[1]);
        context.arc(segment[0], segment[1], segment[2], this.angles[segment[5]][0], this.angles[segment[5]][1], 0);
        context.lineTo(segment[0], segment[1]);
        context.closePath();
        
        context.stroke();
        context.fill();
    }



    /**
    * Draws the center label if requested
    */
    RGraph.Pie.prototype.DrawCenterLabel = function ()
    {

        if (typeof(this.Get('chart.labels.center')) == 'string') {
            this.context.beginPath();
            
            // RGraph.Text(context, font, size, x, y, text[, valign[, halign[, border[, angle[, background[, bold[, indicator]]]]]]])

                RGraph.Text(this.context,
                            this.Get('chart.labels.center.font'),
                            this.Get('chart.labels.center.size'),
                            this.centerx,
                            this.centery,
                            this.Get('chart.labels.center'),
                            'center',
                            'center',
                            null,
                            0,
                            null,
                            this.Get('chart.labels.center.bold'));

            this.context.fill();
        }
    }