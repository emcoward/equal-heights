// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

// undefined is used here as the undefined global variable in ECMAScript 3 is
// mutable (ie. it can be changed by someone else). undefined isn't really being
// passed in so we can ensure the value of it is truly undefined. In ES5, undefined
// can no longer be modified.

// window and document are passed through as local variables rather than globals
// as this (slightly) quickens the resolution process and can be more efficiently
// minified (especially when both are regularly referenced in your plugin).

// Create the defaults once
var pluginName = 'equalHeights',
defaults = {
    target: 'column-inner' // the class name of the element to apply equal heights
};

// The actual plugin constructor
function Plugin( element, options ) {
    this.element = element;
    // jQuery has an extend method which merges the contents of two or
    // more objects, storing the result in the first object. The first object
    // is generally empty as we don't want to alter the default options for
    // future instances of the plugin
    this.options = $.extend( {}, defaults, options) ;
    this._defaults = defaults;
    this._name = pluginName;

    this.init();
}

//Additional Plugin Methods
$.extend(Plugin.prototype, {
    init:  function () {
        // Place initialization logic here
        // You already have access to the DOM element and
        // the options via the instance, e.g. this.element
        // and this.options
        // you can add more functions like the one below and
        // call them like so: this.yourOtherFunction(this.element, this.options).

        if($(this.element).attr('data-' + pluginName)) return;

        // if the element exists run our functions
        if ($(this.element).length !== 0) {
            this.build();
        }
    },

    // the build function defines the heights array, loops through each element finds the height and adds it to the heights array.
    // the heights array is then sorted by highest value and that value is added to each element as a 'min-height' or 'height' value depending
    // on the browser used.
    build: function() {
        alert('here');
      var sortNumber = function(a,b){return b - a;};
        var heights = [];
        //Push each height into an array
        $('.'+this.options.target, this.element).each(function(){
            heights.push($(this).height());
        });
        heights.sort(sortNumber);
        var maxHeight = heights[0];

        return $('.'+this.options.target, this.element).each(function(){
            //Set each element to the max height
            if ($.browser.msie && $.browser.version <= 6 ) {
                $(this).css({'height': maxHeight});
            } else {
                $(this).css({'min-height': maxHeight});
            }
        });
    },

    // return the dom to it's original form
    destroy : function(){
        $('.'+this.options.target, this.element)
            .removeAttr('style');
    }
});

// A really lightweight plugin wrapper around the constructor,
// preventing against multiple instantiations and allowing any
// public function (ie. a function whose name doesn't start
// with an underscore) to be called via the jQuery plugin,
// e.g. $(element).defaultPluginName('functionName', arg1, arg2)
 $.fn[pluginName] = function ( options ) {
    var args = arguments;
    if (options === undefined || typeof options === 'object') {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName, new Plugin( this, options ));
            }
        });
    } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
        return this.each(function () {
            var instance = $.data(this, 'plugin_' + pluginName);
            if (instance instanceof Plugin && typeof instance[options] === 'function') {
                instance[options].apply( instance, Array.prototype.slice.call( args, 1 ) );
            }
        });
    }
}
})( jQuery, window, document );
