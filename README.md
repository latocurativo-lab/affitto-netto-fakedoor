# affitto-netto-fakedoor (TEST — nessun pagamento reale)

Fake-door onesta per misurare interesse sul calcolatore cedolare vs IRPEF 2026.
**TEST dichiarato in pagina**: il pulsante PDF registra solo interesse anonimo locale.

- Live: https://latocurativo-lab.github.io/affitto-netto-fakedoor/ (dopo deploy Cycle 26)
- Formule: `params-2026.json` (cedolare 21/10/26%, IRPEF 23/33/43 L.199/2025, F24 1840/1841/1842)
- Test: `node tests/run.js` (6 casi-oracolo AdE da `docs/research/cycle25-affitto-oracoli.md`)
- Misura: `metriche.html` (localStorage, sintetici vietati) + report in `docs/operations/cycle26-*`
- Soglia GO build: conv ≥1,5% su 500+ usi reali; T+28 <2.500 visite → KILL
