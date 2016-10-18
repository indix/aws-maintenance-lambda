# aws-maintenance-lambda

A lambda function to send alerts (to Slack) on AWS maintenance events. While the email from AWS includes only the instance id, the alert will include the Name of the instance and owner (team or individual on Slack) from the appropriate tags.
