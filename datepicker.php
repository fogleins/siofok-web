<?php
    session_start();
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        $_SESSION["redirect"] = "datepicker.php";
        exit();
    } else {
        include "utils.php";
        Utils::logEvent(LogType::PAGE_VISIT(), "datepicker.php", $_SESSION['userId']);
    }
    include "include/header.php";
    // allow only verified users
    if (!Utils::requireRole("verified")) {
        include "include/403.php";
        http_response_code(403);
        die();
    }
?>
<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Időpontválasztás</title>
</head>
<body>
<script type="text/javascript" src="include/dateRangePicker/moment.min.js"></script>
<script type="text/javascript" src="include/dateRangePicker/daterangepicker.min.js"></script>
<script type="text/javascript" src="scripts/js/datepicker.js"></script>
<script type="text/javascript" src="scripts/js/toast.js"></script>
<link rel="stylesheet" href="include/dateRangePicker/daterangepicker.css"/>
<!-- toasts begin -->
<div aria-live="polite" aria-atomic="true" class="position-fixed" id="toasts-parent">
    <div class="toast-container position-absolute top-0 end-0 p-3" id="toasts"></div>
</div>
<!-- toasts end -->
<div class="wrapper-div">
    <div class="text-center h2-top-center-margin">
        <h2 class="text-primary">Időpontválasztás</h2>
        <h6 class="text-subtitle">Add meg, hogy mikor érsz rá</h6>
    </div>
    <div class="floating-div">
        <table id="date-picker-table" class="table table-borderless">
            <tr>
                <td>
                    <button class="btn btn-outline-success playlist-div mt-3" id="date-add">Időpont megadása</button>
                </td>
            </tr>
        </table>
    </div>
    <?php include "include/footer.php" ?>
</div>

</body>
</html>
