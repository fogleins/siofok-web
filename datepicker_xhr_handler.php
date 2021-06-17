<?php
    include "utils.php";

    // if the logged in user's id and the one sent in the request do not match, the vote is invalid, therefore
    // we're not updating the database
    if (($_SERVER['REQUEST_METHOD'] === 'POST' && $_POST["userId"] != $_SESSION["userId"])
        || ($_SERVER['REQUEST_METHOD'] === 'GET' && $_GET["userId"] != $_SESSION["userId"])) {
        echo json_encode(array("success" => false));
        exit();
    }

    $db = Utils::getDbObject();
    $array = array();
    try {
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        $stmt = null;
        // if a new record will be saved
        if (isset($_POST["recordId"]) && $_POST["recordId"] == null) {
            // make sure that the user cannot add the same range multiple times
            if (!inputIsValidDateRange($db)) {
                exit();
            }

            // add a new record
            $stmt = $db->prepare("INSERT INTO datepicker_responses (user_ID, start_date, end_date, availability) "
                . "VALUES (?, ?, ?, ?)");
            $stmt->bind_param("issi", $_SESSION["userId"], $_POST["start"], $_POST["end"],
                $_POST["availability"]);
            if (!$stmt->execute()) {
                echo json_encode(array("success" => false, "message" => "Hiba a mentés során."));
                exit();
            }
            $stmt->get_result();
            $stmt->free_result();

            // get the added record's ID
            $stmt = $db->prepare("SELECT response_ID FROM datepicker_responses WHERE user_ID = ? "
                . "AND start_date = ? AND end_date = ?");
            $stmt->bind_param("iss", $_SESSION["userId"], $_POST["start"], $_POST["end"]);
            $recordId = null;
            if ($success = $stmt->execute()) {
                $result = $stmt->get_result();
                $recordId = $result->fetch_row()[0];
                Utils::logEvent(LogType::INFO(), "Időpontválasztás hozzáadva. Időszak: "
                    . $_POST["start"] . " - " . $_POST["end"], $_SESSION["userId"]);
            }
            echo json_encode(array("success" => $success, "recordId" => $recordId, "data" => getAllRecords($db)));
        } else if (isset($_POST["action"]) && $_POST["action"] == "delete") {
            $stmt = $db->prepare("SELECT start_date, end_date FROM datepicker_responses WHERE response_ID = ?");
            $stmt->bind_param("i", $_POST["recordId"]);
            $stmt->execute();
            $result = $stmt->get_result()->fetch_row();
            $stmt->free_result();
            $stmt = $db->prepare("DELETE FROM datepicker_responses WHERE response_ID = ?");
            $stmt->bind_param("i", $_POST["recordId"]);
            $success = $stmt->execute();
            echo json_encode(array("success" => $success));
            if ($success) {
                Utils::logEvent(LogType::INFO(), "Időpontválasztás törölve. Törölt időszak: "
                    . $result[0] . " - " . $result[1], $_SESSION["userId"]);
            }
        } else if (isset($_GET["action"]) && $_GET["action"] == "query") {
            $result = getAllRecords($db);
            echo json_encode(array("success" => $result != false, "data" => $result));
        } else /* if editing the range */ {
            if (inputIsValidDateRange($db, $_POST["recordId"])) {
                $stmt = $db->prepare("UPDATE datepicker_responses SET start_date = ?, end_date = ?, "
                    . "availability = ? WHERE response_ID = ?");
                $stmt->bind_param("ssii", $_POST["start"], $_POST["end"], $_POST["availability"],
                    $_POST["recordId"]);
                $success = $stmt->execute();
                echo json_encode(array("success" => $success, "data" => getAllRecords($db)));
                if ($success) {
                    Utils::logEvent(LogType::INFO(), "Időpontválasztás módosítva. Új érték: "
                        . $_POST["start"] . " - " . $_POST["end"], $_SESSION["userId"]);
                }
            }
        }
    } catch (Exception $exception) {
        Utils::logEvent(LogType::ERROR(), "Datepicker handler error: " . $exception->getMessage());
    } finally {
        $db->close();
    }

    /**
     * Checks whether the input value overlaps with a previously submitted date range.
     * @param $db: The database object.
     * @return bool False if dates overlap, true otherwise.
     */
    function inputIsValidDateRange(mysqli $db, $recordId = null): bool {
        if ($recordId != null) {
            $stmt = $db->prepare("SELECT response_ID FROM datepicker_responses WHERE user_ID = ? AND response_ID != ? "
                . "AND (start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ? "
                . "OR ? BETWEEN start_date AND end_date OR ? BETWEEN start_date AND end_date)");
            $stmt->bind_param("iissssss", $_SESSION["userId"], $recordId, $_POST["start"], $_POST["end"],
                $_POST["start"], $_POST["end"], $_POST["start"], $_POST["end"]);
        } else {
            $stmt = $db->prepare("SELECT response_ID FROM datepicker_responses WHERE user_ID = ? "
                . "AND (start_date BETWEEN ? AND ? OR end_date BETWEEN ? AND ? "
                . "OR ? BETWEEN start_date AND end_date OR ? BETWEEN start_date AND end_date)");
            $stmt->bind_param("issssss", $_SESSION["userId"], $_POST["start"], $_POST["end"],
                $_POST["start"], $_POST["end"], $_POST["start"], $_POST["end"]);
        }
        if ($stmt->execute()) {
            if ($stmt->get_result()->num_rows > 0) {
                echo json_encode(array("success" => false, "message" => "A megadott időszak átfedésben van egy "
                    . "korábban megadottal, így nem kerül mentésre."));
                return false;
            }
            $stmt->free_result();
            return true;
        } else {
            echo json_encode(array("success" => false));
            return false;
        }
    }

    /**
     * Returns all date ranges entered by the user.
     * @param mysqli $db The db object.
     * @return mixed An array of the submitted date ranges.
     */
    function getAllRecords(mysqli $db) {
        $result = $db->query("SELECT response_ID, start_date, end_date, availability FROM datepicker_responses "
            . "WHERE user_ID = " . $_SESSION['userId'] . " ORDER BY start_date");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
