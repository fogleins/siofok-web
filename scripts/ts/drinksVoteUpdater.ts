class DrinksVoteUpdater {
    // The number of seconds between updates
    private _interval: number;
    private _userID: number;
    private static _instance: DrinksVoteUpdater = new DrinksVoteUpdater();

    static get instance() {
        return DrinksVoteUpdater._instance;
    }

    /**
     * Creates a DrinksVoteUpdater object.
     * @param interval The number of seconds between updates.
     */
    private constructor(interval: number = 3) {
        this._interval = interval;
        window.setInterval(this.update, this._interval * 1000);
        this.update();
    }

    set userId(value: number) {
        this._userID = value;
    }

    get interval() {
        return this._interval;
    }

    /**
     * @param value The number of seconds after an update should occur.
     */
    set interval(value: number) {
        this._interval = value;
    }

    // FIXME: sometimes the wrong button gets disabled
    update(): void {
        $.ajax({
            "url": "vote_updater.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                userId: this._userID
            },
            "success": function (data: any) {
                for (let i = 0; i < data.length; i++) {
                    for (let j = 1; j < 3; j++) {
                        document.querySelectorAll("tr")[i].querySelectorAll("td")[j - 1]
                            .innerHTML = data[i][j];
                    }
                    document.getElementById(("drinks-plus-btn-" + data[i][0])).disabled = data[i][3];
                    document.getElementById(("drinks-minus-btn-" + data[i][0])).disabled = data[i][4];
                }
            },
            "error": function (err: any) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
}
