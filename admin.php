<?php
    session_start();
    include "utils.php";
    include "include/header.php";
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        $_SESSION["redirect"] = "admin.php";
        exit();
    } else {
        Utils::logEvent(LogType::PAGE_VISIT(), "admin.php", $_SESSION['userId']);
    }
    // allow only users with admin privileges
    if (!Utils::requireRole("admin")) {
        include "include/403.php";
        http_response_code(403);
        die();
    }
?>

<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Adminisztráció</title>
    <link rel="stylesheet" href="include/tagEditor/jquery-ui.min.css">
    <link rel="stylesheet" href="include/tagEditor/jquery.tag-editor.css">
</head>
<body>
<h2 class='text-primary text-center h2-top-center-margin'>Adminisztáció</h2>
<script src="include/tagEditor/jquery-ui.min.js"></script>
<script src="include/tagEditor/jquery.tag-editor.min.js"></script>
<script src="include/tagEditor/jquery.caret.min.js"></script>
<script src="scripts/js/toast.js"></script>
<script src="scripts/js/admin.js"></script>
<!-- toasts begin -->
<div aria-live="polite" aria-atomic="true" class="position-fixed" id="toasts-parent">
    <div class="toast-container position-absolute top-0 end-0 p-3" id="toasts"></div>
</div>
<!-- toasts end -->
<div class="wrapper-div">
    <div class="container floating-div col-sm-10 col-lg-7">
        <h3 class="text-secondary">Felhasználók kezelése</h3>
        <div id="unsaved-changes" hidden>
            <h5 class="text-warning">Nem mentett módosítások:</h5>
            <p id="unsaved-changes-details"></p>
        </div>
        <div class="scrollable-table-container" id="users-container">
            <table class="table table-striped table-hover" id="user-management"></table>
        </div>
        <h3 class="text-secondary mt-5">Rendszernapló</h3>
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

<div class="modal fade" id="userManagementModal" tabindex="-1" aria-labelledby="userManagementModalLabel" aria-hidden="true">
    <div class="modal-dialog">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="userManagementModalLabel">Jogosultságkezelés</h5>
                <button type="button" class="btn-close modal-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
                <form>
                    <div class="mb-3">
                        <label for="roles" class="col-form-label">Jogosultságok:</label>
                        <input type="text" class="form-control" id="roles">
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-outline-danger" id="dismiss-changes" data-bs-dismiss="modal">
                    Nem mentett módosítások elvetése</button>
                <button type="button" class="btn btn-outline-secondary modal-close" data-bs-dismiss="modal">Bezárás</button>
                <button type="button" class="btn btn-primary" id="modal-save" data-bs-dismiss="modal">Mentés</button>
            </div>
        </div>
    </div>
</div>
</body>
</html>
