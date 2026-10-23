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
    
    ModalDialog  =
    Modal        = {};
    Modal.notify = {};

    Modal.Open =
    Modal.open =
    Modal.Show =
    Modal.show =
    Modal.Draw =
    Modal.draw = function (conf)
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
            Modal.background                  = document.createElement('DIV');
            Modal.background.id               = 'Modal_background';
            Modal.background.className        = 'Modal_background';
            Modal.background.style.position   = 'fixed';
            Modal.background.style.top        = '-50px';
            Modal.background.style.left       = '-50px';
            Modal.background.style.width      = 'calc(100% + 100px)';
            Modal.background.style.height     = 'calc(100% + 100px)';
            Modal.background.style.backgroundColor = '#cccc';
            Modal.background.style.opacity    = Number(Modal.properties.opacityStart);
            Modal.background.style.transition = Modal.properties.effectShowDuration + "ms opacity ease-out";

            Modal.container.appendChild(Modal.background);



            // If the relevant property is set add an event listener
            // for it.
            if (Modal.properties.hideOnBackground) {
                Modal.background.addEventListener('click', function (e)
                {
                    Modal.hide();
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
            if (typeof Modal.properties.effectDuration === 'number' || (typeof Modal.properties.effectDuration === 'string' && Modal.properties.effectDuration.match(/^[0-9]+$/))) {
                Modal.properties.effectDuration = parseInt(Modal.properties.effectDuration);
            }

            // Create the dialog div
            Modal.dialog = document.createElement('div');

            Modal.dialog.id        = 'Modal_dialog';
            Modal.dialog.className = 'Modal_dialog';

            Modal.dialog.style.borderRadius    = '5px';
            Modal.dialog.style.position        = 'fixed';
            Modal.dialog.style.backgroundColor = 'white';
            Modal.dialog.style.border          = '0';
            Modal.dialog.style.padding         = '5px';
            Modal.dialog.style.opacity         = Number(Modal.properties.opacityStart),
            Modal.dialog.style.transition      = Modal.properties.effectShowDuration + 'ms opacity ease-out, ' + Modal.properties.effectShowDuration + 'ms transform ease-out';
            Modal.dialog.style.transform       = 'scale(' + Modal.properties.zoomFactorStart + ') rotate(' + Modal.properties.rotationStart + ') translate(' + Modal.properties.translateStart + ') skew(' + Modal.properties.skewStart + ')';
            Modal.dialog.style.left            = 0;
            Modal.dialog.style.top             = 0;
            Modal.container.appendChild(Modal.dialog);



            //
            // Add the content DIV that the given content sits inside
            //
            var content = document.createElement('DIV');
                content.id           = 'Modal_content';
                content.className    = 'Modal_content ';
                content.style.width  = '100%';
                content.style.height = '100%';
            Modal.dialog.appendChild(content);

            if (Modal.id.toLowerCase().substring(0, 7) == 'string:') {
                content.innerHTML = Modal.id.substring(7);
            } else {
                content.innerHTML = document.getElementById(Modal.id).innerHTML;
            }















            //
            // Show the dialog
            //
            Modal.dialog.style.visibility = 'visible';
            
            // Fade the dialog in and position it now that the width
            // is known.
            setTimeout(function ()
            {
                // Position the dialog
                //
                var position = Modal.properties.position.trim().toLowerCase().split(/\s+/);

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
                var align   = Modal.properties.align.match(/^\s*(left|center|right)\s*(top|center|bottom)\s*$/);
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
                    hoffset = Modal.dialog.offsetWidth;
                } else if (halign === 'center') {
                    hoffset = Modal.dialog.offsetWidth / 2;
                }


                //
                // Vertical offset
                //
                if (valign === 'top') {
                    voffset = 0;
                } else if (valign === 'bottom') {
                    voffset = Modal.dialog.offsetHeight;
                } else if (valign === 'center') {
                    voffset = Modal.dialog.offsetHeight / 2;
                }

                Modal.dialog.style.left = 'calc(' + x + xUnits + ' - ' + hoffset + 'px)'
                Modal.dialog.style.top = 'calc(' + y + yUnits + ' - ' + voffset + 'px)'



                Modal.dialog.style.transform   = '';
                Modal.dialog.style.opacity     = 1;
                Modal.background.style.opacity = 1;
            }, 15);
        };








        ///////////////////////////////////////////
        // THE ACTUAL CODE THAT RUNS STARTS HERE //
        ///////////////////////////////////////////








        // Some object properties
        Modal.id              = conf.id;
        Modal.uid             = Modal.random(Date.now(), 9999999999999);
        Modal.dialog          = null;
        Modal.background      = null;
        Modal.eventListeners  = [];
        
        Modal.properties = {
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
        Modal.properties_lowercase_map = [];
        for (var j in Modal.properties) {
            if (typeof j === 'string') {
                Modal.properties_lowercase_map[j.toLowerCase()] = j;
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

            if (Modal.properties_lowercase_map[i.toLowerCase()]) {
                i = Modal.properties_lowercase_map[i.toLowerCase()];
            }

            Modal.properties[i] = value;
        }




        // Create a CONTAINER DIV that the dialog and the background
        // are added to.
        var container = document.createElement('DIV');
            container.id             = 'Modal_container_' + Modal.uid;
            container.className      = 'Modal_container';
            container.style.position = 'relative';
            container.style.zIndex   = Modal.properties.zIndex;
        document.body.appendChild(container);
        
        Modal.container = container;




        drawBackground();
        drawDialog();
        
        //
        // Now add any style that's defined in the style option.
        // Prefix each entry with "div#Modal_container".
        //
        if (Modal.properties.style) {
            for (var i=0; i<Modal.properties.style.length; ++i) {
                Modal.styleElement = Modal.addCss('div#Modal_container_' + Modal.uid + ' ' + Modal.properties.style[i], Modal.styleElement || null);
            }
        }




        // Add an event listener so that the
        // ESC key hides the dialog
        Modal.eventListeners.hideDialogOnKeydown  = function (e)
        {
            if (e.keyCode === 27) {
                Modal.close();
            }
        }
        document.body.addEventListener('keydown', Modal.eventListeners.hideDialogOnKeydown, false);



        //
        // Disable Scrollbars if required
        //            
        // First - Determine the scrollbar width
        //
        if (!Modal.properties.pageScroll) {
            var scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
            
            if (!Modal.originalCSS) {
                Modal.originalCSS = {};
            };

            Modal.originalCSS.paddingRight = document.body.style.paddingRight;
            Modal.originalCSS.overflow     = document.body.style.overflow;

            document.body.style.overflow     = 'hidden';
            document.body.style.paddingRight = scrollbarWidth + 'px';
        }




        //
        // Call the onmodal event if it has been added.
        //
        if (typeof Modal.onmodal === 'function') {
            Modal.onmodal();
        }
    };








    //
    // Close the Modal
    //
    Modal.Hide  =
    Modal.hide  =
    Modal.Close =
    Modal.close = function ()
    {
        // Hide the background
        if (Modal.background) {
            Modal.background.style.transition = Modal.properties.effectHideDuration + "ms opacity ease-out";
            Modal.background.style.opacity    = Number(Modal.properties.opacityEnd);
        }

        // Hide the dialog
        if (Modal.dialog) {
            Modal.dialog.style.transition = Modal.properties.effectHideDuration + "ms opacity ease-out, " + Modal.properties.effectHideDuration + 'ms transform ease-out';
            Modal.dialog.style.opacity    = Number(Modal.properties.opacityEnd);
            Modal.dialog.style.transform  = 'scale(' + Modal.properties.zoomFactorEnd + ') rotate(' + Modal.properties.rotationEnd + ') translate(' + Modal.properties.translateEnd + ') skew(' + Modal.properties.skewEnd + ')'
        }

        // Remove the style element from the DOM if it exists
        setTimeout(function ()
        {
            if (Modal.styleElement && Modal.styleElement.parentNode) {
                Modal.styleElement.parentNode.removeChild(Modal.styleElement);
            }
        }, Modal.properties.effectHideDuration);
        
        // Enable the documents scrollbars after a short delay to
        // allow the dialog to be hidden.
        if (Modal.originalCSS) {
            setTimeout(function ()
            {
                document.body.style.overflow     = Modal.originalCSS.overflow;
                document.body.style.paddingRight = Modal.originalCSS.paddingRight;
            }, Modal.properties.effectHideDuration);
        }

        
        // Remove the container node from the DOM
        // after they've had time to fadeout.
        setTimeout(function ()
        {
            // Remove the container from the DOM thereby removing
            // both the background and the dialog too.
            if (Modal.container.parentNode) {
                Modal.container.parentNode.removeChild(Modal.container);
            }
            
            // Remove the event listener
            if (Modal.confirm.keyDownListener) {
                document.body.removeEventListener('keydown', Modal.confirm.keyDownListener)
                Modal.confirm.keyDownListener = null;
            }

        }, Modal.properties.effectHideDuration);
    };








    //
    // This function hows a modal dialog confirmation box
    //
    // @param properties object Various options to the object. See the
    //                          page: http://www.rgraph.net/canvas/integration.html
    //                          for more information.
    //
    Modal.confirm = function (properties)
    {
        // First things first - reset the properties back to the
        // original.
        if (!Modal.originalOptions) {
            Modal.originalProperties = Modal.arrayClone(Modal.properties, true);
        } else {
            Modal.properties = Modal.arrayClone(Modal.originalProperties, true)
        }

        // Some default values
        if (!properties.callbacks) properties.callbacks = {};
        if (!properties.buttons)   properties.buttons   = {ok: 'OK',cancel: 'Cancel'};
        
        // Default values for the buttons - they may not have
        // been given.
        properties.buttons.ok     ??= 'OK';
        properties.buttons.cancel ??= 'Cancel';


        Modal.show({
            id: 'string:<div style="font-family: sans-serif;">' + (properties.header ? properties.header : '') + properties.text + '<div style="text-align: right; margin-top: 10px"><button class="cancel" type="button" style="cursor: pointer" id="rgraph-modal-cancel-button" onclick="event.preventDefault(); Modal.cancelConfirmationModal()">' + properties.buttons.cancel + '</button>&nbsp;<button type="button" class="ok" style="cursor: pointer" id="rgraph-modal-ok-button"  onclick="event.preventDefault(); Modal.confirmConfirmationModal()">' + properties.buttons.ok + '</button></div>' + (properties.footer ? properties.footer : '') + '</div>',
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
        var okButton = document.getElementById('rgraph-modal-ok-button');
        
        if (okButton) {
            okButton.focus();
        }




        //
        // This function runs when the OK button on the dialog
        // is pressed.
        //
        Modal.confirmConfirmationModal = function ()
        {
            if (typeof properties.callbacks.ok === 'function') {
                (properties.callbacks.ok)(Modal.dialog);
            }

            // Get rid of the dialog
            Modal.hide();
        };




        //
        // This function runs when the dialog is cancelled
        //
        Modal.cancelConfirmationModal = function ()
        {
            if (typeof properties.callbacks.cancel === 'function') {
                (properties.callbacks.cancel)(Modal.dialog);
            }
            
            // Get rid of the dialog
            Modal.hide();
        };



        // If the Esc key is pressed then do this as well as
        // hiding the dialog.
        document.body.addEventListener('keydown', Modal.confirm.keyDownListener = function (e)
        {
            if (e.keyCode === 13) {
                Modal.confirmConfirmationModal();
                e.stopPropagation();
                e.preventDefault();
                
            } else if (e.keyCode === 27) {
                Modal.cancelConfirmationModal();
                e.stopPropagation();
                e.preventDefault();
            }
        }, false);
    };








    //
    // This function hows a modal dialog success dialog
    //
    Modal.notify.success = function (properties)
    {
        if (typeof properties === 'string') {
            properties = {text: properties};
        }

        Modal.confirm({
            text: '<div style="display: flex; align-items: center"><svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><path d="M32,2C15.431,2,2,15.432,2,32c0,16.568,13.432,30,30,30c16.568,0,30-13.432,30-30C62,15.432,48.568,2,32,2z M25.025,50 l-0.02-0.02L24.988,50L11,35.6l7.029-7.164l6.977,7.184l21-21.619L53,21.199L25.025,50z" fill="#43a047"/></svg>&nbsp;<span style="color: #43a047; font-weight: bold; font-size: 18pt">Success</span></div>'
                    + properties.text,
            dialog: {
                style: [
                    ', button {font-size: 20pt;}',
                    'button#rgraph-modal-success-button {font-size: 20pt;}',
                    'button#rgraph-modal-cancel-button {display: none;}'
                ],
                ...properties.dialog
            }
        });
    };








    //
    // This function hows a modal dialog warning dialog
    //
    Modal.notify.warning = function (properties)
    {
        if (typeof properties === 'string') {
            properties = {text: properties};
        }

        Modal.confirm({
            text: '<div style="display: flex; align-items: center"><svg width="32" height="32"  xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><path d="m32 2c-16.568 0-30 13.432-30 30s13.432 30 30 30 30-13.432 30-30-13.432-30-30-30m5 49.75h-10v-24h10v24m-5-29.5c-2.761 0-5-2.238-5-5s2.239-5 5-5c2.762 0 5 2.238 5 5s-2.238 5-5 5" fill="#D8C401" style="transform-origin: 50% 50%; transform: rotate(180deg)"/></svg>&nbsp;<span style="color: #d8c401; font-weight: bold; font-size: 18pt">Warning</span></div>'
                    + properties.text,
            dialog: {
                style: [
                    ', button {font-size: 20pt;}',
                    'button#rgraph-modal-success-button {font-size: 20pt;}',
                    'button#rgraph-modal-cancel-button {display: none;}'
                ],
                ...properties.dialog
            }
        });
    };








    //
    // This function hows a modal dialog information dialog
    //
    Modal.notify.info =
    Modal.notify.information = function (properties)
    {
        if (typeof properties === 'string') {
            properties = {text: properties};
        }

        Modal.confirm({
            text: '<div style="display: flex; align-items: center"><svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><path d="m32 2c-16.568 0-30 13.432-30 30s13.432 30 30 30 30-13.432 30-30-13.432-30-30-30m5 49.75h-10v-24h10v24m-5-29.5c-2.761 0-5-2.238-5-5s2.239-5 5-5c2.762 0 5 2.238 5 5s-2.238 5-5 5" fill="#6666ff"/></svg>&nbsp;<span style="color: #6666ff; font-weight: bold; font-size: 18pt">Information</span></div>'
                    + properties.text,
            dialog: {
                style: [
                    ', button {font-size: 20pt;}',
                    'button#rgraph-modal-success-button {font-size: 20pt;}',
                    'button#rgraph-modal-cancel-button {display: none;}'
                ],
                ...properties.dialog
            }
        });
    };








    //
    // This function hows a modal dialog error dialog
    //
    Modal.notify.error = function (properties)
    {
        if (typeof properties === 'string') {
            properties = {text: properties};
        }

        Modal.confirm({
            text: '<div style="display: flex; align-items: center"><svg width="32" height="32" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" enable-background="new 0 0 64 64"><circle cx="32" cy="32" r="30" fill="#fff"/><path d="m32 2c-16.568 0-30 13.432-30 30s13.432 30 30 30 30-13.432 30-30-13.432-30-30-30m5.513 44.508l-5.514-9.894-5.825 9.894h-7.048l9.331-14.783-8.878-14.232h7.244l5.175 9.449 5.317-9.449h7.008l-8.878 13.996 9.429 15.02h-7.361z" fill="#ff0000"/></svg>&nbsp;<span style="color: #f00; font-weight: bold; font-size: 18pt">Error</span></div>'
                    + properties.text,
                
                dialog: {
                style: [
                    '{min-width: 300px;}',
                    ', button {font-size: 20pt;}',
                    'button#rgraph-modal-success-button {font-size: 20pt;}',
                    'button#rgraph-modal-cancel-button {display: none;}'
                ],
                ...properties.dialog
            }
        });
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
    Modal.addCss = function (style, styleElement = null, parent = null)
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
    Modal.arrayClone = function (array, objects = false, maxdepth = 5)
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

                        ret[i] = Modal.arrayClone(array[i], objects, maxdepth - 1);
                    }
                } else if (array.constructor.toString().indexOf('Object') > 0 && objects) {
                    ret = new Object();
                    for (var i in array) {
                        ret[i] = Modal.arrayClone(array[i], true, maxdepth - 1);
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
    Modal.isArray = function (value)
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
    Modal.random = function (min, max, decimals = 0)
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