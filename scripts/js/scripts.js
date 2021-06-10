var VoteType;
(function (VoteType) {
    VoteType[VoteType["drinkAdd"] = 0] = "drinkAdd";
    VoteType[VoteType["drinkRemove"] = 1] = "drinkRemove";
    VoteType[VoteType["drinkAddSuggestion"] = 2] = "drinkAddSuggestion";
    VoteType[VoteType["other"] = 3] = "other";
})(VoteType || (VoteType = {}));
var BootstrapColors;
(function (BootstrapColors) {
    BootstrapColors["primary"] = "#007aff";
    BootstrapColors["secondary"] = "#6c757d";
    BootstrapColors["success"] = "#198754";
    BootstrapColors["warning"] = "#ffc107";
    BootstrapColors["danger"] = "#dc3545";
})(BootstrapColors || (BootstrapColors = {}));
let USER_ID = null;
function submitVote(userID, drinkID, action) {
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
        "success": function (data) {
            if (data.success) {
                if (action == VoteType.drinkAdd) {
                    Toast.showToast("Sikeres művelet", "Szavazatod sikeresen rögzítésre került.", BootstrapColors.success);
                    console.log("vote successfully saved");
                }
                else if (action == VoteType.drinkRemove) {
                    Toast.showToast("Sikeres művelet", "Szavazatod sikeresen törlésre került.", BootstrapColors.success);
                    console.log("vote successfully removed");
                }
            }
        },
        "error": function (err) {
            Toast.showToast("Hiba", "A művelet során hiba lépett fel.", BootstrapColors.danger);
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}
$(document).ready(function () {
    let navLinks = document.querySelectorAll(".nav-link, .dropdown-item");
    for (let i = 0; i < navLinks.length; i++) {
        let navLink = navLinks[i];
        if (navLink.href == window.location.href) {
            navLink.classList.add("active");
            if (navLink.classList.contains("nav-link")) {
                navLink.classList.add("text-primary");
            }
        }
        else if (navLink.classList.contains("active")) {
            navLink.classList.remove("active");
        }
    }
});
function loadProfileData() {
    $.ajax({
        "url": "profile_data.php",
        "type": "GET",
        "timeout": 5000,
        "dataType": "json",
        "data": {},
        "success": function (data) {
            if (data.success) {
                let table = document.getElementById("profile-data");
                let i = 0;
                for (const dataKey in data) {
                    if (data.hasOwnProperty(dataKey) && dataKey != "success") {
                        let row = table.insertRow(i);
                        for (let j = 0; j < 2; j++) {
                            let cell = row.insertCell(j);
                            if (j == 0) {
                                cell.classList.add("text-primary");
                                cell.innerHTML = getUiTextForJsonKey(dataKey);
                            }
                            else if (j == 1) {
                                cell.classList.add("text-secondary");
                                if (data[dataKey].length == 0) {
                                    cell.innerHTML = '-';
                                }
                                else if (dataKey == "groups" && data[dataKey].length > 1) {
                                    cell.innerHTML = data[dataKey].join(", ");
                                }
                                else {
                                    cell.innerHTML = data[dataKey];
                                }
                            }
                        }
                        i++;
                    }
                }
            }
        },
        "error": function (err) {
            console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
        }
    });
}
function getUiTextForJsonKey(jsonKey) {
    switch (jsonKey) {
        case "firstLogin":
            return "Első bejelentkezés";
        case "lastLogin":
            return "Utolsó bejelentkezés";
        case "groups":
            return "Felhasználói csoportok";
    }
}
//# sourceMappingURL=scripts.js.map