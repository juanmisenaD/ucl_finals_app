export async function loadAllFinals() {
  const files = [
    '/static/data/finals-1950s-1970s.json',
    '/static/data/finals-1980s-1990s.json',
    '/static/data/finals-2000s-2010s.json',
    '/static/data/finals-2020s-present.json'
  ];

  try {
    const responses = await Promise.all(files.map(file => fetch(file)));
    const dataSets = await Promise.all(responses.map(res => res.json()));
    return dataSets.flat();
  } catch (error) {
    console.error("Error al cargar las finales:", error);
    return [];
  }
}