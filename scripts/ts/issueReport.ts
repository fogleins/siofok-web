namespace IssueReport {
    $(() => {
        $("#issue-submit").on("click", function () {
            let page: string = (document.getElementById("issue-page") as HTMLInputElement).value.trim();
            let issue: string = (document.getElementById("issue-details") as HTMLTextAreaElement)
                .value.trim();
            if ((page == null || page.length == 0) || (issue == null || issue.length == 0)) {
                Toast.showToast("Hiba", "Mindkét mezőt töltsd ki!", BootstrapColors.warning);
            } else {
                $.ajax({
                    url: "issue_report_handler.php",
                    method: "POST",
                    timeout: 5000,
                    dataType: "json",
                    data: {
                        page: page,
                        issue: issue
                    },
                    success: function (response) {
                        if (response.success) {
                            Toast.showToast("Siker", "A bejelentés sikeresen mentve.",
                                BootstrapColors.success);
                        } else {
                            Toast.showToast("Hiba", "A bejelentés mentése során hiba lépett fel.",
                                BootstrapColors.danger);
                        }
                    }
                })
            }
        })
    })
}
