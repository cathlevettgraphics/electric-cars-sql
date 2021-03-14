import {
  renderCarList,
  allCars,
  fetchData,
  updateCar,
  deleteCar,
  addCar,
} from './crud.js';

import { populate } from './utility.js';

/********************
 *
 * RENDER DATA TO DOM
 *
 ********************/

export const postsMountNode = document.getElementById('posts-target');

export const CARS_ENDPOINT = 'http://localhost:3000/api/v1/cars/';

document.addEventListener('DOMContentLoaded', (e) => {
  fetchData(CARS_ENDPOINT);
  renderCarList();
});
/********************
 *
 * CREATE CAR + RENDER
 *
 ********************/

const carForm = document.forms['car-entry-form'];

carForm.addEventListener('submit', (e) => {
  e.preventDefault();
  // CREATE
  const formData = new FormData(carForm);
  const data = Object.fromEntries(formData);
  // console.log(data);
  addCar(data);
  fetchData(CARS_ENDPOINT);
  renderCarList(allCars);

  carForm.reset();
});

/********************
 *
 * UPDATE + DELETE
 *
 ********************/

const carFormUpdate = document.forms['car-entry-form-update'];
let originalCar;

postsMountNode.addEventListener('click', (e) => {
  const target = e.target;
  // DELETE
  if (target && target.matches('.btn.btn-delete')) {
    let deleteID = target.closest('button').dataset.id;
    // !! convert to number as database is a number key
    deleteID = parseInt(deleteID);

    const index = allCars.findIndex((item) => item.id === deleteID);
    allCars.splice(index, 1);

    target.closest('li').remove();

    deleteCar(deleteID);
    renderCarList(allCars);
  }

  // UPDATE
  if (target && target.matches('.btn.btn-update')) {
    // get car by data-id
    let carId = target.closest('button').dataset.id;
    // !! convert to number as database is a number key
    carId = parseInt(carId);

    const carToUpdate = allCars.find((car) => car.id === carId);
    // console.log('The car to update is: ', carToUpdate);
    // Populate update form
    populate(carFormUpdate, carToUpdate);
    // Make carToUpdate accessable
    originalCar = carToUpdate;

    // Show update form > hide create form
    carFormUpdate.classList.add('car-entry-form-update-show');
    carForm.classList.add('car-entry-form-hide');
  }
});

carFormUpdate.addEventListener('submit', (e) => {
  e.preventDefault();
  // Serialise
  const formData = new FormData(carFormUpdate);
  const newData = Object.fromEntries(formData);
  carFormUpdate.reset();

  updateCar(originalCar._id, newData);
  renderCarList();

  carFormUpdate.classList.remove('car-entry-form-update-show');
  carForm.classList.remove('car-entry-form-hide');
});
