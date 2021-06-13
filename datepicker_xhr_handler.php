<?php
    include "utils.php";

    // if the logged in user's id and the one sent in the request do not match, the vote is invalid, therefore
    // we're not updating the database
    if ($_POST["userId"] != $_SESSION["userId"]) {
        echo json_encode(array("success" => false));
        exit();
    }

    $db = Utils::getDbObject();
    try {
        $stmt = $db->prepare("INSERT INTO datepicker_responses (user_ID, start_date, end_date, availability) "
            . "VALUES (?, ?, ?, ?)");
        $stmt->bind_param("issi", $_SESSION["userId"], $_POST["start"], $_POST["end"],
            $_POST["availability"]);
        echo json_encode(array("success" => $stmt->execute()));
    } catch (Exception $exception) {
        Utils::logEvent(LogType::ERROR(), "Datepicker handler error: " . $exception->getMessage());
    } finally {
        $db->close();
    }
