import { SQSHandler } from 'aws-lambda';
import { SendGridEmail } from '../services/v1';
import { TriggerEmailProps } from '../services/v1/email';
import { MAIL_STATUS, updateStatus } from './updateStatus';

const receiver: SQSHandler = async (event) => {
  try {
    const { updateQueueAccountId, updateQueueName, updateQueueRegion } = process.env;

    console.log('Env variables:', process.env);

    const updateStatusQueueDetails = {
      accountId: updateQueueAccountId!,
      queueName: updateQueueName!,
      region: updateQueueRegion!,
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
        const { triggerEmailNotification } = messageAttributes;

        updateStatusDetails.requestId = triggerEmailNotification.stringValue!;

        const { to, subject, htmlMessage, attachments, bcc } = JSON.parse(body) as TriggerEmailProps;

        await SendGridEmail.send({ subject, htmlMessage, attachments, to, bcc });

        updateStatusDetails.status = MAIL_STATUS.SUCCESS;
      } catch (error) {
        console.log('Error occured while sending an email: ', error);
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
