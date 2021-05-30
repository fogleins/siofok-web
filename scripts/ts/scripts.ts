enum VoteType {
    drinks,
    other // todo
}

function submitVote(userID: number, drinkID: number): void {
    const voteType: VoteType = VoteType.drinks;
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
        // todo: handle success and error
        "success": function (data: any) {
            alert("success");
            if (data.status && data.added) {
                console.log("ok");
            }
        },
        "error": function (err: any) {
            alert("error");
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}
