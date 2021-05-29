<link rel="stylesheet" href="customStyles.css">
<div class="footer">
    <div class="footer-div">
        <?php
            session_start();
            echo isset($_SESSION['access_token']) ? "<a href='profile.php' class='footer-link'>Profil</a>"
                : "<a href='login.php' class='footer-link'>Bejelentkezés</a>";
        ?>
    </div>
    <div class="footer-div">
        <a href="https://github.com/fogleins/siofok2021-web" class="footer-link">GitHub</a>
    </div>
</div>