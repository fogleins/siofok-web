var BootstrapColors;
(function (BootstrapColors) {
    BootstrapColors["primary"] = "#007aff";
    BootstrapColors["secondary"] = "#6c757d";
    BootstrapColors["success"] = "#198754";
    BootstrapColors["warning"] = "#ffc107";
    BootstrapColors["danger"] = "#dc3545";
})(BootstrapColors || (BootstrapColors = {}));
let USER_ID;
$(() => {
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
    if (USER_ID == null) {
        $.ajax({
            url: "user_data.php",
            timeout: 5000,
            method: "GET",
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    USER_ID = data.userId;
                    console.log(USER_ID);
                }
            }
        });
    }
});
function loadProfileData() {
    $.ajax({
        "url": "profile_data.php",
        "type": "GET",
        "timeout": 5000,
        "dataType": "json",
        "success": function (data) {
            if (data.success) {
                let table = document.getElementById("profile-data");
                let i = 0;
                for (const dataKey in data) {
                    if (data.hasOwnProperty(dataKey) && dataKey != "success") {
                        if (dataKey == "activities") {
                            table = document.getElementById("profile-activities");
                            for (let j = 0; j < data[dataKey].length; j++) {
                                let row = table.insertRow(j);
                                for (let k = 0; k < 2; k++) {
                                    let cell = row.insertCell(k);
                                    cell.textContent = data[dataKey][j][k];
                                }
                            }
                            let thead = table.tHead = document.createElement("thead");
                            thead.innerHTML = "<tr><th style='min-width: 20ch'>Idő (legújabb elöl)</th><th>Leírás</th></tr>";
                        }
                        else {
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
function logOuterLinkVisit(message) {
    $.ajax({
        url: "xhr_log_handler.php",
        method: "POST",
        timeout: 5000,
        data: {
            logType: 3,
            message: message
        }
    });
}
//# sourceMappingURL=scripts.js.map