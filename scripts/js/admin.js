var Admin;
(function (Admin) {
    function loadUserManagement() {
        $.ajax({
            "url": "user_management.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {},
            "success": function (data) {
                if (data.success) {
                    let table = document.getElementById("user-management");
                    for (let i = 0; i < data.length; i++) {
                        let row = table.insertRow(i);
                        let j = 0;
                        for (const dataKey in data[i]) {
                            if (data[i].hasOwnProperty(dataKey) && dataKey != "success") {
                                let cell = row.insertCell(j);
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
                    }
                    let thead = table.tHead = document.createElement("thead");
                    thead.innerHTML = "<tr><th>ID</th><th>Name</th><th>Roles</th></tr>";
                }
            },
            "error": function (err) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
    Admin.loadUserManagement = loadUserManagement;
})(Admin || (Admin = {}));
//# sourceMappingURL=admin.js.map