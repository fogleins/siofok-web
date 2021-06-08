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
    function loadUserManagement() {
        $.ajax({
            "url": "user_management.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                action: Action.userDataQuery
            },
            "success": function (data) {
                if (data.success) {
                    availableRoles = data["availableRoles"];
                    for (const availableRolesKey in availableRoles) {
                        if (availableRoles.hasOwnProperty(availableRolesKey)) {
                            rolesForAutocomplete.push(availableRoles[availableRolesKey]["label"]);
                        }
                    }
                    let table = document.getElementById("user-management");
                    for (let i = 0; i < data.length; i++) {
                        let row = table.insertRow(i);
                        let j = 0;
                        for (const dataKey in data[i]) {
                            if (data[i].hasOwnProperty(dataKey) && dataKey != "success") {
                                let cell = row.insertCell(j);
                                cell.style.verticalAlign = "middle";
                                if (dataKey != "roles") {
                                    cell.textContent = data[i][dataKey];
                                }
                                else {
                                    cell.textContent = data[i][dataKey].join(", ");
                                }
                                j++;
                            }
                        }
                        if (!data[i]["roles"]) {
                            row.insertCell(2).textContent = "-";
                        }
                        let cell = row.insertCell(3);
                        let button = document.createElement("button");
                        cell.style.textAlign = "center";
                        cell.style.verticalAlign = "middle";
                        button.classList.add("btn", "btn-secondary");
                        button.textContent = "Jogosultságok kezelése";
                        button.setAttribute("data-bs-toggle", "modal");
                        button.setAttribute("data-bs-target", "#userManagementModal");
                        button.setAttribute("data-bs-user", data[i]["name"]);
                        button.setAttribute("data-bs-userId", data[i]["id"]);
                        button.addEventListener("click", function () {
                            usersTags = [];
                            usersTags = table.querySelectorAll("tr")[i + 1].cells[2].textContent
                                .split(", ");
                            $("#roles").tagEditor({
                                autocomplete: {
                                    delay: 0,
                                    postition: { collision: 'flip' },
                                    source: rolesForAutocomplete
                                },
                                forceLowercase: false,
                                placeholder: "Adj meg jogosultságokat...",
                                initialTags: usersTags
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
    $(document).ready(function () {
        loadUserManagement();
        let modal = document.getElementById("userManagementModal");
        modal.addEventListener('show.bs.modal', function (event) {
            let button = event.relatedTarget;
            let userFullName = button.getAttribute('data-bs-user');
            let userId = button.getAttribute("data-bs-userId");
            let modalTitle = document.getElementById('userManagementModalLabel');
            modalTitle.textContent = userFullName + " [" + userId + "] jogosultságainak kezelése";
        });
    });
    function destroyTagEditor() {
        $("#roles").tagEditor("destroy");
    }
    Admin.destroyTagEditor = destroyTagEditor;
})(Admin || (Admin = {}));
//# sourceMappingURL=admin.js.map