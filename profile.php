<?php
    session_start();
    // if the user is not logged in, we redirect them to the login page
    if (!isset($_SESSION['access_token'])) {
        header("Location: login.php");
        exit();
    }
?>

<!doctype html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title><?php echo $_SESSION['fullName'] . " profilja" ?></title>
</head>
<body onload="loadProfileData()">
<?php
    include "include/header.php";
    echo "<h2 class='text-primary text-center h2-top-center-margin'>Hello " . $_SESSION['givenName'] . "!</h2>";
?>
<div class="wrapper-div">
    <div class="floating-div col-sm-2 col-lg-6">
        <h3 class="text-secondary">Adatok</h3>
        <table id="profile-data" class="table table-striped table-hover"></table>
        <h3 class="text-secondary">Tevékenységek</h3>
        <table id="profile-activities"></table>
    </div>
    <?php include "include/footer.php"; ?>
</div>
</body>
</html>
