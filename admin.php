<?php
    session_start();
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        exit();
    }
    // TODO only allow users with admin privileges
?>

<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Adminisztráció</title>
    <script src="scripts/js/admin.js"></script>
</head>
<body onload="Admin.loadUserManagement()">
<?php
    include "utils.php";
    include "include/header.php";
    echo "<h2 class='text-primary text-center h2-top-center-margin'>Adminisztáció</h2>";
?>
<div class="wrapper-div">
    <div class="floating-div col-sm-2 col-lg-10">
        <h3 class="text-secondary">Felhasználók kezelése</h3>
        <div class="scrollable-table-container" id="users-container">
            <table class="table table-striped table-hover" id="user-management"></table>
        </div>
        <h3 class="text-secondary">Rendszernapló</h3>
        <div id="logs-container" class="scrollable-table-container">
            <table class="table table-striped table-hover" id="logs">
                <thead><tr><th>ID</th><th style="width: 18%">Timestamp</th><th>Type</th><th>Description</th></tr></thead>
                <?php
                    $db = Utils::getDbObject();
                    try {
                        $logEntries = $db->query("SELECT log_ID, timestamp , event_type, description FROM log "
                            . "WHERE user_ID IS NULL ORDER BY timestamp DESC;");
                        while ($row = $logEntries->fetch_row()) {
                            echo "<tr class='log'><td>" . $row[0] . "</td><td>" . $row[1] . "</td><td>" . $row[2]
                                . "</td><td>" . $row[3] . "</td></tr>";
                        }
                    } catch (Exception $exception) {
                        Utils::logEvent(LogType::ERROR(), "admin.php error: " . $exception->getMessage());
                    } finally {
                        $db->close();
                    }
                ?>
            </table>
        </div>
    </div>
    <?php include "include/footer.php"; ?>
</div>
</body>
</html>
