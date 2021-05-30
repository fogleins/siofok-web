<?php
    header('Content-Type: application/json');
    include_once "utils.php";

    abstract class VoteType {
        const drinkAdd = 0;
        const drinkRemove = 1;
        const other = 2; // todo
    }

    if ($_GET['action'] == VoteType::drinkAdd || $_GET['action'] == VoteType::drinkRemove) {
        $db = Utils::getDbObject();
        try {
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            if ($_GET['action'] == VoteType::drinkAdd) {
                $stmt = $db->prepare("INSERT INTO drinks_votes VALUES (?, ?)");
            } else {
                $stmt = $db->prepare("DELETE FROM drinks_votes WHERE user_ID = ? AND drink_ID = ?");
            }
            if (!$stmt) {
                throw new Exception("Cannot prepare sql query");
            }
            $stmt->bind_param("ii", $_GET['userId'], $_GET['drinkId']);
            if ($stmt->execute()) {
                echo json_encode(array("success" => true));
                return;
            }
            echo json_encode(array("success" => false));
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), "Error in vote_handler.php: " . $exception->getMessage());
        } finally {
            $db->close();
        }
    }