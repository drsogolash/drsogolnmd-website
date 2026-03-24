/* Block Squarespace backend API calls — not available on static hosting */
(function () {
  var BAD = ['/api/census/', '/api/form/', '/api/'];

  function isBlocked(url) {
    if (!url) return false;
    var s = String(url);
    // match relative /api/ paths or absolute URLs pointing to this domain
    return BAD.some(function (p) {
      return s.indexOf(p) === 0 ||
             s.indexOf('drsogolash.github.io' + p) !== -1;
    });
  }

  // Block XMLHttpRequest
  var _open = XMLHttpRequest.prototype.open;
  XMLHttpRequest.prototype.open = function (method, url) {
    this._sqspBlocked = isBlocked(url);
    if (!this._sqspBlocked) _open.apply(this, arguments);
  };
  var _send = XMLHttpRequest.prototype.send;
  XMLHttpRequest.prototype.send = function () {
    if (!this._sqspBlocked) _send.apply(this, arguments);
  };

  // Block fetch
  var _fetch = window.fetch;
  window.fetch = function (url, opts) {
    if (isBlocked(url)) return Promise.resolve(new Response('{}', { status: 200 }));
    return _fetch.call(window, url, opts);
  };
})();
