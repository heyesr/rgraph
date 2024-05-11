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
    RGraph.SVG.Line = function (conf)
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

                // If setting the colors, update the originalColors
                // property too
                if (name === 'colors') {
                    this.originalColors = RGraph.SVG.arrayClone(value, true);
                    this.colorsParsed = false;
                }
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







        this.type            = 'line';
        this.id              = conf.id;
        this.uid             = RGraph.SVG.createUID();
        this.container       = document.getElementById(this.id);
        this.layers          = {}; // MUST be before the SVG tag is created!
        this.svg             = RGraph.SVG.createSVG({
               object: this,
            container: this.container
        });
        this.svgAllGroup     = RGraph.SVG.createAllGroup(this);
        this.isRGraph        = true;
        this.isrgraph        = true;
        this.rgraph          = true;
        this.width           = Number(this.svg.getAttribute('width'));
        this.height          = Number(this.svg.getAttribute('height'));
        this.firstDraw        = true; // After the first draw this will be false
        this.clipid           = null; // Used to clip the canvas




        // Convert strings to numbers
        conf.data = RGraph.SVG.stringsToNumbers(conf.data);





        // Convert single datasets to a multi-dimensional format
        if (RGraph.SVG.isArray(conf.data) && RGraph.SVG.isArray(conf.data[0])) {
            this.data = RGraph.SVG.arrayClone(conf.data, true);
        } else if (RGraph.SVG.isArray(conf.data)) {
            this.data = [RGraph.SVG.arrayClone(conf.data, true)];
        } else {
            this.data = [[]];
        }

        this.coords          = [];
        this.coords2         = [];
        this.coordsSpline    = [];
        this.coordsTrendline = [];
        this.hasMultipleDatasets = typeof this.data[0] === 'object' && typeof this.data[1] === 'object' ? true : false;
        this.colorsParsed    = false;
        this.originalColors  = {};
        this.gradientCounter = 1;
        this.originalData    = RGraph.SVG.arrayClone(this.data, true);
        this.filledGroups    = [];







        // Add this object to the ObjectRegistry
        RGraph.SVG.OR.add(this);

        this.container.style.display = 'inline-block';

        this.properties =
        {
            marginLeft:   35,
            marginRight:  35,
            marginTop:    35,
            marginBottom: 35,
            marginInner:  0,

            backgroundColor:            null,
            backgroundImage:            null,
            backgroundImageStretch:     true,
            backgroundImageAspect:      'none',
            backgroundImageOpacity:     null,
            backgroundImageX:           null,
            backgroundImageY:           null,
            backgroundImageW:           null,
            backgroundImageH:           null,
            backgroundGrid:             true,
            backgroundGridColor:        '#ddd',
            backgroundGridLinewidth:    1,
            backgroundGridHlines:       true,
            backgroundGridHlinesCount:  null,
            backgroundGridVlines:       true,
            backgroundGridVlinesCount:  null,
            backgroundGridBorder:       true,
            backgroundGridDashed:       false,
            backgroundGridDotted:       false,
            backgroundGridDashArray:    null,
            
            colors:           ['red', '#0f0', 'blue', '#ff0', '#0ff', 'green'],
            
            filled:             false,
            filledDualColor:    false,
            filledColors:       [],
            filledClick:        null,
            filledOpacity:      1,
            filledAccumulative: false,
            
            yaxis:                true,
            yaxisLinewidth:       1,
            yaxisTickmarks:       true,
            yaxisTickmarksLength: 3,
            yaxisColor:           'black',
            yaxisScale:           true,
            yaxisLabels:          null,
            yaxisLabelsOffsetx:   0,
            yaxisLabelsOffsety:   0,
            yaxisLabelsCount:     5,
            yaxisScaleUnitsPre:        '',
            yaxisScaleUnitsPost:       '',
            yaxisScaleStrict:          false,
            yaxisScaleDecimals:        0,
            yaxisScalePoint:           '.',
            yaxisScaleThousand:        ',',
            yaxisScaleRound:           false,
            yaxisScaleMax:             null,
            yaxisScaleMin:             0,
            yaxisScaleFormatter:       null,
            yaxisLabelsFont:        null,
            yaxisLabelsSize:        null,
            yaxisLabelsColor:       null,
            yaxisLabelsBold:        null,
            yaxisLabelsItalic:      null,
            yaxisTitle:                '',
            yaxisTitleBold:            null,
            yaxisTitleSize:            null,
            yaxisTitleFont:            null,
            yaxisTitleColor:           null,
            yaxisTitleItalic:          null,
            yaxisTitleOffsetx:         0,
            yaxisTitleOffsety:         0,
            yaxisTitleX:               null,
            yaxisTitleY:               null,
            yaxisTitleHalign:          null,
            yaxisTitleValign:          null,

            xaxis:                true,
            xaxisLinewidth:       1,
            xaxisTickmarks:       true,
            xaxisTickmarksLength: 5,
            xaxisLabels:          null,
            xaxisLabelsOffsetx:   0,
            xaxisLabelsOffsety:   0,
            xaxisLabelsPosition:  'edge',
            xaxisLabelsPositionEdgeTickmarksCount: null,
            xaxisColor:           'black',
            xaxisLabelsFont:      null,
            xaxisLabelsSize:      null,
            xaxisLabelsColor:     null,
            xaxisLabelsBold:      null,
            xaxisLabelsItalic:    null,
            xaxisLabelsFormattedDecimals:  0,
            xaxisLabelsFormattedPoint:     '.',
            xaxisLabelsFormattedThousand:  ',',
            xaxisLabelsFormattedUnitsPre:  '',
            xaxisLabelsFormattedUnitsPost: '',
            xaxisTitle:           '',
            xaxisTitleBold:       null,
            xaxisTitleSize:       null,
            xaxisTitleFont:       null,
            xaxisTitleColor:      null,
            xaxisTitleItalic:     null,
            xaxisTitleOffsetx:    0,
            xaxisTitleOffsety:    0,
            xaxisTitleX:          null,
            xaxisTitleY:          null,
            xaxisTitleHalign:     null,
            xaxisTitleValign:     null,

            textColor:  'black',
            textFont:   'Arial, Verdana, sans-serif',
            textSize:   12,
            textBold:   false,
            textItalic: false,
            text:       null,

            linewidth: 1,
            linejoin: 'round',
            linecap: 'round',

            tooltips:                        null,
            tooltipsOverride:                null,
            tooltipsEffect:                  'fade',
            tooltipsCssClass:                'RGraph_tooltip',
            tooltipsCss:                     null,
            tooltipsEvent:                   'mousemove',
            tooltipsFormattedThousand:       ',',
            tooltipsFormattedPoint:          '.',
            tooltipsFormattedDecimals:       0,
            tooltipsFormattedUnitsPre:       '',
            tooltipsFormattedUnitsPost:      '',
            tooltipsFormattedKeyColors:      null,
            tooltipsFormattedKeyColorsShape: 'square',
            tooltipsFormattedKeyLabels:      [],
            tooltipsFormattedTableHeaders:   null,
            tooltipsFormattedTableData:      null,
            tooltipsPointer:                 true,
            tooltipsPointerOffsetx:          0,
            tooltipsPointerOffsety:          0,
            tooltipsPositionStatic:          true,
            tooltipsDataset:                 null,
            tooltipsHotspotSize:             5,

            //highlightStroke: 'rgba(0,0,0,0)',
            //highlightFill: 'rgba(255,255,255,0.7)',
            //highlightLinewidth: 1,
            
            tickmarksStyle: 'none',
            tickmarksSize: 5,
            tickmarksFill: 'white',
            tickmarksLinewidth: 1,

            labelsAbove:                  false,
            labelsAboveFont:              null,
            labelsAboveSize:              null,
            labelsAboveBold:              null,
            labelsAboveItalic:            null,
            labelsAboveColor:             null,
            labelsAboveBackground:        'rgba(255,255,255,0.7)',
            labelsAboveBackgroundPadding: 2,
            labelsAboveUnitsPre:          null,
            labelsAboveUnitsPost:         null,
            labelsAbovePoint:             null,
            labelsAboveThousand:          null,
            labelsAboveFormatter:         null,
            labelsAboveDecimals:          null,
            labelsAboveOffsetx:           0,
            labelsAboveOffsety:           -10,
            labelsAboveHalign:            'center',
            labelsAboveValign:            'bottom',
            labelsAboveSpecific:          null,

            shadow:        false,
            shadowOffsetx: 2,
            shadowOffsety: 2,
            shadowBlur:    2,
            shadowColor:   'rgba(0,0,0,0.25)',
            
            spline: false,
            stepped: false,
            
            title:       '',
            titleX:      null,
            titleY:      null,
            titleHalign: 'center',
            titleValign: null,
            titleSize:   null,
            titleColor:  null,
            titleFont:   null,
            titleBold:   null,
            titleItalic: null,
            
            titleSubtitle:       null,
            titleSubtitleSize:   null,
            titleSubtitleColor:  '#aaa',
            titleSubtitleFont:   null,
            titleSubtitleBold:   null,
            titleSubtitleItalic: null,
            
            errorbars:            null,
            errorbarsColor:       'black',
            errorbarsLinewidth:   1,
            errorbarsCapwidth:    10,

            key:            null,
            keyColors:      null,
            keyOffsetx:     0,
            keyOffsety:     0,
            keyLabelsOffsetx: 0,
            keyLabelsOffsety: -1,
            keyLabelsSize:    null,
            keyLabelsBold:    null,
            keyLabelsItalic:  null,
            keyLabelsFont:  null,
            keyLabelsColor:  null,
            
            dasharray: null,
            dashed: false,
            dotted: false,
            
            highlightFill: null,
            
            trendline:                  false,
            trendlineColors:            ['#666'],
            trendlineLinewidth:         1,
            trendlineMargin:            25,
            trendlineDashed:            false,
            trendlineDotted:            false,
            trendlineDashArray:         null,
            trendlineClip:              true,
            
            nullBridge:                 false,
            nullBridgeLinewidth:        null,
            nullBridgeColors:           null, // Can be null, a string or an object
            nullBridgeDashArray:        null,
            
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
            
            
            
            
            
            
            

















            // Should the first thing that's done in the.draw() function
            // except for the onbeforedraw event and the
            // installation of clipping.
            this.width  = Number(this.svg.getAttribute('width'));
            this.height = Number(this.svg.getAttribute('height'));
















            // Create the defs tag
            RGraph.SVG.createDefs(this);










            this.graphWidth  = this.width - properties.marginLeft - properties.marginRight;
            this.graphHeight = this.height - properties.marginTop - properties.marginBottom;



            // Parse the colors for gradients
            RGraph.SVG.resetColorsToOriginalValues({object:this});
            this.parseColors();
            
            // Clear the coords arrays
            this.coords       = [];
            this.coords2      = [];
            this.coordsSpline = [];
            
            // Reset the data back to the original
            this.data = RGraph.SVG.arrayClone(this.originalData, true);

            
            // Set this to zero
            this.tooltipsSequentialIndex = 0;
            
            
            
            
            // If the line is set to be dotted or dashed then set the dash array
            if (properties.dashed) {
                properties.dasharray = [5,5];
            }
            if (properties.dotted) {
                properties.dasharray = [1,4];
            }









            // Make the data sequential first
            this.data_seq = RGraph.SVG.arrayLinearize(this.data);
            
            // This allows the errorbars to be a variety of formats and convert
            // them all into an array of objects which have the min and max
            // properties set
            if (properties.errorbars) {
                // Go through the error bars and convert numbers to objects
                for (var i=0; i<this.data_seq.length; ++i) {
    
                    if (typeof properties.errorbars[i] === 'undefined' || RGraph.SVG.isNullish(properties.errorbars[i]) ) {
                        properties.errorbars[i] = {max: null, min: null};
                    
                    } else if (typeof properties.errorbars[i] === 'number') {
                        properties.errorbars[i] = {
                            min: properties.errorbars[i],
                            max: properties.errorbars[i]
                        };
                    
                    // Max is undefined
                    } else if (typeof properties.errorbars[i] === 'object' && typeof properties.errorbars[i].max === 'undefined') {
                        properties.errorbars[i].max = null;
                    
                    // Min is not defined
                    } else if (typeof properties.errorbars[i] === 'object' && typeof properties.errorbars[i].min === 'undefined') {
                        properties.errorbars[i].min = null;
                    }
                }
            }



            // Go through all the data working out the max value
            // whilst taking errorbars into account
            for (var i=0,tmp=[]; i<this.data.length; ++i) {
                for (var j=0; j<this.data[i].length; ++j) {

                    // Init the tmp array slot
                    if (typeof tmp[j] === 'undefined') {
                        tmp[j] = 0;
                    }

                    if (properties.filled && properties.filledAccumulative) {
                        tmp[j] += this.data[i][j];
                        
                        // Only add this once (from the last dataset)
                        if (i === (this.data.length - 1) ) {
                             tmp[j] += (properties.errorbars ? properties.errorbars[RGraph.SVG.groupedIndexToSequential({object: this, dataset: i, index: j})].max : 0)
                        }
                    } else {
                        tmp[j] = Math.max(
                            tmp[j],
                            this.data[i][j] + (properties.errorbars ? properties.errorbars[RGraph.SVG.groupedIndexToSequential({object: this, dataset: i, index: j})].max : 0)
                        );
                    }

                }
            }


            // Go through the data and work out the maximum value
            var values = [];

            // Go thru each dataset
            for (var i=0,max=0; i<this.data.length; ++i) {
                
                if (RGraph.SVG.isArray(this.data[i]) && !properties.filledAccumulative) {
                    values.push(RGraph.SVG.arrayMax(tmp));

                } else if (RGraph.SVG.isArray(this.data[i]) && properties.filled && properties.filledAccumulative) {
                
                   for (var j=0; j<this.data[i].length; ++j) {
                        values[j] = values[j]  || 0;
                        values[j] = values[j] + this.data[i][j];
                        
                        // This adds values to prior values in order
                        // to create the stacking effect.
                        this.data[i][j] = values[j];
                    }
                }
            }

            
            
            if (properties.filled && properties.filledAccumulative) {
                var max = RGraph.SVG.arrayMax(tmp)
            } else {
                var max = RGraph.SVG.arrayMax(values, true);
            }
















            // A custom, user-specified maximum value
            if (typeof properties.yaxisScaleMax === 'number') {
                max = properties.yaxisScaleMax;
            }

            // Set the ymin to zero if it's set mirror
            if (properties.yaxisScaleMin === 'mirror') {
                this.mirrorScale = true;
                properties.yaxisScaleMin   = 0;
            }


            //
            // Generate an appropiate scale
            //

            this.scale = RGraph.SVG.getScale({
                object:    this,
                numlabels: properties.yaxisLabelsCount,
                unitsPre:  properties.yaxisScaleUnitsPre,
                unitsPost: properties.yaxisScaleUnitsPost,
                max:       max,
                min:       properties.yaxisScaleMin,
                point:     properties.yaxisScalePoint,
                round:     properties.yaxisScaleRound,
                thousand:  properties.yaxisScaleThousand,
                decimals:  properties.yaxisScaleDecimals,
                strict:    typeof properties.yaxisScaleMax === 'number',
                formatter: properties.yaxisScaleFormatter
            });



            //
            // Get the scale a second time if the ymin should be mirored
            //
            // Set the ymin to zero if it's szet mirror
            if (this.mirrorScale) {

                this.scale = RGraph.SVG.getScale({
                    object: this,
                    numlabels: properties.yaxisLabelsCount,
                    unitsPre:  properties.yaxisScaleUnitsPre,
                    unitsPost: properties.yaxisScaleUnitsPost,
                    max:       this.scale.max,
                    min:       this.scale.max * -1,
                    point:     properties.yaxisScalePoint,
                    round:     false,
                    thousand:  properties.yaxisScaleThousand,
                    decimals:  properties.yaxisScaleDecimals,
                    strict:    true,
                    formatter: properties.yaxisScaleFormatter
                });
            }

            // Now the scale has been generated adopt its max value
            this.max      = this.scale.max;
            this.min      = this.scale.min;
            
            // Taken out 14/01/18 so that the scale is not fixed
            // across draws
            //
            //properties.yaxisScaleMax = this.scale.max;
            //properties.yaxisScaleMin = this.scale.min;

















            // Install clipping if requested
            if (this.properties.clip) {

                this.clipid = RGraph.SVG.installClipping(this);

                // Add the clip ID to the all group
                this.svgAllGroup.setAttribute(
                    'clip-path',
                    'url(#{1})'.format(this.clipid)
                );
            } else {
                // No clipping - so ensure that there's no clip-path
                // attribute
                this.clipid = null;
                this.svgAllGroup.removeAttribute('clip-path');
            }
            
            
            
            
            
            
            
            
            
            



            // Draw the background first
            RGraph.SVG.drawBackground(this);



            //
            // If the xaxisLabels option is a string then turn it
            // into an array.
            //
            if (properties.xaxisLabels && properties.xaxisLabels.length) {
                if (typeof properties.xaxisLabels === 'string') {
                    properties.xaxisLabels = RGraph.SVG.arrayPad(
                        [],
                        this.originalData[0].length,
                        properties.xaxisLabels
                    );
                }

                // Label substitution
                //
                for (var i=0; i<properties.xaxisLabels.length; ++i) {
                    properties.xaxisLabels[i] = RGraph.SVG.labelSubstitution({
                        object:    this,
                        text:      properties.xaxisLabels[i],
                        index:     i,
                        value:     this.originalData[0][i],
                        decimals:  properties.xaxisLabelsFormattedDecimals  || 0,
                        unitsPre:  properties.xaxisLabelsFormattedUnitsPre  || '',
                        unitsPost: properties.xaxisLabelsFormattedUnitsPost || '',
                        thousand:  properties.xaxisLabelsFormattedThousand  || ',',
                        point:     properties.xaxisLabelsFormattedPoint     || '.'
                    });
                }
            }



            // Draw the axes over the bars
            RGraph.SVG.drawXAxis(this);
            RGraph.SVG.drawYAxis(this);


            for (var i=0; i<this.data.length; ++i) {
                this.drawLine(this.data[i], i);
            }

            // Always redraw the lines now so that tickmarks
            // are drawn
            this.redrawLines();









            // Add trendlines if they have been enabled
            for (let i=0; i<this.data.length; ++i) {
            
                if (    (RGraph.SVG.isArray(properties.trendline) && properties.trendline[i])
                     || (!RGraph.SVG.isArray(properties.trendline) && properties.trendline)) {
                    this.drawTrendline({dataset: i});
                }
            }
            
            //
            // Bridge the null gaps if requested
            //
            if (properties.nullBridge) {
                for (var i=0; i<this.data.length; ++i) {
                    this.nullBridge(i, this.data[i]);
                }
            }







            
            
            // Draw the key
            if (typeof properties.key !== null && RGraph.SVG.drawKey) {
                RGraph.SVG.drawKey(this);
            } else if (!RGraph.SVG.isNullish(properties.key)) {
                alert('The drawKey() function does not exist - have you forgotten to include the key library?');
            }







            // Draw the labelsAbove labels
            this.drawLabelsAbove();
            
            
            
            
            
            // Add the dataset nodes and the event listener
            if (properties.tooltipsDataset) {
                this.addDatasetTooltip();
            }








            // Add the event listener that clears the highlight if
            // there is any. Must be MOUSEDOWN (ie before the click event)
            var obj = this;
            document.body.addEventListener('mousedown', function (e)
            {
                RGraph.SVG.removeHighlight(obj);

            }, false);








            //
            // Allow the addition of custom text via the
            // text: property.
            //
            RGraph.SVG.addCustomText(this);





            // Draw any custom lines that have been defined
            RGraph.SVG.drawHorizontalLines(this);







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
        //
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
        // Draws the bars
        //
        this.drawLine = function (data, index)
        {
            var coords = [],
                path   = [];

            // Generate the coordinates
            for (var i=0,len=data.length; i<len; ++i) {
                
                var val = data[i],
                    x   = (( (this.graphWidth - properties.marginInner - properties.marginInner) / (len - 1) ) * i) + properties.marginLeft + properties.marginInner,
                    y   = this.getYCoord(val);

                coords.push([x,y]);
            }


            // Go through the coordinates and create the path that draws the line
            for (var i=0; i<coords.length; ++i) {

                if (i === 0 || RGraph.SVG.isNullish(data[i]) || RGraph.SVG.isNullish(data[i - 1])) {
                    var action = 'M';

                } else {
                     // STEPPED Add extra lines
                    if (properties.stepped) {
                        path.push('L {1} {2}'.format(
                            coords[i][0],
                            coords[i - 1][1]
                        ));
                    }
                    var action = 'L';
                }

                path.push(action + '{1} {2}'.format(
                    coords[i][0],
                    RGraph.SVG.isNullish(data[i]) ? 0 : coords[i][1]
                ));
            }







            //
            // Add the coordinates to the coords array, coords2 array and if
            // necessary, the coordsSpline array 
            //

            // The coords array

            for (var k=0; k<coords.length; ++k) {
                
                this.coords.push(RGraph.SVG.arrayClone(coords[k], true));

                this.coords[this.coords.length - 1].x      = coords[k][0];
                this.coords[this.coords.length - 1].y      = coords[k][1];
                this.coords[this.coords.length - 1].object = this;
                this.coords[this.coords.length - 1].value  = data[k];
                this.coords[this.coords.length - 1].index  = k;
                this.coords[this.coords.length - 1].path = path;
            }

            // The coords2 array
            this.coords2[index] = RGraph.SVG.arrayClone(coords, true);

            for (var k=0; k<coords.length; ++k) {
                
                //Get the sequential index
                var seq = RGraph.SVG.groupedIndexToSequential({
                    object:  this,
                    dataset: index,
                    index:   k
                });

                this.coords2[index][k].x          = coords[k][0];
                this.coords2[index][k].y          = coords[k][1];
                this.coords2[index][k].object     = this;
                this.coords2[index][k].value      = data[k];
                this.coords2[index][k].index      = k;
                this.coords2[index][k].path       = path;
                this.coords2[index][k].sequential = seq;    

                // Draw the errorbar if required
                if (properties.errorbars) {
                    this.drawErrorbar({
                        object:     this,
                        dataset:    index,
                        index:      k,
                        sequential: seq,
                        x:          x,
                        y:          y
                    });
                }
            }




            // The coordsSpline array
            if (properties.spline) {
                this.coordsSpline[index] = this.drawSpline(coords);
            }




            // If the line should be filled, draw the fill part
            if (properties.filled === true || (typeof properties.filled === 'object' && properties.filled[index]) ) {

                if (properties.spline) {
                    
                    var fillPath = ['M{1} {2}'.format(
                        this.coordsSpline[index][0][0],
                        this.coordsSpline[index][0][1]
                    )];

                    for (var i=1; i<this.coordsSpline[index].length; ++i) {
                        fillPath.push('L{1} {2}'.format(
                            this.coordsSpline[index][i][0] + ((i === (this.coordsSpline[index].length) - 1) ? 1 : 0),
                            this.coordsSpline[index][i][1]
                        ));
                    }

                } else {
                    var fillPath = RGraph.SVG.arrayClone(path, true);
                }


                // Draw a line down to the X axis
                fillPath.push('L{1} {2}'.format(
                    this.coords2[index][this.coords2[index].length - 1][0] + 1,
                    index > 0 && properties.filledAccumulative ? (properties.spline ? this.coordsSpline[index - 1][this.coordsSpline[index - 1].length - 1][1] : this.coords2[index - 1][this.coords2[index - 1].length - 1][1]) : this.getYCoord(properties.yaxisScaleMin > 0 ? properties.yaxisScaleMin : 0) + (properties.xaxis ? 0 : 1)
                ));

                if (index > 0 && properties.filledAccumulative) {
                    
                    var path2 = RGraph.SVG.arrayClone(path, true);
                    
                    if (index > 0 && properties.filledAccumulative) {
                        if (properties.spline) {
                            for (var i=this.coordsSpline[index - 1].length-1; i>=0; --i) {
                                fillPath.push('L{1} {2}'.format(
                                    this.coordsSpline[index - 1][i][0],
                                    this.coordsSpline[index - 1][i][1]
                                ));
                            }
                        } else {
                            for (var i=this.coords2[index - 1].length-1; i>=0; --i) {

                                fillPath.push('L{1} {2}'.format(
                                    this.coords2[index - 1][i][0],
                                    this.coords2[index - 1][i][1]
                                ));
                                
                                // For STEPPED charts
                                if (properties.stepped && i > 0) {
                                    fillPath.push('L{1} {2}'.format(
                                        this.coords2[index - 1][i][0],
                                        this.coords2[index - 1][i - 1][1]
                                    ));
                                }
                            }
                        }
                    }
                } else {

                    // This is the bottom left corner. The +1 is so that
                    // the fill doesn't go over the axis
                    fillPath.push('L{1} {2}'.format(
                        this.coords2[index][0][0] + (properties.yaxis ? 0 : 0),
                        // this.coords2[index][0][0] + (properties.yaxis ? 1 : 0),
                        this.getYCoord(properties.yaxisScaleMin > 0 ? properties.yaxisScaleMin : 0) + (properties.xaxis ? 0 : 1)
                    ));
                }

                // Find the first none-null value and use that
                // values X value
                fillPath.push('L{1} {2}'.format(
                    this.coords2[index][0][0] + (properties.yaxis ? 1 : 0),
                    this.coords2[index][0][1]
                ));

                for (var i=0; i<this.data[index].length; ++i) {
                    if (!RGraph.SVG.isNullish(this.data[index][i])) {
                        fillPath.push('L{1} {2}'.format(
                            this.coords2[index][i][0],
                            this.getYCoord(0)
                        ));
                        break;
                    }
                }

                // Create a group that the fill is added to. Later the line
                // will also be added to it
                this.filledGroups[index] = RGraph.SVG.create({
                    svg: this.svg,
                    type: 'g',
                    parent: this.svgAllGroup,
                    attr: {
                        'class': 'rgraph_filled_line_' + index
                    }
                });

                // Add the fill path to the scene
                var fillPathObject = RGraph.SVG.create({
                    svg: this.svg,
                    parent: this.filledGroups[index],
                    type: 'path',
                    attr: {
                        d: fillPath.join(' '),
                        stroke: 'rgba(0,0,0,0)',
                        'fill': properties.filledColors && properties.filledColors[index] ? properties.filledColors[index] : properties.colors[index],
                        'fill-opacity': properties.filledOpacity,
                        'stroke-width': 1,
                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                    }
                });


                if (properties.filledClick) {
                    
                    var obj = this;
                    fillPathObject.addEventListener('click', function (e)
                    {
                        properties.filledClick(e, obj, index);
                    }, false);
                    
                    fillPathObject.addEventListener('mousemove', function (e)
                    {
                        e.target.style.cursor = 'pointer';
                    }, false);
                }
            }









            //
            // Create the drop shadow effect if its required
            //
            if (properties.shadow) {
                RGraph.SVG.setShadow({
                    object:  this,
                    offsetx: properties.shadowOffsetx,
                    offsety: properties.shadowOffsety,
                    blur:    properties.shadowBlur,
                    color:   properties.shadowColor,
                    id:      'dropShadow'
                });
            }














            // Add the path to the scene
            if (properties.spline) {

                // Make the raw coords into a path
                var str = ['M{1} {2}'.format(
                    this.coordsSpline[index][0][0],
                    this.coordsSpline[index][0][1]
                )];

                for (var i=1; i<this.coordsSpline[index].length; ++i) {
                    str.push('L{1} {2}'.format(
                        this.coordsSpline[index][i][0],
                        this.coordsSpline[index][i][1]
                    ));
                }
                
                str = str.join(' ');

                var line = RGraph.SVG.create({
                    svg: this.svg,
                    parent: properties.filled ? this.filledGroups[index] : this.svgAllGroup,
                    type: 'path',
                    attr: {
                        d: str,
                        stroke: properties['colors'][index],
                        'fill':'none',
                        'stroke-width':  this.hasMultipleDatasets && properties.filled && properties.filledAccumulative ? 0.1 : (RGraph.SVG.isArray(properties.linewidth) ? properties.linewidth[index] : properties.linewidth + 0.01),
                        'stroke-dasharray': properties.dasharray ? properties.dasharray : '',
                        'stroke-linecap': this.getLinecap({index: index}),
                        'stroke-linejoin': this.getLinejoin({index: index}),
                        filter: properties.shadow ? 'url(#dropShadow)' : '',
                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                    }
                });

            } else {

                var path2 = RGraph.SVG.arrayClone(path, true);

                if (properties.filled && properties.filledAccumulative && index > 0) {
                    for (var i=this.coords2[index - 1].length-1; i>=0; --i) {
                        path2.push('L{1} {2}'.format(
                            this.coords2[index - 1][i][0],
                            this.coords2[index - 1][i][1]
                        ));
                    }
                }

                path2 = path2.join(' ');

                var line = RGraph.SVG.create({
                    svg: this.svg,
                    parent: properties.filled ? this.filledGroups[index] : this.svgAllGroup,
                    type: 'path',
                    attr: {
                        d: path2,
                        stroke: properties.colors[index],
                        'fill':'none',
                        'stroke-dasharray': properties.dasharray ? properties.dasharray : '',
                        'stroke-width': this.hasMultipleDatasets && properties.filled && properties.filledAccumulative ? 0.1 : (RGraph.SVG.isArray(properties.linewidth) ? properties.linewidth[index]: properties.linewidth + 0.01),
                        'stroke-linecap': this.getLinecap({index: index}),
                        'stroke-linejoin': this.getLinejoin({index: index}),
                        filter: properties.shadow ? 'url(#dropShadow)' : '',
                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                    }
                });
            }






            if (properties.tooltips && properties.tooltips.length) {

                if (!document.getElementsByClassName('rgraph_hotspots').length) {

                    var group = RGraph.SVG.create({
                        svg: this.svg,
    
                        // Taken out on 11/12/17 so that hotspots
                        // can sit in this group
                        //
                        // Put back in on 4/2/2024 so that clipping
                        // works correctly
                        //
                        parent: this.svgAllGroup,
    
                        type: 'g',
                        attr: {
                            fill: 'transparent',
                            className: "rgraph_hotspots"
                        },
                        style: {
                            cursor: 'pointer'
                        }
                    });
                    
                    // Store the group so it can be easily got
                    // to later on
                    this.svgAllGroup.line_tooltip_hotspots = group;
                
                } else {
                    group = this.svgAllGroup.line_tooltip_hotspots;
                }
                

                //for (var i=0; i<this.coords2[index].length; ++i,++this.tooltipsSequentialIndex) {
                for (var i=0;
                     i<this.coords2[index].length && (typeof properties.tooltips === 'string' ? true : this.tooltipsSequentialIndex < properties.tooltips.length);
                     ++i,++this.tooltipsSequentialIndex
                    ) {

                    if (!RGraph.SVG.isNullish(this.originalData[index][i]) && (properties.tooltips[this.tooltipsSequentialIndex] || typeof properties.tooltips === 'string') && this.coords2[index][i][0] && this.coords2[index][i][1]) {

                        var hotspot = RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svgAllGroup,
                            type: 'circle',
                            attr: {
                                cx: this.coords2[index][i][0],
                                cy: this.coords2[index][i][1],
                                r: properties.tooltipsHotspotSize,
                                fill: 'transparent',
                                'data-dataset': index,
                                'data-index': i
                            },
                            style: {
                                cursor: 'pointer'
                            }
                        });

                        var obj = this;
                        (function (sequentialIndex)
                        {
                            hotspot.addEventListener(properties.tooltipsEvent, function (e)
                            {
                                var indexes = RGraph.SVG.sequentialIndexToGrouped(sequentialIndex, obj.data),
                                    index   = indexes[1],
                                    dataset = indexes[0];


                                if (RGraph.SVG.REG.get('tooltip') &&
                                    RGraph.SVG.REG.get('tooltip').__index__ === index &&
                                    RGraph.SVG.REG.get('tooltip').__dataset__ === dataset &&
                                    RGraph.SVG.REG.get('tooltip').__object__.uid === obj.uid) { // Added on the 27th/6/2019
                                    return;
                                }

                                obj.removeHighlight();

                                RGraph.SVG.hideTooltip();

                                RGraph.SVG.tooltip({
                                    object:          obj,
                                    index:           index,
                                    dataset:         dataset,
                                    sequentialIndex: sequentialIndex,
                                    text:            typeof properties.tooltips === 'string' ? properties.tooltips : properties.tooltips[sequentialIndex],
                                    event:           e
                                });


                                // Highlight the chart here
                                var outer_highlight1 = RGraph.SVG.create({
                                    svg: obj.svg,
                                    parent: obj.svgAllGroup,
                                    type: 'circle',
                                    attr: {
                                        cx: obj.coords2[dataset][index][0],
                                        cy: obj.coords2[dataset][index][1],
                                        r: 5,
                                        fill: obj.properties.colors[dataset],
                                        'fill-opacity': 0.5
                                    },
                                    style: {
                                        cursor: 'pointer'
                                    }
                                });


                                var outer_highlight2 = RGraph.SVG.create({
                                    svg: obj.svg,
                                    parent: obj.svgAllGroup,
                                    type: 'circle',
                                    attr: {
                                        cx: obj.coords2[dataset][index][0],
                                        cy: obj.coords2[dataset][index][1],
                                        r: 14,
                                        fill: 'white',
                                        'fill-opacity': 0.75
                                    },
                                    style: {
                                        cursor: 'pointer'
                                    }
                                });


                                var inner_highlight1 = RGraph.SVG.create({
                                    svg: obj.svg,
                                    parent: obj.svgAllGroup,
                                    type: 'circle',
                                    attr: {
                                        cx: obj.coords2[dataset][index][0],
                                        cy: obj.coords2[dataset][index][1],
                                        r: 6,
                                        fill: 'white'
                                    },
                                    style: {
                                        cursor: 'pointer'
                                    }
                                });


                                var inner_highlight2 = RGraph.SVG.create({
                                    svg: obj.svg,
                                    parent: obj.svgAllGroup,
                                    type: 'circle',
                                    attr: {
                                        cx: obj.coords2[dataset][index][0],
                                        cy: obj.coords2[dataset][index][1],
                                        r: 5,
                                        fill: typeof obj.properties.highlightFill === 'string' ? obj.properties.highlightFill : obj.properties.colors[dataset]
                                    },
                                    style: {
                                        cursor: 'pointer'
                                    }
                                });

                                // Set the highlight in the registry
                                RGraph.SVG.REG.set('highlight', [
                                    outer_highlight1,
                                    outer_highlight2,
                                    inner_highlight1,
                                    inner_highlight2
                                ]);

                            }, false);
                        })(this.tooltipsSequentialIndex);
    
                    }
                }
            }
        };








        //
        // Draws tickmarks
        //
        // @param number index  The index of the line/dataset of coordinates
        // @param object data   The origvinal line data points
        // @param object coords The coordinates of the points
        //
        this.drawTickmarks = function (index, data, coords)
        {
            var style      = typeof properties.tickmarksStyle === 'object'     ? properties.tickmarksStyle[index]     : properties.tickmarksStyle,
                size       = typeof properties.tickmarksSize === 'object'      ? properties.tickmarksSize[index]      : properties.tickmarksSize,
                fill       = typeof properties.tickmarksFill === 'object'      ? properties.tickmarksFill[index]      : properties.tickmarksFill,
                linewidth  = typeof properties.tickmarksLinewidth === 'object' ? properties.tickmarksLinewidth[index] : properties.tickmarksLinewidth;

            for (var i=0; i<data.length; ++i) {

                if (typeof data[i] === 'number') {
                    switch (style) {
                        case 'filledcircle':
                        case 'filledendcircle':
                            if (style === 'filledcircle' || (i === 0 || i === data.length - 1) ) {
                                var circle = RGraph.SVG.create({
                                    svg: this.svg,
                                    parent: this.svgAllGroup,
                                    type: 'circle',
                                    attr: {
                                        cx: coords[index][i][0],
                                        cy: coords[index][i][1],
                                        r: size,
                                        'fill': properties.colors[index],
                                        filter: properties.shadow? 'url(#dropShadow)' : '',
                                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                                    },
                                    style: {
                                        pointerEvents: 'none'
                                    }
                                });
                            }


                            break;

                        case 'circle':
                        case 'endcircle':

                            if (style === 'circle' || (style === 'endcircle' && (i === 0 || i === data.length - 1)) ) {

                                var outerCircle = RGraph.SVG.create({
                                    svg: this.svg,
                                    parent: this.svgAllGroup,
                                    type: 'circle',
                                    attr: {
                                        cx: coords[index][i][0],
                                        cy: coords[index][i][1],
                                        r: size + this.get('linewidth'),
                                        'fill': properties.colors[index],
                                        filter: properties.shadow? 'url(#dropShadow)' : '',
                                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                                    },
                                    style: {
                                        pointerEvents: 'none'
                                    }
                                });

                                var innerCircle = RGraph.SVG.create({
                                    svg: this.svg,
                                    parent: this.svgAllGroup,
                                    type: 'circle',
                                    attr: {
                                        cx: coords[index][i][0],
                                        cy: coords[index][i][1],
                                        r: size,
                                        'fill': fill,
                                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                                    },
                                    style: {
                                        pointerEvents: 'none'
                                    }
                                });

                                break;
                            }
                            break;

                        case 'endrect':
                        case 'rect':
                            if (style === 'rect' || (style === 'endrect' && (i === 0 || i === data.length - 1)) ) {
                            
                                var fill = typeof fill === 'object'&& typeof fill[index] === 'string' ? fill[index] : fill;
                            
                                var rect = RGraph.SVG.create({
                                    svg: this.svg,
                                    parent: this.svgAllGroup,
                                    type: 'rect',
                                    attr: {
                                        x:      coords[index][i][0] - size,
                                        y:      coords[index][i][1] - size,
                                        width:  size + size + linewidth,
                                        height: size + size + linewidth,
                                        'stroke-width': this.get('linewidth'),
                                        'stroke': properties.colors[index],
                                        'fill': fill,
                                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                                    },
                                    style: {
                                        pointerEvents: 'none'
                                    }
                                });
                            }
                            
                            break;

                        case 'filledendrect':
                        case 'filledrect':
                            if (style === 'filledrect' || (style === 'filledendrect' && (i === 0 || i === data.length - 1)) ) {

                                var fill = properties.colors[index];

                                var rect = RGraph.SVG.create({
                                    svg: this.svg,
                                    parent: this.svgAllGroup,
                                    type: 'rect',
                                    attr: {
                                        x:      coords[index][i][0] - size,
                                        y:      coords[index][i][1] - size,
                                        width:  size + size + linewidth,
                                        height: size + size + linewidth,
                                        'fill': fill,
                                        'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                                    },
                                    style: {
                                        pointerEvents: 'none'
                                    }
                                });
                            }
                    }
                }
            }
        };








        //
        // Redraws the line in certain circumstances:
        //  o filled
        //  o filledAccumulative
        //  o Multiple lines
        //
        this.redrawLines = function ()
        {
            if (properties.spline) {
                for (var i=0; i<this.coordsSpline.length; ++i) {

                    var linewidth = RGraph.SVG.isArray(properties.linewidth) ? properties.linewidth[i] : properties.linewidth,
                        color     = properties['colors'][i],
                        path      = '';
                    
                    // Create the path from the spline coordinates
                    for (var j=0; j<this.coordsSpline[i].length; ++j) {
                        if (j === 0) {
                            path += 'M{1} {2} '.format(
                                this.coordsSpline[i][j][0],
                                this.coordsSpline[i][j][1]
                            );
                        } else {
                            path += 'L{1} {2} '.format(
                                this.coordsSpline[i][j][0],
                                this.coordsSpline[i][j][1]
                            );
                        }
                    }



                    RGraph.SVG.create({
                        svg: this.svg,
                        parent: properties.filled ? this.filledGroups[i] : this.svgAllGroup,
                        type: 'path',
                        attr: {
                            d: path,
                            stroke: color,
                            'fill':'none',
                            'stroke-dasharray': properties.dasharray ? properties.dasharray : '',
                            'stroke-width':  linewidth + 0.01,
                            'stroke-linecap': this.getLinecap({index: i}),
                            'stroke-linejoin': this.getLinejoin({index: i}),
                            filter: properties.shadow ? 'url(#dropShadow)' : '',
                            'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                        }
                    });
                }
                

                // Now draw the tickmarks
                for (var dataset=0; dataset<this.coords2.length; ++dataset) {
                    this.drawTickmarks(
                        dataset,
                        this.data[dataset],
                        this.coords2
                    );
                }

            } else {


                for (var i=0; i<this.coords2.length; ++i) {

                    var linewidth = RGraph.SVG.isArray(properties.linewidth) ? properties.linewidth[i] : properties.linewidth,
                        color     = properties['colors'][i],
                        path      = '';

                    // Create the path from the coordinates
                    for (var j=0; j<this.coords2[i].length; ++j) {
                        if (j === 0 || RGraph.SVG.isNullish(this.data[i][j]) || RGraph.SVG.isNullish(this.data[i][j - 1])) {
                            path += 'M{1} {2} '.format(
                                this.coords2[i][j][0],
                                RGraph.SVG.isNullish(this.data[i][j]) ? 0 : this.coords2[i][j][1]
                            );
                        } else {
                            if (properties.stepped) {
                                path += 'L{1} {2} '.format(
                                    this.coords2[i][j][0],
                                    this.coords2[i][j - 1][1]
                                );
                            }

                            path += 'L{1} {2} '.format(
                                this.coords2[i][j][0],
                                this.coords2[i][j][1]
                            );
                        }
                    }



                    RGraph.SVG.create({
                        svg: this.svg,
                        parent: properties.filled ? this.filledGroups[i] : this.svgAllGroup,
                        type: 'path',
                        attr: {
                            d: path,
                            stroke: color,
                            'fill':'none',
                            'stroke-dasharray': properties.dasharray ? properties.dasharray : '',
                            'stroke-width':  linewidth + 0.01,
                            'stroke-linecap': this.getLinecap({index: i}),
                            'stroke-linejoin': this.getLinejoin({index: i}),
                            filter: properties.shadow ? 'url(#dropshadow)' : '',
                            'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                        }
                    });

                }

                // Now draw the tickmarks
                for (var dataset=0; dataset<this.coords2.length; ++dataset) {
                    this.drawTickmarks(
                        dataset,
                        this.data[dataset],
                        this.coords2
                    );
                }
            }
        };








        //
        // This function can be used to retrieve the relevant Y coordinate for a
        // particular value.
        // 
        // @param int value The value to get the Y coordinate for
        //
        this.getYCoord = function (value)
        {
            // You can now give a boolean true value to stipulate
            // that outofbounds values are allowed
            if (arguments[1] === true) {
                var allowOutOfBounds = true;
            }

            var y;

            if (!allowOutOfBounds && RGraph.SVG.isNullish(value)) {
                return null;
            }

            if (!allowOutOfBounds && value > this.scale.max) {
                return null;
            }

            if (!allowOutOfBounds && value < this.scale.min) {
                return null;
            }

            y  = ((value - this.scale.min) / (this.scale.max - this.scale.min));
            y *= (this.height - properties.marginTop - properties.marginBottom);

            y = this.height - properties.marginBottom - y;

            return y;
        };








        //
        // This function can be used to highlight a bar on the chart
        // 
        // TODO This function looks like its needs updating
        // 
        // @param object rect The rectangle to highlight
        //
        this.highlight = function (rect)
        {
            var x = rect.getAttribute('x'),
                y = rect.getAttribute('y');
        };








        //
        // Remove highlight from the chart (tooltips)
        //
        this.removeHighlight = function ()
        {
            //var highlight = RGraph.SVG.REG.get('highlight');

            //if (highlight && highlight.parentNode) {
            //    highlight.parentNode.removeChild(highlight);
            //
            //// The highlight is an array
            //} else if (highlight && RGraph.SVG.isArray(highlight)) {
            //    for (var i=0; i<highlight.length; ++i) {
            //        if (highlight[i] && highlight[i].parentNode) {
            //            highlight[i].parentNode.removeChild(highlight[i]);
            //        }
            //    }
            //}
            
            //RGraph.SVG.REG.set('highlight', null);
            
            RGraph.SVG.removeHighlight();
        };








        //
        // Draw a spline Line chart
        //
        // @param array coords The coords for the line
        //
        this.drawSpline = function (coords)
        {
            var xCoords      = [];
                marginLeft   = properties.marginLeft,
                marginRight  = properties.marginRight,
                hmargin      = properties.marginInner,
                interval     = (this.graphWidth - (2 * hmargin)) / (coords.length - 1),
                coordsSpline = [];

            //
            // The drawSpline function takes an array of JUST Y coords - not X/Y coords. So the line coords need converting
            // if we've been given X/Y pairs
            //
            for (var i=0,len=coords.length; i<len;i+=1) {
                if (typeof coords[i] == 'object' && coords[i] && coords[i].length == 2) {
                    coords[i] = Number(coords[i][1]);
                }
            }

            //
            // Get the Points array in the format we want - the first value should
            // be null along with the lst value
            //
            var P = [coords[0]];
            for (var i=0; i<coords.length; ++i) {
                P.push(coords[i]);
            }
            P.push(coords[coords.length - 1] + (coords[coords.length - 1] - coords[coords.length - 2]));

            for (var j=1; j<P.length-2; ++j) {
                for (var t=0; t<10; ++t) {
                    
                    var yCoord = spline( t/10, P[j-1], P[j], P[j+1], P[j+2] );
    
                    xCoords.push(((j-1) * interval) + (t * (interval / 10)) + marginLeft + hmargin);

                    coordsSpline.push([
                        xCoords[xCoords.length - 1],
                        yCoord
                    ]);
                    
                    if (typeof index === 'number') {
                        coordsSpline[index].push([
                            xCoords[xCoords.length - 1],
                            yCoord
                        ]);
                    }
                }
            }


            // Draw the last section
            coordsSpline.push([
                ((j-1) * interval) + marginLeft + hmargin,
                P[j]
            ]);

            if (typeof index === 'number') {
                coordsSpline.push([
                    ((j-1) * interval) + marginLeft + hmargin,
                    P[j]
                ]);
            }

            function spline (t, P0, P1, P2, P3)
            {
                return 0.5 * ((2 * P1) +
                             ((0-P0) + P2) * t +
                             ((2*P0 - (5*P1) + (4*P2) - P3) * (t*t) +
                             ((0-P0) + (3*P1)- (3*P2) + P3) * (t*t*t)));
            }
            
            // Add some properties to the coordinates
            for (var i=0; i<coordsSpline.length; ++i) {
                coordsSpline[i].object = this;
                coordsSpline[i].x      = this;
                coordsSpline[i].y      = this;
            }

            return coordsSpline;
        };








        //
        // This allows for easy specification of gradients
        //
        this.parseColors = function () 
        {
            if (!Object.keys(this.originalColors).length) {
                this.originalColors = {
                    colors:              RGraph.SVG.arrayClone(properties.colors, true),
                    filledColors:        RGraph.SVG.arrayClone(properties.filledColors, true),
                    backgroundGridColor: RGraph.SVG.arrayClone(properties.backgroundGridColor, true),
                    //highlightFill:       RGraph.SVG.arrayClone(properties.highlightFill, true),
                    backgroundColor:     RGraph.SVG.arrayClone(properties.backgroundColor, true)
                }
            }

            // colors
            var colors = properties.colors;

            if (colors) {
                for (var i=0; i<colors.length; ++i) {
                    colors[i] = RGraph.SVG.parseColorLinear({
                        object: this,
                        color: colors[i]
                    });
                }
            }
            
            
            // Fill colors
            var filledColors = properties.filledColors;

            if (filledColors) {
                for (var i=0; i<filledColors.length; ++i) {
                    filledColors[i] = RGraph.SVG.parseColorLinear({
                        object: this,
                        color: filledColors[i]
                    });
                }
            }

            properties.backgroundGridColor = RGraph.SVG.parseColorLinear({object: this, color: properties.backgroundGridColor});
            //properties.highlightFill       = RGraph.SVG.parseColorLinear({object: this, color: properties.highlightFill});
            properties.backgroundColor     = RGraph.SVG.parseColorLinear({object: this, color: properties.backgroundColor});
        };








        //
        // Draws the labelsAbove
        //
        this.drawLabelsAbove = function ()
        {
            // Go through the above labels
            if (properties.labelsAbove) {
            
                var data_seq = RGraph.SVG.arrayLinearize(this.data),
                    seq      = 0;

                for (var dataset=0; dataset<this.coords2.length; ++dataset,seq++) {
                    for (var i=0; i<this.coords2[dataset].length; ++i,seq++) {
    
                        var str = RGraph.SVG.numberFormat({
                            object:    this,
                            num:       this.data[dataset][i].toFixed(properties.labelsAboveDecimals ),
                            prepend:   typeof properties.labelsAboveUnitsPre  === 'string'   ? properties.labelsAboveUnitsPre  : null,
                            append:    typeof properties.labelsAboveUnitsPost === 'string'   ? properties.labelsAboveUnitsPost : null,
                            point:     typeof properties.labelsAbovePoint     === 'string'   ? properties.labelsAbovePoint     : null,
                            thousand:  typeof properties.labelsAboveThousand  === 'string'   ? properties.labelsAboveThousand  : null,
                            formatter: typeof properties.labelsAboveFormatter === 'function' ? properties.labelsAboveFormatter : null
                        });
                        
                        // Facilitate labelsAboveSpecific
                        if (properties.labelsAboveSpecific && properties.labelsAboveSpecific.length && (typeof properties.labelsAboveSpecific[seq] === 'string' || typeof properties.labelsAboveSpecific[seq] === 'number') ) {
                            str = properties.labelsAboveSpecific[seq];
                        } else if ( properties.labelsAboveSpecific && properties.labelsAboveSpecific.length && typeof properties.labelsAboveSpecific[seq] !== 'string' && typeof properties.labelsAboveSpecific[seq] !== 'number') {
                            continue;
                        }
                        
                        // Get the text configuration for the above labels
                        var textConf = RGraph.SVG.getTextConf({
                            object: this,
                            prefix: 'labelsAbove'
                        });

                        RGraph.SVG.text({
                            object:     this,
                            parent:     this.svgAllGroup,
                            tag:        'labels.above',
                            text:       str,
                            x:          parseFloat(this.coords2[dataset][i][0]) + properties.labelsAboveOffsetx,
                            y:          parseFloat(this.coords2[dataset][i][1]) + properties.labelsAboveOffsety,
                            halign:     properties.labelsAboveHalign,
                            valign:     properties.labelsAboveValign,
                            font:       textConf.font,
                            size:       textConf.size,
                            bold:       textConf.bold,
                            italic:     textConf.italic,
                            color:      textConf.color,
                            background: properties.labelsAboveBackground        || null,
                            padding:    properties.labelsAboveBackgroundPadding || 0
                        });
                    }
                    
                    // Necessary so that the seq doesn't get incremented twice
                    seq--;
                }
            }
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








        // This function is used to draw the errorbar. Its in the common
        // file because it's used by multiple chart libraries
        this.drawErrorbar = function (opt)
        {
            var linewidth = RGraph.SVG.getErrorbarsLinewidth({object: this, index: opt.index}),
                color     = RGraph.SVG.getErrorbarsColor({object: this, index: opt.sequential}),
                capwidth  = RGraph.SVG.getErrorbarsCapWidth({object: this, index: opt.index}),
                index     = opt.index,
                dataset   = opt.dataset,
                x         = opt.x,
                y         = opt.y,
                value     = this.data[dataset][index];

            
            // Get the Y coord of the point
            var y = this.getYCoord(y);

        
        
            // Get the error bar value
            var max = RGraph.SVG.getErrorbarsMaxValue({
                object: this,
                index: opt.sequential
            });
        
            
        
            // Get the error bar value
            var min = RGraph.SVG.getErrorbarsMinValue({
                object: this,
                index: opt.sequential
            });

        
        
        
            if (!max && !min) {
                return;
            }
        
        
        
        
        
        
            var x = this.coords2[dataset][index].x,
                y = this.coords2[dataset][index].y,
                halfCapWidth = capwidth / 2,
                y1 = this.getYCoord(value + max),
                y3 = this.getYCoord(value - min) === null ? y : this.getYCoord(value - min);
        
        
            if (max > 0) {
        
                // Draw the UPPER vertical line
                var errorbarLine = RGraph.SVG.create({
                    svg: this.svg,
                    type: 'line',
                    parent: this.svgAllGroup,
                    attr: {
                        x1: x,
                        y1: y,
                        x2: x,
                        y2: y1,
                        stroke: color,
                        'stroke-width': linewidth
                    }
                });


                // Draw the cap to the UPPER line
                var errorbarCap = RGraph.SVG.create({
                    svg: this.svg,
                    type: 'line',
                    parent: this.svgAllGroup,
                    attr: {
                        x1: x - halfCapWidth,
                        y1: y1,
                        x2: x + halfCapWidth,
                        y2: y1,
                        stroke: color,
                        'stroke-width': linewidth
                    }
                });
            }
        
        
        
        
        
        
        
        
        
        
        
        
            // Draw the minimum errorbar if necessary
            if (typeof min === 'number') {
        
                var errorbarLine = RGraph.SVG.create({
                    svg: this.svg,
                    type: 'line',
                    parent: this.svgAllGroup,
                    attr: {
                        x1: x,
                        y1: y,
                        x2: x,
                        y2: y3,
                        stroke: color,
                        'stroke-width': linewidth
                    }
                });
        
                // Draw the cap to the UPPER line
                var errorbarCap = RGraph.SVG.create({
                    svg: this.svg,
                    type: 'line',
                    parent: this.svgAllGroup,
                    attr: {
                        x1: x - halfCapWidth,
                        y1: y3,
                        x2: x + halfCapWidth,
                        y2: y3,
                        stroke: color,
                        'stroke-width': linewidth
                    }
                });
            }
        };








        //
        // A trace effect
        //
        //  @param object    Options to give to the effect
        // @param  function  A function to call when the effect has completed
        //
        this.trace = function ()
        {
            var opt      = arguments[0] || {},
                frame    = 1,
                frames   = opt.frames || 60,
                obj      = this;
            
            this.isTrace = true;

            this.draw();
                


            // Create the clip area
            var clippath = RGraph.SVG.create({
                svg: this.svg,
                parent: this.svg.defs,
                type: 'clipPath',
                attr: {
                    id: 'trace-effect-clip'
                }
            });

            var clippathrect = RGraph.SVG.create({
                svg: this.svg,
                parent: clippath,
                type: 'rect',
                attr: {
                    x: 0,
                    y: 0,
                    width: 0,
                    height: this.height
                }
            });

            var iterator = function ()
            {
                var width = (frame++) / frames * obj.width;

                clippathrect.setAttribute("width", width);

                if (frame <= frames) {
                    RGraph.SVG.FX.update(iterator);
                } else {
                    
                    // Remove the clippath
                    clippath.parentNode.removeChild(clippath);
                    
                    if (opt.callback) {
                        (opt.callback)(obj);
                    }
                }
            };
            
            iterator();
            
            return this;
        };








        //
        // A worker function that handles Bar chart specific tooltip substitutions
        //
        this.tooltipSubstitutions = function (opt)
        {
            var indexes = RGraph.SVG.sequentialIndexToGrouped(opt.index, this.data);

            // Create the values array which contains each datasets value
            for (var i=0,values=[]; i<this.originalData.length; ++i) {
                values.push(this.originalData[i][indexes[1]]);
            }

            return {
                  index: indexes[1],
                dataset: indexes[0],
        sequentialIndex: opt.index,
                  value: typeof this.data[indexes[0]] === 'number' ? this.data[indexes[0]] : this.data[indexes[0]][indexes[1]],
                 values: values
            };
        };








        //
        // This allows for static tooltip positioning
        //
        this.positionTooltipStatic = function (args)
        {
            var obj      = args.object,
                e        = args.event,
                tooltip  = args.tooltip,
                index    = args.index,
                svgXY    = RGraph.SVG.getSVGXY(obj.svg),
                coords   = this.coords[args.index];

            // Position the tooltip in the X direction
            args.tooltip.style.left = (
                  svgXY[0]                       // The X coordinate of the canvas
                + coords[0]                      // The X coordinate of the bar on the chart
                - (tooltip.offsetWidth / 2)      // Subtract half of the tooltip width
            ) + 'px';

            args.tooltip.style.top  = (
                  svgXY[1]                       // The Y coordinate of the canvas
                + coords[1]                      // The Y coordinate of the bar on the chart
                - tooltip.offsetHeight           // The height of the tooltip
                - 15                             // An arbitrary amount
            ) + 'px';
        };








        //
        // Draws a trendline on the Scatter chart. This is also known
        // as a "best-fit line"
        //
        // @param dataset The index of the dataset to use
        //
        this.drawTrendline = function (opt)
        {
            var obj        = this,
                color      = properties.trendlineColor,
                linewidth  = properties.trendlineLinewidth,
                margin     = properties.trendlineMargin,
                clip       = properties.trendlineClip;

            // Create the clipping region if necessary
            if (clip) {
            
                // Create the clip area
                var clippath = RGraph.SVG.create({
                    svg: this.svg,
                    parent: this.svg.defs,
                    type: 'clipPath',
                    attr: {
                        id: 'trendline-clip'
                    }
                });
            
                var clippathrect = RGraph.SVG.create({
                    svg: this.svg,
                    parent: clippath,
                    type: 'rect',
                    attr: {
                             x: properties.marginLeft,
                             y: properties.marginTop,
                         width: this.width - properties.marginLeft - properties.marginRight,
                        height: this.height - properties.marginTop - properties.marginBottom
                    }
                });
            }



            //
            // Create the pseudo-data array
            //
            var data=[];

            // Create the data array from the given data and an
            // increasing X value
            for (var i=0; i<this.data.length; ++i) {
                
                data[i] = [];

                for (var j=0; j<this.data[i].length; ++j) {
                    data[i].push([j, this.data[i][j]]);
                }
            }

            // Allow for trendlineColors as well
            if (RGraph.SVG.isArray(properties.trendlineColors)) {
                color = properties.trendlineColors;
            }



            // handle the options being arrays
            if (typeof color === 'object' && color[opt.dataset]) {
                color = color[opt.dataset];
            } else if (typeof color === 'object') {
                color = 'gray';
            }

            if (typeof linewidth === 'object' && typeof linewidth[opt.dataset] === 'number') {
                linewidth = linewidth[opt.dataset];
            } else if (typeof linewidth === 'object') {
                linewidth = 1;
            }

            if (typeof margin === 'object' && typeof margin[opt.dataset] === 'number') {
                margin = margin[opt.dataset];
            } else if (typeof margin === 'object'){
                margin = 25;
            }


            // Step 1: Calculate the mean values of the X coords and the Y coords
            for (var i=0,totalX=0,totalY=0; i<this.data[opt.dataset].length; ++i) {
                totalX += data[opt.dataset][i][0];
                totalY += data[opt.dataset][i][1];
            }

            var averageX = totalX / data[opt.dataset].length;
            var averageY = totalY / data[opt.dataset].length;

            // Step 2: Calculate the slope of the line
            
            // a: The X/Y values minus the average X/Y value
            for (var i=0,xCoordMinusAverageX=[],yCoordMinusAverageY=[],valuesMultiplied=[],xCoordMinusAverageSquared=[]; i<this.data[opt.dataset].length; ++i) {
                xCoordMinusAverageX[i] = data[opt.dataset][i][0] - averageX;
                yCoordMinusAverageY[i] = data[opt.dataset][i][1] - averageY;

                // b. Multiply the averages
                valuesMultiplied[i] = xCoordMinusAverageX[i] * yCoordMinusAverageY[i];
                xCoordMinusAverageSquared[i] = xCoordMinusAverageX[i] * xCoordMinusAverageX[i];
            }

            var sumOfValuesMultiplied          = RGraph.SVG.arraySum(valuesMultiplied);
            var sumOfXCoordMinusAverageSquared = RGraph.SVG.arraySum(xCoordMinusAverageSquared);

            // Calculate m (???)
            var m = sumOfValuesMultiplied / sumOfXCoordMinusAverageSquared;
            var b = averageY - (m * averageX);

            // y = mx + b

            var coords =  [
                [0, m * 0 + b],
                [data[0].length - 1, m * (data[0].length - 1) + b]
            ];

            // Convert the X/Y numbers into coordinates
            coords[0][0] = properties.marginLeft;
            coords[0][1] = this.getYCoord(coords[0][1], true);
            coords[1][0] = this.width - properties.marginRight;
            coords[1][1] = this.getYCoord(coords[1][1], true);









            //
            // Draw the line
            //
            
            // Set dotted, dash or a custom dash array
            if (   properties.trendlineDashed === true
                || (RGraph.SVG.isArray(properties.trendlineDashed) && properties.trendlineDashed[opt.dataset]) ) {
                var dasharray = [4,4];
            }
            
            if (   properties.trendlineDotted === true
                || (RGraph.SVG.isArray(properties.trendlineDotted) && properties.trendlineDotted[opt.dataset])) {
                var dasharray = [1,4];
            }
            
            // Set a lineDash array. It can be an array of two numbers, or it can be a
            // multi-dimensional array, each of two numbers. One for each line on the
            // chart.
            if (RGraph.SVG.isArray(properties.trendlineDashArray)) {
                if (   properties.trendlineDashArray.length === 2
                    && typeof properties.trendlineDashArray[0] === 'number'
                    && typeof properties.trendlineDashArray[1] === 'number'
                   ) {
                    var dasharray = properties.trendlineDashArray;
                
                } else if (   RGraph.SVG.isArray(properties.trendlineDashArray)
                           && RGraph.SVG.isArray(properties.trendlineDashArray[opt.dataset])) {
                    var dasharray = properties.trendlineDashArray[opt.dataset];
                }
            }





            //
            // Store the coordinates of the trendline
            //
            this.coordsTrendline[opt.dataset] = [
                [Math.max(coords[0][0], this.coords2[opt.dataset][0][0] - margin), coords[0][1]],
                [Math.min(coords[1][0], this.coords2[opt.dataset][this.coords2[opt.dataset].length - 1][0] + margin), coords[1][1]]
            ];


            //
            // Draw the line
            //
            var line = RGraph.SVG.create({
                svg: obj.svg,
                parent: obj.svgAllGroup,
                type: 'line',
                attr: {
                    x1: this.coordsTrendline[opt.dataset][0][0],//Math.max(coords[0][0], this.coords2[opt.dataset][0][0] - margin),
                    y1: this.coordsTrendline[opt.dataset][0][1],//coords[0][1],
                    x2: this.coordsTrendline[opt.dataset][1][0],//Math.min(coords[1][0], this.coords2[opt.dataset][this.coords2[opt.dataset].length - 1][0] + margin),
                    y2: this.coordsTrendline[opt.dataset][1][1],//coords[1][1],

                    fill: 'rgba(0,0,0,0)',
                    stroke: color,
                    'stroke-width': linewidth,
                    'stroke-dasharray': dasharray ? dasharray : '',
                    
                    'class': 'rgraph_line_{1}_trendline_{2}'.format(
                        this.id,
                        opt.dataset
                    ),
                    'clip-path': clip ? 'url(#trendline-clip)' : ''
                }
            });

            // Get a reference to the background gride <path> node
            var els  = this.svg.getElementsByClassName('rgraph_background_grid'),
                grid = els[0];

            // Remove the trendline from the DOM
            obj.svgAllGroup.removeChild(line);
            
            // Now re-add it immedately after the background grid
            grid.insertAdjacentElement('afterend', line);
        };








        //
        // This is the code the adds lines across null gaps in the
        // Line chart
        //
        // @param number datasetIdx The index of the dataset
        // @param array  data       The dataset
        //    
        this.nullBridge = function (datasetIdx, data)
        {
            var readData = false;

            //
            // Now add the connecting lines
            //
            for (var i=0; i<data.length; i++) {

                var isNull   = false,
                    start    = null,
                    end      = null;

                // This ensures that the first datapoint is not null
                if (readData === false && RGraph.SVG.isNumber(data[i])) {
                    readData = true;
                }

                if (RGraph.SVG.isNullish(data[i]) && readData) {
                    
                    start = i - 1;

                    for (var j=(i+1); j<data.length; ++j) {

                        if (RGraph.SVG.isNullish(data[j])) {
                            continue;
                        } else {
                            end = j;
                        }

                        // No idea why this if() condition is necessary but it
                        // prevents an error occurring when the coordinate is
                        // null
                        if (this.coords2[datasetIdx][start][1]) {
                            var path = 'M{1} {2} L{3} {4}'.format(
                                this.coords2[datasetIdx][start][0], this.coords2[datasetIdx][start][1],
                                this.coords2[datasetIdx][end][0], this.coords2[datasetIdx][end][1],
                            );
                        }

                        // Create the path and add it to the SVG document
                        var node = RGraph.SVG.create({
                            svg: this.svg,
                            parent: this.svgAllGroup,
                            type: 'path',
                            attr: {
                                d: path,
                                stroke: typeof properties.nullBridgeColors === 'string'
                                            ? properties.nullBridgeColors
                                            : ((typeof properties.nullBridgeColors === 'object' && !RGraph.SVG.isNullish(properties.nullBridgeColors) && properties.nullBridgeColors[datasetIdx]) ? properties.nullBridgeColors[datasetIdx] : properties.colors[datasetIdx]),
                                'fill': 'transparent',
                                'stroke-dasharray': properties.nullBridgeDashArray ? properties.nullBridgeDashArray : '',
                                'stroke-width':  typeof properties.nullBridgeLinewidth === 'number' ? properties.nullBridgeLinewidth : properties.linewidth,
                                'stroke-linecap': this.getLinecap({index: i}),
                                'stroke-linejoin': this.getLinejoin({index: i}),
                                'clip-path': this.isTrace ? 'url(#trace-effect-clip)' : ''
                            }
                        });



                        start = null;
                        end   = null;
                        
                        break;
                    }
                }
            }
        };








        //
        // Add the dataset tooltip event listener
        //
        this.addDatasetTooltip = function ()
        {
            if (this.properties.spline) {
                var coords = this.coordsSpline;
             } else {
                var coords = this.coords2;
             }

            for (let i=0; i<coords.length; ++i) {







                // Create the path that is placed on
                // top of the line that facilitates
                // the click
                //
                var path = RGraph.SVG.create.pathString(coords[i]);









                //
                // If the line chart is filled then create
                // an extra path that goes back over the
                // previous line in reverse. When doing
                // this for dataset 0 then there is no
                // previous dataset so just go back to the
                // right using the X axis coordinates
                //
                if (
                    (properties.filled && properties.filledAccumulative && i === 0)
                    ||
                    (properties.filled && !properties.filledAccumulative)
                    ) {
                    path += 'L {1} {2}'.format(
                        this.width - properties.marginRight - properties.marginInner,
                        this.height - properties.marginBottom
                    );
                    path += 'L {1} {2}'.format(
                        properties.marginLeft + properties.marginInner,
                        this.height - properties.marginBottom
                    );




                // Chart is filled, but this is not the
                // first dataset. So go back over the
                // previous dataset coordinates to get get
                // to the LHS
                } else if (properties.filled && properties.filledAccumulative && i > 0) {
                    var previous_dataset = coords[i-1];
                    path += RGraph.SVG.create.pathString(previous_dataset.toReversed(), 'L');
                }















                // Create the line the goes over the line as a
                // cover
                var node = RGraph.SVG.create({
                    svg: this.svg,
                    type: 'path',
                    parent: this.svgAllGroup,
                    attr: {
                        fill: properties.filled ? '#0000' : 'none',
                        d: path,
                        stroke: '#0000',
                        'stroke-width': properties.filled ? 0 : Math.max(5, properties.linewidth),
                        'stroke-linecap':'round'
                    },
                    style: {
                        cursor: 'pointer'
                    }
                });

                //
                // Now add the dataset event listener that causes
                // the dataset toolotip to be shown
                //
                var obj = this;
                (function (dataset)
                {
                    node.addEventListener(properties.tooltipsEvent, function (e)
                    {
                        if (RGraph.SVG.REG.get('tooltip') &&
                            RGraph.SVG.REG.get('tooltip').__dataset__ === dataset &&
                            RGraph.SVG.REG.get('tooltip').__object__.uid === obj.uid) { // Added on the 27th/6/2019
                            return;
                        }
                
                        // Lose any previous highlighting
                        var previous_highlight = RGraph.SVG.REG.get('tooltip-dataset-highlight');
                        if (previous_highlight) {
                            previous_highlight.setAttribute(obj.properties.filled ? 'fill' : 'stroke', 'transparent');
                            RGraph.SVG.REG.set('tooltip-dataset-highlight', null);
                        }

                        //
                        // Calculate a sequential index to give
                        // the tooltip
                        //
                        var seq = 0;
                        for (let i=0; i<dataset; ++i) {
                            seq += obj.coords2[i].length;
                        }
                        
                        seq += (obj.coords2[dataset].length / 2);
                
                
                
                


                        RGraph.SVG.tooltip({
                            object:          obj,
                            index:           Math.round(obj.coords2[dataset].length / 2),
                            dataset:         dataset,
                            sequentialIndex: Math.floor(seq),
                            text:            typeof properties.tooltipsDataset === 'string' ? properties.tooltipsDataset : properties.tooltipsDataset[dataset],
                            event:           e
                        });
                        
                        // Highlight the line
                        //
                        if (properties.filled) {
                            e.target.setAttribute('fill','#fff9');
                        }
                        e.target.setAttribute('stroke','#fff9');

                        RGraph.SVG.REG.set('tooltip-dataset-highlight', e.target);
                
                        RGraph.SVG.runOnce('tooltip-dataset-window-mousedown-event-listener-gfyugyuyugfugfyu', function ()
                        {
                            window.addEventListener('mousedown', function (e)
                            {
                                RGraph.SVG.hideTooltip();
                                
                                if (RGraph.SVG.REG.get('tooltip-dataset-highlight')) {
                                    RGraph.SVG.REG.get('tooltip-dataset-highlight').setAttribute('stroke', 'transparent');
                                    RGraph.SVG.REG.get('tooltip-dataset-highlight').setAttribute('fill', properties.filled ? 'transparent' : 'none');
                                }
                            });
                        });
                
                    }, false);
                })(i);
            }
        };








        //
        // Sets the linecap style
        // Not always very noticeable, but these do have an effect
        // with thick lines
        //
        // butt square round
        //
        this.getLinecap = function (opt)
        {
            if (typeof properties.linecap === 'object' && typeof properties.linecap[opt.index] === 'string') {
                return properties.linecap[opt.index];
            
            } else if ( typeof properties.linecap === 'string' ) {
                return properties.linecap;
            
            } else {
                return 'round';
            }
        };








        //
        // Sets the linejoin style
        //
        // round miter bevel
        //
        this.getLinejoin = function (opt)
        {
            if (typeof properties.linejoin === 'object' && typeof properties.linejoin[opt.index] === 'string') {
                return properties.linejoin[opt.index];
            } else if ( typeof properties.linejoin === 'string' ) {
                return properties.linejoin;
            } else {
                return 'round';
            }
        };








        //
        // This function handles clipping to scale values. Because
        // each chart handles scales differently, a worker function
        // is needed instead of it all being done centrally.
        //
        // @param object clipPath The <clipPath> node
        //
        this.clipToScaleWorker = function (clipPath)
        {
            // The Regular expression is actually done by the
            // calling RGraph.clipTo.start() function  in the core
            // library
            if (RegExp.$1 === 'min') from = this.min; else from = Number(RegExp.$1);
            if (RegExp.$2 === 'max') to   = this.max; else to   = Number(RegExp.$2);

            var width  = this.width,
                y1     = this.getYCoord(from),
                y2     = this.getYCoord(to),
                height = Math.abs(y2 - y1),
                x      = 0,
                y      = Math.min(y1, y2);


            // Increase the height if the maximum value is "max"
            if (RegExp.$2 === 'max') {
                y = 0;
                height += this.properties.marginTop;
            }
        
            // Increase the height if the minimum value is "min"
            if (RegExp.$1 === 'min') {
                height += this.properties.marginBottom;
            }


            RGraph.SVG.create({
                svg:    this.svg,
                type:   'rect',
                parent: clipPath,
                attr: {
                    x:      x,
                    y:      y,
                    width:  width,
                    height: height
                }
            });
            
            // Now set the clip-path attribute on the first
            // Line charts all-elements group
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
    };








    //
    // This is a "wrapper" function that creaters a dual-color
    // trendline Line chart for you. Options to give to
    // the frunction are (the sole argument is an object):
    //
    //   id:            The id of the canvas tag
    //   data:          The data for the chart
    //   options:       The chart options that get applied to
    //                  both Line charts (the one above
    //                  and also the one below the trendline.)
    //   optionsTop:    With this option you can specify
    //                  configuration values that are specific to
    //                  the top chart (eg color)
    //   optionsBottom: With this option you can specify
    //                  configuration values that are specific to
    //                  the bottom chart (eg color)
    //
    RGraph.SVG.Line.dualColorTrendline = function (args)
    {
        // Check that a trendline is enabled
        if(!args.options.trendline) {
            alert('[ALERT] A trendline is not enabled in your charts configuration');
            return;
        }

        //
        // Draw the red part of the Scatter chart (the bottom
        // half)
        //
        var obj1 = new RGraph.SVG.Line({
            id: args.id,
            data: RGraph.SVG.arrayClone(args.data, true),
            options: RGraph.SVG.arrayClone(args.options, true)
        }).draw();
        
        
        
        // The coordinates of the first (and only) trendline
        var coords = obj1.coordsTrendline[0];



        //
        // Calculate the coordinates for the top part of the chart
        // (above the trendline)
        //
        var coords_top = [
            [0,coords[0][1]],
            ...coords,
            [obj1.width,coords[1][1]],
            [obj1.width, 0],
            [0,0]
        ];


        //
        // Calculate the coordinates for the bottom part of the chart
        // (below the trendline)
        //
        var coords_bottom = [
            [0,coords[0][1]],
            ...coords,
            [obj1.width,coords[1][1]],
            [obj1.width, obj1.height],
            [0,obj1.height]
        ];

        //
        // Now that we have the coordinates, clipping can be
        // installed on the chart that's already been drawn
        // (the top part of the chart).
        //
        obj1.set('clip', coords_top);
        
        // Set any options that have been specified that are
        // specific to the top Scatter chart
        if (RGraph.SVG.isObject(args.optionsTop)) {
            for (i in args.optionsTop) {
                if (RGraph.SVG.isString(i)) {
                    obj1.set(i, args.optionsTop[i]);
                }
            }
        }



        //
        // Create a new chart that's clipped to the bottom part
        // coordinates.
        //
        var obj2 = new RGraph.SVG.Line({
            id: args.id,
            data: RGraph.SVG.arrayClone(args.data, true),
            options: {
                ...RGraph.SVG.arrayClone(args.options, true),
                clip: coords_bottom // Clip to the part of the canvas
                                    // that's below the trendline
            }
        });

        // Set any options that have been specified that are
        // specific to the bottom Scatter chart
        if (RGraph.SVG.isObject(args.optionsBottom)) {
            for (i in args.optionsBottom) {
                if (RGraph.SVG.isString(i)) {
                    obj2.set(i, args.optionsBottom[i]);
                }
            }
        }

        //
        // Now draw both of the charts using the RGraph.redraw
        // API function
        //
        RGraph.SVG.redraw();
        
        return [obj1, obj2];
    };
    
    
    
    return this;




// End module pattern
})(window, document);