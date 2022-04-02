let markersLayer = null;
let estateList = [];
const content = document.querySelector('#content');

// load items from server
async function loadItems() {
  const bounds = map.getBounds();
  const maxX = bounds._northEast.lng;
  const minX = bounds._southWest.lng;
  const maxY = bounds._northEast.lat;
  const minY = bounds._southWest.lat;
  const queryString = `?minx=${minX}&miny=${minY}&maxx=${maxX}&maxy=${maxY}`;
  const result = await request(API_URL + queryString, 'GET');
  return result.data;
};

// crete new markers layers
function createMarkersLayer(items) {
  const layers = [];
  items.forEach(item => {
    const pos = [item.lat, item.lon];
    const marker = L.marker(pos).bindPopup(
      `<img class="popup_image" src="${item.image}" alt="${item.name}" /> ${item.name}`
    );
    item.marker = marker;
    layers.push(marker);
  });
  // console.log(layers);
  return L.layerGroup(layers).addTo(map);
};

// clear markers layer on map
function clearMarkersLayer(layer) {
  return map.removeLayer(layer);
}

// create real estate list
function createEstateList(items) {
  if (items.length) {
    items.forEach(item => {
      content.insertAdjacentElement('beforeend', makeItem(item));
    });
  } else {
    const div = document.createElement('div');
    div.classList.add('empty');
    div.innerHTML = 'Вибачте, тут пусто.';
    content.insertAdjacentElement('afterbegin', div);
  }
};

// clear estate list
function clearEstateList(list) {
  // clear old events
  for (let i = 0; i < content.children.length; i++) {
    const item = content.children[i];
    if (item.clickHandler) {
      item.removeEventListener('mouseover', item.mouseoverHandler);
      item.removeEventListener('mouseout', item.mouseoutHandler);
      item.removeEventListener('click', item.clickHandler);
      const trash = item.querySelector('.trash-icon');
      if (trash) {
        trash.removeEventListener('click', item.removeHandler);
      }
    }
  }
  content.innerHTML = '';
  list.length = 0;
};

function makeModalBody(item) {
  return `
    <div>
      <img class="image-full" src="${item.image}" alt="" />
      <div class="row flex">
        <div class="col-30">Місто:</div>
        <div class="col-70">${item.city}</div>
      </div>
      <div class="row flex">
        <div class="col-30">Вулиця:</div>
        <div class="col-70">${item.road}</div>
      </div>
      <div class="row flex">
        <div class="col-30">Дім:</div>
        <div class="col-70">${item.house_number}</div>
      </div>
      <p>${item.description}</p>
    </div>
  `;
};

function makeItem(item) {
  const itemDiv = document.createElement('div');
  itemDiv.classList.add('item');
  const header = document.createElement('div');
  header.classList.add('item__header');
  header.classList.add('flex');
  header.classList.add('space-between');
  itemDiv.insertAdjacentElement('beforeend', header);
  const img = document.createElement('img');
  img.classList.add('item__image');
  img.src = item.image;
  header.insertAdjacentElement('afterbegin', img);
  const trash = document.createElement('img');
  trash.classList.add('trash-icon');
  trash.src = '/img/trash.png';
  header.insertAdjacentElement('beforeend', trash);
  const body = document.createElement('div');
  body.classList.add('item__body');
  body.textContent = item.name;
  itemDiv.insertAdjacentElement('beforeend', body);
  // events
  itemDiv.mouseoverHandler = () => {
    item.marker.openPopup();
  };
  itemDiv.mouseoutHandler = () => {
    item.marker.closePopup();
  };
  itemDiv.clickHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    showModal(item.name, makeModalBody(item));
  };
  itemDiv.removeHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    removeItem(item.id);
  }
  itemDiv.addEventListener('mouseover', itemDiv.mouseoverHandler);
  itemDiv.addEventListener('mouseout', itemDiv.mouseoutHandler);
  itemDiv.addEventListener('click', itemDiv.clickHandler);
  trash.addEventListener('click', itemDiv.removeHandler)
  return itemDiv;
};

async function removeItem(id) {
  await request(API_URL + `/${id}`, 'POST');
  updateItems();
}

// load items
async function load() {
  estateList = await loadItems();
  markersLayer = createMarkersLayer(estateList);
  createEstateList(estateList);
};

// update items
function updateItems(event) {
  clearMarkersLayer(markersLayer);
  clearEstateList(estateList);
  load();
};

// map change events
map.on('moveend', updateItems);

// start
load();
