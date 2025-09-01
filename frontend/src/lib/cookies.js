// Read a cookie value by name (for CSRF token from Flask-JWT-Extended)
export function getCookie(name) {
  const m = document.cookie.match('(^|;)\\s*' + name + '\\s*=\\s*([^;]+)');
  return m ? decodeURIComponent(m.pop()) : '';
}
