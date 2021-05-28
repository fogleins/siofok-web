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

    public static function INFO() : LogType {
        return new LogType(self::INFO);
    }

    public static function ERROR() : LogType {
        return new LogType(self::ERROR);
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
            $result = $stmt->get_result();
        } catch (Exception $e) {
            echo $e->getMessage();
        } finally {
            if ($db != null)
                $db->close();
        }
    }
}