import { Router, Request, Response } from 'express';
import sgMail from '@sendgrid/mail';
import { SendGridEmail } from '../../services/v1';

const router = Router();

router.post('/', async (req: Request, res: Response) => {
  const { to, cc, subject, htmlMessage, attachments } = req.body;

  try {
    await SendGridEmail.send({
      to,
      bcc: cc,
      htmlMessage,
      subject,
      attachments,
    });

    res.status(200).send(`Email triggered to ${to?.join(',')}.`);
  } catch (error) {
    console.log('Error: ' + JSON.stringify(error));
    res.status(400).send(`Error occured while send email.`);
  }
});

export { router as emailRouter };
