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
const endpoint = 'https://api.myjson.com/bins/agowj';
let people = [];
let sicedPeople = [];
fetch(endpoint)
  .then(blob => blob.json())
  .then(data => people.push(...data))
  .then(() => sliceArray(people, 5))
  .then(() => displayContent(0));

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
  for (i=0; i < arr.length; i += size){
    slicedPeople.push(arr.slice(i, i + size));
  }
  return slicedPeople;
}

function createButtons() {
  const container = document.querySelector("#table1");

  for (i=0; i<slicedPeople.length; i++){
    const btn = document.createElement('button');

    btn.classList.add('page-button');
    btn.innerText = `${i+1}`;
    btn.setAttribute('data-page', i);

    container.appendChild(btn);
  }
  switchPage();
}

function switchPage(){
  const buttons = document.querySelectorAll('.page-button');
  for(i=0; i < buttons.length; i++){
    let button = buttons[i];
    button.addEventListener('click', function() {
      const pageNumber = this.dataset.page;
      displayContent(pageNumber);
      ;});
  }
}
