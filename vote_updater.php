<?php
    include "utils.php";

    $db = Utils::getDbObject();
    try {
        $results = array();
        if (!$db) {
            Utils::logEvent(LogType::ERROR(), "Cannot get db object in vote_updater.php");
        }
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        // query all drinks ordered by vote count
        $result = $db->query("SELECT drinks.drink_ID, drinks.name, COUNT(*) AS votes FROM drinks "
            . "LEFT OUTER JOIN drinks_votes ON drinks_votes.drink_ID = drinks.drink_ID "
            . "GROUP BY drinks.drink_ID ORDER BY votes DESC;");
        while ($row = $result->fetch_row()) {
            // query user's votes
            $stmt = $db->prepare("SELECT drink_ID FROM drinks_votes WHERE user_ID = ? AND drink_ID = ?");
            if (!$stmt) {
                throw new Exception("Cannot prepare sql query");
            }
            $stmt->bind_param("ii", $_GET['userId'], $row[0]);
            $stmt->execute(); // TODO: if ()-be tenni?
            $usersVotes = $stmt->get_result();
            $userAlreadyVoted = $usersVotes->num_rows != 0;
            array_push($results, array($row[0], $row[1], $row[2], !$userAlreadyVoted, $userAlreadyVoted));
        }
        echo json_encode($results); // TODO: error esetén is jó?
    } catch (Exception $exception) {
        Utils::logEvent(LogType::ERROR(), "Error in vote_updater.php: " . $exception->getMessage());
    } finally {
        $db->close();
    }
