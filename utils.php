<?php

include_once "config.php";
use MyCLabs\Enum\Enum;

/**
 * Class LogType
 * Defines constants for use in logging
 */
final class LogType extends Enum {
    private const INFO = 0;
    private const ERROR = 1;
    private const PAGE_VISIT = 2;

    public static function INFO() : LogType {
        return new LogType(self::INFO);
    }

    public static function ERROR() : LogType {
        return new LogType(self::ERROR);
    }

    public static function PAGE_VISIT() : LogType {
        return new LogType(self::PAGE_VISIT);
    }
}

class Utils
{
    /**
     * Logs an event.
     * @param $eventType LogType The log entry's type (INFO or ERROR) - use LogType constants
     * @param $description string A short description of the event
     * @param int|null $userID int The user's id
     */
    public static function logEvent(LogType $eventType, string $description, int $userID = null) {
        $eventType = $eventType->getValue();
        $db = null;
        try {
            $db = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
            if ($db->connect_error) {
                echo "Connection failed: " . $db->connect_error;
            }
            $stmt = $db->prepare("INSERT INTO log (user_ID, description, event_type) VALUES (?, ?, ?)");
            if (!$stmt) {
                throw new Exception("Could not prepare SQL statement. Please try again.");
            }
            $stmt->bind_param('isi', $userID, $description, $eventType);
            $stmt->execute();
        } catch (Exception $e) {
            echo $e->getMessage();
        } finally {
            if ($db != null)
                $db->close();
        }
    }

    /**
     * @return mysqli A mysqli database object representing the database used throughout the project.
     */
    public static function getDbObject(): mysqli
    {
        return new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
    }

    /**
     * Checks whether a user has permission to access a given page.
     * @param string $requiredRole The name of the required role.
     * @return bool True, if the user has permission to access the page, false otherwise.
     */
    public static function requireRole(string $requiredRole): bool {
        $db = Utils::getDbObject();
        $roles = array();
        try {
            $result = $db->query("SELECT usergroup.name FROM users "
                . " LEFT OUTER JOIN user_usergroup ON user_usergroup.user_ID = users.user_ID "
                . " LEFT OUTER JOIN usergroup ON usergroup.usergroup_ID = user_usergroup.usergroup_ID "
                . " WHERE users.user_ID = " . $_SESSION['userId'] . " ORDER BY users.user_ID");
            while ($row = $result->fetch_row()) {
                array_push($roles, $row[0]);
            }
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), "Error in Utils::requireRole(): " . $exception->getMessage());
        } finally {
            $db->close();
        }
        // banned users are not allowed to access anything that's not public
        if (in_array("banned", $roles)) {
            return false;
        }
        // users with admin privileges have access to everything
        else if (in_array("admin", $roles)) {
            return true;
        }
        return in_array($requiredRole, $roles);
    }

    /**
     * Gets the drink's name based on the id.
     * @param int $drinkId The id of the drink we want to get the name of.
     * @return string The name of the drink with the given ID.
     */
    public static function getDrinkNameById(int $drinkId): string {
        $db = self::getDbObject();
        $name = null;
        try {
            $stmt = $db->prepare("SELECT name FROM drinks WHERE drink_ID = ?");
            $stmt->bind_param("i", $drinkId);
            if ($stmt->execute()) {
                $name = $stmt->get_result()->fetch_row()[0];
            }
        } catch (Exception $exception) {
            self::logEvent(LogType::ERROR(), "Cannot get drink name by id: " . $exception->getMessage());
        } finally {
            $db->close();
            return $name;
        }
    }
}