<?php
    header('Content-Type: application/json');
    include_once "utils.php";

    abstract class VoteType {
        const drinkAdd = 0;
        const drinkRemove = 1;
        const drinkAddSuggestion = 2;
        const other = 3; // todo
    }

    $db = Utils::getDbObject();
    try {
        $stmt = null;
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        // TODO: azonos nevűből ne lehessen újat hozzáadni + trim
        if ($_POST['action'] == VoteType::drinkAddSuggestion) {
            // insert the suggested drink into the database
            $stmt = $db->prepare("INSERT INTO drinks (suggested_by, name) VALUES (?, ?)");
            $stmt->bind_param("is", $_POST['userId'], $_POST['drinkName']);
            if (!$stmt->execute()) {
                echo json_encode(array("success" => false));
                exit();
            }
            $stmt->store_result();
            $stmt->free_result();
            // get the id of the added item
            $stmt = $db->prepare("SELECT drink_ID FROM drinks WHERE added = (SELECT MAX(added) FROM drinks)");
            if ($stmt->execute()) {
                $drinkId = $stmt->get_result()->fetch_row()[0];
                $stmt->free_result();
                $stmt = $db->prepare("INSERT INTO drinks_votes VALUES (?, ?)");
                $stmt->bind_param("ii", $_POST['userId'], $drinkId);
                if ($stmt->execute()) {
                    $stmt->store_result();
                    $stmt->free_result();
                }
            }
        } else if ($_POST['action'] == VoteType::drinkAdd) {
            $stmt = $db->prepare("INSERT INTO drinks_votes VALUES (?, ?)");
            $stmt->bind_param("ii", $_POST['userId'], $_POST['drinkId']);
            if (!$stmt->execute()) {
                echo json_encode(array("success" => false));
                exit();
            }
        } else if ($_POST['action'] == VoteType::drinkRemove) {
            $stmt = $db->prepare("DELETE FROM drinks_votes WHERE user_ID = ? AND drink_ID = ?");
            $stmt->bind_param("ii", $_POST['userId'], $_POST['drinkId']);
            if (!$stmt->execute()) {
                echo json_encode(array("success" => false));
                exit();
            }
        }
        echo json_encode(array("success" => true));
    } catch (Exception $exception) {
        Utils::logEvent(LogType::ERROR(), "Error in vote_handler.php: " . $exception->getMessage());
    } finally {
        $db->close();
    }