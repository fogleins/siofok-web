<?php
    session_start();
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        $_SESSION["redirect"] = "issue_report.php";
        exit();
    } else {
        include "utils.php";
        Utils::logEvent(LogType::PAGE_VISIT(), "issue_report.php", $_SESSION['userId']);
    }
    include "include/header.php";
?>
<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Hibabejelentés</title>
</head>
<body>
<script type="text/javascript" src="scripts/js/toast.js"></script>
<script type="text/javascript" src="scripts/js/issueReport.js"></script>
<!-- toasts begin -->
<div aria-live="polite" aria-atomic="true" class="position-fixed" id="toasts-parent">
    <div class="toast-container position-absolute top-0 end-0 p-3" id="toasts"></div>
</div>
<!-- toasts end -->
<div class="wrapper-div">
    <div class="text-center h2-top-center-margin">
        <h2 class="text-primary">Hibabejelentés</h2>
    </div>
    <div class="floating-div col-sm-10 col-lg-6">
        <table class="table table-borderless">
            <tr><td>
                <label for="issue-page"></label>
                <input type="text" class="form-control" id="issue-page" maxlength="50"
                       placeholder="Melyik oldalon tapasztaltad a hibát?">
            </td></tr>
            <tr><td>
                <label for="issue-details"></label>
                <textarea class="form-control" id="issue-details" maxlength="1000"
                          placeholder="Írd le, hogy mi nem működött megfelelően"></textarea>
            </td></tr>
            <tr><td style="text-align: right">
                <button class="btn btn-outline-success" id="issue-submit">Mentés</button>
            </td></tr>
        </table>
    </div>
    <?php include "include/footer.php" ?>
</div>

</body>
</html>
