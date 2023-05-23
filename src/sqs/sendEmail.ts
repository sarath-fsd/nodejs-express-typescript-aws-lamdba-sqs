import { SQSHandler } from 'aws-lambda';
import { SendGridEmail } from '../services/v1';
import { TriggerEmailProps } from '../services/v1/email';
import { MAIL_STATUS, updateStatus } from './updateStatus';

const receiver: SQSHandler = async (event) => {
  try {
    const { UPDATE_NOTIFICATION_STATUS_QUEUE_ACCOUNT_ID, UPDATE_NOTIFICATION_STATUS_QUEUE_NAME, UPDATE_NOTIFICATION_STATUS_QUEUE_REGION } =
      process.env;

    const updateStatusQueueDetails = {
      accountId: UPDATE_NOTIFICATION_STATUS_QUEUE_ACCOUNT_ID!,
      queueName: UPDATE_NOTIFICATION_STATUS_QUEUE_NAME!,
      region: UPDATE_NOTIFICATION_STATUS_QUEUE_REGION!,
    };

    let updateStatusDetails = {
      accountId: Number(updateStatusQueueDetails.accountId),
      region: updateStatusQueueDetails.region,
      queueName: updateStatusQueueDetails.queueName,
      requestId: '',
      status: MAIL_STATUS.SUCCESS,
    };

    for (const record of event.Records) {
      try {
        const { messageAttributes, body } = record;
        const { triggerEmailNotificationRequestId } = messageAttributes;

        updateStatusDetails.requestId = triggerEmailNotificationRequestId.stringValue!;

        const { to, subject, htmlMessage, attachments, bcc } = JSON.parse(body) as TriggerEmailProps;

        await SendGridEmail.send({ subject, htmlMessage, attachments, to, bcc });

        updateStatusDetails.status = MAIL_STATUS.SUCCESS;
      } catch (error) {
        console.log('Error occurred while sending an email: ', error);
        updateStatusDetails.status = MAIL_STATUS.FAILED;
      }

      const result = await updateStatus({
        ...updateStatusDetails,
      });

      console.log(result);
    }
  } catch (error) {
    console.log(error);
  }
};
export default receiver;
