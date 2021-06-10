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

let USER_ID: number = null;

function submitVote(userID: number, drinkID: number, action: VoteType): void {
    $.ajax({
        "url": "vote_handler.php",
        "type": "POST",
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

function loadProfileData(): void {
    $.ajax({
        "url": "profile_data.php",
        "type": "GET",
        "timeout": 5000,
        "dataType": "json",
        "data": {},
        "success": function (data: any) {
            if (data.success) {
                let table: HTMLTableElement = document.getElementById("profile-data") as HTMLTableElement;
                // for (let i = 0; i < data.length; i++) {
                let i = 0;
                for (const dataKey in data) {
                    if (data.hasOwnProperty(dataKey) && dataKey != "success") {
                        let row: HTMLTableRowElement = table.insertRow(i);
                        for (let j = 0; j < 2; j++) {
                            let cell: HTMLTableCellElement = row.insertCell(j);
                            // the table displays key-value pairs, the first column is the key, which is of class
                            // text-primary, and the value is text-secondary
                            if (j == 0) {
                                cell.classList.add("text-primary");
                                cell.innerHTML = getUiTextForJsonKey(dataKey);
                            } else if (j == 1) {
                                cell.classList.add("text-secondary");
                                if (data[dataKey].length == 0) {
                                    cell.innerHTML = '-';
                                }
                                // if an item is an array, we display its elements with a given separator (', ')
                                else if (dataKey == "groups" && data[dataKey].length > 1) {
                                    cell.innerHTML = data[dataKey].join(", ");
                                } else {
                                    cell.innerHTML = data[dataKey];
                                }
                            }
                        }
                        i++;
                    }
                }
            }
        },
        "error": function (err: any) {
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}

/**
 * Returns the json key's Hungarian translation.
 * @param jsonKey The json key to translate.
 */
function getUiTextForJsonKey(jsonKey: string): string {
    switch (jsonKey) {
        case "firstLogin":
            return "Első bejelentkezés";
        case "lastLogin":
            return "Utolsó bejelentkezés";
        case "groups":
            return "Felhasználói csoportok";
    }
}
