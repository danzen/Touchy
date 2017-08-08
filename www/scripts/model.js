
var app = function(app) {

    var data = app.data = {wins:0, ties:0, losses:0};

    if (localStorage && localStorage.data) {
        data = app.data = JSON.parse(localStorage.data);
    }
    app.updateData = function(type) { // type will be "wins", "ties", "losses"
        data[type]++;
        if (localStorage) localStorage.data = JSON.stringify(data);
    }
    app.clearData = function() {
        data = app.data = {wins:0, ties:0, losses:0};
        if (localStorage) localStorage.data = JSON.stringify(data);
    }

    return app;
}(app || {});
