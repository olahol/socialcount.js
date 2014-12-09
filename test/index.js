var Socialcount = require("../socialcount");
var test = require("tape");

test("get", function (t) {
  t.plan(4);

  Socialcount.get("twitter", "http://nytimes.com", function (count) {
    t.ok(count > 10000, "nytimes has at least 10000 shares on twitter");
  });

  Socialcount.get("facebook", "http://nytimes.com", function (count) {
    t.ok(count > 200000, "nytimes has at least 200 000 shares on facebook");
  });

  Socialcount.get("pinterest", "http://nytimes.com", function (count) {
    t.ok(count > 40, "nytimes has at least 40 pins on pinterest");
  });

  Socialcount.get("twitter", function (count) {
    t.ok(count === 0, "window.location has 0 shares on twitter");
  });
});

test("all", function (t) {
  t.plan(6);

  Socialcount.all("http://nytimes.com", function (counts) {
    t.ok(counts["twitter"] > 10000, "nytimes has at least 10000 shares on twitter");
    t.ok(counts["facebook"] > 200000, "nytimes has at least 200 000 shares on facebook");
    t.ok(counts["pinterest"] > 40, "nytimes has at least 40 pins on pinterest");
  });

  Socialcount.all(function (counts) {
    t.ok(counts["twitter"] === 0, "window.location has 0 shares on twitter");
    t.ok(counts["facebook"] === 0, "window.location has 0 shares on facebook");
    t.ok(counts["pinterest"] === 0, "window.location has 0 pins on pinterest");
  });
});
