/* Raptor easter egg: type "rawr" or press the footer button. */
(function () {
  var SECRET = 'rawr';
  var KEY = 'raptorSightings';
  var running = false;
  var typed = '';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  var RAINBOW = ['#FF2EC4', '#FF7A1A', '#FFE600', '#3DFF7A', '#22D3FF', '#8B5CFF'];

  var css = [
    '.raptor-btn{background:none;border:1px dashed var(--border);color:var(--fg-muted);font:inherit;font-size:.75rem;',
    'padding:.3em .8em;margin-top:.75rem;cursor:pointer;letter-spacing:.04em}',
    '.raptor-btn:hover,.raptor-btn:focus-visible{color:#FF2EC4;border-color:#FF2EC4}',
    '.raptor{position:fixed;left:0;bottom:14px;width:168px;height:112px;z-index:9999;pointer-events:none;',
    'animation:raptor-run 3.6s linear forwards}',
    '.raptor svg{width:100%;height:100%;overflow:visible;animation:raptor-bob .25s ease-in-out infinite alternate;',
    'filter:drop-shadow(0 0 6px rgba(255,46,196,.75)) drop-shadow(0 0 14px rgba(34,211,255,.45))}',
    '.raptor .leg{transform-box:view-box;transform-origin:60px 46px;animation:raptor-leg .25s ease-in-out infinite alternate}',
    '.raptor .leg.b{animation-direction:alternate-reverse}',
    '.raptor .bubble{position:absolute;right:-18px;top:-30px;font-family:var(--display);font-size:1.15rem;color:#fff;',
    'background:linear-gradient(90deg,' + RAINBOW.join(',') + ');padding:.05em .6em;border-radius:999px;',
    'text-shadow:0 1px 2px rgba(0,0,0,.45);opacity:0;animation:raptor-bubble 3.6s forwards}',
    '.raptor-sparkle{position:fixed;pointer-events:none;z-index:9998;font-size:16px;line-height:1;',
    'animation:raptor-float 1.8s ease-out forwards}',
    '.raptor-toast{position:fixed;left:50%;bottom:130px;transform:translateX(-50%);background:var(--surface);color:var(--fg);',
    'border:2px solid transparent;border-radius:999px;padding:.5em 1.1em;font-size:.88rem;z-index:10000;',
    'background-image:linear-gradient(var(--surface),var(--surface)),linear-gradient(90deg,' + RAINBOW.join(',') + ');',
    'background-origin:border-box;background-clip:padding-box,border-box;animation:raptor-fade 3s ease-in forwards}',
    '@keyframes raptor-run{from{transform:translateX(-190px)}to{transform:translateX(calc(100vw + 30px))}}',
    '@keyframes raptor-bob{from{transform:translateY(0)}to{transform:translateY(-5px)}}',
    '@keyframes raptor-leg{from{transform:rotate(-28deg)}to{transform:rotate(28deg)}}',
    '@keyframes raptor-bubble{0%,10%{opacity:0}18%,50%{opacity:1}60%,100%{opacity:0}}',
    '@keyframes raptor-float{0%{opacity:0;transform:translateY(0) scale(.4) rotate(0)}',
    '15%{opacity:1;transform:translateY(-6px) scale(1.15) rotate(20deg)}',
    '100%{opacity:0;transform:translateY(-70px) scale(.7) rotate(160deg)}}',
    '@keyframes raptor-fade{0%,60%{opacity:1}100%{opacity:0}}',
    '@keyframes raptor-still{0%{opacity:0}20%,80%{opacity:1}100%{opacity:0}}',
    '@media (prefers-reduced-motion:reduce){',
    '.raptor{left:50%;margin-left:-84px;animation:raptor-still 3s forwards}',
    '.raptor svg,.raptor .leg{animation:none}.raptor .bubble{opacity:1;animation:none}}'
  ].join('');

  // Neon rainbow raptor: gradient hide, rosette spots, big sparkly eye.
  var raptorSvg =
    '<svg viewBox="0 0 120 80" aria-hidden="true"><defs>' +
    '<linearGradient id="raptor-hide" x1="0" y1="0" x2="1" y2="0.35">' +
    '<stop offset="0" stop-color="#8B5CFF"/><stop offset=".2" stop-color="#22D3FF"/>' +
    '<stop offset=".4" stop-color="#3DFF7A"/><stop offset=".6" stop-color="#FFE600"/>' +
    '<stop offset=".8" stop-color="#FF7A1A"/><stop offset="1" stop-color="#FF2EC4"/></linearGradient>' +
    '<linearGradient id="raptor-leg" x1="0" y1="0" x2="0" y2="1">' +
    '<stop offset="0" stop-color="#FF2EC4"/><stop offset="1" stop-color="#8B5CFF"/></linearGradient>' +
    '<radialGradient id="raptor-iris" cx=".4" cy=".35" r=".7">' +
    '<stop offset="0" stop-color="#22D3FF"/><stop offset=".6" stop-color="#8B5CFF"/>' +
    '<stop offset="1" stop-color="#2A0A4A"/></radialGradient></defs>' +
    '<g class="leg a" stroke="url(#raptor-leg)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none">' +
    '<path d="M60 46 L66 60 L60 72 L70 72"/></g>' +
    '<g class="leg b" stroke="url(#raptor-leg)" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity=".75">' +
    '<path d="M60 46 L66 60 L60 72 L70 72"/></g>' +
    '<path fill="url(#raptor-hide)" stroke="#2A0A4A" stroke-width="1.4" stroke-linejoin="round" ' +
    'd="M2 38 L45 32 Q60 26 75 30 L86 20 Q90 12 100 13 L116 19 L116 24 L104 26 L100 28 ' +
    'Q92 32 88 40 Q80 50 64 50 Q52 50 44 44 L2 40 Z"/>' +
    '<g fill="#2A0A4A" opacity=".8">' +
    '<ellipse cx="22" cy="37.5" rx="2.6" ry="1.1"/><ellipse cx="34" cy="36" rx="3" ry="1.4"/>' +
    '<ellipse cx="50" cy="35" rx="3.4" ry="2"/><ellipse cx="62" cy="33" rx="3" ry="1.8"/>' +
    '<ellipse cx="58" cy="42" rx="3.6" ry="2.2"/><ellipse cx="72" cy="38" rx="3" ry="2"/>' +
    '<ellipse cx="80" cy="30" rx="2.2" ry="1.6"/></g>' +
    '<g fill="#FF2EC4"><circle cx="50" cy="35" r="1"/><circle cx="58" cy="42" r="1.1"/><circle cx="72" cy="38" r=".9"/></g>' +
    '<path d="M84 40 L90 46 L94 45" stroke="#2A0A4A" stroke-width="2.6" stroke-linecap="round" fill="none"/>' +
    '<ellipse cx="107" cy="23" rx="3" ry="1.4" fill="#FF2EC4" opacity=".7"/>' +
    '<circle cx="99" cy="17.5" r="4.6" fill="#fff" stroke="#2A0A4A" stroke-width="1"/>' +
    '<circle cx="99.6" cy="17.8" r="3.3" fill="url(#raptor-iris)"/>' +
    '<circle cx="98.4" cy="16.4" r="1.2" fill="#fff"/><circle cx="100.8" cy="19" r=".6" fill="#fff"/>' +
    '<path d="M95.5 13.5 L94 11.2 M98 12.6 L97.6 10 M100.8 12.8 L101.6 10.4" stroke="#2A0A4A" stroke-width="1" stroke-linecap="round"/>' +
    '</svg>';

  var SPARKLES = ['\u2726', '\u2605', '\u2665', '\u2727'];

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

  function dropSparkle(x, y) {
    var p = document.createElement('div');
    var color = RAINBOW[Math.floor(Math.random() * RAINBOW.length)];
    p.className = 'raptor-sparkle';
    p.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.color = color;
    p.style.textShadow = '0 0 6px ' + color;
    p.style.fontSize = (12 + Math.random() * 12) + 'px';
    document.body.appendChild(p);
    setTimeout(function () { p.remove(); }, 1800);
  }

  function release() {
    if (running) return;
    running = true;

    var r = document.createElement('div');
    r.className = 'raptor';
    r.innerHTML = raptorSvg + '<span class="bubble">rawr! \u2665</span>';
    document.body.appendChild(r);

    var tracker = reduceMotion ? null : setInterval(function () {
      var box = r.getBoundingClientRect();
      if (box.left > 0 && box.left < window.innerWidth) {
        dropSparkle(box.left + 10 + Math.random() * 60, box.top + 20 + Math.random() * 50);
      }
    }, 90);

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
