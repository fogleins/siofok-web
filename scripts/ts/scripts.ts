enum VoteType {
    drinkAdd,
    drinkRemove,
    other // todo
}

function submitVote(userID: number, drinkID: number, action: VoteType): void {
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
        // todo: handle success and error
        "success": function (data: any) {
            if (data.success) {
                console.log("ok");
            }
        },
        "error": function (err: any) {
            alert("error");
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}
