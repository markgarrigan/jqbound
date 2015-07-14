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

function DataBinder(element) {
  var pubSub = jQuery({});
  var message = element.data('value') + ":change";
  $('body').on('change keyup', '[data-value]', function(e) {
    var $this = $(this);
    pubSub.trigger(message, [$this.data('value'), $this.val()]);
  });
  pubSub.on(message, function(e, property, new_val) {
    $('[data-value="' + property + '"]').each(function() {
      $(this).val(new_val);
    });
    $('[data-text="' + property + '"]').each(function() {
      $(this)[0].textContent = new_val;
    });
    $('[data-html="' + property + '"]').each(function() {
      $(this).html(new_val);
    });
  });
  return pubSub;
}

function Model(element) {
  var binder = new DataBinder(element),
      model = {
        set: function(obj,path,value) {
          var lastKeyIndex = path.length-1;
          for (var i = 0; i < lastKeyIndex; ++ i) {
            var key = path[i];
            if (!(key in obj)) {
              obj[key] = {};
            }
            obj = obj[key];
          }
          obj[path[lastKeyIndex]] = value;
          binder.trigger(path + ":change", [path, value, this]);
        },
        _binder: binder
      };
  if (element.val()) {
    model.set(app.models, path.split('.'), element.val());
  }
  binder.on( element.data('value') + ":change", function( evt, path, new_val, initiator ) {
    if ( initiator !== model ) {
      model.set(app.models, path.split('.'), new_val);
    }
  });
  return model;
}
