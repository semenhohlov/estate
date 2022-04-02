const addForm = document.querySelector('#add_form');
const country = document.querySelector('#country');
const state = document.querySelector('#state');
const district = document.querySelector('#district');
const city = document.querySelector('#city');
const borough = document.querySelector('#borough');
const suburb = document.querySelector('#suburb');
const road = document.querySelector('#road');
const house_number = document.querySelector('#house_number');
const lat = document.querySelector('#lat');
const lon = document.querySelector('#lon');
const name = document.querySelector('#name');
const description = document.querySelector('#description');
const image = document.querySelector('#image');

async function submitHandler(event) {
  event.preventDefault();
  const formData = new FormData(addForm);
  const res = await request(API_URL, 'POST', formData);
  const {item} = res;
  name.value = '';
  description.value = '';
  image.value = '';
  const pos = [item.lat, item.lon];
  L.marker(pos).bindPopup(
    `<img class="popup_image" src="${item.image}" alt="${item.name}" /> ${item.name}`
  ).addTo(map);
  showModal('Успіх', "Об'ект успішно додано");
};

addForm.addEventListener('submit', submitHandler);

// fill textfields
function fillTextFields(data) {
  lat.value = data.lat;
  lon.value = data.lon;
  country.value = data.address.country;
  state.value = data.address.state ?? '';
  district.value = data.address.district ?? '';
  city.value = data.address.city ?? '';
  borough.value = data.address.borough ?? '';
  suburb.value = data.address.suburb ?? '';
  road.value = data.address.road ?? '';
  house_number.value = data.address.house_number ?? '';
};

// load data from
async function loadData() {
  const coords = map.getCenter();
  const url = 'https://nominatim.openstreetmap.org/reverse';
  const queryString = `?lat=${coords.lat}&lon=${coords.lng}&format=json&accept-language=ua`;
  const data = await request(url + queryString, 'GET');
  fillTextFields(data);
};
// map change events
map.on('moveend', loadData);

// loadData();
