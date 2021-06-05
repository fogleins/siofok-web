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

/**
 * Sets the page's link in the header active when a page loads.
 */
$(document).ready(function () {
    // set the active state for nav-links and dropdown-items as needed
    let navLinks = document.querySelectorAll(".nav-link, .dropdown-item");
    for (let i = 0; i < navLinks.length; i++) {
        let navLink: HTMLLinkElement = navLinks[i] as HTMLLinkElement;
        if (navLink.href == window.location.href) {
            navLink.classList.add("active");
            if (navLink.classList.contains("nav-link")) {
                navLink.classList.add("text-primary");
            }
        } else if (navLink.classList.contains("active")) {
            navLink.classList.remove("active");
        }
    }
});
