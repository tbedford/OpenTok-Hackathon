
var apiKey, sessionId, token;
var session;
var publisher;
var SERVER_BASE_URL = 'http://localhost:9000';

fetch('/session').then(function (res) {
  return res.json()
}).then(function (res) {
  console.log(res);
  apiKey = res.apiKey;
  sessionId = res.sessionId;
  token = res.token;
  initializeSession();
}).catch(handleError);


// Handling all of our errors here by alerting them
function handleError(error) {
  if (error) {
    alert(error.message);
  }
}

function initializeSession() {
  session = OT.initSession(apiKey, sessionId);

  // Subscribe to a signal event
  session.on('signal', function (event) {
    console.log("Event data: ", event);
    console.log("From: ", event.from.id);
    console.log("Signal data: " + event.data);
  });

  // Subscribe to a newly created stream
  session.on('streamCreated', function (event) {
    session.subscribe(event.stream, 'subscriber', {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    }, handleError);
  });

  session.on('sessionConnected', function (event) {
    console.log("Session Connected: Event data: ", event)
  });

  // Create a publisher
  publisher = OT.initPublisher('publisher', {
    insertMode: 'append',
    width: '100%',
    height: '100%'
  }, handleError);

  // Connect to the session
  session.connect(token, function (error) {
    // If the connection is successful, publish to the session
    if (error) {
      handleError(error);
    } else {
      session.publish(publisher, handleError);
    }
  });
}

function listArchives() {
  //alert('List archives');
  fetch('/archive/list').then(function (res) {
    return res.json()
  }).then(function (res) {
    console.log(res);
  }).catch(handleError);
}

function startArchive() {
  //alert('Start archive');
  fetch('/archive/start').then(function (res) {
    return res.json()
  }).then(function (res) {
    console.log(res);
  }).catch(handleError);
}

function stopArchive() {
  //alert('Stop archive');
  fetch('/archive/stop').then(function (res) {
    return res.json()
  }).then(function (res) {
    console.log(res);
  }).catch(handleError);
}

function broadcastMsg() {
  //alert('Broadcast Msg');
  fetch('/broadcast/msg').then(function (res) {
    return res.json()
  }).then(function (res) {
    console.log(res);
  }).catch(handleError);
}

function screenShare() {
  OT.checkScreenSharingCapability(function (response) {
    if (!response.supported || response.extensionRegistered === false) {
      // This browser does not support screen sharing.
    } else if (response.extensionInstalled === false) {
      // Prompt to install the extension.
    } else {
      // Screen sharing is available. Publish the screen.
      var publisher = OT.initPublisher('screen-preview',
        { videoSource: 'screen', width: '100%', height: '100%', insertMode: 'append' },
        function (error) {
          if (error) {
            // Look at error.message to see what went wrong.
          } else {
            session.publish(publisher, function (error) {
              if (error) {
                // Look error.message to see what went wrong.
              }
            });
          }
        }
      );
    }
  });
}  
