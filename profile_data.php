<?php
    include "utils.php";
    session_start();

    $db = Utils::getDbObject();
    try {
        $results = array();
        if (!$db) {
            Utils::logEvent(LogType::ERROR(), "Cannot get db object in profile_data.php");
        }
        mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
        // get the user's group memberships
        $stmt = $db->prepare("SELECT name FROM usergroup "
            . "INNER JOIN user_usergroup ON usergroup.usergroup_ID = user_usergroup.usergroup_ID "
            . "INNER JOIN users ON users.user_ID = user_usergroup.user_ID WHERE users.user_ID = ?");
        $stmt->bind_param("i", $_SESSION['userId']);
        $groups = array();
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            while ($group = $result->fetch_row()) {
                array_push($groups, $group);
            }
            $stmt->free_result();
        }
        $results['groups'] = $groups;
        // get the user's first login
        $stmt = $db->prepare("SELECT MIN(timestamp) FROM users INNER JOIN log ON users.user_ID = log.user_ID "
            . "WHERE log.user_ID = ? GROUP BY log.user_ID");
        $stmt->bind_param("i", $_SESSION['userId']);
        if ($stmt->execute()) {
            $stmt->bind_result($firstLogin);
            $stmt->fetch();
            $results['firstLogin'] = $firstLogin;
            $stmt->free_result();
        }
        // get the user's last login
        $stmt = $db->prepare("SELECT MAX(timestamp) FROM users INNER JOIN log ON users.user_ID = log.user_ID "
            . "WHERE log.user_ID = ? GROUP BY log.user_ID");
        $stmt->bind_param("i", $_SESSION['userId']);
        if ($stmt->execute()) {
            $stmt->bind_result($lastLogin);
            $stmt->fetch();
            $results['lastLogin'] = $lastLogin;
            $stmt->free_result();
        }
        // get the user's activities
        $activities = array();
        $stmt = $db->prepare("SELECT timestamp, description FROM log WHERE log.user_ID = ? ORDER BY timestamp DESC");
        $stmt->bind_param("i", $_SESSION['userId']);
        if ($stmt->execute()) {
            $result = $stmt->get_result();
            while ($activity = $result->fetch_row()) {
                array_push($activities, $activity);
            }
            $stmt->free_result();
        }
        $results['activities'] = $activities;
        $results["success"] = true;
        echo json_encode($results);
    } catch (Exception $exception) {
        Utils::logEvent(LogType::ERROR(), "Error in profile_data.php: " . $exception->getMessage());
    } finally {
        $db->close();
    }
