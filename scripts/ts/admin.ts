namespace Admin {

    enum Action {
        userDataQuery,
        modifyRoles,
        addRole,
        removeRole
    }

    // a list of roles a user can have
    let availableRoles: JSON;
    let rolesForAutocomplete: string[] = [];
    let usersTags: string[] = [];
    let changedRoles: Object[] = [];

    /**
     * Creates the user management table and fills it with data.
     */
    function loadUserManagement() {
        $.ajax({
            "url": "user_management.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": { },
            "success": function (data: any) {
                if (data.success) {
                    availableRoles = data["availableRoles"];
                    for (const availableRolesKey in availableRoles) {
                        if (availableRoles.hasOwnProperty(availableRolesKey)) {
                            rolesForAutocomplete.push(availableRolesKey);
                            availableRoles[availableRolesKey] = parseInt(availableRoles[availableRolesKey], 10);
                        }
                    }
                    let table: HTMLTableElement = document.getElementById("user-management") as HTMLTableElement;
                    for (let i = 0; i < data.length; i++) {
                        let row: HTMLTableRowElement = table.insertRow(i);
                        let j: number = 0;
                        for (const dataKey in data[i]) {
                            if (data[i].hasOwnProperty(dataKey) && dataKey != "success") {
                                let cell: HTMLTableCellElement = row.insertCell(j);
                                cell.style.verticalAlign = "middle";
                                if (dataKey != "roles") {
                                    cell.textContent = data[i][dataKey];
                                } else {
                                    cell.textContent = data[i][dataKey].join(", ");
                                }
                                j++;
                            }
                        }
                        // if the user has no roles (if we didn't add a cell here, there would be only 2 cells in this row)
                        if (!data[i]["roles"]) {
                            row.insertCell(2);
                        }
                        let cell: HTMLTableCellElement = row.insertCell(3);
                        let button = document.createElement("button");
                        cell.style.textAlign = "center";
                        cell.style.verticalAlign = "middle";
                        button.classList.add("btn", "btn-secondary");
                        button.textContent = "Jogosultságok kezelése";
                        button.setAttribute("data-bs-toggle", "modal")
                        button.setAttribute("data-bs-target", "#userManagementModal")
                        button.setAttribute("data-bs-user", data[i]["name"]);
                        button.setAttribute("data-bs-userId", data[i]["id"]);
                        button.addEventListener("click", function () {
                            usersTags = [];
                            usersTags = table.querySelectorAll("tr")[i + 1].cells[2].textContent
                                .split(", ");
                            let modal = document.getElementById("userManagementModal");
                            let userId = parseInt(modal.getAttribute("data-bs-userId"), 10);
                            let roles = $("#roles")
                            roles.tagEditor({
                                autocomplete: {
                                    delay: 0,
                                    postition: { collision: 'flip' },
                                    source: rolesForAutocomplete
                                },
                                forceLowercase: false,
                                placeholder: "Adj meg jogosultságokat...",
                                initialTags: usersTags,
                                beforeTagSave: function(field, editor, tags, tag, val) {
                                    if (availableRoles[val]) {
                                        changedRoles.push({
                                            action: Action.addRole,
                                            userId: userId,
                                            roleId: availableRoles[val]
                                        });
                                    } else {
                                        // remove invalid tag
                                        console.log("invalid tag: " + val);
                                        window.setTimeout(function () {
                                            roles.tagEditor("removeTag", val);
                                        }, 10);
                                    }
                                },
                                beforeTagDelete: function (field, editor, tags, val) {
                                    // in the beforeTagSave event we remove the tags if they are not valid (e.g. they
                                    // are not in the json), and that operation also triggers this event, and we don't
                                    // want to add only the userId and action to the changedRoles array, therefore we
                                    // need this if statement
                                    if (availableRoles[val]) {
                                        changedRoles.push({
                                            action: Action.removeRole,
                                            userId: userId,
                                            roleId: availableRoles[val]
                                        });
                                    } else {
                                        // feedback on the console
                                        console.log("deleting invalid tag")
                                    }
                                }
                            });
                        });
                        button.id = "modal" + i;
                        cell.appendChild(button);
                    }
                    let thead: HTMLTableSectionElement = table.tHead = document.createElement("thead");
                    thead.innerHTML = "<tr><th>ID</th><th>Name</th><th>Roles</th><th></th></tr>";
                }
            },
            "error": function (err: any) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }

    $(document).ready(function () {
        loadUserManagement();
        let modal = document.getElementById("userManagementModal");
        modal.addEventListener('show.bs.modal', function (event) {
            // Button that triggered the modal
            let button = event.relatedTarget
            // Extract info from data-bs-* attributes
            let userFullName = button.getAttribute('data-bs-user');
            let userId = button.getAttribute("data-bs-userId");
            modal.setAttribute("data-bs-userId", userId);
            // Update the modal's content.
            let modalTitle = document.getElementById('userManagementModalLabel');
            modalTitle.textContent = userFullName + " [" + userId + "] jogosultságainak kezelése";
        })

        $(".modal-close").click(function () {
            // TODO: temporarily store changes for the user's role, because after closing and reopening the modal,
            //  only the already saved roles show up
            // if changedRoles is not an empty array
            if (changedRoles.length != 0) {
                document.getElementById("unsaved-changes-details").textContent = JSON.stringify(changedRoles);
                document.getElementById("unsaved-changes").hidden = false;
            }
            $("#roles").tagEditor("destroy");
        })

        $("#modal-save").click(function () {
            if (changedRoles.length != 0) {
                $.ajax({
                    url: "user_management.php",
                    type: "POST",
                    timeout: 5000,
                    dataType: "json",
                    data: {
                        action: Action.modifyRoles,
                        changes: changedRoles
                    },
                    success: function (data: any) {
                        if (data.success) {
                            Toast.showToast("Sikeres művelet", "A módosítások mentése sikeres volt.",
                                BootstrapColors.success);
                        } else {
                            Toast.showToast("Hiba", "Nem minden módosítást sikerült menteni. " +
                                "Részletek a rendszernaplóban találhatók.", BootstrapColors.danger);
                        }
                        document.getElementById("unsaved-changes").hidden = true;
                        document.getElementById("unsaved-changes-details").textContent = null;
                    },
                    error: function (err: any) {
                        console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
                        Toast.showToast("Hiba", "Hiba az AJAX kérés során. Részletek a konzolon.",
                            BootstrapColors.danger);
                    }
                });
                refreshUserRoles();
                $("#roles").tagEditor("destroy");
            }
        })

        $("#dismiss-changes").click(function () {
            $("#roles").tagEditor("destroy");
            changedRoles = [];
            document.getElementById("unsaved-changes").hidden = true;
            document.getElementById("unsaved-changes-details").textContent = null;
        })
    });

    /**
     * Updates the user management table's roles column. Called after roles have been modified.
     * Note: if a new user has been added in the meantime, the page should be reloaded as this method does not insert
     * new rows into the table, therefore when it updates the roles and it receives more users than there are rows in
     * the table, it probably will throw an error and the update is not guaranteed.
     */
    function refreshUserRoles() {
        $.ajax({
            url: "user_management.php",
            method: "GET",
            timeout: 5000,
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    let table: HTMLTableElement = document.getElementById("user-management") as HTMLTableElement;
                    for (let i = 0; i < data.length; i++) {
                        let row: HTMLTableRowElement = table.querySelectorAll("tr")[i + 1];
                        let j: number = 0;
                        for (const dataKey in data[i]) {
                            if (data[i].hasOwnProperty(dataKey)) {
                                let cell: HTMLTableCellElement = row.querySelectorAll("td")[j];
                                if (dataKey == "roles") {
                                    cell.textContent = data[i][dataKey].join(", ");
                                }
                                j++;
                            }
                        }
                    }
                }
            },
            error: function (error) {
                console.log("AJAX error in request: " + JSON.stringify(error, null, 2));
            }
        });
    }
}
