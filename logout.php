<?php
    require_once "config.php";
    require_once "utils.php";

    // userID is needed to access the user's id after removing it from the session, so we can log the logout
    $userID = $_SESSION['userId'];
    unset($_SESSION['access_token']);
    $gClient->revokeToken();
//    session_destroy(); //  TODO: is this needed?

    Utils::logEvent(LogType::INFO(), "Logout", $userID);
    header("Location: ."); // redirect to the main page
