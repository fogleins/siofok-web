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
    try {
        if ($_SERVER['REQUEST_METHOD'] === 'GET') {
            $result = $db->query("SELECT message_ID AS id, message AS content, created, "
                . "full_name AS authorName, picture_link AS authorPictureLink FROM noticeboard "
                . "INNER JOIN users ON users.user_ID = noticeboard.author");
            echo json_encode(array("success" => $result != false, "messages" => $result->fetch_all(MYSQLI_ASSOC)));
        } else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $_POST["message"] = trim($_POST["message"]);
            if (strlen($_POST["message"]) > 1500 || strlen($_POST["message"]) == 0) {
                echo json_encode(array("success" => false, "message" => "A megadott üzenet túl hosszú."));
                exit();
            }
            $stmt = $db->prepare("INSERT INTO noticeboard (author, message) VALUES (?, ?)");
            $stmt->bind_param("is", $_SESSION["userId"], $_POST["message"]);
            echo json_encode(array("success" => $stmt->execute()));
        }
    } catch (Exception $exception) {
        Utils::logEvent(LogType::ERROR(), "Error in noticeboard xhr handler: " . $exception->getMessage());
    } finally {
        $db->close();
    }