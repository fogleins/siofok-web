class DrinksVoteUpdater {
    // The number of seconds after we update
    private _interval: number;

    /**
     * Creates a DrinksVoteUpdater object.
     * @param interval The number of seconds between updates.
     */
    constructor(interval: number = 30) {
        this._interval = interval;
        window.setInterval(function () {
            // document.querySelectorAll("tr")[0].querySelectorAll("td")[1].innerText = "hi"
            // document.getElementById("drinks-table").innerHTML += "update successful";
        }, this._interval * 1000);
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

    update(userID: number): void {
        // $.ajax({
        //     "url": "vote_updater.php",
        //     "type": "GET",
        //     "timeout": 5000,
        //     "dataType": "json",
        //     "data": {
        //         userId: userID,
        //     },
        //     // todo: handle success and error
        //     "success": function (data: any) {
        //         alert("success");
        //         if (data.status && data.added) {
        //             console.log("ok");
        //         }
        //     },
        //     "error": function (err: any) {
        //         alert("error");
        //         console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        //     }
        // });
    }
}
