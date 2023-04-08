## Use cases for Functional Requirements

### User Management and Site Security

- As a user, I want to register for the Survey Site Web App.
    - A form will allow the user to enter profile information (username, password, email address. Note that email is only used for registration as part of the user profile, not for authentication), which will be stored in a MongoDB database. After registration is completed, I want to get redirected to the login page.
- As a registered user, I want to log in and log out of the Survey Site Web App.
- As a registered user, I want to modify my profile.
- As a user, I want the site to have security that prevents non-registered users from creating a survey or entering secure areas of the site.

### Registered Users can Create a Survey

- As a registered user, I want to create a survey based on one or two possible survey templates (e.g. Multiple Choice, Agree/Disagree, Short Answer, etc.).
- As a registered user, I want to customize survey questions. This includes the question text and response options.
- As a registered user, I want to create a lifetime for the survey, indicating when the survey becomes active and when it expires.

### Anonymous Users can Respond to Any Active Survey

- As an anonymous user, I want to select an active survey and respond to survey questions.
- Survey responses should be stored in the database for later use.

### Secure Reporting Section

- As a registered user, I want to get simple analysis for any survey that I own, including the number of respondents and survey answer statistics.
- As a registered user, I want the statistics from each survey to be exportable in some manner, such as emailed, printed, exported to excel, etc.