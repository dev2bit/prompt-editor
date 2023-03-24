chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.accion == "setData") {
    chrome.storage.sync.set(request.storage, function() {
      sendResponse({ mensaje: "OK" });
    });
  }
  else if (request.accion == "getData") {
    chrome.storage.sync.get(request.keys, function(result) {
      sendResponse({ storage: result });
    });
    return true;
  }
  else if (request.accion == "Options") {
    chrome.runtime.openOptionsPage();
  }
});