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

// Extrae la cantidad total de goles del string de marcador (ej. "5 - 0" o "1 - 1 (4 - 3 pen.)")
function extractGoalsFromScore(scoreStr) {
  if (!scoreStr) return 0;
  // Toma los números principales antes de cualquier paréntesis o aclaración
  const mainScore = scoreStr.split('(')[0];
  const numbers = mainScore.match(/\d+/g);
  
  if (numbers && numbers.length >= 2) {
    return parseInt(numbers[0], 10) + parseInt(numbers[1], 10);
  }
  return 0;
}

// Calcula y renderiza las estadísticas en el HTML
export function renderStats(finals) {
  if (!finals || finals.length === 0) return;

  const totalFinals = finals.length;
  let totalGoals = 0;
  const winnerCounts = {};

  finals.forEach(item => {
    // Sumar goles
    totalGoals += extractGoalsFromScore(item.score);

    // Contar títulos por equipo
    if (item.winner && item.winner !== 'TBD') {
      winnerCounts[item.winner] = (winnerCounts[item.winner] || 0) + 1;
    }
  });

  // Calcular promedio de goles
  const avgGoals = totalFinals > 0 ? (totalGoals / totalFinals).toFixed(2) : '0.00';

  // Encontrar al equipo con más títulos
  let topWinner = '-';
  let maxTitles = 0;
  for (const [team, titles] of Object.entries(winnerCounts)) {
    if (titles > maxTitles) {
      maxTitles = titles;
      topWinner = `${team} (${titles})`;
    }
  }

  // Inyectar valores en el DOM
  document.getElementById('statTotalFinals').textContent = totalFinals;
  document.getElementById('statTotalGoals').textContent = totalGoals;
  document.getElementById('statAvgGoals').textContent = avgGoals;
  document.getElementById('statTopWinner').textContent = topWinner;
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
  renderStats(allFinals);

  searchInput.addEventListener('input', handleFilter);
  eraFilter.addEventListener('change', handleFilter);
}

init();