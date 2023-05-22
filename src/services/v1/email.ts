import sgMail from '@sendgrid/mail';
import AttachmentData from '@sendgrid/helpers/classes/attachment';

export interface TriggerEmailProps {
  to: Array<string>;
  bcc?: string;
  subject: string;
  htmlMessage: string;
  attachments?: AttachmentData[];
}

const emailConfig = {
  pollingEnabled: false,
  enabled: true,
  from: process.env.sendEmailFrom || 'awslambda.email@test.com',
  sendgrid: {
    key: process.env.sendGridKey!,
  },
};

export class SendGridEmail {
  static async send(emailProps: TriggerEmailProps) {
    console.log('Send method called with params: ', JSON.stringify(emailProps));

    const { to, bcc, subject, htmlMessage, attachments } = emailProps;

    const msg = {
      to: to?.join(','),
      bcc: (bcc || '').trim(),
      from: 'TEST Email <' + (emailConfig.from || '').trim() + '>',
      subject: (subject || '').trim(),
      text: (htmlMessage || '').trim(),
      html: (htmlMessage || '').trim(),
      attachments: attachments,
    };

    console.log('sending sendgrid message: ' + JSON.stringify(msg));
    try {
      sgMail.setApiKey(emailConfig.sendgrid.key);
      await sgMail.send(msg);

      console.log('Successfully update email notification');
      return 'Successfully update email notification';
    } catch (error) {
      console.log('Error: ' + JSON.stringify(error));
      throw error;
    }
  }
}
