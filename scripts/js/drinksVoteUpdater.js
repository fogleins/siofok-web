var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
class DrinksVoteUpdater {
    constructor(interval = 30) {
        this._interval = interval;
    }
    static get instance() {
        return DrinksVoteUpdater._instance;
    }
    set userId(value) {
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
    set interval(value) {
        this._interval = value;
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            document.getElementById("drinks-subtitle").textContent
                = `Az adatok ${DrinksVoteUpdater.instance.interval} másodpercenként automatikusan frissülnek`;
            return $.ajax({
                "url": "vote_updater.php",
                "type": "GET",
                "timeout": 5000,
                "dataType": "json",
                "data": {
                    userId: DrinksVoteUpdater.instance.userId
                },
                "success": function (data) {
                    let table = document.getElementById("drinks-table");
                    if (data.length == 0) {
                        document.getElementById("drinks-no-data").hidden = false;
                        return;
                    }
                    document.getElementById("drinks-no-data").hidden = true;
                    for (let i = 0; i < data.length; i++) {
                        let row;
                        if (i == table.rows.length) {
                            row = table.insertRow(i);
                            for (let k = 0; k < 4; k++) {
                                let cell = row.insertCell(k);
                                cell.classList.add("drinks-td");
                                if (k < 2) {
                                    cell.classList.add("text-primary");
                                }
                                else {
                                    let button = document.createElement('button');
                                    button.classList.add("btn", "btn-sm", "drinks-vote-btn");
                                    if (k == 2) {
                                        button.classList.add("btn-outline-success");
                                        button.id = "drinks-plus-btn-" + i;
                                        button.textContent = "+";
                                    }
                                    else {
                                        button.classList.add("btn-outline-danger");
                                        button.id = "drinks-minus-btn-" + i;
                                        button.textContent = "-";
                                    }
                                    cell.appendChild(button);
                                }
                            }
                        }
                        else {
                            row = document.querySelectorAll("tr")[i];
                        }
                        for (let j = 1; j < 3; j++) {
                            row.querySelectorAll("td")[j - 1].innerHTML = data[i][j];
                        }
                        document.getElementById("drinks-plus-btn-" + i)
                            .disabled = data[i][3];
                        document.getElementById(("drinks-plus-btn-" + i)).onclick = function () {
                            submitVote(DrinksVoteUpdater.instance.userId, data[i][0], VoteType.drinkAdd);
                            DrinksVoteUpdater.instance.update();
                        };
                        document.getElementById("drinks-minus-btn-" + i)
                            .disabled = data[i][4];
                        document.getElementById(("drinks-minus-btn-" + i)).onclick = function () {
                            submitVote(DrinksVoteUpdater.instance.userId, data[i][0], VoteType.drinkRemove);
                            DrinksVoteUpdater.instance.update();
                        };
                    }
                },
                "error": function (err) {
                    console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
                }
            });
        });
    }
    addSuggestion() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.update();
            let suggestion = document.getElementById("drink-suggestion").value.trim();
            if (suggestion == null || suggestion == "") {
                Toast.showToast("Hiba", "Nem adtál meg értéket.", BootstrapColors.warning);
                return;
            }
            let rows = document.getElementById("drinks-table").rows;
            for (const row in rows) {
                if (rows.hasOwnProperty(row) && rows[row].cells[0].textContent.toLowerCase() == suggestion.toLowerCase()) {
                    Toast.showToast("Hiba", `'${suggestion}' már szerepel a lehetőségek között, így most ` +
                        `nem kerül hozzáadásra.`, BootstrapColors.warning);
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
                "success": function (data) {
                    if (data.success) {
                        DrinksVoteUpdater.instance.update();
                        Toast.showToast("Sikeres művelet", "Javaslatod rögzítésre került.", BootstrapColors.success);
                        console.log("suggestion successfully saved");
                    }
                },
                "error": function (err) {
                    Toast.showToast("Sikertelen művelet", "Javaslatod mentése során hiba lépett fel.", BootstrapColors.danger);
                    console.log("AJAX error in request: " + JSON.stringify(err, null, 2));
                }
            });
        });
    }
}
DrinksVoteUpdater._instance = new DrinksVoteUpdater();
//# sourceMappingURL=drinksVoteUpdater.js.map