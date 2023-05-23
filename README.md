# nodejs-express-typescript-aws-lamdba-sqs

## Description

Nodejs Express app to receive message (mail details) from AWS SQS and trigger an email using sendgrid and update the status in another AWS SQS queue as a message.

(Express is being used if you would like to run this app as Rest API.)

## Major Technologies

NodeJs, Express, Typescript, AWS, Serverless, Lambda and SQS (SendMessage and ReceiveMessage)

## Installation

To run this application, you must have stable NODE 18+ version

Please go to NodeJS to install 18+ version then run the following command

```bash
$ npm install
```

## To deploy in AWS as Lambda function

Install serverless globally in your system using following command

```bash
$ npm i -g serverless
```

Connect to the your AWS account through serverless

    serverless config credentials --provider aws --key <key> --secret <secret-key>

    Navigate to AWS to get the key and secret
    -> Login to the AWS management console
    -> Click on the dropdown next to your name (Which is present at the top right side of the AWS management console page)
    -> Navigate to the "Access Keys" section
    -> Click on "Create access key"
    -> Check the checkbox of "Continue to create access key?"
    -> Click on "Create access key" button.
    -> Above step generates the Access Key and Secret access key.
    -> Replace key and secret in the above given command and execute it.

Need to have configure severless.yml and provider handler method to your to express app
(Already ran below commands to create a serverless.yml and handler.ts file (src/hander.ts). If you would like to create from scrach, please take a backup of serverless.yml, handler.ts and delete .gitignore folder. Then run below commands, update the files by referring to the backup files)

```bash
$ serverless create -t aws-nodejs
```

Add values for the following environment variables in the serverless.yaml file

```
    # Create a SQS queue with the name as "emailQueue" get the id from the arn then assign to the "SEND_EMAIL_QUEUE_ACCOUNT_ID".
    SEND_EMAIL_QUEUE_ACCOUNT_ID:

    # Create an account in the SendGrid, get the key and then assign to the "SEND_GRID_KEY".   If you would like to use gmail smtp, please make the necessary changes in the code.
    SEND_GRID_KEY: ''

    # Create a SQS queue with the name as "updateNotificationStatusQueue" get the id from the arn then assign to the "UPDATE_NOTIFICATION_STATUS_QUEUE_ACCOUNT_ID".
    UPDATE_NOTIFICATION_STATUS_QUEUE_ACCOUNT_ID:

```

Create a build folder then deploy

```bash
$ npm run build
$ serverless deploy
```

## Steps to add an message (mail details) to the "emailQueue" SQS

After successfully running above steps, AWS function name will be displayed in the terminal as below.

functions:
sendEmail: aws-sqs-send-receive-message-node-typescript-sendgrid-sendEmail

```bash
> Navigate to the AWS SQS then select "emailQueue"

> Click on the "Send and receive messages"

> Enter following object in the message body

{
    "to": [
        "test@gmail.com"     # replace this with your email id
    ],
    "subject": "This is test email",  # replace the subject if required
    "htmlMessage": "Test Email 1."  # replace the htmlmessage if required
}

> Click on "Message Attributes"

> Enter the following details
    triggerEmailNotificationRequestId (in the name textbox)
    1 (in the value textbox.   This can be any number.  Which you would see in the "updateNotificationStatusQueue" after sending an email)

> Click on the "Send Message" button.   This step should trigger lambda function and send a mail then update the status in the "updateNotificationStatusQueue"
```

## Steps to view the message (send mail status details) in the "updateNotificationStatusQueue" SQS

```bash
> Navigate to the AWS SQS then select "updateNotificationStatusQueue"

> Click on the "Send and receive messages"

> Click on "Poll for messages" under "Receive messages" section

> You should see a message in the Messages table.

> Click on the message id to see the received message details after sending an email from nodejs express app which was deployed as Lambda function.
```
