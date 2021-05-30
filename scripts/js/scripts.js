var VoteType;
(function (VoteType) {
    VoteType[VoteType["drinkAdd"] = 0] = "drinkAdd";
    VoteType[VoteType["drinkRemove"] = 1] = "drinkRemove";
    VoteType[VoteType["other"] = 2] = "other";
})(VoteType || (VoteType = {}));
function submitVote(userID, drinkID, action) {
    $.ajax({
        "url": "vote_handler.php",
        "type": "GET",
        "timeout": 5000,
        "dataType": "json",
        "data": {
            userId: userID,
            drinkId: drinkID,
            action: action
        },
        "success": function (data) {
            if (data.success) {
                console.log("ok");
            }
        },
        "error": function (err) {
            alert("error");
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}
//# sourceMappingURL=scripts.js.map