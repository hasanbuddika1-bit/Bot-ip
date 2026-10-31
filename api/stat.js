export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cache-Control', 'no-store, max-age=0');

  const target = req.query.u;
  if (!target || !/^https:\/\//.test(String(target))) {
    return res.status(200).json({ ok: false, state: '', error: 'bad-target' });
  }

  try {
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), 4000);
    const r = await fetch(String(target), { signal: ac.signal, cache: 'no-store' });
    clearTimeout(timer);
    const txt = await r.text();
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).send(txt);
  } catch (e) {
    return res.status(200).json({ ok: false, state: '', error: 'upstream' });
  }
}
