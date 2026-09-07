/* affitto-netto-fakedoor — calcolo puro + wiring pagina.
 * Formule da docs/research/cycle25-affitto-oracoli.md (O1–O5, scaglioni 23/33/43 L.199/2025).
 * STIMA dichiarata, non consulenza fiscale. Nessun pagamento reale: CTA PDF = TEST.
 * Uso test: node tests/run.js
 */
'use strict';

function marginale(reddito, P) {
  const r = Math.max(0, Number(reddito) || 0);
  const sc = P.irpef_2026.scaglioni;
  if (r <= sc[0].fino_a) return sc[0].aliquota;
  if (r <= sc[1].fino_a) return sc[1].aliquota;
  return sc[2].aliquota;
}

function aliqCedolare(tipo, nBrevi, P) {
  const n = Math.max(1, Math.floor(Number(nBrevi) || 1));
  if (tipo === 'concordato') return P.cedolare.concordato;
  if (tipo === 'brevi') return n >= 2 ? P.cedolare.brevi_secondo : P.cedolare.brevi_primo;
  return P.cedolare.libero;
}

function calcPure(L, tipo, reddito, nBrevi, P) {
  const canone = Math.max(0, Number(L) || 0);
  const marg = marginale(reddito, P);
  const aliq = aliqCedolare(tipo, nBrevi, P);
  const cedolare = round2(canone * aliq);
  const imponibile = round2(canone * (1 - P.irpef_2026.abbattimento_locazioni_abitative));
  const irpef = round2(imponibile * marg);
  const risparmio = round2(irpef - cedolare);
  const verdetto = cedolare <= irpef ? 'cedolare' : 'irpef';
  return { canone, tipo, aliqCed: aliq, cedolare, marginale: marg, imponibile, irpef, risparmio, verdetto,
           acconto: acconto(cedolare, P) };
}

function acconto(cedolare, P) {
  const A = P.acconto;
  if (cedolare <= A.nessun_acconto_sotto) return { dovuto: false, totale: 0, rate: [] };
  const totale = round2(cedolare);
  if (totale > A.due_rate_sopra) {
    return { dovuto: true, totale,
             rate: [
               { quota: '40%', importo: round2(totale * A.rata1_quota), entro: '30/06', codice: A.codici_f24.rata1_40 },
               { quota: '60%', importo: round2(totale * A.rata2_quota), entro: '30/11', codice: A.codici_f24.rata2_o_unica }
             ] };
  }
  return { dovuto: true, totale,
           rate: [{ quota: '100%', importo: totale, entro: '30/11', codice: A.codici_f24.rata2_o_unica }] };
}

function round2(x) { return Math.round((x + Number.EPSILON) * 100) / 100; }

function eur(x) {
  return x.toLocaleString('it-IT', { style: 'currency', currency: 'EUR', maximumFractionDigits: 2 });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { calcPure, marginale, aliqCedolare, acconto, eur };
}

if (typeof window !== 'undefined') {
  window.AffittoNetto = { calcPure, marginale, aliqCedolare, eur };
}
