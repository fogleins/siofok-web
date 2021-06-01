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
                    showToast("Sikeres művelet", "Szavazatod sikeresen rögzítésre került.");
                    console.log("vote successfully saved");
                } else if (action == VoteType.drinkRemove) {
                    showToast("Sikeres művelet", "Szavazatod sikeresen törlésre került.");
                    console.log("vote successfully removed");
                }
            }
        },
        "error": function (err: any) {
            showToast("Hiba", "A művelet során hiba lépett fel.", BootstrapColors.danger);
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}

function showToast(title: string, description: string, iconColor: string = BootstrapColors.primary) : void {
    if (document.getElementById("toast") == null) {
        let body = document.querySelector("body");
        body.innerHTML += "<div class='toast' id='toast' role='alert' aria-live='assertive' aria-atomic='true'>" +
            "  <div class='toast-header' id='toast-header'>" +
            "    <svg class='bd-placeholder-img rounded me-2' aria-hidden='true' focusable='false' " +
            "      width='15px' height='15px'>" +
            `      <rect id='toast-icon' width='100%' height='100%' fill='${iconColor}'></rect>` +
            "    </svg>" +
            "    <strong class='me-auto' id='toast-header-content'></strong>" +
            "    <small id='timestamp'></small>" +
            "    <button type='button' class='btn-close' data-bs-dismiss='toast' aria-label='Close'></button>" +
            "  </div>" +
            "  <div class='toast-body' id='toast-body'></div>" +
            "</div>";
    }
    document.getElementById("toast-header-content").textContent = title;
    document.getElementById("toast-body").textContent = description;
    document.getElementById("toast-icon").style.fill = iconColor;
    let date: Date = new Date(Date.now()) as Date;
    document.getElementById("timestamp").textContent = date.toLocaleTimeString("hu");
    let toast: HTMLElement = (document.getElementById("toast") as HTMLElement);
    // always show the toast on top of the view (e.g. if the user has scrolled down, they will still be able to see
    // the notification)
    // since we want to display the toast 10vh from the top of the view, we convert the 10vh to pixels and add the value
    // to the marginTop property
    toast.style.marginTop = (window.scrollY + Math.round(window.innerHeight / 10)).toString() + "px";
    $('.toast').toast('show');
}
