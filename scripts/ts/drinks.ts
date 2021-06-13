namespace Drinks {

    enum VoteType {
        drinkAdd,
        drinkRemove,
        drinkAddSuggestion
    }

    // The number of seconds between updates
    let updateInterval: number = 30;

    // called when the page has been loaded
    $(() => {
        // update the table and set the update timer
        update().then(() => window.setInterval(update, updateInterval * 1000));
        $("#add-suggestion-btn").on("click", function () {
            addSuggestion();
        })
    })

    /**
     * Adds or removes a vote from a drink.
     * @param drinkID The ID of the drink to add or remove the vote to/from
     * @param action The type of action: should be VoteType.drinkAdd or VoteType.drinkRemove
     * @private
     */
    function submitVote(drinkID: number, action: VoteType): void {
        $.ajax({
            "url": "vote_handler.php",
            "type": "POST",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                action: action,
                userId: USER_ID,
                drinkId: drinkID
            },
            "success": function (data: any) {
                if (data.success) {
                    if (action == VoteType.drinkAdd) {
                        Toast.showToast("Sikeres művelet", "Szavazatod sikeresen rögzítésre került.",
                            BootstrapColors.success);
                        console.log("vote successfully saved");
                    } else if (action == VoteType.drinkRemove) {
                        Toast.showToast("Sikeres művelet", "Szavazatod sikeresen törlésre került.",
                            BootstrapColors.success);
                        console.log("vote successfully removed");
                    }
                } else {
                    Toast.showToast("Hiba", "A művelet során hiba lépett fel.", BootstrapColors.danger)
                }
            },
            "error": function (err: any) {
                Toast.showToast("Hiba", "A művelet során hiba lépett fel.", BootstrapColors.danger);
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }

    /**
     * Updates the table.
     * @private
     */
    async function update() {
        document.getElementById("drinks-subtitle").textContent
            = `Az adatok ${updateInterval} másodpercenként automatikusan frissülnek`;
        return $.ajax({
            "url": "vote_updater.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "success": function (data: any) {
                let table: HTMLTableElement = document.getElementById("drinks-table") as HTMLTableElement;
                if (data.length == 0) {
                    // if there's no data to show, displays a text
                    document.getElementById("drinks-no-data").hidden = false;
                    return;
                }
                document.getElementById("drinks-no-data").hidden = true;
                for (let i = 0; i < data.length; i++) {
                    let row: HTMLTableRowElement;
                    // if a new row should be added
                    if (i == table.rows.length) {
                        row = table.insertRow(i);
                        for (let k = 0; k < 4; k++) {
                            let cell: HTMLTableCellElement = row.insertCell(k);
                            // custom style for the table
                            cell.classList.add("drinks-td");
                            // first two cells contain text
                            if (k < 2) {
                                cell.classList.add("text-primary");
                            } else { // last two cells contain buttons
                                let button: HTMLButtonElement = document.createElement(
                                    'button') as HTMLButtonElement;
                                button.classList.add("btn", "btn-sm", "drinks-vote-btn");
                                if (k == 2) { // green "+" button
                                    button.classList.add("btn-outline-success");
                                    button.id = "drinks-plus-btn-" + i;
                                    button.textContent = "+";
                                } else { // red "-" button
                                    button.classList.add("btn-outline-danger");
                                    button.id = "drinks-minus-btn-" + i;
                                    button.textContent = "-";
                                }
                                cell.appendChild(button);
                            }
                        }
                    } else {
                        row = document.querySelectorAll("tr")[i] as HTMLTableRowElement;
                    }
                    for (let j = 1; j < 3; j++) {
                        row.querySelectorAll("td")[j - 1].innerHTML = data[i][j];
                    }
                    (document.getElementById("drinks-plus-btn-" + i) as HTMLButtonElement)
                        .disabled = data[i][3];
                    // remove previously added click event handler, and add a new
                    $(`#drinks-plus-btn-${i}`).off("click").on("click", function () {
                        submitVote(data[i][0], VoteType.drinkAdd);
                        update();
                    });
                    (document.getElementById("drinks-minus-btn-" + i) as HTMLButtonElement)
                        .disabled = data[i][4];
                    // remove previously added click event handler, and add a new
                    $(`#drinks-minus-btn-${i}`).off("click").on("click", function () {
                        submitVote(data[i][0], VoteType.drinkRemove);
                        update();
                    });
                }
            },
            "error": function (err: any) {
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }

    /**
     * Adds a new drink.
     */
    async function addSuggestion() {
        // update the table to make sure that it contains the correct data, so we can check if the suggestion already
        // exists in the table (this update call is not strictly necessary, but secures that we don't add an item
        // that already exists in the table even if the user changed the content using the in-browser console)
        await update();

        let suggestion: string = (document.getElementById("drink-suggestion") as HTMLInputElement).value.trim();
        if (suggestion == null || suggestion == "" || suggestion.length > 200) {
            Toast.showToast("Hiba", "Nem adtál meg értéket vagy túl hosszú a megadott ital neve.",
                BootstrapColors.warning);
            return;
        }
        let rows = (document.getElementById("drinks-table") as HTMLTableElement).rows;
        // check if the suggested value already exists in the table
        // if yes, the suggestion will not be saved
        for (const row in rows) {
            if (rows.hasOwnProperty(row) && rows[row].cells[0].textContent.toLowerCase() == suggestion.toLowerCase()) {
                Toast.showToast("Hiba", `'${suggestion}' már szerepel a lehetőségek között, így most ` +
                    `nem kerül hozzáadásra.`, BootstrapColors.warning);
                return;
            }
        }
        $.ajax({
            "url": "vote_handler.php",
            "type": "POST",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                action: VoteType.drinkAddSuggestion,
                userId: USER_ID,
                drinkName: suggestion
            },
            "success": function (data: any) {
                if (data.success) {
                    update();
                    Toast.showToast("Sikeres művelet", "Javaslatod rögzítésre került.",
                        BootstrapColors.success);
                    console.log("suggestion successfully saved");
                }
            },
            "error": function (err: any) {
                Toast.showToast("Sikertelen művelet", "Javaslatod mentése során hiba lépett fel.",
                    BootstrapColors.danger);
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
}
