namespace Toast {
    let nextID: number = 0;

    /**
     * Shows a bootstrap toast with the given parameters.
     * @param title The title of the toast.
     * @param description The description of the toast.
     * @param iconColor The color of the icon that is shown in the toast. BootstrapColors.primary by default.
     */
    export function showToast(title: string, description: string, iconColor: string = BootstrapColors.primary): void {
        const toastIDs = {
            toast: `toast-${nextID}`,
            header: `toast-${nextID}-header`,
            message: `toast-${nextID}-message`,
            icon: `toast-${nextID}-icon`,
            timestamp: `toast-${nextID}-timestamp`
        };
        nextID++;

        const toasts: HTMLDivElement = document.getElementById("toasts") as HTMLDivElement;
        toasts.innerHTML +=
            `<div class='toast' id='${toastIDs.toast}' role='alert' aria-live='assertive' aria-atomic='true'>` +
            `  <div class='toast-header'>` +
            "    <svg class='bd-placeholder-img rounded me-2' aria-hidden='true' focusable='false' " +
            "      width='15px' height='15px'>" +
            `      <rect id='${toastIDs.icon}' width='100%' height='100%' fill='${iconColor}'></rect>` +
            "    </svg>" +
            `    <strong class='me-auto' id='${toastIDs.header}'></strong>` +
            `    <small id='${toastIDs.timestamp}'></small>` +
            "    <button type='button' class='btn-close' data-bs-dismiss='toast' aria-label='Close'></button>" +
            "  </div>" +
            `  <div class='toast-body' id='${toastIDs.message}'></div>` +
            "</div>";

        // the toast element returned by jQuery
        let jqToast = $('#' + toastIDs.toast);
        // remove the toast from the html code after it disappears
        jqToast.on('hidden.bs.toast', function () {
            let toast = document.getElementById(toastIDs.toast);
            toast.parentElement.removeChild(toast);
        })
        document.getElementById(toastIDs.header).textContent = title;
        document.getElementById(toastIDs.message).textContent = description;
        let date: Date = new Date(Date.now()) as Date;
        document.getElementById(toastIDs.timestamp).textContent = date.toLocaleTimeString("hu");

        jqToast.toast('show');
    }
}
