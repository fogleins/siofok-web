<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Italok</title>
</head>
<script src="jquery-3.6.0.min.js"></script>
<script src="scripts/js/scripts.js"></script> <!-- Used as button callback -->
<script src="scripts/js/drinksVoteUpdater.js"></script>

<?php
    include "include/includes.html";
    include_once "utils.php";
    session_start();
    include "include/header.php";
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        $_SESSION['redirect'] = "drinks.php";
        echo "<body>";
        exit();
    }
    echo "<body onload='DrinksVoteUpdater.instance.userId = " . $_SESSION['userId'] . ";'>";
?>
<script type="text/javascript">
    function addButtonClicked(drinkId) {
        submitVote(<?php echo $_SESSION['userId']; ?>, drinkId, VoteType.drinkAdd);
        DrinksVoteUpdater.instance.update();
    }

    function removeButtonClicked(drinkId) {
        submitVote(<?php echo $_SESSION['userId']; ?>, drinkId, VoteType.drinkRemove);
        DrinksVoteUpdater.instance.update();
    }
</script>
<h2 class='text-primary text-center h2-top-center-margin'>Italszavazás</h2>
<div class="floating-div" id="votes-div">
    <?php
        $db = Utils::getDbObject();
        try {
            // TODO: remove duplicate (see vote_updater.php)
            // FIXME: if a drink has 0 votes, show 0 instead of 1
            $result = $db->query("SELECT drinks.name, drinks.drink_ID, COUNT(*) AS votes FROM drinks "
                . "LEFT OUTER JOIN drinks_votes ON drinks_votes.drink_ID = drinks.drink_ID "
                . "GROUP BY drinks.drink_ID ORDER BY votes DESC;");
            if ($result->num_rows < 1) {
                echo "<h5 class='text-secondary'><i>Nincs megjelenítendő adat</i></h5>";
                exit();
            }
            echo "<table class='drinks-table' id='drinks-table'>";
            while ($row = $result->fetch_row()) {
                echo "<tr><td class='text-primary drinks-td'>" . $row[0] . "</td>";
                $drinkId = $row[0];
                $shouldCloseList = true;
                echo "<td class='text-primary drinks-td'>" . $row[2] . "</td>";
//                $paramJson = json_encode(array('userId' => $_SESSION['userId'], 'drinkId' => intval($row[1]));
                echo "<td class='drinks-td'><button class='btn btn-sm btn-outline-success drinks-vote-btn' "
                    . " id='drinks-plus-btn-" . $row[1] . "' type='button' disabled "
                    . "onclick='addButtonClicked(" . $row[1] . ")'>+</button></td> ";
                echo "<td class='drinks-td'><button class='btn btn-sm btn-outline-danger drinks-vote-btn' "
                    . " id='drinks-minus-btn-" . $row[1] . "' type='button' onclick='removeButtonClicked($row[1])' "
                    . "disabled>-</button></td>";
            // TODO
//                echo "<td class='drinks-td'><button class='btn btn-sm btn-outline-danger drinks-vote-btn' type='button' onclick='' disabled "
//                    . ">Törlés</button></td></td>";
            }
            echo "</table>";
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), $exception->getMessage());
        } finally {
            $db->close();
        }
    ?>
</div>
</body>
</html>

