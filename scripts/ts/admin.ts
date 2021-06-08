namespace Admin {

    enum Action {
        userDataQuery,
        modifyRoles,
        addRole,
        removeRole
    }

    // an array of roles a user can have
    let availableRoles: JSON;
    let rolesForAutocomplete: string[] = [];
    let usersTags: string[] = [];

    function loadUserManagement() {
        $.ajax({
            "url": "user_management.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                action: Action.userDataQuery
            },
            "success": function (data: any) {
                if (data.success) {
                    availableRoles = data["availableRoles"];
                    for (const availableRolesKey in availableRoles) {
                        if (availableRoles.hasOwnProperty(availableRolesKey)) {
                            rolesForAutocomplete.push(availableRoles[availableRolesKey]["label"]);
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
                            row.insertCell(2).textContent = "-";
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
            // Update the modal's content.
            let modalTitle = document.getElementById('userManagementModalLabel');
            modalTitle.textContent = userFullName + " [" + userId + "] jogosultságainak kezelése";
        })
    });

    /**
     * Tag editor has to be destroyed when switching between users, this method is called when closing the modal.
     */
    export function destroyTagEditor() {
        $("#roles").tagEditor("destroy");
    }

    // export function testJsonRequest() {
    //     let changes = [
    //         {
    //             role: "admin",
    //             action: Action.removeRole,
    //             user: 8
    //         },
    //         {
    //             role: "participant",
    //             action: Action.addRole,
    //             user: 8
    //         },
    //         {
    //             role: "participant",
    //             action: Action.addRole,
    //             user: 9
    //         },
    //     ];
    //     $.ajax({
    //         "url": "user_management.php",
    //         "type": "GET",
    //         "timeout": 5000,
    //         "dataType": "json",
    //         "data": {
    //             action: Action.modifyRoles,
    //             changes: JSON.stringify(changes)
    //         },
    //         "success": function (data: any) {
    //             if (data.success) {
    //                 console.log("success" + JSON.stringify(data));
    //             } else {
    //                 console.log("success value not set" + JSON.stringify(data))
    //             }
    //         },
    //         "error": function (err: any) {
    //             console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
    //         }
    //     });
    // }
}