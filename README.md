# Deutsch Trainer (A1 → C1)
Modulárny tréner nemčiny s lekciami a slovnou zásobou. Pripravené pre GitHub Pages.

## Ako nasadiť
1. Nahrajte celý obsah priečinka na GitHub do vetvy `main`.
2. Zapnite **GitHub Pages** (Settings → Pages → Branch: `main` → `/ (root)`).
3. Otvorte `https://<vaše_meno>.github.io/<repo>/`.

## Štruktúra
- `index.html` – hlavná stránka (SPA)
- `assets/css/styles.css`, `assets/js/app.js`
- `modules/lessons/` – JSON lekcií (A1, C1 ukážky)
- `modules/vocab/` – JSON balíčky slovíčok (ukážky)

## Rozšírenie na 10 000 slov
- Pridávajte JSON súbory do `modules/vocab/` s rovnakým formátom:
```json
{
  "id": "A1_food2",
  "level": "A1",
  "topic": "Jedlo 2",
  "words": [{"de": "der Käse", "sk": "syr"}]
}
```
- Následne doplňte položku do zoznamu v `assets/js/app.js` (funkcia `listVocabModules`).

## Poznámka
Táto verzia obsahuje *ukážkové balíčky* a *lekcie* (A1-01, A1-02… A1-05 šablóny, C1-01). Aplikácia vie načítavať neobmedzený počet modulov, takže 10 000+ slov je otázka doplnenia JSON súborov.
