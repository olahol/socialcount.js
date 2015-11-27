(function (root, factory) {
  if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    module.exports = factory();
  } else {
    root.Socialcount = factory();
  }
}(this, function () {
  var jsonp = function (url, cb) {
    var now = +new Date(),
      id = now + "_" + Math.floor(Math.random()*1000);

    var script = document.createElement("script"),
      callback = "jsonp_" + id,
      query = url.replace("@", callback);

    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", query);
    document.body.appendChild(script);

    window[callback] = cb;
  };

  var providers = {
    pinterest: {
      url: function (url) {
        return "https://api.pinterest.com/v1/urls/count.json?callback=@&url=" + url;
      }, extract: function (data) {
        return data.count || 0;
      }
    }, facebook: {
      url: function (url) {
        var fql = "select like_count, share_count from link_stat where url = '" + url + "'";
        fql = encodeURI(fql);

        return "https://api.facebook.com/method/fql.query?format=json" + "&callback=@&query=" + fql;
      }, extract: function (data) {
        if (data[0]) {
          return data[0].like_count + data[0].share_count;
        }

        return 0;
      }
    }, google: {
      url: function (url) {
        return "https://share.yandex.net/counter/gpp/?callback=@&url=" + url;
      }, extract: function (data) {
        return parseInt(data, 10);
      }
    }, linkedin: {
      url: function (url) {
        return "https://www.linkedin.com/countserv/count/share?url="+ url +"&callback=@&format=jsonp" ;
      }, extract: function (data) {
        return data.count || 0;
      }
    }
  };

  var providersCount = (function () {
    var count = 0;
    for (var provider in providers) {
      if (providers.hasOwnProperty(provider)) {
        count += 1;
      }
    }
    return count;
  }());

  var exports = {
    get: function (provider, url, cb) {
      if (typeof url === "function") {
        cb = url;
        url = window.location;
      }

      var count = providers[provider];
      jsonp(count.url(url), function (data) {
        cb(count.extract(data));
      });
    }, all: function (url, cb) {
      if (typeof url === "function") {
        cb = url;
        url = window.location;
      }

      var out = {},
          results = 0;

      var get = function (provider) {
        exports.get(provider, url, function (count) {
          out[provider] = count;
          results += 1;
          if (results === providersCount) { cb(out); }
        });
      };

      for (var provider in providers) {
        if (providers.hasOwnProperty(provider)) {
          get(provider);
        }
      }
    }
  };

  return exports;
}));
