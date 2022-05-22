function notify(message) {
      if (message.type === 'notification') {
        browser.notifications.create({
          "type": "basic",
          "iconUrl": browser.extension.getURL(message.options.iconUrl),
          "title": message.options.title,
          "message": message.options.message,
          
          "priority": 1
        });

        var myAudio = new Audio();
        myAudio.src = chrome.runtime.getURL("/audio/appointment_dates_available.ogg");
        myAudio.play();
    } 
  
}

browser.runtime.onMessage.addListener(notify);