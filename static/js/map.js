const API_URL = 'https://estate-nodejs.herokuapp.com/api';
const initial_position = [47.8582, 35.1087];
const map = L.map('map').setView(initial_position, 10);

// что-то типа рекламы
// без этого карта работать не будет
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// api fetcher
async function request(url, method = 'POST', body = null, jsonContent = false) {
  const options = {method};
  if (jsonContent) {
    options.headers = {'Content-Type': 'application/json;charset=utf-8'};
  }
  if ((method === 'POST') && body) {
    options.body = body;
  }
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    console.log('Fetch error:', error.message);
    return;
  }
};
