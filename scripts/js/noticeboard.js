var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Noticeboard;
(function (Noticeboard) {
    $(() => __awaiter(this, void 0, void 0, function* () {
        yield loadMessages();
        $("#send").on("click", () => sendMessage());
        window.setInterval(() => loadMessages(), 60000);
        window.setTimeout(() => scrollToLastMessage(), 300);
    }));
    function addMessage(message) {
        let table = document.getElementById("noticeboard");
        let row = table.insertRow(table.rows.length);
        if (row.getAttribute("data-message-id") == null) {
            row.setAttribute("data-message-id", message.id.toString());
        }
        let cell = row.insertCell(0);
        let messageControl = document.createElement("table");
        messageControl.classList.add("table-sm", "table-borderless", "table-responsive");
        let mainRow = messageControl.insertRow(0);
        let authorNameCell = mainRow.insertCell(0);
        authorNameCell.textContent = message.authorName;
        authorNameCell.style.textAlign = "center";
        authorNameCell.style.fontSize = "10pt";
        authorNameCell.style.verticalAlign = "middle";
        let picture = document.createElement("img");
        picture.src = message.authorPictureLink;
        picture.alt = "profilkép";
        picture.style.width = "90%";
        let pictureCell = mainRow.insertCell(0);
        pictureCell.style.textAlign = "center";
        pictureCell.style.width = "60px";
        pictureCell.rowSpan = 2;
        pictureCell.appendChild(picture);
        let createdCell = messageControl.insertRow(1).insertCell(0);
        createdCell.textContent = message.created;
        createdCell.style.width = "16ch";
        createdCell.style.textAlign = "center";
        createdCell.style.fontSize = "10pt";
        createdCell.style.verticalAlign = "middle";
        let content = mainRow.insertCell(2);
        content.rowSpan = 2;
        content.style.borderLeft = "1px solid lightgrey";
        content.style.verticalAlign = "top";
        content.textContent = message.content;
        cell.appendChild(messageControl);
    }
    function loadMessages() {
        return __awaiter(this, void 0, void 0, function* () {
            if (USER_ID == null) {
                yield getUserId();
            }
            yield $.ajax({
                method: "GET",
                url: "noticeboard_xhr_handler.php",
                timeout: 3000,
                dataType: "json",
                data: {
                    userId: USER_ID,
                },
                success: function (response) {
                    if (response.success) {
                        for (let i = 0; i < response.messages.length; i++) {
                            if (!messageAlreadyDisplayed(response.messages[i])) {
                                addMessage(response.messages[i]);
                                console.log("message " + response.messages[i].id + " loaded");
                            }
                        }
                    }
                }
            });
        });
    }
    function messageAlreadyDisplayed(message) {
        let displayedMessages = document.getElementById("noticeboard").querySelectorAll("tr");
        for (let i = 0; i < displayedMessages.length; i++) {
            if (displayedMessages[i].getAttribute("data-message-id") == message.id.toString()) {
                return true;
            }
        }
        return false;
    }
    function scrollToLastMessage() {
        let container = document.getElementById("noticeboard-container");
        container.scrollTop = container.scrollHeight;
    }
    function sendMessage() {
        return __awaiter(this, void 0, void 0, function* () {
            if (USER_ID == null) {
                yield getUserId();
            }
            let textArea = document.getElementById("message");
            let messageContent = textArea.value.trim();
            $.ajax({
                method: "POST",
                url: "noticeboard_xhr_handler.php",
                timeout: 3000,
                dataType: "json",
                data: {
                    userId: USER_ID,
                    message: messageContent
                },
                success: function (response) {
                    return __awaiter(this, void 0, void 0, function* () {
                        if (response.success) {
                            textArea.value = "";
                            yield loadMessages();
                            window.setTimeout(() => scrollToLastMessage(), 100);
                        }
                    });
                }
            });
        });
    }
})(Noticeboard || (Noticeboard = {}));
//# sourceMappingURL=noticeboard.js.map