<?php
    require_once "config.php";
    require_once "utils.php";

    if (isset($_SESSION['access_token'])) {
        $gClient->setAccessToken($_SESSION['access_token']);
    } else if (isset($_GET['code'])) {
        $token = $gClient->fetchAccessTokenWithAuthCode($_GET['code']);
        $_SESSION['access_token'] = $token;
    } else {
        header("Location: login.php");
        exit(); // dont execute the lines below
    }

    $oAuth = new Google_Service_Oauth2($gClient);
    $userData = array("email"=>"", "familyName"=>"", "givenName"=>"", "fullName"=>"", "picture"=>"", "id"=>"");
    $userData = $oAuth->userinfo_v2_me->get();


    // NOTE: to use the mysqli extension, it should be enabled in php.ini, and the server must be restarted afterwards
    mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);
    $db = null;
    try {
        $db = new mysqli(DB_SERVER, DB_USERNAME, DB_PASSWORD, DB_NAME);
        if ($db->connect_error) {
            echo "Connection failed: " . $db->connect_error;
        }
        // check whether the user has logged in previously
        $stmt = $db->prepare("SELECT * FROM users WHERE google_ID = ?");
        if (!$stmt) {
            throw new Exception("Could not prepare SQL statement. Please try again.");
        }
        $stmt->bind_param('s', $userData['id']);
        $stmt->execute();
        $result = $stmt->get_result();

        // if the id was not found in the database
        if ($result && $result->num_rows < 1) {
            $stmt = $db->prepare("INSERT INTO users (email, family_name, given_name, full_name, picture_link, 
                   google_id) VALUES (?, ?, ?, ?, ?, ?);");
            if (!$stmt) {
                throw new Exception("Could not prepare SQL statement. Please try again.");
            }
            $stmt->bind_param('ssssss', $userData['email'], $userData['familyName'],
                $userData['givenName'], $userData['name'], $userData['picture'], $userData['id']);
            $stmt->execute();
        }

        // read the user's data and set up the session
        $stmt = $db->prepare("SELECT * FROM users WHERE google_ID = ?");
        if (!$stmt) {
            throw new Exception("Could not prepare SQL statement. Please try again.");
        }
        $stmt->bind_param('s', $userData['id']);
        $stmt->execute();
        $result = $stmt->get_result()->fetch_row();

        $_SESSION['userId'] = $result[0];
        $_SESSION['email'] = $result[1];
        $_SESSION['familyName'] = $result[2];
        $_SESSION['givenName'] = $result[3];
        $_SESSION['fullName'] = $result[4];
        $_SESSION['pictureLink'] = $result[5];
        $_SESSION['googleId'] = $result[6];
        $_SESSION['isAdmin'] = $result[7];

        // log the login event
        Utils::logEvent(LogType::INFO(), "Login", $_SESSION['userId']);

    } catch (Exception $exception) {
//        echo $exception->getMessage();
        Utils::logEvent(LogType::ERROR(), $exception->getMessage());
    } finally {
        if ($db != null)
            $db->close();
    }

    header(isset($_SESSION['redirect']) ? "Location: " . $_SESSION['redirect'] : "Location: .");