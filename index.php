<?php
    // get access to the $_SESSION variable
    session_start();
?>

<?php include "include/header.php"; ?>
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
    <h2 class="text-center text-primary h2-top-center-margin">Hello!</h2>
    <div class="container floating-div col-md-10 col-lg-6">
        <h4 class="text-secondary">Tudnivalók az oldal használatáról</h4>
        <ul>
            <li>Az aloldalak eléréséhez bejelentkezés szükséges, bejelentkezni Google-fiókkal lehet</li>
            <li>Az oldal a Googletől csak a profil alapadatait veszi át (pl. név, e-mail)</li>
            <li>Mivel az oldalra mindenki, aki rendelkezik Google-fiókkal be tud jelentkezni, ezért biztonsági okokból
                egyes aloldalak további jogosultságokat követelhetnek meg
                <ul>
                    <li>Ilyenek például a szavazós oldalak</li>
                    <li>Az ezek eléréséhez szükséges jogosultságokat mindenki egyénileg kaphatja meg rövid időn belül</li>
                    <li>A jogosultságaidat a <a href="profile.php">profilodon</a> ellenőrizheted</li>
                </ul>
            </li>
            <li>Bizonyos oldalak csak az időpont véglegesítését követően válnak elérhetővé (pl. Résztvevők)</li>
            <li class="mt-4">Az oldal megfelelő működését többször is teszteltük, de egy ilyen nagyméretű projektben
                még így is előfordulhatnak hibák. Amennyiben ilyet tapasztalsz, a
                <a href="issue_report.php">Hibabejelentés</a> oldalon jelezheted</li>
        </ul>
    </div>
    <?php include "include/footer.php"; ?>
</div>
</body>
</html>