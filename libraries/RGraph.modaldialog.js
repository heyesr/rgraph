    // o---------------------------------------------------------------------------o
    // | This file is part of the RGraph package - you can learn more at:          |
    // |                                                                           |
    // |                           https://www.rgraph.net                          |
    // |                                                                           |
    // | RGraph is dual-licensed under the Open Source GPL license. This means     |
    // | that it's free to use for any purpose. The GPL license does have          |
    // | consequences on the license of the software that you include it in,       |
    // | however. If this is not desirable, then there's an inexpensive commercial |
    // | license option available. See the RGraph website for more details.        |
    // o---------------------------------------------------------------------------o
    
    ModalDialog = {};

    ModalDialog.Open =
    ModalDialog.open =
    ModalDialog.Show =
    ModalDialog.show =
    ModalDialog.Draw =
    ModalDialog.draw = function (conf)
    {
        //
        // First, some functions that draw the dialog and its
        // background.
        //

        //
        // Draws the background
        //
        var drawBackground = function ()
        {
            // Create the background
            ModalDialog.background                  = document.createElement('DIV');
            ModalDialog.background.id               = 'ModalDialog_background';
            ModalDialog.background.className        = 'ModalDialog_background';
            ModalDialog.background.style.position   = 'fixed';
            ModalDialog.background.style.top        = '-50px';
            ModalDialog.background.style.left       = '-50px';
            ModalDialog.background.style.width      = 'calc(100% + 100px)';
            ModalDialog.background.style.height     = 'calc(100% + 100px)';
            ModalDialog.background.style.backgroundColor = '#cccc';
            ModalDialog.background.style.opacity    = Number(ModalDialog.properties.opacityStart);
            ModalDialog.background.style.transition = ModalDialog.properties.effectShowDuration + "ms opacity ease-out";

            ModalDialog.container.appendChild(ModalDialog.background);



            // If the relevant property is set add an event listener
            // for it.
            if (ModalDialog.properties.hideOnBackground) {
                ModalDialog.background.addEventListener('click', function (e)
                {
                    ModalDialog.hide();
                }, false);
            }
        };
    
    
    
    
    
    
    
    
        //
        // Draws the dialog
        //
        var drawDialog = function ()
        {
            // Allow the number to be be both a string or a number.
            // If its a number then treat as milliseconds
            if (typeof ModalDialog.properties.effectDuration === 'number' || (typeof ModalDialog.properties.effectDuration === 'string' && ModalDialog.properties.effectDuration.match(/^[0-9]+$/))) {
                ModalDialog.properties.effectDuration = parseInt(ModalDialog.properties.effectDuration);
            }

            // Create the dialog div
            ModalDialog.dialog = document.createElement('div');

            ModalDialog.dialog.id        = 'ModalDialog_dialog';
            ModalDialog.dialog.className = 'ModalDialog_dialog';

            ModalDialog.dialog.style.borderRadius    = '5px';
            ModalDialog.dialog.style.position        = 'fixed';
            ModalDialog.dialog.style.backgroundColor = 'white';
            ModalDialog.dialog.style.border          = '0';
            ModalDialog.dialog.style.padding         = '5px';
            ModalDialog.dialog.style.opacity         = Number(ModalDialog.properties.opacityStart),
            ModalDialog.dialog.style.transition      = ModalDialog.properties.effectShowDuration + 'ms opacity ease-out, ' + ModalDialog.properties.effectShowDuration + 'ms transform ease-out';
            ModalDialog.dialog.style.transform       = 'scale(' + ModalDialog.properties.zoomFactorStart + ') rotate(' + ModalDialog.properties.rotationStart + ') translate(' + ModalDialog.properties.translateStart + ') skew(' + ModalDialog.properties.skewStart + ')';
            ModalDialog.dialog.style.left            = 0;
            ModalDialog.dialog.style.top             = 0;
            ModalDialog.container.appendChild(ModalDialog.dialog);



            //
            // Add the content DIV that the given content sits inside
            //
            var content = document.createElement('DIV');
                content.id           = 'ModalDialog_content';
                content.className    = 'ModalDialog_content ';
                content.style.width  = '100%';
                content.style.height = '100%';
            ModalDialog.dialog.appendChild(content);

            if (ModalDialog.id.toLowerCase().substring(0, 7) == 'string:') {
                content.innerHTML = ModalDialog.id.substring(7);
            } else {
                content.innerHTML = document.getElementById(ModalDialog.id).innerHTML;
            }















            //
            // Show the dialog
            //
            ModalDialog.dialog.style.visibility = 'visible';
            
            // Fade the dialog in and position it now that the width
            // is known.
            setTimeout(function ()
            {
                // Position the dialog
                //
                var position = ModalDialog.properties.position.trim().toLowerCase().split(/\s+/);

                //
                // Determine the X position.
                //
                var xUnits = '%';
                if (position[0].trim() === 'left') {
                    var x = 25;
                } else if (position[0].trim() === 'right') {
                    var x = 75;
                } else if (position[0].trim() === 'center') {
                    var x = 50;
                } else if (position[0].trim().match(/^([.0-9]+)%?$/)) {
                    var x = parseFloat(RegExp.$1);
                } else if (position[0].trim().match(/^([-.0-9]+)px$/)) {
                    xUnits = 'px';
                    var x = parseFloat(RegExp.$1);
                }

                //
                // Determine the Y position
                //
                var yUnits = '%';
                if (position[1].trim() === 'top') {
                    var y = 25;
                } else if (position[1].trim() === 'bottom') {
                    var y = 75;
                } else if (position[1].trim() === 'center') {
                    var y = 50;
                } else if (position[1].trim().match(/^([.0-9]+)%?$/)) {
                    var y = parseFloat(RegExp.$1);
                } else if (position[1].trim().match(/^([-.0-9]+)px$/)) {
                    yUnits = 'px';
                    var y = parseFloat(RegExp.$1);
                }

                //
                // Calculate the horizontal off set because of
                // horizontal allignment.
                //
                var align   = ModalDialog.properties.align.match(/^\s*(left|center|right)\s*(top|center|bottom)\s*$/);
                var halign  = RegExp.$1;
                var valign  = RegExp.$2;
                var hoffset = 0;
                var voffset = 0;
        
                //
                // Horizontal offset
                //
                if (halign === 'left') {
                    hoffset = 0;
                } else if (halign === 'right') {
                    hoffset = ModalDialog.dialog.offsetWidth;
                } else if (halign === 'center') {
                    hoffset = ModalDialog.dialog.offsetWidth / 2;
                }


                //
                // Vertical offset
                //
                if (valign === 'top') {
                    voffset = 0;
                } else if (valign === 'bottom') {
                    voffset = ModalDialog.dialog.offsetHeight;
                } else if (valign === 'center') {
                    voffset = ModalDialog.dialog.offsetHeight / 2;
                }

                ModalDialog.dialog.style.left = 'calc(' + x + xUnits + ' - ' + hoffset + 'px)'
                ModalDialog.dialog.style.top = 'calc(' + y + yUnits + ' - ' + voffset + 'px)'



                ModalDialog.dialog.style.transform   = '';
                ModalDialog.dialog.style.opacity     = 1;
                ModalDialog.background.style.opacity = 1;
            }, 15);
        };








        ///////////////////////////////////////////
        // THE ACTUAL CODE THAT RUNS STARTS HERE //
        ///////////////////////////////////////////








        // Some object properties
        ModalDialog.id              = conf.id;
        ModalDialog.uid             = ModalDialog.random(Date.now(), 9999999999999);
        ModalDialog.dialog          = null;
        ModalDialog.background      = null;
        ModalDialog.eventListeners  = [];
        
        ModalDialog.properties = {
            zoomFactorEnd:         0,
            zoomFactorStart:       0,
            hideOnBackground:      true,
            pageScroll:            false,
            rotationStart:         '45deg',
            rotationEnd:           '45deg',
            translateStart:        '0px, 0px',
            translateEnd:          '0px, 0px',
            skewStart:             '0deg, 0deg',
            skewEnd:               '0deg, 0deg',
            opacityStart:          0,
            opacityEnd:            0,
            position:              'center center',
            align:                 'center center',
            style:                 [],
            effectShowDuration:    500,
            effectHideDuration:    500,
            zIndex:                10000
        };



        
        // Copy the given config on to the properties object
        if (conf.options) {
            conf.properties = conf.options;
        }




        //
        // Add the reverse look-up table  for property names
        // so that property names can be specified in any case.
        //
        ModalDialog.properties_lowercase_map = [];
        for (var j in ModalDialog.properties) {
            if (typeof j === 'string') {
                ModalDialog.properties_lowercase_map[j.toLowerCase()] = j;
            }
        }



        for (i in conf.properties) {
        
            var value = conf.properties[i];

            //
            // Allow the translate properties to be with or without units
            //
            if (i === 'translateStart' || i === 'translateEnd') {
                value = String(value);
                value.match(/^\s*([-.0-9]+)\s*(?:px)?(?:[, ]+([-.0-9]+)\s*(?:px)?)?\s*$/)
                value = RegExp.$1 + 'px, ' + Number(RegExp.$2 || 0) + 'px';
            }
        
            //
            // Allow the skew properties to be with or without units
            //
            if (i === 'skewStart' || i === 'skewEnd') {
                value = String(value);
                value.match(/^\s*([-.0-9]+)\s*(deg|rad)?(?:[, ]+([-.0-9]+)\s*(deg|rad)?)?\s*$/)
                value = RegExp.$1 + (RegExp.$2 || 'deg') + ', ' + Number(RegExp.$3 || 0) + (RegExp.$4 || 'deg');
            }
        
            //
            // Allow the skew properties to be with or without units
            //
            if (i === 'rotationStart' || i === 'rotationEnd') {
                value = String(value);
                value.match(/^\s*([-.0-9]+)\s*(deg|rad)?\s*$/)
                value = RegExp.$1 + (RegExp.$2 || 'deg');
            }

            if (ModalDialog.properties_lowercase_map[i.toLowerCase()]) {
                i = ModalDialog.properties_lowercase_map[i.toLowerCase()];
            }

            ModalDialog.properties[i] = value;
        }




        // Create a CONTAINER DIV that the dialog and the background
        // are added to.
        var container = document.createElement('DIV');
            container.id             = 'ModalDialog_container_' + ModalDialog.uid;
            container.className      = 'ModalDialog_container';
            container.style.position = 'relative';
            container.style.zIndex   = ModalDialog.properties.zIndex;
        document.body.appendChild(container);
        
        ModalDialog.container = container;




        drawBackground();
        drawDialog();
        
        //
        // Now add any style that's defined in the style option.
        // Prefix each entry with "div#ModalDialog_container".
        //
        if (ModalDialog.properties.style) {
            for (var i=0; i<ModalDialog.properties.style.length; ++i) {
                ModalDialog.styleElement = ModalDialog.addCss('div#ModalDialog_container_' + ModalDialog.uid + ' ' + ModalDialog.properties.style[i], ModalDialog.styleElement || null);
            }
        }




        // Add an event listener so that the
        // ESC key hides the dialog
        ModalDialog.eventListeners.hideDialogOnKeydown  = function (e)
        {
            if (e.keyCode === 27) {
                ModalDialog.close();
            }
        }
        document.body.addEventListener('keydown', ModalDialog.eventListeners.hideDialogOnKeydown, false);



        //
        // Disable Scrollbars if required
        //            
        // First - Determine the scrollbar width
        //
        if (!ModalDialog.properties.pageScroll) {
            var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            if (!ModalDialog.originalCSS) {
                ModalDialog.originalCSS = {};
            };

            ModalDialog.originalCSS.paddingRight = document.body.style.paddingRight;
            ModalDialog.originalCSS.overflow     = document.body.style.overflow;

            document.body.style.overflow     = 'hidden';
            document.body.style.paddingRight = scrollbarWidth + 'px';
        }




        //
        // Call the onmodaldialog event if it has been added.
        //
        if (typeof ModalDialog.onmodaldialog === 'function') {
            ModalDialog.onmodaldialog();
        }
    };








    //
    // Close the ModalDialog
    //
    ModalDialog.Hide  =
    ModalDialog.hide  =
    ModalDialog.Close =
    ModalDialog.close = function ()
    {
        // Hide the background
        if (ModalDialog.background) {
            ModalDialog.background.style.transition = ModalDialog.properties.effectHideDuration + "ms opacity ease-out";
            ModalDialog.background.style.opacity    = Number(ModalDialog.properties.opacityEnd);
        }

        // Hide the dialog
        if (ModalDialog.dialog) {
            ModalDialog.dialog.style.transition = ModalDialog.properties.effectHideDuration + "ms opacity ease-out, " + ModalDialog.properties.effectHideDuration + 'ms transform ease-out';
            ModalDialog.dialog.style.opacity    = Number(ModalDialog.properties.opacityEnd);
            ModalDialog.dialog.style.transform  = 'scale(' + ModalDialog.properties.zoomFactorEnd + ') rotate(' + ModalDialog.properties.rotationEnd + ') translate(' + ModalDialog.properties.translateEnd + ') skew(' + ModalDialog.properties.skewEnd + ')'
        }

        // Remove the style element from the DOM if it exists
        setTimeout(function ()
        {
            if (ModalDialog.styleElement && ModalDialog.styleElement.parentNode) {
                ModalDialog.styleElement.parentNode.removeChild(ModalDialog.styleElement);
            }
        }, ModalDialog.properties.effectHideDuration);
        
        // Enable the documents scrollbars after a short delay to
        // allow the dialog to be hidden.
        if (ModalDialog.originalCSS) {
            setTimeout(function ()
            {
                document.body.style.overflow     = ModalDialog.originalCSS.overflow;
                document.body.style.paddingRight = ModalDialog.originalCSS.paddingRight;
            }, ModalDialog.properties.effectHideDuration);
        }

        
        // Remove the container node from the DOM
        // after they've had time to fadeout.
        setTimeout(function ()
        {
            // Remove the container from the DOM thereby removing
            // both the background and the dialog too.
            if (ModalDialog.container.parentNode) {
                ModalDialog.container.parentNode.removeChild(ModalDialog.container);
            }
            
            // Remove the event listener
            if (ModalDialog.confirm.keyDownListener) {
                document.body.removeEventListener('keydown', ModalDialog.confirm.keyDownListener)
                ModalDialog.confirm.keyDownListener = null;
            }

        }, ModalDialog.properties.effectHideDuration);
    };








    //
    // This function hows a modal dialog confirmation box
    //
    // @param properties object Various options to the object. See the
    //                          page: http://www.rgraph.net/canvas/integration.html
    //                          for more information.
    //
    ModalDialog.confirm = function (properties)
    {
        // First things first - reset the properties back to the
        // original.
        if (!ModalDialog.originalOptions) {
            ModalDialog.originalProperties = ModalDialog.arrayClone(ModalDialog.properties, true);
        } else {
            ModalDialog.properties = ModalDialog.arrayClone(ModalDialog.originalProperties, true)
        }

        // Some default values
        if (!properties.callbacks) properties.callbacks = {};
        if (!properties.buttons)   properties.buttons   = {ok: 'OK',cancel: 'Cancel'};
        
        // Default values for the buttons - they may not have
        // been given.
        properties.buttons.ok     ??= 'OK';
        properties.buttons.cancel ??= 'Cancel';


        ModalDialog.show({
            id: 'string:<div style="font-family: sans-serif;">' + (properties.header ? properties.header : '') + properties.text + '<div style="text-align: right; margin-top: 10px"><button class="cancel" type="button" style="cursor: pointer" id="rgraph-modaldialog-cancel-button" onclick="event.preventDefault(); ModalDialog.cancelConfirmationModalDialog()">' + properties.buttons.cancel + '</button>&nbsp;<button type="button" class="ok" style="cursor: pointer" id="rgraph-modaldialog-ok-button"  onclick="event.preventDefault(); ModalDialog.confirmConfirmationModalDialog()">' + properties.buttons.ok + '</button></div>' + (properties.footer ? properties.footer : '') + '</div>',
            options: {
                rotationStart: 0,
                rotationEnd: 0,
                zoomFactorStart: 1,
                zoomFactorEnd: 1,
                hideOnBackground: false,
                ...properties.dialog
            }
        });
        
        // Make the OK button the default
        var okButton = document.getElementById('rgraph-modaldialog-ok-button');
        
        if (okButton) {
            okButton.focus();
        }




        //
        // This function runs when the OK button on the dialog
        // is pressed.
        //
        ModalDialog.confirmConfirmationModalDialog = function ()
        {
            if (typeof properties.callbacks.ok === 'function') {
                (properties.callbacks.ok)(ModalDialog.dialog);
            }

            // Get rid of the dialog
            ModalDialog.hide();
        };




        //
        // This function runs when the dialog is cancelled
        //
        ModalDialog.cancelConfirmationModalDialog = function ()
        {
            if (typeof properties.callbacks.cancel === 'function') {
                (properties.callbacks.cancel)(ModalDialog.dialog);
            }
            
            // Get rid of the dialog
            ModalDialog.hide();
        };



        // If the Esc key is pressed then do this as well as
        // hiding the dialog.
        document.body.addEventListener('keydown', ModalDialog.confirm.keyDownListener = function (e)
        {
            if (e.keyCode === 13) {
                ModalDialog.confirmConfirmationModalDialog();
                e.stopPropagation();
                e.preventDefault();
                
            } else if (e.keyCode === 27) {
                ModalDialog.cancelConfirmationModalDialog();
                e.stopPropagation();
                e.preventDefault();
            }
        }, false);
    };








    //
    // Adds a style declaration to the document. You give the whole
    // selector/style string and it will add it.
    //
    // If a style element hasn't already been created
    // it will create one and then reuse it on subsequent
    // calls to this function.
    //
    // @param string style        The styles to assign to the
    //                            new CSS. An example:
    //
    //                            table tr td {color: red;}
    //
    // @param object styleElement The style element to which the
    //                            style is attached.
    // @param object parent       If given (default is null),
    //                            this is the node to which the
    //                            style element is attached. If
    //                            not given then the style element
    //                            is added to the <head>.
    //
    ModalDialog.addCss = function (style, styleElement = null, parent = null)
    {
        // Create a style element and add the CSS
        var el = styleElement || document.createElement('style');
            el.insertAdjacentHTML('beforeend', style);

        // Append the style element to the document? Only
        // do this on newly created style elements. You can
        // optionally pass in an element on which to attach
        // the style element instead of the head.
        if (parent) {
            parent.appendChild(el);
        } else {
            document.head.appendChild(el);
        }
        
        return el;
    };








    //
    // An updated clone function that works better.
    //
    // @param array mixed The variable to clone and
    //                    return a copy of. Doesn't
    //                    clone objects.
    // @param objects boolean Whether to clone objects or not,
    //                        default is not to.
    //
    ModalDialog.arrayClone = function (array, objects = false, maxdepth = 5)
    {
        // This is here to limit recurusion
        if (maxdepth < 0) {
            return;
        }

        var ret = null;

        // Account for undefined values.
        if (typeof array === 'undefined') {
            return undefined;
        }

        // Account for null values.
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

                        ret[i] = ModalDialog.arrayClone(array[i], objects, maxdepth - 1);
                    }
                } else if (array.constructor.toString().indexOf('Object') > 0 && objects) {
                    ret = new Object();
                    for (var i in array) {
                        ret[i] = ModalDialog.arrayClone(array[i], true, maxdepth - 1);
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
    // Determines if the given object is an array or not.
    //
    // @param  mixed   value The variable to test.
    // @return boolean       Whether the given value is an array
    //                       or not.
    //
    ModalDialog.isArray = function (value)
    {
        if (value && value.constructor) {
            var pos = value.constructor.toString().indexOf('Array');
        } else {
            return false;
        }

        return value != null &&
               typeof pos === 'number' &&
               pos > 0 &&
               pos < 20;
    };








    //
    // Generates a random number between the minimum and maximum.
    //
    // @param number min The minimum value.
    // @param number max The maximum value.
    // @param number     OPTIONAL Number of decimal places.
    //
    ModalDialog.random = function (min, max, decimals = 0)
    {
        var r = Math.random();
        
        return Number((((max - min) * r) + min).toFixed(decimals));
    };








    //
    // Debug functions
    //
    window.$a = alert;








    //
    // Loosely mimicks the PHP function print_r().
    //
    // @param mixed   obj    The variable you want to see.
    // @param boolean notify Whether to use the alert() function
    //                       to notify you or not. Defaults to
    //                       true.
    // @param string indent  The indent to yse when showing nested
    //                       properties. Defaults to 4 spaces.
    // @param number counter Used internally to control nesting.
    //                       You won't need to give this.
    //
    window.$p = function (obj, notify = true, indent = '    ', counter = 0)
    {
        var str = '';
        
        if (counter >= 3) {
            return 'INDENT TOO MUCH!';
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
                if (RGraph.isNullish(obj)) {
                    str += 'null(ish)';
                } else {
                    str += 'Object {' + '\n'
                    for (var j in obj) {
                        str += indent + '    ' + j + ' => ' + RGraph.pr(obj[j], false, indent + '    ', counter + 1) + '\n';
                    }
                    str += indent + '}';
                }
                break;
            
            
            default:
                str += 'Unknown type: ' + typeof obj + '';
                break;
        }


        //
        // Finished, now either return if we're in a recursed
        // call, or alert() if we're not.
        //
        if (notify) {
            alert(str);
        }
        
        return str;
    };