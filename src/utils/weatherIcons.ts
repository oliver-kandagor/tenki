/** MVP weather-code → emoji map */
export function weatherCodeToEmoji(code?: number, condition?: string): string {
  const text = (condition ?? '').toLowerCase();

  if (text.includes('thunder')) return '⛈️';
  if (text.includes('snow')) return '❄️';
  if (text.includes('rain') || text.includes('drizzle')) return '🌧️';
  if (text.includes('fog') || text.includes('mist')) return '🌫️';
  if (text.includes('cloud') || text.includes('overcast')) return '☁️';
  if (text.includes('partly') || text.includes('few')) return '⛅';
  if (text.includes('clear') || text.includes('sunny')) return '☀️';

  if (code == null) return '🌤️';

  if (code === 0) return '☀️';
  if (code <= 3) return '⛅';
  if (code <= 48) return '🌫️';
  if (code <= 57) return '🌦️';
  if (code <= 67) return '🌧️';
  if (code <= 77) return '❄️';
  if (code <= 82) return '🌧️';
  if (code <= 86) return '❄️';
  if (code <= 99) return '⛈️';

  return '🌤️';
}
