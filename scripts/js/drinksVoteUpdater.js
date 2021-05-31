class DrinksVoteUpdater {
    constructor(interval = 3) {
        this._interval = interval;
    }
    static get instance() {
        return DrinksVoteUpdater._instance;
    }
    set userId(value) {
        this._userID = value;
        this.update();
        window.setInterval(this.update, this._interval * 1000);
    }
    get userId() {
        return this._userID;
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
                userId: DrinksVoteUpdater.instance.userId
            },
            "success": function (data) {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 1; j < 3; j++) {
                        document.querySelectorAll("tr")[i].querySelectorAll("td")[j - 1]
                            .innerHTML = data[i][j];
                    }
                    document.getElementById(("drinks-plus-btn-" + i)).disabled = data[i][3];
                    document.getElementById(("drinks-plus-btn-" + i)).onclick = function () {
                        submitVote(DrinksVoteUpdater.instance.userId, data[i][0], VoteType.drinkAdd);
                        DrinksVoteUpdater.instance.update();
                    };
                    document.getElementById(("drinks-minus-btn-" + i)).disabled = data[i][4];
                    document.getElementById(("drinks-minus-btn-" + i)).onclick = function () {
                        submitVote(DrinksVoteUpdater.instance.userId, data[i][0], VoteType.drinkRemove);
                        DrinksVoteUpdater.instance.update();
                    };
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