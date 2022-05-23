"use strict";

// let timerAlreadySet = localStorage.getItem('timer');
// if (timerAlreadySet === null) {
//    console.log('timer value not set and is null');
// } else {
//    console.log(localStorage.getItem('timer'));
// }
let t = document.getElementById('timeInterval').value = localStorage.getItem('timer') ?? 60;
document.getElementById('timerDetails').innerHTML = "<p>Timer Set to <span style='color:blue'><strong>" + t + "</strong></span> seconds</p>";
document.getElementById('appointmentDate').innerHTML = localStorage.getItem('appointmentDate') ?? 'unable to fetch dates';

let allowedUrl = [
   'https://cgifederal.secure.force.com/applicanthome',
   'https://cgifederal.secure.force.com/ApplicantHome'
];

// // check current tab url
browser.tabs.query({
   currentWindow: true,
   active: true
}).then(sendMessageToTabs).catch(onError);

function onError(e) {
   console.log(e);
}
function sendMessageToTabs(tabs) {
   let currentUrl = tabs[0].url;

   // activate popup
   if (currentUrl === allowedUrl[0] || currentUrl === allowedUrl[1]) {
      initialize(tabs);
   }
}
function initialize(tabs) {
   try {
      let btn = document.getElementsByClassName('set')[0];
      btn.disabled = false;
      btn.addEventListener('click', popup);
      let time = document.getElementsByClassName('time')[0];
      time.disabled = false;

      function popup(e) {
         if (isNaN(parseInt(time.value))) {
            alert('Please enter time in seconds');
         }
         else {
            browser.tabs.sendMessage(
               tabs[0].id,
               {
                  type: 'timer',
                  time: time.value ?? 60 // if time value is null set default value to 60 seconds
               }
            ).then(response => { }).catch(onError);
            // immediately update the popup timer details when timer value is changed
            document.getElementById('timerDetails').innerHTML = "<p>Timer Set to <span style='color:blue'><strong>" + time.value + "</strong></span> seconds</p>";
         }
      }
   } catch (e) {
      onError(e);
   }

}



