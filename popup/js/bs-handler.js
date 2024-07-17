class Icon {
    constructor(_tag, _class) {
        this.html = $("<" + _tag + "></" + _tag + ">");
        this.html.addClass(_class.split("-")[0]);
        this.html.addClass(_class);
    }
}

class Toast {

    #themes = {
        primary: {
            color: "alert-primary",
            icon: "bi-dash-square"
        },
        secondary: {
            color: "alert-secondary",
            icon: "bi-question-octagon"
        },
        success:{
            color: "alert-success",
            icon: "bi-check-circle"
        },
        danger:{
            color: "alert-danger",
            icon: "bi-exclamation-triangle-fill"
        },
        warning:{
            color: "alert-warning",
            icon: "bi-exclamation-circle-fill"
        },
        info:{
            color: "alert-info",
            icon: "bi-info"
        },
        light:{
            color: "alert-light",
            icon: "bi-dash"
        },
        dark:{
            color: "alert-dark",
            icon: "bi-plus-lg"
        }
    }

    #container = {
        html: $("<div></div>"),
        flex: {
            html: $("<div></div>"),
            body: {
                html: $("<div></div>"),
                icon: null,
                txt: ""
            },
            dismiss: $("<button></button>")
        }
    }

    constructor(_id, _msg, _theme, _icon) {
        if(_id === undefined) return false;
        if(_theme === undefined) return false;
        
        this.id = _id;
        this.theme = _theme;

        this.#container.flex.body.txt = (_msg) ? " " +_msg : "";
        this.#container.flex.body.icon = (_icon) ? _icon : null;

        if(!this.#createComponent()) return false;
    }

    #createComponent() {
        if(this.msg != "") {
            this.#container.html.prop("id", this.id);
            this.#container.html.addClass("toast"); 
            this.#container.html.addClass("align-items-center");
            this.#container.html.addClass("border-0");
            this.#container.html.addClass("m-3");
            this.#container.html.addClass("text-bg-" + this.theme);
            this.#container.html.attr("role", "alert");
            this.#container.html.attr("aria-live", "assertive");
            this.#container.html.attr("aria-atomic", "true");

            this.#container.flex.html.addClass("d-flex");

            this.#container.flex.body.html.addClass("toast-body");

            if(this.#container.flex.body.icon == null) {
                this.#container.flex.body.icon = new Icon("i", this.#themes[this.theme].icon)
            }
            this.#container.flex.body.icon.html.addClass("lm-4");

            this.#container.flex.dismiss.addClass("btn-close");
            this.#container.flex.dismiss.addClass("me-2");
            this.#container.flex.dismiss.addClass("m-auto");
            this.#container.flex.dismiss.attr("type", "button");
            this.#container.flex.dismiss.attr("data-bs-dismiss", "toast");
            this.#container.flex.dismiss.attr("aria-label", "Close");

            this.#container.flex.body.html.append(this.#container.flex.body.icon.html);
            this.#container.flex.body.html.append(this.#container.flex.body.txt);

            this.#container.flex.html.append(this.#container.flex.body.html);
            this.#container.flex.html.append(this.#container.flex.dismiss);

            this.#container.html.append(this.#container.flex.html);
        }
        return false;
    }

    getComponent() {
        return this.#container.html;
    }

    static InvalidURL(_id) {
        let _tst = new Toast(_id, "The URL is not valid.", "danger");
        return _tst.getComponent();
    }
}

class ListGroup {
    html = $("<ul></ul>");

    constructor(_items) {
        this.html.addClass("list-group");
        if(_items) {
            if(Array.isArray(_items)) {
                _items.forEach((_item, _index) => {
                    this.html.append(_item.getComponent());
                });
            } else {
                this.html.append(_items.getComponent());
            }
        } else {
            _items = new ListItem("emptyItem", "No data found");
            let temp = _items.getComponent();
            this.html.append(temp);
        }
    }
}

class ListItem {
    #id = null;

    listItem = {
        html: $("<li></li>"),
        url: "" ,
        actions:{
            html: $("<div></div>"),
            edit: {
                html: $("<button></button>"),
                icon: $("<span></span>")
            },
            remove: {
                html: $("<button></button>"),
                icon: $("<i></i>")
            }
        }
    }

    constructor(_id, _txt) {
        if(_id != undefined) {
            this.#id = _id;
            this.listItem.actions.edit.html.prop("id", this.#id);
            this.listItem.actions.remove.html.prop("id", this.#id);
            this.listItem.url = (_txt) ? _txt : "";
            this.#createComponent();
        } else {
            return false;
        }
    }

    #createComponent() {
        if(this.#id != null) {
            this.listItem.html.addClass("list-group-item");
            this.listItem.html.addClass("d-flex");
            this.listItem.html.addClass("justify-content-between");
            this.listItem.html.addClass("align-items-center");

            this.listItem.actions.html.addClass("btn-group");

            this.listItem.actions.edit.html.addClass("btn");
            this.listItem.actions.edit.html.addClass("btn-sm");
            this.listItem.actions.edit.html.addClass("btn-warning");
            this.listItem.actions.edit.html.addClass("ew-list-item-edit");
            this.listItem.actions.edit.html.attr("type", "button");
            this.listItem.actions.edit.html.attr("data-bs-toggle", "modal");
            this.listItem.actions.edit.html.attr("data-bs-target", "#editListItemModal");
            this.listItem.actions.edit.icon.addClass("mdi");
            this.listItem.actions.edit.icon.addClass("mdi-pencil");

            this.listItem.actions.remove.html.addClass("btn");
            this.listItem.actions.remove.html.addClass("btn-sm");
            this.listItem.actions.remove.html.addClass("btn-danger");
            this.listItem.actions.remove.html.addClass("ew-list-item-remove");
            this.listItem.actions.remove.html.attr("type", "button");
            this.listItem.actions.remove.html.attr("data-bs-toggle", "modal");
            this.listItem.actions.remove.html.attr("data-bs-target", "#removeListItemModal");
            this.listItem.actions.remove.icon.addClass("bi");
            this.listItem.actions.remove.icon.addClass("bi-trash3-fill");

            if(this.#id === "emptyItem") {
                this.listItem.actions.edit.html.attr("disabled", true);
                this.listItem.actions.remove.html.attr("disabled", true);
            } else {
                this.listItem.actions.edit.html.attr("data-bs-listId", this.#id);
                this.listItem.actions.remove.html.attr("data-bs-listId", this.#id);
            }
        }
        return false;
    }

    #appendList() {
        this.listItem.actions.edit.html.append(this.listItem.actions.edit.icon);
        this.listItem.actions.remove.html.append(this.listItem.actions.remove.icon);
        this.listItem.actions.html.append(this.listItem.actions.edit.html);
        this.listItem.actions.html.append(this.listItem.actions.remove.html);
        this.listItem.html.append(this.listItem.url);
        this.listItem.html.append(this.listItem.actions.html);
    }

    getComponent() {
        this.#appendList();
        return this.listItem.html;
    }
}

class Spinner {
    container = {
        html: $("<div></div>"),
        spinner: {
            html: $("<div></div>"),
            span: $("<span></span>")
        }
    }

    constructor() {
        this.container.html.addClass("d-flex");
        this.container.html.addClass("justify-content-center");

        this.container.spinner.html.addClass("spinner-border");
        this.container.spinner.html.attr("role", "status");

        this.container.spinner.span.addClass("visually-hidden");
        this.container.spinner.span.html("Loading...");

        this.container.spinner.html.append(this.container.spinner.span);
        this.container.html.append(this.container.spinner.html);
    }

    getHtml() {
        return this.container.html.html();
    }

    static load(){
        let spinner = new Spinner();
        return spinner.getHtml();
    }
}