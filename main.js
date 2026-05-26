// ==================== KONWERSJA LICZB ====================
// Konfiguracja systemów liczbowych: bin, oct, dec, hex
const basesConfig = [
    { id: 'bin', name: 'BIN', base: 2, example: '11111111' },
    { id: 'oct', name: 'OCT', base: 8, example: '377' },
    { id: 'dec', name: 'DEC', base: 10, example: '255' },
    { id: 'hex', name: 'HEX', base: 16, example: 'FF' }
];

// Aktualna wartość jako BigInt dla konwersji
let currentBigInt = BigInt(255);

// Funkcja tworząca pola wejściowe dla konwersji liczb
function createConversionFields() {
    const container = document.getElementById('conversions-container');
    basesConfig.forEach(config => {
        const div = document.createElement('div');
        div.className = 'base-group';
        div.innerHTML = `
            <span class="base-label">${config.name} (${config.base})</span>
            <input type="text" id="conv-${config.id}" value="${config.example}" data-base="${config.base}">
        `;
        container.appendChild(div);

        const input = div.querySelector('input');
        input.addEventListener('input', () => {
            liveConvert(input);
        });
    });
}

// Funkcja obsługująca żywą konwersję po wprowadzeniu wartości w polu
function liveConvert(sourceInput) {
    const base = parseInt(sourceInput.dataset.base);
    let value = null;

    const str = sourceInput.value.trim().toUpperCase();
    if (str === '') {
        currentBigInt = BigInt(0);
        updateAllConversionFields();
        return;
    }

    try {
        // Parsowanie wartości w zależności od systemu liczbowego
        if (base === 10) value = BigInt(str);
        else if (base === 2) value = BigInt('0b' + str);
        else if (base === 8) value = BigInt('0o' + str);
        else if (base === 16) value = BigInt('0x' + str);

        if (value !== null) {
            currentBigInt = value;
            updateAllConversionFields(sourceInput);
        }
    } catch (e) {
        // Niepoprawna wartość – tylko flash czerwony
        sourceInput.style.borderColor = '#ff4444';
        setTimeout(() => {
            sourceInput.style.borderColor = 'var(--green)';
        }, 800);
    }
}

// Funkcja aktualizująca wszystkie pola konwersji na podstawie currentBigInt
function updateAllConversionFields(excludeInput = null) {
    basesConfig.forEach(config => {
        const input = document.getElementById(`conv-${config.id}`);
        if (!input || input === excludeInput) return;

        let formatted = currentBigInt.toString(config.base);
        if (config.base === 16) formatted = formatted.toUpperCase();
        input.value = formatted;
    });
}

// ==================== OPERACJE BITOWE ====================
// Główna funkcja wykonująca operację bitową na podstawie wybranych operandów i operacji
window.performBitwiseOperation = function () {
    const opAEl = document.getElementById('opA');
    const opBEl = document.getElementById('opB');
    const baseA = parseInt(document.getElementById('baseA').value);
    const baseB = parseInt(document.getElementById('baseB').value);
    const op = document.getElementById('operation').value;

    let a = null;
    let b = null;

    // Parsowanie operandu A
    const aStr = opAEl.value.trim().toUpperCase();
    try {
        if (baseA === 10) a = BigInt(aStr);
        else if (baseA === 2) a = BigInt('0b' + aStr);
        else if (baseA === 8) a = BigInt('0o' + aStr);
        else if (baseA === 16) a = BigInt('0x' + aStr);
    } catch (e) {}

    // Parsowanie operandu B (jeśli nie NOT, które wymaga tylko A)
    if (op !== 'NOT') {
        const bStr = opBEl.value.trim().toUpperCase();
        try {
            if (baseB === 10) b = BigInt(bStr);
            else if (baseB === 2) b = BigInt('0b' + bStr);
            else if (baseB === 8) b = BigInt('0o' + bStr);
            else if (baseB === 16) b = BigInt('0x' + bStr);
        } catch (e) {}
    }

    // Sprawdzenie poprawności operandów
    if (a === null || (op !== 'NOT' && b === null)) {
        document.getElementById('result-displays').innerHTML = `<div class="error">BŁĄD: Niepoprawna liczba w operandzie!</div>`;
        return;
    }

    // Wykonanie wybranej operacji bitowej
    let result;
    switch (op) {
        case 'AND': result = a & b; break;
        case 'OR': result = a | b; break;
        case 'XOR': result = a ^ b; break;
        case 'NOT': result = ~a; break;
        case 'SHL': result = BigInt(Number(a) << Number(b)); break; // Przesunięcie w lewo: konwertuj na Number, przesuń, potem BigInt
        case 'SHR': result = BigInt(Number(a) >> Number(b)); break; // Przesunięcie w prawo: konwertuj na Number, przesuń, potem BigInt
        default: result = a;
    }

    // Wyświetlenie wyniku we wszystkich systemach liczbowych
    let html = '';
    basesConfig.forEach(config => {
        let val = result.toString(config.base);
        if (config.base === 16) val = val.toUpperCase();
        html += `
            <div class="result-line">
                <strong>${config.name}:</strong>
                <span>${val}</span>
            </div>`;
    });

    document.getElementById('result-displays').innerHTML = html;

    // Opcjonalnie synchronizacja z konwersjami
    currentBigInt = result;
    updateAllConversionFields();
};

// Funkcja czyszcząca wszystkie pola i wyniki
window.clearAll = function () {
    currentBigInt = BigInt(0);
    updateAllConversionFields();

    document.getElementById('opA').value = '0';
    document.getElementById('opB').value = '0';
    document.getElementById('result-displays').innerHTML = '<div style="color:#666;">Wynik pojawi się tutaj po wykonaniu operacji...</div>';
};

// ==================== INICJALIZACJA ====================
// Funkcja uruchamiana po załadowaniu strony
window.onload = function () {
    createConversionFields();
    // Demo start
    console.log('%cKalkulator Programisty', 'color:#00ff41; font-family:VT323; font-size:18px');
};