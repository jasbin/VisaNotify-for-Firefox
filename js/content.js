"use strict";

let timer;
let timeout;
let errorMsg = 'Cannot get appointment date may be because account is not setup or may because of account suspension! please increase time interval for account ban issues!';

// receive message from popup.js
browser.runtime.onMessage.addListener(request => {
    // check when set button is clicked
    if (request.type === 'timer') {
        localStorage.setItem('timer', request.time);

        timer = request.time;


        clearTimeout(timeout);
        timeout = setTimeout(() => {
            window.location.reload();
        }, timer * 1000);

        // sends the updated timer to background.js localStorage
        browser.runtime.sendMessage({
            type: 'setTime',
            data: { timer: timer ?? localStorage.getItem('timer') }
        });

        alert('Timer set to ' + localStorage.getItem('timer') + ' seconds!');
    }
});

// set timer value
timer = (localStorage.getItem('timer') ?? 60) * 1000; //default value as 30 sec if null initially

// get appointment date
let node = document.getElementsByClassName('leftPanelText')[0];

let newAppointmentDate = null;

try {
    newAppointmentDate = node.innerText;

    // send current appointment date to background in every refresh
    browser.runtime.sendMessage({
        type: 'setAppointmentDate',
        data: { appointmentDate: newAppointmentDate ?? localStorage.getItem('appointmentDate') }
    });
} catch (error) {
    alert(errorMsg);
    clearTimeout(timeout);
}

let oldAppointmentDate = localStorage.getItem('appointmentDate') ?? null;
localStorage.setItem('appointmentDate', newAppointmentDate);
// sends the updated timer to background.js localStorage

if (newAppointmentDate !== null && oldAppointmentDate !== newAppointmentDate) {
    notify(newAppointmentDate);
    localStorage.setItem('appointmentDate', newAppointmentDate);
}

timeout = setTimeout(() => {
    window.location.reload();
}, timer);

function notify(newAppointmentDate) {
    browser.runtime.sendMessage({
        type: 'notification',
        options: {
            title: 'Visa Appointment Date',
            newAppointmentDate: newAppointmentDate,
            iconUrl: '/images/bell_16.png',
            type: 'basic'
        }
    });
}
