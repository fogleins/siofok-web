namespace Admin {

    enum Action {
        userDataQuery,
        modifyRoles,
        addRole,
        removeRole
    }

    /**
     * The properties of a user.
     */
    interface UserData {
        // make the interface indexable by string
        readonly [key: string]: number | string | string[];
        id: number;
        name: string;
        roles: string[];
    }

    interface RoleData {
        name: string;
        id: number;
    }

    /**
     * Fields of the userDataQuery response.
     */
    interface ResponseData {
        users: UserData[];
        availableRoles: RoleData[];
        success: boolean;
    }

    // a list of roles a user can have
    let availableRoles: RoleData[];
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
            "success": function (data: ResponseData) {
                if (data.success) {
                    availableRoles = data.availableRoles;
                    for (let i = 0; i < availableRoles.length; i++) {
                        rolesForAutocomplete.push(availableRoles[i].name);
                    }
                    let table: HTMLTableElement = document.getElementById("user-management") as HTMLTableElement;
                    for (let i = 0; i < data.users.length; i++) {
                        let row: HTMLTableRowElement = table.insertRow(i);
                        let j: number = 0;
                        for (const dataKey in data.users[i]) {
                            if (data.users[i].hasOwnProperty(dataKey)) {
                                let cell: HTMLTableCellElement = row.insertCell(j);
                                cell.style.verticalAlign = "middle";
                                if (dataKey != "roles") {
                                    cell.textContent = data.users[i][dataKey].toString();
                                } else {
                                    cell.textContent = data["users"][i][dataKey].join(", ");
                                }
                                j++;
                            }
                        }
                        // if the user has no roles (if we didn't add a cell here, there would be only 2 cells in this row)
                        if (!data.users[i].roles) {
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
                        button.setAttribute("data-bs-user", data.users[i].name);
                        button.setAttribute("data-bs-userId", data.users[i].id.toString());
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
                                beforeTagSave: function(field: any, editor: any, tags: any, tag: any, val: string) {
                                    // if (availableRoles[val]) {
                                    if (getArrayItemWithValue(availableRoles, "name", val)) {
                                        changedRoles.push({
                                            action: Action.addRole,
                                            userId: userId,
                                            roleId: getArrayItemWithValue(availableRoles, "name", val).id
                                        });
                                    } else {
                                        // remove invalid tag
                                        console.log("invalid tag: " + val);
                                        window.setTimeout(function () {
                                            roles.tagEditor("removeTag", val);
                                        }, 10);
                                    }
                                },
                                beforeTagDelete: function (field: any, editor: any, tags: any, val: string) {
                                    // in the beforeTagSave event we remove the tags if they are not valid (e.g. they
                                    // are not in the json), and that operation also triggers this event, and we don't
                                    // want to add only the userId and action to the changedRoles array, therefore we
                                    // need this if statement
                                    if (getArrayItemWithValue(availableRoles, "name", val)) {
                                        changedRoles.push({
                                            action: Action.removeRole,
                                            userId: userId,
                                            roleId: getArrayItemWithValue(availableRoles, "name", val).id
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

    $(() => {
        loadUserManagement();
        let modal = document.getElementById("userManagementModal");
        modal.addEventListener('show.bs.modal', function (event: any) {
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

        $(".modal-close").on("click", function () {
            // if changedRoles is not an empty array
            if (changedRoles.length != 0) {
                document.getElementById("unsaved-changes-details").textContent = JSON.stringify(changedRoles);
                document.getElementById("unsaved-changes").hidden = false;
            }
            $("#roles").tagEditor("destroy");
        })

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
                changedRoles = [];
                refreshUserRoles();
                $("#roles").tagEditor("destroy");
            }
        })

        $("#dismiss-changes").on("click", function () {
            $("#roles").tagEditor("destroy");
            changedRoles = [];
            document.getElementById("unsaved-changes").hidden = true;
            document.getElementById("unsaved-changes-details").textContent = null;
        })
        buildDatepickerTables();
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
            success: function (data: ResponseData) {
                if (data.success) {
                    let table: HTMLTableElement = document.getElementById("user-management") as HTMLTableElement;
                    for (let i = 0; i < data.users.length; i++) {
                        let row: HTMLTableRowElement = table.querySelectorAll("tr")[i + 1];
                        let j: number = 0;
                        for (const dataKey in data.users[i]) {
                            if (data.users[i].hasOwnProperty(dataKey)) {
                                let cell: HTMLTableCellElement = row.querySelectorAll("td")[j];
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

    /**
     * Gets the first element of an array where the given key's value matches the one that's passed as parameter.
     * @param array The array to search in.
     * @param key The key of the value that has to be matched.
     * @param value The value the key's value in the array should match.
     */
    function getArrayItemWithValue(array: any[], key: string, value: string | number): any {
        for (const object of array) {
            if (object[key] && object[key] == value) {
                return object;
            }
        }
        return null;
    }

    /**
     * Creates calendar-like tables.
     * @private
     */
    function buildDatepickerTables() {
        let datepickerAllAnswersTable = document.getElementById("datepicker-all") as HTMLTableElement;
        let datepickerAvailableTable = document.getElementById("datepicker-available") as HTMLTableElement;
        let datepickerBusyTable = document.getElementById("datepicker-busy") as HTMLTableElement;
        let tables = [datepickerAllAnswersTable, datepickerAvailableTable, datepickerBusyTable];
        let startDate = moment("2022-05-30");
        let endDate = moment("2022-09-04");
        let row = null;
        let infoRow = null;
        let cell = null;

        for (const table of tables) {
            for (let i = moment(startDate); i <= endDate; i.add(1, "day")) {
                // if i is monday
                if (i.day() == 1) {
                    row = table.insertRow(table.rows.length);
                    infoRow = table.insertRow(table.rows.length);
                }
                cell = row.insertCell(i.day() - 1);
                let date: string = i.format("YYYY-MM-DD");
                cell.textContent = date;
                let infoCell = infoRow.insertCell(i.day() - 1);
                infoCell.textContent = "0";
                infoCell.id = `${table.id}-for-${date}`;
                switch (i.month()) {
                    case 5:
                        cell.classList.add("table-warning");
                        break;
                    case 6:
                        cell.classList.add("table-success");
                        break;
                    case 7:
                        cell.classList.add("table-primary");
                        break;
                    case 8:
                        cell.classList.add("table-danger");
                        break;
                }
            }
        }
        fillTables();
    }

    /**
     * Requests and displays datepicker responses.
     * @private
     */
    async function fillTables() {
        if (USER_ID == null) {
            await getUserId();
        }
        await $.ajax({
            method: "GET",
            url: "datepicker_xhr_handler.php",
            timeout: 3000,
            dataType: "json",
            data: {
                userId: USER_ID,
                action: "queryAll"
            },
            success: response => {
                if (response.success) {
                    for (let i = 0; i < response.data.length; i++) {
                        addAvailibilityDataToTable(response.data[i]);
                    }
                }
            }
        })
    }

    /**
     * Adds +1 or -1 to a datepicker response table cell for all dates in the range depending on availability.
     * @param data A response object containing availability data and the start and end dates of the response.
     * @private
     */
    function addAvailibilityDataToTable(data: any) {
        for (let i = moment(data.start_date); i <= moment(data.end_date); i.add(1, "day")) {
            let allTableEditCell = document.getElementById("datepicker-all-for-" + i.format("YYYY-MM-DD"));
            let allTableAddValue: number = 0;
            if (data.availability == 1) {
                let editCell = document.getElementById("datepicker-available-for-" + i.format("YYYY-MM-DD"));
                let count = parseInt(editCell.textContent, 10);
                editCell.textContent = (count + 1).toString(10);
                allTableAddValue = 1;
            } else {
                let editCell = document.getElementById("datepicker-busy-for-" + i.format("YYYY-MM-DD"));
                let count = parseInt(editCell.textContent, 10);
                editCell.textContent = (count - 1).toString(10);
                allTableAddValue = -1;
            }
            allTableEditCell.textContent = (parseInt(allTableEditCell.textContent, 10) + allTableAddValue).toString(10);
        }
    }
}
