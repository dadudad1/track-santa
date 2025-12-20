/**
 * Santa's Journey Tracker Algorithm
 * 
 * Santa starts his journey from the North Pole and travels around the world
 * following the night (traveling west). He starts when it's midnight at the
 * International Date Line (UTC+12) on JOURNEY_START_DAY (Dec 24 in production).
 * 
 * Journey timeline (all times in UTC):
 * - JOURNEY_START_DAY, 12:00 UTC (midnight at UTC+12): Santa departs North Pole
 * - Next day, 12:00 UTC (midnight at UTC-12): Santa returns to North Pole
 * 
 * Total journey: 24 hours
 * 
 * NOTE: Change JOURNEY_START_DAY to 24 for production, or another day for testing.
 */

// Santa's route with major stops around the world
// Ordered from east to west (following the night)
const SANTA_ROUTE = [
  { city: "North Pole", country: "Arctic", lat: 90, lng: 0, region: "departure" },
  { city: "Petropavlovsk-Kamchatsky", country: "Russia", lat: 53.01, lng: 158.65, region: "Far East Russia" },
  { city: "Wellington", country: "New Zealand", lat: -41.29, lng: 174.78, region: "Oceania" },
  { city: "Auckland", country: "New Zealand", lat: -36.85, lng: 174.76, region: "Oceania" },
  { city: "Fiji", country: "Fiji", lat: -18.14, lng: 178.44, region: "Pacific Islands" },
  { city: "Sydney", country: "Australia", lat: -33.87, lng: 151.21, region: "Australia" },
  { city: "Melbourne", country: "Australia", lat: -37.81, lng: 144.96, region: "Australia" },
  { city: "Perth", country: "Australia", lat: -31.95, lng: 115.86, region: "Australia" },
  { city: "Tokyo", country: "Japan", lat: 35.68, lng: 139.69, region: "East Asia" },
  { city: "Osaka", country: "Japan", lat: 34.69, lng: 135.50, region: "East Asia" },
  { city: "Seoul", country: "South Korea", lat: 37.57, lng: 126.98, region: "East Asia" },
  { city: "Busan", country: "South Korea", lat: 35.18, lng: 129.08, region: "East Asia" },
  { city: "Beijing", country: "China", lat: 39.90, lng: 116.41, region: "East Asia" },
  { city: "Shanghai", country: "China", lat: 31.23, lng: 121.47, region: "East Asia" },
  { city: "Taipei", country: "Taiwan", lat: 25.03, lng: 121.57, region: "East Asia" },
  { city: "Ulaanbaatar", country: "Mongolia", lat: 47.92, lng: 106.92, region: "East Asia" },
  { city: "Hong Kong", country: "China", lat: 22.32, lng: 114.17, region: "East Asia" },
  { city: "Manila", country: "Philippines", lat: 14.60, lng: 120.98, region: "Southeast Asia" },
  { city: "Hanoi", country: "Vietnam", lat: 21.03, lng: 105.85, region: "Southeast Asia" },
  { city: "Singapore", country: "Singapore", lat: 1.35, lng: 103.82, region: "Southeast Asia" },
  { city: "Kuala Lumpur", country: "Malaysia", lat: 3.14, lng: 101.69, region: "Southeast Asia" },
  { city: "Bangkok", country: "Thailand", lat: 13.76, lng: 100.50, region: "Southeast Asia" },
  { city: "Phnom Penh", country: "Cambodia", lat: 11.56, lng: 104.92, region: "Southeast Asia" },
  { city: "Vientiane", country: "Laos", lat: 17.97, lng: 102.63, region: "Southeast Asia" },
  { city: "Naypyidaw", country: "Myanmar", lat: 19.75, lng: 96.13, region: "Southeast Asia" },
  { city: "Jakarta", country: "Indonesia", lat: -6.21, lng: 106.85, region: "Southeast Asia" },
  { city: "Mumbai", country: "India", lat: 19.08, lng: 72.88, region: "South Asia" },
  { city: "New Delhi", country: "India", lat: 28.61, lng: 77.21, region: "South Asia" },
  { city: "Kolkata", country: "India", lat: 22.57, lng: 88.36, region: "South Asia" },
  { city: "Dhaka", country: "Bangladesh", lat: 23.81, lng: 90.41, region: "South Asia" },
  { city: "Kathmandu", country: "Nepal", lat: 27.70, lng: 85.32, region: "South Asia" },
  { city: "Thimphu", country: "Bhutan", lat: 27.47, lng: 89.64, region: "South Asia" },
  { city: "Colombo", country: "Sri Lanka", lat: 6.93, lng: 79.85, region: "South Asia" },
  { city: "Islamabad", country: "Pakistan", lat: 33.68, lng: 73.05, region: "South Asia" },
  { city: "Dubai", country: "UAE", lat: 25.20, lng: 55.27, region: "Middle East" },
  { city: "Riyadh", country: "Saudi Arabia", lat: 24.69, lng: 46.72, region: "Middle East" },
  { city: "Tel Aviv", country: "Israel", lat: 32.08, lng: 34.78, region: "Middle East" },
  // Nordic & Baltic Europe
  { city: "Helsinki", country: "Finland", lat: 60.17, lng: 24.94, region: "Nordic Europe" },
  { city: "Tampere", country: "Finland", lat: 61.50, lng: 23.79, region: "Nordic Europe" },
  { city: "Tallinn", country: "Estonia", lat: 59.44, lng: 24.75, region: "Baltic Europe" },
  { city: "Tartu", country: "Estonia", lat: 58.38, lng: 26.72, region: "Baltic Europe" },
  { city: "Riga", country: "Latvia", lat: 56.95, lng: 24.11, region: "Baltic Europe" },
  { city: "Daugavpils", country: "Latvia", lat: 55.87, lng: 26.54, region: "Baltic Europe" },
  { city: "Vilnius", country: "Lithuania", lat: 54.69, lng: 25.28, region: "Baltic Europe" },
  { city: "Kaunas", country: "Lithuania", lat: 54.90, lng: 23.90, region: "Baltic Europe" },
  // Eastern Europe
  { city: "Moscow", country: "Russia", lat: 55.76, lng: 37.62, region: "Eastern Europe" },
  { city: "St. Petersburg", country: "Russia", lat: 59.93, lng: 30.34, region: "Eastern Europe" },
  { city: "Kyiv", country: "Ukraine", lat: 50.45, lng: 30.52, region: "Eastern Europe" },
  { city: "Lviv", country: "Ukraine", lat: 49.84, lng: 24.03, region: "Eastern Europe" },
  { city: "Warsaw", country: "Poland", lat: 52.23, lng: 21.01, region: "Eastern Europe" },
  { city: "Kraków", country: "Poland", lat: 50.06, lng: 19.94, region: "Eastern Europe" },
  { city: "Gdańsk", country: "Poland", lat: 54.35, lng: 18.65, region: "Eastern Europe" },
  { city: "Wrocław", country: "Poland", lat: 51.11, lng: 17.04, region: "Eastern Europe" },
  { city: "Bucharest", country: "Romania", lat: 44.43, lng: 26.10, region: "Eastern Europe" },
  { city: "Cluj-Napoca", country: "Romania", lat: 46.77, lng: 23.60, region: "Eastern Europe" },
  { city: "Timișoara", country: "Romania", lat: 45.76, lng: 21.23, region: "Eastern Europe" },
  { city: "Sofia", country: "Bulgaria", lat: 42.70, lng: 23.32, region: "Eastern Europe" },
  { city: "Plovdiv", country: "Bulgaria", lat: 42.15, lng: 24.75, region: "Eastern Europe" },
  { city: "Varna", country: "Bulgaria", lat: 43.21, lng: 27.91, region: "Eastern Europe" },
  // Southeast Europe
  { city: "Istanbul", country: "Turkey", lat: 41.01, lng: 28.98, region: "Southeast Europe" },
  { city: "Ankara", country: "Turkey", lat: 39.93, lng: 32.86, region: "Southeast Europe" },
  { city: "Athens", country: "Greece", lat: 37.98, lng: 23.73, region: "Southern Europe" },
  { city: "Thessaloniki", country: "Greece", lat: 40.64, lng: 22.94, region: "Southern Europe" },
  { city: "Nicosia", country: "Cyprus", lat: 35.19, lng: 33.38, region: "Southern Europe" },
  { city: "Limassol", country: "Cyprus", lat: 34.68, lng: 33.04, region: "Southern Europe" },
  { city: "Valletta", country: "Malta", lat: 35.90, lng: 14.51, region: "Southern Europe" },
  // Africa
  { city: "Cairo", country: "Egypt", lat: 30.04, lng: 31.24, region: "North Africa" },
  { city: "Johannesburg", country: "South Africa", lat: -26.20, lng: 28.04, region: "Southern Africa" },
  { city: "Cape Town", country: "South Africa", lat: -33.93, lng: 18.42, region: "Southern Africa" },
  { city: "Nairobi", country: "Kenya", lat: -1.29, lng: 36.82, region: "East Africa" },
  // Central Europe
  { city: "Budapest", country: "Hungary", lat: 47.50, lng: 19.04, region: "Central Europe" },
  { city: "Debrecen", country: "Hungary", lat: 47.53, lng: 21.63, region: "Central Europe" },
  { city: "Prague", country: "Czech Republic", lat: 50.08, lng: 14.42, region: "Central Europe" },
  { city: "Brno", country: "Czech Republic", lat: 49.20, lng: 16.61, region: "Central Europe" },
  { city: "Bratislava", country: "Slovakia", lat: 48.15, lng: 17.11, region: "Central Europe" },
  { city: "Košice", country: "Slovakia", lat: 48.72, lng: 21.26, region: "Central Europe" },
  { city: "Vienna", country: "Austria", lat: 48.21, lng: 16.37, region: "Central Europe" },
  { city: "Salzburg", country: "Austria", lat: 47.80, lng: 13.04, region: "Central Europe" },
  { city: "Graz", country: "Austria", lat: 47.07, lng: 15.44, region: "Central Europe" },
  { city: "Ljubljana", country: "Slovenia", lat: 46.05, lng: 14.51, region: "Central Europe" },
  { city: "Maribor", country: "Slovenia", lat: 46.56, lng: 15.65, region: "Central Europe" },
  { city: "Zagreb", country: "Croatia", lat: 45.81, lng: 15.98, region: "Central Europe" },
  { city: "Split", country: "Croatia", lat: 43.51, lng: 16.44, region: "Central Europe" },
  { city: "Dubrovnik", country: "Croatia", lat: 42.65, lng: 18.09, region: "Central Europe" },
  // Southern Europe - Italy
  { city: "Rome", country: "Italy", lat: 41.90, lng: 12.50, region: "Southern Europe" },
  { city: "Milan", country: "Italy", lat: 45.46, lng: 9.19, region: "Southern Europe" },
  { city: "Venice", country: "Italy", lat: 45.44, lng: 12.34, region: "Southern Europe" },
  { city: "Florence", country: "Italy", lat: 43.77, lng: 11.25, region: "Southern Europe" },
  { city: "Naples", country: "Italy", lat: 40.85, lng: 14.27, region: "Southern Europe" },
  // Central Europe - Germany
  { city: "Berlin", country: "Germany", lat: 52.52, lng: 13.41, region: "Central Europe" },
  { city: "Munich", country: "Germany", lat: 48.14, lng: 11.58, region: "Central Europe" },
  { city: "Hamburg", country: "Germany", lat: 53.55, lng: 9.99, region: "Central Europe" },
  { city: "Frankfurt", country: "Germany", lat: 50.11, lng: 8.68, region: "Central Europe" },
  { city: "Cologne", country: "Germany", lat: 50.94, lng: 6.96, region: "Central Europe" },
  // Nordic Europe - Scandinavia
  { city: "Copenhagen", country: "Denmark", lat: 55.68, lng: 12.57, region: "Nordic Europe" },
  { city: "Aarhus", country: "Denmark", lat: 56.16, lng: 10.20, region: "Nordic Europe" },
  { city: "Stockholm", country: "Sweden", lat: 59.33, lng: 18.07, region: "Nordic Europe" },
  { city: "Gothenburg", country: "Sweden", lat: 57.71, lng: 11.97, region: "Nordic Europe" },
  { city: "Malmö", country: "Sweden", lat: 55.61, lng: 13.00, region: "Nordic Europe" },
  { city: "Oslo", country: "Norway", lat: 59.91, lng: 10.75, region: "Nordic Europe" },
  { city: "Bergen", country: "Norway", lat: 60.39, lng: 5.32, region: "Nordic Europe" },
  { city: "Trondheim", country: "Norway", lat: 63.43, lng: 10.39, region: "Nordic Europe" },
  // Western Europe - Benelux
  { city: "Amsterdam", country: "Netherlands", lat: 52.37, lng: 4.90, region: "Western Europe" },
  { city: "Rotterdam", country: "Netherlands", lat: 51.92, lng: 4.48, region: "Western Europe" },
  { city: "The Hague", country: "Netherlands", lat: 52.08, lng: 4.30, region: "Western Europe" },
  { city: "Brussels", country: "Belgium", lat: 50.85, lng: 4.35, region: "Western Europe" },
  { city: "Antwerp", country: "Belgium", lat: 51.22, lng: 4.40, region: "Western Europe" },
  { city: "Ghent", country: "Belgium", lat: 51.05, lng: 3.72, region: "Western Europe" },
  { city: "Luxembourg City", country: "Luxembourg", lat: 49.61, lng: 6.13, region: "Western Europe" },
  // Western Europe - France
  { city: "Paris", country: "France", lat: 48.86, lng: 2.35, region: "Western Europe" },
  { city: "Lyon", country: "France", lat: 45.76, lng: 4.83, region: "Western Europe" },
  { city: "Marseille", country: "France", lat: 43.30, lng: 5.37, region: "Western Europe" },
  { city: "Nice", country: "France", lat: 43.71, lng: 7.26, region: "Western Europe" },
  { city: "Toulouse", country: "France", lat: 43.60, lng: 1.44, region: "Western Europe" },
  { city: "Bordeaux", country: "France", lat: 44.84, lng: -0.58, region: "Western Europe" },
  // Western Europe - Iberian Peninsula
  { city: "Barcelona", country: "Spain", lat: 41.39, lng: 2.17, region: "Western Europe" },
  { city: "Madrid", country: "Spain", lat: 40.42, lng: -3.70, region: "Western Europe" },
  { city: "Valencia", country: "Spain", lat: 39.47, lng: -0.38, region: "Western Europe" },
  { city: "Seville", country: "Spain", lat: 37.39, lng: -5.98, region: "Western Europe" },
  { city: "Bilbao", country: "Spain", lat: 43.26, lng: -2.93, region: "Western Europe" },
  { city: "Lisbon", country: "Portugal", lat: 38.72, lng: -9.14, region: "Western Europe" },
  { city: "Porto", country: "Portugal", lat: 41.16, lng: -8.63, region: "Western Europe" },
  // British Isles
  { city: "London", country: "United Kingdom", lat: 51.51, lng: -0.13, region: "Western Europe" },
  { city: "Manchester", country: "United Kingdom", lat: 53.48, lng: -2.24, region: "Western Europe" },
  { city: "Edinburgh", country: "United Kingdom", lat: 55.95, lng: -3.19, region: "Western Europe" },
  { city: "Birmingham", country: "United Kingdom", lat: 52.49, lng: -1.90, region: "Western Europe" },
  { city: "Dublin", country: "Ireland", lat: 53.35, lng: -6.26, region: "Western Europe" },
  { city: "Cork", country: "Ireland", lat: 51.90, lng: -8.47, region: "Western Europe" },
  { city: "Galway", country: "Ireland", lat: 53.27, lng: -9.06, region: "Western Europe" },
  // North Atlantic
  { city: "Reykjavik", country: "Iceland", lat: 64.15, lng: -21.94, region: "North Atlantic" },
  // South America
  { city: "São Paulo", country: "Brazil", lat: -23.55, lng: -46.63, region: "South America" },
  { city: "Rio de Janeiro", country: "Brazil", lat: -22.91, lng: -43.17, region: "South America" },
  { city: "Buenos Aires", country: "Argentina", lat: -34.60, lng: -58.38, region: "South America" },
  { city: "Santiago", country: "Chile", lat: -33.45, lng: -70.67, region: "South America" },
  { city: "Lima", country: "Peru", lat: -12.05, lng: -77.04, region: "South America" },
  { city: "Bogotá", country: "Colombia", lat: 4.71, lng: -74.07, region: "South America" },
  // North America
  { city: "Toronto", country: "Canada", lat: 43.65, lng: -79.38, region: "North America" },
  { city: "Montreal", country: "Canada", lat: 45.50, lng: -73.57, region: "North America" },
  { city: "New York", country: "USA", lat: 40.71, lng: -74.01, region: "North America" },
  { city: "Washington D.C.", country: "USA", lat: 38.91, lng: -77.04, region: "North America" },
  { city: "Miami", country: "USA", lat: 25.76, lng: -80.19, region: "North America" },
  { city: "Chicago", country: "USA", lat: 41.88, lng: -87.63, region: "North America" },
  { city: "Dallas", country: "USA", lat: 32.78, lng: -96.80, region: "North America" },
  { city: "Denver", country: "USA", lat: 39.74, lng: -104.99, region: "North America" },
  { city: "Phoenix", country: "USA", lat: 33.45, lng: -112.07, region: "North America" },
  { city: "Los Angeles", country: "USA", lat: 34.05, lng: -118.24, region: "North America" },
  { city: "San Francisco", country: "USA", lat: 37.77, lng: -122.42, region: "North America" },
  { city: "Seattle", country: "USA", lat: 47.61, lng: -122.33, region: "North America" },
  { city: "Vancouver", country: "Canada", lat: 49.28, lng: -123.12, region: "North America" },
  { city: "Anchorage", country: "USA", lat: 61.22, lng: -149.90, region: "North America" },
  { city: "Honolulu", country: "USA", lat: 21.31, lng: -157.86, region: "Pacific" },
  { city: "North Pole", country: "Arctic", lat: 90, lng: 0, region: "arrival" },
];

// Journey constants
const JOURNEY_START_DAY = 17; // Change to 24 for production (Dec 24)
const JOURNEY_START_HOUR_UTC = 12; // Dec 24, 12:00 UTC (midnight at UTC+12)
const JOURNEY_DURATION_HOURS = 24;

/**
 * Check if it's Santa's journey day anywhere in the world
 */
export function isChristmasEve(date = new Date()) {
  // Check if it's the journey day in any timezone (UTC-12 to UTC+14)
  const utcDate = date.getUTCDate();
  const utcMonth = date.getUTCMonth();
  const utcHours = date.getUTCHours();
  
  // It's the journey day somewhere if:
  // - UTC date is JOURNEY_START_DAY, OR
  // - UTC date is day before and time is >= 10:00 (it's journey day at UTC+14), OR
  // - UTC date is day after and time is < 12:00 (it's still journey day at UTC-12)
  if (utcMonth === 11) { // December
    if (utcDate === JOURNEY_START_DAY) return true;
    if (utcDate === JOURNEY_START_DAY - 1 && utcHours >= 10) return true;
    if (utcDate === JOURNEY_START_DAY + 1 && utcHours < 12) return true;
  }
  return false;
}

/**
 * Check if Santa's journey is currently active
 */
export function isJourneyActive(date = new Date()) {
  const utcMonth = date.getUTCMonth();
  const utcDate = date.getUTCDate();
  const utcHours = date.getUTCHours();
  
  if (utcMonth !== 11) return false; // Not December
  
  // Journey runs from JOURNEY_START_DAY 12:00 UTC to next day 12:00 UTC
  if (utcDate === JOURNEY_START_DAY && utcHours >= JOURNEY_START_HOUR_UTC) return true;
  if (utcDate === JOURNEY_START_DAY + 1 && utcHours < JOURNEY_START_HOUR_UTC) return true;
  
  return false;
}

/**
 * Get the progress of Santa's journey (0 to 1)
 */
export function getJourneyProgress(date = new Date()) {
  if (!isJourneyActive(date)) {
    // Check if before or after journey
    const utcMonth = date.getUTCMonth();
    const utcDate = date.getUTCDate();
    const utcHours = date.getUTCHours();
    
    if (utcMonth === 11 && utcDate === JOURNEY_START_DAY + 1 && utcHours >= JOURNEY_START_HOUR_UTC) {
      return 1; // Journey complete
    }
    return 0; // Journey not started
  }
  
  const utcDate = date.getUTCDate();
  const utcHours = date.getUTCHours();
  const utcMinutes = date.getUTCMinutes();
  const utcSeconds = date.getUTCSeconds();
  
  let hoursIntoJourney;
  if (utcDate === JOURNEY_START_DAY) {
    hoursIntoJourney = utcHours - JOURNEY_START_HOUR_UTC;
  } else {
    hoursIntoJourney = (24 - JOURNEY_START_HOUR_UTC) + utcHours;
  }
  
  const totalMinutes = hoursIntoJourney * 60 + utcMinutes + utcSeconds / 60;
  const totalJourneyMinutes = JOURNEY_DURATION_HOURS * 60;
  
  return Math.min(1, Math.max(0, totalMinutes / totalJourneyMinutes));
}

/**
 * Interpolate between two coordinates
 */
function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Get Santa's current location
 */
export function getSantaLocation(date = new Date()) {
  const progress = getJourneyProgress(date);
  const totalStops = SANTA_ROUTE.length - 1;
  
  // Calculate which segment Santa is on
  const exactPosition = progress * totalStops;
  const currentStopIndex = Math.min(Math.floor(exactPosition), totalStops - 1);
  const segmentProgress = exactPosition - currentStopIndex;
  
  const currentStop = SANTA_ROUTE[currentStopIndex];
  const nextStop = SANTA_ROUTE[Math.min(currentStopIndex + 1, totalStops)];
  
  // Interpolate position
  const lat = lerp(currentStop.lat, nextStop.lat, segmentProgress);
  const lng = lerp(currentStop.lng, nextStop.lng, segmentProgress);
  
  // Calculate presents delivered (approximately 2 billion children, distributed across journey)
  const totalPresents = 2_000_000_000;
  const presentsDelivered = Math.floor(progress * totalPresents);
  
  // Calculate cities visited
  const citiesVisited = currentStopIndex;
  
  return {
    lat,
    lng,
    currentCity: currentStop.city,
    currentCountry: currentStop.country,
    currentRegion: currentStop.region,
    nextCity: nextStop.city,
    nextCountry: nextStop.country,
    progress,
    presentsDelivered,
    citiesVisited,
    totalCities: totalStops - 1, // Exclude departure/arrival
    isMoving: segmentProgress > 0.01 && segmentProgress < 0.99,
    segmentProgress,
  };
}

/**
 * Get time until Santa's journey starts
 */
export function getTimeUntilJourney(date = new Date()) {
  const now = date.getTime();
  
  // Calculate the next journey start (JOURNEY_START_DAY 12:00 UTC)
  const year = date.getUTCFullYear();
  let journeyStart = Date.UTC(year, 11, JOURNEY_START_DAY, JOURNEY_START_HOUR_UTC, 0, 0);
  
  // If we're past this year's journey, calculate for next year
  if (now > journeyStart + JOURNEY_DURATION_HOURS * 60 * 60 * 1000) {
    journeyStart = Date.UTC(year + 1, 11, JOURNEY_START_DAY, JOURNEY_START_HOUR_UTC, 0, 0);
  }
  
  const diff = journeyStart - now;
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  
  return { days, hours, minutes, seconds, total: diff };
}

/**
 * Get all stops for the map
 */
export function getAllStops() {
  return SANTA_ROUTE;
}

/**
 * Format large numbers with commas
 */
export function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * Calculate distance between two coordinates (Haversine formula)
 * Returns distance in kilometers
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Find the closest stop to the user's location
 */
export function findClosestStop(userLat, userLng) {
  let closestStop = null;
  let closestIndex = 0;
  let minDistance = Infinity;

  SANTA_ROUTE.forEach((stop, index) => {
    // Skip departure and arrival North Pole entries
    if (stop.region === 'departure' || stop.region === 'arrival') return;

    const distance = haversineDistance(userLat, userLng, stop.lat, stop.lng);
    if (distance < minDistance) {
      minDistance = distance;
      closestStop = stop;
      closestIndex = index;
    }
  });

  return { stop: closestStop, index: closestIndex, distance: minDistance };
}

/**
 * Estimate when Santa will arrive at a specific stop index
 */
export function getEstimatedArrivalTime(stopIndex, currentDate = new Date()) {
  const totalStops = SANTA_ROUTE.length - 1;
  const stopProgress = stopIndex / totalStops;

  // Get the current year
  const year = currentDate.getUTCFullYear();

  // Journey starts JOURNEY_START_DAY 12:00 UTC
  let journeyStart = Date.UTC(year, 11, JOURNEY_START_DAY, JOURNEY_START_HOUR_UTC, 0, 0);

  // If we're past this year's journey, calculate for next year
  const journeyEnd = journeyStart + JOURNEY_DURATION_HOURS * 60 * 60 * 1000;
  if (currentDate.getTime() > journeyEnd) {
    journeyStart = Date.UTC(year + 1, 11, JOURNEY_START_DAY, JOURNEY_START_HOUR_UTC, 0, 0);
  }

  // Calculate arrival time at the stop
  const journeyDurationMs = JOURNEY_DURATION_HOURS * 60 * 60 * 1000;
  const arrivalTime = new Date(journeyStart + stopProgress * journeyDurationMs);

  return arrivalTime;
}

/**
 * Get Santa's estimated arrival info for a user's location
 */
export function getSantaArrivalEstimate(userLat, userLng, currentDate = new Date()) {
  const { stop, index, distance } = findClosestStop(userLat, userLng);

  if (!stop) {
    return null;
  }

  const arrivalTime = getEstimatedArrivalTime(index, currentDate);
  const currentProgress = getJourneyProgress(currentDate);
  const stopProgress = index / (SANTA_ROUTE.length - 1);

  // Determine arrival status
  let status;
  if (currentProgress >= stopProgress) {
    status = 'visited';
  } else if (isJourneyActive(currentDate)) {
    status = 'en-route';
  } else {
    status = 'upcoming';
  }

  // Calculate time until arrival
  const now = currentDate.getTime();
  const arrival = arrivalTime.getTime();
  const timeUntilArrival = arrival - now;

  let timeUntil = null;
  if (timeUntilArrival > 0) {
    const days = Math.floor(timeUntilArrival / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeUntilArrival % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeUntilArrival % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeUntilArrival % (1000 * 60)) / 1000);
    timeUntil = { days, hours, minutes, seconds };
  }

  return {
    closestCity: stop.city,
    closestCountry: stop.country,
    distanceKm: Math.round(distance),
    arrivalTime,
    status,
    timeUntil,
  };
}

