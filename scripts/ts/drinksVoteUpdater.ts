class DrinksVoteUpdater {
    // The number of seconds between updates
    private _interval: number;
    private _userID: number;
    private static _instance: DrinksVoteUpdater = new DrinksVoteUpdater();

    static get instance() {
        return DrinksVoteUpdater._instance;
    }

    /**
     * Creates a DrinksVoteUpdater object.
     * @param interval The number of seconds between updates.
     */
    private constructor(interval: number = 30) {
        this._interval = interval;
    }

    set userId(value: number) {
        this._userID = value;
        this.update();
        window.setInterval(this.update, this._interval * 1000);
    }

    get userId() {
        return this._userID;
    }

    get interval() {
        return this._interval;
    }

    /**
     * @param value The number of seconds between updates.
     */
    set interval(value: number) {
        this._interval = value;
    }

    update(): void {
        document.getElementById("drinks-subtitle").textContent
            = `Az adatok ${DrinksVoteUpdater.instance.interval} másodpercenként automatikusan frissülnek`;
        $.ajax({
            "url": "vote_updater.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                userId: DrinksVoteUpdater.instance.userId
            },
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
                    document.getElementById(("drinks-plus-btn-" + i)).onclick = function () {
                        submitVote(DrinksVoteUpdater.instance.userId, data[i][0], VoteType.drinkAdd);
                        DrinksVoteUpdater.instance.update();
                    };
                    (document.getElementById("drinks-minus-btn-" + i) as HTMLButtonElement)
                        .disabled = data[i][4];
                    document.getElementById(("drinks-minus-btn-" + i)).onclick = function () {
                        submitVote(DrinksVoteUpdater.instance.userId, data[i][0], VoteType.drinkRemove);
                        DrinksVoteUpdater.instance.update();
                    };
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
    addSuggestion() {
        let suggestion: string = (document.getElementById("drink-suggestion") as HTMLInputElement).value.trim();
        if (suggestion == null || suggestion == "") {
            showToast("Hiba", "Nem adtál meg értéket.");
            return;
        }
        let rows = (document.getElementById("drinks-table") as HTMLTableElement).rows;
        // check if the suggested value already exists in the table
        // if yes, the suggestion will not be saved
        for (const row in rows) {
            if (rows.hasOwnProperty(row) && rows[row].cells[0].textContent.toLowerCase() == suggestion.toLowerCase()) {
                showToast("Hiba", `'${suggestion}' már szerepel a lehetőségek között, így most nem ` +
                    "kerül hozzáadásra.", BootstrapColors.warning);
                return;
            }
        }
        $.ajax({
            "url": "vote_handler.php",
            "type": "GET",
            "timeout": 5000,
            "dataType": "json",
            "data": {
                action: VoteType.drinkAddSuggestion,
                userId: DrinksVoteUpdater.instance.userId,
                drinkName: suggestion
            },
            "success": function (data: any) {
                if (data.success) {
                    DrinksVoteUpdater.instance.update();
                    showToast("Sikeres művelet", "Javaslatod rögzítésre került.");
                    console.log("suggestion successfully saved");
                }
            },
            "error": function (err: any) {
                showToast("Sikertelen művelet", "Javaslatod mentése során hiba lépett fel.",
                    BootstrapColors.danger);
                console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
            }
        });
    }
}
