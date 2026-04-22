var Si = Object.defineProperty;
var wi = (f, n, p) => n in f ? Si(f, n, { enumerable: !0, configurable: !0, writable: !0, value: p }) : f[n] = p;
var Jt = (f, n, p) => wi(f, typeof n != "symbol" ? n + "" : n, p);
let le = (f, n) => {
  const p = document.createElement("canvas");
  return p.width = f, p.height = n, p;
};
function qt(f, n) {
  return le(f, n);
}
function Oi(f) {
  le = f;
}
function It(f) {
  return f > 0 ? Math.floor(f) : Math.ceil(f);
}
function Ct(f, n, p) {
  return Math.max(n, Math.min(f, p));
}
function Qt(f, n, p) {
  const m = Wt(f), P = qt(n, p);
  return P.getContext("2d").scale(n / f.width, p / f.height), P.getContext("2d").drawImage(m, 0, 0), P.getContext("2d").getImageData(0, 0, n, p);
}
function Wt(f, n, p) {
  const m = qt(n || f.width, p || f.height);
  return m.getContext("2d").putImageData(f, 0, 0), m;
}
function $t(f, n, p) {
  const m = f.data, P = [], c = [], v = [];
  let h = 0, y = 0;
  for (let _ = 0; _ < m.length; _ += 4)
    v[y] || (v[y] = []), c[y] || (c[y] = []), P[y] || (P[y] = []), P[y][h] = (m[_] / 255 - n[0]) / p[0], c[y][h] = (m[_ + 1] / 255 - n[1]) / p[1], v[y][h] = (m[_ + 2] / 255 - n[2]) / p[2], h++, h === f.width && (h = 0, y++);
  return [v, c, P];
}
class ae {
  constructor(n) {
    Jt(this, "tl", []);
    Jt(this, "name");
    this.name = n;
  }
  l(n) {
    const p = performance.now();
    this.tl.push({ t: n, n: p });
    const m = [];
    for (let c = 1; c < this.tl.length; c++) {
      const v = this.tl[c].n - this.tl[c - 1].n, h = this.tl[c - 1].t, y = m.find((_) => _.n === h);
      y ? (y.c++, y.d += v) : m.push({ d: v, n: h, c: 1 });
    }
    const P = [];
    for (const c of m) {
      const v = c.c > 1 ? `${c.n}x${c.c}` : c.n;
      P.push(`${v} ${c.d}`);
    }
    P.push(this.tl.at(-1).t), console.log(`${this.name} ${m.map((c) => c.d).reduce((c, v) => c + v, 0)}ms: `, P.join(" "));
  }
}
async function Ei(f, n, p, m) {
  const P = f.height, c = f.width, v = Ai(f, 800, 608), h = await Yi(v.transposedData, v.image, n, p);
  return console.log(h), Bi(h, c, P, m);
}
async function Yi(f, n, p, m) {
  const P = f.flat(Number.POSITIVE_INFINITY), c = Float32Array.from(P), v = new p.Tensor("float32", c, [1, 3, n.height, n.width]), h = {};
  h[m.inputNames[0]] = v;
  const y = await m.run(h);
  return Object.values(y);
}
function Ai(f, n, p) {
  f.height, f.width;
  let m = n, P = p;
  return m = Math.max(Math.round(m / 32) * 32, 32), P = Math.max(Math.round(P / 32) * 32, 32), f = Qt(f, P, m), { transposedData: $t(f, [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]), image: f };
}
function Bi(f, n, p, m) {
  const P = [8, 16, 32, 64], c = 0.4, v = 0.5, h = 1e3, y = 100, _ = [], X = [], w = f.length / 2;
  for (let k = 0; k < w; k++)
    _.push(f[k]), X.push(f[k + w]);
  const M = It(X[0].dims.at(-1) / 4 - 1);
  let S = [];
  const g = [], x = [], I = [800, 608], L = [800 / p, 608 / n], O = [], b = [];
  for (let k = 0; k < P.length; k++) {
    const U = P[k], K = X[k], j = _[k], at = 800 / U, ot = 608 / U, et = Array.from({ length: Math.ceil(at) }, (B, J) => J), Z = Array.from({ length: Math.ceil(ot) }, (B, J) => J), [nt, ct] = Ri(Z, et), _t = ct.flat().map((B) => (B + 0.5) * U), Ot = nt.flat().map((B) => (B + 0.5) * U), Tt = [];
    for (const B in _t)
      Tt.push([Ot[B], _t[B], Ot[B], _t[B]]);
    const it = M + 1, Lt = K.size / it, Et = [];
    for (let B = 0; B < Lt; B++) {
      const J = K.data.slice(B * it, (B + 1) * it), tt = Fi(Array.from(J));
      for (let Pt = 0; Pt < it; Pt++)
        tt[Pt] *= Pt;
      Et.push(tt);
    }
    const Yt = [], kt = Lt / 4;
    for (let B = 0; B < Lt; B++) {
      let J = 0;
      for (let tt = 0; tt < it; tt++)
        J += Et[B][tt];
      J *= U, Yt.push(J);
    }
    const ft = [], At = j.dims[1], rt = j.dims[2];
    for (let B = 0; B < At; B++) {
      const J = j.data.slice(B * rt, (B + 1) * rt);
      ft.push([B, Math.max(...Array.from(J))]);
    }
    ft.sort((B, J) => J[1] - B[1]);
    const Xt = [], Bt = [], gt = [];
    for (let B = 0; B < Math.min(Tt.length, h); B++)
      Xt[B] = Tt[ft[B][0]];
    for (let B = 0; B < Math.min(At, h); B++) {
      const J = j.data.slice(
        ft[B][0] * rt,
        (ft[B][0] + 1) * rt
      );
      Bt[B] = Array.from(J);
    }
    for (let B = 0; B < Math.min(kt, h); B++) {
      const J = Yt.slice(ft[B][0] * 4, (ft[B][0] + 1) * 4);
      gt[B] = Array.from(J);
    }
    const Dt = [], Ht = [-1, -1, 1, 1];
    for (const B in Xt) {
      const J = [];
      for (let tt = 0; tt < 4; tt++)
        J.push(Xt[B][tt] + Ht[tt] * gt[B][tt]);
      Dt.push(J);
    }
    b.push(Bt), O.push(Dt);
  }
  const E = O.flat(), W = b.flat(), G = [], q = [];
  for (let k = 0; k < W[0].length; k++) {
    const U = W.map((Z) => Z[k]), K = U.map((Z) => Z > c), j = U.filter((Z, nt) => K[nt]);
    if (j.length === 0)
      continue;
    const ot = E.filter((Z, nt) => K[nt]).map((Z, nt) => [...Z, j[nt]]), et = Di(
      ot,
      v,
      // NMS的IoU阈值
      y
      // 每个类别保留的最大目标框数
    );
    G.push(et), q.push(...Array(et.length).fill(k));
  }
  if (G.length === 0)
    g.push([]), S.push(0);
  else {
    const k = [], U = I, K = [L[1], L[0], L[1], L[0]], j = [], at = [];
    G.flat().forEach((et, Z) => {
      j.push(et.slice(0, 4)), at.push(et[4]);
    });
    const ot = gi(j, U);
    j.forEach((et, Z) => {
      ot[Z].forEach((nt, ct) => {
        console.log(nt, K[Math.floor(ct / 2)]), ot[Z][ct] = nt / K[ct];
      }), k.push([...ot[Z], at[Z]]);
    }), g.push(k.map((et, Z) => [q[Z], et[4], ...et.slice(0, 4)])), S.push(q.length);
  }
  const H = g.flat();
  S = S.map((k) => k);
  const z = m;
  return H.forEach((k, U) => {
    const K = It(k[0]), j = k.slice(2);
    k[1];
    const at = z[K], ot = { bbox: j, label: at };
    x.push(ot);
  }), console.log(x), x;
}
function Mt(f, n, p) {
  return Math.max(Math.min(f, p), n);
}
function gi(f, n) {
  const p = n[1], m = n[0], P = f.length;
  if (P > 0) {
    const c = [], v = [], h = [], y = [];
    for (let X = 0; X < P; X++) {
      const [w, M, S, g] = f[X];
      c.push(Math.min(w, S)), v.push(Math.min(M, g)), h.push(Math.max(w, S)), y.push(Math.max(M, g));
    }
    const _ = [];
    for (const X in c)
      _.push([
        Mt(c[X], 0, p),
        Mt(v[X], 0, m),
        Mt(h[X], 0, p),
        Mt(y[X], 0, m)
      ]);
    return _;
  }
  return f;
}
function Di(f, n, p = -1, m = 200) {
  const P = f.map((y) => y[4]), c = f.map((y) => y.slice(0, 4)), v = [];
  let h = P.map((y, _) => _);
  for (h = h.sort((y, _) => P[_] - P[y]).slice(0, m).reverse(); h.length > 0; ) {
    const y = h.at(-1);
    if (v.push(y), p > 0 && v.length === p || h.length === 1)
      break;
    const _ = c[y];
    h = h.slice(0, h.length - 1);
    const X = h.map((M) => c[M]), w = Mi(X, [_]);
    h = h.filter((M, S) => w[S] <= n);
  }
  return v.map((y) => f[y]);
}
function Mi(f, n, p = 1e-5) {
  const m = f.map((y, _) => {
    var X, w;
    return [
      Math.max(y[0], ((X = n[_]) == null ? void 0 : X[0]) ?? Number.NEGATIVE_INFINITY),
      Math.max(y[1], ((w = n[_]) == null ? void 0 : w[1]) ?? Number.NEGATIVE_INFINITY)
    ];
  }), P = f.map((y, _) => {
    var X, w;
    return [
      Math.min(y[2], ((X = n[_]) == null ? void 0 : X[2]) ?? Number.NEGATIVE_INFINITY),
      Math.min(y[3], ((w = n[_]) == null ? void 0 : w[3]) ?? Number.NEGATIVE_INFINITY)
    ];
  }), c = bi(m, P), v = f.map((y) => (y[2] - y[0]) * (y[3] - y[1])), h = n.map((y) => (y[2] - y[0]) * (y[3] - y[1]));
  return c.map((y, _) => y / (v[_] + h[_] - y + p));
}
function bi(f, n) {
  return f.map((m, P) => [
    Math.max(n[P][0] - m[0], 0),
    Math.max(n[P][1] - m[1], 0)
  ]).map((m) => m[0] * m[1]);
}
function Fi(f) {
  const n = Math.max(...f), p = f.map((c) => Math.exp(c - n)), m = p.reduce((c, v) => c + v, 0);
  return p.map((c) => c / m);
}
function Ri(...f) {
  const n = [[], [], []];
  for (const p in f[1])
    n[0].push(f[0]);
  for (const p in f[1]) {
    const m = [];
    for (const P in f[0])
      m.push(f[1][p]);
    n[1].push(m);
  }
  return n;
}
function Wi(f) {
  return f && f.__esModule && Object.prototype.hasOwnProperty.call(f, "default") ? f.default : f;
}
var fe = { exports: {} };
(function(f) {
  var n = {}, p = !1;
  f.exports ? (f.exports = n, p = !0) : typeof document < "u" ? window.ClipperLib = n : self.ClipperLib = n;
  var m;
  if (p) {
    var P = "chrome";
    m = "Netscape";
  } else {
    var P = navigator.userAgent.toString().toLowerCase();
    m = navigator.appName;
  }
  var c = {};
  P.indexOf("chrome") != -1 && P.indexOf("chromium") == -1 ? c.chrome = 1 : c.chrome = 0, P.indexOf("chromium") != -1 ? c.chromium = 1 : c.chromium = 0, P.indexOf("safari") != -1 && P.indexOf("chrome") == -1 && P.indexOf("chromium") == -1 ? c.safari = 1 : c.safari = 0, P.indexOf("firefox") != -1 ? c.firefox = 1 : c.firefox = 0, P.indexOf("firefox/17") != -1 ? c.firefox17 = 1 : c.firefox17 = 0, P.indexOf("firefox/15") != -1 ? c.firefox15 = 1 : c.firefox15 = 0, P.indexOf("firefox/3") != -1 ? c.firefox3 = 1 : c.firefox3 = 0, P.indexOf("opera") != -1 ? c.opera = 1 : c.opera = 0, P.indexOf("msie 10") != -1 ? c.msie10 = 1 : c.msie10 = 0, P.indexOf("msie 9") != -1 ? c.msie9 = 1 : c.msie9 = 0, P.indexOf("msie 8") != -1 ? c.msie8 = 1 : c.msie8 = 0, P.indexOf("msie 7") != -1 ? c.msie7 = 1 : c.msie7 = 0, P.indexOf("msie ") != -1 ? c.msie = 1 : c.msie = 0, n.biginteger_used = null;
  var v;
  function h(t, e, i) {
    n.biginteger_used = 1, t != null && (typeof t == "number" && typeof e > "u" ? this.fromInt(t) : typeof t == "number" ? this.fromNumber(t, e, i) : e == null && typeof t != "string" ? this.fromString(t, 256) : this.fromString(t, e));
  }
  function y() {
    return new h(null);
  }
  function _(t, e, i, r, s, o) {
    for (; --o >= 0; ) {
      var l = e * this[t++] + i[r] + s;
      s = Math.floor(l / 67108864), i[r++] = l & 67108863;
    }
    return s;
  }
  function X(t, e, i, r, s, o) {
    for (var l = e & 32767, a = e >> 15; --o >= 0; ) {
      var u = this[t] & 32767, d = this[t++] >> 15, C = a * u + d * l;
      u = l * u + ((C & 32767) << 15) + i[r] + (s & 1073741823), s = (u >>> 30) + (C >>> 15) + a * d + (s >>> 30), i[r++] = u & 1073741823;
    }
    return s;
  }
  function w(t, e, i, r, s, o) {
    for (var l = e & 16383, a = e >> 14; --o >= 0; ) {
      var u = this[t] & 16383, d = this[t++] >> 14, C = a * u + d * l;
      u = l * u + ((C & 16383) << 14) + i[r] + s, s = (u >> 28) + (C >> 14) + a * d, i[r++] = u & 268435455;
    }
    return s;
  }
  m == "Microsoft Internet Explorer" ? (h.prototype.am = X, v = 30) : m != "Netscape" ? (h.prototype.am = _, v = 26) : (h.prototype.am = w, v = 28), h.prototype.DB = v, h.prototype.DM = (1 << v) - 1, h.prototype.DV = 1 << v;
  var M = 52;
  h.prototype.FV = Math.pow(2, M), h.prototype.F1 = M - v, h.prototype.F2 = 2 * v - M;
  var S = "0123456789abcdefghijklmnopqrstuvwxyz", g = new Array(), x, I;
  for (x = 48, I = 0; I <= 9; ++I) g[x++] = I;
  for (x = 97, I = 10; I < 36; ++I) g[x++] = I;
  for (x = 65, I = 10; I < 36; ++I) g[x++] = I;
  function L(t) {
    return S.charAt(t);
  }
  function O(t, e) {
    var i = g[t.charCodeAt(e)];
    return i ?? -1;
  }
  function b(t) {
    for (var e = this.t - 1; e >= 0; --e) t[e] = this[e];
    t.t = this.t, t.s = this.s;
  }
  function E(t) {
    this.t = 1, this.s = t < 0 ? -1 : 0, t > 0 ? this[0] = t : t < -1 ? this[0] = t + this.DV : this.t = 0;
  }
  function W(t) {
    var e = y();
    return e.fromInt(t), e;
  }
  function G(t, e) {
    var i;
    if (e == 16) i = 4;
    else if (e == 8) i = 3;
    else if (e == 256) i = 8;
    else if (e == 2) i = 1;
    else if (e == 32) i = 5;
    else if (e == 4) i = 2;
    else {
      this.fromRadix(t, e);
      return;
    }
    this.t = 0, this.s = 0;
    for (var r = t.length, s = !1, o = 0; --r >= 0; ) {
      var l = i == 8 ? t[r] & 255 : O(t, r);
      if (l < 0) {
        t.charAt(r) == "-" && (s = !0);
        continue;
      }
      s = !1, o == 0 ? this[this.t++] = l : o + i > this.DB ? (this[this.t - 1] |= (l & (1 << this.DB - o) - 1) << o, this[this.t++] = l >> this.DB - o) : this[this.t - 1] |= l << o, o += i, o >= this.DB && (o -= this.DB);
    }
    i == 8 && t[0] & 128 && (this.s = -1, o > 0 && (this[this.t - 1] |= (1 << this.DB - o) - 1 << o)), this.clamp(), s && h.ZERO.subTo(this, this);
  }
  function q() {
    for (var t = this.s & this.DM; this.t > 0 && this[this.t - 1] == t; ) --this.t;
  }
  function H(t) {
    if (this.s < 0) return "-" + this.negate().toString(t);
    var e;
    if (t == 16) e = 4;
    else if (t == 8) e = 3;
    else if (t == 2) e = 1;
    else if (t == 32) e = 5;
    else if (t == 4) e = 2;
    else return this.toRadix(t);
    var i = (1 << e) - 1, r, s = !1, o = "", l = this.t, a = this.DB - l * this.DB % e;
    if (l-- > 0)
      for (a < this.DB && (r = this[l] >> a) > 0 && (s = !0, o = L(r)); l >= 0; )
        a < e ? (r = (this[l] & (1 << a) - 1) << e - a, r |= this[--l] >> (a += this.DB - e)) : (r = this[l] >> (a -= e) & i, a <= 0 && (a += this.DB, --l)), r > 0 && (s = !0), s && (o += L(r));
    return s ? o : "0";
  }
  function z() {
    var t = y();
    return h.ZERO.subTo(this, t), t;
  }
  function k() {
    return this.s < 0 ? this.negate() : this;
  }
  function U(t) {
    var e = this.s - t.s;
    if (e != 0) return e;
    var i = this.t;
    if (e = i - t.t, e != 0) return this.s < 0 ? -e : e;
    for (; --i >= 0; )
      if ((e = this[i] - t[i]) != 0) return e;
    return 0;
  }
  function K(t) {
    var e = 1, i;
    return (i = t >>> 16) != 0 && (t = i, e += 16), (i = t >> 8) != 0 && (t = i, e += 8), (i = t >> 4) != 0 && (t = i, e += 4), (i = t >> 2) != 0 && (t = i, e += 2), (i = t >> 1) != 0 && (t = i, e += 1), e;
  }
  function j() {
    return this.t <= 0 ? 0 : this.DB * (this.t - 1) + K(this[this.t - 1] ^ this.s & this.DM);
  }
  function at(t, e) {
    var i;
    for (i = this.t - 1; i >= 0; --i) e[i + t] = this[i];
    for (i = t - 1; i >= 0; --i) e[i] = 0;
    e.t = this.t + t, e.s = this.s;
  }
  function ot(t, e) {
    for (var i = t; i < this.t; ++i) e[i - t] = this[i];
    e.t = Math.max(this.t - t, 0), e.s = this.s;
  }
  function et(t, e) {
    var i = t % this.DB, r = this.DB - i, s = (1 << r) - 1, o = Math.floor(t / this.DB), l = this.s << i & this.DM, a;
    for (a = this.t - 1; a >= 0; --a)
      e[a + o + 1] = this[a] >> r | l, l = (this[a] & s) << i;
    for (a = o - 1; a >= 0; --a) e[a] = 0;
    e[o] = l, e.t = this.t + o + 1, e.s = this.s, e.clamp();
  }
  function Z(t, e) {
    e.s = this.s;
    var i = Math.floor(t / this.DB);
    if (i >= this.t) {
      e.t = 0;
      return;
    }
    var r = t % this.DB, s = this.DB - r, o = (1 << r) - 1;
    e[0] = this[i] >> r;
    for (var l = i + 1; l < this.t; ++l)
      e[l - i - 1] |= (this[l] & o) << s, e[l - i] = this[l] >> r;
    r > 0 && (e[this.t - i - 1] |= (this.s & o) << s), e.t = this.t - i, e.clamp();
  }
  function nt(t, e) {
    for (var i = 0, r = 0, s = Math.min(t.t, this.t); i < s; )
      r += this[i] - t[i], e[i++] = r & this.DM, r >>= this.DB;
    if (t.t < this.t) {
      for (r -= t.s; i < this.t; )
        r += this[i], e[i++] = r & this.DM, r >>= this.DB;
      r += this.s;
    } else {
      for (r += this.s; i < t.t; )
        r -= t[i], e[i++] = r & this.DM, r >>= this.DB;
      r -= t.s;
    }
    e.s = r < 0 ? -1 : 0, r < -1 ? e[i++] = this.DV + r : r > 0 && (e[i++] = r), e.t = i, e.clamp();
  }
  function ct(t, e) {
    var i = this.abs(), r = t.abs(), s = i.t;
    for (e.t = s + r.t; --s >= 0; ) e[s] = 0;
    for (s = 0; s < r.t; ++s) e[s + i.t] = i.am(0, r[s], e, s, 0, i.t);
    e.s = 0, e.clamp(), this.s != t.s && h.ZERO.subTo(e, e);
  }
  function _t(t) {
    for (var e = this.abs(), i = t.t = 2 * e.t; --i >= 0; ) t[i] = 0;
    for (i = 0; i < e.t - 1; ++i) {
      var r = e.am(i, e[i], t, 2 * i, 0, 1);
      (t[i + e.t] += e.am(i + 1, 2 * e[i], t, 2 * i + 1, r, e.t - i - 1)) >= e.DV && (t[i + e.t] -= e.DV, t[i + e.t + 1] = 1);
    }
    t.t > 0 && (t[t.t - 1] += e.am(i, e[i], t, 2 * i, 0, 1)), t.s = 0, t.clamp();
  }
  function Ot(t, e, i) {
    var r = t.abs();
    if (!(r.t <= 0)) {
      var s = this.abs();
      if (s.t < r.t) {
        e != null && e.fromInt(0), i != null && this.copyTo(i);
        return;
      }
      i == null && (i = y());
      var o = y(), l = this.s, a = t.s, u = this.DB - K(r[r.t - 1]);
      u > 0 ? (r.lShiftTo(u, o), s.lShiftTo(u, i)) : (r.copyTo(o), s.copyTo(i));
      var d = o.t, C = o[d - 1];
      if (C != 0) {
        var T = C * (1 << this.F1) + (d > 1 ? o[d - 2] >> this.F2 : 0), N = this.FV / T, A = (1 << this.F1) / T, Y = 1 << this.F2, R = i.t, V = R - d, $ = e ?? y();
        for (o.dlShiftTo(V, $), i.compareTo($) >= 0 && (i[i.t++] = 1, i.subTo($, i)), h.ONE.dlShiftTo(d, $), $.subTo(o, o); o.t < d; ) o[o.t++] = 0;
        for (; --V >= 0; ) {
          var lt = i[--R] == C ? this.DM : Math.floor(i[R] * N + (i[R - 1] + Y) * A);
          if ((i[R] += o.am(0, lt, i, V, 0, d)) < lt)
            for (o.dlShiftTo(V, $), i.subTo($, i); i[R] < --lt; ) i.subTo($, i);
        }
        e != null && (i.drShiftTo(d, e), l != a && h.ZERO.subTo(e, e)), i.t = d, i.clamp(), u > 0 && i.rShiftTo(u, i), l < 0 && h.ZERO.subTo(i, i);
      }
    }
  }
  function Tt(t) {
    var e = y();
    return this.abs().divRemTo(t, null, e), this.s < 0 && e.compareTo(h.ZERO) > 0 && t.subTo(e, e), e;
  }
  function it(t) {
    this.m = t;
  }
  function Lt(t) {
    return t.s < 0 || t.compareTo(this.m) >= 0 ? t.mod(this.m) : t;
  }
  function Et(t) {
    return t;
  }
  function Yt(t) {
    t.divRemTo(this.m, null, t);
  }
  function kt(t, e, i) {
    t.multiplyTo(e, i), this.reduce(i);
  }
  function ft(t, e) {
    t.squareTo(e), this.reduce(e);
  }
  it.prototype.convert = Lt, it.prototype.revert = Et, it.prototype.reduce = Yt, it.prototype.mulTo = kt, it.prototype.sqrTo = ft;
  function At() {
    if (this.t < 1) return 0;
    var t = this[0];
    if (!(t & 1)) return 0;
    var e = t & 3;
    return e = e * (2 - (t & 15) * e) & 15, e = e * (2 - (t & 255) * e) & 255, e = e * (2 - ((t & 65535) * e & 65535)) & 65535, e = e * (2 - t * e % this.DV) % this.DV, e > 0 ? this.DV - e : -e;
  }
  function rt(t) {
    this.m = t, this.mp = t.invDigit(), this.mpl = this.mp & 32767, this.mph = this.mp >> 15, this.um = (1 << t.DB - 15) - 1, this.mt2 = 2 * t.t;
  }
  function Xt(t) {
    var e = y();
    return t.abs().dlShiftTo(this.m.t, e), e.divRemTo(this.m, null, e), t.s < 0 && e.compareTo(h.ZERO) > 0 && this.m.subTo(e, e), e;
  }
  function Bt(t) {
    var e = y();
    return t.copyTo(e), this.reduce(e), e;
  }
  function gt(t) {
    for (; t.t <= this.mt2; )
      t[t.t++] = 0;
    for (var e = 0; e < this.m.t; ++e) {
      var i = t[e] & 32767, r = i * this.mpl + ((i * this.mph + (t[e] >> 15) * this.mpl & this.um) << 15) & t.DM;
      for (i = e + this.m.t, t[i] += this.m.am(0, r, t, e, 0, this.m.t); t[i] >= t.DV; )
        t[i] -= t.DV, t[++i]++;
    }
    t.clamp(), t.drShiftTo(this.m.t, t), t.compareTo(this.m) >= 0 && t.subTo(this.m, t);
  }
  function Dt(t, e) {
    t.squareTo(e), this.reduce(e);
  }
  function Ht(t, e, i) {
    t.multiplyTo(e, i), this.reduce(i);
  }
  rt.prototype.convert = Xt, rt.prototype.revert = Bt, rt.prototype.reduce = gt, rt.prototype.mulTo = Ht, rt.prototype.sqrTo = Dt;
  function B() {
    return (this.t > 0 ? this[0] & 1 : this.s) == 0;
  }
  function J(t, e) {
    if (t > 4294967295 || t < 1) return h.ONE;
    var i = y(), r = y(), s = e.convert(this), o = K(t) - 1;
    for (s.copyTo(i); --o >= 0; )
      if (e.sqrTo(i, r), (t & 1 << o) > 0) e.mulTo(r, s, i);
      else {
        var l = i;
        i = r, r = l;
      }
    return e.revert(i);
  }
  function tt(t, e) {
    var i;
    return t < 256 || e.isEven() ? i = new it(e) : i = new rt(e), this.exp(t, i);
  }
  h.prototype.copyTo = b, h.prototype.fromInt = E, h.prototype.fromString = G, h.prototype.clamp = q, h.prototype.dlShiftTo = at, h.prototype.drShiftTo = ot, h.prototype.lShiftTo = et, h.prototype.rShiftTo = Z, h.prototype.subTo = nt, h.prototype.multiplyTo = ct, h.prototype.squareTo = _t, h.prototype.divRemTo = Ot, h.prototype.invDigit = At, h.prototype.isEven = B, h.prototype.exp = J, h.prototype.toString = H, h.prototype.negate = z, h.prototype.abs = k, h.prototype.compareTo = U, h.prototype.bitLength = j, h.prototype.mod = Tt, h.prototype.modPowInt = tt, h.ZERO = W(0), h.ONE = W(1);
  function Pt() {
    var t = y();
    return this.copyTo(t), t;
  }
  function ve() {
    if (this.s < 0) {
      if (this.t == 1) return this[0] - this.DV;
      if (this.t == 0) return -1;
    } else {
      if (this.t == 1) return this[0];
      if (this.t == 0) return 0;
    }
    return (this[1] & (1 << 32 - this.DB) - 1) << this.DB | this[0];
  }
  function Ce() {
    return this.t == 0 ? this.s : this[0] << 24 >> 24;
  }
  function xe() {
    return this.t == 0 ? this.s : this[0] << 16 >> 16;
  }
  function Ie(t) {
    return Math.floor(Math.LN2 * this.DB / Math.log(t));
  }
  function _e() {
    return this.s < 0 ? -1 : this.t <= 0 || this.t == 1 && this[0] <= 0 ? 0 : 1;
  }
  function Te(t) {
    if (t == null && (t = 10), this.signum() == 0 || t < 2 || t > 36) return "0";
    var e = this.chunkSize(t), i = Math.pow(t, e), r = W(i), s = y(), o = y(), l = "";
    for (this.divRemTo(r, s, o); s.signum() > 0; )
      l = (i + o.intValue()).toString(t).substr(1) + l, s.divRemTo(r, s, o);
    return o.intValue().toString(t) + l;
  }
  function Le(t, e) {
    this.fromInt(0), e == null && (e = 10);
    for (var i = this.chunkSize(e), r = Math.pow(e, i), s = !1, o = 0, l = 0, a = 0; a < t.length; ++a) {
      var u = O(t, a);
      if (u < 0) {
        t.charAt(a) == "-" && this.signum() == 0 && (s = !0);
        continue;
      }
      l = e * l + u, ++o >= i && (this.dMultiply(r), this.dAddOffset(l, 0), o = 0, l = 0);
    }
    o > 0 && (this.dMultiply(Math.pow(e, o)), this.dAddOffset(l, 0)), s && h.ZERO.subTo(this, this);
  }
  function Xe(t, e, i) {
    if (typeof e == "number")
      if (t < 2) this.fromInt(1);
      else
        for (this.fromNumber(t, i), this.testBit(t - 1) || this.bitwiseTo(h.ONE.shiftLeft(t - 1), Ut, this), this.isEven() && this.dAddOffset(1, 0); !this.isProbablePrime(e); )
          this.dAddOffset(2, 0), this.bitLength() > t && this.subTo(h.ONE.shiftLeft(t - 1), this);
    else {
      var r = new Array(), s = t & 7;
      r.length = (t >> 3) + 1, e.nextBytes(r), s > 0 ? r[0] &= (1 << s) - 1 : r[0] = 0, this.fromString(r, 256);
    }
  }
  function Ne() {
    var t = this.t, e = new Array();
    e[0] = this.s;
    var i = this.DB - t * this.DB % 8, r, s = 0;
    if (t-- > 0)
      for (i < this.DB && (r = this[t] >> i) != (this.s & this.DM) >> i && (e[s++] = r | this.s << this.DB - i); t >= 0; )
        i < 8 ? (r = (this[t] & (1 << i) - 1) << 8 - i, r |= this[--t] >> (i += this.DB - 8)) : (r = this[t] >> (i -= 8) & 255, i <= 0 && (i += this.DB, --t)), r & 128 && (r |= -256), s == 0 && (this.s & 128) != (r & 128) && ++s, (s > 0 || r != this.s) && (e[s++] = r);
    return e;
  }
  function Se(t) {
    return this.compareTo(t) == 0;
  }
  function we(t) {
    return this.compareTo(t) < 0 ? this : t;
  }
  function Oe(t) {
    return this.compareTo(t) > 0 ? this : t;
  }
  function Ee(t, e, i) {
    var r, s, o = Math.min(t.t, this.t);
    for (r = 0; r < o; ++r) i[r] = e(this[r], t[r]);
    if (t.t < this.t) {
      for (s = t.s & this.DM, r = o; r < this.t; ++r) i[r] = e(this[r], s);
      i.t = this.t;
    } else {
      for (s = this.s & this.DM, r = o; r < t.t; ++r) i[r] = e(s, t[r]);
      i.t = t.t;
    }
    i.s = e(this.s, t.s), i.clamp();
  }
  function Ye(t, e) {
    return t & e;
  }
  function Ae(t) {
    var e = y();
    return this.bitwiseTo(t, Ye, e), e;
  }
  function Ut(t, e) {
    return t | e;
  }
  function Be(t) {
    var e = y();
    return this.bitwiseTo(t, Ut, e), e;
  }
  function ee(t, e) {
    return t ^ e;
  }
  function ge(t) {
    var e = y();
    return this.bitwiseTo(t, ee, e), e;
  }
  function ie(t, e) {
    return t & ~e;
  }
  function De(t) {
    var e = y();
    return this.bitwiseTo(t, ie, e), e;
  }
  function Me() {
    for (var t = y(), e = 0; e < this.t; ++e) t[e] = this.DM & ~this[e];
    return t.t = this.t, t.s = ~this.s, t;
  }
  function be(t) {
    var e = y();
    return t < 0 ? this.rShiftTo(-t, e) : this.lShiftTo(t, e), e;
  }
  function Fe(t) {
    var e = y();
    return t < 0 ? this.lShiftTo(-t, e) : this.rShiftTo(t, e), e;
  }
  function Re(t) {
    if (t == 0) return -1;
    var e = 0;
    return t & 65535 || (t >>= 16, e += 16), t & 255 || (t >>= 8, e += 8), t & 15 || (t >>= 4, e += 4), t & 3 || (t >>= 2, e += 2), t & 1 || ++e, e;
  }
  function We() {
    for (var t = 0; t < this.t; ++t)
      if (this[t] != 0) return t * this.DB + Re(this[t]);
    return this.s < 0 ? this.t * this.DB : -1;
  }
  function qe(t) {
    for (var e = 0; t != 0; )
      t &= t - 1, ++e;
    return e;
  }
  function ke() {
    for (var t = 0, e = this.s & this.DM, i = 0; i < this.t; ++i) t += qe(this[i] ^ e);
    return t;
  }
  function He(t) {
    var e = Math.floor(t / this.DB);
    return e >= this.t ? this.s != 0 : (this[e] & 1 << t % this.DB) != 0;
  }
  function Ue(t, e) {
    var i = h.ONE.shiftLeft(t);
    return this.bitwiseTo(i, e, i), i;
  }
  function Ge(t) {
    return this.changeBit(t, Ut);
  }
  function Je(t) {
    return this.changeBit(t, ie);
  }
  function Ve(t) {
    return this.changeBit(t, ee);
  }
  function Ze(t, e) {
    for (var i = 0, r = 0, s = Math.min(t.t, this.t); i < s; )
      r += this[i] + t[i], e[i++] = r & this.DM, r >>= this.DB;
    if (t.t < this.t) {
      for (r += t.s; i < this.t; )
        r += this[i], e[i++] = r & this.DM, r >>= this.DB;
      r += this.s;
    } else {
      for (r += this.s; i < t.t; )
        r += t[i], e[i++] = r & this.DM, r >>= this.DB;
      r += t.s;
    }
    e.s = r < 0 ? -1 : 0, r > 0 ? e[i++] = r : r < -1 && (e[i++] = this.DV + r), e.t = i, e.clamp();
  }
  function ze(t) {
    var e = y();
    return this.addTo(t, e), e;
  }
  function Ke(t) {
    var e = y();
    return this.subTo(t, e), e;
  }
  function je(t) {
    var e = y();
    return this.multiplyTo(t, e), e;
  }
  function Qe() {
    var t = y();
    return this.squareTo(t), t;
  }
  function $e(t) {
    var e = y();
    return this.divRemTo(t, e, null), e;
  }
  function ti(t) {
    var e = y();
    return this.divRemTo(t, null, e), e;
  }
  function ei(t) {
    var e = y(), i = y();
    return this.divRemTo(t, e, i), new Array(e, i);
  }
  function ii(t) {
    this[this.t] = this.am(0, t - 1, this, 0, 0, this.t), ++this.t, this.clamp();
  }
  function ni(t, e) {
    if (t != 0) {
      for (; this.t <= e; ) this[this.t++] = 0;
      for (this[e] += t; this[e] >= this.DV; )
        this[e] -= this.DV, ++e >= this.t && (this[this.t++] = 0), ++this[e];
    }
  }
  function Nt() {
  }
  function ne(t) {
    return t;
  }
  function ri(t, e, i) {
    t.multiplyTo(e, i);
  }
  function si(t, e) {
    t.squareTo(e);
  }
  Nt.prototype.convert = ne, Nt.prototype.revert = ne, Nt.prototype.mulTo = ri, Nt.prototype.sqrTo = si;
  function oi(t) {
    return this.exp(t, new Nt());
  }
  function li(t, e, i) {
    var r = Math.min(this.t + t.t, e);
    for (i.s = 0, i.t = r; r > 0; ) i[--r] = 0;
    var s;
    for (s = i.t - this.t; r < s; ++r) i[r + this.t] = this.am(0, t[r], i, r, 0, this.t);
    for (s = Math.min(t.t, e); r < s; ++r) this.am(0, t[r], i, r, 0, e - r);
    i.clamp();
  }
  function ai(t, e, i) {
    --e;
    var r = i.t = this.t + t.t - e;
    for (i.s = 0; --r >= 0; ) i[r] = 0;
    for (r = Math.max(e - this.t, 0); r < t.t; ++r)
      i[this.t + r - e] = this.am(e - r, t[r], i, 0, 0, this.t + r - e);
    i.clamp(), i.drShiftTo(1, i);
  }
  function dt(t) {
    this.r2 = y(), this.q3 = y(), h.ONE.dlShiftTo(2 * t.t, this.r2), this.mu = this.r2.divide(t), this.m = t;
  }
  function fi(t) {
    if (t.s < 0 || t.t > 2 * this.m.t) return t.mod(this.m);
    if (t.compareTo(this.m) < 0) return t;
    var e = y();
    return t.copyTo(e), this.reduce(e), e;
  }
  function hi(t) {
    return t;
  }
  function ui(t) {
    for (t.drShiftTo(this.m.t - 1, this.r2), t.t > this.m.t + 1 && (t.t = this.m.t + 1, t.clamp()), this.mu.multiplyUpperTo(this.r2, this.m.t + 1, this.q3), this.m.multiplyLowerTo(this.q3, this.m.t + 1, this.r2); t.compareTo(this.r2) < 0; ) t.dAddOffset(1, this.m.t + 1);
    for (t.subTo(this.r2, t); t.compareTo(this.m) >= 0; ) t.subTo(this.m, t);
  }
  function pi(t, e) {
    t.squareTo(e), this.reduce(e);
  }
  function ci(t, e, i) {
    t.multiplyTo(e, i), this.reduce(i);
  }
  dt.prototype.convert = fi, dt.prototype.revert = hi, dt.prototype.reduce = ui, dt.prototype.mulTo = ci, dt.prototype.sqrTo = pi;
  function mi(t, e) {
    var i = t.bitLength(), r, s = W(1), o;
    if (i <= 0) return s;
    i < 18 ? r = 1 : i < 48 ? r = 3 : i < 144 ? r = 4 : i < 768 ? r = 5 : r = 6, i < 8 ? o = new it(e) : e.isEven() ? o = new dt(e) : o = new rt(e);
    var l = new Array(), a = 3, u = r - 1, d = (1 << r) - 1;
    if (l[1] = o.convert(this), r > 1) {
      var C = y();
      for (o.sqrTo(l[1], C); a <= d; )
        l[a] = y(), o.mulTo(C, l[a - 2], l[a]), a += 2;
    }
    var T = t.t - 1, N, A = !0, Y = y(), R;
    for (i = K(t[T]) - 1; T >= 0; ) {
      for (i >= u ? N = t[T] >> i - u & d : (N = (t[T] & (1 << i + 1) - 1) << u - i, T > 0 && (N |= t[T - 1] >> this.DB + i - u)), a = r; !(N & 1); )
        N >>= 1, --a;
      if ((i -= a) < 0 && (i += this.DB, --T), A)
        l[N].copyTo(s), A = !1;
      else {
        for (; a > 1; )
          o.sqrTo(s, Y), o.sqrTo(Y, s), a -= 2;
        a > 0 ? o.sqrTo(s, Y) : (R = s, s = Y, Y = R), o.mulTo(Y, l[N], s);
      }
      for (; T >= 0 && !(t[T] & 1 << i); )
        o.sqrTo(s, Y), R = s, s = Y, Y = R, --i < 0 && (i = this.DB - 1, --T);
    }
    return o.revert(s);
  }
  function Pi(t) {
    var e = this.s < 0 ? this.negate() : this.clone(), i = t.s < 0 ? t.negate() : t.clone();
    if (e.compareTo(i) < 0) {
      var r = e;
      e = i, i = r;
    }
    var s = e.getLowestSetBit(), o = i.getLowestSetBit();
    if (o < 0) return e;
    for (s < o && (o = s), o > 0 && (e.rShiftTo(o, e), i.rShiftTo(o, i)); e.signum() > 0; )
      (s = e.getLowestSetBit()) > 0 && e.rShiftTo(s, e), (s = i.getLowestSetBit()) > 0 && i.rShiftTo(s, i), e.compareTo(i) >= 0 ? (e.subTo(i, e), e.rShiftTo(1, e)) : (i.subTo(e, i), i.rShiftTo(1, i));
    return o > 0 && i.lShiftTo(o, i), i;
  }
  function di(t) {
    if (t <= 0) return 0;
    var e = this.DV % t, i = this.s < 0 ? t - 1 : 0;
    if (this.t > 0)
      if (e == 0) i = this[0] % t;
      else
        for (var r = this.t - 1; r >= 0; --r) i = (e * i + this[r]) % t;
    return i;
  }
  function yi(t) {
    var e = t.isEven();
    if (this.isEven() && e || t.signum() == 0) return h.ZERO;
    for (var i = t.clone(), r = this.clone(), s = W(1), o = W(0), l = W(0), a = W(1); i.signum() != 0; ) {
      for (; i.isEven(); )
        i.rShiftTo(1, i), e ? ((!s.isEven() || !o.isEven()) && (s.addTo(this, s), o.subTo(t, o)), s.rShiftTo(1, s)) : o.isEven() || o.subTo(t, o), o.rShiftTo(1, o);
      for (; r.isEven(); )
        r.rShiftTo(1, r), e ? ((!l.isEven() || !a.isEven()) && (l.addTo(this, l), a.subTo(t, a)), l.rShiftTo(1, l)) : a.isEven() || a.subTo(t, a), a.rShiftTo(1, a);
      i.compareTo(r) >= 0 ? (i.subTo(r, i), e && s.subTo(l, s), o.subTo(a, o)) : (r.subTo(i, r), e && l.subTo(s, l), a.subTo(o, a));
    }
    if (r.compareTo(h.ONE) != 0) return h.ZERO;
    if (a.compareTo(t) >= 0) return a.subtract(t);
    if (a.signum() < 0) a.addTo(t, a);
    else return a;
    return a.signum() < 0 ? a.add(t) : a;
  }
  var Q = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71, 73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151, 157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233, 239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317, 331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419, 421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503, 509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607, 613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701, 709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811, 821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911, 919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997], vi = (1 << 26) / Q[Q.length - 1];
  function Ci(t) {
    var e, i = this.abs();
    if (i.t == 1 && i[0] <= Q[Q.length - 1]) {
      for (e = 0; e < Q.length; ++e)
        if (i[0] == Q[e]) return !0;
      return !1;
    }
    if (i.isEven()) return !1;
    for (e = 1; e < Q.length; ) {
      for (var r = Q[e], s = e + 1; s < Q.length && r < vi; ) r *= Q[s++];
      for (r = i.modInt(r); e < s; )
        if (r % Q[e++] == 0) return !1;
    }
    return i.millerRabin(t);
  }
  function xi(t) {
    var e = this.subtract(h.ONE), i = e.getLowestSetBit();
    if (i <= 0) return !1;
    var r = e.shiftRight(i);
    t = t + 1 >> 1, t > Q.length && (t = Q.length);
    for (var s = y(), o = 0; o < t; ++o) {
      s.fromInt(Q[Math.floor(Math.random() * Q.length)]);
      var l = s.modPow(r, this);
      if (l.compareTo(h.ONE) != 0 && l.compareTo(e) != 0) {
        for (var a = 1; a++ < i && l.compareTo(e) != 0; )
          if (l = l.modPowInt(2, this), l.compareTo(h.ONE) == 0) return !1;
        if (l.compareTo(e) != 0) return !1;
      }
    }
    return !0;
  }
  h.prototype.chunkSize = Ie, h.prototype.toRadix = Te, h.prototype.fromRadix = Le, h.prototype.fromNumber = Xe, h.prototype.bitwiseTo = Ee, h.prototype.changeBit = Ue, h.prototype.addTo = Ze, h.prototype.dMultiply = ii, h.prototype.dAddOffset = ni, h.prototype.multiplyLowerTo = li, h.prototype.multiplyUpperTo = ai, h.prototype.modInt = di, h.prototype.millerRabin = xi, h.prototype.clone = Pt, h.prototype.intValue = ve, h.prototype.byteValue = Ce, h.prototype.shortValue = xe, h.prototype.signum = _e, h.prototype.toByteArray = Ne, h.prototype.equals = Se, h.prototype.min = we, h.prototype.max = Oe, h.prototype.and = Ae, h.prototype.or = Be, h.prototype.xor = ge, h.prototype.andNot = De, h.prototype.not = Me, h.prototype.shiftLeft = be, h.prototype.shiftRight = Fe, h.prototype.getLowestSetBit = We, h.prototype.bitCount = ke, h.prototype.testBit = He, h.prototype.setBit = Ge, h.prototype.clearBit = Je, h.prototype.flipBit = Ve, h.prototype.add = ze, h.prototype.subtract = Ke, h.prototype.multiply = je, h.prototype.divide = $e, h.prototype.remainder = ti, h.prototype.divideAndRemainder = ei, h.prototype.modPow = mi, h.prototype.modInverse = yi, h.prototype.pow = oi, h.prototype.gcd = Pi, h.prototype.isProbablePrime = Ci, h.prototype.square = Qe;
  var F = h;
  if (F.prototype.IsNegative = function() {
    return this.compareTo(F.ZERO) == -1;
  }, F.op_Equality = function(t, e) {
    return t.compareTo(e) == 0;
  }, F.op_Inequality = function(t, e) {
    return t.compareTo(e) != 0;
  }, F.op_GreaterThan = function(t, e) {
    return t.compareTo(e) > 0;
  }, F.op_LessThan = function(t, e) {
    return t.compareTo(e) < 0;
  }, F.op_Addition = function(t, e) {
    return new F(t).add(new F(e));
  }, F.op_Subtraction = function(t, e) {
    return new F(t).subtract(new F(e));
  }, F.Int128Mul = function(t, e) {
    return new F(t).multiply(new F(e));
  }, F.op_Division = function(t, e) {
    return t.divide(e);
  }, F.prototype.ToDouble = function() {
    return parseFloat(this.toString());
  }, typeof Gt > "u")
    var Gt = function(t, e) {
      var i;
      if (typeof Object.getOwnPropertyNames > "u") {
        for (i in e.prototype)
          (typeof t.prototype[i] > "u" || t.prototype[i] == Object.prototype[i]) && (t.prototype[i] = e.prototype[i]);
        for (i in e)
          typeof t[i] > "u" && (t[i] = e[i]);
        t.$baseCtor = e;
      } else {
        for (var r = Object.getOwnPropertyNames(e.prototype), s = 0; s < r.length; s++)
          typeof Object.getOwnPropertyDescriptor(t.prototype, r[s]) > "u" && Object.defineProperty(t.prototype, r[s], Object.getOwnPropertyDescriptor(e.prototype, r[s]));
        for (i in e)
          typeof t[i] > "u" && (t[i] = e[i]);
        t.$baseCtor = e;
      }
    };
  n.Path = function() {
    return [];
  }, n.Paths = function() {
    return [];
  }, n.DoublePoint = function() {
    var t = arguments;
    this.X = 0, this.Y = 0, t.length == 1 ? (this.X = t[0].X, this.Y = t[0].Y) : t.length == 2 && (this.X = t[0], this.Y = t[1]);
  }, n.DoublePoint0 = function() {
    this.X = 0, this.Y = 0;
  }, n.DoublePoint1 = function(t) {
    this.X = t.X, this.Y = t.Y;
  }, n.DoublePoint2 = function(t, e) {
    this.X = t, this.Y = e;
  }, n.PolyNode = function() {
    this.m_Parent = null, this.m_polygon = new n.Path(), this.m_Index = 0, this.m_jointype = 0, this.m_endtype = 0, this.m_Childs = [], this.IsOpen = !1;
  }, n.PolyNode.prototype.IsHoleNode = function() {
    for (var t = !0, e = this.m_Parent; e !== null; )
      t = !t, e = e.m_Parent;
    return t;
  }, n.PolyNode.prototype.ChildCount = function() {
    return this.m_Childs.length;
  }, n.PolyNode.prototype.Contour = function() {
    return this.m_polygon;
  }, n.PolyNode.prototype.AddChild = function(t) {
    var e = this.m_Childs.length;
    this.m_Childs.push(t), t.m_Parent = this, t.m_Index = e;
  }, n.PolyNode.prototype.GetNext = function() {
    return this.m_Childs.length > 0 ? this.m_Childs[0] : this.GetNextSiblingUp();
  }, n.PolyNode.prototype.GetNextSiblingUp = function() {
    return this.m_Parent === null ? null : this.m_Index == this.m_Parent.m_Childs.length - 1 ? this.m_Parent.GetNextSiblingUp() : this.m_Parent.m_Childs[this.m_Index + 1];
  }, n.PolyNode.prototype.Childs = function() {
    return this.m_Childs;
  }, n.PolyNode.prototype.Parent = function() {
    return this.m_Parent;
  }, n.PolyNode.prototype.IsHole = function() {
    return this.IsHoleNode();
  }, n.PolyTree = function() {
    this.m_AllPolys = [], n.PolyNode.call(this);
  }, n.PolyTree.prototype.Clear = function() {
    for (var t = 0, e = this.m_AllPolys.length; t < e; t++)
      this.m_AllPolys[t] = null;
    this.m_AllPolys.length = 0, this.m_Childs.length = 0;
  }, n.PolyTree.prototype.GetFirst = function() {
    return this.m_Childs.length > 0 ? this.m_Childs[0] : null;
  }, n.PolyTree.prototype.Total = function() {
    return this.m_AllPolys.length;
  }, Gt(n.PolyTree, n.PolyNode), n.Math_Abs_Int64 = n.Math_Abs_Int32 = n.Math_Abs_Double = function(t) {
    return Math.abs(t);
  }, n.Math_Max_Int32_Int32 = function(t, e) {
    return Math.max(t, e);
  }, c.msie || c.opera || c.safari ? n.Cast_Int32 = function(t) {
    return t | 0;
  } : n.Cast_Int32 = function(t) {
    return ~~t;
  }, c.chrome ? n.Cast_Int64 = function(t) {
    return t < -2147483648 || t > 2147483647 ? t < 0 ? Math.ceil(t) : Math.floor(t) : ~~t;
  } : c.firefox && typeof Number.toInteger == "function" ? n.Cast_Int64 = function(t) {
    return Number.toInteger(t);
  } : c.msie7 || c.msie8 ? n.Cast_Int64 = function(t) {
    return parseInt(t, 10);
  } : c.msie ? n.Cast_Int64 = function(t) {
    return t < -2147483648 || t > 2147483647 ? t < 0 ? Math.ceil(t) : Math.floor(t) : t | 0;
  } : n.Cast_Int64 = function(t) {
    return t < 0 ? Math.ceil(t) : Math.floor(t);
  }, n.Clear = function(t) {
    t.length = 0;
  }, n.PI = 3.141592653589793, n.PI2 = 2 * 3.141592653589793, n.IntPoint = function() {
    var t = arguments, e = t.length;
    this.X = 0, this.Y = 0;
    var i, r;
    if (e == 2)
      this.X = t[0], this.Y = t[1];
    else if (e == 1)
      if (t[0] instanceof n.DoublePoint) {
        var i = t[0];
        this.X = n.Clipper.Round(i.X), this.Y = n.Clipper.Round(i.Y);
      } else {
        var r = t[0];
        this.X = r.X, this.Y = r.Y;
      }
    else
      this.X = 0, this.Y = 0;
  }, n.IntPoint.op_Equality = function(t, e) {
    return t.X == e.X && t.Y == e.Y;
  }, n.IntPoint.op_Inequality = function(t, e) {
    return t.X != e.X || t.Y != e.Y;
  }, n.IntPoint0 = function() {
    this.X = 0, this.Y = 0;
  }, n.IntPoint1 = function(t) {
    this.X = t.X, this.Y = t.Y;
  }, n.IntPoint1dp = function(t) {
    this.X = n.Clipper.Round(t.X), this.Y = n.Clipper.Round(t.Y);
  }, n.IntPoint2 = function(t, e) {
    this.X = t, this.Y = e;
  }, n.IntRect = function() {
    var t = arguments, e = t.length;
    e == 4 ? (this.left = t[0], this.top = t[1], this.right = t[2], this.bottom = t[3]) : e == 1 ? (this.left = ir.left, this.top = ir.top, this.right = ir.right, this.bottom = ir.bottom) : (this.left = 0, this.top = 0, this.right = 0, this.bottom = 0);
  }, n.IntRect0 = function() {
    this.left = 0, this.top = 0, this.right = 0, this.bottom = 0;
  }, n.IntRect1 = function(t) {
    this.left = t.left, this.top = t.top, this.right = t.right, this.bottom = t.bottom;
  }, n.IntRect4 = function(t, e, i, r) {
    this.left = t, this.top = e, this.right = i, this.bottom = r;
  }, n.ClipType = {
    ctIntersection: 0,
    ctUnion: 1,
    ctDifference: 2,
    ctXor: 3
  }, n.PolyType = {
    ptSubject: 0,
    ptClip: 1
  }, n.PolyFillType = {
    pftEvenOdd: 0,
    pftNonZero: 1,
    pftPositive: 2,
    pftNegative: 3
  }, n.JoinType = {
    jtSquare: 0,
    jtRound: 1,
    jtMiter: 2
  }, n.EndType = {
    etOpenSquare: 0,
    etOpenRound: 1,
    etOpenButt: 2,
    etClosedLine: 3,
    etClosedPolygon: 4
  }, n.EdgeSide = {
    esLeft: 0,
    esRight: 1
  }, n.Direction = {
    dRightToLeft: 0,
    dLeftToRight: 1
  }, n.TEdge = function() {
    this.Bot = new n.IntPoint(), this.Curr = new n.IntPoint(), this.Top = new n.IntPoint(), this.Delta = new n.IntPoint(), this.Dx = 0, this.PolyTyp = n.PolyType.ptSubject, this.Side = n.EdgeSide.esLeft, this.WindDelta = 0, this.WindCnt = 0, this.WindCnt2 = 0, this.OutIdx = 0, this.Next = null, this.Prev = null, this.NextInLML = null, this.NextInAEL = null, this.PrevInAEL = null, this.NextInSEL = null, this.PrevInSEL = null;
  }, n.IntersectNode = function() {
    this.Edge1 = null, this.Edge2 = null, this.Pt = new n.IntPoint();
  }, n.MyIntersectNodeSort = function() {
  }, n.MyIntersectNodeSort.Compare = function(t, e) {
    return e.Pt.Y - t.Pt.Y;
  }, n.LocalMinima = function() {
    this.Y = 0, this.LeftBound = null, this.RightBound = null, this.Next = null;
  }, n.Scanbeam = function() {
    this.Y = 0, this.Next = null;
  }, n.OutRec = function() {
    this.Idx = 0, this.IsHole = !1, this.IsOpen = !1, this.FirstLeft = null, this.Pts = null, this.BottomPt = null, this.PolyNode = null;
  }, n.OutPt = function() {
    this.Idx = 0, this.Pt = new n.IntPoint(), this.Next = null, this.Prev = null;
  }, n.Join = function() {
    this.OutPt1 = null, this.OutPt2 = null, this.OffPt = new n.IntPoint();
  }, n.ClipperBase = function() {
    this.m_MinimaList = null, this.m_CurrentLM = null, this.m_edges = new Array(), this.m_UseFullRange = !1, this.m_HasOpenPaths = !1, this.PreserveCollinear = !1, this.m_MinimaList = null, this.m_CurrentLM = null, this.m_UseFullRange = !1, this.m_HasOpenPaths = !1;
  }, n.ClipperBase.horizontal = -9007199254740992, n.ClipperBase.Skip = -2, n.ClipperBase.Unassigned = -1, n.ClipperBase.tolerance = 1e-20, n.ClipperBase.loRange = 47453132, n.ClipperBase.hiRange = 4503599627370495, n.ClipperBase.near_zero = function(t) {
    return t > -n.ClipperBase.tolerance && t < n.ClipperBase.tolerance;
  }, n.ClipperBase.IsHorizontal = function(t) {
    return t.Delta.Y === 0;
  }, n.ClipperBase.prototype.PointIsVertex = function(t, e) {
    var i = e;
    do {
      if (n.IntPoint.op_Equality(i.Pt, t))
        return !0;
      i = i.Next;
    } while (i != e);
    return !1;
  }, n.ClipperBase.prototype.PointOnLineSegment = function(t, e, i, r) {
    return r ? t.X == e.X && t.Y == e.Y || t.X == i.X && t.Y == i.Y || t.X > e.X == t.X < i.X && t.Y > e.Y == t.Y < i.Y && F.op_Equality(
      F.Int128Mul(t.X - e.X, i.Y - e.Y),
      F.Int128Mul(i.X - e.X, t.Y - e.Y)
    ) : t.X == e.X && t.Y == e.Y || t.X == i.X && t.Y == i.Y || t.X > e.X == t.X < i.X && t.Y > e.Y == t.Y < i.Y && (t.X - e.X) * (i.Y - e.Y) == (i.X - e.X) * (t.Y - e.Y);
  }, n.ClipperBase.prototype.PointOnPolygon = function(t, e, i) {
    for (var r = e; ; ) {
      if (this.PointOnLineSegment(t, r.Pt, r.Next.Pt, i))
        return !0;
      if (r = r.Next, r == e)
        break;
    }
    return !1;
  }, n.ClipperBase.prototype.SlopesEqual = n.ClipperBase.SlopesEqual = function() {
    var t = arguments, e = t.length, i, r, s, o, l, a, u;
    return e == 3 ? (i = t[0], r = t[1], u = t[2], u ? F.op_Equality(F.Int128Mul(i.Delta.Y, r.Delta.X), F.Int128Mul(i.Delta.X, r.Delta.Y)) : n.Cast_Int64(i.Delta.Y * r.Delta.X) == n.Cast_Int64(i.Delta.X * r.Delta.Y)) : e == 4 ? (s = t[0], o = t[1], l = t[2], u = t[3], u ? F.op_Equality(F.Int128Mul(s.Y - o.Y, o.X - l.X), F.Int128Mul(s.X - o.X, o.Y - l.Y)) : n.Cast_Int64((s.Y - o.Y) * (o.X - l.X)) - n.Cast_Int64((s.X - o.X) * (o.Y - l.Y)) === 0) : (s = t[0], o = t[1], l = t[2], a = t[3], u = t[4], u ? F.op_Equality(F.Int128Mul(s.Y - o.Y, l.X - a.X), F.Int128Mul(s.X - o.X, l.Y - a.Y)) : n.Cast_Int64((s.Y - o.Y) * (l.X - a.X)) - n.Cast_Int64((s.X - o.X) * (l.Y - a.Y)) === 0);
  }, n.ClipperBase.SlopesEqual3 = function(t, e, i) {
    return i ? F.op_Equality(F.Int128Mul(t.Delta.Y, e.Delta.X), F.Int128Mul(t.Delta.X, e.Delta.Y)) : n.Cast_Int64(t.Delta.Y * e.Delta.X) == n.Cast_Int64(t.Delta.X * e.Delta.Y);
  }, n.ClipperBase.SlopesEqual4 = function(t, e, i, r) {
    return r ? F.op_Equality(F.Int128Mul(t.Y - e.Y, e.X - i.X), F.Int128Mul(t.X - e.X, e.Y - i.Y)) : n.Cast_Int64((t.Y - e.Y) * (e.X - i.X)) - n.Cast_Int64((t.X - e.X) * (e.Y - i.Y)) === 0;
  }, n.ClipperBase.SlopesEqual5 = function(t, e, i, r, s) {
    return s ? F.op_Equality(F.Int128Mul(t.Y - e.Y, i.X - r.X), F.Int128Mul(t.X - e.X, i.Y - r.Y)) : n.Cast_Int64((t.Y - e.Y) * (i.X - r.X)) - n.Cast_Int64((t.X - e.X) * (i.Y - r.Y)) === 0;
  }, n.ClipperBase.prototype.Clear = function() {
    this.DisposeLocalMinimaList();
    for (var t = 0, e = this.m_edges.length; t < e; ++t) {
      for (var i = 0, r = this.m_edges[t].length; i < r; ++i)
        this.m_edges[t][i] = null;
      n.Clear(this.m_edges[t]);
    }
    n.Clear(this.m_edges), this.m_UseFullRange = !1, this.m_HasOpenPaths = !1;
  }, n.ClipperBase.prototype.DisposeLocalMinimaList = function() {
    for (; this.m_MinimaList !== null; ) {
      var t = this.m_MinimaList.Next;
      this.m_MinimaList = null, this.m_MinimaList = t;
    }
    this.m_CurrentLM = null;
  }, n.ClipperBase.prototype.RangeTest = function(t, e) {
    e.Value ? (t.X > n.ClipperBase.hiRange || t.Y > n.ClipperBase.hiRange || -t.X > n.ClipperBase.hiRange || -t.Y > n.ClipperBase.hiRange) && n.Error("Coordinate outside allowed range in RangeTest().") : (t.X > n.ClipperBase.loRange || t.Y > n.ClipperBase.loRange || -t.X > n.ClipperBase.loRange || -t.Y > n.ClipperBase.loRange) && (e.Value = !0, this.RangeTest(t, e));
  }, n.ClipperBase.prototype.InitEdge = function(t, e, i, r) {
    t.Next = e, t.Prev = i, t.Curr.X = r.X, t.Curr.Y = r.Y, t.OutIdx = -1;
  }, n.ClipperBase.prototype.InitEdge2 = function(t, e) {
    t.Curr.Y >= t.Next.Curr.Y ? (t.Bot.X = t.Curr.X, t.Bot.Y = t.Curr.Y, t.Top.X = t.Next.Curr.X, t.Top.Y = t.Next.Curr.Y) : (t.Top.X = t.Curr.X, t.Top.Y = t.Curr.Y, t.Bot.X = t.Next.Curr.X, t.Bot.Y = t.Next.Curr.Y), this.SetDx(t), t.PolyTyp = e;
  }, n.ClipperBase.prototype.FindNextLocMin = function(t) {
    for (var e; ; ) {
      for (; n.IntPoint.op_Inequality(t.Bot, t.Prev.Bot) || n.IntPoint.op_Equality(t.Curr, t.Top); )
        t = t.Next;
      if (t.Dx != n.ClipperBase.horizontal && t.Prev.Dx != n.ClipperBase.horizontal)
        break;
      for (; t.Prev.Dx == n.ClipperBase.horizontal; )
        t = t.Prev;
      for (e = t; t.Dx == n.ClipperBase.horizontal; )
        t = t.Next;
      if (t.Top.Y != t.Prev.Bot.Y) {
        e.Prev.Bot.X < t.Bot.X && (t = e);
        break;
      }
    }
    return t;
  }, n.ClipperBase.prototype.ProcessBound = function(t, e) {
    var i = t, r = t, s, o;
    if (t.Dx == n.ClipperBase.horizontal && (e ? o = t.Prev.Bot.X : o = t.Next.Bot.X, t.Bot.X != o && this.ReverseHorizontal(t)), r.OutIdx != n.ClipperBase.Skip)
      if (e) {
        for (; r.Top.Y == r.Next.Bot.Y && r.Next.OutIdx != n.ClipperBase.Skip; )
          r = r.Next;
        if (r.Dx == n.ClipperBase.horizontal && r.Next.OutIdx != n.ClipperBase.Skip) {
          for (s = r; s.Prev.Dx == n.ClipperBase.horizontal; )
            s = s.Prev;
          s.Prev.Top.X == r.Next.Top.X ? e || (r = s.Prev) : s.Prev.Top.X > r.Next.Top.X && (r = s.Prev);
        }
        for (; t != r; )
          t.NextInLML = t.Next, t.Dx == n.ClipperBase.horizontal && t != i && t.Bot.X != t.Prev.Top.X && this.ReverseHorizontal(t), t = t.Next;
        t.Dx == n.ClipperBase.horizontal && t != i && t.Bot.X != t.Prev.Top.X && this.ReverseHorizontal(t), r = r.Next;
      } else {
        for (; r.Top.Y == r.Prev.Bot.Y && r.Prev.OutIdx != n.ClipperBase.Skip; )
          r = r.Prev;
        if (r.Dx == n.ClipperBase.horizontal && r.Prev.OutIdx != n.ClipperBase.Skip) {
          for (s = r; s.Next.Dx == n.ClipperBase.horizontal; )
            s = s.Next;
          s.Next.Top.X == r.Prev.Top.X ? e || (r = s.Next) : s.Next.Top.X > r.Prev.Top.X && (r = s.Next);
        }
        for (; t != r; )
          t.NextInLML = t.Prev, t.Dx == n.ClipperBase.horizontal && t != i && t.Bot.X != t.Next.Top.X && this.ReverseHorizontal(t), t = t.Prev;
        t.Dx == n.ClipperBase.horizontal && t != i && t.Bot.X != t.Next.Top.X && this.ReverseHorizontal(t), r = r.Prev;
      }
    if (r.OutIdx == n.ClipperBase.Skip) {
      if (t = r, e) {
        for (; t.Top.Y == t.Next.Bot.Y; )
          t = t.Next;
        for (; t != r && t.Dx == n.ClipperBase.horizontal; )
          t = t.Prev;
      } else {
        for (; t.Top.Y == t.Prev.Bot.Y; )
          t = t.Prev;
        for (; t != r && t.Dx == n.ClipperBase.horizontal; )
          t = t.Next;
      }
      if (t == r)
        e ? r = t.Next : r = t.Prev;
      else {
        e ? t = r.Next : t = r.Prev;
        var l = new n.LocalMinima();
        l.Next = null, l.Y = t.Bot.Y, l.LeftBound = null, l.RightBound = t, l.RightBound.WindDelta = 0, r = this.ProcessBound(l.RightBound, e), this.InsertLocalMinima(l);
      }
    }
    return r;
  }, n.ClipperBase.prototype.AddPath = function(t, e, i) {
    !i && e == n.PolyType.ptClip && n.Error("AddPath: Open paths must be subject.");
    var r = t.length - 1;
    if (i)
      for (; r > 0 && n.IntPoint.op_Equality(t[r], t[0]); )
        --r;
    for (; r > 0 && n.IntPoint.op_Equality(t[r], t[r - 1]); )
      --r;
    if (i && r < 2 || !i && r < 1)
      return !1;
    for (var s = new Array(), o = 0; o <= r; o++)
      s.push(new n.TEdge());
    var l = !0;
    s[1].Curr.X = t[1].X, s[1].Curr.Y = t[1].Y;
    var a = { Value: this.m_UseFullRange };
    this.RangeTest(t[0], a), this.m_UseFullRange = a.Value, a.Value = this.m_UseFullRange, this.RangeTest(t[r], a), this.m_UseFullRange = a.Value, this.InitEdge(s[0], s[1], s[r], t[0]), this.InitEdge(s[r], s[0], s[r - 1], t[r]);
    for (var o = r - 1; o >= 1; --o)
      a.Value = this.m_UseFullRange, this.RangeTest(t[o], a), this.m_UseFullRange = a.Value, this.InitEdge(s[o], s[o + 1], s[o - 1], t[o]);
    for (var u = s[0], d = u, C = u; ; ) {
      if (n.IntPoint.op_Equality(d.Curr, d.Next.Curr)) {
        if (d == d.Next)
          break;
        d == u && (u = d.Next), d = this.RemoveEdge(d), C = d;
        continue;
      }
      if (d.Prev == d.Next)
        break;
      if (i && n.ClipperBase.SlopesEqual(d.Prev.Curr, d.Curr, d.Next.Curr, this.m_UseFullRange) && (!this.PreserveCollinear || !this.Pt2IsBetweenPt1AndPt3(d.Prev.Curr, d.Curr, d.Next.Curr))) {
        d == u && (u = d.Next), d = this.RemoveEdge(d), d = d.Prev, C = d;
        continue;
      }
      if (d = d.Next, d == C)
        break;
    }
    if (!i && d == d.Next || i && d.Prev == d.Next)
      return !1;
    i || (this.m_HasOpenPaths = !0, u.Prev.OutIdx = n.ClipperBase.Skip), d = u;
    do
      this.InitEdge2(d, e), d = d.Next, l && d.Curr.Y != u.Curr.Y && (l = !1);
    while (d != u);
    if (l) {
      if (i)
        return !1;
      d.Prev.OutIdx = n.ClipperBase.Skip, d.Prev.Bot.X < d.Prev.Top.X && this.ReverseHorizontal(d.Prev);
      var T = new n.LocalMinima();
      for (T.Next = null, T.Y = d.Bot.Y, T.LeftBound = null, T.RightBound = d, T.RightBound.Side = n.EdgeSide.esRight, T.RightBound.WindDelta = 0; d.Next.OutIdx != n.ClipperBase.Skip; )
        d.NextInLML = d.Next, d.Bot.X != d.Prev.Top.X && this.ReverseHorizontal(d), d = d.Next;
      return this.InsertLocalMinima(T), this.m_edges.push(s), !0;
    }
    this.m_edges.push(s);
    for (var N, A = null; d = this.FindNextLocMin(d), d != A; ) {
      A == null && (A = d);
      var T = new n.LocalMinima();
      T.Next = null, T.Y = d.Bot.Y, d.Dx < d.Prev.Dx ? (T.LeftBound = d.Prev, T.RightBound = d, N = !1) : (T.LeftBound = d, T.RightBound = d.Prev, N = !0), T.LeftBound.Side = n.EdgeSide.esLeft, T.RightBound.Side = n.EdgeSide.esRight, i ? T.LeftBound.Next == T.RightBound ? T.LeftBound.WindDelta = -1 : T.LeftBound.WindDelta = 1 : T.LeftBound.WindDelta = 0, T.RightBound.WindDelta = -T.LeftBound.WindDelta, d = this.ProcessBound(T.LeftBound, N);
      var Y = this.ProcessBound(T.RightBound, !N);
      T.LeftBound.OutIdx == n.ClipperBase.Skip ? T.LeftBound = null : T.RightBound.OutIdx == n.ClipperBase.Skip && (T.RightBound = null), this.InsertLocalMinima(T), N || (d = Y);
    }
    return !0;
  }, n.ClipperBase.prototype.AddPaths = function(t, e, i) {
    for (var r = !1, s = 0, o = t.length; s < o; ++s)
      this.AddPath(t[s], e, i) && (r = !0);
    return r;
  }, n.ClipperBase.prototype.Pt2IsBetweenPt1AndPt3 = function(t, e, i) {
    return n.IntPoint.op_Equality(t, i) || n.IntPoint.op_Equality(t, e) || n.IntPoint.op_Equality(i, e) ? !1 : t.X != i.X ? e.X > t.X == e.X < i.X : e.Y > t.Y == e.Y < i.Y;
  }, n.ClipperBase.prototype.RemoveEdge = function(t) {
    t.Prev.Next = t.Next, t.Next.Prev = t.Prev;
    var e = t.Next;
    return t.Prev = null, e;
  }, n.ClipperBase.prototype.SetDx = function(t) {
    t.Delta.X = t.Top.X - t.Bot.X, t.Delta.Y = t.Top.Y - t.Bot.Y, t.Delta.Y === 0 ? t.Dx = n.ClipperBase.horizontal : t.Dx = t.Delta.X / t.Delta.Y;
  }, n.ClipperBase.prototype.InsertLocalMinima = function(t) {
    if (this.m_MinimaList === null)
      this.m_MinimaList = t;
    else if (t.Y >= this.m_MinimaList.Y)
      t.Next = this.m_MinimaList, this.m_MinimaList = t;
    else {
      for (var e = this.m_MinimaList; e.Next !== null && t.Y < e.Next.Y; )
        e = e.Next;
      t.Next = e.Next, e.Next = t;
    }
  }, n.ClipperBase.prototype.PopLocalMinima = function() {
    this.m_CurrentLM !== null && (this.m_CurrentLM = this.m_CurrentLM.Next);
  }, n.ClipperBase.prototype.ReverseHorizontal = function(t) {
    var e = t.Top.X;
    t.Top.X = t.Bot.X, t.Bot.X = e;
  }, n.ClipperBase.prototype.Reset = function() {
    if (this.m_CurrentLM = this.m_MinimaList, this.m_CurrentLM != null)
      for (var t = this.m_MinimaList; t != null; ) {
        var e = t.LeftBound;
        e != null && (e.Curr.X = e.Bot.X, e.Curr.Y = e.Bot.Y, e.Side = n.EdgeSide.esLeft, e.OutIdx = n.ClipperBase.Unassigned), e = t.RightBound, e != null && (e.Curr.X = e.Bot.X, e.Curr.Y = e.Bot.Y, e.Side = n.EdgeSide.esRight, e.OutIdx = n.ClipperBase.Unassigned), t = t.Next;
      }
  }, n.Clipper = function(t) {
    typeof t > "u" && (t = 0), this.m_PolyOuts = null, this.m_ClipType = n.ClipType.ctIntersection, this.m_Scanbeam = null, this.m_ActiveEdges = null, this.m_SortedEdges = null, this.m_IntersectList = null, this.m_IntersectNodeComparer = null, this.m_ExecuteLocked = !1, this.m_ClipFillType = n.PolyFillType.pftEvenOdd, this.m_SubjFillType = n.PolyFillType.pftEvenOdd, this.m_Joins = null, this.m_GhostJoins = null, this.m_UsingPolyTree = !1, this.ReverseSolution = !1, this.StrictlySimple = !1, n.ClipperBase.call(this), this.m_Scanbeam = null, this.m_ActiveEdges = null, this.m_SortedEdges = null, this.m_IntersectList = new Array(), this.m_IntersectNodeComparer = n.MyIntersectNodeSort.Compare, this.m_ExecuteLocked = !1, this.m_UsingPolyTree = !1, this.m_PolyOuts = new Array(), this.m_Joins = new Array(), this.m_GhostJoins = new Array(), this.ReverseSolution = (1 & t) !== 0, this.StrictlySimple = (2 & t) !== 0, this.PreserveCollinear = (4 & t) !== 0;
  }, n.Clipper.ioReverseSolution = 1, n.Clipper.ioStrictlySimple = 2, n.Clipper.ioPreserveCollinear = 4, n.Clipper.prototype.Clear = function() {
    this.m_edges.length !== 0 && (this.DisposeAllPolyPts(), n.ClipperBase.prototype.Clear.call(this));
  }, n.Clipper.prototype.DisposeScanbeamList = function() {
    for (; this.m_Scanbeam !== null; ) {
      var t = this.m_Scanbeam.Next;
      this.m_Scanbeam = null, this.m_Scanbeam = t;
    }
  }, n.Clipper.prototype.Reset = function() {
    n.ClipperBase.prototype.Reset.call(this), this.m_Scanbeam = null, this.m_ActiveEdges = null, this.m_SortedEdges = null;
    for (var t = this.m_MinimaList; t !== null; )
      this.InsertScanbeam(t.Y), t = t.Next;
  }, n.Clipper.prototype.InsertScanbeam = function(t) {
    if (this.m_Scanbeam === null)
      this.m_Scanbeam = new n.Scanbeam(), this.m_Scanbeam.Next = null, this.m_Scanbeam.Y = t;
    else if (t > this.m_Scanbeam.Y) {
      var e = new n.Scanbeam();
      e.Y = t, e.Next = this.m_Scanbeam, this.m_Scanbeam = e;
    } else {
      for (var i = this.m_Scanbeam; i.Next !== null && t <= i.Next.Y; )
        i = i.Next;
      if (t == i.Y)
        return;
      var e = new n.Scanbeam();
      e.Y = t, e.Next = i.Next, i.Next = e;
    }
  }, n.Clipper.prototype.Execute = function() {
    var t = arguments, e = t.length, i = t[1] instanceof n.PolyTree;
    if (e == 4 && !i) {
      var r = t[0], s = t[1], o = t[2], l = t[3];
      if (this.m_ExecuteLocked)
        return !1;
      this.m_HasOpenPaths && n.Error("Error: PolyTree struct is need for open path clipping."), this.m_ExecuteLocked = !0, n.Clear(s), this.m_SubjFillType = o, this.m_ClipFillType = l, this.m_ClipType = r, this.m_UsingPolyTree = !1;
      try {
        var a = this.ExecuteInternal();
        a && this.BuildResult(s);
      } finally {
        this.DisposeAllPolyPts(), this.m_ExecuteLocked = !1;
      }
      return a;
    } else if (e == 4 && i) {
      var r = t[0], u = t[1], o = t[2], l = t[3];
      if (this.m_ExecuteLocked)
        return !1;
      this.m_ExecuteLocked = !0, this.m_SubjFillType = o, this.m_ClipFillType = l, this.m_ClipType = r, this.m_UsingPolyTree = !0;
      try {
        var a = this.ExecuteInternal();
        a && this.BuildResult2(u);
      } finally {
        this.DisposeAllPolyPts(), this.m_ExecuteLocked = !1;
      }
      return a;
    } else if (e == 2 && !i) {
      var r = t[0], s = t[1];
      return this.Execute(r, s, n.PolyFillType.pftEvenOdd, n.PolyFillType.pftEvenOdd);
    } else if (e == 2 && i) {
      var r = t[0], u = t[1];
      return this.Execute(r, u, n.PolyFillType.pftEvenOdd, n.PolyFillType.pftEvenOdd);
    }
  }, n.Clipper.prototype.FixHoleLinkage = function(t) {
    if (!(t.FirstLeft === null || t.IsHole != t.FirstLeft.IsHole && t.FirstLeft.Pts !== null)) {
      for (var e = t.FirstLeft; e !== null && (e.IsHole == t.IsHole || e.Pts === null); )
        e = e.FirstLeft;
      t.FirstLeft = e;
    }
  }, n.Clipper.prototype.ExecuteInternal = function() {
    try {
      if (this.Reset(), this.m_CurrentLM === null)
        return !1;
      var t = this.PopScanbeam();
      do {
        if (this.InsertLocalMinimaIntoAEL(t), n.Clear(this.m_GhostJoins), this.ProcessHorizontals(!1), this.m_Scanbeam === null)
          break;
        var e = this.PopScanbeam();
        if (!this.ProcessIntersections(t, e))
          return !1;
        this.ProcessEdgesAtTopOfScanbeam(e), t = e;
      } while (this.m_Scanbeam !== null || this.m_CurrentLM !== null);
      for (var i = 0, r = this.m_PolyOuts.length; i < r; i++) {
        var s = this.m_PolyOuts[i];
        s.Pts === null || s.IsOpen || (s.IsHole ^ this.ReverseSolution) == this.Area(s) > 0 && this.ReversePolyPtLinks(s.Pts);
      }
      this.JoinCommonEdges();
      for (var i = 0, r = this.m_PolyOuts.length; i < r; i++) {
        var s = this.m_PolyOuts[i];
        s.Pts !== null && !s.IsOpen && this.FixupOutPolygon(s);
      }
      return this.StrictlySimple && this.DoSimplePolygons(), !0;
    } finally {
      n.Clear(this.m_Joins), n.Clear(this.m_GhostJoins);
    }
  }, n.Clipper.prototype.PopScanbeam = function() {
    var t = this.m_Scanbeam.Y;
    return this.m_Scanbeam, this.m_Scanbeam = this.m_Scanbeam.Next, t;
  }, n.Clipper.prototype.DisposeAllPolyPts = function() {
    for (var t = 0, e = this.m_PolyOuts.length; t < e; ++t)
      this.DisposeOutRec(t);
    n.Clear(this.m_PolyOuts);
  }, n.Clipper.prototype.DisposeOutRec = function(t) {
    var e = this.m_PolyOuts[t];
    e.Pts !== null && this.DisposeOutPts(e.Pts), e = null, this.m_PolyOuts[t] = null;
  }, n.Clipper.prototype.DisposeOutPts = function(t) {
    if (t !== null)
      for (t.Prev.Next = null; t !== null; )
        t = t.Next;
  }, n.Clipper.prototype.AddJoin = function(t, e, i) {
    var r = new n.Join();
    r.OutPt1 = t, r.OutPt2 = e, r.OffPt.X = i.X, r.OffPt.Y = i.Y, this.m_Joins.push(r);
  }, n.Clipper.prototype.AddGhostJoin = function(t, e) {
    var i = new n.Join();
    i.OutPt1 = t, i.OffPt.X = e.X, i.OffPt.Y = e.Y, this.m_GhostJoins.push(i);
  }, n.Clipper.prototype.InsertLocalMinimaIntoAEL = function(t) {
    for (; this.m_CurrentLM !== null && this.m_CurrentLM.Y == t; ) {
      var e = this.m_CurrentLM.LeftBound, i = this.m_CurrentLM.RightBound;
      this.PopLocalMinima();
      var r = null;
      if (e === null ? (this.InsertEdgeIntoAEL(i, null), this.SetWindingCount(i), this.IsContributing(i) && (r = this.AddOutPt(i, i.Bot))) : i == null ? (this.InsertEdgeIntoAEL(e, null), this.SetWindingCount(e), this.IsContributing(e) && (r = this.AddOutPt(e, e.Bot)), this.InsertScanbeam(e.Top.Y)) : (this.InsertEdgeIntoAEL(e, null), this.InsertEdgeIntoAEL(i, e), this.SetWindingCount(e), i.WindCnt = e.WindCnt, i.WindCnt2 = e.WindCnt2, this.IsContributing(e) && (r = this.AddLocalMinPoly(e, i, e.Bot)), this.InsertScanbeam(e.Top.Y)), i != null && (n.ClipperBase.IsHorizontal(i) ? this.AddEdgeToSEL(i) : this.InsertScanbeam(i.Top.Y)), !(e == null || i == null)) {
        if (r !== null && n.ClipperBase.IsHorizontal(i) && this.m_GhostJoins.length > 0 && i.WindDelta !== 0)
          for (var s = 0, o = this.m_GhostJoins.length; s < o; s++) {
            var l = this.m_GhostJoins[s];
            this.HorzSegmentsOverlap(l.OutPt1.Pt, l.OffPt, i.Bot, i.Top) && this.AddJoin(l.OutPt1, r, l.OffPt);
          }
        if (e.OutIdx >= 0 && e.PrevInAEL !== null && e.PrevInAEL.Curr.X == e.Bot.X && e.PrevInAEL.OutIdx >= 0 && n.ClipperBase.SlopesEqual(e.PrevInAEL, e, this.m_UseFullRange) && e.WindDelta !== 0 && e.PrevInAEL.WindDelta !== 0) {
          var a = this.AddOutPt(e.PrevInAEL, e.Bot);
          this.AddJoin(r, a, e.Top);
        }
        if (e.NextInAEL != i) {
          if (i.OutIdx >= 0 && i.PrevInAEL.OutIdx >= 0 && n.ClipperBase.SlopesEqual(i.PrevInAEL, i, this.m_UseFullRange) && i.WindDelta !== 0 && i.PrevInAEL.WindDelta !== 0) {
            var a = this.AddOutPt(i.PrevInAEL, i.Bot);
            this.AddJoin(r, a, i.Top);
          }
          var u = e.NextInAEL;
          if (u !== null)
            for (; u != i; )
              this.IntersectEdges(i, u, e.Curr, !1), u = u.NextInAEL;
        }
      }
    }
  }, n.Clipper.prototype.InsertEdgeIntoAEL = function(t, e) {
    if (this.m_ActiveEdges === null)
      t.PrevInAEL = null, t.NextInAEL = null, this.m_ActiveEdges = t;
    else if (e === null && this.E2InsertsBeforeE1(this.m_ActiveEdges, t))
      t.PrevInAEL = null, t.NextInAEL = this.m_ActiveEdges, this.m_ActiveEdges.PrevInAEL = t, this.m_ActiveEdges = t;
    else {
      for (e === null && (e = this.m_ActiveEdges); e.NextInAEL !== null && !this.E2InsertsBeforeE1(e.NextInAEL, t); )
        e = e.NextInAEL;
      t.NextInAEL = e.NextInAEL, e.NextInAEL !== null && (e.NextInAEL.PrevInAEL = t), t.PrevInAEL = e, e.NextInAEL = t;
    }
  }, n.Clipper.prototype.E2InsertsBeforeE1 = function(t, e) {
    return e.Curr.X == t.Curr.X ? e.Top.Y > t.Top.Y ? e.Top.X < n.Clipper.TopX(t, e.Top.Y) : t.Top.X > n.Clipper.TopX(e, t.Top.Y) : e.Curr.X < t.Curr.X;
  }, n.Clipper.prototype.IsEvenOddFillType = function(t) {
    return t.PolyTyp == n.PolyType.ptSubject ? this.m_SubjFillType == n.PolyFillType.pftEvenOdd : this.m_ClipFillType == n.PolyFillType.pftEvenOdd;
  }, n.Clipper.prototype.IsEvenOddAltFillType = function(t) {
    return t.PolyTyp == n.PolyType.ptSubject ? this.m_ClipFillType == n.PolyFillType.pftEvenOdd : this.m_SubjFillType == n.PolyFillType.pftEvenOdd;
  }, n.Clipper.prototype.IsContributing = function(t) {
    var e, i;
    switch (t.PolyTyp == n.PolyType.ptSubject ? (e = this.m_SubjFillType, i = this.m_ClipFillType) : (e = this.m_ClipFillType, i = this.m_SubjFillType), e) {
      case n.PolyFillType.pftEvenOdd:
        if (t.WindDelta === 0 && t.WindCnt != 1)
          return !1;
        break;
      case n.PolyFillType.pftNonZero:
        if (Math.abs(t.WindCnt) != 1)
          return !1;
        break;
      case n.PolyFillType.pftPositive:
        if (t.WindCnt != 1)
          return !1;
        break;
      default:
        if (t.WindCnt != -1)
          return !1;
        break;
    }
    switch (this.m_ClipType) {
      case n.ClipType.ctIntersection:
        switch (i) {
          case n.PolyFillType.pftEvenOdd:
          case n.PolyFillType.pftNonZero:
            return t.WindCnt2 !== 0;
          case n.PolyFillType.pftPositive:
            return t.WindCnt2 > 0;
          default:
            return t.WindCnt2 < 0;
        }
      case n.ClipType.ctUnion:
        switch (i) {
          case n.PolyFillType.pftEvenOdd:
          case n.PolyFillType.pftNonZero:
            return t.WindCnt2 === 0;
          case n.PolyFillType.pftPositive:
            return t.WindCnt2 <= 0;
          default:
            return t.WindCnt2 >= 0;
        }
      case n.ClipType.ctDifference:
        if (t.PolyTyp == n.PolyType.ptSubject)
          switch (i) {
            case n.PolyFillType.pftEvenOdd:
            case n.PolyFillType.pftNonZero:
              return t.WindCnt2 === 0;
            case n.PolyFillType.pftPositive:
              return t.WindCnt2 <= 0;
            default:
              return t.WindCnt2 >= 0;
          }
        else
          switch (i) {
            case n.PolyFillType.pftEvenOdd:
            case n.PolyFillType.pftNonZero:
              return t.WindCnt2 !== 0;
            case n.PolyFillType.pftPositive:
              return t.WindCnt2 > 0;
            default:
              return t.WindCnt2 < 0;
          }
      case n.ClipType.ctXor:
        if (t.WindDelta === 0)
          switch (i) {
            case n.PolyFillType.pftEvenOdd:
            case n.PolyFillType.pftNonZero:
              return t.WindCnt2 === 0;
            case n.PolyFillType.pftPositive:
              return t.WindCnt2 <= 0;
            default:
              return t.WindCnt2 >= 0;
          }
        else
          return !0;
    }
    return !0;
  }, n.Clipper.prototype.SetWindingCount = function(t) {
    for (var e = t.PrevInAEL; e !== null && (e.PolyTyp != t.PolyTyp || e.WindDelta === 0); )
      e = e.PrevInAEL;
    if (e === null)
      t.WindCnt = t.WindDelta === 0 ? 1 : t.WindDelta, t.WindCnt2 = 0, e = this.m_ActiveEdges;
    else if (t.WindDelta === 0 && this.m_ClipType != n.ClipType.ctUnion)
      t.WindCnt = 1, t.WindCnt2 = e.WindCnt2, e = e.NextInAEL;
    else if (this.IsEvenOddFillType(t)) {
      if (t.WindDelta === 0) {
        for (var i = !0, r = e.PrevInAEL; r !== null; )
          r.PolyTyp == e.PolyTyp && r.WindDelta !== 0 && (i = !i), r = r.PrevInAEL;
        t.WindCnt = i ? 0 : 1;
      } else
        t.WindCnt = t.WindDelta;
      t.WindCnt2 = e.WindCnt2, e = e.NextInAEL;
    } else
      e.WindCnt * e.WindDelta < 0 ? Math.abs(e.WindCnt) > 1 ? e.WindDelta * t.WindDelta < 0 ? t.WindCnt = e.WindCnt : t.WindCnt = e.WindCnt + t.WindDelta : t.WindCnt = t.WindDelta === 0 ? 1 : t.WindDelta : t.WindDelta === 0 ? t.WindCnt = e.WindCnt < 0 ? e.WindCnt - 1 : e.WindCnt + 1 : e.WindDelta * t.WindDelta < 0 ? t.WindCnt = e.WindCnt : t.WindCnt = e.WindCnt + t.WindDelta, t.WindCnt2 = e.WindCnt2, e = e.NextInAEL;
    if (this.IsEvenOddAltFillType(t))
      for (; e != t; )
        e.WindDelta !== 0 && (t.WindCnt2 = t.WindCnt2 === 0 ? 1 : 0), e = e.NextInAEL;
    else
      for (; e != t; )
        t.WindCnt2 += e.WindDelta, e = e.NextInAEL;
  }, n.Clipper.prototype.AddEdgeToSEL = function(t) {
    this.m_SortedEdges === null ? (this.m_SortedEdges = t, t.PrevInSEL = null, t.NextInSEL = null) : (t.NextInSEL = this.m_SortedEdges, t.PrevInSEL = null, this.m_SortedEdges.PrevInSEL = t, this.m_SortedEdges = t);
  }, n.Clipper.prototype.CopyAELToSEL = function() {
    var t = this.m_ActiveEdges;
    for (this.m_SortedEdges = t; t !== null; )
      t.PrevInSEL = t.PrevInAEL, t.NextInSEL = t.NextInAEL, t = t.NextInAEL;
  }, n.Clipper.prototype.SwapPositionsInAEL = function(t, e) {
    if (!(t.NextInAEL == t.PrevInAEL || e.NextInAEL == e.PrevInAEL)) {
      if (t.NextInAEL == e) {
        var i = e.NextInAEL;
        i !== null && (i.PrevInAEL = t);
        var r = t.PrevInAEL;
        r !== null && (r.NextInAEL = e), e.PrevInAEL = r, e.NextInAEL = t, t.PrevInAEL = e, t.NextInAEL = i;
      } else if (e.NextInAEL == t) {
        var i = t.NextInAEL;
        i !== null && (i.PrevInAEL = e);
        var r = e.PrevInAEL;
        r !== null && (r.NextInAEL = t), t.PrevInAEL = r, t.NextInAEL = e, e.PrevInAEL = t, e.NextInAEL = i;
      } else {
        var i = t.NextInAEL, r = t.PrevInAEL;
        t.NextInAEL = e.NextInAEL, t.NextInAEL !== null && (t.NextInAEL.PrevInAEL = t), t.PrevInAEL = e.PrevInAEL, t.PrevInAEL !== null && (t.PrevInAEL.NextInAEL = t), e.NextInAEL = i, e.NextInAEL !== null && (e.NextInAEL.PrevInAEL = e), e.PrevInAEL = r, e.PrevInAEL !== null && (e.PrevInAEL.NextInAEL = e);
      }
      t.PrevInAEL === null ? this.m_ActiveEdges = t : e.PrevInAEL === null && (this.m_ActiveEdges = e);
    }
  }, n.Clipper.prototype.SwapPositionsInSEL = function(t, e) {
    if (!(t.NextInSEL === null && t.PrevInSEL === null) && !(e.NextInSEL === null && e.PrevInSEL === null)) {
      if (t.NextInSEL == e) {
        var i = e.NextInSEL;
        i !== null && (i.PrevInSEL = t);
        var r = t.PrevInSEL;
        r !== null && (r.NextInSEL = e), e.PrevInSEL = r, e.NextInSEL = t, t.PrevInSEL = e, t.NextInSEL = i;
      } else if (e.NextInSEL == t) {
        var i = t.NextInSEL;
        i !== null && (i.PrevInSEL = e);
        var r = e.PrevInSEL;
        r !== null && (r.NextInSEL = t), t.PrevInSEL = r, t.NextInSEL = e, e.PrevInSEL = t, e.NextInSEL = i;
      } else {
        var i = t.NextInSEL, r = t.PrevInSEL;
        t.NextInSEL = e.NextInSEL, t.NextInSEL !== null && (t.NextInSEL.PrevInSEL = t), t.PrevInSEL = e.PrevInSEL, t.PrevInSEL !== null && (t.PrevInSEL.NextInSEL = t), e.NextInSEL = i, e.NextInSEL !== null && (e.NextInSEL.PrevInSEL = e), e.PrevInSEL = r, e.PrevInSEL !== null && (e.PrevInSEL.NextInSEL = e);
      }
      t.PrevInSEL === null ? this.m_SortedEdges = t : e.PrevInSEL === null && (this.m_SortedEdges = e);
    }
  }, n.Clipper.prototype.AddLocalMaxPoly = function(t, e, i) {
    this.AddOutPt(t, i), e.WindDelta == 0 && this.AddOutPt(e, i), t.OutIdx == e.OutIdx ? (t.OutIdx = -1, e.OutIdx = -1) : t.OutIdx < e.OutIdx ? this.AppendPolygon(t, e) : this.AppendPolygon(e, t);
  }, n.Clipper.prototype.AddLocalMinPoly = function(t, e, i) {
    var r, s, o;
    if (n.ClipperBase.IsHorizontal(e) || t.Dx > e.Dx ? (r = this.AddOutPt(t, i), e.OutIdx = t.OutIdx, t.Side = n.EdgeSide.esLeft, e.Side = n.EdgeSide.esRight, s = t, s.PrevInAEL == e ? o = e.PrevInAEL : o = s.PrevInAEL) : (r = this.AddOutPt(e, i), t.OutIdx = e.OutIdx, t.Side = n.EdgeSide.esRight, e.Side = n.EdgeSide.esLeft, s = e, s.PrevInAEL == t ? o = t.PrevInAEL : o = s.PrevInAEL), o !== null && o.OutIdx >= 0 && n.Clipper.TopX(o, i.Y) == n.Clipper.TopX(s, i.Y) && n.ClipperBase.SlopesEqual(s, o, this.m_UseFullRange) && s.WindDelta !== 0 && o.WindDelta !== 0) {
      var l = this.AddOutPt(o, i);
      this.AddJoin(r, l, s.Top);
    }
    return r;
  }, n.Clipper.prototype.CreateOutRec = function() {
    var t = new n.OutRec();
    return t.Idx = -1, t.IsHole = !1, t.IsOpen = !1, t.FirstLeft = null, t.Pts = null, t.BottomPt = null, t.PolyNode = null, this.m_PolyOuts.push(t), t.Idx = this.m_PolyOuts.length - 1, t;
  }, n.Clipper.prototype.AddOutPt = function(t, e) {
    var i = t.Side == n.EdgeSide.esLeft;
    if (t.OutIdx < 0) {
      var r = this.CreateOutRec();
      r.IsOpen = t.WindDelta === 0;
      var s = new n.OutPt();
      return r.Pts = s, s.Idx = r.Idx, s.Pt.X = e.X, s.Pt.Y = e.Y, s.Next = s, s.Prev = s, r.IsOpen || this.SetHoleState(t, r), t.OutIdx = r.Idx, s;
    } else {
      var r = this.m_PolyOuts[t.OutIdx], o = r.Pts;
      if (i && n.IntPoint.op_Equality(e, o.Pt))
        return o;
      if (!i && n.IntPoint.op_Equality(e, o.Prev.Pt))
        return o.Prev;
      var s = new n.OutPt();
      return s.Idx = r.Idx, s.Pt.X = e.X, s.Pt.Y = e.Y, s.Next = o, s.Prev = o.Prev, s.Prev.Next = s, o.Prev = s, i && (r.Pts = s), s;
    }
  }, n.Clipper.prototype.SwapPoints = function(t, e) {
    var i = new n.IntPoint(t.Value);
    t.Value.X = e.Value.X, t.Value.Y = e.Value.Y, e.Value.X = i.X, e.Value.Y = i.Y;
  }, n.Clipper.prototype.HorzSegmentsOverlap = function(t, e, i, r) {
    return t.X > i.X == t.X < r.X || e.X > i.X == e.X < r.X || i.X > t.X == i.X < e.X || r.X > t.X == r.X < e.X || t.X == i.X && e.X == r.X ? !0 : t.X == r.X && e.X == i.X;
  }, n.Clipper.prototype.InsertPolyPtBetween = function(t, e, i) {
    var r = new n.OutPt();
    return r.Pt.X = i.X, r.Pt.Y = i.Y, e == t.Next ? (t.Next = r, e.Prev = r, r.Next = e, r.Prev = t) : (e.Next = r, t.Prev = r, r.Next = t, r.Prev = e), r;
  }, n.Clipper.prototype.SetHoleState = function(t, e) {
    for (var i = !1, r = t.PrevInAEL; r !== null; )
      r.OutIdx >= 0 && r.WindDelta != 0 && (i = !i, e.FirstLeft === null && (e.FirstLeft = this.m_PolyOuts[r.OutIdx])), r = r.PrevInAEL;
    i && (e.IsHole = !0);
  }, n.Clipper.prototype.GetDx = function(t, e) {
    return t.Y == e.Y ? n.ClipperBase.horizontal : (e.X - t.X) / (e.Y - t.Y);
  }, n.Clipper.prototype.FirstIsBottomPt = function(t, e) {
    for (var i = t.Prev; n.IntPoint.op_Equality(i.Pt, t.Pt) && i != t; )
      i = i.Prev;
    var r = Math.abs(this.GetDx(t.Pt, i.Pt));
    for (i = t.Next; n.IntPoint.op_Equality(i.Pt, t.Pt) && i != t; )
      i = i.Next;
    var s = Math.abs(this.GetDx(t.Pt, i.Pt));
    for (i = e.Prev; n.IntPoint.op_Equality(i.Pt, e.Pt) && i != e; )
      i = i.Prev;
    var o = Math.abs(this.GetDx(e.Pt, i.Pt));
    for (i = e.Next; n.IntPoint.op_Equality(i.Pt, e.Pt) && i != e; )
      i = i.Next;
    var l = Math.abs(this.GetDx(e.Pt, i.Pt));
    return r >= o && r >= l || s >= o && s >= l;
  }, n.Clipper.prototype.GetBottomPt = function(t) {
    for (var e = null, i = t.Next; i != t; )
      i.Pt.Y > t.Pt.Y ? (t = i, e = null) : i.Pt.Y == t.Pt.Y && i.Pt.X <= t.Pt.X && (i.Pt.X < t.Pt.X ? (e = null, t = i) : i.Next != t && i.Prev != t && (e = i)), i = i.Next;
    if (e !== null)
      for (; e != i; )
        for (this.FirstIsBottomPt(i, e) || (t = e), e = e.Next; n.IntPoint.op_Inequality(e.Pt, t.Pt); )
          e = e.Next;
    return t;
  }, n.Clipper.prototype.GetLowermostRec = function(t, e) {
    t.BottomPt === null && (t.BottomPt = this.GetBottomPt(t.Pts)), e.BottomPt === null && (e.BottomPt = this.GetBottomPt(e.Pts));
    var i = t.BottomPt, r = e.BottomPt;
    return i.Pt.Y > r.Pt.Y ? t : i.Pt.Y < r.Pt.Y ? e : i.Pt.X < r.Pt.X ? t : i.Pt.X > r.Pt.X || i.Next == i ? e : r.Next == r || this.FirstIsBottomPt(i, r) ? t : e;
  }, n.Clipper.prototype.Param1RightOfParam2 = function(t, e) {
    do
      if (t = t.FirstLeft, t == e)
        return !0;
    while (t !== null);
    return !1;
  }, n.Clipper.prototype.GetOutRec = function(t) {
    for (var e = this.m_PolyOuts[t]; e != this.m_PolyOuts[e.Idx]; )
      e = this.m_PolyOuts[e.Idx];
    return e;
  }, n.Clipper.prototype.AppendPolygon = function(t, e) {
    var i = this.m_PolyOuts[t.OutIdx], r = this.m_PolyOuts[e.OutIdx], s;
    this.Param1RightOfParam2(i, r) ? s = r : this.Param1RightOfParam2(r, i) ? s = i : s = this.GetLowermostRec(i, r);
    var o = i.Pts, l = o.Prev, a = r.Pts, u = a.Prev, d;
    t.Side == n.EdgeSide.esLeft ? (e.Side == n.EdgeSide.esLeft ? (this.ReversePolyPtLinks(a), a.Next = o, o.Prev = a, l.Next = u, u.Prev = l, i.Pts = u) : (u.Next = o, o.Prev = u, a.Prev = l, l.Next = a, i.Pts = a), d = n.EdgeSide.esLeft) : (e.Side == n.EdgeSide.esRight ? (this.ReversePolyPtLinks(a), l.Next = u, u.Prev = l, a.Next = o, o.Prev = a) : (l.Next = a, a.Prev = l, o.Prev = u, u.Next = o), d = n.EdgeSide.esRight), i.BottomPt = null, s == r && (r.FirstLeft != i && (i.FirstLeft = r.FirstLeft), i.IsHole = r.IsHole), r.Pts = null, r.BottomPt = null, r.FirstLeft = i;
    var C = t.OutIdx, T = e.OutIdx;
    t.OutIdx = -1, e.OutIdx = -1;
    for (var N = this.m_ActiveEdges; N !== null; ) {
      if (N.OutIdx == T) {
        N.OutIdx = C, N.Side = d;
        break;
      }
      N = N.NextInAEL;
    }
    r.Idx = i.Idx;
  }, n.Clipper.prototype.ReversePolyPtLinks = function(t) {
    if (t !== null) {
      var e, i;
      e = t;
      do
        i = e.Next, e.Next = e.Prev, e.Prev = i, e = i;
      while (e != t);
    }
  }, n.Clipper.SwapSides = function(t, e) {
    var i = t.Side;
    t.Side = e.Side, e.Side = i;
  }, n.Clipper.SwapPolyIndexes = function(t, e) {
    var i = t.OutIdx;
    t.OutIdx = e.OutIdx, e.OutIdx = i;
  }, n.Clipper.prototype.IntersectEdges = function(t, e, i, r) {
    var s = !r && t.NextInLML === null && t.Top.X == i.X && t.Top.Y == i.Y, o = !r && e.NextInLML === null && e.Top.X == i.X && e.Top.Y == i.Y, l = t.OutIdx >= 0, a = e.OutIdx >= 0;
    if (t.WindDelta === 0 || e.WindDelta === 0) {
      t.WindDelta === 0 && e.WindDelta === 0 ? (s || o) && l && a && this.AddLocalMaxPoly(t, e, i) : t.PolyTyp == e.PolyTyp && t.WindDelta != e.WindDelta && this.m_ClipType == n.ClipType.ctUnion ? t.WindDelta === 0 ? a && (this.AddOutPt(t, i), l && (t.OutIdx = -1)) : l && (this.AddOutPt(e, i), a && (e.OutIdx = -1)) : t.PolyTyp != e.PolyTyp && (t.WindDelta === 0 && Math.abs(e.WindCnt) == 1 && (this.m_ClipType != n.ClipType.ctUnion || e.WindCnt2 === 0) ? (this.AddOutPt(t, i), l && (t.OutIdx = -1)) : e.WindDelta === 0 && Math.abs(t.WindCnt) == 1 && (this.m_ClipType != n.ClipType.ctUnion || t.WindCnt2 === 0) && (this.AddOutPt(e, i), a && (e.OutIdx = -1))), s && (t.OutIdx < 0 ? this.DeleteFromAEL(t) : n.Error("Error intersecting polylines")), o && (e.OutIdx < 0 ? this.DeleteFromAEL(e) : n.Error("Error intersecting polylines"));
      return;
    }
    if (t.PolyTyp == e.PolyTyp)
      if (this.IsEvenOddFillType(t)) {
        var u = t.WindCnt;
        t.WindCnt = e.WindCnt, e.WindCnt = u;
      } else
        t.WindCnt + e.WindDelta === 0 ? t.WindCnt = -t.WindCnt : t.WindCnt += e.WindDelta, e.WindCnt - t.WindDelta === 0 ? e.WindCnt = -e.WindCnt : e.WindCnt -= t.WindDelta;
    else
      this.IsEvenOddFillType(e) ? t.WindCnt2 = t.WindCnt2 === 0 ? 1 : 0 : t.WindCnt2 += e.WindDelta, this.IsEvenOddFillType(t) ? e.WindCnt2 = e.WindCnt2 === 0 ? 1 : 0 : e.WindCnt2 -= t.WindDelta;
    var d, C, T, N;
    t.PolyTyp == n.PolyType.ptSubject ? (d = this.m_SubjFillType, T = this.m_ClipFillType) : (d = this.m_ClipFillType, T = this.m_SubjFillType), e.PolyTyp == n.PolyType.ptSubject ? (C = this.m_SubjFillType, N = this.m_ClipFillType) : (C = this.m_ClipFillType, N = this.m_SubjFillType);
    var A, Y;
    switch (d) {
      case n.PolyFillType.pftPositive:
        A = t.WindCnt;
        break;
      case n.PolyFillType.pftNegative:
        A = -t.WindCnt;
        break;
      default:
        A = Math.abs(t.WindCnt);
        break;
    }
    switch (C) {
      case n.PolyFillType.pftPositive:
        Y = e.WindCnt;
        break;
      case n.PolyFillType.pftNegative:
        Y = -e.WindCnt;
        break;
      default:
        Y = Math.abs(e.WindCnt);
        break;
    }
    if (l && a)
      s || o || A !== 0 && A != 1 || Y !== 0 && Y != 1 || t.PolyTyp != e.PolyTyp && this.m_ClipType != n.ClipType.ctXor ? this.AddLocalMaxPoly(t, e, i) : (this.AddOutPt(t, i), this.AddOutPt(e, i), n.Clipper.SwapSides(t, e), n.Clipper.SwapPolyIndexes(t, e));
    else if (l)
      (Y === 0 || Y == 1) && (this.AddOutPt(t, i), n.Clipper.SwapSides(t, e), n.Clipper.SwapPolyIndexes(t, e));
    else if (a)
      (A === 0 || A == 1) && (this.AddOutPt(e, i), n.Clipper.SwapSides(t, e), n.Clipper.SwapPolyIndexes(t, e));
    else if ((A === 0 || A == 1) && (Y === 0 || Y == 1) && !s && !o) {
      var R, V;
      switch (T) {
        case n.PolyFillType.pftPositive:
          R = t.WindCnt2;
          break;
        case n.PolyFillType.pftNegative:
          R = -t.WindCnt2;
          break;
        default:
          R = Math.abs(t.WindCnt2);
          break;
      }
      switch (N) {
        case n.PolyFillType.pftPositive:
          V = e.WindCnt2;
          break;
        case n.PolyFillType.pftNegative:
          V = -e.WindCnt2;
          break;
        default:
          V = Math.abs(e.WindCnt2);
          break;
      }
      if (t.PolyTyp != e.PolyTyp)
        this.AddLocalMinPoly(t, e, i);
      else if (A == 1 && Y == 1)
        switch (this.m_ClipType) {
          case n.ClipType.ctIntersection:
            R > 0 && V > 0 && this.AddLocalMinPoly(t, e, i);
            break;
          case n.ClipType.ctUnion:
            R <= 0 && V <= 0 && this.AddLocalMinPoly(t, e, i);
            break;
          case n.ClipType.ctDifference:
            (t.PolyTyp == n.PolyType.ptClip && R > 0 && V > 0 || t.PolyTyp == n.PolyType.ptSubject && R <= 0 && V <= 0) && this.AddLocalMinPoly(t, e, i);
            break;
          case n.ClipType.ctXor:
            this.AddLocalMinPoly(t, e, i);
            break;
        }
      else
        n.Clipper.SwapSides(t, e);
    }
    s != o && (s && t.OutIdx >= 0 || o && e.OutIdx >= 0) && (n.Clipper.SwapSides(t, e), n.Clipper.SwapPolyIndexes(t, e)), s && this.DeleteFromAEL(t), o && this.DeleteFromAEL(e);
  }, n.Clipper.prototype.DeleteFromAEL = function(t) {
    var e = t.PrevInAEL, i = t.NextInAEL;
    e === null && i === null && t != this.m_ActiveEdges || (e !== null ? e.NextInAEL = i : this.m_ActiveEdges = i, i !== null && (i.PrevInAEL = e), t.NextInAEL = null, t.PrevInAEL = null);
  }, n.Clipper.prototype.DeleteFromSEL = function(t) {
    var e = t.PrevInSEL, i = t.NextInSEL;
    e === null && i === null && t != this.m_SortedEdges || (e !== null ? e.NextInSEL = i : this.m_SortedEdges = i, i !== null && (i.PrevInSEL = e), t.NextInSEL = null, t.PrevInSEL = null);
  }, n.Clipper.prototype.UpdateEdgeIntoAEL = function(t) {
    t.NextInLML === null && n.Error("UpdateEdgeIntoAEL: invalid call");
    var e = t.PrevInAEL, i = t.NextInAEL;
    return t.NextInLML.OutIdx = t.OutIdx, e !== null ? e.NextInAEL = t.NextInLML : this.m_ActiveEdges = t.NextInLML, i !== null && (i.PrevInAEL = t.NextInLML), t.NextInLML.Side = t.Side, t.NextInLML.WindDelta = t.WindDelta, t.NextInLML.WindCnt = t.WindCnt, t.NextInLML.WindCnt2 = t.WindCnt2, t = t.NextInLML, t.Curr.X = t.Bot.X, t.Curr.Y = t.Bot.Y, t.PrevInAEL = e, t.NextInAEL = i, n.ClipperBase.IsHorizontal(t) || this.InsertScanbeam(t.Top.Y), t;
  }, n.Clipper.prototype.ProcessHorizontals = function(t) {
    for (var e = this.m_SortedEdges; e !== null; )
      this.DeleteFromSEL(e), this.ProcessHorizontal(e, t), e = this.m_SortedEdges;
  }, n.Clipper.prototype.GetHorzDirection = function(t, e) {
    t.Bot.X < t.Top.X ? (e.Left = t.Bot.X, e.Right = t.Top.X, e.Dir = n.Direction.dLeftToRight) : (e.Left = t.Top.X, e.Right = t.Bot.X, e.Dir = n.Direction.dRightToLeft);
  }, n.Clipper.prototype.PrepareHorzJoins = function(t, e) {
    var i = this.m_PolyOuts[t.OutIdx].Pts;
    t.Side != n.EdgeSide.esLeft && (i = i.Prev), e && (n.IntPoint.op_Equality(i.Pt, t.Top) ? this.AddGhostJoin(i, t.Bot) : this.AddGhostJoin(i, t.Top));
  }, n.Clipper.prototype.ProcessHorizontal = function(t, e) {
    var i = { Dir: null, Left: null, Right: null };
    this.GetHorzDirection(t, i);
    for (var r = i.Dir, s = i.Left, o = i.Right, l = t, a = null; l.NextInLML !== null && n.ClipperBase.IsHorizontal(l.NextInLML); )
      l = l.NextInLML;
    for (l.NextInLML === null && (a = this.GetMaximaPair(l)); ; ) {
      for (var u = t == l, d = this.GetNextInAEL(t, r); d !== null && !(d.Curr.X == t.Top.X && t.NextInLML !== null && d.Dx < t.NextInLML.Dx); ) {
        var C = this.GetNextInAEL(d, r);
        if (r == n.Direction.dLeftToRight && d.Curr.X <= o || r == n.Direction.dRightToLeft && d.Curr.X >= s) {
          if (t.OutIdx >= 0 && t.WindDelta != 0 && this.PrepareHorzJoins(t, e), d == a && u) {
            r == n.Direction.dLeftToRight ? this.IntersectEdges(t, d, d.Top, !1) : this.IntersectEdges(d, t, d.Top, !1), a.OutIdx >= 0 && n.Error("ProcessHorizontal error");
            return;
          } else if (r == n.Direction.dLeftToRight) {
            var T = new n.IntPoint(d.Curr.X, t.Curr.Y);
            this.IntersectEdges(t, d, T, !0);
          } else {
            var T = new n.IntPoint(d.Curr.X, t.Curr.Y);
            this.IntersectEdges(d, t, T, !0);
          }
          this.SwapPositionsInAEL(t, d);
        } else if (r == n.Direction.dLeftToRight && d.Curr.X >= o || r == n.Direction.dRightToLeft && d.Curr.X <= s)
          break;
        d = C;
      }
      if (t.OutIdx >= 0 && t.WindDelta !== 0 && this.PrepareHorzJoins(t, e), t.NextInLML !== null && n.ClipperBase.IsHorizontal(t.NextInLML)) {
        t = this.UpdateEdgeIntoAEL(t), t.OutIdx >= 0 && this.AddOutPt(t, t.Bot);
        var i = { Dir: r, Left: s, Right: o };
        this.GetHorzDirection(t, i), r = i.Dir, s = i.Left, o = i.Right;
      } else
        break;
    }
    if (t.NextInLML !== null)
      if (t.OutIdx >= 0) {
        var N = this.AddOutPt(t, t.Top);
        if (t = this.UpdateEdgeIntoAEL(t), t.WindDelta === 0)
          return;
        var A = t.PrevInAEL, C = t.NextInAEL;
        if (A !== null && A.Curr.X == t.Bot.X && A.Curr.Y == t.Bot.Y && A.WindDelta !== 0 && A.OutIdx >= 0 && A.Curr.Y > A.Top.Y && n.ClipperBase.SlopesEqual(t, A, this.m_UseFullRange)) {
          var Y = this.AddOutPt(A, t.Bot);
          this.AddJoin(N, Y, t.Top);
        } else if (C !== null && C.Curr.X == t.Bot.X && C.Curr.Y == t.Bot.Y && C.WindDelta !== 0 && C.OutIdx >= 0 && C.Curr.Y > C.Top.Y && n.ClipperBase.SlopesEqual(t, C, this.m_UseFullRange)) {
          var Y = this.AddOutPt(C, t.Bot);
          this.AddJoin(N, Y, t.Top);
        }
      } else t = this.UpdateEdgeIntoAEL(t);
    else a !== null ? a.OutIdx >= 0 ? (r == n.Direction.dLeftToRight ? this.IntersectEdges(t, a, t.Top, !1) : this.IntersectEdges(a, t, t.Top, !1), a.OutIdx >= 0 && n.Error("ProcessHorizontal error")) : (this.DeleteFromAEL(t), this.DeleteFromAEL(a)) : (t.OutIdx >= 0 && this.AddOutPt(t, t.Top), this.DeleteFromAEL(t));
  }, n.Clipper.prototype.GetNextInAEL = function(t, e) {
    return e == n.Direction.dLeftToRight ? t.NextInAEL : t.PrevInAEL;
  }, n.Clipper.prototype.IsMinima = function(t) {
    return t !== null && t.Prev.NextInLML != t && t.Next.NextInLML != t;
  }, n.Clipper.prototype.IsMaxima = function(t, e) {
    return t !== null && t.Top.Y == e && t.NextInLML === null;
  }, n.Clipper.prototype.IsIntermediate = function(t, e) {
    return t.Top.Y == e && t.NextInLML !== null;
  }, n.Clipper.prototype.GetMaximaPair = function(t) {
    var e = null;
    return n.IntPoint.op_Equality(t.Next.Top, t.Top) && t.Next.NextInLML === null ? e = t.Next : n.IntPoint.op_Equality(t.Prev.Top, t.Top) && t.Prev.NextInLML === null && (e = t.Prev), e !== null && (e.OutIdx == -2 || e.NextInAEL == e.PrevInAEL && !n.ClipperBase.IsHorizontal(e)) ? null : e;
  }, n.Clipper.prototype.ProcessIntersections = function(t, e) {
    if (this.m_ActiveEdges == null)
      return !0;
    try {
      if (this.BuildIntersectList(t, e), this.m_IntersectList.length == 0)
        return !0;
      if (this.m_IntersectList.length == 1 || this.FixupIntersectionOrder())
        this.ProcessIntersectList();
      else
        return !1;
    } catch {
      this.m_SortedEdges = null, this.m_IntersectList.length = 0, n.Error("ProcessIntersections error");
    }
    return this.m_SortedEdges = null, !0;
  }, n.Clipper.prototype.BuildIntersectList = function(t, e) {
    if (this.m_ActiveEdges !== null) {
      var i = this.m_ActiveEdges;
      for (this.m_SortedEdges = i; i !== null; )
        i.PrevInSEL = i.PrevInAEL, i.NextInSEL = i.NextInAEL, i.Curr.X = n.Clipper.TopX(i, e), i = i.NextInAEL;
      for (var r = !0; r && this.m_SortedEdges !== null; ) {
        for (r = !1, i = this.m_SortedEdges; i.NextInSEL !== null; ) {
          var s = i.NextInSEL, o = new n.IntPoint();
          if (i.Curr.X > s.Curr.X) {
            !this.IntersectPoint(i, s, o) && i.Curr.X > s.Curr.X + 1 && n.Error("Intersection error"), o.Y > t && (o.Y = t, Math.abs(i.Dx) > Math.abs(s.Dx) ? o.X = n.Clipper.TopX(s, t) : o.X = n.Clipper.TopX(i, t));
            var l = new n.IntersectNode();
            l.Edge1 = i, l.Edge2 = s, l.Pt.X = o.X, l.Pt.Y = o.Y, this.m_IntersectList.push(l), this.SwapPositionsInSEL(i, s), r = !0;
          } else
            i = s;
        }
        if (i.PrevInSEL !== null)
          i.PrevInSEL.NextInSEL = null;
        else
          break;
      }
      this.m_SortedEdges = null;
    }
  }, n.Clipper.prototype.EdgesAdjacent = function(t) {
    return t.Edge1.NextInSEL == t.Edge2 || t.Edge1.PrevInSEL == t.Edge2;
  }, n.Clipper.IntersectNodeSort = function(t, e) {
    return e.Pt.Y - t.Pt.Y;
  }, n.Clipper.prototype.FixupIntersectionOrder = function() {
    this.m_IntersectList.sort(this.m_IntersectNodeComparer), this.CopyAELToSEL();
    for (var t = this.m_IntersectList.length, e = 0; e < t; e++) {
      if (!this.EdgesAdjacent(this.m_IntersectList[e])) {
        for (var i = e + 1; i < t && !this.EdgesAdjacent(this.m_IntersectList[i]); )
          i++;
        if (i == t)
          return !1;
        var r = this.m_IntersectList[e];
        this.m_IntersectList[e] = this.m_IntersectList[i], this.m_IntersectList[i] = r;
      }
      this.SwapPositionsInSEL(this.m_IntersectList[e].Edge1, this.m_IntersectList[e].Edge2);
    }
    return !0;
  }, n.Clipper.prototype.ProcessIntersectList = function() {
    for (var t = 0, e = this.m_IntersectList.length; t < e; t++) {
      var i = this.m_IntersectList[t];
      this.IntersectEdges(i.Edge1, i.Edge2, i.Pt, !0), this.SwapPositionsInAEL(i.Edge1, i.Edge2);
    }
    this.m_IntersectList.length = 0;
  };
  var Ii = function(t) {
    return t < 0 ? Math.ceil(t - 0.5) : Math.round(t);
  }, _i = function(t) {
    return t < 0 ? Math.ceil(t - 0.5) : Math.floor(t + 0.5);
  }, Ti = function(t) {
    return t < 0 ? -Math.round(Math.abs(t)) : Math.round(t);
  }, Li = function(t) {
    return t < 0 ? (t -= 0.5, t < -2147483648 ? Math.ceil(t) : t | 0) : (t += 0.5, t > 2147483647 ? Math.floor(t) : t | 0);
  };
  c.msie ? n.Clipper.Round = Ii : c.chromium ? n.Clipper.Round = Ti : c.safari ? n.Clipper.Round = Li : n.Clipper.Round = _i, n.Clipper.TopX = function(t, e) {
    return e == t.Top.Y ? t.Top.X : t.Bot.X + n.Clipper.Round(t.Dx * (e - t.Bot.Y));
  }, n.Clipper.prototype.IntersectPoint = function(t, e, i) {
    i.X = 0, i.Y = 0;
    var r, s;
    if (n.ClipperBase.SlopesEqual(t, e, this.m_UseFullRange) || t.Dx == e.Dx)
      return e.Bot.Y > t.Bot.Y ? (i.X = e.Bot.X, i.Y = e.Bot.Y) : (i.X = t.Bot.X, i.Y = t.Bot.Y), !1;
    if (t.Delta.X === 0)
      i.X = t.Bot.X, n.ClipperBase.IsHorizontal(e) ? i.Y = e.Bot.Y : (s = e.Bot.Y - e.Bot.X / e.Dx, i.Y = n.Clipper.Round(i.X / e.Dx + s));
    else if (e.Delta.X === 0)
      i.X = e.Bot.X, n.ClipperBase.IsHorizontal(t) ? i.Y = t.Bot.Y : (r = t.Bot.Y - t.Bot.X / t.Dx, i.Y = n.Clipper.Round(i.X / t.Dx + r));
    else {
      r = t.Bot.X - t.Bot.Y * t.Dx, s = e.Bot.X - e.Bot.Y * e.Dx;
      var o = (s - r) / (t.Dx - e.Dx);
      i.Y = n.Clipper.Round(o), Math.abs(t.Dx) < Math.abs(e.Dx) ? i.X = n.Clipper.Round(t.Dx * o + r) : i.X = n.Clipper.Round(e.Dx * o + s);
    }
    if (i.Y < t.Top.Y || i.Y < e.Top.Y) {
      if (t.Top.Y > e.Top.Y)
        return i.Y = t.Top.Y, i.X = n.Clipper.TopX(e, t.Top.Y), i.X < t.Top.X;
      i.Y = e.Top.Y, Math.abs(t.Dx) < Math.abs(e.Dx) ? i.X = n.Clipper.TopX(t, i.Y) : i.X = n.Clipper.TopX(e, i.Y);
    }
    return !0;
  }, n.Clipper.prototype.ProcessEdgesAtTopOfScanbeam = function(t) {
    for (var e = this.m_ActiveEdges; e !== null; ) {
      var i = this.IsMaxima(e, t);
      if (i) {
        var r = this.GetMaximaPair(e);
        i = r === null || !n.ClipperBase.IsHorizontal(r);
      }
      if (i) {
        var s = e.PrevInAEL;
        this.DoMaxima(e), s === null ? e = this.m_ActiveEdges : e = s.NextInAEL;
      } else {
        if (this.IsIntermediate(e, t) && n.ClipperBase.IsHorizontal(e.NextInLML) ? (e = this.UpdateEdgeIntoAEL(e), e.OutIdx >= 0 && this.AddOutPt(e, e.Bot), this.AddEdgeToSEL(e)) : (e.Curr.X = n.Clipper.TopX(e, t), e.Curr.Y = t), this.StrictlySimple) {
          var s = e.PrevInAEL;
          if (e.OutIdx >= 0 && e.WindDelta !== 0 && s !== null && s.OutIdx >= 0 && s.Curr.X == e.Curr.X && s.WindDelta !== 0) {
            var o = this.AddOutPt(s, e.Curr), l = this.AddOutPt(e, e.Curr);
            this.AddJoin(o, l, e.Curr);
          }
        }
        e = e.NextInAEL;
      }
    }
    for (this.ProcessHorizontals(!0), e = this.m_ActiveEdges; e !== null; ) {
      if (this.IsIntermediate(e, t)) {
        var o = null;
        e.OutIdx >= 0 && (o = this.AddOutPt(e, e.Top)), e = this.UpdateEdgeIntoAEL(e);
        var s = e.PrevInAEL, a = e.NextInAEL;
        if (s !== null && s.Curr.X == e.Bot.X && s.Curr.Y == e.Bot.Y && o !== null && s.OutIdx >= 0 && s.Curr.Y > s.Top.Y && n.ClipperBase.SlopesEqual(e, s, this.m_UseFullRange) && e.WindDelta !== 0 && s.WindDelta !== 0) {
          var l = this.AddOutPt(s, e.Bot);
          this.AddJoin(o, l, e.Top);
        } else if (a !== null && a.Curr.X == e.Bot.X && a.Curr.Y == e.Bot.Y && o !== null && a.OutIdx >= 0 && a.Curr.Y > a.Top.Y && n.ClipperBase.SlopesEqual(e, a, this.m_UseFullRange) && e.WindDelta !== 0 && a.WindDelta !== 0) {
          var l = this.AddOutPt(a, e.Bot);
          this.AddJoin(o, l, e.Top);
        }
      }
      e = e.NextInAEL;
    }
  }, n.Clipper.prototype.DoMaxima = function(t) {
    var e = this.GetMaximaPair(t);
    if (e === null) {
      t.OutIdx >= 0 && this.AddOutPt(t, t.Top), this.DeleteFromAEL(t);
      return;
    }
    for (var i = t.NextInAEL; i !== null && i != e; )
      this.IntersectEdges(t, i, t.Top, !0), this.SwapPositionsInAEL(t, i), i = t.NextInAEL;
    t.OutIdx == -1 && e.OutIdx == -1 ? (this.DeleteFromAEL(t), this.DeleteFromAEL(e)) : t.OutIdx >= 0 && e.OutIdx >= 0 ? this.IntersectEdges(t, e, t.Top, !1) : t.WindDelta === 0 ? (t.OutIdx >= 0 && (this.AddOutPt(t, t.Top), t.OutIdx = -1), this.DeleteFromAEL(t), e.OutIdx >= 0 && (this.AddOutPt(e, t.Top), e.OutIdx = -1), this.DeleteFromAEL(e)) : n.Error("DoMaxima error");
  }, n.Clipper.ReversePaths = function(t) {
    for (var e = 0, i = t.length; e < i; e++)
      t[e].reverse();
  }, n.Clipper.Orientation = function(t) {
    return n.Clipper.Area(t) >= 0;
  }, n.Clipper.prototype.PointCount = function(t) {
    if (t === null)
      return 0;
    var e = 0, i = t;
    do
      e++, i = i.Next;
    while (i != t);
    return e;
  }, n.Clipper.prototype.BuildResult = function(t) {
    n.Clear(t);
    for (var e = 0, i = this.m_PolyOuts.length; e < i; e++) {
      var r = this.m_PolyOuts[e];
      if (r.Pts !== null) {
        var s = r.Pts.Prev, o = this.PointCount(s);
        if (!(o < 2)) {
          for (var l = new Array(o), a = 0; a < o; a++)
            l[a] = s.Pt, s = s.Prev;
          t.push(l);
        }
      }
    }
  }, n.Clipper.prototype.BuildResult2 = function(t) {
    t.Clear();
    for (var e = 0, i = this.m_PolyOuts.length; e < i; e++) {
      var r = this.m_PolyOuts[e], s = this.PointCount(r.Pts);
      if (!(r.IsOpen && s < 2 || !r.IsOpen && s < 3)) {
        this.FixHoleLinkage(r);
        var o = new n.PolyNode();
        t.m_AllPolys.push(o), r.PolyNode = o, o.m_polygon.length = s;
        for (var l = r.Pts.Prev, a = 0; a < s; a++)
          o.m_polygon[a] = l.Pt, l = l.Prev;
      }
    }
    for (var e = 0, i = this.m_PolyOuts.length; e < i; e++) {
      var r = this.m_PolyOuts[e];
      r.PolyNode !== null && (r.IsOpen ? (r.PolyNode.IsOpen = !0, t.AddChild(r.PolyNode)) : r.FirstLeft !== null && r.FirstLeft.PolyNode != null ? r.FirstLeft.PolyNode.AddChild(r.PolyNode) : t.AddChild(r.PolyNode));
    }
  }, n.Clipper.prototype.FixupOutPolygon = function(t) {
    var e = null;
    t.BottomPt = null;
    for (var i = t.Pts; ; ) {
      if (i.Prev == i || i.Prev == i.Next) {
        this.DisposeOutPts(i), t.Pts = null;
        return;
      }
      if (n.IntPoint.op_Equality(i.Pt, i.Next.Pt) || n.IntPoint.op_Equality(i.Pt, i.Prev.Pt) || n.ClipperBase.SlopesEqual(i.Prev.Pt, i.Pt, i.Next.Pt, this.m_UseFullRange) && (!this.PreserveCollinear || !this.Pt2IsBetweenPt1AndPt3(i.Prev.Pt, i.Pt, i.Next.Pt)))
        e = null, i.Prev.Next = i.Next, i.Next.Prev = i.Prev, i = i.Prev;
      else {
        if (i == e)
          break;
        e === null && (e = i), i = i.Next;
      }
    }
    t.Pts = i;
  }, n.Clipper.prototype.DupOutPt = function(t, e) {
    var i = new n.OutPt();
    return i.Pt.X = t.Pt.X, i.Pt.Y = t.Pt.Y, i.Idx = t.Idx, e ? (i.Next = t.Next, i.Prev = t, t.Next.Prev = i, t.Next = i) : (i.Prev = t.Prev, i.Next = t, t.Prev.Next = i, t.Prev = i), i;
  }, n.Clipper.prototype.GetOverlap = function(t, e, i, r, s) {
    return t < e ? i < r ? (s.Left = Math.max(t, i), s.Right = Math.min(e, r)) : (s.Left = Math.max(t, r), s.Right = Math.min(e, i)) : i < r ? (s.Left = Math.max(e, i), s.Right = Math.min(t, r)) : (s.Left = Math.max(e, r), s.Right = Math.min(t, i)), s.Left < s.Right;
  }, n.Clipper.prototype.JoinHorz = function(t, e, i, r, s, o) {
    var l = t.Pt.X > e.Pt.X ? n.Direction.dRightToLeft : n.Direction.dLeftToRight, a = i.Pt.X > r.Pt.X ? n.Direction.dRightToLeft : n.Direction.dLeftToRight;
    if (l == a)
      return !1;
    if (l == n.Direction.dLeftToRight) {
      for (; t.Next.Pt.X <= s.X && t.Next.Pt.X >= t.Pt.X && t.Next.Pt.Y == s.Y; )
        t = t.Next;
      o && t.Pt.X != s.X && (t = t.Next), e = this.DupOutPt(t, !o), n.IntPoint.op_Inequality(e.Pt, s) && (t = e, t.Pt.X = s.X, t.Pt.Y = s.Y, e = this.DupOutPt(t, !o));
    } else {
      for (; t.Next.Pt.X >= s.X && t.Next.Pt.X <= t.Pt.X && t.Next.Pt.Y == s.Y; )
        t = t.Next;
      !o && t.Pt.X != s.X && (t = t.Next), e = this.DupOutPt(t, o), n.IntPoint.op_Inequality(e.Pt, s) && (t = e, t.Pt.X = s.X, t.Pt.Y = s.Y, e = this.DupOutPt(t, o));
    }
    if (a == n.Direction.dLeftToRight) {
      for (; i.Next.Pt.X <= s.X && i.Next.Pt.X >= i.Pt.X && i.Next.Pt.Y == s.Y; )
        i = i.Next;
      o && i.Pt.X != s.X && (i = i.Next), r = this.DupOutPt(i, !o), n.IntPoint.op_Inequality(r.Pt, s) && (i = r, i.Pt.X = s.X, i.Pt.Y = s.Y, r = this.DupOutPt(i, !o));
    } else {
      for (; i.Next.Pt.X >= s.X && i.Next.Pt.X <= i.Pt.X && i.Next.Pt.Y == s.Y; )
        i = i.Next;
      !o && i.Pt.X != s.X && (i = i.Next), r = this.DupOutPt(i, o), n.IntPoint.op_Inequality(r.Pt, s) && (i = r, i.Pt.X = s.X, i.Pt.Y = s.Y, r = this.DupOutPt(i, o));
    }
    return l == n.Direction.dLeftToRight == o ? (t.Prev = i, i.Next = t, e.Next = r, r.Prev = e) : (t.Next = i, i.Prev = t, e.Prev = r, r.Next = e), !0;
  }, n.Clipper.prototype.JoinPoints = function(t, e, i) {
    var r = t.OutPt1, s = new n.OutPt(), o = t.OutPt2, l = new n.OutPt(), a = t.OutPt1.Pt.Y == t.OffPt.Y;
    if (a && n.IntPoint.op_Equality(t.OffPt, t.OutPt1.Pt) && n.IntPoint.op_Equality(t.OffPt, t.OutPt2.Pt)) {
      for (s = t.OutPt1.Next; s != r && n.IntPoint.op_Equality(s.Pt, t.OffPt); )
        s = s.Next;
      var u = s.Pt.Y > t.OffPt.Y;
      for (l = t.OutPt2.Next; l != o && n.IntPoint.op_Equality(l.Pt, t.OffPt); )
        l = l.Next;
      var d = l.Pt.Y > t.OffPt.Y;
      return u == d ? !1 : u ? (s = this.DupOutPt(r, !1), l = this.DupOutPt(o, !0), r.Prev = o, o.Next = r, s.Next = l, l.Prev = s, t.OutPt1 = r, t.OutPt2 = s, !0) : (s = this.DupOutPt(r, !0), l = this.DupOutPt(o, !1), r.Next = o, o.Prev = r, s.Prev = l, l.Next = s, t.OutPt1 = r, t.OutPt2 = s, !0);
    } else if (a) {
      for (s = r; r.Prev.Pt.Y == r.Pt.Y && r.Prev != s && r.Prev != o; )
        r = r.Prev;
      for (; s.Next.Pt.Y == s.Pt.Y && s.Next != r && s.Next != o; )
        s = s.Next;
      if (s.Next == r || s.Next == o)
        return !1;
      for (l = o; o.Prev.Pt.Y == o.Pt.Y && o.Prev != l && o.Prev != s; )
        o = o.Prev;
      for (; l.Next.Pt.Y == l.Pt.Y && l.Next != o && l.Next != r; )
        l = l.Next;
      if (l.Next == o || l.Next == r)
        return !1;
      var C = { Left: null, Right: null };
      if (!this.GetOverlap(r.Pt.X, s.Pt.X, o.Pt.X, l.Pt.X, C))
        return !1;
      var T = C.Left, N = C.Right, A = new n.IntPoint(), Y;
      return r.Pt.X >= T && r.Pt.X <= N ? (A.X = r.Pt.X, A.Y = r.Pt.Y, Y = r.Pt.X > s.Pt.X) : o.Pt.X >= T && o.Pt.X <= N ? (A.X = o.Pt.X, A.Y = o.Pt.Y, Y = o.Pt.X > l.Pt.X) : s.Pt.X >= T && s.Pt.X <= N ? (A.X = s.Pt.X, A.Y = s.Pt.Y, Y = s.Pt.X > r.Pt.X) : (A.X = l.Pt.X, A.Y = l.Pt.Y, Y = l.Pt.X > o.Pt.X), t.OutPt1 = r, t.OutPt2 = o, this.JoinHorz(r, s, o, l, A, Y);
    } else {
      for (s = r.Next; n.IntPoint.op_Equality(s.Pt, r.Pt) && s != r; )
        s = s.Next;
      var R = s.Pt.Y > r.Pt.Y || !n.ClipperBase.SlopesEqual(r.Pt, s.Pt, t.OffPt, this.m_UseFullRange);
      if (R) {
        for (s = r.Prev; n.IntPoint.op_Equality(s.Pt, r.Pt) && s != r; )
          s = s.Prev;
        if (s.Pt.Y > r.Pt.Y || !n.ClipperBase.SlopesEqual(r.Pt, s.Pt, t.OffPt, this.m_UseFullRange))
          return !1;
      }
      for (l = o.Next; n.IntPoint.op_Equality(l.Pt, o.Pt) && l != o; )
        l = l.Next;
      var V = l.Pt.Y > o.Pt.Y || !n.ClipperBase.SlopesEqual(o.Pt, l.Pt, t.OffPt, this.m_UseFullRange);
      if (V) {
        for (l = o.Prev; n.IntPoint.op_Equality(l.Pt, o.Pt) && l != o; )
          l = l.Prev;
        if (l.Pt.Y > o.Pt.Y || !n.ClipperBase.SlopesEqual(o.Pt, l.Pt, t.OffPt, this.m_UseFullRange))
          return !1;
      }
      return s == r || l == o || s == l || e == i && R == V ? !1 : R ? (s = this.DupOutPt(r, !1), l = this.DupOutPt(o, !0), r.Prev = o, o.Next = r, s.Next = l, l.Prev = s, t.OutPt1 = r, t.OutPt2 = s, !0) : (s = this.DupOutPt(r, !0), l = this.DupOutPt(o, !1), r.Next = o, o.Prev = r, s.Prev = l, l.Next = s, t.OutPt1 = r, t.OutPt2 = s, !0);
    }
  }, n.Clipper.GetBounds = function(t) {
    for (var e = 0, i = t.length; e < i && t[e].length == 0; ) e++;
    if (e == i) return new n.IntRect(0, 0, 0, 0);
    var r = new n.IntRect();
    for (r.left = t[e][0].X, r.right = r.left, r.top = t[e][0].Y, r.bottom = r.top; e < i; e++)
      for (var s = 0, o = t[e].length; s < o; s++)
        t[e][s].X < r.left ? r.left = t[e][s].X : t[e][s].X > r.right && (r.right = t[e][s].X), t[e][s].Y < r.top ? r.top = t[e][s].Y : t[e][s].Y > r.bottom && (r.bottom = t[e][s].Y);
    return r;
  }, n.Clipper.prototype.GetBounds2 = function(t) {
    var e = t, i = new n.IntRect();
    for (i.left = t.Pt.X, i.right = t.Pt.X, i.top = t.Pt.Y, i.bottom = t.Pt.Y, t = t.Next; t != e; )
      t.Pt.X < i.left && (i.left = t.Pt.X), t.Pt.X > i.right && (i.right = t.Pt.X), t.Pt.Y < i.top && (i.top = t.Pt.Y), t.Pt.Y > i.bottom && (i.bottom = t.Pt.Y), t = t.Next;
    return i;
  }, n.Clipper.PointInPolygon = function(t, e) {
    var i = 0, r = e.length;
    if (r < 3)
      return 0;
    for (var s = e[0], o = 1; o <= r; ++o) {
      var l = o == r ? e[0] : e[o];
      if (l.Y == t.Y && (l.X == t.X || s.Y == t.Y && l.X > t.X == s.X < t.X))
        return -1;
      if (s.Y < t.Y != l.Y < t.Y) {
        if (s.X >= t.X)
          if (l.X > t.X)
            i = 1 - i;
          else {
            var a = (s.X - t.X) * (l.Y - t.Y) - (l.X - t.X) * (s.Y - t.Y);
            if (a == 0)
              return -1;
            a > 0 == l.Y > s.Y && (i = 1 - i);
          }
        else if (l.X > t.X) {
          var a = (s.X - t.X) * (l.Y - t.Y) - (l.X - t.X) * (s.Y - t.Y);
          if (a == 0)
            return -1;
          a > 0 == l.Y > s.Y && (i = 1 - i);
        }
      }
      s = l;
    }
    return i;
  }, n.Clipper.prototype.PointInPolygon = function(t, e) {
    for (var i = 0, r = e; ; ) {
      var s = e.Pt.X, o = e.Pt.Y, l = e.Next.Pt.X, a = e.Next.Pt.Y;
      if (a == t.Y && (l == t.X || o == t.Y && l > t.X == s < t.X))
        return -1;
      if (o < t.Y != a < t.Y) {
        if (s >= t.X)
          if (l > t.X)
            i = 1 - i;
          else {
            var u = (s - t.X) * (a - t.Y) - (l - t.X) * (o - t.Y);
            if (u == 0)
              return -1;
            u > 0 == a > o && (i = 1 - i);
          }
        else if (l > t.X) {
          var u = (s - t.X) * (a - t.Y) - (l - t.X) * (o - t.Y);
          if (u == 0)
            return -1;
          u > 0 == a > o && (i = 1 - i);
        }
      }
      if (e = e.Next, r == e)
        break;
    }
    return i;
  }, n.Clipper.prototype.Poly2ContainsPoly1 = function(t, e) {
    var i = t;
    do {
      var r = this.PointInPolygon(i.Pt, e);
      if (r >= 0)
        return r != 0;
      i = i.Next;
    } while (i != t);
    return !0;
  }, n.Clipper.prototype.FixupFirstLefts1 = function(t, e) {
    for (var i = 0, r = this.m_PolyOuts.length; i < r; i++) {
      var s = this.m_PolyOuts[i];
      s.Pts !== null && s.FirstLeft == t && this.Poly2ContainsPoly1(s.Pts, e.Pts) && (s.FirstLeft = e);
    }
  }, n.Clipper.prototype.FixupFirstLefts2 = function(t, e) {
    for (var i = 0, r = this.m_PolyOuts, s = r.length, o = r[i]; i < s; i++, o = r[i])
      o.FirstLeft == t && (o.FirstLeft = e);
  }, n.Clipper.ParseFirstLeft = function(t) {
    for (; t != null && t.Pts == null; )
      t = t.FirstLeft;
    return t;
  }, n.Clipper.prototype.JoinCommonEdges = function() {
    for (var t = 0, e = this.m_Joins.length; t < e; t++) {
      var i = this.m_Joins[t], r = this.GetOutRec(i.OutPt1.Idx), s = this.GetOutRec(i.OutPt2.Idx);
      if (!(r.Pts == null || s.Pts == null)) {
        var o;
        if (r == s ? o = r : this.Param1RightOfParam2(r, s) ? o = s : this.Param1RightOfParam2(s, r) ? o = r : o = this.GetLowermostRec(r, s), !!this.JoinPoints(i, r, s))
          if (r == s) {
            if (r.Pts = i.OutPt1, r.BottomPt = null, s = this.CreateOutRec(), s.Pts = i.OutPt2, this.UpdateOutPtIdxs(s), this.m_UsingPolyTree)
              for (var l = 0, a = this.m_PolyOuts.length; l < a - 1; l++) {
                var u = this.m_PolyOuts[l];
                u.Pts == null || n.Clipper.ParseFirstLeft(u.FirstLeft) != r || u.IsHole == r.IsHole || this.Poly2ContainsPoly1(u.Pts, i.OutPt2) && (u.FirstLeft = s);
              }
            this.Poly2ContainsPoly1(s.Pts, r.Pts) ? (s.IsHole = !r.IsHole, s.FirstLeft = r, this.m_UsingPolyTree && this.FixupFirstLefts2(s, r), (s.IsHole ^ this.ReverseSolution) == this.Area(s) > 0 && this.ReversePolyPtLinks(s.Pts)) : this.Poly2ContainsPoly1(r.Pts, s.Pts) ? (s.IsHole = r.IsHole, r.IsHole = !s.IsHole, s.FirstLeft = r.FirstLeft, r.FirstLeft = s, this.m_UsingPolyTree && this.FixupFirstLefts2(r, s), (r.IsHole ^ this.ReverseSolution) == this.Area(r) > 0 && this.ReversePolyPtLinks(r.Pts)) : (s.IsHole = r.IsHole, s.FirstLeft = r.FirstLeft, this.m_UsingPolyTree && this.FixupFirstLefts1(r, s));
          } else
            s.Pts = null, s.BottomPt = null, s.Idx = r.Idx, r.IsHole = o.IsHole, o == s && (r.FirstLeft = s.FirstLeft), s.FirstLeft = r, this.m_UsingPolyTree && this.FixupFirstLefts2(s, r);
      }
    }
  }, n.Clipper.prototype.UpdateOutPtIdxs = function(t) {
    var e = t.Pts;
    do
      e.Idx = t.Idx, e = e.Prev;
    while (e != t.Pts);
  }, n.Clipper.prototype.DoSimplePolygons = function() {
    for (var t = 0; t < this.m_PolyOuts.length; ) {
      var e = this.m_PolyOuts[t++], i = e.Pts;
      if (i !== null)
        do {
          for (var r = i.Next; r != e.Pts; ) {
            if (n.IntPoint.op_Equality(i.Pt, r.Pt) && r.Next != i && r.Prev != i) {
              var s = i.Prev, o = r.Prev;
              i.Prev = o, o.Next = i, r.Prev = s, s.Next = r, e.Pts = i;
              var l = this.CreateOutRec();
              l.Pts = r, this.UpdateOutPtIdxs(l), this.Poly2ContainsPoly1(l.Pts, e.Pts) ? (l.IsHole = !e.IsHole, l.FirstLeft = e) : this.Poly2ContainsPoly1(e.Pts, l.Pts) ? (l.IsHole = e.IsHole, e.IsHole = !l.IsHole, l.FirstLeft = e.FirstLeft, e.FirstLeft = l) : (l.IsHole = e.IsHole, l.FirstLeft = e.FirstLeft), r = i;
            }
            r = r.Next;
          }
          i = i.Next;
        } while (i != e.Pts);
    }
  }, n.Clipper.Area = function(t) {
    var e = t.length;
    if (e < 3)
      return 0;
    for (var i = 0, r = 0, s = e - 1; r < e; ++r)
      i += (t[s].X + t[r].X) * (t[s].Y - t[r].Y), s = r;
    return -i * 0.5;
  }, n.Clipper.prototype.Area = function(t) {
    var e = t.Pts;
    if (e == null)
      return 0;
    var i = 0;
    do
      i = i + (e.Prev.Pt.X + e.Pt.X) * (e.Prev.Pt.Y - e.Pt.Y), e = e.Next;
    while (e != t.Pts);
    return i * 0.5;
  }, n.Clipper.SimplifyPolygon = function(t, e) {
    var i = new Array(), r = new n.Clipper(0);
    return r.StrictlySimple = !0, r.AddPath(t, n.PolyType.ptSubject, !0), r.Execute(n.ClipType.ctUnion, i, e, e), i;
  }, n.Clipper.SimplifyPolygons = function(t, e) {
    typeof e > "u" && (e = n.PolyFillType.pftEvenOdd);
    var i = new Array(), r = new n.Clipper(0);
    return r.StrictlySimple = !0, r.AddPaths(t, n.PolyType.ptSubject, !0), r.Execute(n.ClipType.ctUnion, i, e, e), i;
  }, n.Clipper.DistanceSqrd = function(t, e) {
    var i = t.X - e.X, r = t.Y - e.Y;
    return i * i + r * r;
  }, n.Clipper.DistanceFromLineSqrd = function(t, e, i) {
    var r = e.Y - i.Y, s = i.X - e.X, o = r * e.X + s * e.Y;
    return o = r * t.X + s * t.Y - o, o * o / (r * r + s * s);
  }, n.Clipper.SlopesNearCollinear = function(t, e, i, r) {
    return n.Clipper.DistanceFromLineSqrd(e, t, i) < r;
  }, n.Clipper.PointsAreClose = function(t, e, i) {
    var r = t.X - e.X, s = t.Y - e.Y;
    return r * r + s * s <= i;
  }, n.Clipper.ExcludeOp = function(t) {
    var e = t.Prev;
    return e.Next = t.Next, t.Next.Prev = e, e.Idx = 0, e;
  }, n.Clipper.CleanPolygon = function(t, e) {
    typeof e > "u" && (e = 1.415);
    var i = t.length;
    if (i == 0)
      return new Array();
    for (var r = new Array(i), s = 0; s < i; ++s)
      r[s] = new n.OutPt();
    for (var s = 0; s < i; ++s)
      r[s].Pt = t[s], r[s].Next = r[(s + 1) % i], r[s].Next.Prev = r[s], r[s].Idx = 0;
    for (var o = e * e, l = r[0]; l.Idx == 0 && l.Next != l.Prev; )
      n.Clipper.PointsAreClose(l.Pt, l.Prev.Pt, o) ? (l = n.Clipper.ExcludeOp(l), i--) : n.Clipper.PointsAreClose(l.Prev.Pt, l.Next.Pt, o) ? (n.Clipper.ExcludeOp(l.Next), l = n.Clipper.ExcludeOp(l), i -= 2) : n.Clipper.SlopesNearCollinear(l.Prev.Pt, l.Pt, l.Next.Pt, o) ? (l = n.Clipper.ExcludeOp(l), i--) : (l.Idx = 1, l = l.Next);
    i < 3 && (i = 0);
    for (var a = new Array(i), s = 0; s < i; ++s)
      a[s] = new n.IntPoint(l.Pt), l = l.Next;
    return r = null, a;
  }, n.Clipper.CleanPolygons = function(t, e) {
    for (var i = new Array(t.length), r = 0, s = t.length; r < s; r++)
      i[r] = n.Clipper.CleanPolygon(t[r], e);
    return i;
  }, n.Clipper.Minkowski = function(t, e, i, r) {
    var s = r ? 1 : 0, o = t.length, l = e.length, a = new Array();
    if (i)
      for (var u = 0; u < l; u++) {
        for (var d = new Array(o), C = 0, T = t.length, N = t[C]; C < T; C++, N = t[C])
          d[C] = new n.IntPoint(e[u].X + N.X, e[u].Y + N.Y);
        a.push(d);
      }
    else
      for (var u = 0; u < l; u++) {
        for (var d = new Array(o), C = 0, T = t.length, N = t[C]; C < T; C++, N = t[C])
          d[C] = new n.IntPoint(e[u].X - N.X, e[u].Y - N.Y);
        a.push(d);
      }
    for (var A = new Array(), u = 0; u < l - 1 + s; u++)
      for (var C = 0; C < o; C++) {
        var Y = new Array();
        Y.push(a[u % l][C % o]), Y.push(a[(u + 1) % l][C % o]), Y.push(a[(u + 1) % l][(C + 1) % o]), Y.push(a[u % l][(C + 1) % o]), n.Clipper.Orientation(Y) || Y.reverse(), A.push(Y);
      }
    var R = new n.Clipper(0);
    return R.AddPaths(A, n.PolyType.ptSubject, !0), R.Execute(n.ClipType.ctUnion, a, n.PolyFillType.pftNonZero, n.PolyFillType.pftNonZero), a;
  }, n.Clipper.MinkowskiSum = function() {
    var t = arguments, e = t.length;
    if (e == 3) {
      var i = t[0], r = t[1], s = t[2];
      return n.Clipper.Minkowski(i, r, !0, s);
    } else if (e == 4) {
      for (var i = t[0], o = t[1], l = t[2], s = t[3], a = new n.Clipper(), u, d = 0, C = o.length; d < C; ++d) {
        var u = n.Clipper.Minkowski(i, o[d], !0, s);
        a.AddPaths(u, n.PolyType.ptSubject, !0);
      }
      s && a.AddPaths(o, n.PolyType.ptClip, !0);
      var T = new n.Paths();
      return a.Execute(n.ClipType.ctUnion, T, l, l), T;
    }
  }, n.Clipper.MinkowskiDiff = function(t, e, i) {
    return n.Clipper.Minkowski(t, e, !1, i);
  }, n.Clipper.PolyTreeToPaths = function(t) {
    var e = new Array();
    return n.Clipper.AddPolyNodeToPaths(t, n.Clipper.NodeType.ntAny, e), e;
  }, n.Clipper.AddPolyNodeToPaths = function(t, e, i) {
    var r = !0;
    switch (e) {
      case n.Clipper.NodeType.ntOpen:
        return;
      case n.Clipper.NodeType.ntClosed:
        r = !t.IsOpen;
        break;
    }
    t.m_polygon.length > 0 && r && i.push(t.m_polygon);
    for (var s = 0, o = t.Childs(), l = o.length, a = o[s]; s < l; s++, a = o[s])
      n.Clipper.AddPolyNodeToPaths(a, e, i);
  }, n.Clipper.OpenPathsFromPolyTree = function(t) {
    for (var e = new n.Paths(), i = 0, r = t.ChildCount(); i < r; i++)
      t.Childs()[i].IsOpen && e.push(t.Childs()[i].m_polygon);
    return e;
  }, n.Clipper.ClosedPathsFromPolyTree = function(t) {
    var e = new n.Paths();
    return n.Clipper.AddPolyNodeToPaths(t, n.Clipper.NodeType.ntClosed, e), e;
  }, Gt(n.Clipper, n.ClipperBase), n.Clipper.NodeType = {
    ntAny: 0,
    ntOpen: 1,
    ntClosed: 2
  }, n.ClipperOffset = function(t, e) {
    typeof t > "u" && (t = 2), typeof e > "u" && (e = n.ClipperOffset.def_arc_tolerance), this.m_destPolys = new n.Paths(), this.m_srcPoly = new n.Path(), this.m_destPoly = new n.Path(), this.m_normals = new Array(), this.m_delta = 0, this.m_sinA = 0, this.m_sin = 0, this.m_cos = 0, this.m_miterLim = 0, this.m_StepsPerRad = 0, this.m_lowest = new n.IntPoint(), this.m_polyNodes = new n.PolyNode(), this.MiterLimit = t, this.ArcTolerance = e, this.m_lowest.X = -1;
  }, n.ClipperOffset.two_pi = 6.28318530717959, n.ClipperOffset.def_arc_tolerance = 0.25, n.ClipperOffset.prototype.Clear = function() {
    n.Clear(this.m_polyNodes.Childs()), this.m_lowest.X = -1;
  }, n.ClipperOffset.Round = n.Clipper.Round, n.ClipperOffset.prototype.AddPath = function(t, e, i) {
    var r = t.length - 1;
    if (!(r < 0)) {
      var s = new n.PolyNode();
      if (s.m_jointype = e, s.m_endtype = i, i == n.EndType.etClosedLine || i == n.EndType.etClosedPolygon)
        for (; r > 0 && n.IntPoint.op_Equality(t[0], t[r]); )
          r--;
      s.m_polygon.push(t[0]);
      for (var o = 0, l = 0, a = 1; a <= r; a++)
        n.IntPoint.op_Inequality(s.m_polygon[o], t[a]) && (o++, s.m_polygon.push(t[a]), (t[a].Y > s.m_polygon[l].Y || t[a].Y == s.m_polygon[l].Y && t[a].X < s.m_polygon[l].X) && (l = o));
      if (!(i == n.EndType.etClosedPolygon && o < 2 || i != n.EndType.etClosedPolygon && o < 0) && (this.m_polyNodes.AddChild(s), i == n.EndType.etClosedPolygon))
        if (this.m_lowest.X < 0)
          this.m_lowest = new n.IntPoint(0, l);
        else {
          var u = this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon[this.m_lowest.Y];
          (s.m_polygon[l].Y > u.Y || s.m_polygon[l].Y == u.Y && s.m_polygon[l].X < u.X) && (this.m_lowest = new n.IntPoint(this.m_polyNodes.ChildCount() - 1, l));
        }
    }
  }, n.ClipperOffset.prototype.AddPaths = function(t, e, i) {
    for (var r = 0, s = t.length; r < s; r++)
      this.AddPath(t[r], e, i);
  }, n.ClipperOffset.prototype.FixOrientations = function() {
    if (this.m_lowest.X >= 0 && !n.Clipper.Orientation(this.m_polyNodes.Childs()[this.m_lowest.X].m_polygon))
      for (var t = 0; t < this.m_polyNodes.ChildCount(); t++) {
        var e = this.m_polyNodes.Childs()[t];
        (e.m_endtype == n.EndType.etClosedPolygon || e.m_endtype == n.EndType.etClosedLine && n.Clipper.Orientation(e.m_polygon)) && e.m_polygon.reverse();
      }
    else
      for (var t = 0; t < this.m_polyNodes.ChildCount(); t++) {
        var e = this.m_polyNodes.Childs()[t];
        e.m_endtype == n.EndType.etClosedLine && !n.Clipper.Orientation(e.m_polygon) && e.m_polygon.reverse();
      }
  }, n.ClipperOffset.GetUnitNormal = function(t, e) {
    var i = e.X - t.X, r = e.Y - t.Y;
    if (i == 0 && r == 0)
      return new n.DoublePoint(0, 0);
    var s = 1 / Math.sqrt(i * i + r * r);
    return i *= s, r *= s, new n.DoublePoint(r, -i);
  }, n.ClipperOffset.prototype.DoOffset = function(t) {
    if (this.m_destPolys = new Array(), this.m_delta = t, n.ClipperBase.near_zero(t)) {
      for (var e = 0; e < this.m_polyNodes.ChildCount(); e++) {
        var i = this.m_polyNodes.Childs()[e];
        i.m_endtype == n.EndType.etClosedPolygon && this.m_destPolys.push(i.m_polygon);
      }
      return;
    }
    this.MiterLimit > 2 ? this.m_miterLim = 2 / (this.MiterLimit * this.MiterLimit) : this.m_miterLim = 0.5;
    var r;
    this.ArcTolerance <= 0 ? r = n.ClipperOffset.def_arc_tolerance : this.ArcTolerance > Math.abs(t) * n.ClipperOffset.def_arc_tolerance ? r = Math.abs(t) * n.ClipperOffset.def_arc_tolerance : r = this.ArcTolerance;
    var s = 3.14159265358979 / Math.acos(1 - r / Math.abs(t));
    this.m_sin = Math.sin(n.ClipperOffset.two_pi / s), this.m_cos = Math.cos(n.ClipperOffset.two_pi / s), this.m_StepsPerRad = s / n.ClipperOffset.two_pi, t < 0 && (this.m_sin = -this.m_sin);
    for (var e = 0; e < this.m_polyNodes.ChildCount(); e++) {
      var i = this.m_polyNodes.Childs()[e];
      this.m_srcPoly = i.m_polygon;
      var o = this.m_srcPoly.length;
      if (!(o == 0 || t <= 0 && (o < 3 || i.m_endtype != n.EndType.etClosedPolygon))) {
        if (this.m_destPoly = new Array(), o == 1) {
          if (i.m_jointype == n.JoinType.jtRound)
            for (var l = 1, a = 0, u = 1; u <= s; u++) {
              this.m_destPoly.push(new n.IntPoint(n.ClipperOffset.Round(this.m_srcPoly[0].X + l * t), n.ClipperOffset.Round(this.m_srcPoly[0].Y + a * t)));
              var d = l;
              l = l * this.m_cos - this.m_sin * a, a = d * this.m_sin + a * this.m_cos;
            }
          else
            for (var l = -1, a = -1, u = 0; u < 4; ++u)
              this.m_destPoly.push(new n.IntPoint(n.ClipperOffset.Round(this.m_srcPoly[0].X + l * t), n.ClipperOffset.Round(this.m_srcPoly[0].Y + a * t))), l < 0 ? l = 1 : a < 0 ? a = 1 : l = -1;
          this.m_destPolys.push(this.m_destPoly);
          continue;
        }
        this.m_normals.length = 0;
        for (var u = 0; u < o - 1; u++)
          this.m_normals.push(n.ClipperOffset.GetUnitNormal(this.m_srcPoly[u], this.m_srcPoly[u + 1]));
        if (i.m_endtype == n.EndType.etClosedLine || i.m_endtype == n.EndType.etClosedPolygon ? this.m_normals.push(n.ClipperOffset.GetUnitNormal(this.m_srcPoly[o - 1], this.m_srcPoly[0])) : this.m_normals.push(new n.DoublePoint(this.m_normals[o - 2])), i.m_endtype == n.EndType.etClosedPolygon) {
          for (var C = o - 1, u = 0; u < o; u++)
            C = this.OffsetPoint(u, C, i.m_jointype);
          this.m_destPolys.push(this.m_destPoly);
        } else if (i.m_endtype == n.EndType.etClosedLine) {
          for (var C = o - 1, u = 0; u < o; u++)
            C = this.OffsetPoint(u, C, i.m_jointype);
          this.m_destPolys.push(this.m_destPoly), this.m_destPoly = new Array();
          for (var T = this.m_normals[o - 1], u = o - 1; u > 0; u--)
            this.m_normals[u] = new n.DoublePoint(-this.m_normals[u - 1].X, -this.m_normals[u - 1].Y);
          this.m_normals[0] = new n.DoublePoint(-T.X, -T.Y), C = 0;
          for (var u = o - 1; u >= 0; u--)
            C = this.OffsetPoint(u, C, i.m_jointype);
          this.m_destPolys.push(this.m_destPoly);
        } else {
          for (var C = 0, u = 1; u < o - 1; ++u)
            C = this.OffsetPoint(u, C, i.m_jointype);
          var N;
          if (i.m_endtype == n.EndType.etOpenButt) {
            var u = o - 1;
            N = new n.IntPoint(n.ClipperOffset.Round(this.m_srcPoly[u].X + this.m_normals[u].X * t), n.ClipperOffset.Round(this.m_srcPoly[u].Y + this.m_normals[u].Y * t)), this.m_destPoly.push(N), N = new n.IntPoint(n.ClipperOffset.Round(this.m_srcPoly[u].X - this.m_normals[u].X * t), n.ClipperOffset.Round(this.m_srcPoly[u].Y - this.m_normals[u].Y * t)), this.m_destPoly.push(N);
          } else {
            var u = o - 1;
            C = o - 2, this.m_sinA = 0, this.m_normals[u] = new n.DoublePoint(-this.m_normals[u].X, -this.m_normals[u].Y), i.m_endtype == n.EndType.etOpenSquare ? this.DoSquare(u, C) : this.DoRound(u, C);
          }
          for (var u = o - 1; u > 0; u--)
            this.m_normals[u] = new n.DoublePoint(-this.m_normals[u - 1].X, -this.m_normals[u - 1].Y);
          this.m_normals[0] = new n.DoublePoint(-this.m_normals[1].X, -this.m_normals[1].Y), C = o - 1;
          for (var u = C - 1; u > 0; --u)
            C = this.OffsetPoint(u, C, i.m_jointype);
          i.m_endtype == n.EndType.etOpenButt ? (N = new n.IntPoint(n.ClipperOffset.Round(this.m_srcPoly[0].X - this.m_normals[0].X * t), n.ClipperOffset.Round(this.m_srcPoly[0].Y - this.m_normals[0].Y * t)), this.m_destPoly.push(N), N = new n.IntPoint(n.ClipperOffset.Round(this.m_srcPoly[0].X + this.m_normals[0].X * t), n.ClipperOffset.Round(this.m_srcPoly[0].Y + this.m_normals[0].Y * t)), this.m_destPoly.push(N)) : (C = 1, this.m_sinA = 0, i.m_endtype == n.EndType.etOpenSquare ? this.DoSquare(0, 1) : this.DoRound(0, 1)), this.m_destPolys.push(this.m_destPoly);
        }
      }
    }
  }, n.ClipperOffset.prototype.Execute = function() {
    var t = arguments, e = t[0] instanceof n.PolyTree;
    if (e) {
      var i = t[0], r = t[1];
      i.Clear(), this.FixOrientations(), this.DoOffset(r);
      var s = new n.Clipper(0);
      if (s.AddPaths(this.m_destPolys, n.PolyType.ptSubject, !0), r > 0)
        s.Execute(n.ClipType.ctUnion, i, n.PolyFillType.pftPositive, n.PolyFillType.pftPositive);
      else {
        var o = n.Clipper.GetBounds(this.m_destPolys), l = new n.Path();
        if (l.push(new n.IntPoint(o.left - 10, o.bottom + 10)), l.push(new n.IntPoint(o.right + 10, o.bottom + 10)), l.push(new n.IntPoint(o.right + 10, o.top - 10)), l.push(new n.IntPoint(o.left - 10, o.top - 10)), s.AddPath(l, n.PolyType.ptSubject, !0), s.ReverseSolution = !0, s.Execute(n.ClipType.ctUnion, i, n.PolyFillType.pftNegative, n.PolyFillType.pftNegative), i.ChildCount() == 1 && i.Childs()[0].ChildCount() > 0) {
          var a = i.Childs()[0];
          i.Childs()[0] = a.Childs()[0];
          for (var u = 1; u < a.ChildCount(); u++)
            i.AddChild(a.Childs()[u]);
        } else
          i.Clear();
      }
    } else {
      var i = t[0], r = t[1];
      n.Clear(i), this.FixOrientations(), this.DoOffset(r);
      var s = new n.Clipper(0);
      if (s.AddPaths(this.m_destPolys, n.PolyType.ptSubject, !0), r > 0)
        s.Execute(n.ClipType.ctUnion, i, n.PolyFillType.pftPositive, n.PolyFillType.pftPositive);
      else {
        var o = n.Clipper.GetBounds(this.m_destPolys), l = new n.Path();
        l.push(new n.IntPoint(o.left - 10, o.bottom + 10)), l.push(new n.IntPoint(o.right + 10, o.bottom + 10)), l.push(new n.IntPoint(o.right + 10, o.top - 10)), l.push(new n.IntPoint(o.left - 10, o.top - 10)), s.AddPath(l, n.PolyType.ptSubject, !0), s.ReverseSolution = !0, s.Execute(n.ClipType.ctUnion, i, n.PolyFillType.pftNegative, n.PolyFillType.pftNegative), i.length > 0 && i.splice(0, 1);
      }
    }
  }, n.ClipperOffset.prototype.OffsetPoint = function(t, e, i) {
    if (this.m_sinA = this.m_normals[e].X * this.m_normals[t].Y - this.m_normals[t].X * this.m_normals[e].Y, this.m_sinA < 5e-5 && this.m_sinA > -5e-5)
      return e;
    if (this.m_sinA > 1 ? this.m_sinA = 1 : this.m_sinA < -1 && (this.m_sinA = -1), this.m_sinA * this.m_delta < 0)
      this.m_destPoly.push(new n.IntPoint(
        n.ClipperOffset.Round(this.m_srcPoly[t].X + this.m_normals[e].X * this.m_delta),
        n.ClipperOffset.Round(this.m_srcPoly[t].Y + this.m_normals[e].Y * this.m_delta)
      )), this.m_destPoly.push(new n.IntPoint(this.m_srcPoly[t])), this.m_destPoly.push(new n.IntPoint(
        n.ClipperOffset.Round(this.m_srcPoly[t].X + this.m_normals[t].X * this.m_delta),
        n.ClipperOffset.Round(this.m_srcPoly[t].Y + this.m_normals[t].Y * this.m_delta)
      ));
    else
      switch (i) {
        case n.JoinType.jtMiter: {
          var r = 1 + (this.m_normals[t].X * this.m_normals[e].X + this.m_normals[t].Y * this.m_normals[e].Y);
          r >= this.m_miterLim ? this.DoMiter(t, e, r) : this.DoSquare(t, e);
          break;
        }
        case n.JoinType.jtSquare:
          this.DoSquare(t, e);
          break;
        case n.JoinType.jtRound:
          this.DoRound(t, e);
          break;
      }
    return e = t, e;
  }, n.ClipperOffset.prototype.DoSquare = function(t, e) {
    var i = Math.tan(Math.atan2(
      this.m_sinA,
      this.m_normals[e].X * this.m_normals[t].X + this.m_normals[e].Y * this.m_normals[t].Y
    ) / 4);
    this.m_destPoly.push(new n.IntPoint(
      n.ClipperOffset.Round(this.m_srcPoly[t].X + this.m_delta * (this.m_normals[e].X - this.m_normals[e].Y * i)),
      n.ClipperOffset.Round(this.m_srcPoly[t].Y + this.m_delta * (this.m_normals[e].Y + this.m_normals[e].X * i))
    )), this.m_destPoly.push(new n.IntPoint(
      n.ClipperOffset.Round(this.m_srcPoly[t].X + this.m_delta * (this.m_normals[t].X + this.m_normals[t].Y * i)),
      n.ClipperOffset.Round(this.m_srcPoly[t].Y + this.m_delta * (this.m_normals[t].Y - this.m_normals[t].X * i))
    ));
  }, n.ClipperOffset.prototype.DoMiter = function(t, e, i) {
    var r = this.m_delta / i;
    this.m_destPoly.push(new n.IntPoint(
      n.ClipperOffset.Round(this.m_srcPoly[t].X + (this.m_normals[e].X + this.m_normals[t].X) * r),
      n.ClipperOffset.Round(this.m_srcPoly[t].Y + (this.m_normals[e].Y + this.m_normals[t].Y) * r)
    ));
  }, n.ClipperOffset.prototype.DoRound = function(t, e) {
    for (var i = Math.atan2(
      this.m_sinA,
      this.m_normals[e].X * this.m_normals[t].X + this.m_normals[e].Y * this.m_normals[t].Y
    ), r = n.Cast_Int32(n.ClipperOffset.Round(this.m_StepsPerRad * Math.abs(i))), s = this.m_normals[e].X, o = this.m_normals[e].Y, l, a = 0; a < r; ++a)
      this.m_destPoly.push(new n.IntPoint(
        n.ClipperOffset.Round(this.m_srcPoly[t].X + s * this.m_delta),
        n.ClipperOffset.Round(this.m_srcPoly[t].Y + o * this.m_delta)
      )), l = s, s = s * this.m_cos - this.m_sin * o, o = l * this.m_sin + o * this.m_cos;
    this.m_destPoly.push(new n.IntPoint(
      n.ClipperOffset.Round(this.m_srcPoly[t].X + this.m_normals[t].X * this.m_delta),
      n.ClipperOffset.Round(this.m_srcPoly[t].Y + this.m_normals[t].Y * this.m_delta)
    ));
  }, n.Error = function(t) {
    try {
      throw new Error(t);
    } catch (e) {
      alert(e.message);
    }
  }, n.JS = {}, n.JS.AreaOfPolygon = function(t, e) {
    return e || (e = 1), n.Clipper.Area(t) / (e * e);
  }, n.JS.AreaOfPolygons = function(t, e) {
    e || (e = 1);
    for (var i = 0, r = 0; r < t.length; r++)
      i += n.Clipper.Area(t[r]);
    return i / (e * e);
  }, n.JS.BoundsOfPath = function(t, e) {
    return n.JS.BoundsOfPaths([t], e);
  }, n.JS.BoundsOfPaths = function(t, e) {
    e || (e = 1);
    var i = n.Clipper.GetBounds(t);
    return i.left /= e, i.bottom /= e, i.right /= e, i.top /= e, i;
  }, n.JS.Clean = function(r, e) {
    if (!(r instanceof Array)) return [];
    var i = r[0] instanceof Array, r = n.JS.Clone(r);
    if (typeof e != "number" || e === null)
      return n.Error("Delta is not a number in Clean()."), r;
    if (r.length === 0 || r.length == 1 && r[0].length === 0 || e < 0) return r;
    i || (r = [r]);
    for (var s = r.length, o, l, a, u, d, C, T, N = [], A = 0; A < s; A++)
      if (l = r[A], o = l.length, o !== 0) {
        if (o < 3) {
          a = l, N.push(a);
          continue;
        }
        for (a = l, u = e * e, d = l[0], C = 1, T = 1; T < o; T++)
          (l[T].X - d.X) * (l[T].X - d.X) + (l[T].Y - d.Y) * (l[T].Y - d.Y) <= u || (a[C] = l[T], d = l[T], C++);
        d = l[C - 1], (l[0].X - d.X) * (l[0].X - d.X) + (l[0].Y - d.Y) * (l[0].Y - d.Y) <= u && C--, C < o && a.splice(C, o - C), a.length && N.push(a);
      }
    return !i && N.length ? N = N[0] : !i && N.length === 0 ? N = [] : i && N.length === 0 && (N = [
      []
    ]), N;
  }, n.JS.Clone = function(t) {
    if (!(t instanceof Array)) return [];
    if (t.length === 0) return [];
    if (t.length == 1 && t[0].length === 0) return [[]];
    var e = t[0] instanceof Array;
    e || (t = [t]);
    var i = t.length, r, s, o, l, a = new Array(i);
    for (s = 0; s < i; s++) {
      for (r = t[s].length, l = new Array(r), o = 0; o < r; o++)
        l[o] = {
          X: t[s][o].X,
          Y: t[s][o].Y
        };
      a[s] = l;
    }
    return e || (a = a[0]), a;
  }, n.JS.Lighten = function(t, e) {
    if (!(t instanceof Array)) return [];
    if (typeof e != "number" || e === null)
      return n.Error("Tolerance is not a number in Lighten()."), n.JS.Clone(t);
    if (t.length === 0 || t.length == 1 && t[0].length === 0 || e < 0)
      return n.JS.Clone(t);
    t[0] instanceof Array || (t = [t]);
    var i, r, s, o, l, a, u, d, C, T, N, A, Y, R, V, $, lt, Xi = t.length, Ni = e * e, yt = [];
    for (i = 0; i < Xi; i++)
      if (s = t[i], a = s.length, a != 0) {
        for (o = 0; o < 1e6; o++) {
          for (l = [], a = s.length, s[a - 1].X != s[0].X || s[a - 1].Y != s[0].Y ? (A = 1, s.push(
            {
              X: s[0].X,
              Y: s[0].Y
            }
          ), a = s.length) : A = 0, N = [], r = 0; r < a - 2; r++)
            u = s[r], C = s[r + 1], d = s[r + 2], $ = u.X, lt = u.Y, Y = d.X - $, R = d.Y - lt, (Y !== 0 || R !== 0) && (V = ((C.X - $) * Y + (C.Y - lt) * R) / (Y * Y + R * R), V > 1 ? ($ = d.X, lt = d.Y) : V > 0 && ($ += Y * V, lt += R * V)), Y = C.X - $, R = C.Y - lt, T = Y * Y + R * R, T <= Ni && (N[r + 1] = 1, r++);
          for (l.push(
            {
              X: s[0].X,
              Y: s[0].Y
            }
          ), r = 1; r < a - 1; r++)
            N[r] || l.push(
              {
                X: s[r].X,
                Y: s[r].Y
              }
            );
          if (l.push(
            {
              X: s[a - 1].X,
              Y: s[a - 1].Y
            }
          ), A && s.pop(), N.length) s = l;
          else break;
        }
        a = l.length, l[a - 1].X == l[0].X && l[a - 1].Y == l[0].Y && l.pop(), l.length > 2 && yt.push(l);
      }
    return !t[0] instanceof Array && (yt = yt[0]), typeof yt > "u" && (yt = [
      []
    ]), yt;
  }, n.JS.PerimeterOfPath = function(t, e, i) {
    if (typeof t > "u") return 0;
    var r = Math.sqrt, s = 0, o, l, a = 0, u = 0, d = 0, C = 0, T = t.length;
    if (T < 2) return 0;
    for (e && (t[T] = t[0], T++); --T; )
      o = t[T], a = o.X, u = o.Y, l = t[T - 1], d = l.X, C = l.Y, s += r((a - d) * (a - d) + (u - C) * (u - C));
    return e && t.pop(), s / i;
  }, n.JS.PerimeterOfPaths = function(t, e, i) {
    i || (i = 1);
    for (var r = 0, s = 0; s < t.length; s++)
      r += n.JS.PerimeterOfPath(t[s], e, i);
    return r;
  }, n.JS.ScaleDownPath = function(t, e) {
    var i, r;
    for (e || (e = 1), i = t.length; i--; )
      r = t[i], r.X = r.X / e, r.Y = r.Y / e;
  }, n.JS.ScaleDownPaths = function(t, e) {
    var i, r, s;
    for (e || (e = 1), i = t.length; i--; )
      for (r = t[i].length; r--; )
        s = t[i][r], s.X = s.X / e, s.Y = s.Y / e;
  }, n.JS.ScaleUpPath = function(t, e) {
    var i, r, s = Math.round;
    for (e || (e = 1), i = t.length; i--; )
      r = t[i], r.X = s(r.X * e), r.Y = s(r.Y * e);
  }, n.JS.ScaleUpPaths = function(t, e) {
    var i, r, s, o = Math.round;
    for (e || (e = 1), i = t.length; i--; )
      for (r = t[i].length; r--; )
        s = t[i][r], s.X = o(s.X * e), s.Y = o(s.Y * e);
  }, n.ExPolygons = function() {
    return [];
  }, n.ExPolygon = function() {
    this.outer = null, this.holes = null;
  }, n.JS.AddOuterPolyNodeToExPolygons = function(t, e) {
    var i = new n.ExPolygon();
    i.outer = t.Contour();
    var r = t.Childs(), s = r.length;
    i.holes = new Array(s);
    var o, l, a, u, d, C;
    for (a = 0; a < s; a++)
      for (o = r[a], i.holes[a] = o.Contour(), u = 0, d = o.Childs(), C = d.length; u < C; u++)
        l = d[u], n.JS.AddOuterPolyNodeToExPolygons(l, e);
    e.push(i);
  }, n.JS.ExPolygonsToPaths = function(t) {
    var e, i, r, s, o = new n.Paths();
    for (e = 0, r = t.length; e < r; e++)
      for (o.push(t[e].outer), i = 0, s = t[e].holes.length; i < s; i++)
        o.push(t[e].holes[i]);
    return o;
  }, n.JS.PolyTreeToExPolygons = function(t) {
    var e = new n.ExPolygons(), i, r, s, o;
    for (r = 0, s = t.Childs(), o = s.length; r < o; r++)
      i = s[r], n.JS.AddOuterPolyNodeToExPolygons(i, e);
    return e;
  }, f.exports = n;
})(fe);
var qi = fe.exports;
const Vt = /* @__PURE__ */ Wi(qi);
let D, mt;
const pt = new ae("t"), ht = new ae("af_det");
function zt(f) {
  var n;
  try {
    (n = document == null ? void 0 : document.body) == null || n.append(f);
  } catch {
  }
}
let te = (f, n, p) => new ImageData(f, n, p);
function ut(...f) {
  st && console.log(...f);
}
function ki(...f) {
  st && console.log(f.map((n) => `%c${n}`).join(""), ...f.map((n) => `color: ${n}`));
}
let st = !0, he, ue, Kt, vt, Ft = 960, St = 48, jt = [Number.NaN, Number.NaN], pe, wt = (f, n, p) => {
};
async function hn(f) {
  var n, p;
  return mt = f.ort, st = !!f.dev, st || (pt.l = () => {
  }, ht.l = () => {
  }), f.detPath && (he = await mt.InferenceSession.create(f.detPath, f.ortOption)), f.recPath && (ue = await mt.InferenceSession.create(f.recPath, f.ortOption)), f.layoutPath && (Kt = await mt.InferenceSession.create(f.layoutPath, f.ortOption)), vt = ((n = f.dic) == null ? void 0 : n.split(/\r\n|\r|\n/)) || [], vt.at(-1) === "" ? vt[vt.length - 1] = " " : vt.push(" "), pe = ((p = f.layoutDic) == null ? void 0 : p.split(/\r\n|\r|\n/)) || [], f.maxSide && (Ft = f.maxSide), f.imgh && (St = f.imgh), f.imgw && f.imgw, f.detShape && (jt = f.detShape), f.canvas && Oi(f.canvas), f.imageData && (te = f.imageData), f.cv ? D = f.cv : typeof require < "u" && (D = require("opencv.js")), f.onProgress && (wt = f.onProgress), { ocr: Hi, det: me, rec: Pe };
}
async function ce(f) {
  let n;
  if (typeof window > "u") {
    const p = f;
    if (!p.data || !p.width || !p.height) throw new Error("invalid image data");
    return p;
  }
  if (typeof f == "string" ? (n = new Image(), n.src = f, await new Promise((p) => {
    n.onload = p;
  })) : (f instanceof ImageData, n = f), n instanceof HTMLImageElement) {
    const m = qt(n.width, n.height).getContext("2d");
    if (!m) throw new Error("canvas context is null");
    m.drawImage(n, 0, 0), n = m.getImageData(0, 0, n.width, n.height);
  }
  if (n instanceof HTMLCanvasElement) {
    const p = n.getContext("2d");
    if (!p) throw new Error("canvas context is null");
    n = p.getImageData(0, 0, n.width, n.height);
  }
  return n;
}
async function Hi(f) {
  pt.l("");
  const n = await ce(f);
  Kt && await Ei(n, mt, Kt, pe);
  const p = await me(n), m = await Pe(p);
  if (st)
    for (const c of p)
      an(c.box, "hi", `rgb(${c.style.bg.join(",")})`, `rgb(${c.style.text.join(",")})`);
  const P = ln(m);
  return ut(m, P), pt.l("end"), { src: m, ...P };
}
async function me(f) {
  let n = await ce(f), p = n.height, m = n.width;
  const P = 0.6, c = p, v = m;
  if (c < v * P || v < c * P) {
    c < v * P && (p = Math.floor(v * P)), v < c * P && (m = Math.floor(c * P));
    const M = qt(m, p).getContext("2d");
    if (!M) throw new Error("canvas context is null");
    M.putImageData(n, 0, 0), n = M.getImageData(0, 0, m, p);
  }
  wt("det", 1, 0), pt.l("pre_det");
  const { transposedData: h, image: y } = Ji(n, jt[0], jt[1]);
  pt.l("det");
  const _ = await Ui(h, y, he);
  pt.l("aft_det");
  const X = Vi(_.data, _.dims[3], _.dims[2], n);
  return wt("det", 1, 1), X;
}
async function Pe(f) {
  const n = [];
  pt.l("bf_rec");
  const p = sn(f);
  let m = 0;
  wt("rec", p.length, m);
  const P = [];
  for (const c of p) {
    const { b: v, imgH: h, imgW: y } = c, _ = await Gi(v, h, y, ue);
    m++, wt("rec", p.length, m), P.push(...on(_, vt));
  }
  P.reverse(), pt.l("rec_end");
  for (const c in P) {
    const v = f[P.length - Number(c) - 1].box;
    n[c] = {
      mean: P[c].mean,
      text: P[c].text,
      box: v,
      style: f[P.length - Number(c) - 1].style
    };
  }
  return n.filter((c) => c.mean >= 0.5);
}
async function Ui(f, n, p) {
  const m = Float32Array.from(f.flat(3)), P = new mt.Tensor("float32", m, [1, 3, n.height, n.width]), c = {};
  return c[p.inputNames[0]] = P, (await p.run(c))[p.outputNames[0]];
}
async function Gi(f, n, p, m) {
  const P = Float32Array.from(f.flat(3)), c = new mt.Tensor("float32", P, [1, 3, n, p]), v = {};
  return v[m.inputNames[0]] = c, (await m.run(v))[m.outputNames[0]];
}
function Ji(f, n, p) {
  let m = 1;
  const P = f.height, c = f.width;
  Math.max(P, c) > Ft && (P > c ? m = Ft / P : m = Ft / c);
  let v = n || P * m, h = p || c * m;
  if (st) {
    const _ = Wt(f);
    zt(_);
  }
  v = Math.max(Math.round(v / 32) * 32, 32), h = Math.max(Math.round(h / 32) * 32, 32), f = Qt(f, h, v);
  const y = $t(f, [0.485, 0.456, 0.406], [0.229, 0.224, 0.225]);
  if (ut(f), st) {
    const _ = Wt(f);
    zt(_);
  }
  return { transposedData: y, image: f };
}
function Vi(f, n, p, m) {
  ht.l("");
  const P = new Uint8ClampedArray(n * p * 4);
  for (let _ = 0; _ < f.length; _++) {
    const X = _ * 4, w = f[_] > 0.3 ? 255 : 0;
    P[X] = P[X + 1] = P[X + 2] = w, P[X + 3] = 255;
  }
  ht.l("edge");
  const c = [];
  let v = de(te(P, n, p));
  D.cvtColor(v, v, D.COLOR_RGBA2GRAY, 0);
  let h = new D.MatVector(), y = new D.Mat();
  D.findContours(v, h, y, D.RETR_LIST, D.CHAIN_APPROX_SIMPLE);
  for (let _ = 0; _ < h.size(); _++) {
    ht.l("get_box");
    const X = 3, w = h.get(_), { points: M, sside: S } = re(w);
    if (S < X) continue;
    const g = Ki(M), x = new D.matFromArray(g.length / 2, 1, D.CV_32SC2, g), I = re(x), L = I.points;
    if (I.sside < X + 2)
      continue;
    const O = m.width / n, b = m.height / p;
    for (let U = 0; U < L.length; U++)
      L[U][0] *= O, L[U][1] *= b;
    ht.l("order");
    const E = Qi(L);
    for (const U of E)
      U[0] = Ct(Math.round(U[0]), 0, m.width), U[1] = Ct(Math.round(U[1]), 0, m.height);
    const W = It(xt(E[0], E[1])), G = It(xt(E[0], E[3]));
    if (W <= 3 || G <= 3) continue;
    ht.l("crop");
    const q = $i(m, L);
    ht.l("match best");
    const { bg: H, text: z } = tn(q), k = nn(L, q, z);
    c.push({ box: k, img: q, style: { bg: H, text: z } });
  }
  return ht.l("e"), ut(c), v.delete(), h.delete(), y.delete(), v = h = y = null, c;
}
function Zi(f) {
  let n = -1;
  const p = f.length;
  let m, P = f[p - 1], c = 0;
  for (; ++n < p; )
    m = P, P = f[n], c += m[1] * P[0] - m[0] * P[1];
  return c / 2;
}
function zi(f) {
  let n = -1;
  const p = f.length;
  let m = f[p - 1], P, c, v = m[0], h = m[1], y = 0;
  for (; ++n < p; )
    P = v, c = h, m = f[n], v = m[0], h = m[1], P -= v, c -= h, y += Math.hypot(P, c);
  return y;
}
function Ki(f) {
  const p = Math.abs(Zi(f)), m = zi(f), P = p * 1.5 / m, c = [];
  for (const _ of f) {
    const X = {
      X: 0,
      Y: 0
    };
    X.X = _[0], X.Y = _[1], c.push(X);
  }
  const v = new Vt.ClipperOffset();
  v.AddPath(c, Vt.JoinType.jtRound, Vt.EndType.etClosedPolygon);
  const h = [];
  v.Execute(h, P);
  const y = [];
  for (const _ of h[0] || [])
    y.push([_.X, _.Y]);
  return y.flat();
}
function ji(f, n, p) {
  const m = n.width, P = n.height, c = p * Math.PI / 180, v = Math.cos(c), h = Math.sin(c), y = f.x, _ = f.y, X = m * 0.5, w = P * 0.5, M = [], S = y - X * v + w * h, g = _ - X * h - w * v;
  M.push([S, g]);
  const x = y + X * v + w * h, I = _ + X * h - w * v;
  M.push([x, I]);
  const L = y + X * v - w * h, O = _ + X * h + w * v;
  M.push([L, O]);
  const b = y - X * v - w * h, E = _ - X * h + w * v;
  return M.push([b, E]), M;
}
function re(f) {
  const n = D.minAreaRect(f), p = Array.from(ji(n.center, n.size, n.angle)).sort(
    (_, X) => _[0] - X[0]
  );
  let m = 0, P = 1, c = 2, v = 3;
  p[1][1] > p[0][1] ? (m = 0, v = 1) : (m = 1, v = 0), p[3][1] > p[2][1] ? (P = 2, c = 3) : (P = 3, c = 2);
  const h = [p[m], p[P], p[c], p[v]], y = Math.min(n.size.height, n.size.width);
  return { points: h, sside: y };
}
function se(f) {
  return f.flat();
}
function xt(f, n) {
  return Math.sqrt((f[0] - n[0]) ** 2 + (f[1] - n[1]) ** 2);
}
function Qi(f) {
  const n = [
    [0, 0],
    [0, 0],
    [0, 0],
    [0, 0]
  ], p = f.map((c) => c[0] + c[1]);
  n[0] = f[p.indexOf(Math.min(...p))], n[2] = f[p.indexOf(Math.max(...p))];
  const m = f.filter((c) => c !== n[0] && c !== n[2]), P = m[1].map((c, v) => c - m[0][v]);
  return n[1] = m[P.indexOf(Math.min(...P))], n[3] = m[P.indexOf(Math.max(...P))], n;
}
function $i(f, n) {
  const p = It(Math.max(xt(n[0], n[1]), xt(n[2], n[3]))), m = It(Math.max(xt(n[0], n[3]), xt(n[1], n[2]))), P = [
    [0, 0],
    [p, 0],
    [p, m],
    [0, m]
  ], c = D.matFromArray(4, 1, D.CV_32FC2, se(n)), v = D.matFromArray(4, 1, D.CV_32FC2, se(P)), h = D.getPerspectiveTransform(c, v), y = de(f), _ = new D.Mat(), X = new D.Size(p, m);
  D.warpPerspective(y, _, h, X, D.INTER_CUBIC, D.BORDER_REPLICATE, new D.Scalar());
  const w = _.matSize[0], M = _.matSize[1];
  let S;
  if (w / M >= 1.5) {
    S = new D.Mat();
    const x = new D.Size(_.rows, _.cols), I = new D.Point(_.cols / 2, _.cols / 2), L = D.getRotationMatrix2D(I, 90, 1);
    D.warpAffine(_, S, L, x, D.INTER_CUBIC, D.BORDER_REPLICATE, new D.Scalar());
  }
  const g = rn(S || _);
  return y.delete(), _.delete(), c.delete(), v.delete(), g;
}
function tn(f) {
  var y, _;
  const n = /* @__PURE__ */ new Map(), p = f.data;
  for (let X = 0; X < p.length; X += 4) {
    if (X / 4 % f.width > f.height * 4) continue;
    const M = p[X], S = p[X + 1], g = p[X + 2], x = [M, S, g].join(",");
    n.set(x, (n.get(x) || 0) + 1);
  }
  const m = en(n, 20).map((X) => ({
    el: X.el.split(",").map(Number),
    count: X.count
  })), P = ((y = m.at(0)) == null ? void 0 : y.el) || [255, 255, 255], c = ((_ = m.at(1)) == null ? void 0 : _.el) || [0, 0, 0];
  let v = c;
  const h = 100;
  if (Rt(c, P) < h) {
    const X = m.slice(1).filter((w) => Rt(w.el, P) > 50);
    X.length > 0 && (v = [0, 1, 2].map(
      (w) => Math.round(ye(X.map((M) => [M.el[w], M.count])))
    )), (X.length === 0 || Rt(v, P) < h) && (v = P.map((w) => 255 - w)), ki(`rgb(${v.join(",")})`);
  }
  return {
    bg: P,
    text: v,
    textEdge: c
  };
}
function Rt(f, n) {
  const p = f, m = n;
  return Math.sqrt((p[0] - m[0]) ** 2 + (p[1] - m[1]) ** 2 + (p[2] - m[2]) ** 2);
}
function en(f, n = 1) {
  let p = [];
  return f.forEach((m, P) => {
    p.length === 0 ? p.push({ el: P, count: m }) : (p.length < n ? p.push({ el: P, count: m }) : p.find((c) => c.count <= m) && p.push({ el: P, count: m }), p.sort((c, v) => v.count - c.count), p.length > n && (p = p.slice(0, n)));
  }), p;
}
function nn(f, n, p) {
  let m = 0, P = n.height, c = 0, v = n.width;
  function h(S) {
    return Rt(S, p) < 200;
  }
  t: for (let S = m; S < n.height; S++)
    for (let g = 0; g < n.width; g++) {
      const x = bt(n, g, S);
      if (h(x)) {
        m = S;
        break t;
      }
    }
  t: for (let S = P - 1; S >= 0; S--)
    for (let g = 0; g < n.width; g++) {
      const x = bt(n, g, S);
      if (h(x)) {
        P = S;
        break t;
      }
    }
  t: for (let S = c; S < n.width; S++)
    for (let g = m; g <= P; g++) {
      const x = bt(n, S, g);
      if (h(x)) {
        c = S;
        break t;
      }
    }
  t: for (let S = v - 1; S >= 0; S--)
    for (let g = m; g <= P; g++) {
      const x = bt(n, S, g);
      if (h(x)) {
        v = S;
        break t;
      }
    }
  const y = Ct(m - 1, 0, 4), _ = Ct(n.height - P - 1, 0, 4), X = Ct(c - 1, 0, 4), w = Ct(n.width - v - 1, 0, 4);
  return [
    [f[0][0] + X, f[0][1] + y],
    [f[1][0] - w, f[1][1] + y],
    [f[2][0] + X, f[2][1] - _],
    [f[3][0] - w, f[3][1] - _]
  ];
}
function bt(f, n, p) {
  const m = (p * f.width + n) * 4;
  return Array.from(f.data.slice(m, m + 4));
}
function de(f) {
  return D.matFromImageData(f);
}
function rn(f) {
  const n = new D.Mat(), p = f.type() % 8, m = p <= D.CV_8S ? 1 : p <= D.CV_32S ? 1 / 256 : 255, P = p === D.CV_8S || p === D.CV_16S ? 128 : 0;
  switch (f.convertTo(n, D.CV_8U, m, P), n.type()) {
    case D.CV_8UC1:
      D.cvtColor(n, n, D.COLOR_GRAY2RGBA);
      break;
    case D.CV_8UC3:
      D.cvtColor(n, n, D.COLOR_RGB2RGBA);
      break;
    case D.CV_8UC4:
      break;
    default:
      throw new Error("Bad number of channels (Source image must have 1, 3 or 4 channels)");
  }
  const c = te(new Uint8ClampedArray(n.data), n.cols, n.rows);
  return n.delete(), c;
}
function sn(f) {
  const n = [];
  function p(m) {
    const P = Math.floor(St * (m.width / m.height)), c = Qt(m, P, St);
    return st && zt(Wt(c, P, St)), { data: c, w: P, h: St };
  }
  for (const m of f) {
    const P = p(m.img);
    n.push({ b: $t(P.data, [0.5, 0.5, 0.5], [0.5, 0.5, 0.5]), imgH: P.h, imgW: P.w });
  }
  return ut(n), n;
}
function on(f, n) {
  const p = f.dims[2], m = [];
  let P = f.dims[0] - 1;
  function c(h) {
    return n.at(h - 1) ?? "";
  }
  for (let h = 0; h < f.data.length; h += p * f.dims[1]) {
    const y = [], _ = [];
    for (let X = h; X < h + p * f.dims[1]; X += p) {
      const w = f.data.slice(X, X + p);
      let M = Number.NEGATIVE_INFINITY, S = -1, g = Number.NEGATIVE_INFINITY, x = -1;
      for (let I = 0; I < w.length; I++) {
        const L = w[I];
        L > M ? (g = M, M = L, S = I) : L > g && L < M && (g = L, x = I);
      }
      S === 0 && c(x) === " " && g > 1e-3 && (M = g, S = x), _.push(M), y.push(S);
    }
    m[P] = v(y, _), P--;
  }
  function v(h, y) {
    const _ = [], X = [];
    for (let S = 0; S < h.length; S++)
      h[S] !== 0 && (S > 0 && h[S - 1] === h[S] || (_.push(c(h[S])), X.push(y[S])));
    let w = "", M = 0;
    if (_.length) {
      w = _.join("").trim();
      let S = 0;
      for (const g of X)
        S += g;
      M = S / X.length;
    }
    return { text: w, mean: M };
  }
  return m;
}
function ln(f) {
  var g;
  ut(f);
  const n = structuredClone(f).sort((x, I) => x.box[0][1] - I.box[0][1]), p = [];
  for (const x of n) {
    const I = (g = p.at(-1)) == null ? void 0 : g.at(-1);
    if (!I) {
      p.push([x]);
      continue;
    }
    const L = (x.box[2][1] + x.box[0][1]) / 2, O = (I.box[2][1] + I.box[0][1]) / 2;
    if (Math.abs(L - O) < 0.5 * (x.box[3][1] - x.box[0][1])) {
      const b = p.at(-1);
      b ? b.push(x) : p.push([x]);
    } else
      p.push([x]);
  }
  const m = [];
  for (const x of p) {
    if (x.length === 1) {
      m.push(x.at(0));
      continue;
    }
    const I = Zt(x.map((O) => O.box[3][1] - O.box[0][1]));
    x.sort((O, b) => O.box[0][0] - b.box[0][0]);
    let L = x.at(0);
    for (const O of x.slice(1)) {
      const b = L.box[1][0] ?? Number.NEGATIVE_INFINITY;
      O.box[0][0] - b > I ? (m.push(L), L = O) : (L.text += O.text, L.mean = (L.mean + O.mean) / 2, L.box = h([L.box, O.box]));
    }
    m.push(L);
  }
  const P = [], c = m.reduce((x, I) => Math.max(x, Math.max((I == null ? void 0 : I.box[2][1]) ?? 0, (I == null ? void 0 : I.box[3][1]) ?? 0)), 0);
  for (let x = 0; x <= c; x++)
    for (const I in m) {
      const L = m[I];
      if (L) {
        if (L.box[0][1] > x) break;
        L.box[0][1] <= x && x <= L.box[3][1] && (y(L), m[I] = null);
      }
    }
  function v(x, I) {
    return Math.sqrt((x[0] - I[0]) ** 2 + (x[1] - I[1]) ** 2);
  }
  function h(x) {
    const [I, L, O, b] = structuredClone(x[0]);
    for (const E of x)
      I[0] = Math.min(I[0], E[0][0]), I[1] = Math.min(I[1], E[0][1]), L[0] = Math.max(L[0], E[1][0]), L[1] = Math.min(L[1], E[1][1]), O[0] = Math.max(O[0], E[2][0]), O[1] = Math.max(O[1], E[2][1]), b[0] = Math.min(b[0], E[3][0]), b[1] = Math.max(b[1], E[3][1]);
    return [I, L, O, b];
  }
  function y(x) {
    let I = null, L = Number.POSITIVE_INFINITY;
    for (const q in P) {
      const H = P[q].at(-1);
      if (!H) continue;
      const z = v(x.box[0], H.box[0]);
      z < L && (I = Number(q), L = z);
    }
    if (I === null) {
      P.push([x]);
      return;
    }
    const O = P[I].at(-1), b = x.box[1][0] - x.box[0][0], E = O.box[1][0] - O.box[0][0], W = Math.min(b, E), G = x.box[3][1] - x.box[0][1];
    if (
      // 左右至少有一边是相近的，中心距离要相近
      // 特别是处理在长行后分栏的情况
      !(Math.abs(x.box[0][0] - O.box[0][0]) < G || Math.abs(x.box[1][0] - O.box[1][0]) < G || Math.abs((x.box[1][0] + x.box[0][0]) / 2 - (O.box[1][0] + O.box[0][0]) / 2) < W * 0.4)
    ) {
      const q = b < E ? x : O, H = b < E ? O : x, z = Math.max(b, E), k = H.box[0][0] + z / 2, U = H.box[1][0] - z / 2;
      if (k < q.box[0][0] || U > q.box[1][0]) {
        P.push([x]);
        return;
      }
    }
    P[I].push(x);
  }
  const _ = [];
  for (const [x, I] of P.entries()) {
    const L = h(I.map((G) => G.box)), O = (L[0][0] + L[1][0]) / 2, b = L[1][0] - L[0][0];
    if (x === 0) {
      _.push([{ src: I, outerBox: L, x: O, w: b }]);
      continue;
    }
    const E = _.at(-1);
    let W = !1;
    for (const G of E) {
      const q = Math.min(G.w, b);
      if (Math.abs(G.x - O) < q * 0.4) {
        E.push({ src: I, outerBox: L, x: O, w: b }), W = !0;
        break;
      }
    }
    W || _.push([{ src: I, outerBox: L, x: O, w: b }]);
  }
  _.sort((x, I) => Zt(x.map((L) => L.x)) - Zt(I.map((L) => L.x)));
  for (const x of _)
    x.sort((I, L) => I.outerBox[0][1] - L.outerBox[0][1]);
  const X = _.flat();
  if (st) {
    const x = [];
    for (let I = 0; I < 360; I += Math.floor(360 / X.length))
      x.push(`hsl(${I}, 100%, 50%)`);
    for (const I in X)
      for (const L of X[I].src)
        oe(L.box, L.text, x[I]);
  }
  const w = X.map((x) => {
    const I = x.src, L = {};
    for (let E = 1; E < I.length; E++) {
      const W = I[E - 1].box, q = I[E].box[0][1] - W[2][1];
      L[q] || (L[q] = 0), L[q]++;
    }
    ut(L);
    let O = 0;
    if (Object.keys(L).length >= 2) {
      let E = Math.max(...Object.values(L)), W = 0, G = 0;
      Object.values(L).filter((H) => H === E) && E++;
      const q = Object.keys(L).map(Number).sort((H, z) => H - z).filter((H) => L[H] !== E);
      for (let H = 1; H < q.length; H++) {
        const z = Math.abs((L[q[H]] - L[q[H - 1]]) / (q[H] - q[H - 1]));
        z >= G && (W = q[H], G = z);
      }
      O = Math.max(W, (q.at(0) + q.at(-1)) / 2);
    } else
      O = Number(Object.keys(L)[0] || 0);
    ut(O);
    const b = [[I[0]]];
    for (let E = 1; E < I.length; E++) {
      const W = I[E - 1].box;
      if (I[E].box[0][1] - W[2][1] >= O)
        b.push([I[E]]);
      else {
        const H = b.at(-1);
        H ? H.push(I[E]) : b.push([I[E]]);
      }
    }
    return ut(b), { src: I, outerBox: x.outerBox, parragraphs: b.map((E) => ({ src: E, parse: S(E) })) };
  });
  if (st) {
    const x = [];
    for (let I = 10; I < 360; I += Math.floor(360 / w.length))
      x.push(`hsl(${I}, 100%, 50%)`);
    for (const I in w)
      for (const L of w[I].parragraphs)
        oe(L.parse.box, L.parse.text, x[I]);
  }
  const M = w.flatMap((x) => x.parragraphs.map((I) => I.parse));
  function S(x) {
    var b, E;
    const I = new RegExp("\\p{Ideographic}", "u"), L = /[。，！？；：“”‘’《》、【】（）…—]/, O = {
      box: h(x.map((W) => W.box)),
      text: "",
      mean: ye(x.map((W) => [W.mean, W.text.length])),
      style: x[0].style
    };
    for (const W of x) {
      const G = O.text.at(-1);
      G && (!G.match(I) && !G.match(L) || !((b = W.text.at(0)) != null && b.match(I)) && !((E = W.text.at(0)) != null && E.match(L))) && (O.text += " "), O.text += W.text;
    }
    return O;
  }
  return {
    columns: w,
    parragraphs: M
  };
}
function Zt(f) {
  return f.reduce((n, p) => n + p, 0) / f.length;
}
function ye(f) {
  const n = f.map((m) => m[1]).reduce((m, P) => m + P, 0);
  let p = 0;
  for (const m of f)
    p += m[0] * m[1] / n;
  return p;
}
function oe(f, n = "", p = "red") {
  if (!st) return;
  const P = document.querySelector("canvas").getContext("2d");
  P.beginPath(), P.strokeStyle = p, P.rect(f[0][0], f[0][1], f[2][0] - f[0][0], f[2][1] - f[0][1]), P.stroke(), P.strokeStyle = "black", P.strokeText(n, f[0][0], f[0][1]);
}
function an(f, n = "", p = "white", m = "red") {
  if (!st) return;
  const c = document.querySelector("canvas").getContext("2d");
  c.beginPath(), c.strokeStyle = "black", c.fillStyle = p, c.rect(f[0][0], f[0][1], 16, 16), c.fill(), c.stroke(), c.fillStyle = m, c.fillRect(f[0][0], f[0][1], 6, 6);
}
export {
  me as det,
  hn as init,
  Hi as ocr,
  Pe as rec
};
