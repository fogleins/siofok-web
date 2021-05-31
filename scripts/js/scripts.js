var VoteType;
(function (VoteType) {
    VoteType[VoteType["drinkAdd"] = 0] = "drinkAdd";
    VoteType[VoteType["drinkRemove"] = 1] = "drinkRemove";
    VoteType[VoteType["drinkAddSuggestion"] = 2] = "drinkAddSuggestion";
    VoteType[VoteType["other"] = 3] = "other";
})(VoteType || (VoteType = {}));
function submitVote(userID, drinkID, action) {
    $.ajax({
        "url": "vote_handler.php",
        "type": "GET",
        "timeout": 5000,
        "dataType": "json",
        "data": {
            action: action,
            userId: userID,
            drinkId: drinkID
        },
        "success": function (data) {
            if (data.success) {
                console.log(action == VoteType.drinkAdd ? "vote successfully saved" : "vote successfully removed");
            }
        },
        "error": function (err) {
            alert("error");
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}
//# sourceMappingURL=scripts.js.map