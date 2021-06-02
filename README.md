### Dependencies

<ul>
    <li>PHP</li>
    <li>Composer</li>
    <ul>
    <li>PHP Google API</li>
    <li><a href="https://github.com/myclabs/php-enum">PHP enum</a></li>
    </ul>
    <li>MariaDB or MySQL</li>
    <li>TypeScript compiler</li>
    <li>jQuery</li>
    <li>Bootstrap</li>
    <ul>
        <li>Bootstrap 5 stylesheets</li>
        <li>Bootstrap JS plugin</li>
    </ul>
</ul>
A file named <code>config.php</code> containing credentials for 
database- and Google login handling is needed in 
the project root.

Example:
```php
<?php
    session_start();
    // Google OAuth credentials
    require_once "vendor/autoload.php";
    $gClient = new Google_Client();
    $gClient->setClientId("your-client-id-here");
    $gClient->setClientSecret("your-client-secret-here");
    $gClient->setApplicationName("your-application-name-here");
    $gClient->setRedirectUri("http://localhost/auth.php");
    $gClient->addScope(["https://www.googleapis.com/auth/userinfo.email",
                        "https://www.googleapis.com/auth/userinfo.profile"]);

    // MariaDB/MySQL credentials
    const DB_SERVER = "localhost";
    const DB_USERNAME = "db-username";
    const DB_PASSWORD = "db-password";
    const DB_NAME = "db-name";
```