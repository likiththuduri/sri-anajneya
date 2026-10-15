// Sri Anjaneya Frontend Configuration
// When deploying, replace this URL with your production backend URL.
// Example: window.SA_API_BASE = 'https://api.yourdomain.com/api';

(function() {
  const host = window.location.hostname;
  
  // Intelligent default: if running locally or over LAN IP, automatically use port 4000 on that same host
  if (host === 'localhost' || host === '127.0.0.1' || /^192\.168\./.test(host) || /^10\./.test(host)) {
    window.SA_API_BASE = `http://${host}:4000/api`;
  } else {
    // Production default placeholder (replace when deployed)
    window.SA_API_BASE = window.SA_API_BASE || 'http://localhost:4000/api';
  }
})();
