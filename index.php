<?php
    // get access to the $_SESSION variable
    session_start();
?>

<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Kezdőlap</title>
</head>
<body>
<div class="wrapper-div">
    <?php include "include/header.php"; ?>
    <div class="container" style="margin-top: 100px">
        <h3>Hello world</h3>
    </div>
    <?php include "include/footer.php"; ?>
</div>
</body>
</html>