Feature: Ticket purchase 
    Scenario: Buy 5 standard tickets
        Given user is on "/index.php" page

        When user goes over on next day
        And clicks session with "[data-seance-id='217']"
        And selects 5 standard and 0 premium tickets
        And he's booking 

        Then user is located on "/payment.php"
        And price is equal to "500"

    Scenario: Buy 8 standard and 10 premium tickets
        Given user is on "/index.php" page

        When user goes over on next day
        And clicks session with "[data-seance-id='218']"
        And selects 8 standard and 10 premium tickets
        And he's booking 

        Then user is located on "/payment.php"
        And price is equal to "43000"

    Scenario: Can't buy 0 tickets
        Given user is on "/index.php" page

        When user goes over on next day
        And clicks session with "[data-seance-id='217']"
        And he's booking

        Then button have disable
        And user stay on "/hall.php"