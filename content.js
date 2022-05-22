"use strict";

let timer;
let errorMsg = 'Cannot get appointment date may be because account is not setup or may because of account suspension! please increase time interval for account ban issues!';

// receive message from popup.js
browser.runtime.onMessage.addListener(request => {
    // check when set button is clicked
    if (request.type === 'timer') {
        localStorage.setItem('timer', request.time);

        timer = request.time;

        // sends response to popup.js
        // sendResponse({ timer: timer, appointmentDate: localStorage.getItem('appointmentDate') ?? 'Waiting For Appointment Date...' });

        let timeout = setTimeout(() => {
            window.location.reload();
        }, timer * 1000);

        // delay the alert otherwise Promise will be execute first and this cant send alert
        setTimeout(function () {
            //your code to be executed after 1 second
            alert('Timer set to ' + localStorage.getItem('timer') + ' seconds!');
        }, 1);

        return Promise.resolve({ timer: timer, appointmentDate: localStorage.getItem('appointmentDate') ?? 'Waiting For Appointment Date...' });
    }
    // check when popup is opened
    if (request.type === 'appointmentDate') {
        // sendResponse({ timer: timer, appointmentDate: localStorage.getItem('appointmentDate') ?? 'Waiting For Appointment Date...' });
        return Promise.resolve({ timer: timer, appointmentDate: localStorage.getItem('appointmentDate') ?? 'Waiting For Appointment Date...' });
    }

});

// set timer value
timer = (localStorage.getItem('timer') ?? 30) * 1000; //default value as 30 sec if null initially

// get appointment date
let node = document.getElementsByClassName('leftPanelText')[0];

let newAppointmentDate = null;

try {
    newAppointmentDate = node.innerText;
} catch (error) {
    alert(errorMsg);
    clearTimeout(timeout);
}

let oldAppointmentDate = localStorage.getItem('appointmentDate') ?? null;
localStorage.setItem('appointmentDate', newAppointmentDate);
if (newAppointmentDate !== null && oldAppointmentDate !== newAppointmentDate) {
    notify(newAppointmentDate);
    localStorage.setItem('appointmentDate', newAppointmentDate);
}

let timeout = setTimeout(() => {
    window.location.reload();
}, timer);

function notify(newAppointmentDate) {
    browser.runtime.sendMessage({
        type: 'notification',
        options: {
            title: 'Visa Appointment Date',
            message: newAppointmentDate,
            iconUrl: '/images/bell_16.png',
            type: 'basic'
        }
    });
}
