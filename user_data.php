<?php
    session_start();
    // disable direct access, allow only xhr requests
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
        // Code that will run if this file called via AJAX request
        echo json_encode(array("success" => true, "userId" => $_SESSION["userId"]));
    } else {
        echo json_encode(array("success" => false));
    }
