// Keep all of our code within our little scope.
(function() {
  var jQuery; // our reference to jQuery
  var serverFQDN = 'http://localhost:3000'; // we need to know where to get assets and data

  // This is where the user's page interacts with us
  Upvotes = {
    Badge: function(opts) {
      console.log('Badge constructed:');
      console.dir(opts);
      this.options = opts;
      if (!this.options.theme) {
        this.options.theme = 'light';
      }
      this.container = '.upvotes-badge';
      this.init.bind(this)();
    },

    init: function() {
      if (window.jQuery === undefined || window.jQuery.fn.jquery !== '1.6.2') {
        console.log('we need to load jQuery');
        var script_tag = document.createElement('script');
        script_tag.setAttribute("type","text/javascript");
        script_tag.setAttribute("src", "https://ajax.googleapis.com/ajax/libs/jquery/1.6.2/jquery.min.js");
        (document.getElementsByTagName("head")[0] || document.documentElement).appendChild(script_tag);
        if (script_tag.attachEvent) {
          script_tag.onreadystatechange = function() { // for IE
            if (this.readyState == 'complete' || this.readyState == 'loaded') {
              this.onreadystatechange = null;
              this.scriptLoadHandler.bind(this)();
            }
          };
        } else {
          script_tag.onload = this.scriptLoadHandler.bind(this);
        }
      } else {
        jQuery = window.jQuery;
        console.log('jQuery already exists on page! using it');
        this.getData.bind(this)();
      }
    },

    scriptLoadHandler: function() {
      jQuery = window.jQuery.noConflict();
      console.log('jQuery is now loaded');
      this.getData.bind(this)();
    },
  
    getData: function() {
      jQuery.ajax({
        url: serverFQDN + '/users/' + this.options.username + '.js',
        dataType: 'jsonp',
        success: function(user) {
          if (user) {
            this.user = user;
            this.main.bind(this)();
          } else {
            console.log('User ' +this.options.username+ ' Not Found');
          }
        },
        context: this
      });
    },
  
    sendUpvote: function() {
      // note that JSONP is only http GET
      jQuery.ajax({
        url: serverFQDN + '/users/' + this.options.username + '/upvote.js', //pass any params in the query string
        dataType: 'jsonp',
        success: function(user) {
          if (!user) {
            console.log('OH NO! check the rails log');
          } else {
            this.user = user;
            this.render.bind(this)();
          }
        },
        context: this
      });
    },
  
    main: function() {
      jQuery(document).ready(function() {
        console.log('adding stylesheets and scripts');
        jQuery('head').append('<link href="' + serverFQDN + '/widgets/vendor/cleanslate.css" rel="stylesheet" type="text/css">');
        jQuery('head').append('<link href="' + serverFQDN + '/widgets/badge.css" rel="stylesheet" type="text/css">');
        jQuery.getScript(serverFQDN + '/widgets/vendor/json2.js');

        // build the widget where the webmaster inserted the script
        markup = '<div class="' + this.container.replace('.','') + '"></div>';
        if (jQuery('#upvotes-badge').parent().size() === 0) {
          console.log('where should it go? building container in the body');
          jQuery('body').append(markup);
        } else {
          jQuery('#upvotes-badge').parent().append(markup);
        }
        jQuery(this.container).addClass('cleanslate');
        jQuery(this.container).addClass(this.options.theme);
      
        this.render.bind(this)();
      }.bind(this));
    },
  
    render: function() {
      console.log('render');
      jQuery(this.container).html('<p>' + this.user.fullname + ' has ' + this.user.upvotes + ' upvotes.<button class="update">Send an Upvote</button></p>');
      this.attachEvents.bind(this)();
    },
  
    attachEvents: function() {
      console.log('attachEvents');
      jQuery(this.container + ' .update').click(function() {
        this.sendUpvote.bind(this)();
      }.bind(this));
    }

  };
  
})();
