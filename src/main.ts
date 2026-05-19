// Crea una matriz de asientos con 0 (libres) segun filas y columnas.
function createSeatMatrix(rows: number = 8, cols: number = 10): number[][] {
  const seats: number[][] = [];

  for (let row = 0; row < rows; row++) {
    const currentRow: number[] = [];

    for (let col = 0; col < cols; col++) {
      currentRow.push(0);
    }

    seats.push(currentRow);
  }

  return seats;
}

// Cuenta asientos para la interfaz web sin imprimir mensajes en consola.
function countSeatsSilent(seats: number[][]): number[] {
  if (seats.length === 0 || seats[0].length === 0) {
    return [0, 0];
  }

  let occupied = 0;
  let available = 0;

  for (let row = 0; row < seats.length; row++) {
    for (let col = 0; col < seats[row].length; col++) {
      if (seats[row][col] === 1) {
        occupied++;
      } else {
        available++;
      }
    }
  }

  return [occupied, available];
}

// Busca contiguos para la interfaz web sin imprimir mensajes en consola.
function findContiguousSeatsSilent(seats: number[][]): number[] {
  if (seats.length === 0 || seats[0].length === 0) {
    return [];
  }

  for (let row = 0; row < seats.length; row++) {
    for (let col = 0; col < seats[row].length - 1; col++) {
      if (seats[row][col] === 0 && seats[row][col + 1] === 0) {
        return [row + 1, col + 1, col + 2];
      }
    }
  }

  return [];
}

// Dibuja la grilla visual de asientos usando la matriz number[][].
function renderSeatMap(seats: number[][]): void {
  const seatMapContainer = document.querySelector<HTMLDivElement>("#seat-map");

  if (!seatMapContainer) {
    return;
  }

  if (seats.length === 0 || seats[0].length === 0) {
    seatMapContainer.innerHTML =
      '<p class="ui-error">No se puede dibujar el mapa: sala vacia o invalida.</p>';
    return;
  }

  const cols = seats[0].length;

  let html = '<div class="seat-grid">';

  for (let row = 0; row < seats.length; row++) {
    if (seats[row].length !== cols) {
      seatMapContainer.innerHTML =
        '<p class="text-sm text-rose-600">No se puede dibujar el mapa: filas con distinto tamano.</p>';
      return;
    }

    for (let col = 0; col < seats[row].length; col++) {
      const seatValue = seats[row][col];
      const isAvailable = seatValue === 0;
      const seatLabel = `F${row + 1}-C${col + 1}`;

      const baseClass = "seat-button";
      const stateClass = isAvailable
        ? "seat-available"
        : "seat-occupied";
      const stateText = isAvailable ? "L" : "X";

      html += `<button type="button" class="${baseClass} ${stateClass}" aria-label="${seatLabel}" data-row="${row + 1}" data-col="${col + 1}">${stateText}</button>`;
    }
  }

  html += "</div>";
  seatMapContainer.innerHTML = html;
}

// Muestra un resumen web con ocupados, disponibles y asientos contiguos.
function renderSeatSummary(seats: number[][]): void {
  const seatSummaryContainer = document.querySelector<HTMLDivElement>("#seat-summary");

  if (!seatSummaryContainer) {
    return;
  }

  const totals = countSeatsSilent(seats);
  const contiguous = findContiguousSeatsSilent(seats);

  let contiguousMessage = "No hay dos asientos libres contiguos.";
  let contiguousCardMessage = "No encontrados";

  if (contiguous.length === 3) {
    contiguousMessage = `Si hay asientos contiguos: fila ${contiguous[0]}, columnas ${contiguous[1]} y ${contiguous[2]}.`;
    contiguousCardMessage = `Fila ${contiguous[0]}, columnas ${contiguous[1]} y ${contiguous[2]}`;
  }

  seatSummaryContainer.innerHTML = `
    <div class="summary-grid">
      <div class="summary-card summary-card-occupied">
        <p class="summary-label">Ocupados</p>
        <p class="summary-value">${totals[0]}</p>
      </div>
      <div class="summary-card summary-card-available">
        <p class="summary-label">Disponibles</p>
        <p class="summary-value">${totals[1]}</p>
      </div>
      <div class="summary-card summary-card-contiguous">
        <p class="summary-label">Contiguos</p>
        <p class="summary-value summary-value-small">${contiguousCardMessage}</p>
      </div>
    </div>
    <p class="summary-detail">${contiguousMessage}</p>
  `;
}

// Muestra en un panel la lista completa de asientos con fila, columna y estado.
function renderSeatHistory(seats: number[][]): void {
  const seatHistoryContainer = document.querySelector<HTMLDivElement>("#seat-history");

  if (!seatHistoryContainer) {
    return;
  }

  if (seats.length === 0 || seats[0].length === 0) {
    seatHistoryContainer.innerHTML =
      '<p class="ui-error">No hay historial para mostrar: sala vacia o invalida.</p>';
    return;
  }

  const cols = seats[0].length;
  let historyHtml = '<ul class="history-list">';

  for (let row = 0; row < seats.length; row++) {
    for (let col = 0; col < cols; col++) {
      const seatValue = seats[row][col];
      const isAvailable = seatValue === 0;
      const stateText = isAvailable ? "Disponible (L)" : "Ocupado (X)";
      const stateClass = isAvailable ? "seat-state-available" : "seat-state-occupied";

      historyHtml += `<li class="history-item">Fila ${row + 1}, Columna ${col + 1} - <span class="${stateClass}">${stateText}</span></li>`;
    }
  }

  historyHtml += "</ul>";
  seatHistoryContainer.innerHTML = historyHtml;
}

// Construye la interfaz web inicial y conecta la interaccion del mapa.
function renderWebIntro(): void {
  const app = document.querySelector<HTMLDivElement>("#app");

  if (!app) {
    return;
  }

  app.innerHTML = `
    <section class="cinema-shell">
      <h1 class="cinema-title">Cinema Seat Manager</h1>
      <p class="cinema-subtitle">
        Vista inicial del reto web. Debajo puedes ver el mapa visual de asientos de una sala 8x10.
      </p>
      <div class="cinema-panel">
        <div id="seat-summary" class="seat-summary"></div>
        <div class="seat-legend">
          <span class="legend-item"><span class="legend-dot legend-dot-available"></span>Disponible (L)</span>
          <span class="legend-item"><span class="legend-dot legend-dot-occupied"></span>Ocupado (X)</span>
        </div>
        <p id="web-message" class="status-message">Haz clic en un asiento disponible para reservarlo.</p>
        <div id="seat-map"></div>
        <details class="history-panel">
          <summary class="history-summary">Historial de asientos</summary>
          <div id="seat-history" class="history-container"></div>
        </details>
      </div>
    </section>
  `;

  const webSeats = createSeatMatrix(8, 10);
  webSeats[0][1] = 1;
  webSeats[0][2] = 1;
  webSeats[2][4] = 1;
  webSeats[5][7] = 1;
  webSeats[7][9] = 1;

  renderSeatMap(webSeats);
  renderSeatSummary(webSeats);
  renderSeatHistory(webSeats);

  const seatMapContainer = document.querySelector<HTMLDivElement>("#seat-map");
  const webMessage = document.querySelector<HTMLParagraphElement>("#web-message");

  if (!seatMapContainer) {
    return;
  }

  seatMapContainer.addEventListener("click", (event) => {
    const target = event.target;

    if (!(target instanceof HTMLButtonElement)) {
      return;
    }

    const rowText = target.dataset.row;
    const colText = target.dataset.col;

    if (!rowText || !colText) {
      return;
    }

    const row = Number(rowText);
    const col = Number(colText);
    const wasReserved = reserveSeat(webSeats, row, col);

    if (webMessage) {
      if (wasReserved) {
        webMessage.textContent = `Reserva confirmada: fila ${row}, columna ${col}.`;
        webMessage.className = "status-message status-success";
      } else {
        webMessage.textContent = `No se pudo reservar: fila ${row}, columna ${col}.`;
        webMessage.className = "status-message status-error";
      }
    }

    renderSeatMap(webSeats);
    renderSeatSummary(webSeats);
    renderSeatHistory(webSeats);
  });
}

if (typeof document !== "undefined") {
  import("./style.css").then(() => {
    renderWebIntro();
  });
}

// Imprime la matriz en consola con etiquetas de filas y columnas.
function printSeatMatrix(seats: number[][]): void {
  if (seats.length === 0 || seats[0].length === 0) {
    console.log("Sala vacia o invalida.");
    return;
  }

  const cols = seats[0].length;

  for (let row = 0; row < seats.length; row++) {
    if (seats[row].length !== cols || seats[row].length === 0) {
      console.log("Sala invalida: todas las filas deben tener la misma cantidad de columnas.");
      return;
    }

    for (let col = 0; col < seats[row].length; col++) {
      if (seats[row][col] !== 0 && seats[row][col] !== 1) {
        console.log("Sala invalida: los asientos solo pueden tener valores 0 o 1.");
        return;
      }
    }
  }
  let header = "      ";

  for (let col = 1; col <= cols; col++) {
    header += `${col.toString().padStart(2, " ")} `;
  }

  console.log("Leyenda: L = libre, X = ocupado");
  console.log(header);

  for (let row = 0; row < seats.length; row++) {
    let rowLabel = `Fila ${String(row + 1).padStart(2, " ")} `;

    for (let col = 0; col < seats[row].length; col++) {
      if (seats[row][col] === 0) {
        rowLabel += " L ";
      } else {
        rowLabel += " X ";
      }
    }

    console.log(rowLabel);
  }
}

// Intenta reservar un asiento usando coordenadas humanas (desde 1).
function reserveSeat(seats: number[][], row: number, col: number): boolean {
  if (seats.length === 0 || seats[0].length === 0) {
    console.log("Error: la sala esta vacia o es invalida.");
    return false;
  }

  const cols = seats[0].length;

  for (let currentRow = 0; currentRow < seats.length; currentRow++) {
    if (seats[currentRow].length !== cols || seats[currentRow].length === 0) {
      console.log("Error: la sala es invalida (filas con distinta cantidad de columnas).");
      return false;
    }

    for (let currentCol = 0; currentCol < seats[currentRow].length; currentCol++) {
      if (seats[currentRow][currentCol] !== 0 && seats[currentRow][currentCol] !== 1) {
        console.log("Error: la sala es invalida (solo se permiten valores 0 o 1).");
        return false;
      }
    }
  }

  if (!Number.isInteger(row) || !Number.isInteger(col)) {
    console.log("Error: fila y columna deben ser numeros enteros.");
    return false;
  }

  const rowIndex = row - 1;
  const colIndex = col - 1;

  if (
    rowIndex < 0 ||
    colIndex < 0 ||
    rowIndex >= seats.length ||
    colIndex >= cols
  ) {
    console.log(`Error: la posicion (${row}, ${col}) no existe en la sala.`);
    return false;
  }

  if (seats[rowIndex][colIndex] === 0) {
    seats[rowIndex][colIndex] = 1;
    console.log(`Reserva confirmada para fila ${row}, columna ${col}.`);
    return true;
  }

  console.log(`No se puede reservar fila ${row}, columna ${col}: asiento ocupado.`);
  return false;
}

// Cuenta asientos ocupados y disponibles en toda la matriz.
function countSeats(seats: number[][]): number[] {
  if (seats.length === 0 || seats[0].length === 0) {
    console.log("Sala vacia o invalida.");
    return [0, 0];
  }

  const cols = seats[0].length;

  for (let row = 0; row < seats.length; row++) {
    if (seats[row].length !== cols || seats[row].length === 0) {
      console.log("Sala invalida: todas las filas deben tener la misma cantidad de columnas.");
      return [0, 0];
    }

    for (let col = 0; col < seats[row].length; col++) {
      if (seats[row][col] !== 0 && seats[row][col] !== 1) {
        console.log("Sala invalida: los asientos solo pueden tener valores 0 o 1.");
        return [0, 0];
      }
    }
  }

  let occupied = 0;
  let available = 0;

  for (let row = 0; row < seats.length; row++) {
    for (let col = 0; col < seats[row].length; col++) {
      if (seats[row][col] === 1) {
        occupied++;
      } else {
        available++;
      }
    }
  }

  console.log(`Resumen de asientos -> Ocupados: ${occupied}, Disponibles: ${available}`);
  return [occupied, available];
}

// Busca el primer par de asientos libres contiguos en horizontal.
function findContiguousSeats(seats: number[][]): number[] {
  if (seats.length === 0 || seats[0].length === 0) {
    console.log("Sala vacia o invalida.");
    return [];
  }

  const cols = seats[0].length;

  for (let row = 0; row < seats.length; row++) {
    if (seats[row].length !== cols || seats[row].length === 0) {
      console.log("Sala invalida: todas las filas deben tener la misma cantidad de columnas.");
      return [];
    }

    for (let col = 0; col < seats[row].length; col++) {
      if (seats[row][col] !== 0 && seats[row][col] !== 1) {
        console.log("Sala invalida: los asientos solo pueden tener valores 0 o 1.");
        return [];
      }
    }
  }

  for (let row = 0; row < seats.length; row++) {
    for (let col = 0; col < seats[row].length - 1; col++) {
      if (seats[row][col] === 0 && seats[row][col + 1] === 0) {
        const result = [row + 1, col + 1, col + 2];
        console.log(
          `Asientos contiguos encontrados en fila ${result[0]}, columnas ${result[1]} y ${result[2]}.`
        );
        return result;
      }
    }
  }

  console.log("No hay dos asientos contiguos disponibles.");
  return [];
}

function main(): void {
  console.log("===== CINEMA SEAT MANAGER =====\n");

  console.log("Escenario 1: Crear sala 8x10 y mostrar estado inicial");
  const seats = createSeatMatrix();
  printSeatMatrix(seats);
  countSeats(seats);
  console.log("");

  console.log("Escenario 2: Reservar varios asientos validos");
  const reservations: number[][] = [
    [1, 1],
    [1, 2],
    [3, 5],
    [8, 10]
  ];

  for (let i = 0; i < reservations.length; i++) {
    reserveSeat(seats, reservations[i][0], reservations[i][1]);
  }

  printSeatMatrix(seats);
  countSeats(seats);
  console.log("");

  console.log("Escenario 3: Intentar reservar un asiento ya ocupado");
  reserveSeat(seats, 1, 1);
  console.log("");

  console.log("Escenario 4: Intentar reservar posiciones fuera de rango");
  reserveSeat(seats, 9, 1);
  reserveSeat(seats, 2, 11);
  reserveSeat(seats, 0, 4);
  console.log("");

  console.log("Escenario 5: Buscar dos asientos contiguos disponibles");
  findContiguousSeats(seats);
  console.log("");

  console.log("Escenario 6: Sala casi llena sin asientos contiguos libres");
  const almostFull = createSeatMatrix(8, 10);

  for (let row = 0; row < almostFull.length; row++) {
    for (let col = 0; col < almostFull[row].length; col++) {
      almostFull[row][col] = 1;
    }
  }

  const freeSingleSeats: number[][] = [
    [1, 1],
    [1, 3],
    [2, 5],
    [3, 7],
    [4, 2],
    [5, 9],
    [6, 4],
    [7, 8],
    [8, 10]
  ];

  for (let i = 0; i < freeSingleSeats.length; i++) {
    const rowIndex = freeSingleSeats[i][0] - 1;
    const colIndex = freeSingleSeats[i][1] - 1;
    almostFull[rowIndex][colIndex] = 0;
  }

  printSeatMatrix(almostFull);
  countSeats(almostFull);
  findContiguousSeats(almostFull);
}

main();

export {
  createSeatMatrix,
  printSeatMatrix,
  reserveSeat,
  countSeats,
  findContiguousSeats
};
