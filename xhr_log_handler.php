<?php
    include "utils.php";
    $logType = null;
    switch ($_POST['logType']) {
        case 0:
            $logType = LogType::INFO();
            break;
        case 1:
            $logType = LogType::ERROR();
            break;
        case 2:
            $logType = LogType::PAGE_VISIT();
            break;
        case 3:
            $logType = LogType::OUTER_PAGE_VISIT();
            break;
    }
    Utils::logEvent($logType, $_POST['message'], $_SESSION['userId'] ?? null);
