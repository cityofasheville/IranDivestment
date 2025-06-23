import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const client = new SESClient({ region: 'us-east-1' });

async function ses_sendemail (emailAddrs, htmlEmail) {
  const params = {
    Destination: {
      /* required */
      CcAddresses: [
        /* more items */
      ],
      ToAddresses: emailAddrs
    },
    Message: {
      /* required */
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: htmlEmail
        },
        Text: {
          Charset: 'UTF-8',
          Data: htmlEmail
        }
      },
      Subject: {
        Charset: 'UTF-8',
        Data: 'City of Asheville Iran Divestment'
      }
    },
    Source: 'asheville_notifications@ashevillenc.gov', // SENDER_ADDRESS
    ReplyToAddresses: [
      'asheville_notifications@ashevillenc.gov'
    ]
  }
  try {
    const data = await client.send(new SendEmailCommand(params));
    console.log('Email sent successfully. Message ID:', data.MessageId);
    return 'Success - Message ID:' + data.MessageId;
  } catch (err) { 
    console.error('Error sending email:', err);
    throw err;
  }
};

export default ses_sendemail;
