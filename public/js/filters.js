export function filterFinals(finals, query, era) {
  const searchTerm = query.toLowerCase().trim();

  return finals.filter(item => {
    // Si no hay término de búsqueda, pasa directo
    if (!searchTerm) {
      const matchesEra = era === 'all' || item.era === era;
      return matchesEra;
    }

    // 1. Coincidencias en datos generales y entrenadores
    const matchesGeneral = 
      item.winner?.toLowerCase().includes(searchTerm) ||
      item.runnerUp?.toLowerCase().includes(searchTerm) ||
      item.stadium?.toLowerCase().includes(searchTerm) ||
      item.city?.toLowerCase().includes(searchTerm) ||
      item.lineUps?.lineWinner?.coach?.nombre?.toLowerCase().includes(searchTerm) ||
      item.lineUps?.lineRunnerUp?.coach?.nombre?.toLowerCase().includes(searchTerm);

    // 2. Coincidencia en jugadores del Campeón
    const matchesWinnerPlayers = item.lineUps?.lineWinner?.startingEleven?.some(player => 
      player.nombre?.toLowerCase().includes(searchTerm) ||
      player.pais?.toLowerCase().includes(searchTerm)
    );

    // 3. Coincidencia en jugadores del Subcampeón
    const matchesRunnerUpPlayers = item.lineUps?.lineRunnerUp?.startingEleven?.some(player => 
      player.nombre?.toLowerCase().includes(searchTerm) ||
      player.pais?.toLowerCase().includes(searchTerm)
    );

    const matchesSearch = matchesGeneral || matchesWinnerPlayers || matchesRunnerUpPlayers;
    const matchesEra = era === 'all' || item.era === era;

    return matchesSearch && matchesEra;
  });
}

// Procesa las finales y genera una tabla ordenada de equipos
export function generateDetailedStats(finals) {
  const statsMap = {};

  finals.forEach(item => {
    const winner = item.winner;
    const runnerUp = item.runnerUp;

    // Registrar o actualizar Campeón
    if (winner && winner !== 'TBD') {
      if (!statsMap[winner]) {
        statsMap[winner] = { team: winner, titles: 0, finals: 0, runnersUp: 0 };
      }
      statsMap[winner].titles += 1;
      statsMap[winner].finals += 1;
    }

    // Registrar o actualizar Subcampeón
    if (runnerUp && runnerUp !== 'TBD') {
      if (!statsMap[runnerUp]) {
        statsMap[runnerUp] = { team: runnerUp, titles: 0, finals: 0, runnersUp: 0 };
      }
      statsMap[runnerUp].runnersUp += 1;
      statsMap[runnerUp].finals += 1;
    }
  });

  // Convertir a Array y calcular porcentaje de efectividad
  const statsArray = Object.values(statsMap).map(teamData => {
    const winPercentage = ((teamData.titles / teamData.finals) * 100).toFixed(1);
    return {
      ...teamData,
      winPercentage: parseFloat(winPercentage)
    };
  });

  // Ordenar de MAYOR a MENOR:
  // 1º Por Títulos desc. | 2º Por Finales desc. | 3º Por Efectividad desc.
  return statsArray.sort((a, b) => {
    if (b.titles !== a.titles) return b.titles - a.titles;
    if (b.finals !== a.finals) return b.finals - a.finals;
    return b.winPercentage - a.winPercentage;
  });
}