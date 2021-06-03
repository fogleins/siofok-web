enum VoteType {
    drinkAdd,
    drinkRemove,
    drinkAddSuggestion,
    other // todo
}

enum BootstrapColors {
    primary = "#007aff",
    secondary = "#6c757d",
    success = "#198754",
    warning = "#ffc107",
    danger = "#dc3545"
}

function submitVote(userID: number, drinkID: number, action: VoteType): void {
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
        "success": function (data: any) {
            if (data.success) {
                if (action == VoteType.drinkAdd) {
                    Toast.showToast("Sikeres művelet", "Szavazatod sikeresen rögzítésre került.",
                        BootstrapColors.success);
                    console.log("vote successfully saved");
                } else if (action == VoteType.drinkRemove) {
                    Toast.showToast("Sikeres művelet", "Szavazatod sikeresen törlésre került.",
                        BootstrapColors.success);
                    console.log("vote successfully removed");
                }
            }
        },
        "error": function (err: any) {
            Toast.showToast("Hiba", "A művelet során hiba lépett fel.", BootstrapColors.danger);
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}
