/* Raptor easter egg: type "rawr" or press the footer button. */
(function () {
  var SECRET = 'rawr';
  var KEY = 'raptorSightings';
  var running = false;
  var typed = '';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var css = [
    '.raptor-btn{background:none;border:1px dashed var(--border);color:var(--fg-muted);font:inherit;font-size:.75rem;',
    'padding:.3em .8em;margin-top:.75rem;cursor:pointer;letter-spacing:.04em}',
    '.raptor-btn:hover,.raptor-btn:focus-visible{color:var(--accent-warm);border-color:var(--accent-warm)}',
    '.raptor{position:fixed;left:0;bottom:12px;width:120px;height:80px;color:var(--accent);z-index:9999;pointer-events:none;',
    'animation:raptor-run 3.4s linear forwards}',
    '.raptor svg{width:100%;height:100%;overflow:visible;animation:raptor-bob .25s ease-in-out infinite alternate}',
    '.raptor .leg{transform-box:view-box;transform-origin:60px 46px;animation:raptor-leg .25s ease-in-out infinite alternate}',
    '.raptor .leg.b{animation-direction:alternate-reverse}',
    '.raptor .bubble{position:absolute;right:-6px;top:-26px;font-family:var(--display);font-size:1rem;color:var(--fg);',
    'background:var(--surface);border:1px solid var(--border);padding:0 .45em;opacity:0;animation:raptor-bubble 3.4s forwards}',
    '.raptor-print{position:fixed;bottom:6px;width:14px;height:14px;color:var(--accent-warm);pointer-events:none;z-index:9998;',
    'animation:raptor-fade 4s ease-in forwards}',
    '.raptor-toast{position:fixed;left:50%;bottom:110px;transform:translateX(-50%);background:var(--surface);color:var(--fg);',
    'border:1px solid var(--accent);padding:.5em 1em;font-size:.88rem;z-index:10000;animation:raptor-fade 3s ease-in forwards}',
    '@keyframes raptor-run{from{transform:translateX(-140px)}to{transform:translateX(calc(100vw + 20px))}}',
    '@keyframes raptor-bob{from{transform:translateY(0)}to{transform:translateY(-4px)}}',
    '@keyframes raptor-leg{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}',
    '@keyframes raptor-bubble{0%,10%{opacity:0}18%,45%{opacity:1}55%,100%{opacity:0}}',
    '@keyframes raptor-fade{0%,60%{opacity:1}100%{opacity:0}}',
    '@keyframes raptor-still{0%{opacity:0}20%,80%{opacity:1}100%{opacity:0}}',
    '@media (prefers-reduced-motion:reduce){',
    '.raptor{left:50%;margin-left:-60px;animation:raptor-still 3s forwards}',
    '.raptor svg,.raptor .leg{animation:none}.raptor .bubble{opacity:1;animation:none}}'
  ].join('');

  var raptorSvg =
    '<svg viewBox="0 0 120 80" aria-hidden="true">' +
    '<g class="leg a" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
    '<path d="M60 46 L66 60 L60 72 L70 72"/></g>' +
    '<g class="leg b" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".7">' +
    '<path d="M60 46 L66 60 L60 72 L70 72"/></g>' +
    '<path fill="currentColor" d="M2 38 L45 32 Q60 26 75 30 L86 20 Q90 12 100 13 L116 19 L116 24 L104 26 L100 28 ' +
    'Q92 32 88 40 Q80 50 64 50 Q52 50 44 44 L2 40 Z"/>' +
    '<path d="M84 40 L90 46 L94 45" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" fill="none"/>' +
    '<circle cx="101" cy="17" r="1.6" fill="var(--bg)"/>' +
    '</svg>';

  var printSvg =
    '<svg viewBox="0 0 14 14" aria-hidden="true"><g stroke="currentColor" stroke-width="1.6" stroke-linecap="round">' +
    '<path d="M3 12 L7 8 L13 8"/><path d="M7 8 L11 3"/><path d="M7 8 L12 12"/></g></svg>';

  function getCount() {
    try { return parseInt(localStorage.getItem(KEY), 10) || 0; } catch (e) { return 0; }
  }

  function setCount(n) {
    try { localStorage.setItem(KEY, String(n)); } catch (e) { /* private mode, etc. */ }
  }

  function toast(msg) {
    var t = document.createElement('div');
    t.className = 'raptor-toast';
    t.setAttribute('role', 'status');
    t.textContent = msg;
    document.body.appendChild(t);
    setTimeout(function () { t.remove(); }, 3000);
  }

  function dropPrint(x, up) {
    var p = document.createElement('div');
    p.className = 'raptor-print';
    p.style.left = x + 'px';
    if (up) p.style.bottom = '18px';
    p.innerHTML = printSvg;
    document.body.appendChild(p);
    setTimeout(function () { p.remove(); }, 4000);
  }

  function release() {
    if (running) return;
    running = true;

    var r = document.createElement('div');
    r.className = 'raptor';
    r.innerHTML = raptorSvg + '<span class="bubble">rawr!</span>';
    document.body.appendChild(r);

    var step = 0;
    var tracker = reduceMotion ? null : setInterval(function () {
      var box = r.getBoundingClientRect();
      if (box.left > 0 && box.left < window.innerWidth) dropPrint(box.left + 55, step++ % 2);
    }, 220);

    r.addEventListener('animationend', function (e) {
      if (e.target !== r) return;
      clearInterval(tracker);
      r.remove();
      running = false;
      var n = getCount() + 1;
      setCount(n);
      toast(n === 1 ? 'You spotted a velociraptor. 🦖' : 'Raptor sightings: ' + n);
    });
  }

  function onKey(e) {
    var el = e.target;
    if (el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName))) return;
    if (!e.key || e.key.length !== 1) return;
    typed = (typed + e.key.toLowerCase()).slice(-SECRET.length);
    if (typed === SECRET) release();
  }

  function init() {
    var style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    var footer = document.querySelector('footer');
    if (footer) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'raptor-btn';
      btn.textContent = '🦖 psst… type “rawr”';
      btn.setAttribute('aria-label', 'Release the velociraptor');
      btn.addEventListener('click', release);
      var legal = footer.querySelector('.footer-legal');
      var wrap = document.createElement('div');
      wrap.style.width = '100%';
      wrap.appendChild(btn);
      footer.insertBefore(wrap, legal);
    }

    document.addEventListener('keydown', onKey);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
