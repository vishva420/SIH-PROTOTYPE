const $ = (s, scope = document) => scope.querySelector(s);
const $$ = (s, scope = document) => [...scope.querySelectorAll(s)];

const translations = {
  en: { demo: 'DEMO MODE', check: 'CHECK MY AREA', report: 'REPORT A PROBLEM', run: 'RUN DEMO', areaTitle: 'Check Your Area', reportTitle: 'Report a Water Problem' },
  ta: { demo: 'டெமோ பயன்முறை', check: 'என் பகுதியை பார்க்கவும்', report: 'பிரச்சினையை தெரிவிக்கவும்', run: 'டெமோ இயக்கவும்', areaTitle: 'உங்கள் பகுதியை பார்க்கவும்', reportTitle: 'நீர் பிரச்சினையை தெரிவிக்கவும்' }
};
let language = 'en';

$('#languageBtn').addEventListener('click', () => {
  language = language === 'en' ? 'ta' : 'en';
  $$('[data-i18n]').forEach(el => el.textContent = translations[language][el.dataset.i18n]);
  $('#languageBtn').innerHTML = language === 'en' ? 'English <span>|</span> தமிழ்' : 'தமிழ் <span>|</span> English';
});

$('.menu-toggle').addEventListener('click', e => {
  const links = $('.nav-links'); links.classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', links.classList.contains('open'));
});
$$('.nav-links a').forEach(a => a.addEventListener('click', () => $('.nav-links').classList.remove('open')));

const observer = new IntersectionObserver(entries => entries.forEach(entry => {
  if (!entry.isIntersecting) return;
  entry.target.classList.add('visible');
  if (entry.target.classList.contains('counter')) animateCounter(entry.target);
  if (entry.target.id === 'workflow') entry.target.classList.add('active');
  observer.unobserve(entry.target);
}), { threshold: .16 });
$$('.reveal, .counter, #workflow').forEach(el => observer.observe(el));
function animateCounter(el) { let start = 0, target = +el.dataset.target; const tick = () => { start += Math.ceil(target / 30); if (start < target) { el.textContent = start; requestAnimationFrame(tick); } else el.textContent = target + '+'; }; tick(); }

const community = {
  Dibrugarh: { risk: 'HIGH RISK', cls: 'high', reports: 12, health: 8, env: 'Yes', note: 'Potential risk needs verification.' },
  Chabua: { risk: 'SAFE', cls: 'safe', reports: 2, health: 0, env: 'No', note: 'No priority signals in this demo view.' },
  Naharkatiya: { risk: 'WATCH', cls: 'watch', reports: 5, health: 2, env: 'Yes', note: 'Signals are being watched.' },
  Tinsukia: { risk: 'SAFE', cls: 'safe', reports: 1, health: 0, env: 'No', note: 'No priority signals in this demo view.' },
  Moran: { risk: 'WATCH', cls: 'watch', reports: 4, health: 1, env: 'Yes', note: 'Signals are being watched.' }
};
$$('.map-marker').forEach(marker => marker.addEventListener('click', () => {
  $$('.map-marker').forEach(m => m.classList.remove('selected')); marker.classList.add('selected');
  const d = community[marker.dataset.place], p = $('#communityPanel');
  p.innerHTML = `<button class="close-panel" aria-label="Close">×</button><span class="panel-risk ${d.cls}">${d.risk}</span><h3>${marker.dataset.place}</h3><p>${d.note}</p><div class="panel-data"><span>Water Reports <b>${d.reports}</b></span><span>Health Signals <b>${d.health}</b></span><span>Environmental <b>${d.env}</b></span></div><button class="text-button" id="viewCommunity">VIEW COMMUNITY <span>→</span></button>`;
  p.style.display = 'block';
  $('.close-panel', p).onclick = () => p.style.display = 'none';
}));

let selectedIssue = false, stage = 1;
$$('.issue-grid button').forEach(btn => btn.addEventListener('click', () => { $$('.issue-grid button').forEach(x => x.classList.remove('selected')); btn.classList.add('selected'); selectedIssue = true; }));
$$('.next-stage').forEach(btn => btn.addEventListener('click', () => {
  if (stage === 1 && !selectedIssue) { $$('.issue-grid')[0].animate([{transform:'translateX(-5px)'},{transform:'translateX(5px)'},{transform:'translateX(0)'}], 250); return; }
  $('.form-stage.active').classList.remove('active'); stage++; $(`.stage-${['one','two','three','four'][stage - 1]}`).classList.add('active');
  $$('.report-steps span').slice(0, stage).forEach(x => x.classList.add('on'));
}));
$('#voiceButton').addEventListener('click', e => { e.currentTarget.classList.toggle('recording'); e.currentTarget.querySelector('b').textContent = e.currentTarget.classList.contains('recording') ? ' LISTENING...' : ' SPEAK'; });
$('#reportForm').addEventListener('submit', e => { e.preventDefault(); $('#successModal').classList.add('show'); $('#successModal').setAttribute('aria-hidden','false'); });
const closeModal = modal => { modal.classList.remove('show'); modal.setAttribute('aria-hidden','true'); };
$$('.modal-close').forEach(btn => btn.addEventListener('click', () => closeModal(btn.closest('.modal-backdrop'))));
$('.close-success').addEventListener('click', () => closeModal($('#successModal')));
$('#healthOpen').addEventListener('click', () => $('#healthModal').classList.add('show'));
$('.close-health').addEventListener('click', () => closeModal($('#healthModal')));
$$('.symptom-grid button').forEach(x => x.addEventListener('click', () => x.classList.toggle('selected')));
let qty = 3; $('.qty-minus').onclick = () => { qty = Math.max(1, qty - 1); $('#qtyValue').textContent = qty; }; $('.qty-plus').onclick = () => { qty++; $('#qtyValue').textContent = qty; };

$('#viewDetails').addEventListener('click', () => document.querySelector('#map').scrollIntoView({behavior:'smooth'}));
$('#viewResponse').addEventListener('click', () => { $('#responsePanel').classList.toggle('show'); $('#viewResponse').innerHTML = $('#responsePanel').classList.contains('show') ? 'RESPONSE READY ✓' : 'VIEW RESPONSE <span>→</span>'; });
$$('.prioritize').forEach(btn => btn.addEventListener('click', () => { btn.classList.toggle('done'); btn.textContent = btn.classList.contains('done') ? '✓ PRIORITIZED' : 'PRIORITIZE'; }));

const demoSteps = ['Normal community picture', 'Community reports increase', 'Data check in progress', 'Risk analysis detects a signal', 'HIGH RISK', 'GIS alert is shown', 'Verification required', 'Early warning', 'Targeted action ready'];
let demoTimer; $('#runDemo').addEventListener('click', runDemo);
function runDemo(){ const overlay = $('#demoOverlay'), text = $('#demoText'), bar = $('.demo-progress i'); overlay.classList.add('show'); let index = 0; clearInterval(demoTimer); bar.style.width = '0%'; text.textContent = demoSteps[0]; demoTimer = setInterval(() => { index++; if(index >= demoSteps.length) { clearInterval(demoTimer); setTimeout(() => overlay.classList.remove('show'), 1200); return; } text.textContent = demoSteps[index]; bar.style.width = `${(index / (demoSteps.length - 1)) * 100}%`; if(index === 4) { $('#riskCard').animate([{transform:'scale(1)'},{transform:'scale(1.04)'},{transform:'scale(1)'}], 700); document.querySelector('#area').scrollIntoView({behavior:'smooth'}); } if(index === 5) document.querySelector('#map').scrollIntoView({behavior:'smooth'}); if(index === 8) document.querySelector('.response-section').scrollIntoView({behavior:'smooth'}); }, 1100); }
$('#closeDemo').addEventListener('click', () => { clearInterval(demoTimer); $('#demoOverlay').classList.remove('show'); });

