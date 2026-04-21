// Year
const yr = document.getElementById('year');
if(yr) yr.textContent = new Date().getFullYear();

// Nav scroll state + hero mode
const nav = document.getElementById('nav');
const hero = document.getElementById('hero');
function onScroll(){
  if(!nav) return;
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  if(hero){
    const heroBottom = hero.offsetHeight - 120;
    nav.classList.toggle('hero-mode', y < heroBottom);
  }
}
onScroll();
window.addEventListener('scroll', onScroll, {passive:true});

// Reveal on scroll
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  });
},{threshold:0.12, rootMargin:'0px 0px -60px 0px'});
document.querySelectorAll('.reveal').forEach(el=>io.observe(el));

// Card hover spotlight
document.querySelectorAll('[data-tilt]').forEach(card=>{
  card.addEventListener('mousemove',(e)=>{
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX-r.left)/r.width*100)+'%');
    card.style.setProperty('--my', ((e.clientY-r.top)/r.height*100)+'%');
  });
});

// Typing demo
const demos = [
  {
    q: "Røde vinterjakker under -20 °C",
    a: "Disse jakkene tåler rundt -20 °C, har god isolasjon og finnes i rødt. Foretrekker du kort eller lang modell?",
    products: true,
    link: "👉 Se alle røde vinterjakker"
  },
  {
    q: "Når kommer ordre #18274?",
    a: "Ordre #18274 ble sendt fra lageret i går og er på vei til deg. Forventet levering er torsdag mellom kl. 12 og 16.",
    products: false,
    link: "👉 Se sporingslenke"
  },
  {
    q: "Hvor er nærmeste butikk?",
    a: "Vår nærmeste butikk er i Oslo sentrum — åpent i dag til kl. 20. Vil du ha veibeskrivelse?",
    products: false,
    link: "👉 Åpne i kart"
  },
  {
    q: "Hvordan returnerer jeg et produkt?",
    a: "Du kan returnere innen 30 dager. Logg inn på Min side, velg ordren og trykk 'Returner' for å starte prosessen.",
    products: false,
    link: "👉 Gå til returer"
  }
];
const typingEl = document.getElementById('typing');
const answerEl = document.getElementById('demo-answer');
const productsEl = document.getElementById('demo-products');
const linkEl = document.querySelector('.demo-link');
let qIdx = 0, cIdx = 0, typing = true;

function applyResult(d){
  answerEl.textContent = d.a;
  if(linkEl) linkEl.textContent = d.link;
  if(productsEl){
    productsEl.style.display = d.products ? 'grid' : 'none';
  }
}

function loop(){
  const d = demos[qIdx];
  const q = d.q;
  if(typing){
    cIdx++;
    typingEl.textContent = q.slice(0,cIdx);
    if(cIdx >= q.length){
      typing = false;
      answerEl.style.opacity = 0;
      if(productsEl) productsEl.style.opacity = 0;
      setTimeout(()=>{
        applyResult(d);
        answerEl.style.transition='opacity .5s';
        answerEl.style.opacity = 1;
        if(productsEl){productsEl.style.transition='opacity .5s';productsEl.style.opacity=1}
      }, 300);
      setTimeout(loop, 4200);
      return;
    }
    setTimeout(loop, 55 + Math.random()*50);
  } else {
    cIdx--;
    typingEl.textContent = q.slice(0,cIdx);
    if(cIdx <= 0){
      typing = true;
      qIdx = (qIdx+1) % demos.length;
    }
    setTimeout(loop, 22);
  }
}
if(typingEl) loop();

// Hero video: force seamless loop (browser-agnostic fallback)
const heroVideo = document.querySelector('.hero-video');
if(heroVideo){
  heroVideo.loop = true;
  heroVideo.muted = true;
  heroVideo.playsInline = true;
  heroVideo.playbackRate = 0.82;
  heroVideo.addEventListener('loadedmetadata', () => { heroVideo.playbackRate = 0.82; });
  const restart = () => {
    heroVideo.currentTime = 0;
    const p = heroVideo.play();
    if(p && typeof p.catch === 'function') p.catch(()=>{});
  };
  heroVideo.addEventListener('ended', restart);
  // Some browsers freeze near end without firing 'ended' — pre-emptively loop
  heroVideo.addEventListener('timeupdate', () => {
    if(heroVideo.duration && heroVideo.currentTime >= heroVideo.duration - 0.15){
      restart();
    }
  });
  // Kick off playback in case autoplay was deferred
  const tryPlay = () => {
    const p = heroVideo.play();
    if(p && typeof p.catch === 'function') p.catch(()=>{});
  };
  if(heroVideo.readyState >= 2) tryPlay();
  else heroVideo.addEventListener('loadeddata', tryPlay, {once:true});
}

// Dashboard mockup: count-up + live updates
(function(){
  const mock = document.querySelector('.dash-mock');
  if(!mock) return;

  const state = {
    samtaler: 2847, meldinger: 18392, session: 252, eng: 73,
    bars: [1284, 987, 712, 541, 382]
  };

  const fmtInt = n => Math.round(n).toLocaleString('nb-NO').replace(/,/g,' ');
  const fmtTime = s => `${Math.floor(s/60)}m ${Math.round(s%60)}s`;
  const fmtPct = n => `${Math.round(n)}%`;
  const fmtFor = (el, n) => {
    const f = el.dataset.fmt;
    if(f === 'int') return fmtInt(n);
    if(f === 'time') return fmtTime(n);
    if(f === 'pct') return fmtPct(n);
    return fmtInt(n);
  };

  // Count-up animation (with cancellation of in-flight tweens on same el)
  const tween = (el, to, dur=1400) => {
    const token = (el._tweenToken = (el._tweenToken||0) + 1);
    const from = parseFloat(el.dataset.current || 0);
    const start = performance.now();
    const step = (now) => {
      if(el._tweenToken !== token) return;
      const t = Math.min(1, (now-start)/dur);
      const eased = 1 - Math.pow(1-t, 3);
      const v = from + (to - from) * eased;
      el.textContent = fmtFor(el, v);
      el.dataset.current = v;
      if(t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  // Bar fill animation
  const setBar = (fill, num, value, max) => {
    fill.style.width = (value / max * 100) + '%';
    tween(num, value, 800);
  };

  // Line chart
  const chartLine = document.getElementById('dashChartLine');
  const chartFill = document.getElementById('dashChartFill');
  const chartDot = document.getElementById('dashChartDot');
  let chartPoints = [110,95,88,75,80,62,68,52,48,38,44,30,35,22,28,18,24];
  const renderChart = () => {
    const n = chartPoints.length;
    const pts = chartPoints.map((y,i) => [i * (320/(n-1)), y]);
    const d = pts.map((p,i) => (i===0?'M':'L') + p[0].toFixed(1) + ' ' + p[1].toFixed(1)).join(' ');
    const fillD = d + ` L320 140 L0 140 Z`;
    chartLine.setAttribute('d', d);
    chartFill.setAttribute('d', fillD);
    const last = pts[pts.length-1];
    chartDot.setAttribute('cx', last[0]);
    chartDot.setAttribute('cy', last[1]);
  };

  const flash = (el) => {
    el.classList.remove('dash-flash');
    void el.offsetWidth;
    el.classList.add('dash-flash');
  };

  let started = false;
  const start = () => {
    if(started) return; started = true;

    // Count up KPIs
    document.querySelectorAll('#dashKpis .dash-kpi-val').forEach(el => {
      tween(el, parseFloat(el.dataset.count), 1500);
    });

    // Fill bars
    const bars = document.querySelectorAll('#dashBars .dash-bar');
    const maxVal = state.bars[0];
    bars.forEach((bar,i) => {
      const fill = bar.querySelector('.dash-bar-fill');
      const num = bar.querySelector('.dash-bar-num');
      setTimeout(() => setBar(fill, num, state.bars[i], maxVal), 200 + i*80);
    });

    // Draw chart
    renderChart();

    // Live updates every 2-3s
    setInterval(() => {
      // Bump samtaler (+1-3) and meldinger (+4-12)
      const dChats = 1 + Math.floor(Math.random()*3);
      const dMsg = 4 + Math.floor(Math.random()*9);
      state.samtaler += dChats;
      state.meldinger += dMsg;

      const samEl = document.querySelector('[data-count="2847"]');
      const msgEl = document.querySelector('[data-count="18392"]');
      if(samEl){ tween(samEl, state.samtaler, 500); flash(samEl.closest('.dash-kpi')); }
      if(msgEl){ tween(msgEl, state.meldinger, 500); }

      // Occasionally jitter session length (+/- 3s)
      if(Math.random() < 0.5){
        state.session += (Math.random()-0.5)*6;
        state.session = Math.max(220, Math.min(290, state.session));
        const sesEl = document.querySelector('[data-fmt="time"]');
        if(sesEl) tween(sesEl, state.session, 600);
      }

      // Occasionally bump engagement (+/- 1)
      if(Math.random() < 0.3){
        state.eng += (Math.random()<.5 ? 1 : -1);
        state.eng = Math.max(68, Math.min(78, state.eng));
        const engEl = document.querySelector('[data-fmt="pct"]');
        if(engEl) tween(engEl, state.eng, 600);
      }

      // Bump a random bar
      if(Math.random() < 0.6){
        const idx = Math.floor(Math.random()*state.bars.length);
        state.bars[idx] += 1 + Math.floor(Math.random()*4);
        const newMax = Math.max(...state.bars);
        const allBars = document.querySelectorAll('#dashBars .dash-bar');
        allBars.forEach((b,i) => {
          setBar(b.querySelector('.dash-bar-fill'), b.querySelector('.dash-bar-num'), state.bars[i], newMax);
        });
      }

      // Shift line chart: drop oldest, add new point
      if(Math.random() < 0.5){
        const last = chartPoints[chartPoints.length-1];
        const next = Math.max(12, Math.min(120, last + (Math.random()-0.5)*14));
        chartPoints = [...chartPoints.slice(1), next];
        renderChart();
      }
    }, 2200);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if(e.isIntersecting){ start(); obs.disconnect(); } });
  }, {threshold: 0.2});
  obs.observe(mock);
})();

// Parallax orbs in hero
const orbA = document.querySelector('.orb-a');
const orbB = document.querySelector('.orb-b');
window.addEventListener('scroll', ()=>{
  const y = window.scrollY;
  if(y < window.innerHeight && orbA && orbB){
    orbA.style.transform = `translate(${y*0.15}px, ${y*0.2}px)`;
    orbB.style.transform = `translate(${-y*0.1}px, ${y*0.15}px)`;
  }
}, {passive:true});
