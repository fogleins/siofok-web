class DrinksVoteUpdater {
    constructor(interval = 3) {
        this._interval = interval;
        window.setInterval(this.update, this._interval * 1000);
        this.update();
    }
    static get instance() {
        return DrinksVoteUpdater._instance;
    }
    set userId(value) {
        this._userID = value;
    }
    get interval() {
        return this._interval;
    }
    set interval(value) {
        this._interval = value;
    }
    update() {
        $.ajax({
            "url": "vote_updater.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                userId: this._userID
            },
            "success": function (data) {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 1; j < 3; j++) {
                        document.querySelectorAll("tr")[i].querySelectorAll("td")[j - 1]
                            .innerHTML = data[i][j];
                    }
                    console.log(data);
                    document.getElementById(("drinks-plus-btn-" + data[i][0])).disabled = data[i][3];
                    console.log("első ok");
                    document.getElementById(("drinks-minus-btn-" + data[i][0])).disabled = data[i][4];
                }
            },
            "error": function (err) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
}
DrinksVoteUpdater._instance = new DrinksVoteUpdater();
//# sourceMappingURL=drinksVoteUpdater.js.map