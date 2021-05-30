class DrinksVoteUpdater {
    constructor(interval = 30) {
        this._interval = interval;
        window.setInterval(function () {
            document.querySelectorAll("tr")[0].querySelectorAll("td")[1].innerText = "hi";
            document.getElementById("drinks-table").innerHTML += "update successful";
        }, this._interval * 1000);
    }
    get interval() {
        return this._interval;
    }
    set interval(value) {
        this._interval = value;
    }
    update(userID) {
        $.ajax({
            "url": "vote_updater.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                userId: userID,
            },
            "success": function (data) {
                alert("success");
                if (data.status && data.added) {
                    console.log("ok");
                }
            },
            "error": function (err) {
                alert("error");
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
}
//# sourceMappingURL=drinksVoteUpdater.js.map