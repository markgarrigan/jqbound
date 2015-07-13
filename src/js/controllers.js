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
  doSomething : function() {
    var $d = $.Deferred();
    if( confirm('I did it!') ) {
      $d.resolve();
    } else {
      $d.reject();
    };
    return $d.promise();
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
