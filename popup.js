"use strict";

let t = document.getElementById('timeInterval').value = localStorage.getItem('timer') ?? 60;
document.getElementById('timerDetails').innerHTML = "<p>Timer Set to <span style='color:blue'><strong>" + t + "</strong></span> seconds</p>";
// document.getElementById('appointmentDate').innerHTML = localStorage.getItem('appointmentDate');

let allowedUrl = [
   'https://cgifederal.secure.force.com/applicanthome',
   'https://cgifederal.secure.force.com/ApplicantHome'
];

// hande response from background.js(it responds latest appointment date from its localStorage)
function handleResponse(message) {
   console.log(message);
   document.getElementById('appointmentDate').innerText = message.appointmentDate;
}

function handleError(error) {
   console.log(`Error: ${error}`);
}

let sending = browser.runtime.sendMessage({
   type: "getAppointmentDate"
});
sending.then(handleResponse, handleError);

// check current tab url
browser.tabs.query({
   currentWindow: true,
   active: true
}).then(sendMessageToTabs).catch(onError);

function sendMessageToTabs(tabs) {
   let currentUrl = tabs[0].url;
   // activate popup
   if (currentUrl === allowedUrl[0] || currentUrl === allowedUrl[1]) {
      initialize(tabs);
   }

   // initialize the popup
   browser.tabs.sendMessage(
      tabs[0].id,
      {
         type: 'timer',
         time: time.value ?? 60 // if time value is null set default value to 60 seconds
      }
   ).then(response => {
      // document.getElementsByClassName('time')[0].innerText = response.timer ?? localStorage.getItem('timer');
      // document.getElementById('appointmentDate').innerHTML = response.appointmentDate;
      // localStorage.setItem('appointmentDate', response.appointmentDate);
   }).catch(onError);
}

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
         browser.tabs.sendMessage(
            tabs[0].id,
            {
               type: 'timer',
               time: time.value ?? 60 // if time value is null set default value to 60 seconds
            }
         ).then(response => {
            // // update the popup.html timer and appointment date
            // let t = document.getElementsByClassName('time')[0].value = response.timer;
            // document.getElementById('appointmentDate').innerHTML = response.appointmentDate;
            // // localStorage.setItem('appointmentDate', response.appointmentDate);
            // // localStorage.setItem('timer', response.timer);
         }).catch(onError);

      }
   }

}



