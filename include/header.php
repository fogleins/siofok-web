<?php include "includes.html"; ?>
<header class="navbar sticky-top flex-column flex-md-row bd-navbar border-bottom">
<div class="navbar-nav-scroll">
    <ul class="navbar-nav bd-navbar-nav flex-row">
        <li class="nav-item">
            <a class="nav-link px-2" href=".">Kezdőlap</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="#">Időpontválasztás</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="drinks.php">Italszavazás</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="playlist.php">Lejátszási lista</a>
        </li>
        <li class="nav-item">
            <a class="nav-link px-2" href="faq.php">GYIK</a>
        </li>
    </ul>
</div>
<ul class="navbar-nav flex-row ml-md-auto d-none d-md-flex">
    <?php
    // if the user is logged in, we display a button with the user's name and if they click the button,
    // we redirect them to their profile (profile.php)
    if (isset($_SESSION['access_token'])) {
        $nameBtn = "<li><button type='button' class='btn btn-outline-primary me-2 nav-item' onclick='"
            . 'window.location = "profile.php";' . "' style='margin-right: 0.5rem'>" . $_SESSION['givenName']
            . "</button></li>";
        echo $nameBtn;
    }
    echo "<li>";
    // if the user is logged in, we show a logout button, otherwise a login button is shown
    echo isset($_SESSION['access_token'])
        ? "<button type='button' class='btn btn-outline-danger me-2 nav-item' onclick='"
            . 'window.location = "logout.php";' . "'>Kijelentkezés</button>"
        : "<button type='button' class='btn btn-outline-primary me-2 nav-item' onclick='"
            . 'window.location = "login.php";' . "'>Bejelentkezés</button>";
    echo "</li>";
    ?>
</ul>
</header>