// chrome.runtime.onInstalled.addListener(installedOrUpdated);
// import translate from "google-translate-api-browser";

chrome.browserAction.onClicked.addListener(function (tab) {
    // when the extension icon clicked on extensions bar
});

// وقتی نتیجه از وبسایت glosbe.com برگشت این متد اجرا میشه و با استفاده از parser کلمات از متن HTML برگردانده میشن و در نهایت ترجمه های با اعتبار تر برگردانده میشن.
function parseItems(text, parser) {
    let items = $('<div></div>').html(text.substring(text.indexOf('<body>') + 6, text.indexOf('</body>'))).find(parser);
    let words = [];
    items.each(function (i, e) {
        let word = $(e).text();
        if (words.filter(w => w.word.toLowerCase().trim() === word.toLowerCase().trim()).length) // add to count if the word already exists
            words.map(w => {
                if (w.word.toLowerCase().trim() === word.toLowerCase().trim()) w.count++;
                return w;
            });
        else // otherwise push it to the words array
            words.push({
                word,
                count: 1
            });
    });
    let c = 0;
    words = words.sort((a, b) => b.count - a.count).filter(w => w.count > 1 || c++ < 1); // sort by count and filter those which have count greater than 1
    let max = 3;
    if (words.length > max)
        words.length = max;
    return words;
}

// اینجا منتظر پیام های فایل contentscript میمانیم. وقتی پیام اومد که از گوگل ترجمه رو بگیره این کار رو انجام میده و نتیجه رو برمیگردونه و...
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    setTimeout(() => {
        if (request.type === 'FETCH_AND_PARSE') {
            fetch(request.url)
                .then(response => response.text())
                .then(text => parseItems(text, request.parser))
                .then(items => sendResponse(items))
                .catch(error => {
                    sendResponse(error);
                });
        }
    }, 1);
    return true;
});

// نمونه کد ارسال پیام به همه تب های مرورگر
function sendMessageToTabs(message) {
    chrome.tabs.query({url: "https://www.youtube.com*"}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            chrome.tabs.sendMessage(tabs[i].id, message, function (response) {
            });
        }
    });
}