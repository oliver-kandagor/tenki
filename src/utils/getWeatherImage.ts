export const getWeatherImage = (cond?: any, code?: number) => {
  const text = typeof cond === 'string' ? cond : (cond?.text ?? cond?.description ?? cond?.main ?? '');
  const c = text.toLowerCase();

  // Keyword mappings
  if (c.includes('thunder') || c.includes('storm')) return require("@/assets/images/thunder.png");
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) return require("@/assets/images/rain.png");
  if (c.includes('snow') || c.includes('sleet') || c.includes('ice') || c.includes('freezing')) return require("@/assets/images/cloud.png"); 
  if (c.includes('overcast')) return require("@/assets/images/cloudy.png");
  if (c.includes('sunny-cloud') || c.includes('partly cloudy')) return require("@/assets/images/sunny-cloud.png");
  if (c.includes('sun-cloud')) return require("@/assets/images/sun-cloud.png");
  if (c.includes('cloud')) return require("@/assets/images/cloudy.png");
  if (c.includes('clear') || c.includes('sun')) return require("@/assets/images/sun.png");

  // WMO Code mappings
  if (code != null) {
    if (code === 0) return require("@/assets/images/sun.png");
    if (code === 1) return require("@/assets/images/sunny-cloud.png");
    if (code === 2) return require("@/assets/images/sun-cloud.png");
    if (code === 3) return require("@/assets/images/cloudy.png");
    if (code <= 48) return require("@/assets/images/cloudy.png"); // fog, rime fog
    if (code <= 67) return require("@/assets/images/rain.png");   // drizzle/rain
    if (code <= 77) return require("@/assets/images/cloud.png");  // snow/grains
    if (code <= 82) return require("@/assets/images/rain.png");   // rain showers
    if (code <= 86) return require("@/assets/images/cloud.png");  // snow showers
    if (code <= 99) return require("@/assets/images/thunder.png"); // thunderstorm
  }

  return require("@/assets/images/sun-cloud.png");
};

