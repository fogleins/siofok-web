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
    if (!document.referrer.includes("siofok")) {
        window.location = "..";
    }
</script>
<div class="wrapper-div">
<h2 class="text-primary text-center h2-top-center-margin">403 Forbidden</h2>
  <div class="floating-div col-sm-8 col-lg-10 text-center" style="align-items: flex-start">
    <img id="dropsicle" src="include/dropsicle.svg" alt="error-icon">
    <h5>Nincs jogosultságod az oldal megtekintéséhez.</h5>
    <div class="container col-sm-10 col-lg-6 mt-5">
    <p>
        Megjegyzés: az "Időpontválasztás", "Italszavazás" és "Lejátszási lista" oldalak eléréséhez "verified"
        jogosultsággal kell rendelkezned. Ezt néhány percen, de legfeljebb órán belül meg kell kapnod.
        A jogosultságaidat a <a href="profile.php">profilodon</a> ellenőrizheted.
    </p>
    </div>
  </div>
</div>
<?php include "include/footer.php"; ?>
</body>
</html>