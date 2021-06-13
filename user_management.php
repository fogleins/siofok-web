<?php
    include "utils.php";

    if (Utils::requireRole("admin")) {
        $db = Utils::getDbObject();
        try {
            if ($_SERVER['REQUEST_METHOD'] === 'GET') {
                $results = array();
                $users = array();
                if (!$db) {
                    Utils::logEvent(LogType::ERROR(), "Cannot get db object in user_management.php");
                }
                mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
                // query users' data
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
                            array_push($users, $currentUserData);
                        }
                        $currentUserId = $row[0];
                        $currentUserData = array();
                        $currentUserRoles = array();
                        $currentUserData["id"] = intval($row[0]);
                        $currentUserData["name"] = $row[1];
                        $jsonLength++;
                    }
                    array_push($currentUserRoles, $row[2]);
                }
                if (!isset($currentUserData["roles"])) {
                    $currentUserData["roles"] = $currentUserRoles;
                }
                array_push($users, $currentUserData);
                $results["users"] = $users;
                $results["length"] = $jsonLength;
                $availableRoles = array();
                $result = $db->query("SELECT name, usergroup_ID FROM usergroup");
                while ($row = $result->fetch_row()) {
                    array_push($availableRoles, array("name" => $row[0], "id" => intval($row[1])));
                }
                $results["availableRoles"] = $availableRoles;
                $results["success"] = true;
                echo json_encode($results);
            } else if ($_POST["action"] == 1) {
                $successCount = 0;
                foreach ($_POST["changes"] as &$element) {
                    $success = false;
                    if ($element["action"] == 2) {
                        $success = $db->query("INSERT INTO user_usergroup VALUES (" . $element["userId"]
                            . ", " . $element["roleId"] . ")");
                    } else if ($element["action"] == 3) {
                        $success = $db->query("DELETE FROM user_usergroup WHERE user_ID = " . $element["userId"]
                            . " AND usergroup_ID = " . $element["roleId"]);
                    }
                    if ($success) {
                        $successCount++;
                    } else {
                        Utils::logEvent(LogType::ERROR(), "Cannot modify roles for values { action: 
                        {$element['action']}, userId: {$element['userId']}, roleId: {$element['roleId']}");
                    }
                }
                echo json_encode(array("success" => $successCount == sizeof($_POST["changes"])));
            }
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), "Error in user_management.php: " . $exception->getMessage());
        } finally {
            $db->close();
        }
    } else {
        echo json_encode(array("success" => false));
    }
