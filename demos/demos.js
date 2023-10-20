    //
    // This file is included by all demo files
    //
    // REMEMBER THAT YOU MAY NEED TO EDIT DEMOS-ACTUAL.JS
    //
    // Do not remove this: <!-- <RGRAPH_REMOVE> --> <!-- </RGRAPH_REMOVE> -->
    //
    
    // This function gets the source code from a demo page and presents
    // it as a PRE section in the HTML page. It's called from a
    // DOMContentLoaded call down below.
    //
    function showSource (opt = {})
    {
        document.write('<br clear="all" />');
        document.write('<br clear="all" />');

        showSource_libraries(opt);
        showSource_tag(opt);
        showSource_source(opt);
    }
    
    
    
    
    
    
    
    
    //
    // Extract the libraries from the page and show
    // them
    //
    function showSource_libraries(opt)
    {
            // Get all of the <script> tags
            els = document.querySelectorAll('script');
            
            // Opening <pre> tag
            document.write('<span style="margin: 5px">This goes in the documents header:</span>');
            document.write('<pre class="code">');
            
            // Loop through all of the <script> tags and if the name
            // of the library starts with RGraph. then it's (probably)
            // a n RGraph library
            for (let i=0; i<els.length; ++i) {
                if (
                       (els[i].src.indexOf('RGraph.') > 0 && els[i].src.indexOf('.js') > 0 )
                    || els[i].src.indexOf('ajax.googleapis.com') > 0
                   ) {
                    var src = els[i].src.replace(/https:\/\/(dev|staging|www)\.rgraph\.net\/libraries\//, '');
                    document.write('&lt;script src="' + src  + '"&gt;&lt;/script&gt;\n');
                }
            }
            document.write('</pre>');
    }
    
    
    
    
    
    
    
    
    //
    // Show the tag that the chart is shown on
    //
    function showSource_tag (opt)
    {
        document.write('<span style="margin: 5px">Put this where you want the chart to show up:</span>');
        var html = document.getElementById('rgraph-demo-html').innerHTML;
    
        // For the SVG charts get rid of the <svg> tag from inside
        // the <div> tag
        // If SVG is found, get rid off CSS position and CSS display
        // from the DIV tag
        html = html.replace(/<svg.*<\/svg>/g,'')
                   .replace(/position:? ?relative;?/g,'')
                   .replace(/;? *display *: *inline-block;/g,'')
                   .replace(/; *" /g,'" ')

        var re = new RegExp('^        ','gm');
        document.write('<pre class="code">' + html.replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(re,'').trim() + '</pre>');
    }
    
    
    
    
    
    
    
    
    //
    // Extract the libraries from the page and show
    // them
    //
    function showSource_source(opt)
    {
        // Get all of the <script> tags
        els = document.querySelectorAll('script');
        
        document.write('<span style="margin: 5px; display: inline-block">This is the code that generates the chart - it should be placed after the <code>canvas</code> / <code>div</code> (when using <code>svg</code> charts) tags:</span>');
        
        
        // Opening <pre> tag
        document.write('<pre class="code">');
        
        // Loop through all of the <script> tags and if the name
        // of the library starts with RGraph. then it's (probably)
        // RGraph
        for (let i=0; i<els.length; ++i) {
            if (els[i].innerHTML.indexOf('new RGraph.') > 0) {
                
                var re  = new RegExp('^    ', 'mg');
                var re2 = new RegExp(/\/\/(.*)$/, 'mg');
                
                document.write('&lt;script&gt;' + els[i].innerHTML
                    .replace(re, '')
                    .replace(/</g,'&lt;')
                    .replace(/>/g,'&gt;')
                    .replace(re2,'<span>// $1</span>') + '&lt;/script&gt;\n');
            }
        }
        document.write('</pre>');
    }




















//======== Copy the example code to the clipboard ================//


    //
    // Copies text to the clipboard.
    //
    function copyToClipboard(text, p)
    {   
        if (window.clipboardData && window.clipboardData.setData) {
            return window.clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            
            var textarea = document.createElement("textarea");
                textarea.textContent = text.replace('Copied!','');
                // Prevent scrolling to bottom of page in Microsoft Edge.
                textarea.style.position = "fixed";
            document.body.appendChild(textarea);
            
            textarea.select();

            try {
                // Security exception may be thrown by some browsers.
                var ret = document.execCommand("copy");

                // Add the notification to the page
                var el = document.createElement('span');
                    el.innerText        = 'Copied';
                    el.style.color      = 'black';
                    el.style.transition = 'opacity .25s linear';
                    el.style.opacity    = 0;
                    el.style.padding    = 0;
                    el.style.position   = 'absolute';
                    el.style.top        = '2px';
                    el.style.left       = 0;
                    el.style.backgroundColor = 'white';
                    el.style.display         = 'inline-block';
                    el.style.textAlign       = 'center';
                    el.style.border          = 'none';


                p.appendChild(el);
                el.style.width   = el.parentElement.offsetWidth - 2 + 'px';
                el.style.height  = el.parentElement.offsetHeight - 4 + 'px';
                el.style.opacity = 1;
                
                // // Set the Opacity of the "Copied!" text to zero
                setTimeout(function ()
                {
                    el.style.opacity = 0;
                    
                    // Remove the "Copied!" text from the DOM
                    setTimeout(function ()
                    {
                        el.parentNode.removeChild(el);
                    }, 600)
                }, 2000);

                return ret;
            } catch (e) {
                console.warn("Copy to clipboard failed.", e);
                return prompt("Copy to clipboard: Ctrl+C, Enter", text);
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }








    //
    // Add a small "copy" SPAN to the top right
    // of each code sample
    //
    document.addEventListener('DOMContentLoaded', function ()
    {
        var els = document.getElementsByTagName('pre');
        var label = 'Copy';
    
        for (var i=0; i<els.length; ++i) {
            if (els[i].className.indexOf('code') !== -1) {
                
                // Wrap the PRE in a DIV
                var div = document.createElement('div');
                wrapElement(els[i], div);
                div.className = 'codeblock';
            
                // Set the PRE position to relative so the "copy to clipboaard"
                // label appears in the top right corner
                els[i].style.position = 'relative';
            
                var span = document.createElement('span');
                    span.innerText             = label;
                    span.style.backgroundColor = 'white'
                    span.style.border          = '1px dashed black';
                    span.style.color           = 'black';
                    span.style.display         = 'inline-block';
                    span.style.position        = 'absolute';
                    span.style.top             = '5px';
                    span.style.right           = '5px';
                    span.style.cursor          = 'pointer';
                    span.style.padding         = '2px 15px 2px 15px';
                    span.style.fontWeight      = 'bold';
                    span.style.fontSize        = '10pt';
                    span.style.lineHeight      = '15px';
                div.appendChild(span);
            
                span.onclick = function (e)
                {
                    copyToClipboard(this.parentNode.innerText.replace(label, '').trim(), this)
                }
            }
        }
    }); // End DOMContentLoaded

//================================================================//

    //
    //
    // Wrap an element with another
    //
    // @param el      object The element to wrap
    // @param wrapper object The element that becomes the wrapper
    //
    function wrapElement(el, wrapper)
    {
        el.replaceWith(wrapper);
        wrapper.appendChild(el);
    }