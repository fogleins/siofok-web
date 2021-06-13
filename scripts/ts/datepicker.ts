namespace Datepicker {

    enum Availability {
        busy,
        available
    }

    let nextId: number = 0;

    /**
     * Initializes the element to show a date range picker on click.
     * @param element The element to which the date range picker should be added.
     * @param startDate The start of the range selected by default, optional.
     * @param endDate The end of the range selected by default, optional.
     * @private
     */
    function initDatePicker(element: HTMLInputElement, startDate?: string, endDate?: string) {
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
                "maxDate": "2021. 09. 05.",
                "startDate": startDate,
                "endDate": endDate
            }, function (start: any, end: any, label: any) { // TODO: add the matching types
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
                            Toast.showToast("Sikeres mentés", "A megadott időszak mentve.",
                                BootstrapColors.success);
                            if (element.getAttribute("data-recordId") == null) {
                                element.setAttribute("data-recordId", response.recordId);
                            }
                        } else {
                            Toast.showToast("Hiba", response.message, BootstrapColors.danger);
                        }
                    },
                    error: function (error) {
                        Toast.showToast("Hiba",
                            "Az AJAX-kérés során hiba lépett fel. Részletek a konzolon.", BootstrapColors.danger);
                        console.log("AJAX error in request: " + JSON.stringify(error, null, 2));
                    }
                });
            });
        });
    }

    $(async () => {
        /**
         * Event handler for the add button. Adds a row to the table and inside the cell, adds a text field and
         * initializes it to show a date range picker on click.
         */
        $("#date-add").on("click", function () {
            document.getElementById("date-add").textContent = "Hozzáadás";
            addInputRow();
        })
        if (USER_ID == null) {
            await getUserId();
        }
        $.ajax({
            url: "datepicker_xhr_handler.php",
            method: "GET",
            timeout: 5000,
            dataType: "json",
            data: {
                userId: USER_ID,
                action: "query"
            },
            success: function (response) {
                if (response.success) {
                    for (let i = 0; i < response.data.length; i++) {
                        addInputRow(response.data[i].response_ID,
                            new Date(response.data[i].start_date).toLocaleDateString("hu"),
                            new Date(response.data[i].end_date).toLocaleDateString("hu"));
                    }
                }
            }
        })
    })

    /**
     * Adds a row to the table with a form group consisting of an input field and a delete button.
     * @private
     */
    function addInputRow(recordId?: number, startDate?: string, endDate?: string) {
        let table: HTMLTableElement = document.getElementById("date-picker-table") as HTMLTableElement;
        let row = table.insertRow(table.rows.length - 1);
        let cell = row.insertCell(0);
        let div = document.createElement("div");
        div.id = `form-group-${nextId}`;
        div.classList.add("input-group");
        let textField: HTMLInputElement = document.createElement("input");
        textField.type = "text";
        textField.classList.add("form-control");
        if (recordId != null) {
            textField.setAttribute("data-recordId", recordId.toString(10));
        }
        let button = document.createElement("button");
        button.classList.add("btn", "btn-outline-danger");
        button.setAttribute("data-for-textfield", `rangePicker${nextId}`);
        button.setAttribute("data-parent", div.id);
        let btnId = `delete-btn-for-rangePicker${nextId}`;
        button.id = btnId;
        button.textContent = "Törlés";
        initDatePicker(textField, startDate, endDate);
        div.appendChild(textField);
        div.appendChild(button);
        cell.appendChild(div);
        $(`#${btnId}`).on("click", () => removeInputRow(button));
    }

    /**
     * Removes the selected row and its related data.
     * @param initiatingButton The button the user clicked on to delete the data.
     * @private
     */
    function removeInputRow(initiatingButton: HTMLButtonElement) {
        let textfieldId: string = initiatingButton.getAttribute("data-for-textfield");
        let textfield = document.getElementById(textfieldId);
        let recordId: string = textfield.getAttribute("data-recordId");
        // if the field is associated with a given record, we need to remove its data from the database
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
                        Toast.showToast("Sikeres törlés",
                            "A kiválasztott időintervallum sikeresen törölve lett.", BootstrapColors.success);
                    } else {
                        Toast.showToast("Hiba", "A kiválasztott időintervallum törölése során " +
                            "hiba lépett fel.", BootstrapColors.danger);
                    }
                },
                error: function (err) {
                    Toast.showToast("Hiba", "A kiválasztott időintervallum törölése során " +
                        "hiba lépett fel.", BootstrapColors.danger);
                }
            })
        }
        // remove the elements from the document
        let parentId = initiatingButton.getAttribute("data-parent");
        let parent = document.getElementById(parentId);
        let row = parent.parentElement;
        let table = row.parentElement;
        table.removeChild(row);
    }
}
