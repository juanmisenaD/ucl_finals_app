import { loadAllFinals } from './dataLoader.js';
import { filterFinals } from './filters.js';

let allFinals = [];

const grid = document.getElementById('finalsGrid');
const searchInput = document.getElementById('searchInput');
const eraFilter = document.getElementById('eraFilter');
const modal = document.getElementById('detailModal');
const modalBody = document.getElementById('modalBody');
const closeModal = document.getElementById('closeModal');

function render(data) {
  grid.innerHTML = '';
  data.forEach(item => {
    const score = `${item.scoreWinner} - ${item.scoreRunnerUp}`;
    const card = document.createElement('div');
    card.className = 'card';
    card.onclick = () => openModal(item);

    card.innerHTML = `
      <div class="card-header">
        <span>Temp. ${item.season}</span>
        <span class="badge">${item.era === 'copa-europa' ? 'Copa Europa' : 'UCL'}</span>
      </div>
      <div class="teams">${item.winner} vs ${item.runnerUp}</div>
      <div class="score">${score}</div>
      <div class="card-footer">
        📍 ${item.stadium}, ${item.city}<br>
        📅 ${item.date}
      </div>
    `;
    grid.appendChild(card);
  });
}

// Función auxiliar para renderizar listas de jugadores
function renderTeamLineup(teamName, lineupData) {
  if (!lineupData) return '<p>Alineaciones no disponibles</p>';

  const formation = lineupData.formation === '' ? '4-4-2' : lineupData.formation;
  const playersList = lineupData.startingEleven
    .map(player => `<li><img src="https://flagcdn.com/w20/${player.pais}.png" alt="${player.pais}"> ${player.nombre}</li>`)
    .join('');

  return `
    <div class="lineup-column">
      <h3>D.T: <img src="https://flagcdn.com/w20/${lineupData.coach.pais}.png" alt="${lineupData.coach.pais}"> <span style="color: #fff;">${lineupData.coach.nombre}</span></h3>
      <h4>${teamName} <span>(${formation})</span></h4>
      <ul>${playersList}</ul>
    </div>
  `;
}

function openModal(item) {
  const information = item.nota ? item.nota : '';
  const score = `${item.scoreWinner} - ${item.scoreRunnerUp}`;
  // Inyección dentro del HTML del Modal
  const lineupsHTML = `
    <section class="lineups-section">
      <h3>Alineaciones Titulares</h3>
      <div class="lineups-grid">
        ${renderTeamLineup(item.winner, item.lineUps.lineWinner)}
        ${renderTeamLineup(item.runnerUp, item.lineUps.lineRunnerUp)}
      </div>
    </section>
  `;
  modalBody.innerHTML = `
    <h2>${item.winner} vs ${item.runnerUp} (${item.season})</h2>
    <p style="color: #00d4ff; font-weight: bold; margin: 10px 0;">Resultado: ${score}</p>
    <hr style="border-color: #1e293b; margin-bottom: 15px;">
    <p><strong>Fecha y Hora:</strong> ${item.date} (${item.time})</p>
    <p><strong>Estadio:</strong> ${item.stadium} (${item.city}, ${item.country})</p>
    <p><strong>Asistencia:</strong> ${item.attendance} espectadores</p>
    <p><strong>Árbitro:</strong> ${item.referee}</p>
    <br>
    ${lineupsHTML}
    <br>
    <p><strong>Detalle de Goles:</strong></p>
    <p style="color: #94a3b8; font-size: 0.9rem;">${item.goals}</p>
    <span class="date-info">${information}</span>
  `;
  modal.style.display = 'flex';
}

closeModal.onclick = () => modal.style.display = 'none';
window.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };

function handleFilter() {
  const filtered = filterFinals(allFinals, searchInput.value, eraFilter.value);
  render(filtered);
}

async function init() {
  allFinals = await loadAllFinals();
  render(allFinals);

  searchInput.addEventListener('input', handleFilter);
  eraFilter.addEventListener('change', handleFilter);
}

init();