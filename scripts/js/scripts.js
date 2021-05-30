var VoteType;
(function (VoteType) {
    VoteType[VoteType["drinks"] = 0] = "drinks";
    VoteType[VoteType["other"] = 1] = "other";
})(VoteType || (VoteType = {}));
function submitVote(userID, drinkID) {
    var voteType = VoteType.drinks;
    $.ajax({
        "url": "vote_handler.php",
        "type": "GET",
        "timeout": 5000,
        "dataType": "json",
        "data": {
            userId: userID,
            drinkId: drinkID,
            voteType: voteType
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
//# sourceMappingURL=scripts.js.map