<?php
    session_start();
    include "utils.php";
    if (isset($_SERVER['HTTP_X_REQUESTED_WITH']) && $_SERVER['HTTP_X_REQUESTED_WITH'] == 'XMLHttpRequest') {
        $db = Utils::getDbObject();
        try {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            $stmt = $db->prepare("INSERT INTO issues (reported_by, issue_page, issue_description) "
                . "VALUES (?, ?, ?)");
            $stmt->bind_param("iss", $_SESSION["userId"], $_POST["page"], $_POST["issue"]);
            echo json_encode(array("success" => $stmt->execute()));
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), $exception->getMessage());
        } finally {
            $db->close();
        }
    }
