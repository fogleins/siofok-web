<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Lejátszási lista</title>
</head>
<body>
<link rel="stylesheet" href="customStyles.css">
<?php
    include_once "utils.php";
    include "include/header.php";
    session_start();
    if (!isset($_SESSION['access_token'])) {
        echo "<h2 class='text-warning text-center' style='margin-top: 15%'>A folytatáshoz be kell jelentkezned.</h2>";
        $_SESSION['redirect'] = "playlist.php";
        exit();
    } else {
        Utils::logEvent(LogType::PAGE_VISIT(), "playlist.php", $_SESSION['userId']);
    }
    // allow only verified users
    if (!Utils::requireRole("verified")) {
        include "include/403.php";
        http_response_code(403);
        die();
    }
?>

<div class="wrapper-div">
<h2 class="text-primary text-center h2-top-center-margin">Idei kooperatív lista</h2>
<div class="container playlist-div">
    <div class="floating-div playlist-div">
        <h4 class="text-primary">Zene hozzáadása:</h4>
        <ol>
            <li class="list-item">Kattints a linkre!</li>
            <li class="list-item">Megjelenik a lista oldala. Kattints a követésre (szív ikon).</li>
            <li class="list-item">A lista bekerül a sajátjaid közé, így már hozzá tudsz adni számokat.</li>
        </ol>
        <?php
        $db = Utils::getDbObject();
        try {
            $link = $db->query("SELECT link FROM playlist WHERE playlist_ID = 1");
            if ($link->num_rows > 0) {
                echo "<a href='" . $link->fetch_row()[0] . "' role='button' id='playlist-btn'"
                    . " class='btn btn-primary btn-lg' target='_blank' onclick='logOuterLinkVisit(`Spotify`)'>"
                    . "Tovább a listához</a>";
            } else {
                Utils::logEvent(LogType::ERROR(), "Cannot read playlist link");
            }
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), $exception->getMessage());
        } finally {
            $db->close();
        }
        ?>
    </div>
</div>
</div>
<?php include "include/footer.php"; ?>
</body>
</html>
