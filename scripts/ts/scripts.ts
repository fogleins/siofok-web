enum BootstrapColors {
    primary = "#007aff",
    secondary = "#6c757d",
    success = "#198754",
    warning = "#ffc107",
    danger = "#dc3545"
}

let USER_ID: number;

/**
 * Called when a page was loaded. Sets the page's link in the header active when a page loads. Sets the user id if it's
 * not set yet.
 */
$(() => {
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
    if (USER_ID == null) {
        // $.ajax({
        //     async: false,
        //     url: "user_data.php",
        //     timeout: 5000,
        //     method: "GET",
        //     dataType: "json",
        //     success: function (data) {
        //         if (data.success) {
        //             USER_ID = data.userId;
        //         }
        //     }
        // })
        getUserId();
    }
});

async function getUserId() {
    await $.ajax({
        url: "user_data.php",
        timeout: 5000,
        method: "GET",
        dataType: "json",
        success: await function (data: any) {
            if (data.success) {
                USER_ID = data.userId;
            }
        }
    })
}

function loadProfileData(): void {
    $.ajax({
        "url": "profile_data.php",
        "type": "GET",
        "timeout": 5000,
        "dataType": "json",
        "success": function (data: any) {
            if (data.success) {
                let table: HTMLTableElement = document.getElementById("profile-data") as HTMLTableElement;
                let i = 0;
                for (const dataKey in data) {
                    if (data.hasOwnProperty(dataKey) && dataKey != "success") {
                        if (dataKey == "activities") {
                            table = document.getElementById("profile-activities") as HTMLTableElement;
                            for (let j = 0; j < data[dataKey].length; j++) {
                                let row: HTMLTableRowElement = table.insertRow(j);
                                for (let k = 0; k < 2; k++) {
                                    let cell: HTMLTableCellElement = row.insertCell(k);
                                    cell.textContent = data[dataKey][j][k];
                                }
                            }
                            let thead: HTMLTableSectionElement = table.tHead = document.createElement("thead");
                            thead.innerHTML = "<tr><th style='min-width: 20ch'>Idő (legújabb elöl)</th><th>Leírás</th></tr>";
                        } else if (dataKey == "paymentInfo") {
                            let table: HTMLTableElement = document.getElementById("profile-data") as HTMLTableElement;
                            for (const dataKeyKey in data[dataKey]) {
                                let row: HTMLTableRowElement = table.insertRow(table.rows.length);
                                for (let k = 0; k < 2; k++) {
                                    let cell: HTMLTableCellElement = row.insertCell(k);
                                    if (k == 0) {
                                        cell.classList.add("text-primary");
                                        cell.innerHTML = getUiTextForJsonKey(dataKeyKey);
                                    } else {
                                        if (dataKeyKey == "paid") {
                                            data[dataKey][dataKeyKey] == "false" ? cell.classList.add("text-danger")
                                                : cell.classList.add("text-success");
                                        } else {
                                            cell.classList.add("text-secondary");
                                        }
                                        cell.innerHTML = data[dataKey][dataKeyKey];
                                    }
                                }
                            }
                        } else {
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
        case "amount":
            return "Fizetendő összeg (Ft)";
        case "paid":
            return "Fizetve";
    }
}

/**
 * Logs a click if the clicked link points outside of this site.
 * @param message The message to log. Usually the link or the name of the site the link is pointing to.
 */
function logOuterLinkVisit(message: string): void {
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
