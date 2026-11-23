// SaveNest chatbot: rule-based assistant that answers from the coupon data on this page.
// To use an LLM instead, replace reply() with a fetch() to your own backend endpoint
// (never put an API key in this file).
(function () {
  const all = () => [...window.LISTS.trending, ...window.LISTS.fall];
  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmt = d => d.type === 'deal'
    ? `<b>${esc(d.b)}</b>: ${esc(d.t)} (no code needed, use "Get deal" on the page)`
    : `<b>${esc(d.b)}</b>: ${esc(d.t)}. Code <span class="cb-code" data-copy="${esc(d.c)}" title="Click to copy">${esc(d.c)}</span>`;

  function find(q) {
    const words = q.toLowerCase().split(/[^a-z0-9&]+/).filter(w => w.length > 2);
    return all().map(d => {
      const hay = (d.b + ' ' + d.t + ' ' + d.s).toLowerCase();
      let score = 0;
      if (q.toLowerCase().includes(d.b.toLowerCase())) score += 5;
      words.forEach(w => { if (hay.includes(w)) score++; });
      return { d, score };
    }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.d);
  }

  function reply(q) {
    const t = q.toLowerCase().trim();
    if (/^(hi|hello|hey|yo)\b/.test(t)) return 'Hi! Ask me about a store (e.g. "Crocs"), or say "best deals", "free shipping" or "how do codes work".';
    if (/how|work|use|apply|redeem/.test(t) && /code|coupon|work|apply|use/.test(t))
      return 'Click <b>Show code</b> on a coupon, copy the code, open the store\'s website, add items to your cart and paste the code at checkout. Always check the final discount on the retailer\'s site: offers can expire or have exclusions.';
    if (/safe|real|verified|legit|affiliate|commission/.test(t))
      return 'SaveNest is an independent coupon site. We don\'t issue the codes and can\'t guarantee them; stores may change or end offers anytime. We may earn a commission from qualifying purchases at no cost to you.';
    if (/contact|support|help|email/.test(t)) return 'You can reach us from the <a href="contact.html">Contact page</a>.';
    if (/best|top|biggest|trending|popular|deal/.test(t) && !find(q).length) {
      const pct = all().map(d => ({ d, n: +((d.t.match(/(\d+)%/) || [])[1] || 0) })).sort((a, b) => b.n - a.n).slice(0, 4);
      return 'Biggest discounts right now:<br>' + pct.map(x => fmt(x.d)).join('<br>');
    }
    if (/all|list|everything|stores/.test(t) && t.length < 25)
      return 'Stores with offers: ' + [...new Set(all().map(d => d.b))].map(esc).join(', ') + '. Ask about any of them.';
    const hits = find(q);
    if (hits.length) return hits.slice(0, 4).map(fmt).join('<br>');
    return 'I couldn\'t find that. Try a store name like "Crocs" or "Sally Beauty", or ask "best deals".';
  }

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const fab = el('button', 'cb-fab', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/></svg>');
  fab.setAttribute('aria-label', 'Open chat');
  const win = el('div', 'cb-win');
  win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'SaveNest assistant');
  const head = el('div', 'cb-head', '<span>SaveNest Assistant</span>');
  const x = el('button', '', '&times;'); x.setAttribute('aria-label', 'Close chat'); head.appendChild(x);
  const msgs = el('div', 'cb-msgs'); msgs.setAttribute('aria-live', 'polite');
  const chips = el('div', 'cb-chips');
  ['Best deals', 'How do codes work?', 'List stores', 'Is this safe?'].forEach(c => {
    const b = el('button', '', c); b.onclick = () => send(c); chips.appendChild(b);
  });
  const form = el('form', 'cb-form');
  const inp = el('input'); inp.placeholder = 'Ask about a store or deal...'; inp.setAttribute('aria-label', 'Message');
  form.append(inp, el('button', '', 'Send')); form.lastChild.type = 'submit';
  win.append(head, msgs, chips, form);
  document.body.append(fab, win);

  function add(html, who) { msgs.appendChild(el('div', 'cb-m ' + who, html)); msgs.scrollTop = msgs.scrollHeight; }
  function send(text) {
    text = text.trim(); if (!text) return;
    add(esc(text), 'me');
    setTimeout(() => add(reply(text), 'bot'), 250);
  }
  form.onsubmit = e => { e.preventDefault(); send(inp.value); inp.value = ''; };
  const toggle = o => {
    win.classList.toggle('open', o);
    if (o) { if (!msgs.children.length) add('Hi! I\'m the SaveNest assistant. Ask me about a store or deal.', 'bot'); inp.focus(); }
  };
  fab.onclick = () => toggle(!win.classList.contains('open'));
  x.onclick = () => toggle(false);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
  msgs.addEventListener('click', e => {
    const c = e.target.closest('.cb-code'); if (!c) return;
    navigator.clipboard && navigator.clipboard.writeText(c.dataset.copy).then(() => { c.textContent = 'Copied'; setTimeout(() => c.textContent = c.dataset.copy, 1200); });
  });
})();
