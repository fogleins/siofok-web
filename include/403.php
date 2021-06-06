<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Forbidden</title>
</head>
<body>
<script>
    // TODO: may be done with proper web server configuration
    // redirect to the main page if someone tries to access the error page directly
    if (!document.referrer.includes("siofok2021")) {
        window.location = "..";
    }
</script>
<div class="wrapper-div">
<?php include "include/header.php" ?>
<h2 class="text-primary text-center h2-top-center-margin">403 Forbidden</h2>
  <div class="floating-div col-sm-4 col-lg-10 text-center" style="align-items: flex-start">
    <img id="dropsicle" src="include/dropsicle.svg" alt="error-icon">
    <h5>Nincs jogosultságod az oldal megtekintéséhez.</h5>
  </div>
</div>
<?php include "include/footer.php"; ?>
</body>
</html>