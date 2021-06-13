var Admin;
(function (Admin) {
    let Action;
    (function (Action) {
        Action[Action["userDataQuery"] = 0] = "userDataQuery";
        Action[Action["modifyRoles"] = 1] = "modifyRoles";
        Action[Action["addRole"] = 2] = "addRole";
        Action[Action["removeRole"] = 3] = "removeRole";
    })(Action || (Action = {}));
    let availableRoles;
    let rolesForAutocomplete = [];
    let usersTags = [];
    let changedRoles = [];
    function loadUserManagement() {
        $.ajax({
            "url": "user_management.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "success": function (data) {
                if (data.success) {
                    availableRoles = data.availableRoles;
                    for (let i = 0; i < availableRoles.length; i++) {
                        rolesForAutocomplete.push(availableRoles[i].name);
                    }
                    let table = document.getElementById("user-management");
                    for (let i = 0; i < data.users.length; i++) {
                        let row = table.insertRow(i);
                        let j = 0;
                        for (const dataKey in data.users[i]) {
                            if (data.users[i].hasOwnProperty(dataKey)) {
                                let cell = row.insertCell(j);
                                cell.style.verticalAlign = "middle";
                                if (dataKey != "roles") {
                                    cell.textContent = data.users[i][dataKey].toString();
                                }
                                else {
                                    cell.textContent = data["users"][i][dataKey].join(", ");
                                }
                                j++;
                            }
                        }
                        if (!data.users[i].roles) {
                            row.insertCell(2);
                        }
                        let cell = row.insertCell(3);
                        let button = document.createElement("button");
                        cell.style.textAlign = "center";
                        cell.style.verticalAlign = "middle";
                        button.classList.add("btn", "btn-secondary");
                        button.textContent = "Jogosultságok kezelése";
                        button.setAttribute("data-bs-toggle", "modal");
                        button.setAttribute("data-bs-target", "#userManagementModal");
                        button.setAttribute("data-bs-user", data.users[i].name);
                        button.setAttribute("data-bs-userId", data.users[i].id.toString());
                        button.addEventListener("click", function () {
                            usersTags = [];
                            usersTags = table.querySelectorAll("tr")[i + 1].cells[2].textContent
                                .split(", ");
                            let modal = document.getElementById("userManagementModal");
                            let userId = parseInt(modal.getAttribute("data-bs-userId"), 10);
                            let roles = $("#roles");
                            roles.tagEditor({
                                autocomplete: {
                                    delay: 0,
                                    postition: { collision: 'flip' },
                                    source: rolesForAutocomplete
                                },
                                forceLowercase: false,
                                placeholder: "Adj meg jogosultságokat...",
                                initialTags: usersTags,
                                beforeTagSave: function (field, editor, tags, tag, val) {
                                    if (getArrayItemWithValue(availableRoles, "name", val)) {
                                        changedRoles.push({
                                            action: Action.addRole,
                                            userId: userId,
                                            roleId: getArrayItemWithValue(availableRoles, "name", val).id
                                        });
                                    }
                                    else {
                                        console.log("invalid tag: " + val);
                                        window.setTimeout(function () {
                                            roles.tagEditor("removeTag", val);
                                        }, 10);
                                    }
                                },
                                beforeTagDelete: function (field, editor, tags, val) {
                                    if (getArrayItemWithValue(availableRoles, "name", val)) {
                                        changedRoles.push({
                                            action: Action.removeRole,
                                            userId: userId,
                                            roleId: getArrayItemWithValue(availableRoles, "name", val).id
                                        });
                                    }
                                    else {
                                        console.log("deleting invalid tag");
                                    }
                                }
                            });
                        });
                        button.id = "modal" + i;
                        cell.appendChild(button);
                    }
                    let thead = table.tHead = document.createElement("thead");
                    thead.innerHTML = "<tr><th>ID</th><th>Name</th><th>Roles</th><th></th></tr>";
                }
            },
            "error": function (err) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
    $(() => {
        loadUserManagement();
        let modal = document.getElementById("userManagementModal");
        modal.addEventListener('show.bs.modal', function (event) {
            let button = event.relatedTarget;
            let userFullName = button.getAttribute('data-bs-user');
            let userId = button.getAttribute("data-bs-userId");
            modal.setAttribute("data-bs-userId", userId);
            let modalTitle = document.getElementById('userManagementModalLabel');
            modalTitle.textContent = userFullName + " [" + userId + "] jogosultságainak kezelése";
        });
        $(".modal-close").on("click", function () {
            if (changedRoles.length != 0) {
                document.getElementById("unsaved-changes-details").textContent = JSON.stringify(changedRoles);
                document.getElementById("unsaved-changes").hidden = false;
            }
            $("#roles").tagEditor("destroy");
        });
        $("#modal-save").on("click", function () {
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
                    success: function (data) {
                        if (data.success) {
                            Toast.showToast("Sikeres művelet", "A módosítások mentése sikeres volt.", BootstrapColors.success);
                        }
                        else {
                            Toast.showToast("Hiba", "Nem minden módosítást sikerült menteni. " +
                                "Részletek a rendszernaplóban találhatók.", BootstrapColors.danger);
                        }
                        document.getElementById("unsaved-changes").hidden = true;
                        document.getElementById("unsaved-changes-details").textContent = null;
                    },
                    error: function (err) {
                        console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
                        Toast.showToast("Hiba", "Hiba az AJAX kérés során. Részletek a konzolon.", BootstrapColors.danger);
                    }
                });
                changedRoles = [];
                refreshUserRoles();
                $("#roles").tagEditor("destroy");
            }
        });
        $("#dismiss-changes").on("click", function () {
            $("#roles").tagEditor("destroy");
            changedRoles = [];
            document.getElementById("unsaved-changes").hidden = true;
            document.getElementById("unsaved-changes-details").textContent = null;
        });
    });
    function refreshUserRoles() {
        $.ajax({
            url: "user_management.php",
            method: "GET",
            timeout: 5000,
            dataType: "json",
            success: function (data) {
                if (data.success) {
                    let table = document.getElementById("user-management");
                    for (let i = 0; i < data.users.length; i++) {
                        let row = table.querySelectorAll("tr")[i + 1];
                        let j = 0;
                        for (const dataKey in data.users[i]) {
                            if (data.users[i].hasOwnProperty(dataKey)) {
                                let cell = row.querySelectorAll("td")[j];
                                if (dataKey == "roles") {
                                    cell.textContent = data.users[i][dataKey].join(", ");
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
    function getArrayItemWithValue(array, key, value) {
        for (const object of array) {
            if (object[key] && object[key] == value) {
                return object;
            }
        }
        return null;
    }
})(Admin || (Admin = {}));
//# sourceMappingURL=admin.js.map