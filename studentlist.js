"use strict";

const template = document.querySelector('#tmpl_student').content;
const modal = document.querySelector('#modal');

let houseFilter = false;
let currentSort;

const studentMe = {
  firstName: 'Monika Małgorzata',
  lastName: 'Puk',
  house: 'Gryffindor',
  id: '35',
  blood: 'pure',
}
let allStudents = [studentMe];
let studentsExpelled = [];
let enrolledStudents = [];
let bloodList= [];
let squadArr =[];
let wasClicked = false;
let currentStudent;


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
  document.querySelector('#All').addEventListener('click', () => {
    houseFilter = 'All';
    filterList();
  });
  document.querySelector('#blood_change_btn').addEventListener('click', () => {
    wasClicked = true;
    changeBlood();
  })
  getJSONB();
}

function getJSON() {
 fetch('https://petlatkea.dk/2019/hogwarts/students.json')
 .then(res => res.json())
 .then(prepObject);
}

function getJSONB() {
  fetch('https://petlatkea.dk/2019/hogwarts/families.json')
  .then(res => res.json())
  .then(bloodStatus);
}

function bloodStatus(bloodListData) {
  getJSON();
  bloodList = bloodListData;
}



function changeBlood() {
  allStudents.forEach(student => {
    if (student.blood === 'half'){
      student.blood = 'pure';
    } 
    else if (student.blood === 'pure'){
          let random_val = Math.random();
              if(random_val > 0.5){
                student.blood = 'muggle'
              } 
              else {
                student.blood = 'half'
            }
         }
    else{
      student.blood = 'pure';
     }
  });
}

function prepObject(jsonData){
jsonData.forEach((jsonObject, index) =>{
  const student = Object.create(Student);
  student.fromJSON(jsonObject, index);
  allStudents.push(student);
});
  filterList()
}


const Student = {
  firstName : '-first-name-',
  lastName : '-last-name-',
  house : '-house-',
  id: '-id-',
  blood: '-blood-',

  fromJSON(jsonObject, index){
    const arr_split  = jsonObject.fullname.split(' ');
    this.firstName = arr_split[0];
    this.lastName = arr_split[arr_split.length -1 ];
    this.house = jsonObject.house;
    this.id = index;
    this.blood = checkBloodStatus(this.lastName);
  },

  }


  function checkBloodStatus(lastname){
     if (bloodList.half.includes(lastname)){
      return 'half';
    } 
     if (bloodList.pure.includes(lastname)){
      return 'pure';
     }
    else{
       return 'muggle';
     }
    };
  


//Being called at evenListener('click'), takes parameters from filterByHouse
//and calls displayList passing those parameters


function filterList() {
  let newlist;
   if(houseFilter === false || houseFilter === 'All'){
     newlist = allStudents;
   }
   else{
   newlist = filterByHouse(allStudents, houseFilter);
   }
  displayList(newlist); 
}

// if student house is equal to house passed in the event Listener- returns the student

function filterByHouse(students, houseClicked) {
  return students.filter(student => student.house === houseClicked);

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
  tmplCopy.querySelector('article').addEventListener('click', () => {
    displayModal(student);
  })
  tmplCopy.querySelector('#expel_btn').addEventListener('click', (e) => {
    e.stopPropagation();
    expellStudentClicked(student);
  })
  modal.addEventListener('click', ()=>{
    hideModal(event);
  })
  document.querySelector("#students").appendChild(tmplCopy);

}

function displayModal(student) {
  modal.classList.remove('hide');
  modal.querySelector('h2').innerHTML = student.firstName + " "+ student.lastName;
  if (student.lastName === 'Puk' ){
    modal.querySelector("#student_photo").src = 'images/bones_s.png';
  } else if(student.lastName === "Finch-Fletchley"){
    modal.querySelector("#student_photo").src = 'images/fletchley_j.png';
  } else if(student.lastName === "-unknown-"){
    modal.querySelector("#student_photo").src = 'images/not_found.png';
  } 
  else{
  modal.querySelector("#student_photo").src = `images/${student.lastName.toLowerCase()}_${student.firstName.charAt(0).toLowerCase()}.png`;
  }
  modal.querySelector('#blood_type').innerHTML = "Blood status: " + student.blood;
  document.querySelector('body').style.overflow = 'hidden';

   if(squadArr.includes(student)){
    modal.querySelector('#squad').innerHTML = 'Appointed to the Inquisitorial Squad';
    modal.querySelector('#squad').style.color = 'green';
    modal.querySelector('i').classList.remove('hide');
    modal.querySelector('#squad_remove').classList.remove('hide');

  } else {
    modal.querySelector('#squad').innerHTML = 'Appoint to the Inquisitorial Squad';
    modal.querySelector('#squad').style.color = 'black';
    modal.querySelector('i').classList.add('hide');
    modal.querySelector('#squad_remove').classList.add('hide');
  }


  if (student.house === 'Gryffindor'){
    document.querySelector('#student_photo').style.borderColor = "#FF493C";
  }
  if (student.house === 'Hufflepuff'){
    document.querySelector('#student_photo').style.borderColor = "#FFA35A";
  }
  if (student.house === 'Ravenclaw'){
    document.querySelector('#student_photo').style.borderColor = "#003276";
  }
  if (student.house === 'Slytherin'){
    document.querySelector('#student_photo').style.borderColor = "#038A00";
  }
  currentStudent = student;
}

function hideModal() {
  modal.classList.add('hide');
  document.querySelector('body').style.overflow = 'scroll';
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
  let studentsInHouse;
  if(house === "all"){
    studentsInHouse = allStudents;
  } else{
  studentsInHouse = allStudents.filter(student => student.house === house);
  }
  return studentsInHouse.length;
}


function expellStudentClicked(studentClicked) {
  if(studentClicked.lastName === 'Puk'){
    expellMe();
  }
  else{
  studentsExpelled.push(studentClicked);
  enrolledStudents = enrolledStudents.filter(student => student.id !== studentClicked.id);
  allStudents = allStudents.filter(student => student.id !== studentClicked.id);
}

  displayList(allStudents);
  updateStatus();
}

function expellMe(){
  document.querySelector('#warning').style.display = 'initial';
  document.querySelector('#audio').play();

  setTimeout(() => {
    document.querySelector('#warning').style.display = 'none';
    document.querySelector('video').style.display = 'initial';
    document.querySelector('video').play();    
  }, 3000);
}

function updateStatus() {
  document.querySelector('#g_count').innerHTML = count('Gryffindor');
  document.querySelector('#h_count').innerHTML = count('Hufflepuff');
  document.querySelector('#r_count').innerHTML = count('Ravenclaw');
  document.querySelector('#s_count').innerHTML = count('Slytherin');
  document.querySelector('#all_count').innerHTML = count('all');

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

document.querySelector('#squad').addEventListener('click', () => {
  addToSquad(currentStudent);
});
document.querySelector('#squad_remove').addEventListener('click', () => {
  removeFromSquad(currentStudent);
})





function addToSquad(studentClicked) {

  if (squadArr.includes(studentClicked)){
    alert("This student is already in the Inquisitorial Squad")
  }
   else if(studentClicked.blood === 'pure' || studentClicked.house === 'Slytherin'){
    squadArr.push(studentClicked);
    console.log(squadArr);
  }
    else{
    alert("This student cannot be assigned to the Inquisitorial Squad");
  }
  setTimeout(() => {
    console.log('I am removing the student form the squad')
  removeFromSquad(studentClicked);
  }, 3000);
}



function removeFromSquad(studentClicked) {
  console.log(studentClicked)
  let studentIndex = squadArr.findIndex(student => student.id === studentClicked.id);
  squadArr.splice(studentIndex, 1);
  console.log(squadArr);

}