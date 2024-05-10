import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
const client = new SESClient({ region: 'us-east-1' });

function ses_sendemail (emailAddrs, htmlEmail) {
  return new Promise(async (resolve, reject) => {
    try {
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

      client.send(new SendEmailCommand(params), (err) => {
        if (err) {
          reject(err)
        } else {
          resolve('Success - Message ID:' + MessageID)
        }
      })
    } catch (err) { reject(err) }
  })
};

export default ses_sendemail;
