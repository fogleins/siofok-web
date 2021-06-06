namespace Admin {
    export function loadUserManagement() {
        $.ajax({
            "url": "user_management.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {},
            "success": function (data: any) {
                if (data.success) {
                    let table: HTMLTableElement = document.getElementById("user-management") as HTMLTableElement;
                    for (let i = 0; i < data.length; i++) {
                        let row: HTMLTableRowElement = table.insertRow(i);
                        let j: number = 0;
                        for (const dataKey in data[i]) {
                            if (data[i].hasOwnProperty(dataKey) && dataKey != "success") {
                                let cell: HTMLTableCellElement = row.insertCell(j);
                                if (dataKey != "roles") {
                                    cell.textContent = data[i][dataKey];
                                } else {
                                    // TODO: display roles in a separate cell
                                    // for (const role of data[i][dataKey]) {
                                        cell.textContent = data[i][dataKey].join(", ");
                                    // }
                                }
                                j++;
                            }
                        }
                        // if the user has no roles (if we didn't add a cell here, there would be only 2 cells in this
                        // row)
                        if (!data[i]["roles"]) {
                            row.insertCell(2).textContent = "-";
                        }
                    }
                    let thead: HTMLTableSectionElement = table.tHead = document.createElement("thead");
                    thead.innerHTML = "<tr><th>ID</th><th>Name</th><th>Roles</th></tr>";
                }
            },
            "error": function (err: any) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
}