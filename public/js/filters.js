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