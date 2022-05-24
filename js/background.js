function notifyWithAudio(){
  var myAudio = new Audio();
        myAudio.src = chrome.runtime.getURL("/audio/appointment_dates_available.ogg");
        myAudio.play();
}

function handleRequest(message) {
      if (message.type === 'notification') {
        browser.notifications.create({
          "type": "basic",
          "iconUrl": message.options.iconUrl,
          "title": message.options.title,
          "message": message.options.newAppointmentDate,
          "priority": 1
        });

        notifyWithAudio();

        localStorage.setItem('appointmentDate', message.options.newAppointmentDate);
    } 

    // receives timer data from content.js
    if (message.type === 'setTime'){
      localStorage.setItem('timer', message.data.timer);
    }

    if (message.type === 'setAppointmentDate'){
      localStorage.setItem('appointmentDate', message.data.appointmentDate);
    }
  
}

browser.runtime.onMessage.addListener(handleRequest);