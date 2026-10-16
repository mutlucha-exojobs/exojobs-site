// Picks the page language and keeps it on links. No cookies, no storage: the choice lives only in ?lang=.
// Order: ?lang=tr|el|en (the app links this way) -> browser language -> English.
(function () {
  var LANGS = ['tr', 'el', 'en'];

  function pick() {
    var param = new URLSearchParams(location.search).get('lang');
    if (param && LANGS.indexOf(param.toLowerCase()) !== -1) return param.toLowerCase();
    var prefs = navigator.languages || [navigator.language || ''];
    for (var i = 0; i < prefs.length; i++) {
      var code = String(prefs[i]).slice(0, 2).toLowerCase();
      if (code === 'tr' || code === 'el') return code;
      if (code === 'en') return 'en';
    }
    return 'en';
  }

  var lang = pick();
  var root = document.documentElement;
  root.setAttribute('data-lang', lang);
  root.setAttribute('lang', lang);

  document.addEventListener('DOMContentLoaded', function () {
    var title = document.body.getAttribute('data-title-' + lang);
    if (title) document.title = title;

    // Internal page links carry the language
    var links = document.querySelectorAll('a[href]');
    for (var i = 0; i < links.length; i++) {
      var a = links[i];
      var href = a.getAttribute('href');
      if (/^[a-z0-9-]+\.html(#.*)?$/i.test(href)) {
        var parts = href.split('#');
        a.setAttribute('href', parts[0] + '?lang=' + lang + (parts[1] ? '#' + parts[1] : ''));
      }
    }

    // Language switcher: keep the current page and section
    var switches = document.querySelectorAll('[data-set-lang]');
    for (var j = 0; j < switches.length; j++) {
      var s = switches[j];
      var to = s.getAttribute('data-set-lang');
      s.setAttribute('href', '?lang=' + to + location.hash);
      if (to === lang) s.setAttribute('aria-current', 'true');
    }
  });
})();
