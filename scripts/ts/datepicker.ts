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
                // make the first available date today
                "minDate": new Date(Date.now()).toLocaleDateString("hu"),
                "maxDate": "2021. 09. 05.",
                "startDate": startDate,
                "endDate": endDate
            }, function (start: moment.Moment, end: moment.Moment, label: string | null) {
                postChanges(element, start, end, label);
            });
        });
    }

    function postChanges(element: HTMLInputElement, start: moment.Moment, end: moment.Moment, label?: string | null) {
        $.ajax({
            method: "POST",
            url: "datepicker_xhr_handler.php",
            timeout: 5000,
            dataType: "json",
            data: {
                userId: USER_ID,
                availability: (document.getElementById(element.id + "IsBusy") as HTMLInputElement)
                    .checked ? Availability.busy : Availability.available,
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
                    let table: HTMLTableElement =
                        document.getElementById("date-picker-table") as HTMLTableElement;
                    let rows = table.rows;
                    for (let i = 0; i < rows.length - 1; i++) {
                        for (let j = i + 1; j < rows.length - 1; j++) {
                            if (rows[j].children[0] != null && response.data[i].response_ID == rows[j].children[0]
                                .children[0].children[0].getAttribute("data-recordId")) {
                                rows[i].parentNode.insertBefore(rows[j], rows[i]);
                            }
                        }
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
        await listDates();
    })

    /**
     * Adds a row to the table with a form group consisting of an input field and a delete button.
     * @private
     */
    function addInputRow(recordId?: number, startDate?: any, endDate?: any, availability?: Availability) {
        // creater moment objects from the strings
        if (typeof startDate == "string") {
            startDate = moment(startDate, "YYYY. MM. DD.");
        }
        if (typeof endDate == "string") {
            endDate = moment(endDate, "YYYY. MM. DD.");
        }
        let id: number = nextId;
        let table: HTMLTableElement = document.getElementById("date-picker-table") as HTMLTableElement;
        let row = table.insertRow(table.rows.length - 1);
        let cell = row.insertCell(0);
        // div
        let div = document.createElement("div");
        div.id = `form-group-${nextId}`;
        div.classList.add("input-group");
        // textfield
        let textField: HTMLInputElement = document.createElement("input");
        textField.type = "text";
        textField.classList.add("form-control");
        if (recordId != null) {
            textField.setAttribute("data-recordId", recordId.toString(10));
        }
        // button
        let button = document.createElement("button");
        button.classList.add("btn", "btn-outline-danger");
        button.setAttribute("data-for-textfield", `rangePicker${nextId}`);
        button.setAttribute("data-parent", div.id);
        let btnId = `delete-btn-for-rangePicker${nextId}`;
        button.id = btnId;
        button.textContent = "Törlés";
        // checkbox
        let checkboxDiv = document.createElement("div");
        checkboxDiv.classList.add("input-group-text");
        let busy = document.createElement("input");
        busy.id = `rangePicker${nextId}IsBusy`;
        busy.type = "checkbox";
        busy.checked = availability == Availability.busy;
        busy.classList.add("form-check-input");
        // let busyLabel = document.createElement("span");
        // busyLabel.classList.add("input-group-text");
        initDatePicker(textField, startDate, endDate);
        checkboxDiv.setAttribute("data-toggle", "tooltip");
        checkboxDiv.setAttribute("data-bs-container", "div");
        checkboxDiv.setAttribute("data-bs-placement", "top");
        checkboxDiv.setAttribute("data-bs-html", "true");
        checkboxDiv.title = "<b>Elfoglaltnak jelölés</b><br>A megadott időszak alapértelmezésben szabadként kerül " +
            "mentésre. Ha inkább azt adnád meg, hogy mikor <em>nem</em> érsz rá, jelöld be ezt a négyzetet.";
        // add items to input group
        div.appendChild(textField);
        // div.appendChild(busyLabel);
        checkboxDiv.appendChild(busy);
        div.appendChild(checkboxDiv);
        div.appendChild(button);
        cell.appendChild(div);
        $(`#${btnId}`).on("click", () => removeInputRow(button));
        // initialize tooltip
        $('[data-toggle="tooltip"]').tooltip();
        // add event handler to the checkbox
        $(`#rangePicker${id}IsBusy`).on("change", () => {
            let checkbox = (document.getElementById(`rangePicker${id}IsBusy`) as HTMLInputElement);
            let rangePicker: JQuery = $(`#rangePicker${id}`);
            startDate = rangePicker.data("daterangepicker").startDate;
            endDate = rangePicker.data("daterangepicker").endDate;
            if ((typeof startDate != "undefined" && typeof endDate != "undefined")
                && startDate.format("YYYY-MM-DD") != endDate.format("YYYY-MM-DD")
                && textField.getAttribute("data-recordId") != null) {
                postChanges(textField, startDate, endDate);
            } else {
                checkbox.checked = false;
                Toast.showToast("Figyelmeztetés", "Először add meg a dátumot, " +
                    "a jelölőnégyzetet csak utána jelölheted be.", BootstrapColors.warning);
            }
        });
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

    async function listDates() {
        await $.ajax({
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
                            new Date(response.data[i].end_date).toLocaleDateString("hu"),
                            response.data[i].availability);
                    }
                }
            }
        })
    }
}
