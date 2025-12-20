import { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from 'react-i18next';
import { languages } from './i18n';
import {
  isJourneyActive,
  getSantaLocation,
  getTimeUntilJourney,
  getAllStops,
  formatNumber,
  getJourneyProgress,
  getSantaArrivalEstimate,
} from './santaTracker';

// Custom Santa icon for the map
const santaIcon = L.divIcon({
  className: 'santa-map-icon',
  html: '<div class="santa-icon-wrapper">🎅</div>',
  iconSize: [50, 50],
  iconAnchor: [25, 25],
  popupAnchor: [0, -25],
});

// City marker icons
const visitedIcon = L.divIcon({
  className: 'city-marker visited',
  html: '<div class="city-dot visited"></div>',
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const upcomingIcon = L.divIcon({
  className: 'city-marker upcoming',
  html: '<div class="city-dot upcoming"></div>',
  iconSize: [8, 8],
  iconAnchor: [4, 4],
});

// User location icon
const userLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: '<div class="user-location-dot">📍</div>',
  iconSize: [30, 30],
  iconAnchor: [15, 30],
  popupAnchor: [0, -30],
});

function LanguageSelector() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = languages.find((lang) => lang.code === i18n.language) || languages[0];

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    setIsOpen(false);
  };

  return (
    <div className="language-selector">
      <button
        className="language-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Select language"
      >
        <span className="lang-flag">{currentLang.flag}</span>
        <span className="lang-code">{currentLang.code.toUpperCase()}</span>
        <span className="lang-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div className="language-dropdown">
          {languages.map((lang) => (
            <button
              key={lang.code}
              className={`language-option ${lang.code === i18n.language ? 'active' : ''}`}
              onClick={() => handleLanguageChange(lang.code)}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function Snowflakes() {
  // Memoize snowflake data so random values are only generated once
  const snowflakeData = useMemo(() => 
    [...Array(50)].map(() => ({
      left: `${Math.random() * 100}%`,
      animationDelay: `${Math.random() * 10}s`,
      animationDuration: `${10 + Math.random() * 20}s`,
      opacity: 0.4 + Math.random() * 0.6,
      fontSize: `${0.5 + Math.random() * 1}rem`,
    })), 
  []);

  return (
    <div className="snowflakes" aria-hidden="true">
      {snowflakeData.map((style, i) => (
        <div
          key={i}
          className="snowflake"
          style={style}
        >
          ❄
        </div>
      ))}
    </div>
  );
}

function CountdownTimer({ timeUntil }) {
  const { t } = useTranslation();
  return (
    <div className="countdown-container">
      <h2 className="countdown-title">{t('countdown.title')}</h2>
      <div className="countdown-grid">
        <div className="countdown-item">
          <span className="countdown-number">{timeUntil.days}</span>
          <span className="countdown-label">{t('countdown.days')}</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeUntil.hours).padStart(2, '0')}</span>
          <span className="countdown-label">{t('countdown.hours')}</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeUntil.minutes).padStart(2, '0')}</span>
          <span className="countdown-label">{t('countdown.minutes')}</span>
        </div>
        <div className="countdown-item">
          <span className="countdown-number">{String(timeUntil.seconds).padStart(2, '0')}</span>
          <span className="countdown-label">{t('countdown.seconds')}</span>
        </div>
      </div>
    </div>
  );
}

// Component to follow Santa on the map
function FollowSanta({ position }) {
  const map = useMap();
  
  useEffect(() => {
    if (position) {
      map.setView(position, map.getZoom(), { animate: true, duration: 1 });
    }
  }, [position, map]);
  
  return null;
}

function WorldMap({ santaLocation, stops, userLocation }) {
  const { t } = useTranslation();
  const visitedStops = stops.slice(0, santaLocation.citiesVisited + 1);
  const upcomingStops = stops.slice(santaLocation.citiesVisited + 1);
  
  // Create route coordinates
  const visitedRoute = visitedStops.map(stop => [stop.lat, stop.lng]);
  const upcomingRoute = upcomingStops.length > 0 
    ? [[visitedStops[visitedStops.length - 1]?.lat, visitedStops[visitedStops.length - 1]?.lng], 
       ...upcomingStops.map(stop => [stop.lat, stop.lng])]
    : [];

  const santaPosition = [santaLocation.lat, santaLocation.lng];

  return (
    <div className="map-container">
      <MapContainer
        center={santaPosition}
        zoom={3}
        className="leaflet-map"
        worldCopyJump={true}
        maxBounds={[[-90, -180], [90, 180]]}
      >
        {/* Dark themed map tiles */}
        <TileLayer
          attribution='&copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Follow Santa */}
        <FollowSanta position={santaPosition} />
        
        {/* Visited route - green dashed line */}
        {visitedRoute.length > 1 && (
          <Polyline
            positions={visitedRoute}
            pathOptions={{
              color: '#4ade80',
              weight: 3,
              dashArray: '10, 6',
              opacity: 0.8,
            }}
          />
        )}
        
        {/* Upcoming route - gray dashed line */}
        {upcomingRoute.length > 1 && (
          <Polyline
            positions={upcomingRoute}
            pathOptions={{
              color: '#64748b',
              weight: 2,
              dashArray: '6, 6',
              opacity: 0.4,
            }}
          />
        )}
        
        {/* Visited city markers */}
        {visitedStops.slice(1, -1).map((stop, i) => (
          <Marker
            key={`visited-${i}`}
            position={[stop.lat, stop.lng]}
            icon={visitedIcon}
          >
            <Popup className="city-popup">
              <strong>✓ {stop.city}</strong><br />
              {stop.country}<br />
              <span className="popup-status visited">{t('map.delivered')}</span>
            </Popup>
          </Marker>
        ))}
        
        {/* Upcoming city markers */}
        {upcomingStops.slice(0, -1).map((stop, i) => (
          <Marker
            key={`upcoming-${i}`}
            position={[stop.lat, stop.lng]}
            icon={upcomingIcon}
          >
            <Popup className="city-popup">
              <strong>{stop.city}</strong><br />
              {stop.country}<br />
              <span className="popup-status upcoming">{t('map.comingSoon')}</span>
            </Popup>
          </Marker>
        ))}
        
        {/* User location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={userLocationIcon}>
            <Popup className="user-popup">
              <strong>📍 {t('map.yourLocation')}</strong><br />
              <span className="popup-status upcoming">{t('map.santaOnWay')}</span>
            </Popup>
          </Marker>
        )}
        
        {/* Santa marker */}
        <Marker position={santaPosition} icon={santaIcon}>
          <Popup className="santa-popup">
            <strong>🎅 {t('map.santaHere')}</strong><br />
            {santaLocation.currentCity}, {santaLocation.currentCountry}<br />
            <span className="popup-presents">
              🎁 {formatNumber(santaLocation.presentsDelivered)} {t('map.presentsDelivered')}
            </span>
          </Popup>
        </Marker>
      </MapContainer>
      
      {/* Map legend */}
      <div className="map-legend">
        <div className="legend-item">
          <span className="legend-dot visited"></span>
          <span>{t('map.legend.visited')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-dot upcoming"></span>
          <span>{t('map.legend.upcoming')}</span>
        </div>
        <div className="legend-item">
          <span className="legend-santa">🎅</span>
          <span>{t('map.legend.santa')}</span>
        </div>
        {userLocation && (
          <div className="legend-item">
            <span className="legend-user">📍</span>
            <span>{t('map.legend.you')}</span>
          </div>
        )}
      </div>
    </div>
  );
}

function SantaStatus({ santaLocation }) {
  const { t } = useTranslation();
  return (
    <div className="status-container">
      <div className="status-header">
        <div className="live-indicator">
          <span className="live-dot"></span>
          {t('status.liveTracking')}
        </div>
        <h2 className="status-title">{t('status.title')}</h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card location-card">
          <div className="stat-icon">📍</div>
          <div className="stat-content">
            <span className="stat-label">{t('status.currentLocation')}</span>
            <span className="stat-value">{santaLocation.currentCity}</span>
            <span className="stat-sublabel">{santaLocation.currentCountry}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🎁</div>
          <div className="stat-content">
            <span className="stat-label">{t('status.presentsDelivered')}</span>
            <span className="stat-value">{formatNumber(santaLocation.presentsDelivered)}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">🏙️</div>
          <div className="stat-content">
            <span className="stat-label">{t('status.citiesVisited')}</span>
            <span className="stat-value">{santaLocation.citiesVisited} / {santaLocation.totalCities}</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">➡️</div>
          <div className="stat-content">
            <span className="stat-label">{t('status.nextStop')}</span>
            <span className="stat-value">{santaLocation.nextCity}</span>
            <span className="stat-sublabel">{santaLocation.nextCountry}</span>
          </div>
        </div>
      </div>

      <div className="progress-container">
        <div className="progress-header">
          <span>{t('status.journeyProgress')}</span>
          <span>{Math.round(santaLocation.progress * 100)}%</span>
        </div>
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${santaLocation.progress * 100}%` }}
          >
            <span className="progress-sleigh">🛷</span>
          </div>
        </div>
        <div className="progress-labels">
          <span>🏠 {t('status.northPole')}</span>
          <span>{t('status.northPole')} 🏠</span>
        </div>
      </div>

    </div>
  );
}

function ArrivalEstimate({ arrivalEstimate, locationError, onRetry }) {
  const { t, i18n } = useTranslation();
  
  if (locationError) {
    return (
      <div className="arrival-container">
        <div className="arrival-header">
          <h2 className="arrival-title">{t('arrival.title')}</h2>
        </div>
        <div className="arrival-error">
          <p>{t('arrival.locationError')}</p>
          <p className="arrival-error-detail">{locationError}</p>
          <button className="location-retry-btn" onClick={onRetry}>
            {t('arrival.tryAgain')}
          </button>
        </div>
      </div>
    );
  }

  if (!arrivalEstimate) {
    return (
      <div className="arrival-container">
        <div className="arrival-header">
          <h2 className="arrival-title">{t('arrival.title')}</h2>
        </div>
        <div className="arrival-loading">
          <div className="arrival-spinner"></div>
          <p>{t('arrival.findingLocation')}</p>
        </div>
      </div>
    );
  }

  const { closestCity, closestCountry, distanceKm, arrivalTime, status, timeUntil } = arrivalEstimate;

  return (
    <div className="arrival-container">
      <div className="arrival-header">
        <h2 className="arrival-title">{t('arrival.titleNearYou')}</h2>
      </div>

      <div className="arrival-content">
        <div className="arrival-city">
          <span className="arrival-city-icon">🏠</span>
          <div className="arrival-city-info">
            <span className="arrival-city-label">{t('arrival.closestStop')}</span>
            <span className="arrival-city-name">{closestCity}</span>
            <span className="arrival-city-country">{closestCountry}</span>
          </div>
        </div>

        <div className="arrival-time-box">
          {status === 'visited' ? (
            <>
              <span className="arrival-status visited">{t('arrival.santaVisited')}</span>
              <span className="arrival-message">
                {t('arrival.alreadyDelivered')}
              </span>
            </>
          ) : status === 'en-route' ? (
            <>
              <span className="arrival-status en-route">{t('arrival.santaOnWay')}</span>
              {timeUntil && (
                <div className="arrival-countdown">
                  <span className="arrival-countdown-label">{t('arrival.arrivingIn')}</span>
                  <div className="arrival-countdown-time">
                    {timeUntil.hours > 0 && (
                      <span className="arrival-time-unit">
                        <span className="arrival-time-number">{timeUntil.hours}</span>
                        <span className="arrival-time-label">{t('arrival.hr')}</span>
                      </span>
                    )}
                    <span className="arrival-time-unit">
                      <span className="arrival-time-number">{String(timeUntil.minutes).padStart(2, '0')}</span>
                      <span className="arrival-time-label">{t('arrival.min')}</span>
                    </span>
                    <span className="arrival-time-unit">
                      <span className="arrival-time-number">{String(timeUntil.seconds).padStart(2, '0')}</span>
                      <span className="arrival-time-label">{t('arrival.sec')}</span>
                    </span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <span className="arrival-status upcoming">{t('arrival.scheduledArrival')}</span>
              <span className="arrival-datetime">
                {arrivalTime.toLocaleString(i18n.language, {
                  weekday: 'short',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  timeZoneName: 'short',
                })}
              </span>
              {timeUntil && (
                <div className="arrival-countdown small">
                  <span className="arrival-countdown-label">{t('arrival.thatsIn')}</span>
                  <span className="arrival-countdown-text">
                    {timeUntil.days > 0 && `${timeUntil.days}d `}
                    {timeUntil.hours}h {timeUntil.minutes}m
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function JourneyComplete() {
  const { t } = useTranslation();
  return (
    <div className="complete-container">
      <h2 className="complete-title">{t('complete.title')}</h2>
      <p className="complete-message">
        {t('complete.message')}
      </p>
      <div className="complete-stats">
        <div className="complete-stat">
          <span className="complete-number">2,000,000,000+</span>
          <span className="complete-label">{t('complete.presentsDelivered')}</span>
        </div>
        <div className="complete-stat">
          <span className="complete-number">57</span>
          <span className="complete-label">{t('complete.citiesVisited')}</span>
        </div>
      </div>
      <p className="complete-footer">{t('complete.footer')}</p>
    </div>
  );
}

export default function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isActive, setIsActive] = useState(false);
  const [santaLocation, setSantaLocation] = useState(null);
  const [timeUntil, setTimeUntil] = useState(null);
  const [journeyComplete, setJourneyComplete] = useState(false);
  const [demoMode, setDemoMode] = useState(false);
  const [demoProgress, setDemoProgress] = useState(0);
  const [userLocation, setUserLocation] = useState(null);
  const [locationError, setLocationError] = useState(null);
  const [arrivalEstimate, setArrivalEstimate] = useState(null);
  const stops = getAllStops();

  // Get user's location
  const requestLocation = () => {
    setLocationError(null);
    
    // Check if we're in a secure context (HTTPS) - required for geolocation
    if (window.isSecureContext === false) {
      setLocationError('Location requires HTTPS. Please access this site via https://');
      return;
    }
    
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        let message;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = 'An unknown error occurred getting your location.';
        }
        setLocationError(message);
      },
      { enableHighAccuracy: false, timeout: 15000, maximumAge: 300000 }
    );
  };

  // Create a simulated date for demo mode (Dec 24, progressing through the journey)
  const getSimulatedDate = (progress) => {
    // Dec 24 12:00 UTC + progress * 24 hours
    const baseTime = Date.UTC(2024, 11, 24, 12, 0, 0);
    const journeyMs = 24 * 60 * 60 * 1000;
    return new Date(baseTime + progress * journeyMs);
  };

  // Request location on mount
  useEffect(() => {
    requestLocation();
  }, []);

  // Update arrival estimate when user location or time changes
  useEffect(() => {
    if (userLocation) {
      const locationDate = demoMode ? getSimulatedDate(demoProgress) : new Date();
      const estimate = getSantaArrivalEstimate(userLocation.lat, userLocation.lng, locationDate);
      setArrivalEstimate(estimate);
    }
  }, [userLocation, demoMode, demoProgress, currentTime]);

  useEffect(() => {
    const update = () => {
      const now = demoMode ? getSimulatedDate(demoProgress) : new Date();
      setCurrentTime(demoMode ? new Date() : now);
      
      const active = demoMode || isJourneyActive(now);
      setIsActive(active);
      
      if (active) {
        const locationDate = demoMode ? getSimulatedDate(demoProgress) : now;
        setSantaLocation(getSantaLocation(locationDate));
        const progress = demoMode ? demoProgress : getJourneyProgress(now);
        setJourneyComplete(progress >= 1);
      } else {
        setTimeUntil(getTimeUntilJourney(now));
        // Check if journey is complete (after Dec 25 12:00 UTC)
        const progress = getJourneyProgress(now);
        if (progress >= 1) {
          setJourneyComplete(true);
          setSantaLocation(getSantaLocation(now));
        }
      }
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [demoMode, demoProgress]);

  const { t, i18n } = useTranslation();

  // Update SEO meta tags when language changes
  useEffect(() => {
    // Update document title
    document.title = t('seo.title');
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('seo.description'));
    }
    
    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogTitle) ogTitle.setAttribute('content', t('seo.title'));
    if (ogDescription) ogDescription.setAttribute('content', t('seo.description'));
    
    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[name="twitter:title"]');
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterTitle) twitterTitle.setAttribute('content', t('seo.title'));
    if (twitterDescription) twitterDescription.setAttribute('content', t('seo.description'));
    
    // Update HTML lang attribute
    document.documentElement.lang = i18n.language;
  }, [i18n.language, t]);

  return (
    <div className="app">
      <Snowflakes />
      
      <header className="header">
        <LanguageSelector />
        <h1 className="title">
          <span className="title-icon">🎅</span>
          {t('header.title')}
          <span className="title-icon">🦌</span>
        </h1>
        <p className="subtitle">{t('header.subtitle')}</p>
        <p className="current-time">
          {currentTime.toLocaleString(i18n.language, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          })}
        </p>
      </header>

      <main className="main">
        {/* Demo Mode Controls */}
        {!isJourneyActive(new Date()) && (
          <div className="demo-controls">
            <button 
              className={`demo-toggle ${demoMode ? 'active' : ''}`}
              onClick={() => setDemoMode(!demoMode)}
            >
              {demoMode ? t('demo.exitDemo') : t('demo.tryDemo')}
            </button>
            {demoMode && (
              <div className="demo-slider-container">
                <label className="demo-label">
                  {t('demo.journeyProgress')}: {Math.round(demoProgress * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={demoProgress * 100}
                  onChange={(e) => setDemoProgress(e.target.value / 100)}
                  className="demo-slider"
                />
                <div className="demo-hint">
                  {t('demo.hint')}
                </div>
              </div>
            )}
          </div>
        )}

        {journeyComplete && !demoMode ? (
          <JourneyComplete />
        ) : isActive && santaLocation ? (
          <>
            <WorldMap santaLocation={santaLocation} stops={stops} userLocation={userLocation} />
            <SantaStatus santaLocation={santaLocation} />
            <ArrivalEstimate 
              arrivalEstimate={arrivalEstimate} 
              locationError={locationError}
              onRetry={requestLocation}
            />
          </>
        ) : timeUntil && !demoMode ? (
          <>
            <CountdownTimer timeUntil={timeUntil} />
            <ArrivalEstimate 
              arrivalEstimate={arrivalEstimate} 
              locationError={locationError}
              onRetry={requestLocation}
            />
          </>
        ) : (
          <div className="loading">{t('loading')}</div>
        )}
      </main>

      <footer className="footer">
        <p>{t('footer.madeWith')}</p>
        <p className="footer-note">
          {t('footer.note')}
        </p>
      </footer>
    </div>
  );
}

