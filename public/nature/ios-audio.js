/* Sound on iPad, iPhone and Mac Safari, for every scene.
   - Safari keeps Web Audio silent until a real tap (touchend or click, not pointerdown), and puts it to sleep again when the page
     is hidden, so every audio context a scene makes is tracked here and woken on each tap and when the tab comes back.
   - On iPhone and iPad the silent switch mutes Web Audio. Telling the system this page "plays" audio (navigator.audioSession) and
     starting a silent <audio> in a real tap moves the scenes onto the media channel, so they are heard with the switch on silent. */
(function () {
  try { if (navigator.audioSession) navigator.audioSession.type = "playback"; } catch (_) {}
  var AC = window.AudioContext || window.webkitAudioContext, all = [];
  if (AC) {
    var Tracked = function (a, b) { var c = new AC(a, b); all.push(c); return c; };
    Tracked.prototype = AC.prototype;
    window.AudioContext = Tracked; window.webkitAudioContext = Tracked;
  }
  var ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (/Macintosh/.test(navigator.userAgent) && navigator.maxTouchPoints > 1);   // the silent switch only exists there
  var el = null;
  function silent() {                                         // one second of silence, made here so there is no file to fetch
    var rate = 8000, n = rate, buf = new ArrayBuffer(44 + n * 2), v = new DataView(buf), w = function (o, s) { for (var i = 0; i < s.length; i++) v.setUint8(o + i, s.charCodeAt(i)); };
    w(0, "RIFF"); v.setUint32(4, 36 + n * 2, true); w(8, "WAVEfmt "); v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
    v.setUint32(24, rate, true); v.setUint32(28, rate * 2, true); v.setUint16(32, 2, true); v.setUint16(34, 16, true); w(36, "data"); v.setUint32(40, n * 2, true);
    return URL.createObjectURL(new Blob([buf], { type: "audio/wav" }));
  }
  function wake() {
    for (var i = 0; i < all.length; i++) { try { if (all[i].state !== "running") all[i].resume(); } catch (_) {} }
    if (ios && !el) { try { el = new Audio(silent()); el.loop = true; el.setAttribute("playsinline", ""); el.play().catch(function () { el = null; }); } catch (_) { el = null; } }
  }
  ["touchend", "click", "keydown", "pointerup"].forEach(function (t) { addEventListener(t, wake, true); });
  document.addEventListener("visibilitychange", function () { if (!document.hidden) wake(); });
})();
