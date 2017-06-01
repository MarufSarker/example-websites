const post = (url, body) => fetch(url, {
  method: 'POST',
  credentials: 'include',
  body: JSON.stringify(body || {}),
  headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
  }
}).then(res => res.json());

export const signin = (username, password) => post('/api/signin', { username, password });
export const signup = (username, password, fullname, email) => post('/api/signup', { username, password, fullname, email });
export const signout = () => post('/api/signout');
export const searchBooks = (query) => post('/api/googleapis', { query });
