function notifyWithAudio(){
  var myAudio = new Audio();
        myAudio.src = chrome.runtime.getURL("/audio/appointment_dates_available.ogg");
        myAudio.play();
}

function handleRequest(message) {
      if (message.type === 'notification') {
        browser.notifications.create({
          "type": "basic",
          "iconUrl": browser.extension.getURL(message.options.iconUrl),
          "title": message.options.title,
          "message": message.options.newAppointmentDate,
          "priority": 1
        });

        notifyWithAudio();

        localStorage.setItem('appointmentDate', message.options.newAppointmentDate);
    } 

    // receives request of new appointmentDate from popup.js
    if (message.type === 'getAppointmentDate'){
      let date = localStorage.getItem('appointmentDate');
      return Promise.resolve({appointmentDate: date});
    }

    // receives timer data from content.js
    if (message.type === 'setTimeAndDate'){
      localStorage.setItem('timer', message.data.timer);
      localStorage.setItem('appointmentDate', message.data.appointmentDate);
    }

    if (message.type === 'setAppointmentDate'){
      let date = localStorage.setItem('timer', message.timer);
    }
  
}

browser.runtime.onMessage.addListener(handleRequest);