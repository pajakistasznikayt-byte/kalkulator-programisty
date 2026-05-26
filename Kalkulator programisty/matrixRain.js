// Ustawienia kanwy i kontekst rysowania
const CANVAS = document.getElementById('matrix-rain');
const CTX = CANVAS.getContext('2d');

CANVAS.width = window.innerWidth;
CANVAS.height = window.innerHeight;

// Parametry efektu deszczu Matrix: znaki, rozmiar czcionki i liczba kolumn
const SYMBOLS = '01';
const FONT_SIZE = 14;
const COLUMNS = CANVAS.width / FONT_SIZE;
const DROPS = [];

// Inicjalizacja tablicy kropel dla każdej kolumny
for (let i = 0; i < COLUMNS; i++) {
    DROPS[i] = 1;
}

// Funkcja rysująca jedną klatkę animacji
function draw() {
    // Rysuj półprzezroczyste tło, żeby stare znaki się rozmywały
    CTX.fillStyle = 'rgba(0, 0, 0, 0.05)';
    CTX.fillRect(0, 0, CANVAS.width, CANVAS.height);

    CTX.fillStyle = '#0F0';
    CTX.font = `${FONT_SIZE}px monospace`;

    // Dla każdej kolumny losuj znak i rysuj go w aktualnej pozycji
    for (let i = 0; i < DROPS.length; i++) {
        const TEXT = SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

        CTX.fillText(TEXT, i * FONT_SIZE, DROPS[i] * FONT_SIZE);

        // Resetuj kroplę, gdy osiągnie dół ekranu z małym prawdopodobieństwem
        if (DROPS[i] * FONT_SIZE > CANVAS.height && Math.random() > 0.975) {
            DROPS[i] = 0;
        }

        // Przesuń kroplę o jeden wiersz w dół
        DROPS[i]++;
    }
}

// Uruchom animację w pętli co ~33 ms (ok. 30 klatek na sekundę)
setInterval(draw, 33);