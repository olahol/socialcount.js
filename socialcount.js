;(function () {
  var jsonp = function (url, cb) {
    var id = Date.now() + "_" + Math.floor(Math.random()*1000);

    var script = document.createElement("script"),
      callback = "jsonp_" + id,
      query = url.replace("@", callback);

    script.setAttribute("type", "text/javascript");
    script.setAttribute("src", query);
    document.body.appendChild(script);

    window[callback] = cb;
  };

  var providers = {
    twitter: {
      url: function (url) {
        return "https://cdn.api.twitter.com/1/urls/count.json?callback=@&url=" + url;
      }, extract: function (data) {
        return data.count;
      }
    }, pinterest: {
      url: function (url) {
        return "https://api.pinterest.com/v1/urls/count.json?callback=@&url=" + url;
      }, extract: function (data) {
        return data.count;
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
      var count = providers[provider];
      jsonp(count.url(url), function (data) {
        cb(count.extract(data));
      });
    }, all: function (url, cb) {
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

  // If common js is defined use it.
  if (typeof module === "object" && module !== null) {
    module.exports = exports;
  } else {
    window.Socialcount = exports;
  }
})();
