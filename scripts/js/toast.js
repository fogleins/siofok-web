var Toast;
(function (Toast) {
    let nextID = 0;
    function showToast(title, description, iconColor = BootstrapColors.primary) {
        const toastIDs = {
            toast: `toast-${nextID}`,
            header: `toast-${nextID}-header`,
            message: `toast-${nextID}-message`,
            icon: `toast-${nextID}-icon`,
            timestamp: `toast-${nextID}-timestamp`
        };
        nextID++;
        const toasts = document.getElementById("toasts");
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
        let jqToast = $('#' + toastIDs.toast);
        jqToast.on('hidden.bs.toast', function () {
            let toast = document.getElementById(toastIDs.toast);
            toast.parentElement.removeChild(toast);
        });
        document.getElementById(toastIDs.header).textContent = title;
        document.getElementById(toastIDs.message).textContent = description;
        let date = new Date(Date.now());
        document.getElementById(toastIDs.timestamp).textContent = date.toLocaleTimeString("hu");
        jqToast.toast('show');
    }
    Toast.showToast = showToast;
})(Toast || (Toast = {}));
//# sourceMappingURL=toast.js.map