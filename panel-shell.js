// ===== Tema: les fra localStorage, brukes på tvers av alle sider =====
(function(){
  const saved = localStorage.getItem('mx-theme') || 'default';
  document.documentElement.setAttribute('data-theme', saved);

  // Eksponer global switcher som settings-siden kan kalle
  const VALID_THEMES = ['default', 'warm', 'warm-purple'];
  window.setMxTheme = (name) => {
    const v = VALID_THEMES.includes(name) ? name : 'default';
    localStorage.setItem('mx-theme', v);
    document.documentElement.setAttribute('data-theme', v);
    document.querySelectorAll('[data-theme-choice]').forEach(c => {
      c.classList.toggle('active', c.dataset.themeChoice === v);
    });
  };
})();

// Felles sidebar — rendret fra ett sted, aktiv-state via data-active på <aside>.
(function(){
  const aside = document.querySelector('.panel-side');
  if(!aside) return;

  const active = aside.dataset.active || '';

  // Lucide-style line icons (24x24 viewBox)
  const I = {
    // Dashbord — gauge/speedometer
    dashboard: `<svg viewBox="0 0 24 24"><path d="M12 14l3.5-5.5"/><path d="M3 12a9 9 0 0 1 18 0"/><path d="M3 12v2a9 9 0 0 0 18 0v-2"/><circle cx="12" cy="14" r="1.6"/></svg>`,
    // Samtalelogger — stack of chat bubbles
    chat: `<svg viewBox="0 0 24 24"><path d="M8 9h8"/><path d="M8 13h5"/><path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H9l-4 4V7z"/></svg>`,
    // Leads — magnet (attracting prospects)
    leads: `<svg viewBox="0 0 24 24"><path d="M6 3v8a6 6 0 0 0 12 0V3"/><path d="M6 3h4"/><path d="M14 3h4"/><path d="M6 7h4"/><path d="M14 7h4"/></svg>`,

    // Verktøy (gruppe) — toolbox
    tools: `<svg viewBox="0 0 24 24"><path d="M3 9a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><path d="M3 13h18"/></svg>`,
    // GPT-bygger — sparkles (AI/magic)
    gpt: `<svg viewBox="0 0 24 24"><path d="M12 3l1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6z"/><path d="M19 14l.8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z"/><path d="M5 4l.5 1.5L7 6l-1.5.5L5 8l-.5-1.5L3 6l1.5-.5z"/></svg>`,
    // Chat-assistent — chat bubble (circle, distinct from logs)
    bubble: `<svg viewBox="0 0 24 24"><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8z"/></svg>`,
    // Popup-søk — command key
    command: `<svg viewBox="0 0 24 24"><path d="M18 3a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3H6a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3V6a3 3 0 0 0-3-3 3 3 0 0 0-3 3 3 3 0 0 0 3 3h12a3 3 0 0 0 3-3 3 3 0 0 0-3-3z"/></svg>`,
    // Smart-søk — magnifying glass with spark
    search: `<svg viewBox="0 0 24 24"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m21 21-5.4-5.4"/><path d="M18 4l.5 1.5L20 6l-1.5.5L18 8l-.5-1.5L16 6l1.5-.5z"/></svg>`,

    // Treningsdata — book/open library
    book: `<svg viewBox="0 0 24 24"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`,
    // Test chat — flask / beaker
    flask: `<svg viewBox="0 0 24 24"><path d="M9 2h6"/><path d="M10 2v6L5 19a2 2 0 0 0 2 3h10a2 2 0 0 0 2-3l-5-11V2"/><path d="M6.5 13h11"/></svg>`,

    // Tilganger — users (team)
    users: `<svg viewBox="0 0 24 24"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>`,
    // Innstillinger — sliders (cleaner than the cog)
    sliders: `<svg viewBox="0 0 24 24"><line x1="4" y1="6" x2="11" y2="6"/><line x1="15" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="7" y2="12"/><line x1="11" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="14" y2="18"/><line x1="18" y1="18" x2="20" y2="18"/><circle cx="13" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="16" cy="18" r="2"/></svg>`,
    // Din bedrift — building/storefront
    building: `<svg viewBox="0 0 24 24"><path d="M3 21h18"/><path d="M5 21V7l7-4 7 4v14"/><path d="M9 9h2"/><path d="M13 9h2"/><path d="M9 13h2"/><path d="M13 13h2"/><path d="M10 21v-4h4v4"/></svg>`,
    // Din agent — persona (user with spark)
    persona: `<svg viewBox="0 0 24 24"><circle cx="11" cy="8" r="4"/><path d="M3 21a8 8 0 0 1 14.5-4.7"/><path d="M19 14l.7 2L22 17l-2.3.8L19 20l-.7-2.2L16 17l2.3-1z"/></svg>`,
  };

  const ico = (key) => `<span class="ico">${I[key] || ''}</span>`;

  aside.innerHTML = `
    <a href="index.html" class="panel-brand">
      <span class="panel-brand-mark">M</span>
      <div>
        <div class="panel-brand-text">MotherX</div>
        <div class="panel-brand-sub">Workspace · Demo</div>
      </div>
    </a>

    <nav class="panel-nav">
      <a href="din-bedrift.html" data-key="din-bedrift" class="panel-nav-pin">${ico('building')}Din bedrift</a>

      <div class="panel-nav-section">Oversikt</div>
      <a href="panel.html"      data-key="dashboard">${ico('dashboard')}Dashbord</a>
      <a href="chat-logs.html"  data-key="chat-logs">${ico('chat')}Samtalelogger</a>
      <a href="leads.html"      data-key="leads">${ico('leads')}Leads <span class="badge">12</span></a>

      <details class="panel-nav-group" data-group="verktoy" open>
        <summary>
          ${ico('tools')}Verktøy
          <span class="badge">3</span>
          <span class="chev">▾</span>
        </summary>
        <div class="panel-nav-sub">
          <a href="gpt-bygger.html"     data-key="gpt-bygger">${ico('gpt')}GPT-bygger</a>
          <a href="chat-assistent.html" data-key="chat-assistent">${ico('bubble')}Chat-assistent</a>
          <a href="smart-sok.html"      data-key="smart-sok">${ico('search')}Smart-søk</a>
        </div>
      </details>

      <div class="panel-nav-section">Bygge</div>
      <a href="din-agent.html"    data-key="din-agent">${ico('persona')}Din agent</a>
      <a href="knowledge.html"    data-key="knowledge">${ico('book')}Treningsdata</a>
      <a href="chat-testing.html" data-key="chat-testing">${ico('flask')}Test chat</a>

      <div class="panel-nav-section">Team</div>
      <a href="members.html"  data-key="members">${ico('users')}Tilganger</a>
      <a href="settings.html" data-key="settings">${ico('sliders')}Innstillinger</a>
    </nav>

    <div class="panel-user">
      <div class="panel-avatar">T</div>
      <div style="min-width:0;flex:1">
        <div class="panel-user-name">Tor Kjetil</div>
        <div class="panel-user-role">Admin · GetOnNet</div>
      </div>
    </div>
  `;

  if(active){
    const a = aside.querySelector(`a[data-key="${active}"]`);
    if(a) a.classList.add('active');
    if(a && a.closest('.panel-nav-group')){
      a.closest('.panel-nav-group').setAttribute('open','');
    }
  }
})();
