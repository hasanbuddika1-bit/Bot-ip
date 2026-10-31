const ALLOW = /\.telebotcreator\.com$/;

function safe(u) {
  try {
    const x = new URL(String(u));
    return x.protocol === 'https:' && ALLOW.test(x.hostname);
  } catch (e) { return false; }
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Access-Control-Allow-Origin', '*');

  const target = req.query.u;
  if (!safe(target)) {
    return res.status(400).json({ ok: false, state: '', error: 'bad-target' });
  }

  try {
    const ac = new AbortController();
    const t = setTimeout(() => ac.abort(), 9000);
    const r = await fetch(String(target), { signal: ac.signal, cache: 'no-store' });
    clearTimeout(t);
    const txt = await r.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(txt || '{"ok":false,"state":""}');
  } catch (e) {
    return res.status(200).json({ ok: false, state: '', error: 'upstream' });
  }
}
