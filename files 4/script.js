"use strict";
const $ = id => document.getElementById(id);
const el = (t, c, txt) => { const e = document.createElement(t); if (c) e.className = c; if (txt != null) e.textContent = txt; return e; };

/* ---------- TABS ---------- */
const tabBtns = [...document.querySelectorAll('#tabs button')], panels = [...document.querySelectorAll('.tab')];
function showTab(id) {
  if (!panels.some(p => p.id === id)) id = 'overview';
  panels.forEach(p => p.hidden = p.id !== id);
  tabBtns.forEach(b => { const on = b.dataset.tab === id; b.classList.toggle('on', on); b.setAttribute('aria-selected', on); });
  if (id === 'curves') drawCurve();
  if (id !== 'game' && game.running) { game.running = false; game.paused = true; }
  if (id === 'game' && game.paused) { game.paused = false; game.running = true; lastT = performance.now(); requestAnimationFrame(loop); }
  $('tabs').classList.remove('open'); $('tabs').previousElementSibling.setAttribute('aria-expanded', 'false');
  window.scrollTo(0, 0);
}
tabBtns.forEach(b => b.addEventListener('click', () => { location.hash = b.dataset.tab; }));
document.querySelectorAll('[data-go]').forEach(b => b.addEventListener('click', () => { location.hash = b.dataset.go; }));
window.addEventListener('hashchange', () => showTab(location.hash.slice(1)));
document.querySelector('.menu-toggle').addEventListener('click', e => { const o = $('tabs').classList.toggle('open'); e.currentTarget.setAttribute('aria-expanded', o); });

/* ---------- GALLERY ---------- */
for (const p of galleryPhotos) {
  const card = el('article', 'photo-card'); card.dataset.category = p.category;
  const btn = el('button', 'photo-open'); btn.type = 'button'; btn.setAttribute('aria-label', 'Open ' + p.title);
  const img = el('img'); img.src = p.src; img.alt = p.title + ': ' + p.description; img.loading = 'lazy';
  img.addEventListener('error', () => btn.classList.add('broken'));
  btn.append(img); btn.addEventListener('click', () => openPhoto(p));
  const info = el('div', 'info'); info.append(el('span', '', p.author), el('h3', '', p.title), el('p', '', p.description));
  card.append(btn, info); $('photo-grid').append(card);
}
document.querySelectorAll('.filter').forEach(f => f.addEventListener('click', () => {
  document.querySelectorAll('.filter').forEach(x => { x.classList.toggle('active', x === f); x.setAttribute('aria-pressed', x === f); });
  document.querySelectorAll('.photo-card').forEach(c => c.hidden = f.dataset.filter !== 'all' && c.dataset.category !== f.dataset.filter);
}));
const lb = $('lightbox'); let prevFocus = null;
function openPhoto(p) { prevFocus = document.activeElement; $('lightbox-image').src = p.src; $('lightbox-image').alt = p.title; $('lightbox-caption').textContent = p.title + ' — ' + p.description; lb.hidden = false; $('lightbox-close').focus(); }
function closePhoto() { lb.hidden = true; $('lightbox-image').removeAttribute('src'); if (prevFocus) prevFocus.focus(); }
$('lightbox-close').addEventListener('click', closePhoto); lb.addEventListener('click', e => { if (e.target === lb) closePhoto(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape' && !lb.hidden) closePhoto(); });

/* ---------- USEFUL VS WEAK ---------- */
const uses = [
  ['☀️ Solar panels', 'Clean electricity from sunny roofs; low running cost.', 'Only works in daylight, needs storage, and making panels uses energy.'],
  ['🚗 Cars', 'Flexible, door to door, good for rural trips.', 'Petrol and diesel cars emit CO₂ and cause traffic. Electric cars help, but still need batteries and space.'],
  ['🚆 Trains and buses', 'Low emissions per passenger and no parking problems.', 'Need frequent services and good links to the final destination.'],
  ['🚲 Bikes', 'Zero emissions, cheap and healthy.', 'Need safe lanes; rain, heat and hills put people off.'],
  ['🌳 Trees', 'Shade, cooler air, water storage and CO₂ capture.', 'Take years to grow and need water in droughts.'],
  ['🏠 Insulation and heat pumps', 'Use much less energy to heat and cool.', 'High upfront cost, and old buildings are harder to upgrade.']
];
for (const [n, g, b] of uses) { const c = el('article', 'card use'); c.append(el('h3', '', n), el('b', 'good', 'Useful'), el('p', '', g), el('b', 'bad', 'Weak spot'), el('p', '', b)); $('uses').append(c); }

/* ---------- PLEDGES ---------- */
const pledgeList = ['I will walk, cycle or use public transport once a week', 'I will switch off devices and lights I do not use', 'I will repair or reuse before buying new', 'I will avoid wasting food', 'I will plant or protect a tree or green space', 'I will tell a friend about SDG 13'];
function updatePledges() { const n = document.querySelectorAll('#pledges input:checked').length; $('pledge-bar').style.width = n / pledgeList.length * 100 + '%'; $('pledge-text').textContent = n + ' of ' + pledgeList.length + ' pledges' + (n === pledgeList.length ? ' — great work!' : ''); }
pledgeList.forEach(t => { const l = el('label'); const i = el('input'); i.type = 'checkbox'; i.addEventListener('change', updatePledges); l.append(i, t); $('pledges').append(l); });

/* ---------- CURVES ---------- */
// Values are rounded approximations of published datasets (NASA GISS, NOAA Mauna Loa, IPCC pathways). Check the sources before submitting.
const gameCurve = [];
const curves = {
  co2: { title: 'CO₂ in the air (ppm)', xl: 'year', note: 'Rounded values from the Mauna Loa observatory record. Source: NOAA / Scripps.', s: [{ n: 'CO₂ ppm', p: [[1960, 317], [1970, 326], [1980, 339], [1990, 354], [2000, 369], [2010, 389], [2020, 414], [2024, 423]] }] },
  temp: { title: 'Global temperature change (°C, vs 1951–1980)', xl: 'year', note: 'Rounded values based on NASA GISS. Source: climate.nasa.gov.', s: [{ n: '°C', p: [[1880, -.17], [1900, -.08], [1920, -.27], [1940, .12], [1960, -.03], [1980, .26], [2000, .42], [2010, .72], [2020, 1.02], [2024, 1.28]] }] },
  path: { title: 'Emissions pathways (index, 2020 = 100)', xl: 'year', note: 'Illustrative only. The 1.5 °C path means roughly halving emissions by 2030 and reaching net zero around 2050 (IPCC).', s: [{ n: '1.5 °C path', p: [[2020, 100], [2030, 57], [2040, 25], [2050, 0]] }, { n: 'Current policies (illustrative)', p: [[2020, 100], [2030, 98], [2040, 95], [2050, 90]] }] },
  game: { title: 'Your Climate Clash match: climate health (%)', xl: 'seconds', note: 'Play a match in the Climate Clash tab. This curve follows how strong the good side is.', s: [{ n: 'Climate health %', p: gameCurve }] }
};
let curKey = 'co2';
for (const k in curves) { const b = el('button', 'filter' + (k === curKey ? ' active' : ''), { co2: 'CO₂', temp: 'Temperature', path: 'Pathways', game: 'My game' }[k]); b.addEventListener('click', () => { curKey = k; document.querySelectorAll('#curve-btns .filter').forEach(x => x.classList.toggle('active', x === b)); $('curve-slider').value = 100; drawCurve(); }); $('curve-btns').append(b); }
const NS = 'http://www.w3.org/2000/svg', sv = (t, a) => { const e = document.createElementNS(NS, t); for (const k in a) e.setAttribute(k, a[k]); return e; };
function interp(p, x) { if (!p.length) return null; if (x <= p[0][0]) return p[0][1]; for (let i = 1; i < p.length; i++) if (x <= p[i][0]) { const [x0, y0] = p[i - 1], [x1, y1] = p[i]; return x1 === x0 ? y1 : y0 + (y1 - y0) * (x - x0) / (x1 - x0); } return p[p.length - 1][1]; }
function drawCurve() {
  const c = curves[curKey], svg = $('chart'); svg.replaceChildren(); $('curve-title').textContent = c.title; $('curve-note').textContent = c.note;
  const all = c.s.flatMap(s => s.p); if (!all.length) { const t = sv('text', { x: 300, y: 150, 'text-anchor': 'middle' }); t.textContent = 'No data yet. Play a match first!'; svg.append(t); $('curve-read').textContent = ''; return; }
  let x0 = Math.min(...all.map(a => a[0])), x1 = Math.max(...all.map(a => a[0])), y0 = Math.min(...all.map(a => a[1])), y1 = Math.max(...all.map(a => a[1]));
  if (curKey === 'game') { y0 = 0; y1 = 100; } if (x1 === x0) x1 = x0 + 1; if (y1 === y0) y1 = y0 + 1;
  const X = v => 50 + (v - x0) / (x1 - x0) * 520, Y = v => 260 - (v - y0) / (y1 - y0) * 230;
  for (let i = 0; i <= 4; i++) { const v = y0 + (y1 - y0) * i / 4, y = Y(v); svg.append(sv('line', { x1: 50, x2: 570, y1: y, y2: y, class: 'ax' })); const t = sv('text', { x: 44, y: y + 4, 'text-anchor': 'end' }); t.textContent = Math.round(v * 10) / 10; svg.append(t); }
  for (let i = 0; i <= 4; i++) { const v = x0 + (x1 - x0) * i / 4, t = sv('text', { x: X(v), y: 282, 'text-anchor': 'middle' }); t.textContent = Math.round(v); svg.append(t); }
  c.s.forEach((s, i) => svg.append(sv('polyline', { points: s.p.map(q => X(q[0]) + ',' + Y(q[1])).join(' '), class: 'l' + i })));
  const sx = x0 + (x1 - x0) * $('curve-slider').value / 100; svg.append(sv('line', { x1: X(sx), x2: X(sx), y1: 30, y2: 260, class: 'mk' }));
  $('curve-read').textContent = (c.xl === 'year' ? 'Year ' : 'Second ') + Math.round(sx) + ': ' + c.s.map(s => s.n + ' = ' + (Math.round(interp(s.p, sx) * 10) / 10)).join(' | ');
}
$('curve-slider').addEventListener('input', drawCurve);

/* ---------- CLIMATE CLASH GAME ---------- */
const GOOD = [
  { e: '🚲', n: 'Cyclists', c: 2, hp: 60, d: 9, sp: 70, r: 20, cd: .7, k: 2 }, { e: '🌳', n: 'Forest', c: 3, hp: 260, d: 8, sp: 28, r: 22, cd: 1, k: 1 },
  { e: '☀️', n: 'Solar Squad', c: 3, hp: 110, d: 16, sp: 40, r: 60, cd: 1, k: 1 }, { e: '🌬️', n: 'Wind Turbine', c: 4, hp: 200, d: 30, sp: 22, r: 95, cd: 1.3, k: 1 },
  { e: '🚆', n: 'E-Train', c: 5, hp: 320, d: 38, sp: 48, r: 24, cd: 1.1, k: 1 }, { e: '♻️', n: 'Recyclers', c: 3, hp: 90, d: 12, sp: 44, r: 22, cd: .8, k: 2 },
  { e: '🏠', n: 'Insulation', c: 2, hp: 180, d: 5, sp: 26, r: 20, cd: 1, k: 1 }, { e: '💧', n: 'Rain Garden', c: 3, hp: 140, d: 18, sp: 34, r: 50, cd: 1, k: 1 }];
const BAD = [
  { e: '🏭', n: 'Coal Plant', c: 5, hp: 300, d: 26, sp: 24, r: 26, cd: 1.1, k: 1 }, { e: '🚗', n: 'Traffic Jam', c: 3, hp: 90, d: 14, sp: 55, r: 20, cd: .8, k: 2 },
  { e: '☁️', n: 'Smog Cloud', c: 3, hp: 110, d: 15, sp: 36, r: 70, cd: 1, k: 1 }, { e: '🔥', n: 'Wildfire', c: 3, hp: 70, d: 22, sp: 64, r: 20, cd: .9, k: 1 },
  { e: '🗑️', n: 'Waste Pile', c: 3, hp: 240, d: 8, sp: 28, r: 22, cd: 1, k: 1 }, { e: '🛢️', n: 'Oil Spill', c: 3, hp: 150, d: 20, sp: 32, r: 40, cd: 1, k: 1 }];
const cv = $('arena'), cx = cv.getContext('2d'), W = 360, H = 560, LANES = [90, 270], MATCH = 180;
const game = { running: false };
let units, towers, fx, elix, eElix, queue, hand, sel, tLeft, sampleT, lastT;

function newTower(side, x, y, king) { const hp = king ? 700 : 450; return { side, x, y, hp, mhp: hp, king, t: 0 }; }
function startGame() {
  units = []; fx = []; sel = -1; tLeft = MATCH; sampleT = 0; elix = 5; eElix = 4; gameCurve.length = 0; gameCurve.push([0, 50]);
  towers = [newTower('p', 90, 450), newTower('p', 270, 450), newTower('p', 180, 510, 1), newTower('e', 90, 110), newTower('e', 270, 110), newTower('e', 180, 50, 1)];
  queue = GOOD.map((_, i) => i).sort(() => Math.random() - .5); hand = queue.splice(0, 4);
  $('gmsg').hidden = true; $('gstart').textContent = 'Restart match'; renderHand(); game.running = true; lastT = performance.now(); requestAnimationFrame(loop);
}
function renderHand() {
  const h = $('hand'); h.replaceChildren();
  hand.forEach((gi, slot) => { const g = GOOD[gi], b = el('button'); b.type = 'button'; b.dataset.slot = slot; b.append(el('span', '', g.e), el('b', '', g.n), el('small', '', '⚡' + g.c)); b.addEventListener('click', () => { sel = sel === slot ? -1 : slot; renderHand(); }); if (slot === sel) b.classList.add('sel'); if (g.c > elix) b.classList.add('off'); h.append(b); });
}
function spawn(side, card, x, y) { for (let i = 0; i < card.k; i++) units.push({ side, e: card.e, hp: card.hp, mhp: card.hp, d: card.d, sp: card.sp, r: card.r, cd: card.cd, t: 0, x: x + (i - (card.k - 1) / 2) * 22, y }); }
cv.addEventListener('pointerdown', ev => {
  if (!game.running || sel < 0) return; const rc = cv.getBoundingClientRect(), x = (ev.clientX - rc.left) * W / rc.width, y = (ev.clientY - rc.top) * H / rc.height;
  const g = GOOD[hand[sel]]; if (y < 300 || g.c > elix) return;
  elix -= g.c; spawn('p', g, Math.max(20, Math.min(W - 20, x)), Math.min(H - 70, y));
  queue.push(hand[sel]); hand[sel] = queue.shift(); sel = -1; renderHand();
});
const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
function target(u) {
  const foes = u.side === 'p' ? 'e' : 'p'; let best = null, bd = 85;
  for (const o of units) if (o.side === foes && o.hp > 0) { const d = dist(u, o); if (d < bd) { bd = d; best = o; } }
  if (best) return { o: best, rr: u.r + 8 };
  const ts = towers.filter(t => t.side === foes && t.hp > 0); const pr = ts.filter(t => !t.king); const pool = pr.length ? pr : ts;
  pool.sort((a, b) => Math.abs(a.x - u.x) - Math.abs(b.x - u.x)); return { o: pool[0], rr: u.r + 22 };
}
function hit(from, to, d) { to.hp -= d; fx.push({ a: from, b: to, ttl: .12 }); }
function update(dt) {
  tLeft -= dt; elix = Math.min(10, elix + dt / 1.6); eElix = Math.min(10, eElix + dt / 1.9);
  if (eElix >= 3 && Math.random() < dt * .8) { const aff = BAD.filter(b => b.c <= eElix); if (aff.length) { const c = aff[Math.floor(Math.random() * aff.length)]; eElix -= c.c; spawn('e', c, LANES[Math.floor(Math.random() * 2)] + (Math.random() - .5) * 40, 135); } }
  for (const u of units) { if (u.hp <= 0) continue; u.t -= dt; const tg = target(u); if (!tg.o) continue; const d = dist(u, tg.o);
    if (d <= tg.rr) { if (u.t <= 0) { hit(u, tg.o, u.d); u.t = u.cd; } } else { u.x += (tg.o.x - u.x) / d * u.sp * dt; u.y += (tg.o.y - u.y) / d * u.sp * dt; } }
  for (const t of towers) { if (t.hp <= 0) continue; t.t -= dt; if (t.t > 0) continue; const foes = t.side === 'p' ? 'e' : 'p'; let b = null, bd = 135;
    for (const o of units) if (o.side === foes && o.hp > 0) { const d = dist(t, o); if (d < bd) { bd = d; b = o; } } if (b) { hit(t, b, 20); t.t = 1; } }
  units = units.filter(u => u.hp > 0); fx = fx.filter(f => (f.ttl -= dt) > 0);
  sampleT += dt; if (sampleT >= 2) { sampleT = 0; gameCurve.push([Math.round(MATCH - tLeft), health()]); }
  const pk = towers[2], ek = towers[5]; if (pk.hp <= 0 || ek.hp <= 0 || tLeft <= 0) endGame();
}
function side(s) { return towers.filter(t => t.side === s).reduce((a, t) => a + Math.max(0, t.hp), 0); }
function health() { const p = side('p'), e = side('e'); return Math.round(p / (p + e || 1) * 100); }
function endGame() {
  game.running = false; gameCurve.push([Math.round(MATCH - tLeft), health()]);
  const p = side('p'), e = side('e'), win = towers[5].hp <= 0 || (towers[2].hp > 0 && p > e), draw = p === e && towers[2].hp > 0 && towers[5].hp > 0, m = $('gmsg'); m.replaceChildren();
  m.append(el('h3', '', draw ? '🤝 Draw' : win ? '🌍 Good things win!' : '💀 Bad things win'), el('p', '', win ? 'Cleaner choices beat pollution. In real life every action adds up.' : 'Pollution is strong, but we can still change course. Try again with cheaper cards first!'), el('p', '', 'Climate health: ' + health() + '%. See your curve in the Curves tab.'));
  const b = el('button', 'btn btn-light', 'Play again'); b.addEventListener('click', startGame); m.append(b); m.hidden = false;
}
function bar(x, y, w, v, m, col) { cx.fillStyle = '#0003'; cx.fillRect(x - w / 2, y, w, 5); cx.fillStyle = col; cx.fillRect(x - w / 2, y, w * Math.max(0, v / m), 5); }
function draw() {
  cx.fillStyle = '#e9d9d0'; cx.fillRect(0, 0, W, 280); cx.fillStyle = '#cfe8c4'; cx.fillRect(0, 280, W, 280); cx.fillStyle = '#7cb5d9'; cx.fillRect(0, 268, W, 24);
  cx.fillStyle = '#b79b7a'; for (const x of LANES) cx.fillRect(x - 22, 264, 44, 32);
  cx.textAlign = 'center'; cx.textBaseline = 'middle';
  for (const t of towers) { const r = t.king ? 26 : 21; cx.globalAlpha = t.hp > 0 ? 1 : .3; cx.fillStyle = t.side === 'p' ? '#2f7a4c' : '#7a3b34'; cx.beginPath(); cx.roundRect(t.x - r, t.y - r, 2 * r, 2 * r, 8); cx.fill(); cx.font = (t.king ? 30 : 24) + 'px serif'; cx.fillText(t.side === 'p' ? (t.king ? '🌍' : '🌱') : (t.king ? '💀' : '🌫️'), t.x, t.y + 1); cx.globalAlpha = 1; if (t.hp > 0) bar(t.x, t.y - r - 9, 40, t.hp, t.mhp, '#e3b341'); }
  cx.font = '24px serif'; for (const u of units) { cx.fillText(u.e, u.x, u.y); bar(u.x, u.y - 22, 26, u.hp, u.mhp, u.side === 'p' ? '#2f7a4c' : '#c5604f'); }
  for (const f of fx) { cx.strokeStyle = f.a.side === 'p' ? '#2f7a4c' : '#c5604f'; cx.lineWidth = 3; cx.beginPath(); cx.moveTo(f.a.x, f.a.y); cx.lineTo(f.b.x, f.b.y); cx.stroke(); }
  if (sel >= 0) { cx.fillStyle = '#2f7a4c22'; cx.fillRect(0, 300, W, 260); }
}
function loop(now) {
  if (!game.running) return; const dt = Math.min(.05, (now - lastT) / 1000); lastT = now; update(dt); if (!game.running) { draw(); return; } draw();
  $('elix-n').textContent = Math.floor(elix); $('elix-bar').style.width = elix * 10 + '%'; $('ghealth').textContent = health() + '%';
  const s = Math.max(0, Math.ceil(tLeft)); $('gtime').textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
  document.querySelectorAll('#hand button').forEach(b => b.classList.toggle('off', GOOD[hand[+b.dataset.slot]].c > elix));
  requestAnimationFrame(loop);
}
$('gstart').addEventListener('click', startGame);
towers = []; units = []; fx = []; // blank arena before first match
cx.fillStyle = '#cfe8c4'; cx.fillRect(0, 0, W, H); cx.fillStyle = '#e9d9d0'; cx.fillRect(0, 0, W, 280); cx.fillStyle = '#7cb5d9'; cx.fillRect(0, 268, W, 24); cx.fillStyle = '#19362d'; cx.font = '700 18px sans-serif'; cx.textAlign = 'center'; cx.fillText('Press “Start match”', W / 2, 410);

showTab(location.hash.slice(1));
