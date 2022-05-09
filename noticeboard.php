<?php
    session_start();
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        $_SESSION["redirect"] = "noticeboard.php";
        exit();
    } else {
        include "utils.php";
        Utils::logEvent(LogType::PAGE_VISIT(), "noticeboard.php", $_SESSION['userId']);
    }
    include "include/header.php";
    // allow only verified users
    if (!Utils::requireRole("verified")) {
        include "include/403.php";
        http_response_code(403);
        exit();
    }
?>
<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Üzenőfal</title>
</head>
<body>
<script type="text/javascript" src="scripts/js/noticeboard.js"></script>
<div class="wrapper-div">
    <div class="text-center h2-top-center-margin">
        <h2 class="text-primary">Üzenőfal</h2>
        <h6 class="text-subtitle">
            Egyelőre senki sem tudja, hogy ez mire lesz jó, de szerencsére implementálva lett <br>
            Javaslat by DAM, implementáció by me
        </h6>
    </div>
    <div class="floating-div col-sm-8 col-md-5 col-lg-4" style="height: 30%">
        <div class="container scrollable-table-container" id="noticeboard-container">
            <table class="table table-hover table-responsive" id="noticeboard"></table>
        </div>
        <div class="input-group mt-3">
            <label for="message"></label>
            <textarea class="form-control" maxlength="1500" name="message" id="message"
                      placeholder="Írd ide az üzenetet"></textarea>
            <button class="btn btn-outline-primary" id="send">Küldés</button>
        </div>
    </div>
    <?php include "include/footer.php"; ?>
</div>
</body>
</html>