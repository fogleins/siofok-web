var Datepicker;
(function (Datepicker) {
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
                console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
            });
        });
    }
    $(() => {
        $("#date-add").on("click", function () {
            document.getElementById("date-add").textContent = "Hozzáadás";
            let table = document.getElementById("date-picker-table");
            let row = table.insertRow(table.rows.length - 1);
            let cell = row.insertCell(0);
            let textField = document.createElement("input");
            textField.type = "text";
            textField.classList.add("form-control");
            initDatePicker(textField);
            cell.appendChild(textField);
        });
    });
})(Datepicker || (Datepicker = {}));
//# sourceMappingURL=datepicker.js.map