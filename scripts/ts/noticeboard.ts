namespace Noticeboard {

    interface Message {
        id: number,
        authorName: string,
        authorPictureLink: string,
        created: string,
        content: string
    }

    $(async () => {
        await loadMessages();
        $("#send").on("click", () => sendMessage());
        // refresh messages automatically every 60 seconds
        window.setInterval(() => loadMessages(), 60000);
        window.setTimeout(() => scrollToLastMessage(), 300);
    })

    /**
     * Displays a message in the messages table.
     * @param message The message to display.
     * @private
     */
    function addMessage(message: Message): void {
        let table = document.getElementById("noticeboard") as HTMLTableElement;
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
        // profile picture
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
        // content.style.paddingLeft = "5%";
        // content.classList.add("pl-3");
        content.style.borderLeft = "1px solid lightgrey";
        content.style.verticalAlign = "top";
        content.textContent = message.content;
        cell.appendChild(messageControl);
    }

    /**
     * Loads and displays all messages.
     * @private
     */
    async function loadMessages() {
        if (USER_ID == null) {
            await getUserId();
        }
        await $.ajax({
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
        })
    }

    /**
     * Checks whether the given message is already displayed on the site.
     * @param message The message to check.
     * @return True if the noticeboard table already contains the message, false otherwise.
     * @private
     */
    function messageAlreadyDisplayed(message: Message): boolean {
        let displayedMessages = document.getElementById("noticeboard").querySelectorAll("tr");
        for (let i = 0; i < displayedMessages.length; i++) {
            if (displayedMessages[i].getAttribute("data-message-id") == message.id.toString()) {
                return true;
            }
        }
        return false;
    }

    /**
     * Scrolls the noticeboard so that it shows the last message.
     * @private
     */
    function scrollToLastMessage() {
        let container = document.getElementById("noticeboard-container");
        container.scrollTop = container.scrollHeight;
    }

    /**
     * Adds a message to the database and displays it.
     * @private
     */
    async function sendMessage() {
        if (USER_ID == null) {
            await getUserId();
        }
        let textArea = document.getElementById("message") as HTMLTextAreaElement;
        let messageContent: string = textArea.value.trim();
        $.ajax({
            method: "POST",
            url: "noticeboard_xhr_handler.php",
            timeout: 3000,
            dataType: "json",
            data: {
                userId: USER_ID,
                message: messageContent
            },
            success: async function (response) {
                if (response.success) {
                    textArea.value = "";
                    await loadMessages();
                    window.setTimeout(() => scrollToLastMessage(), 100);
                }
            }
        })
    }
}
