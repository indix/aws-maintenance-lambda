# aws-maintenance-lambda

A lambda function to send alerts (to Slack) on AWS maintenance events. While the email from AWS includes only the instance id, the alert will include the Name of the instance and owner (team or individual on Slack) from the appropriate tags.

## Prerequisite

The lambda function assumes that all resources (EC2 instances) are tagged with a key `Owner` specifying the owner of the resource.

## Installation

Update `config.json` with necessary config for your environment. The keys are explained below:

`store.simpledb.domain` - The lambda function keeps track of processed events in AWS simbedb. This configures the simpledb domain to be used for this purpose.

`notification.slack`
  - `hook` - The slack hook url.
  - `channel` - The channel to send the notifications to.
  - `icon` - Icon to use for the bot that sends the notification.
  - `username` - Username of the bot that sends the notification.
  - `owners` - List of owners per tag. The keys here will be the value of the tag `Owner`. This maps the tag value to owners on slack - for example - `"devops : { "owner": "@devops_team"}"`
    - `all` - this is a catchall owner that is used as default if the resource did not have the `Owner` tag.

### Manual
    
Once the `config.json` has been updated, the lambda function can be manually installed by doing a `npm install --production`, zipping up the entire lambda folder and uploading to AWS like any other lambda function.

### Terraform

The repo also has terraform plans to setup the lambda function - including the necessary IAM roles and schedule. A normal `terraform plan` and `terraform apply` should fully setup the lambda function.
