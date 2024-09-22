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
    
    ModalDialog =
    {
        dialog:     null,
        background: null,
        offset:     50,
        events:     [],
        options:    {
         shrinkOnShow:  true,
         enlargeOnHide: true,
 hideOnBackgroundClick: true,
                topbar: true,
  removeFromDOMTimeout: 500
        },




        //
        // Shows the dialog with the supplied DIV acting as the contents
        // 
        // @param string id    The ID of the DIV to use as the dialogs contents
        // @param int    width The width of the dialog
        //
        Show: function (id, width = null)
        {
            //
            // Accommodate this syntax:
            //
            // ModalDialog.show({
            //                     id: 'myDialog',
            //                  width: 300,
            //          enlargeOnHide: true,
            //           shrinkOnShow: true,
            //                 topbar: true,
            //  hideOnBackgroundClick: true,
            //   removeFromDOMTimeout: 500
            // });
            if (typeof id === 'object') {
                
                for (i in id) {
                    ModalDialog.options[i] = id[i];
                }
                
                width = id.width;
                id    = id.id;
            }

            ModalDialog.id    = id;
            ModalDialog.width = width;
    
            ModalDialog.ShowBackground();
            ModalDialog.ShowDialog();
    
            // Install the event handlers
            window.onresize = ModalDialog.Resize;
            
            // Add an event listener so that the
            // ESC key hides the dialog
            document.body.addEventListener('keydown', function (e)
            {
                if (e.keyCode === 27) {
                    ModalDialog.hide();
                }
            }, false);
    
            
            // Call them initially
            ModalDialog.Resize();
            
            if (typeof ModalDialog.onmodaldialog == 'function') {
                ModalDialog.onmodaldialog();
            }
            ModalDialog.FireCustomEvent('onmodaldialog');
        },








        //
        // A setter
        //
        set: function (name, value)
        {
            ModalDialog.options[name] = value;
        },








        //
        // Shows the background semi-transparent darkened DIV
        //
        ShowBackground: function ()
        {
            // Create the background
            ModalDialog.background = document.createElement('DIV');
            ModalDialog.background.className        = 'ModalDialog_background';
            ModalDialog.background.style.position   = 'fixed';
            ModalDialog.background.style.top        = 0;
            ModalDialog.background.style.left       = 0;
            ModalDialog.background.style.width      = (screen.width + 100) + 'px';
            ModalDialog.background.style.height     = (screen.height + 100) + 'px';
            ModalDialog.background.style.backgroundColor = 'rgb(204,204,204)';        
            ModalDialog.background.style.opacity    = 0;
            ModalDialog.background.style.zIndex     = 3276;
            ModalDialog.background.style.transition = "0.5s opacity ease-out";
                
            document.body.appendChild(ModalDialog.background);
    
            ModalDialog.background.style.visibility = 'visible';
            
            ModalDialog.background.addEventListener('click', function (e)
            {
                if (ModalDialog.options.hideOnBackgroundClick) {
                    ModalDialog.hide();
                }
            }, false);
        },




        //
        // Shows the dialog itself
        //
        ShowDialog: function ()
        {
            // Create the DIV if necessary
            // Jan 2012- Changed so that the dialog is ALWAYS
            // (re)created
            if (!ModalDialog.dialog || true) {
                ModalDialog.dialog = document.createElement('div');
        
                ModalDialog.dialog.id        = 'ModalDialog_dialog';
                ModalDialog.dialog.className = 'ModalDialog_dialog';
    
                var borderRadius = '15px';
    
                ModalDialog.dialog.style.borderRadius       = borderRadius;
                ModalDialog.dialog.style.MozBorderRadius    = borderRadius;
                ModalDialog.dialog.style.WebkitBorderRadius = borderRadius;
    
                ModalDialog.dialog.style.boxShadow    = '3px 3px 3px rgba(96,96,96,0.5)';
                ModalDialog.dialog.style.MozBoxShadow = '3px 3px 3px rgba(96,96,96,0.5)';
                ModalDialog.dialog.style.WebkitBoxShadow = 'rgba(96,96,96,0.5) 3px 3px 3px';
    
                ModalDialog.dialog.style.position        = 'fixed';
                ModalDialog.dialog.style.backgroundColor = 'white';
                ModalDialog.dialog.style.width           = parseInt(ModalDialog.width) + 'px';
                ModalDialog.dialog.style.border          = '2px solid #999';
                ModalDialog.dialog.style.zIndex          = 32767;
                ModalDialog.dialog.style.padding         = '5px';
                ModalDialog.dialog.style.paddingTop      = ModalDialog.options.topbar ? '25px' : '5px'
                ModalDialog.dialog.style.opacity         = 0;
                ModalDialog.dialog.style.transition      = '0.25s opacity ease-out, 0.25s transform ease-out';
                ModalDialog.dialog.style.transform       = 'scale(' + (ModalDialog.options.shrinkOnShow ? '1.5' : '1') + ')';

                if (document.all) {
                    ModalDialog.dialog.style.zIndex = 32767;
                }
    
    
    
                // Accomodate various browsers
                //if (navigator.userAgent.indexOf('Opera') != -1) {
                //    ModalDialog.dialog.style.paddingTop = '25px';
    
                //} else if (navigator.userAgent.indexOf('MSIE') != -1) {
                //    ModalDialog.dialog.style.paddingTop = '25px';
    
                //} else if (navigator.userAgent.indexOf('Safari') != -1) {
                //    ModalDialog.dialog.style.paddingTop = '25px';
                //}
    
                document.body.appendChild(ModalDialog.dialog);









                //
                // Now create the grey bar at the top of the dialog
                // if necessary
                //
                if (ModalDialog.options.topbar) {
                    var bar = document.createElement('div');
                        bar.className = 'ModalDialog_topbar';
                        bar.style.top = 0;
                        bar.style.left = 0;
                        bar.style.width = '100%';//(ModalDialog.dialog.offsetWidth - 4) + 'px';
                        bar.style.height = '20px';
                        bar.style.backgroundColor = '#bbb';
                        bar.style.borderBottom = '2px solid #999';
                        //bar.style.zIndex    = 50000;
                        bar.style.position = 'absolute';
                        var borderRadius = '11px';
                        bar.style.WebkitBorderTopLeftRadius = borderRadius;
                        bar.style.WebkitBorderTopRightRadius = borderRadius;
                        bar.style.MozBorderRadiusTopleft = borderRadius;
                        bar.style.MozBorderRadiusTopright = borderRadius;
                        bar.style.borderTopRightRadius = borderRadius;
                        bar.style.borderTopLeftRadius = borderRadius;
                    ModalDialog.dialog.appendChild(bar);
                }
                
                // Add the content div
                var content = document.createElement('div');
                    //content.style.paddingTop = '20px';
                    content.style.width = '100%';
                    content.style.height = '100%';
                ModalDialog.dialog.appendChild(content);
    
                if (ModalDialog.id.toLowerCase().substring(0, 7) == 'string:') {
                    content.innerHTML = ModalDialog.id.substring(7);
                } else {
                    content.innerHTML = document.getElementById(ModalDialog.id).innerHTML;
                }
    
                // Now reposition the dialog in the center
                ModalDialog.dialog.style.left = (document.body.offsetWidth / 2) - (ModalDialog.dialog.offsetWidth / 2) + 'px';
                ModalDialog.dialog.style.top  = '30%';
            }
            
            // Show the dialog
            ModalDialog.dialog.style.visibility = 'visible';
            
            // A simple fade-in
            ModalDialog.dialog.style.transform   = 'scale(1)';
            ModalDialog.dialog.style.opacity     = 1;
            ModalDialog.background.style.opacity = 0.5;
        },




        //
        // Hides everything
        //
        Close: function ()
        {
            if (ModalDialog.dialog) {
                ModalDialog.dialog.style.opacity = 0;
                
                if (ModalDialog.options.enlargeOnHide) {
                    ModalDialog.dialog.style.transform = 'scale(1.5)'
                }
            }
    
            if (ModalDialog.background) {
                ModalDialog.background.style.opacity = 0;
            }
            
            // Remove the dialog node from the DOM after its
            // had time to fadeout
            setTimeout(function ()
            {
                ModalDialog.background.style.display = 'none';

                if (document.getElementById(ModalDialog.dialog.id)) {
                    document.body.removeChild(ModalDialog.dialog);
                }

                if (document.getElementById(ModalDialog.background.id)) {
                    document.body.removeChild(ModalDialog.background);
                }
            }, ModalDialog.options.removeFromDOMTimeout);
        },




        //
        // Accommodate the window being resized
        //
        Resize: function ()
        {
            if (ModalDialog.dialog) {
                ModalDialog.dialog.style.left = (document.body.offsetWidth / 2) - (ModalDialog.dialog.offsetWidth / 2) + 'px';
            }
    
            ModalDialog.background.style.width  = '100%';
            ModalDialog.background.style.height = '100%';
        },



    
        //
        // Returns the page height
        // 
        // @return int The page height
        //
        AddCustomEventListener: function (name, func)
        {
            if (typeof ModalDialog.events == 'undefined') {
                ModalDialog.events = [];
            }
    
            ModalDialog.events.push([name, func]);
        },
    
    
    
    
        //
        // Used to fire the ModalDialog custom event
        // 
        // @param object obj   The graph object that fires the event
        // @param string event The name of the event to fire
        //
        FireCustomEvent: function (name)
        {
            for (var i=0; i<ModalDialog.events.length; ++i) {
                if (typeof ModalDialog.events[i][0] == 'string' && ModalDialog.events[i][0] == name && typeof ModalDialog.events[i][1] == 'function') {
                    ModalDialog.events[i][1]();
                }
            }
        },


    
    
        //
        // Returns true if the browser is IE8
        //
        isIE8: function ()
        {
            return document.all && (navigator.userAgent.indexOf('MSIE 8') > 0);
        }
    };




    // Aliases
    ModalDialog.show  = ModalDialog.Show;
    ModalDialog.draw  = ModalDialog.Show;
    ModalDialog.Hide  = ModalDialog.Close;
    ModalDialog.hide  = ModalDialog.Close;
    ModalDialog.close = ModalDialog.Close;
    
    // Lowercase all of the function names
    for (i in ModalDialog) {
        if (typeof ModalDialog[i] === 'function') {
            ModalDialog[i.toLowerCase()] = ModalDialog[i]
        }
    }