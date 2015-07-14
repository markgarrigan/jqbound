$.extend(app,{
  saySomething : function(options) {
    var $d = $.Deferred();
    if( confirm(options.speech || 'Hello!') ) {
      $d.resolve();
    } else {
      $d.reject();
    };
    return $d.promise();
  },
  doSomething : function(options) {
    var $d = $.Deferred();
    if( confirm('I did it!') ) {
      $d.resolve();
    } else {
      $d.reject();
    };
    return $d.promise();
  },
  sayName : function(options) {
    var $d = $.Deferred();
    if( confirm(app.getProperty(app.models,options.name)) ) {
      $d.resolve();
    } else {
      $d.reject();
    };
    return $d.promise();
  },
  models : {},
  getProperty : function(obj,path) {
    var paths = path.split('.'),
        current = obj,
        i;
    for (i = 0; i < paths.length; ++i) {
      if (current[paths[i]] == undefined) {
        return undefined;
      } else {
        current = current[paths[i]];
      }
    }
    return current;
  },
  initModels : function(options) {
    var models = String(options.models).split(',');
    models.forEach(function (name, index, array) {
      $('[data-value^="' + name + '."]').each(function() {
        var $this = $(this),
          path = $this.data('value'),
          value = app.getProperty(app.models, path);
        if (value) {

        } else {
          var model = new Model($this);
        }
      });
    });
  },
  wait : function(time) {
    return $.Deferred(function(dfd) {
      setTimeout(dfd.resolve, time);
    });
  },
  methods : function(names) {
    return names.split(',');
  },
  log : function(obj) {
    if (window.console) {
      console.log(obj);
    }
  }
});
