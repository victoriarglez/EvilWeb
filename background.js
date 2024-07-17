let area = "local";
let currWebsite = null;

function intToString(_integrer, _maxVal) {
    if(_integrer < 0) return false;

    if(_maxVal < 10) return _integrer + "";
    if(_maxVal < 100) {
        if(_integrer < 10) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 1000) {
        if(_integrer < 10) return "00" + _integrer;
        if(_integrer < 100) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 10000) {
        if(_integrer < 10) return "000" + _integrer;
        if(_integrer < 100) return "00" + _integrer;
        if(_integrer < 1000) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 100000) {
        if(_integrer < 10) return "0000" + _integrer;
        if(_integrer < 100) return "000" + _integrer;
        if(_integrer < 1000) return "00" + _integrer;
        if(_integrer < 10000) return "0" + _integrer;
        return _integrer + "";
    }
    if(_maxVal < 1000000){
        if(_integrer < 10) return "00000" + _integrer;
        if(_integrer < 100) return "0000" + _integrer;
        if(_integrer < 1000) return "000" + _integrer;
        if(_integrer < 10000) return "00" + _integrer;
        if(_integrer < 100000) return "0" + _integrer;
        return _integrer + "";
    }
    return false;
}

class Website {
    id = -1;
    url = "";
    isActive = false;
    list = "";

    constructor(_id, _url, _isActive, _list) {
        this.id = parseInt(_id);
        this.url = _url;
        this.isActive = _isActive;
        this.list = _list;
    }
}

async function getAllData() {
    let data = [];

    await chrome.storage[area].get().then((_result) => {
        for(let i = 0; i < Object.keys(_result).length; i++) {
            if(_result["website" +  intToString(i, 99)]) {
                let tempObj = _result["website" +  intToString(i, 99)];
                data[i] = new Website(tempObj.id, tempObj.url, tempObj.isActive, tempObj.list);
            }
        }
    });

    if(data.length === 0) return 0;
    return data;
}

async function getCurrentTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    // `tab` will either be a `tabs.Tab` instance or `undefined`.
    let [tabs] = await chrome.tabs.query(queryOptions);

    if(Array.isArray(tabs)) return tabs[0];
    return tabs;
  }

chrome.tabs.onUpdated.addListener(async function(tabId, info) {
    if(info.status === "complete") {
        let tab = await getCurrentTab();
        let websites = await getAllData();
        let currWebsiteIndex = -1;
    
        if(websites){
            if(Array.isArray(websites)) {
                websites.forEach((_website, _index) => {
                    if(tab.url.includes(_website.url)) {
                        currWebsiteIndex = _index;
                    }
                });
        
                if(currWebsiteIndex != -1) {
                    if(websites[currWebsiteIndex].isActive) {
                        let message = {turnEvil: true};
                        await chrome.tabs.sendMessage(tab.id, message)
                        .catch((_err) => {
                            console.error(_err);
                        });
                        currWebsite = websites[currWebsiteIndex];
                    }
                }
            }
        }
    }
});

chrome.runtime.onMessage.addListener(async (_message) => {
    if(_message.website) {
        if(currWebsite != null) {
            if(_message.website.id === currWebsite.id) {
                if(_message.website.isActive != currWebsite.isActive) {
                    let tab = await getCurrentTab();
                    let message = {turnEvil: true};
                    await chrome.tabs.sendMessage(tab.id, message)
                    .then(() => {
                        currWebsite = _message.website;
                    })
                    .catch((_err) => {
                        console.error(_err);
                    });
                }
            }
        }
    }
});