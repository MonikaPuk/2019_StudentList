"use strict";

const template = document.querySelector('#tmpl_student').content;
const modal = document.querySelector('#modal');

let houseFilter = false;
let currentSort;

let allStudents = [];
let studentsExpelled = [];
let enrolledStudents = [];

window.addEventListener("DOMContentLoaded", init);

function init() {

  document.querySelector('#Gryffindor').addEventListener('click', () => {
    houseFilter = 'Gryffindor';
    filterList();
  });
  document.querySelector('#Hufflepuff').addEventListener('click', () => {
    houseFilter = 'Hufflepuff';
    filterList();
  });
  document.querySelector('#Ravenclaw').addEventListener('click', () => {
    houseFilter = 'Ravenclaw';
    filterList();
  });
  document.querySelector('#Slytherin').addEventListener('click', () => {
    houseFilter = 'Slytherin';
    filterList();
  });


  getJSON();

}

function getJSON() {
 fetch('http://petlatkea.dk/2019/hogwarts/students.json')
 .then(res => res.json())
 .then(prepObject);
}

function prepObject(jsonData){
jsonData.forEach((jsonObject, index) =>{
  const student = Object.create(Student);
  student.fromJSON (jsonObject, index);
  allStudents.push(student);
});
  filterList()

}


const Student = {
  firstName : '-first-name-',
  lastName : '-last-name-',
  house : '-house-',

  fromJSON(jsonObject, index){
    const arr_split  = jsonObject.fullname.split(' ');
    this.id = index;
    this.firstName = arr_split[0];
    this.lastName = arr_split[arr_split.length -1 ];
    this.house = jsonObject.house;
  }
}


//Being called at evenListener('click'), takes parameters from filterByHouse
//and calls displayList passing those parameters


function filterList() {
  let newlist = filterByHouse(allStudents, houseFilter);
   if(houseFilter === false){
     newlist = allStudents;
   };
  displayList(newlist); 
}

// if student house is equal to house passed in the event Listener- returns the student

function filterByHouse(students, house) {
  return students.filter(student => student.house === house);

}


function displayList(listOfStudents) {
document.querySelector("#students").textContent = '';
listOfStudents.forEach(displayStudent);
updateStatus();

}


function displayStudent(student) {
  const tmplCopy = template.cloneNode(true);
  tmplCopy.querySelector("#first_name").textContent = "First name: " + student.firstName;
  tmplCopy.querySelector("#last_name").textContent = "Last name: " + student.lastName;
  tmplCopy.querySelector("#house").textContent = "House: " + student.house;
  tmplCopy.querySelector('#house_logo').src = addPhoto(student.house);
  tmplCopy.querySelector('article').addEventListener('click', ()=>{
    displayModal(student);
  })
  tmplCopy.querySelector('#expell_btn').addEventListener('click', (e)=>{
    e.stopPropagation();
    expellStudentClicked(student);
  })
  modal.addEventListener('click', ()=>{
    hideModal();
  })
  document.querySelector("#students").appendChild(tmplCopy);

}

function displayModal(student) {
  modal.classList.remove('hide');
  modal.querySelector('h2').innerHTML = student.firstName + " "+ student.lastName;
  modal.querySelector("#student_photo").src = `images/${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
}

function hideModal() {
  modal.classList.add('hide');

}

function addPhoto(house) {
  if (house === "Hufflepuff") {
            return "https://vignette.wikia.nocookie.net/csydes-test/images/e/ee/Hufflepuff_Crest.png/revision/latest?cb=20171101063214";
        }
        else if (house === "Gryffindor") {
            return "https://pngimage.net/wp-content/uploads/2018/06/gryffindor-crest-png.png";
        }
        else if (house === "Ravenclaw") {
            return "https://vignette.wikia.nocookie.net/csydes-test/images/2/2b/Ravenclaw_Crest.png/revision/latest?cb=20171101063206";
        }
        else {
            return "https://vignette.wikia.nocookie.net/csydes-test/images/4/45/Slytherin_Crest.png/revision/latest?cb=20171101063219";
}
}


function count(house) {
  let studentsInHouse = allStudents.filter(student => student.house === house);
  return studentsInHouse.length;
}


function expellStudentClicked(studentClicked) {
  studentsExpelled.push(studentClicked);
  enrolledStudents = enrolledStudents.filter(student => student.id !== studentClicked.id);
  allStudents = allStudents.filter(student => student.id !== studentClicked.id);

  displayList(allStudents);
  updateStatus();
}

function updateStatus() {
  document.querySelector('#g_count').innerHTML = count('Gryffindor');
  document.querySelector('#h_count').innerHTML = count('Hufflepuff');
  document.querySelector('#r_count').innerHTML = count('Ravenclaw');
  document.querySelector('#s_count').innerHTML = count('Slytherin');
  document.querySelector('#expelled_count').innerHTML = studentsExpelled.length;

}
//SORTING

function nameSort(a, b) {
  if( a.firstName < b.firstName ){
    return -1;
  } else{
    return 1;
  }
}

function lastNameSort(a,b) {
  if( a.lastName < b.lastName ){
    return -1;
  } else{
    return 1;
  }
}

function clickSortByFirst(option) {
  currentSort = option.value;
  if(currentSort === "sort_firstName"){
    allStudents.sort(nameSort);
  } else{
    allStudents.sort(lastNameSort);
  }
  filterList();
}

