<?php
    header('Content-Type: application/json');
    include_once "utils.php";

    abstract class VoteType {
        const drinks = 0;
        const other = 1; // todo
    }

    if ($_GET['voteType'] == VoteType::drinks) {
        $db = Utils::getDbObject();
        try {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            $stmt = $db->prepare("INSERT INTO drinks_votes VALUES (?, ?)");
            if (!$stmt) {
                throw new Exception("Cannot prepare sql query");
            }
            $stmt->bind_param("ii", $_GET['userId'], $_GET['drinkId']);
            if ($stmt->execute()) {
                echo json_encode(array("status" => true, "added" => true));
                return;
            }
            echo json_encode(array("status" => false, "added" => false));
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), "Error in vote_handler.php: " . $exception->getMessage());
        } finally {
            $db->close();
        }
    }