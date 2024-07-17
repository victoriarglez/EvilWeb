class Website {
    static REGEX = {
        WITH_HTTP:  /(?:http:\/\/|https:\/\/)[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?\*?/,
        ANY_URL: /[http:\/\/|https:\/\]?[a-zA-Z0-9]+\.[a-zA-Z0-9]+\.[a-zA-Z0-9]+\/?\*?/
    }

    static validateURL(_url) {
        return Website.REGEX.ANY_URL.test(_url);
    }

    static async isStored(_url) {
        if(_url != undefined) {
            let data = new Data();
            let websites = await data.getAll();
            let returnWebsite = null;
            
            if(websites) {
                if(websites.length === 0) return false;
    
                websites.forEach((_website, _index) => {
                    if(_url.includes(_website.url))
                        returnWebsite = _website;
                });
                
                if(returnWebsite === null) return false;
    
                return returnWebsite;
            }
        }
        return false;
    }

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

    getListItem() {
        return new ListItem(this.id, this.url);
    }
}