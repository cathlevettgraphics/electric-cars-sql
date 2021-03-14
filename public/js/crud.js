import { postsMountNode, CARS_ENDPOINT } from './appController.js';

export let allCars = [];

// Fetch
export async function fetchData(CARS_ENDPOINT) {
  try {
    const res = await fetch(CARS_ENDPOINT);
    const data = await res.json();

    allCars = data;
    // console.log('1. original posts from server', allCars);
    renderCarList(allCars);
  } catch (err) {
    console.log('error:', err.message);
  }
}

// Render
export function renderCarList() {
  if (allCars.length) {
    const list = document.createElement('ul');
    list.classList.add('car-list');

    for (const { name, bhp, avatar_url, id } of allCars) {
      const li = document.createElement('li');
      li.classList.add('car-item');
      li.innerHTML = `
      <div class="car-wrapper">
      <h3>${name}</h3>
      <p>${bhp} bhp</p>
      <img src="${avatar_url}">
      <div class="buttons">
      <div ><a href="#update-form"><button class="btn btn-update" data-id="${id}">Update</button></a></div>
      <div><button class="btn btn-delete" data-id="${id}">Delete</button></div>
      </div>
      </div>
      `;
      list.append(li);
    }
    postsMountNode.innerHTML = '';
    postsMountNode.append(list);
  } else {
    postsMountNode.innerHTML = ` <p class="no-data-entered">No cars added – what are you waiting for! Add some cool cars</p>`;
  }
}

// Create
export async function addCar(data) {
  try {
    const response = await fetch(CARS_ENDPOINT, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (response.status === 500) {
      throw response;
    }

    const newCarData = await response.json();

    allCars.push(newCarData);
    renderCarList(allCars);

    GrowlNotification.notify({
      title: 'Cool car, man!',
      description: "We've added it to your garage",
      type: 'success',
      position: 'top-right',
      closeTimeout: 2500,
    });
  } catch (err) {
    // console.log('err', err.message);
    GrowlNotification.notify({
      title: `Error: ${err.message}`,
      description: 'Please try again',
      type: 'warning',
      position: 'top-right',
      closeTimeout: 2500,
    });
  }
}

// Update
export async function updateCar(carId, changes) {
  let itemToUpdate = `${CARS_ENDPOINT}${carId}`;

  try {
    const response = await fetch(itemToUpdate, {
      method: 'PUT',
      body: JSON.stringify(changes),
      headers: {
        'Content-type': 'application/json; charset=UTF-8',
      },
    });
    if (!response.ok) {
      throw response;
    }

    GrowlNotification.notify({
      title: 'Updates applied!',
      description: 'Cool cars, man!',
      type: 'warning',
      position: 'top-right',
      closeTimeout: 2500,
    });
  } catch (err) {
    // console.log('error:', err.message);
    GrowlNotification.notify({
      title: `Error: ${err.message}!`,
      description: 'Please try again',
      type: 'warning',
      position: 'top-right',
      closeTimeout: 2500,
    });
  }
}

// Delete
export async function deleteCar(idToDelete) {
  const itemToDelete = `${CARS_ENDPOINT}${idToDelete}`;

  try {
    const response = await fetch(itemToDelete, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw response;
    }

    fetchData(CARS_ENDPOINT);

    GrowlNotification.notify({
      title: 'Yeah, that car sucked!',
      description: "We've deleted it",
      type: 'error',
      position: 'top-right',
      closeTimeout: 2500,
    });
  } catch (err) {
    // console.log('error', err, message);
    GrowlNotification.notify({
      title: `Error: ${err.message}`,
      description: 'Please try again',
      type: 'warning',
      position: 'top-right',
      closeTimeout: 2500,
    });
  }
}
