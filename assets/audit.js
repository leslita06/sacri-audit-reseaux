(function () {
  'use strict';
  const G = window.GD;
  if (!window.Chart) return;
  const fr = n => Number(n).toLocaleString('fr-FR');
  Chart.defaults.font.family = 'Inter, system-ui, sans-serif';
  Chart.defaults.color = '#64748B';
  Chart.defaults.plugins.tooltip.backgroundColor = '#0F172A';
  Chart.defaults.plugins.tooltip.padding = 10;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
  Chart.defaults.animation.duration = 500;
  Chart.defaults.transitions.resize = { animation: { duration: 0 } };
  const small = () => window.innerWidth < 760;
  const short = s => { const m = small() ? 19 : 30; return s.length > m ? s.slice(0, m - 2) + '…' : s; };

  // Vues par Reel, barres horizontales
  const strong = t => t === 'Personnes au travail' || t === 'Événement';
  new Chart(document.getElementById('cReels'), {
    type: 'bar',
    data: { labels: G.reels.map(r => short(r.n)), datasets: [{ label: 'Vues', data: G.reels.map(r => r.v),
      backgroundColor: G.reels.map(r => strong(r.t) ? '#E95B0F' : '#CBD5E1'), borderRadius: 6, barThickness: 18 }] },
    options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false },
      tooltip: { callbacks: { title: c => G.reels[c[0].dataIndex].n, label: c => { const r = G.reels[c.dataIndex];
        return [fr(r.v) + ' vues', (r.r == null ? 'réactions non affichées' : fr(r.r) + ' réactions'), r.t + ', ' + r.d]; } } } },
      scales: { x: { grid: { color: '#F1F5F9' }, ticks: { callback: v => fr(v) } }, y: { grid: { display: false }, ticks: { font: { size: small() ? 10.5 : 12 } } } } }
  });

  // Part des vues par type, anneau
  const COL = { 'Personnes au travail': '#E95B0F', 'Événement': '#0EA5E9', 'Produit seul': '#8B5CF6', 'Affiche texte': '#F59E0B', 'En cours de diffusion': '#64748B' };
  const ks = Object.keys(G.parts), tot = ks.reduce((a, k) => a + G.parts[k], 0);
  new Chart(document.getElementById('cParts'), {
    type: 'doughnut',
    data: { labels: ks, datasets: [{ data: ks.map(k => G.parts[k]), backgroundColor: ks.map(k => COL[k]), borderWidth: 2, borderColor: '#fff' }] },
    options: { maintainAspectRatio: false, cutout: '66%', plugins: { legend: { display: false },
      tooltip: { callbacks: { label: c => c.label + ' : ' + fr(c.raw) + ' vues (' + Math.round(c.raw / tot * 100) + ' %)' } } } },
    plugins: [{ id: 'centre', afterDraw(ch) { const { ctx, chartArea: a } = ch; const x = (a.left + a.right) / 2, y = (a.top + a.bottom) / 2;
      ctx.save(); ctx.textAlign = 'center'; ctx.fillStyle = '#0F172A'; ctx.font = '700 22px Inter'; ctx.fillText(fr(tot), x, y + 2);
      ctx.fillStyle = '#64748B'; ctx.font = '500 12px Inter'; ctx.fillText('vues au total', x, y + 20); ctx.restore(); } }]
  });
  document.getElementById('lParts').innerHTML = ks.map(k => `<div><i style="background:${COL[k]}"></i>${k}<b>${fr(G.parts[k])}</b><em>${Math.round(G.parts[k] / tot * 100)} %</em></div>`).join('');

  // Comparables, barres horizontales
  const ctx = document.getElementById('cComp').getContext('2d');
  const hatch = (() => { const c = document.createElement('canvas'); c.width = c.height = 8; const x = c.getContext('2d');
    x.fillStyle = '#E2E8F0'; x.fillRect(0, 0, 8, 8); x.strokeStyle = '#94A3B8'; x.lineWidth = 2; x.beginPath(); x.moveTo(0, 8); x.lineTo(8, 0); x.stroke(); return ctx.createPattern(c, 'repeat'); })();
  new Chart(ctx, {
    type: 'bar',
    data: { labels: G.comp.map(c => c.n + ' · ' + c.net), datasets: [{ label: 'Abonnés', data: G.comp.map(c => c.a),
      backgroundColor: G.comp.map(c => c.n === 'SACRI' ? '#E95B0F' : (!c.ok ? hatch : (c.net === 'LinkedIn' ? '#0EA5E9' : '#94A3B8'))), borderRadius: 6, barThickness: 20 }] },
    options: { indexAxis: 'y', maintainAspectRatio: false, plugins: { legend: { display: false },
      tooltip: { callbacks: { label: c => { const o = G.comp[c.dataIndex]; return fr(o.a) + ' abonnés' + (o.ok ? '' : ' (moteur de recherche, non daté)'); } } } },
      scales: { x: { grid: { color: '#F1F5F9' }, ticks: { callback: v => fr(v) } }, y: { grid: { display: false }, ticks: { font: c => ({ size: small() ? 10.5 : 12, weight: G.comp[c.index] && G.comp[c.index].n === 'SACRI' ? '700' : '400' }) } } } }
  });
})();
