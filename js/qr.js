// The Burg: qr.js (loads before boot.js; scripts share one global scope)
/* ---------- 📱 a small QR code maker (byte mode, no download) and the camera scanner, for moving phones (i63-b15, i63-b12) ---------- */
// Follows the QR Code standard (ISO 18004): version 1-40, error correction L or M, the best of the 8 masks.
const QR_EC = {            // per version: error-correction bytes per block, and the number of blocks
  L: { ecc: [0,7,10,15,20,26,18,20,24,30,18,20,24,26,30,22,24,28,30,28,28,28,28,30,30,26,28,30,30,30,30,30,30,30,30,30,30,30,30,30,30],
       blocks: [0,1,1,1,1,1,2,2,2,2,4,4,4,4,4,6,6,6,6,7,8,8,9,9,10,12,12,12,13,14,15,16,17,18,19,19,20,21,22,24,25], bits: 1 },
  M: { ecc: [0,10,16,26,18,24,16,18,22,22,26,30,22,22,24,24,28,28,26,26,26,26,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28,28],
       blocks: [0,1,1,1,2,2,4,4,4,5,5,5,8,9,9,10,10,11,13,14,16,17,17,18,20,21,23,25,26,28,29,31,33,35,37,38,40,43,45,47,49], bits: 0 }
};
function qrRawModules(v){
  let n = (16 * v + 128) * v + 64;
  if (v >= 2) { const a = Math.floor(v / 7) + 2; n -= (25 * a - 10) * a - 55; if (v >= 7) n -= 36; }
  return n;
}
const qrDataBytes = (v, ec) => Math.floor(qrRawModules(v) / 8) - QR_EC[ec].ecc[v] * QR_EC[ec].blocks[v];
function qrAlignPos(v){
  if (v === 1) return [];
  const n = Math.floor(v / 7) + 2, step = v === 32 ? 26 : Math.ceil((v * 4 + 4) / (n * 2 - 2)) * 2, out = [6];
  for (let p = v * 4 + 10; out.length < n; p -= step) out.splice(1, 0, p);
  return out;
}
// Reed-Solomon over GF(256), polynomial 0x11D
function qrMul(x, y){ let z = 0; for (let i = 7; i >= 0; i--) { z = (z << 1) ^ ((z >>> 7) * 0x11D); z ^= ((y >>> i) & 1) * x; } return z & 255; }
function qrDivisor(deg){
  const r = Array(deg).fill(0); r[deg - 1] = 1; let root = 1;
  for (let i = 0; i < deg; i++) {
    for (let j = 0; j < r.length; j++) { r[j] = qrMul(r[j], root); if (j + 1 < r.length) r[j] ^= r[j + 1]; }
    root = qrMul(root, 2);
  }
  return r;
}
function qrRemainder(data, div){
  const r = div.map(() => 0);
  for (const b of data) { const f = b ^ r.shift(); r.push(0); div.forEach((c, i) => { r[i] ^= qrMul(c, f); }); }
  return r;
}
// text → { size, get(x, y) } (dark = true); throws if it's too long for any version
function qrMake(text, ec = 'M'){
  const bytes = [...new TextEncoder().encode(text)];
  let v = 1;
  for (; v <= 40; v++) if (4 + (v < 10 ? 8 : 16) + bytes.length * 8 <= qrDataBytes(v, ec) * 8) break;
  if (v > 40) throw new Error('Too long for a QR code');
  const cap = qrDataBytes(v, ec) * 8, bits = [];
  const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >>> i) & 1); };
  put(4, 4); put(bytes.length, v < 10 ? 8 : 16); bytes.forEach(b => put(b, 8));
  put(0, Math.min(4, cap - bits.length)); put(0, (8 - bits.length % 8) % 8);
  for (let p = 0xEC; bits.length < cap; p ^= 0xEC ^ 0x11) put(p, 8);
  const data = []; for (let i = 0; i < bits.length; i += 8) data.push(parseInt(bits.slice(i, i + 8).join(''), 2));
  // split into blocks, add error correction, interleave
  const nb = QR_EC[ec].blocks[v], eccLen = QR_EC[ec].ecc[v], raw = Math.floor(qrRawModules(v) / 8);
  const nShort = nb - raw % nb, shortLen = Math.floor(raw / nb), div = qrDivisor(eccLen), blocks = [];
  for (let i = 0, k = 0; i < nb; i++) {
    const d = data.slice(k, k + shortLen - eccLen + (i < nShort ? 0 : 1)); k += d.length;
    const e = qrRemainder(d, div); if (i < nShort) d.push(null);
    blocks.push(d.concat(e));
  }
  const all = [];
  for (let i = 0; i < blocks[0].length; i++) blocks.forEach((b, j) => { if (i !== shortLen - eccLen || j >= nShort) all.push(b[i]); });
  // draw the fixed patterns
  const size = v * 4 + 17, m = [...Array(size)].map(() => Array(size).fill(false)), fixed = [...Array(size)].map(() => Array(size).fill(false));
  const set = (x, y, d) => { m[y][x] = d; fixed[y][x] = true; };
  for (let i = 0; i < size; i++) { set(6, i, i % 2 === 0); set(i, 6, i % 2 === 0); }
  for (const [cx, cy] of [[3, 3], [size - 4, 3], [3, size - 4]])
    for (let dy = -4; dy <= 4; dy++) for (let dx = -4; dx <= 4; dx++) {
      const x = cx + dx, y = cy + dy, dist = Math.max(Math.abs(dx), Math.abs(dy));
      if (x >= 0 && x < size && y >= 0 && y < size) set(x, y, dist !== 2 && dist !== 4);
    }
  const al = qrAlignPos(v);
  al.forEach((a, i) => al.forEach((b, j) => {
    if ((i === 0 && j === 0) || (i === 0 && j === al.length - 1) || (i === al.length - 1 && j === 0)) return;
    for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) set(a + dx, b + dy, Math.max(Math.abs(dx), Math.abs(dy)) !== 1);
  }));
  const format = mask => {
    const d = QR_EC[ec].bits << 3 | mask; let r = d;
    for (let i = 0; i < 10; i++) r = (r << 1) ^ ((r >>> 9) * 0x537);
    const b = (d << 10 | r) ^ 0x5412, bit = i => ((b >>> i) & 1) === 1;
    for (let i = 0; i <= 5; i++) set(8, i, bit(i));
    set(8, 7, bit(6)); set(8, 8, bit(7)); set(7, 8, bit(8));
    for (let i = 9; i < 15; i++) set(14 - i, 8, bit(i));
    for (let i = 0; i < 8; i++) set(size - 1 - i, 8, bit(i));
    for (let i = 8; i < 15; i++) set(8, size - 15 + i, bit(i));
    set(8, size - 8, true);
  };
  format(0);
  if (v >= 7) {
    let r = v; for (let i = 0; i < 12; i++) r = (r << 1) ^ ((r >>> 11) * 0x1F25);
    const b = v << 12 | r;
    for (let i = 0; i < 18; i++) { const d = ((b >>> i) & 1) === 1, a = size - 11 + i % 3, c = Math.floor(i / 3); set(a, c, d); set(c, a, d); }
  }
  // the data, in the zigzag
  let i = 0;
  for (let right = size - 1; right >= 1; right -= 2) {
    if (right === 6) right = 5;
    for (let vert = 0; vert < size; vert++) for (let j = 0; j < 2; j++) {
      const x = right - j, up = ((right + 1) & 2) === 0, y = up ? size - 1 - vert : vert;
      if (!fixed[y][x] && i < all.length * 8) { m[y][x] = ((all[i >>> 3] >>> (7 - (i & 7))) & 1) === 1; i++; }
    }
  }
  const MASKS = [(x, y) => (x + y) % 2 === 0, (x, y) => y % 2 === 0, x => x % 3 === 0, (x, y) => (x + y) % 3 === 0,
    (x, y) => (Math.floor(x / 3) + Math.floor(y / 2)) % 2 === 0, (x, y) => x * y % 2 + x * y % 3 === 0,
    (x, y) => (x * y % 2 + x * y % 3) % 2 === 0, (x, y) => ((x + y) % 2 + x * y % 3) % 2 === 0];
  const applyMask = k => { for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (!fixed[y][x] && MASKS[k](x, y)) m[y][x] = !m[y][x]; };
  const penalty = () => {
    let p = 0, dark = 0;
    const runs = line => {       // runs of 5+ and the 1:1:3:1:1 finder look-alikes
      let s = 0, run = 1;
      for (let k = 1; k <= line.length; k++) {
        if (k < line.length && line[k] === line[k - 1]) run++;
        else { if (run >= 5) s += run - 2; run = 1; }
      }
      const t = line.map(b => b ? '1' : '0').join('');
      s += 40 * ((t.match(/(?=1011101(0000))|(?=(0000)1011101)/g) || []).length);
      return s;
    };
    for (let y = 0; y < size; y++) { p += runs(m[y]); p += runs(m.map(r => r[y])); }
    for (let y = 0; y < size - 1; y++) for (let x = 0; x < size - 1; x++) { const c = m[y][x]; if (c === m[y][x + 1] && c === m[y + 1][x] && c === m[y + 1][x + 1]) p += 3; }
    m.forEach(r => r.forEach(b => { if (b) dark++; }));
    p += Math.floor(Math.abs(dark * 20 - size * size * 10) / (size * size)) * 10;
    return p;
  };
  let best = 0, bestP = Infinity;
  for (let k = 0; k < 8; k++) { applyMask(k); format(k); const p = penalty(); if (p < bestP) { bestP = p; best = k; } applyMask(k); }
  applyMask(best); format(best);
  return { size, version: v, get: (x, y) => x >= 0 && y >= 0 && x < size && y < size && m[y][x] };
}
// an SVG picture of the code, with the quiet zone around it; always dark on white so cameras read it in Night theme
function qrSVG(text, label){
  const q = qrMake(text, 'L'), n = q.size + 8;
  let d = '';
  for (let y = 0; y < q.size; y++) for (let x = 0; x < q.size; x++) if (q.get(x, y)) d += `M${x + 4} ${y + 4}h1v1h-1z`;
  return `<svg class="qr" viewBox="0 0 ${n} ${n}" role="img" aria-label="${esc(label)}" shape-rendering="crispEdges"><rect width="${n}" height="${n}" fill="#fff"/><path d="${d}" fill="#000"/></svg>`;
}

/* ---------- moving phones: a backup code split into QR frames ('part 3 of 8') and collected again ---------- */
const QR_PART = 320;                       // characters per frame: small codes (about version 12) a phone camera reads from a screen
// a code too long for one frame becomes BURGP:n/m:<piece> frames; a short one is a single frame holding the code itself
function qrParts(code){
  if (code.length <= QR_PART) return [code];
  const m = Math.ceil(code.length / QR_PART), size = Math.ceil(code.length / m), out = [];
  for (let i = 0; i < m; i++) out.push(`BURGP:${i + 1}/${m}:${code.slice(i * size, (i + 1) * size)}`);
  return out;
}
// collects frames in any order; add() returns { done, have, of, code }
function qrCollector(){
  let parts = null, of = 0;
  return {
    add(text){
      text = String(text || '').trim();
      const p = text.match(/^BURGP:(\d+)\/(\d+):([\s\S]*)$/);
      if (!p) return /^(BURG\d:|\{)/.test(text) ? { done: true, have: 1, of: 1, code: text } : { done: false, have: parts ? parts.filter(x => x != null).length : 0, of };
      const n = +p[1], m = +p[2];
      if (!parts || m !== of) { parts = Array(m).fill(null); of = m; }     // a different backup's frames start over
      if (n >= 1 && n <= m) parts[n - 1] = p[3];
      const have = parts.filter(x => x != null).length;
      return { done: have === of, have, of, code: have === of ? parts.join('') : null };
    }
  };
}
const canScan = () => typeof BarcodeDetector === 'function' && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
let SCAN = null;                           // the running scanner: { stream, timer }
function stopScan(){
  if (!SCAN) return;
  clearTimeout(SCAN.timer);
  try { SCAN.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
  SCAN = null;
}
// opens the back camera in <video id=vid>, reads codes until a whole backup is in, then calls done(code)
async function startScan(video, onProgress, done){
  stopScan();
  const det = new BarcodeDetector({ formats: ['qr_code'] }), col = qrCollector();
  const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
  SCAN = { stream, timer: 0 };
  video.srcObject = stream; video.setAttribute('playsinline', ''); video.muted = true;
  try { const pl = video.play(); if (pl && pl.catch) pl.catch(() => {}); } catch (e) {}   // not awaited: a camera with no picture yet must not stall the scan
  const me = SCAN;
  const tick = async () => {
    if (SCAN !== me) return;
    if (!video.isConnected) return stopScan();
    try {
      for (const c of await det.detect(video)) {
        const r = col.add(c.rawValue);
        if (r.of) onProgress(r.have, r.of);
        if (r.done) { stopScan(); return done(r.code); }
      }
    } catch (e) {}
    if (SCAN === me) me.timer = setTimeout(tick, 120);
  };
  tick();
}
