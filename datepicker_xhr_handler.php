<?php
    include "utils.php";
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
