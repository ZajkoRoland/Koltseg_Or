# 💵 KöltségŐr — Költségvetés Követő Alkalmazás

Teljes full-stack költségvetés követő alkalmazás React + Express + SQLite technológiákkal.

## Funkciók

- **Tranzakció kezelés**: Bevételek és kiadások hozzáadása, szerkesztése, törlése
- **Kategóriák**: 14 előre definiált kategória (bevétel + kiadás)
- **Valós idejű egyenleg**: Azonnali egyenleg, összbevétel és összkiadás megjelenítés
- **Interaktív grafikonok**:
  -  Oszlopdiagram: Havi bevétel vs. kiadás
  -  Kördiagram: Kiadások kategóriánkénti megoszlása
  -  Vonaldiagram: Egyenleg időbeli alakulása
- **Szűrők**: Típus, kategória és dátumtartomány szerinti szűrés
- **Demo adatok**: Az alkalmazás indulásakor automatikusan feltöltődik mintaadatokkal

## Tech Stack

| Réteg | Technológia |
|-------|-------------|
| Frontend | React 19 + Vite |
| Backend | Express.js 5 |
| Adatbázis | SQLite (better-sqlite3) |
| Grafikonok | Recharts |
| Stílus | Vanilla CSS (sötét téma, glassmorphism) |

## Telepítés és Futtatás (Tanári Értékeléshez)

A programhoz mellékelve van egy automata indítófájl, amivel a futtatás rendkívül egyszerű.

### Előfeltételek
- **Node.js** telepítése kötelező a számítógépre (letöltés: [nodejs.org](https://nodejs.org/)).

### Indítás
1. Csomagold ki a projekt mappáját.
2. Kattints duplán a mappában található **`Start.bat`** fájlra.
3. Ez automatikusan:
   - Letölti a szükséges függőségeket
   - Lefordítja az alkalmazást
   - Elindítja a szervert
   - **Automatikusan megnyitja az oldalt a böngészőben!**

> *Megjegyzés:* Az első indítás során a függőségek (node_modules) letöltése eltarthat 1-2 percig. Kérjük, ne zárd be a fekete terminál ablakot addig, amíg az oldal meg nem nyílik!

---

### Alternatív fejlesztői indítás (Parancssorból)

Ha parancssorból szeretnéd futtatni:

```bash
# 1. Függőségek telepítése
npm install

# 2. Alkalmazás indítása (backend + frontend egyszerre)
npm run dev
```

Az alkalmazás ebben a módban is elérhető lesz: **http://localhost:5173**

### Csak backend vagy frontend indítása

```bash
npm run dev:backend   # Csak Express szerver (port 3001)
npm run dev:frontend  # Csak Vite dev szerver (port 5173)
```

## 📁 Projekt Struktúra

```
├── server/                 # Backend
│   ├── index.js            # Express szerver
│   ├── database.js         # SQLite init + seed
│   └── routes/
│       ├── transactions.js # Tranzakció CRUD API
│       ├── categories.js   # Kategória API
│       └── stats.js        # Statisztika API
├── src/                    # Frontend
│   ├── App.jsx             # Fő alkalmazás
│   ├── App.css             # Globális stílusok
│   ├── main.jsx            # React belépési pont
│   ├── context/
│   │   └── BudgetContext.jsx  # Globális state
│   ├── components/
│   │   ├── Dashboard.jsx   # Összefoglaló kártyák
│   │   ├── TransactionForm.jsx # Tranzakció form (modal)
│   │   ├── TransactionList.jsx # Tranzakció lista
│   │   ├── Charts.jsx      # Grafikonok
│   │   └── Filters.jsx     # Szűrők
│   └── utils/
│       └── api.js          # API hívások
├── index.html
├── package.json
├── vite.config.js
└── README.md
```

## API Végpontok

| Metódus | Útvonal | Leírás |
|---------|---------|--------|
| GET | `/api/transactions` | Tranzakciók listázása (szűrőkkel) |
| POST | `/api/transactions` | Új tranzakció |
| PUT | `/api/transactions/:id` | Tranzakció módosítása |
| DELETE | `/api/transactions/:id` | Tranzakció törlése |
| GET | `/api/categories` | Kategóriák listázása |
| GET | `/api/stats/summary` | Összesítés |
| GET | `/api/stats/by-category` | Kategória statisztika |
| GET | `/api/stats/monthly` | Havi bontás |

## Tesztelés

### Tesztesetek leírása

#### 1. Tranzakció CRUD tesztek
- **Hozzáadás**: Új kiadás/bevétel létrehozása → ellenőrzés, hogy megjelenik a listában és az egyenleg frissül
- **Szerkesztés**: Létező tranzakció módosítása → összeg/kategória/dátum változás ellenőrzése
- **Törlés**: Tranzakció törlése → eltűnik a listából, egyenleg frissül

#### 2. Szűrési tesztek
- Típus szűrő: Csak bevételek / csak kiadások megjelenítése
- Kategória szűrő: Adott kategóriába tartozó tranzakciók
- Dátumtartomány: Adott időszak tranzakciói

#### 3. Grafikon tesztek
- Oszlopdiagram: Helyes havi adatok megjelenítése
- Kördiagram: Kiadási kategóriák helyes arányai
- Vonaldiagram: Egyenleg időbeli alakulásának pontossága

#### 4. Validációs tesztek
- Üres összeg → hibaüzenet
- Negatív összeg → hibaüzenet
- Hiányzó kategória → hibaüzenet
- Hiányzó dátum → hibaüzenet

### Manuális tesztelés

1. Indítsd el az alkalmazást a **`Start.bat`** fájllal (vagy `npm run dev` paranccsal).
2. A böngésző automatikusan megnyílik.
3. Próbáld ki:
   - Kattints az "Új Tranzakció" gombra
   - Adj hozzá egy bevételt és egy kiadást
   - Ellenőrizd, hogy az egyenleg kártyák frissülnek
   - Nézd meg a grafikonokat
   - Szerkessz egy tranzakciót (✏️ ikon)
   - Törölj egy tranzakciót (🗑️ ikon)
   - Használd a szűrőket

## Licensz

MIT
