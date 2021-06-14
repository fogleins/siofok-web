<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>GYIK</title>
</head>
<body>
<?php
    include_once "utils.php";
    include "include/header.php";
    session_start();
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        $_SESSION['redirect'] = "faq.php";
        exit();
    } else {
        Utils::logEvent(LogType::PAGE_VISIT(), "faq.php", $_SESSION['userId']);
    }
?>
<div class="wrapper-div">
<h2 class="text-primary text-center h2-top-center-margin">Gyakran ismételt kérdések</h2>
<div class="container playlist-div col-sm-10 col-lg-6">
    <div class="floating-div playlist-div">
    <?php
        $db = Utils::getDbObject();
        try {
            $qa = $db->query("SELECT faq_questions.question_ID, faq_questions.text, faq_answers.text "
                . "FROM faq_questions INNER JOIN faq_answers USING (question_ID);");
            $questionId = 0;
            $shouldCloseList = false;
            while ($row = $qa->fetch_row()) {
                if ($questionId != $row[0]) {
                    if ($shouldCloseList) {
                        echo "</ul>";
                    }
                    echo "<h4 class='text-primary'>" . $row[1] . "<h4>";
                    echo "<ul>";
                    $questionId = $row[0];
                    $shouldCloseList = true;
                }
                echo "<li class='list-item'>" . $row[2] . "</li>";
            }
            echo "</ul>";
        } catch (Exception $exception) {
            Utils::logEvent(LogType::ERROR(), $exception->getMessage());
        } finally {
            $db->close();
        }
    ?>
    </div>
</div>
<?php include "include/footer.php"; ?>
</div>
</body>
</html>
