namespace Datepicker {
    let nextId: number = 0;

    /**
     * Initializes the element to show a date range picker on click.
     * @param element The element to which the date range picker should be added.
     * @private
     */
    function initDatePicker(element: HTMLInputElement) {
        let fieldID: string = "rangePicker" + nextId;
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
            }, function (start: any, end: any, label: any) { // TODO: add the matching types
                console.log("A new date selection was made: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
            });
        });
    }

    $(() => {
        /**
         * Event handler for the add button. Adds a row to the table and inside the cell, adds a text field and
         * initializes it to show a date range picker on click.
         */
        $("#date-add").on("click", function () {
            document.getElementById("date-add").textContent = "Hozzáadás";
            let table: HTMLTableElement = document.getElementById("date-picker-table") as HTMLTableElement;
            let row = table.insertRow(table.rows.length - 1);
            let cell = row.insertCell(0);
            let textField: HTMLInputElement = document.createElement("input");
            textField.type = "text";
            textField.classList.add("form-control")
            initDatePicker(textField);
            cell.appendChild(textField);
        })
    })
}
