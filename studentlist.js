"use strict";

const template = document.querySelector('#tmpl_student').content;
let firstSpace;
let lastSpace;
let firstName;
let lastName;

const state = {
  students: [],
  filteredStudents: []

}

window.addEventListener("DOMContentLoaded", init);

function init() {
  console.log("init starts");

  // TODO: Load JSON, create clones, build list, add event listeners, show modal, find images, and other stuff ...
  getJSON();
}

function getJSON() {
  console.log("getJSON");
 fetch('http://petlatkea.dk/2019/hogwarts/students.json')
 .then(res => res.json())
 //.then(filterList)
 .then(displayList);

  // NOTE: Maybe also call sortByFirst the first time ... Investigate!
}

function filterList() {
  console.log("filterList");

  // displayList();
}

// IDEA
function filterByHouse(students, house) {
  return students.filter(student => student.house === house);
}


function displayList(listOfStudents) {
 state.students = listOfStudents;
listOfStudents.forEach(student => {

  let arr_splitted  = student.fullname.split(' ');
  let firstName = arr_splitted[0];
  let lastName = arr_splitted[arr_splitted.length -1 ];

  const tmplCopy = template.cloneNode(true);
  tmplCopy.querySelector("#first_name").textContent = "First name: " + firstName;
  tmplCopy.querySelector("#last_name").textContent = "Last name: " + lastName;
  tmplCopy.querySelector("#house").textContent = "House: " + student.house;
  document.querySelector("#students").appendChild(tmplCopy);
  
});

console.log(state.students);

state.filteredStudents = filterByHouse(state.students, "Hufflepuff")

log();
}

// TODO: Create scaffolding functions for the rest!

function clickSortByFirst() {

}

function sortListByFirst() {
}



function log() {
  console.log('state: ', state);
}