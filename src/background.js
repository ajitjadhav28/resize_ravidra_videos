
'use strict';

chrome.runtime.onInstalled.addListener(function() {

  chrome.storage.sync.set(
    {
      autoplay: true,
      autoresize: false
    },
    res => console.log('Set initial values')
  );

  chrome.storage.onChanged.addListener(function (changes, names) {
    console.log(changes, names)
  })

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'eclassesbyravindra.com'},
      })],
      actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
