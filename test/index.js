var Socialcount = require("../socialcount");
var test = require("tape");

test("get", function (t) {
  t.plan(6);

  Socialcount.get("twitter", "http://nytimes.com", function (count) {
    t.ok(count > 10000, "nytimes has at least 10000 shares on twitter");
  });

  Socialcount.get("facebook", "http://nytimes.com", function (count) {
    t.ok(count > 200000, "nytimes has at least 200 000 shares on facebook");
  });

  Socialcount.get("pinterest", "http://nytimes.com", function (count) {
    t.ok(count > 40, "nytimes has at least 40 pins on pinterest");
  });

  Socialcount.get("google", "http://nytimes.com", function (count) {
    t.ok(count > 40, "nytimes has at least 40 shares on google");
  });

  Socialcount.get("twitter", function (count) {
    t.ok(count === 0, "window.location has 0 shares on twitter");
  });

  Socialcount.get("linkedin", "http://nytimes.com", function (count) {
    t.ok(count > 40, "nytimes has at least 40 shares on linkedin");
  });
});

test("all", function (t) {
  t.plan(10);

  Socialcount.all("http://nytimes.com", function (counts) {
    t.ok(counts["twitter"] > 10000, "nytimes has at least 10000 shares on twitter");
    t.ok(counts["facebook"] > 200000, "nytimes has at least 200 000 shares on facebook");
    t.ok(counts["pinterest"] > 40, "nytimes has at least 40 pins on pinterest");
    t.ok(counts["google"] > 40, "nytimes has at least 40 shares on google");
    t.ok(counts["linkedin"] > 40, "nytimes has at least 40 shares on linkedin");
  });

  Socialcount.all(function (counts) {
    t.ok(counts["twitter"] === 0, "window.location has 0 shares on twitter");
    t.ok(counts["facebook"] === 0, "window.location has 0 shares on facebook");
    t.ok(counts["pinterest"] === 0, "window.location has 0 pins on pinterest");
    t.ok(counts["google"] === 0, "window.location has 0 shares on google");
    t.ok(counts["linkedin"] === 0, "window.location has 0 shares on linkedin");
  });
});
