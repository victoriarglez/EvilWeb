class EvilWeb {

    #_TOAST_COUNTER_ = -1;
    #_LAST_LIST_VIEWED_ = "";
    #_ACTIVE_TAB_URL_ = "";

    #_INVALID_URL_TOAST_(){
        let invalid = Toast.InvalidURL("#TOAST" + this.#_TOAST_COUNTER_);
        let container = $("#toastPlaceHolder");
        container.prepend(invalid);
        invalid.toast("show");
        this.#_TOAST_COUNTER_++;
    }

    Modal = {
        ClearList: {
            modal: $("#clearListModal"),
            header: $("#clearListHeaderModal"),
            body: $("#clearListBodyModal")
        },
        EditFromList: {
            modal: $("#editListItemModal"),
            header: $("#editListItemHeaderModal"),
            siteId: $("#siteIdEditModal"),
            siteUrl: $("#siteUrlEditModal"),
            selectList: $("#selectListEditModal"),
            updateBtn: $("#updateBtnEditModal"),
            cancelBtn: $("#cancelBtnEditModal")
        },
        RemoveFromList: {
            modal: $("#removeListItemModal"),
            header: $("#removeListItemHeaderModal"),
            body: $("#removeListItemBodyModal"),
            siteId: $("#removeListItemIdBodyModal"),
            confirmBtn: $("#removeListItemConfirm")
        },
        ConfirmInputAnimation: {
            modal: $("#confirmInputModal"),
            animation: $("#confirmInputModal")
        }
    }
    
    Page = {
        ViewList: {
            header: $("#headerViewListTitle"),
            listDiv: $("#viewListContainer"),
            addBtn: $(".ew-add-to-list"),
            clearBtn: $(".ew-clear-list"),
            goBackBtn: $("#pageViewList")
        },
        AddToList: {
            header: $("#headerAddListTitle"),
            form: {
                siteURL: $("#siteUrlAdd"),
                list: $("#listNameAdd"),
                addToListBtn: $("#addItemToList"),
                cancelBtn: $("#cancelAddList")
            },
            goBackBtn: $("#goBackFromAddList")
        }
    }

    constructor() {
        this.#_TOAST_COUNTER_ = 0;
        this.#_LAST_LIST_VIEWED_ = "";
        this.#_ACTIVE_TAB_URL_ = "";
    }

    async initializeApp() {
        let tab = await EvilWeb.getCurrentTab();
        let website = await Website.isStored(tab.url);
        this.#_ACTIVE_TAB_URL_ = tab.url;
        
        if(website.list === "white" && website.isActive === true) {
            $("#switchColor").prop("checked", true);
        } else if(website.list === "black") {
            $("#switchColor").attr("disabled", true);
        }
    }

    /* LOAD HTML */

    async loadList(_listName) {
        if(_listName === undefined) _listName = this.#_LAST_LIST_VIEWED_;

        $("#viewListContainer").html(Spinner.load());

        let data = new Data();
        let list = await data.getList(_listName);
        let listHtml = [];
        let listGroup = null;

        if(list) {
            list.forEach((_website, _index) => {
                listHtml[_index] = _website.getListItem();
            });

            listGroup = new ListGroup(listHtml);
        } else {
            listGroup = new ListGroup(false);
        }

        $("#viewListContainer").html(listGroup.html);
    }

    inputValidation(_input, _isValid, _callToast) {
        if(_isValid){
            if(_input.hasClass("is-invalid")) _input.removeClass("is-invalid");
            return true;
        } else {
            _input.addClass("is-invalid");
            if(_callToast === undefined) return;
            if(_callToast === "url") this.#_INVALID_URL_TOAST_();
            return false;
        }
    }

    /* LOAD PAGE */

    loadPage(_targetPage) {
        let currPage = $("#" + $(".ew-active").prop("id"));
        
        
        currPage.animate({opacity: 0},500, 
            function() {
                currPage.removeClass("ew-active");
                _targetPage.addClass("ew-active");
                _targetPage.animate({opacity: 1}, 500);
            }
        );

        if(!$("#pageAddList").hasClass("ew-active")) {
            this.Page.AddToList.form.siteURL.val("");
        }
    }

    loadHome() {
        this.loadPage($("#pageHome"));
    }

    async loadViewList(_buttonId) {
        if(_buttonId === undefined) {
            if(this.#_LAST_LIST_VIEWED_ === "") return false;
            _buttonId = this.#_LAST_LIST_VIEWED_ + "Btn";
        } else {
            this.#_LAST_LIST_VIEWED_ = (_buttonId === "whiteBtn") ? "white" : (_buttonId === "blackBtn") ? "black" : "invalid";
        }
        
        let list = (_buttonId === "whiteBtn") ? "white" : (_buttonId === "blackBtn") ? "black" : "invalid";

        if(list != "invalid") {
            this.Page.ViewList.header.html((list === "white") ? "White List" : "Black List");
            this.Page.ViewList.listDiv.html(await this.loadList(list));
            this.Page.ViewList.addBtn.attr("data-bs-list", (list === "white") ? "white list" : "black list");
            this.Page.ViewList.clearBtn.attr("data-bs-list", list);
            this.Modal.ClearList.header.html((list === "white") ? "white list" : "black list");
            this.Modal.ClearList.body.html((list === "white") ? "white list" : "black list");
            this.loadPage($("#pageViewList"));
        }
    }

    loadAddList(_listName) {
        this.Page.AddToList.header.html(_listName);
        this.Page.AddToList.form.list.val(_listName.split(" ")[0]);
        this.loadPage($("#pageAddList"));
    }

    /* LOAD MODAL */

    async loadEditModal(_id) {
        let data = new Data();
        let site = await data.getWebsite(_id);

        this.Modal.EditFromList.header.html(site.url);
        this.Modal.EditFromList.siteId.val(site.id);
        this.Modal.EditFromList.siteUrl.val(site.url);
        this.Modal.EditFromList.selectList.children().each(function() {
            if($(this).val() === site.list) {
                $(this).attr("selected", true);
            } else {
                $(this).attr("selected", false);
            }
        });
    }

    async loadRemoveModal(_id) {
        let data = new Data();
        let site = await data.getWebsite(_id);

        this.Modal.RemoveFromList.header.html(site.url);
        this.Modal.RemoveFromList.body.html(site.url);
        this.Modal.RemoveFromList.siteId.val(site.id);
    }

    /* ACTIONS WITH DATA */

    async addWebsite(_url) {
        if(_url != undefined) {
            let data = new Data();
            let tempId = await data.newId();
            let tempActive = (this.#_LAST_LIST_VIEWED_ === "black") ? false : true;
            let tempWeb = new Website(tempId, _url, tempActive, this.#_LAST_LIST_VIEWED_);
            
            return await data.add(tempWeb);
        }
        return false;
    }

    async editWebsite(_id, _url, _list, _isActive) {
        if(_id != undefined) {
            let data = new Data();
            let oldWebsite = await data.getWebsite(_id);
            let newWebsite = await data.getWebsite(_id);

            newWebsite.url = (_url != undefined) ? _url : oldWebsite.url;
            newWebsite.list = (_list != undefined) ? _list : oldWebsite.list;
            newWebsite.isActive = (_isActive != undefined) ? _isActive : oldWebsite.isActive;
            
            return await data.edit(oldWebsite, newWebsite);
        }
        return false;
    }

    async removeWebsite(_id) {
        if(_id != undefined) {
            let data = new Data();
            let website = await data.getWebsite(_id);
            
            return await data.delete(website);
        }
        return false;
    }

    /* CHROME EXTENSION ACTIONS */
    static async getCurrentTab() {
        let queryOptions = {active: true, lastFocusedWindow: true};
        let tabs = await chrome.tabs.query(queryOptions);
        return tabs[0];
    }

    async getCurrentWebsite() {
        return await Website.isStored(this.#_ACTIVE_TAB_URL_);
    }
}