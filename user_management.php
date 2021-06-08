<?php
    include "utils.php";

    $db = Utils::getDbObject();
    try {
        $action = $_GET["action"];
        if ($action == 0) {
            $results = array();
            if (!$db) {
                Utils::logEvent(LogType::ERROR(), "Cannot get db object in user_management.php");
            }
            mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
            // query all drinks ordered by vote count
            $result = $db->query("SELECT users.user_ID, users.full_name, usergroup.name FROM users "
                . "LEFT OUTER JOIN user_usergroup ON user_usergroup.user_ID = users.user_ID "
                . "LEFT OUTER JOIN usergroup ON usergroup.usergroup_ID = user_usergroup.usergroup_ID "
                . "ORDER BY users.user_ID");
            $currentUserId = null;
            $currentUserData = null;
            $currentUserRoles = null; // the groups the user belongs to
            $jsonLength = 0;
            while ($row = $result->fetch_row()) {
                if ($row[0] != $currentUserId) {
                    if ($currentUserData != null) {
                        $currentUserData["roles"] = $currentUserRoles;
                        array_push($results, $currentUserData);
                    }
                    $currentUserId = $row[0];
                    $currentUserData = array();
                    $currentUserRoles = array();
                    $currentUserData["id"] = $row[0];
                    $currentUserData["name"] = $row[1];
                    $jsonLength++;
                }
                array_push($currentUserRoles, $row[2]);
            }
            array_push($results, $currentUserData);
            $results["length"] = $jsonLength;
            $availableRoles = array();
            $result = $db->query("SELECT name, usergroup_ID FROM usergroup");
            while ($row = $result->fetch_row()) {
//                $availableRoles[$row[0]] = $row[1];
                array_push($availableRoles, array("label" => $row[0], "value" => $row[1]));
            }
            $results["availableRoles"] = $availableRoles;
            $results["success"] = true;
            echo json_encode($results);
        } else if ($action == 1) {
            $arr = json_decode($_GET["changes"], true);
            // TODO
            foreach ($arr as &$element) {
                if ($element["action"] == 2) {
//                    $success = $db->query("INSERT INTO user_usergroup VALUES ");
                    echo json_encode(array("success" => true));
                } else if ($element["action"] == 3) {
                    echo json_encode(array("success" => true));
                }
            }
        }
    } catch (Exception $exception) {
        Utils::logEvent(LogType::ERROR(), "Error in user_management.php: " . $exception->getMessage());
    } finally {
        $db->close();
    }
