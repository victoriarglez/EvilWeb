$(document).ready(function() {
    $("div.switch").each(function() {
        let _val = $(this).children(".switch-input").prop("checked");
        if(_val) $(this).addClass("switch-is-selected");
    });
});

$("div.switch").click(function() {
    if(!$(this).children(".switch-input").attr("disabled")) {
        let _input = $(this).children(".switch-input").get(0);
        let _val = $(this).children(".switch-input").prop("checked");
        $(this).toggleClass("switch-is-selected");
        _input.checked = !_val;
    }
});