<?php include "includes.html"; ?>
<nav class="navbar navbar-expand-lg navbar-light bg-light sticky-top">
    <div class="container-fluid">
        <a class="navbar-brand text-secondary" href=".">Siófok 2021</a>
        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>
        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                <li class="nav-item">
                    <a class="nav-link" href=".">Kezdőlap</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Időpontválasztás</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="drinks.php">Italszavazás</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="playlist.php">Lejátszási lista</a>
                </li>
                <!-- Code snippets for dropdown menu are intentionally left here -->
                <li class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button"
                       data-bs-toggle="dropdown" aria-expanded="false">
                        Egyebek
                    </a>
                    <ul class="dropdown-menu" aria-labelledby="navbarDropdown">
                        <li><a class="dropdown-item" href="profile.php">Profil</a></li>
                        <li><a class="dropdown-item" href="#">Résztvevők</a></li>
                        <li><a class="dropdown-item" href="faq.php">GYIK</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="admin.php">Admin</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="https://github.com/fogleins/siofok2021-web" target="_blank"
                               onclick="logOuterLinkVisit('GitHub')">GitHub</a></li>
                    </ul>
                </li>
            </ul>
            <div class="d-flex">
            <?php
                // if the user is logged in, we display a button with the user's name and if they click the button,
                // we redirect them to their profile (profile.php)
                if (isset($_SESSION['access_token'])) {
                    $nameBtn = "<button type='button' class='btn btn-outline-primary me-2' onclick='"
                        . "window.location = `profile.php`;" . "'>" . $_SESSION['givenName'] . "</button>";
                    echo $nameBtn;
                }
                // if the user is logged in, we show a logout button, otherwise a login button is shown
                echo isset($_SESSION['access_token'])
                    ? "<button type='button' class='btn btn-outline-danger me-2' onclick='"
                        . 'window.location = "logout.php";' . "'>Kijelentkezés</button>"
                    : "<button type='button' class='btn btn-outline-success me-2' onclick='"
                        . 'window.location = "login.php";' . "'>Bejelentkezés</button>";
                ?>
            </div>
        </div>
    </div>
</nav>