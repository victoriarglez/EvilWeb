class Data {
    #area = "local";

    constructor(_area) {
        if(_area != undefined) this.#area = _area;
    }

    async getAll() {
        let data = [];
        await chrome.storage[this.#area].get().then((_result) => {
            for(let i = 0; i < Object.keys(_result).length; i++) {
                if(Object.hasOwn(_result, "website" + intToString(i,99))) {
                    let tempObj = _result["website" + intToString(i,99)];
                    data[i] = new Website(i, tempObj.url, tempObj.isActive, tempObj.list);
                }
            }
        }).catch((_err) => {console.error(_err)});
        
        if(data.length === 0) return undefined;
        return data;
    }

    async getWebsite(_id) {
        if(_id != undefined ) {
            let data = null;
    
            await chrome.storage[this.#area].get("website" + intToString(_id,99)).then((_result) => {
                console.log(_result);
                let tempObj = _result["website" + intToString(_id,99)];
                data = new Website(_id, tempObj.url, tempObj.isActive, tempObj.list);
            }).catch((_err) => {console.error(_err)});
    
            return data;
        }
        return null;
    }

    async getList(_listName) {
        if(_listName != undefined) {
            let data = await this.getAll();
            if(data != undefined && data.length != 0) {
                let tempDataList = [];
                let i = 0;
                
                data.forEach((_site, _index) => {
                    if(_site.list === _listName) {
                        tempDataList[i] = _site;
                        i++;
                    }
                });

                if(tempDataList.length === 0) return undefined;

                return tempDataList;
            }
        }
        return false;
    }

    async newId() {
        let data = await this.getAll();
        
        if(data === undefined) return 0;
        return data.length;
    }
    
    async add(_website) {
        if(_website != undefined) {
            if(_website instanceof Website) {
                let tempStrgObj = {};
                let contentAdded = false;
                tempStrgObj["website" + intToString(_website.id, 99)] = _website;
                await chrome.storage[this.#area].set(tempStrgObj).then(() => {
                    console.log("content added");
                    contentAdded = true;
                }).catch((_err) => {console.error(_err)});
                return contentAdded;
            }
        }
        return false;
    }

    async edit(_oldWebsite, _newWebsite) {
        if(_oldWebsite != undefined && _newWebsite != undefined) {
            if(_oldWebsite instanceof Website && _newWebsite instanceof Website) {
                let contentUpdated = false;
                let tempStrgObj = {};
                tempStrgObj["website" + intToString(_oldWebsite.id, 99)] = _newWebsite;
                await chrome.storage[this.#area].set(tempStrgObj).then(() => {
                    console.log("content updated");
                    contentUpdated = true;
                }).catch((_err) => {console.error(_err)});
                return contentUpdated;
            }
        }
        return false;
    }

    async delete(_website) {
        console.log(_website);
        if(_website != undefined) {
            if(_website instanceof Website) {
                let contentDeleted = true;
                let data = await this.getAll();

                console.log(data);

                data.splice(_website.id, 1);
                
                console.log(data);

                data.forEach((_website, _index) => {
                    if(_website.id != _index) {
                        _website.id = _index;
                    }
                });

                await this.clear();

                data.forEach(async (_website) => {
                    contentDeleted *= await this.add(_website);
                });

                return contentDeleted;
            }
        }
        return false;
    }

    async clear() {
        let contentCleared = false;
        await chrome.storage[this.#area].clear().then(() => {
            console.log("content cleared");
            contentCleared = true;
        }).catch((_err) => {console.error(_err)});
        return contentCleared;
    }
}