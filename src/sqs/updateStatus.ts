import { SQS } from 'aws-sdk';

var sqs = new SQS({ apiVersion: '2023-05-22' });

export enum MAIL_STATUS {
  FAILED = 'FAILED',
  SUCCESS = 'SUCCESS',
}

interface UpdateStatusProps {
  accountId: number;
  region: string;
  queueName: string;
  status: MAIL_STATUS;
  requestId: string;
}

export const updateStatus = async (input: UpdateStatusProps) => {
  console.log('Update Status input params: ', input);
  const { region, accountId, queueName } = input;

  let message: string;

  const queueUrl: string = `https://sqs.${region}.amazonaws.com/${accountId}/${queueName}`;

  const params = {
    DelaySeconds: 2,
    MessageAttributes: {
      sendEmailRequestId: {
        DataType: 'String',
        StringValue: input.requestId,
      },
    },
    MessageBody: input.status,
    QueueUrl: queueUrl,
  };

  console.log('Update Status SQS params: ', params);
  try {
    await sqs.sendMessage(params).promise();

    console.log('Update Status SQS updated the message');

    message = 'Message placed in the Queue!';
  } catch (error: any) {
    console.log('Update Status SQS failed to update the message', error);
    message = 'Error occured while updating the status';
  }

  return message;
};
