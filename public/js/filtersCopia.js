export function filterFinals(finals, query, era) {
  const searchTerm = query.toLowerCase().trim();

  return finals.filter(item => {
    const matchesSearch = 
      item.winner.toLowerCase().includes(searchTerm) ||
      item.runnerUp.toLowerCase().includes(searchTerm) ||
      item.stadium.toLowerCase().includes(searchTerm) ||
      item.city.toLowerCase().includes(searchTerm) ||
      item.lineUps.lineWinner.coach.nombre.toLowerCase().includes(searchTerm) ||
      item.lineUps.lineRunnerUp.coach.nombre.toLowerCase().includes(searchTerm);

    const matchesEra = era === 'all' || item.era === era;

    return matchesSearch && matchesEra;
  });
}