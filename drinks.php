<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Italok</title>
</head>
<?php
    include_once "utils.php";
    session_start();
    include "include/header.php";
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        $_SESSION['redirect'] = "drinks.php";
        echo "<body>";
        exit();
    } else {
        Utils::logEvent(LogType::PAGE_VISIT(), "drinks.php", $_SESSION['userId']);
    }
    // allow only verified users
    if (!Utils::requireRole("verified")) {
        include "include/403.php";
        http_response_code(403);
        die();
    }
?>
<!-- jQuery, the bootstrap js api, and scripts/js/scripts.js will be included by including 'include/header.php' below -->
<script src="scripts/js/toast.js"></script>
<script src="scripts/js/drinks.js"></script>
<body>
<!-- div for toasts -->
<div aria-live="polite" aria-atomic="true" class="position-fixed" id="toasts-parent">
    <!-- - `.toast-container` for spacing between toasts -->
    <!-- - `.position-absolute`, `top-0` & `end-0` to position the toasts in the upper right corner -->
    <!-- - `.p-3` to prevent the toasts from sticking to the edge of the container  -->
    <div class="toast-container position-absolute top-0 end-0 p-3" id="toasts"></div>
</div>
<div class="wrapper-div">
    <div class="text-center h2-top-center-margin">
        <h2 class='text-primary'>Italszavazás</h2>
        <h6 id="drinks-subtitle" class='text-subtitle'></h6>
    </div>
    <div class="floating-div col-sm-8 col-lg-5" id="votes-div">
        <?php
            echo "<h5 class='text-center text-secondary' style='margin-bottom: 8%' id='drinks-no-data' hidden> "
                . "<i>Nincs megjelenítendő adat</i></h5>";
            include "include/vote_suggestion_control.html";
            echo "<table class='table table-hover' id='drinks-table'></table>";
        ?>
    </div>
    <?php include "include/footer.php"; ?>
</div>
</body>
</html>
