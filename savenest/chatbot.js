// Simple SaveNest FAQ chatbot: answers questions about the website using keyword matching.
(function () {
  const FAQ = [
    { k: ['hi', 'hello', 'hey'], a: 'Hi! Ask me anything about SaveNest: what it is, how codes work, contact details, terms or privacy.' },
    { k: ['what is savenest', 'savenest', 'who are', 'about', 'website'], a: 'SaveNest is an independent coupon and deals website. We bring promo codes and offers from online stores into one place and check them regularly. More on the <a href="about.html">About page</a>.' },
    { k: ['apply', 'redeem', 'works', 'coupon', 'code', 'codes', 'promo'], a: '1) Browse the coupons. 2) Click <b>Show code</b> and copy the code. 3) Go to the store\'s website, add items to your cart and enter the code at checkout.' },
    { k: ['free', 'cost', 'price', 'pay', 'charge'], a: 'SaveNest is free to use. We may earn a commission when you buy through our links, at no extra cost to you.' },
    { k: ['verify', 'verified', 'tested', 'real', 'legit', 'trust', 'working', 'expired', 'expire'], a: 'We collect offers, test codes where possible, label them with terms and expiry, and remove failing ones. We can\'t guarantee a code works: stores set and can change their offers.' },
    { k: ['earn', 'commission', 'affiliate', 'money', 'revenue'], a: 'Some links are affiliate links. If you buy after clicking, we may earn a commission at no extra cost to you.' },
    { k: ['contact', 'email', 'reach', 'support', 'message', 'feedback'], a: 'Email <b>info@savenest.vercel</b> or use the form on the <a href="contact.html">Contact page</a>. We usually reply within 1 to 2 business days.' },
    { k: ['hours', 'open', 'time', 'when'], a: 'Our team is available Mon to Fri, 9am to 6pm.' },
    { k: ['privacy', 'data', 'cookie', 'personal', 'information'], a: 'We collect only what we need to run the site and don\'t sell your personal information. Details are in the <a href="privacy.html">Privacy Policy</a>.' },
    { k: ['terms', 'conditions', 'legal', 'policy'], a: 'Read the <a href="terms.html">Terms of Use</a> and <a href="privacy.html">Privacy Policy</a>.' },
    { k: ['store', 'stores', 'brand', 'retailer'], a: 'We list offers from many online stores. See the store list and today\'s coupons on the <a href="index.html">Home page</a>. Stores set their own offers; we aren\'t affiliated with them unless stated.' },
    { k: ['buy', 'order', 'payment', 'shipping', 'refund', 'delivery'], a: 'SaveNest is not a seller and doesn\'t process orders or payments. Orders, shipping and refunds are handled by the store you buy from.' },
    { k: ['submit', 'share', 'add', 'offer'], a: 'Have a coupon to share? Send it through the <a href="contact.html">Contact page</a>.' }
  ];
  const FALLBACK = 'Sorry, I\'m not sure about that. Try asking about what SaveNest is, how codes work, contact, terms or privacy, or use the <a href="contact.html">Contact page</a>.';
  const SUGGEST = ['What is SaveNest?', 'How do I use a coupon code?', 'Is it free?', 'How can I contact you?'];

  function reply(q) {
    const t = ' ' + q.toLowerCase().replace(/[^a-z0-9 ]/g, ' ') + ' ';
    let best = null, bestScore = 0;
    FAQ.forEach(f => {
      const s = f.k.reduce((n, w) => n + (t.includes(' ' + w + ' ') || (w.length > 4 && t.includes(w)) ? 1 : 0), 0);
      if (s > bestScore) { best = f; bestScore = s; }
    });
    return best ? best.a : FALLBACK;
  }

  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html) e.innerHTML = html; return e; };
  const esc = s => s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fab = el('button', 'cb-fab', '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 12a8 8 0 01-11.6 7.1L4 20l1-4.6A8 8 0 1121 12z"/></svg>');
  fab.setAttribute('aria-label', 'Open chat');
  const win = el('div', 'cb-win'); win.setAttribute('role', 'dialog'); win.setAttribute('aria-label', 'SaveNest assistant');
  const head = el('div', 'cb-head', '<span>SaveNest Assistant</span>');
  const x = el('button', '', '&times;'); x.setAttribute('aria-label', 'Close chat'); head.appendChild(x);
  const msgs = el('div', 'cb-msgs'); msgs.setAttribute('aria-live', 'polite');
  const chips = el('div', 'cb-chips');
  SUGGEST.forEach(c => { const b = el('button', '', c); b.onclick = () => send(c); chips.appendChild(b); });
  const form = el('form', 'cb-form');
  const inp = el('input'); inp.placeholder = 'Ask a question about the website...'; inp.setAttribute('aria-label', 'Message');
  const sendBtn = el('button', '', 'Send'); sendBtn.type = 'submit';
  form.append(inp, sendBtn);
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
    if (o) { if (!msgs.children.length) add('Hi! I\'m the SaveNest assistant. Ask me about the website.', 'bot'); inp.focus(); }
  };
  fab.onclick = () => toggle(!win.classList.contains('open'));
  x.onclick = () => toggle(false);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') toggle(false); });
})();
