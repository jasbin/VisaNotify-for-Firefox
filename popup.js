// document.getElementById('timeInterval').value = localStorage.getItem('timer');
let t = document.getElementsByClassName('time')[0].value = localStorage.getItem('time') ?? 30;
document.getElementById('timerDetails').innerHTML = "<p>Timer Set to <span style='color:blue'><strong>" + t + "</strong></span> seconds</p>";
document.getElementById('appointmentDate').innerHTML = localStorage.getItem('appointmentDate');

let allowedUrl = [
   'https://cgifederal.secure.force.com/applicanthome',
   'https://cgifederal.secure.force.com/ApplicantHome'
];


// check current tab url

chrome.tabs.query({ 'active': true, 'lastFocusedWindow': true, 'currentWindow': true }, function (tabs) {
   let currentUrl = tabs[0].url;
   if (currentUrl === allowedUrl[0] || currentUrl === allowedUrl[1]) {
      initialize(tabs);
   }

   chrome.tabs.sendMessage(tabs[0].id, { type: 'appointmentDate' }, function (response) {
      let t = document.getElementsByClassName('time')[0].innerText = response.timer ?? localStorage.getItem('timer');
      document.getElementById('appointmentDate').innerHTML = response.appointmentDate;
      localStorage.setItem('appointmentDate', response.appointmentDate);
   });
});

function initialize(tabs) {
   let btn = document.getElementsByClassName('set')[0];
   btn.disabled = false;
   btn.addEventListener('click', popup);
   let time = document.getElementsByClassName('time')[0];
   time.disabled = false;

   function popup(e) {

      if (isNaN(time.value)) {
         alert('Please enter time in seconds');
      } else {

         timeInSeconds = {
            type: 'timer',
            time: time.value ?? 30 // if time value is null set default value to 30 seconds
         }

         let params = {
            active: true,
            currentWindow: true
         }

         //sends query to content_scripts
         // chrome.tabs.query(params, gotTab);
         // function gotTab(tabs) {

         // }
         chrome.tabs.sendMessage(tabs[0].id, timeInSeconds, function (response) {
            let t = document.getElementsByClassName('time')[0].value = response.timer;
            localStorage.setItem('time', response.timer);
         });
      }
   }

}



