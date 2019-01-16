// jQuery Datepicker
// $(".datepicker").datepicker({
//   defaultDate: null,
//   prevText: "<",
//   nextText: ">",
//   changeMonth: true,
//   changeYear: true,
//   firstDay: 1,
//   yearRange: "1930:2017",
//   dateFormat: "dd.mm.yy",
//      onSelect: function(dateText, inst) {
//             $(".search").val(dateText);
//         }
// });
const endpoint = 'https://api.myjson.com/bins/1f4b4c';
let people = [];
let sicedPeople = [];
let filteredPeople;
fetch(endpoint)
.then(blob => blob.json())
.then(data => people.push(...data))
.then(() => people.map(elem =>
  elem.dateOfBirth = leadingZero(elem.dateOfBirth)
  ))
  .then(() => init());

  function init() {
    sliceArray(people, 5);
    displayContent(0);
    displayMatches();
  }


  function leadingZero(element) {
    const splitElement = element.split('.');
    return splitElement.map(e => e.length === 1 ? '0' + e : e).join('.');
  }
  function parseDate(element) {
    const splitElement = element.split(' ');
    return splitElement[0].split('.').reverse().join('.') + ' ' + splitElement[1];
  }

  function displayContent(page) {
  let suggestions = document.querySelector('.suggestions');
  let html = slicedPeople[page].map(person => {
    return `
    <tr>
    <td>${person.id}</td>
    <td>${person.firstName}</td>
    <td>${person.lastName}</td>
    <td>${person.dateOfBirth}</td>
    <td>${person.function}</td>
    <td>${person.experience}</td>
    </tr>
    `}).join("");
  suggestions.innerHTML = html;
  createButtons();
};

function sliceArray(arr, size) {
  slicedPeople = [];
  for (i = 0; i < arr.length; i += size) {
    slicedPeople.push(arr.slice(i, i + size));
  }
  return slicedPeople;
}

function createButtons() {
  const container = document.querySelector("#table1");

  for (i = 0; i < slicedPeople.length; i++) {
    const btn = document.createElement('button');

    btn.classList.add('page-button');
    btn.innerText = `${i + 1}`;
    btn.setAttribute('data-page', i);

    container.appendChild(btn);
  }
  switchPageListeners();
}

function switchPageListeners() {
  const buttons = document.querySelectorAll('.page-button');
  for (i = 0; i < buttons.length; i++) {
    let button = buttons[i];
    button.addEventListener('click', function () {
      const pageNumber = this.dataset.page;
      displayContent(pageNumber);
      ;
    });
  }
}

let result = 1;
function sortArray() {
  const elementProperty = this.dataset.property;

  if (elementProperty === 'dateOfBirth') {
    filteredPeople.sort((a, b) => {

      const x = new Date(parseDate(a.dateOfBirth)).getTime();
      const y = new Date(parseDate(b.dateOfBirth)).getTime();

      return x > y ? [result] : -[result];
    });
    sliceArray(filteredPeople, 5);
    displayContent(0);
    result = -result;

  } else {
    filteredPeople.sort((a, b) => a[elementProperty] > b[elementProperty] ? [result] : -[result]);
    sliceArray(filteredPeople, 5);
    displayContent(0);
    result = -result;
  }
}

function findMatches(wordToMatch, arr) {
  return filteredPeople = arr.filter(person => {
    const regex = new RegExp(wordToMatch, 'gi');
    return person.id.toString().match(regex)
      || person.firstName.match(regex)
      || person.lastName.match(regex)
      || person.dateOfBirth.toString().match(regex)
      || person.function.match(regex)
      || person.experience.toString().match(regex)
  });
}

function displayMatches(){
  findMatches(this.value, people);
  sliceArray(filteredPeople, 5);
  displayContent(0);
}



function resultsPerPage(){
  const results = this.value;
  if (results == /\s/ || results == 0) {
    sliceArray(filteredPeople, 5);
    displayContent(0);
  } else {
    sliceArray(filteredPeople, results);
    displayContent(0);
  }
}

function sortListeners() {
  const elements = document.querySelectorAll('.table-head');

  for (i = 0; i < elements.length; i++) {
    let element = elements[i];
    element.addEventListener('click', sortArray);
  }
}

// EVENT LISTENERS
document.addEventListener('DOMContentLoaded', sortListeners);

const searchInput = document.querySelector('.search');
searchInput.addEventListener('keyup', displayMatches);
searchInput.addEventListener('change', displayMatches);

const perPageInput = document.querySelector('.results-per-page');
perPageInput.addEventListener('keyup', resultsPerPage);
perPageInput.addEventListener('change', resultsPerPage);