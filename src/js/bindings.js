$(function(){

  var Queue = function(methods,options) {
    if (methods.length) {
      $.when(app[methods[0]](options)).then(function() {
        methods.splice(0,1);
        Queue(methods,options);
      });
    }
  };

  $('[data-on-load]').each(function() {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({element : $this, value : $this.val()},data,data.options),
    methods = app.methods(data.onLoad);
    Queue(methods,options);
  });

  $('body').on('mouseenter', '[data-on-enter]', function (key) {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({el : this, element: $this, value: $this.val()}, data, data.options),
    methods = app.methods(data.onEnter);
    Queue(methods, options);
  });

  $('body').on('mouseleave', '[data-on-leave]', function (key) {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({el : this, element: $this, value: $this.val()}, data, data.options),
    methods = app.methods(data.onLeave);
    Queue(methods, options);
  });

  $('[data-on-keyup]').on('keyup', function (key) {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({element: $this, value: $this.val()}, data, data.options),
    methods = app.methods(data.onKeyup);
    Queue(methods, options);
  });

  $('body').on('focus', '[data-on-focus]', function (e) {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({element: $this, value: $this.val()}, data, data.options),
    methods = app.methods(data.onFocus);
    Queue(methods, options);
  });

  $('body').on('change', '[data-on-change]', function (e) {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({element: $this, value: $this.val()}, data, data.options),
    methods = app.methods(data.onChange);
    Queue(methods, options);
  });

  $('body').on('blur', '[data-on-blur]', function (e) {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({element: $this, value: $this.val()}, data, data.options),
    methods = app.methods(data.onBlur);
    Queue(methods, options);
  });

  $('body').on('click', '[data-click]', function(e) {
    var $this = $(this),
    data = $this.data(),
    options = $.extend({el : this, element : $this},data,data.options),
    methods = app.methods(data.click);
    if (!$this.prop('disabled')) {
      Queue(methods,options);
    }
  });

  $('body').on('dblclick', '[data-on-dblclick]', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var $this = $(this),
    data = $this.data(),
    options = $.extend({el : this, element : $this},data,data.options),
    methods = app.methods(data.onDblclick);
    Queue(methods,options);
  });

  $('body').on('click', '[data-on-click]', function(e) {
    e.stopPropagation();
    e.preventDefault();
    var $this = $(this),
    data = $this.data(),
    options = $.extend({el : this, element : $this},data,data.options),
    methods = app.methods(data.onClick);
    Queue(methods,options);
  });

  $('[data-on-submit]').on('submit', function (e) {
    e.preventDefault();
    var $this = $(this),
    self = this,
    data = $this.data(),
    options = $.extend({self: this, element: $this, iframe: $this.attr('target')}, data, $this.data('options')),
    methods = app.methods(data.onSubmit);
    Queue(methods, options);
  });

});

function DataBinder(object,name) {
  var pubSub = jQuery({});
  var message = object.data(name) + ":change";
  jQuery( document ).on( "change keyup", "[data-" + name + "]", function( evt ) {
    var $input = jQuery( this );
    pubSub.trigger( message, [ $input.data(name), $input.val() ] );
  });
  pubSub.on( message, function( evt, prop_name, new_val ) {
    jQuery( "[data-" + name + "=" + prop_name + "]" ).each( function() {
      var $bound = jQuery( this );

      if ( $bound.is("input, textarea, select") ) {
        //        if ($bound.not('input[type=radio]')) {
        //          $bound.val( new_val );
        //        }
      } else {
        $bound.html( new_val );
      }
    });
  });
  return pubSub;
}

function Model(element,name) {
  var binder = new DataBinder(element,name),
  model = {
    attributes: {},
    set: function( attr_name, val ) {
      this.attributes[ attr_name ] = val;
      binder.trigger( name + ":change", [ attr_name, val, this ] );
    },
    get: function( attr_name ) {
      return this.attributes[ attr_name ];
    },
    _binder: binder
  };
  binder.on( name + ":change", function( evt, attr_name, new_val, initiator ) {
    if ( initiator !== model ) {
      model.set( attr_name, new_val );
    }
  });
  return model;
}
