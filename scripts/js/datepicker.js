var Datepicker;
(function (Datepicker) {
    let Availability;
    (function (Availability) {
        Availability[Availability["busy"] = 0] = "busy";
        Availability[Availability["available"] = 1] = "available";
    })(Availability || (Availability = {}));
    let nextId = 0;
    function initDatePicker(element) {
        let fieldID = "rangePicker" + nextId;
        element.id = fieldID;
        nextId++;
        $(function () {
            $(`input[id=${fieldID}]`).daterangepicker({
                opens: "center",
                drops: "auto",
                cancelButtonClasses: "btn-outline-danger",
                "locale": {
                    "format": "YYYY. MM. DD.",
                    "separator": " - ",
                    "applyLabel": "Alkalmaz",
                    "cancelLabel": "Mégsem",
                    "fromLabel": "Ettől:",
                    "toLabel": "eddig:",
                    "customRangeLabel": "Custom",
                    "weekLabel": "W",
                    "daysOfWeek": [
                        "Vas",
                        "Hét",
                        "Kedd",
                        "Sze",
                        "Csüt",
                        "Pén",
                        "Szo"
                    ],
                    "monthNames": [
                        "Január",
                        "Február",
                        "Március",
                        "Április",
                        "Május",
                        "Június",
                        "Július",
                        "Augusztus",
                        "Szeptember",
                        "Október",
                        "November",
                        "December"
                    ],
                    "firstDay": 1
                },
                "minDate": "2021. 06. 12.",
                "maxDate": "2021. 09. 05."
            }, function (start, end, label) {
                $.ajax({
                    method: "POST",
                    url: "datepicker_xhr_handler.php",
                    timeout: 5000,
                    dataType: "json",
                    data: {
                        userId: USER_ID,
                        availability: Availability.available,
                        start: start.format("YYYY-MM-DD"),
                        end: end.format("YYYY-MM-DD"),
                        recordId: element.getAttribute("data-recordId")
                    },
                    success: function (response) {
                        if (response.success) {
                            Toast.showToast("Sikeres mentés", "A megadott időszak mentve.", BootstrapColors.success);
                            if (element.getAttribute("data-recordId") == null) {
                                element.setAttribute("data-recordId", response.recordId);
                            }
                        }
                        else {
                            Toast.showToast("Hiba", response.message, BootstrapColors.danger);
                        }
                    },
                    error: function (error) {
                        Toast.showToast("Hiba", "Az AJAX-kérés során hiba lépett fel. Részletek a konzolon.", BootstrapColors.danger);
                        console.log("AJAX error in request: " + JSON.stringify(error, null, 2));
                    }
                });
            });
        });
    }
    $(() => {
        $("#date-add").on("click", function () {
            document.getElementById("date-add").textContent = "Hozzáadás";
            addInputRow();
        });
    });
    function addInputRow() {
        let table = document.getElementById("date-picker-table");
        let row = table.insertRow(table.rows.length - 1);
        let cell = row.insertCell(0);
        let div = document.createElement("div");
        div.id = `form-group-${nextId}`;
        div.classList.add("input-group");
        let textField = document.createElement("input");
        textField.type = "text";
        textField.classList.add("form-control");
        let button = document.createElement("button");
        button.classList.add("btn", "btn-outline-danger");
        button.setAttribute("data-for-textfield", `rangePicker${nextId}`);
        button.setAttribute("data-parent", div.id);
        let btnId = `delete-btn-for-rangePicker${nextId}`;
        button.id = btnId;
        button.textContent = "Törlés";
        initDatePicker(textField);
        div.appendChild(textField);
        div.appendChild(button);
        cell.appendChild(div);
        $(`#${btnId}`).on("click", () => removeInputRow(button));
    }
    function removeInputRow(initiatingButton) {
        let textfieldId = initiatingButton.getAttribute("data-for-textfield");
        let textfield = document.getElementById(textfieldId);
        let recordId = textfield.getAttribute("data-recordId");
        if (recordId != null) {
            $.ajax({
                url: "datepicker_xhr_handler.php",
                method: "POST",
                timeout: 5000,
                dataType: "json",
                data: {
                    userId: USER_ID,
                    action: "delete",
                    recordId: recordId
                },
                success: function (response) {
                    if (response.success) {
                        Toast.showToast("Sikeres törlés", "A kiválasztott időintervallum sikeresen törölve lett.", BootstrapColors.success);
                    }
                    else {
                        Toast.showToast("Hiba", "A kiválasztott időintervallum törölése során " +
                            "hiba lépett fel.", BootstrapColors.danger);
                    }
                },
                error: function (err) {
                    Toast.showToast("Hiba", "A kiválasztott időintervallum törölése során " +
                        "hiba lépett fel.", BootstrapColors.danger);
                }
            });
        }
        let parentId = initiatingButton.getAttribute("data-parent");
        let parent = document.getElementById(parentId);
        let row = parent.parentElement;
        let table = row.parentElement;
        table.removeChild(row);
    }
})(Datepicker || (Datepicker = {}));
//# sourceMappingURL=datepicker.js.map