let siteHdlr = null;

$(document).ready(async function() {
    siteHdlr = new EvilWeb();
    await siteHdlr.initializeApp();
    $("#" + $(".ew-active").prop("id")).css({opacity: 1});
});

$(".ew-view-list").click( async function() {
    await siteHdlr.loadViewList($(this).prop("id"));
});

$(".ew-add-to-list").click(function() {
    siteHdlr.loadAddList($(this).attr("data-bs-list"));
});

$("#goBackFromViewList").click(function() {
    siteHdlr.loadHome();
});

$("#addItemToList").click(async function() { 
    if(siteHdlr.inputValidation($("#siteUrlAdd"), Website.validateURL($("#siteUrlAdd").val()), "url")) {
        await siteHdlr.addWebsite($("#siteUrlAdd").val());
        $("#confirmInputModal").modal("show");
        $("#siteUrlAdd").val("");
    }
});

$("#goBackFromAddList").click(async function() {
    await siteHdlr.loadViewList();
});

$("#updateBtnEditModal").click(async function() {
    if(siteHdlr.inputValidation($("#siteUrlEditModal"), Website.validateURL($("#siteUrlEditModal").val()), "url")) {
        await siteHdlr.editWebsite($("#siteIdEditModal").val(),$("#siteUrlEditModal").val(),$("#selectListEditModal").val());
        $("#confirmInputModal").modal("show");
        $("#editListItemModal").modal("hide");
        siteHdlr.loadList();
    }
});

$("#cancelBtnEditModal").click(function() {
    siteHdlr.inputValidation($("#siteUrlEditModal"), true);
});

$("#removeListItemConfirm").click(async function() {
    await siteHdlr.removeWebsite($("#removeListItemIdBodyModal").val());
    $("#confirmInputModal").modal("show");
    $("#removeListItemModal").modal("hide");
    siteHdlr.loadList();
});

$("div.switch").click(async function() {
    let isActive = $("#switchColor").prop("checked");
    let website = await siteHdlr.getCurrentWebsite();
    website.isActive = isActive;
    await siteHdlr.editWebsite(website.id, website.url, website.list, website.isActive);

    let message = {website: website, switch: isActive};
    chrome.runtime.sendMessage(message);
});

$("#confirmInputModal").on("focusin", function() {
    $("#confirmInputAnimationModal").addClass("checkmark-circle-active");
    setTimeout(() => {
        $("#confirmInputModal").modal("hide");
    },2000);
});

$("#confirmInputModal").on("hide.bs.modal", function() {
    $("#confirmInputAnimationModal").removeClass("checkmark-circle-active");
});

$(document).on("click", ".ew-list-item-edit", async function() {
    await siteHdlr.loadEditModal($(this).attr("data-bs-listId"));
});

$(document).on("click", ".ew-list-item-remove", async function() {
    await siteHdlr.loadRemoveModal($(this).attr("data-bs-listId"));
});