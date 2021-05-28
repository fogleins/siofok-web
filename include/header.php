<!DOCTYPE html>
<html lang="hu">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
</head>
<body>
<link rel="stylesheet" href="bootstrap.min.css">
<link rel="stylesheet" href="customStyles.css">
<script src="bootstrap.bundle.min.js"></script>
  <nav class="p-3 mb-3 border-bottom">
<!--  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-+0n0xVW2eSR5OomGNYDnhzAbDsOXxcvSN1TPprVMTNDbiYZCxYbOOl7+AMvyTG2x" crossorigin="anonymous">-->
<!--  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.0.1/dist/js/bootstrap.bundle.min.js" integrity="sha384-gtEjrD/SeCtmISkJkNUaaKMoLD0//ElJ19smozuHV6z3Iehds+3Ulb9Bn9Plx0x4" crossorigin="anonymous"></script>-->

    <ul class="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
        <li class="nav-item">
            <a class="nav-link px-2" href=".">Kezdőlap</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="#">Időpontválasztás</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="#">Étel- és italszavazás</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="playlist.php">Lejátszási lista</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="#">GYIK</a>
        </li>

        <div class="col-md-3 text-end">
            <?php
            // if the user is logged in, we display a button with the user's name and if they click the button,
            // we redirect them to their profile (profile.php)
            if (isset($_SESSION['access_token'])) {
                $nameBtn = "<button type='button' class='btn btn-outline-primary me-2' onclick='"
                    . 'window.location = "profile.php";' . "'>" . $_SESSION['givenName'] . "</button>";
                echo $nameBtn;
            }
            // if the user is logged in, we show a logout button, otherwise a login button is shown
            echo isset($_SESSION['access_token'])
                ? "<button type='button' class='btn btn-outline-danger me-2' onclick='"
                    . 'window.location = "logout.php";' . "'>Kijelentkezés</button>"
                : "<button type='button' class='btn btn-outline-primary me-2' onclick='"
                    . 'window.location = "login.php";' . "'>Bejelentkezés</button>";
            ?>
        </div>
    </ul>
  </nav>
</body>
</html>