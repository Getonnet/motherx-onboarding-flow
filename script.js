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
