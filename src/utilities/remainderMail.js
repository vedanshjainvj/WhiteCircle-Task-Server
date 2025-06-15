export const resourceExpiryReminderText = (resource) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Resource Expiry Reminder</title>
</head>
<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">

  <table style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
    <tr>
      <td>
        <h2 style="color: #333;">Hello ${resource.userName},</h2>

        <p style="font-size: 16px; color: #555;">
          Just a friendly reminder that your uploaded resource titled
          <strong>"${resource.title}"</strong> is set to expire on
          <strong>${new Date(resource.expiryDate).toLocaleString()}</strong>.
        </p>

        <p style="font-size: 16px; color: #555;">
          You can download or manage the resource using the link below:
        </p>

        <p style="margin: 20px 0;">
          <a href="${resource.resourceUrl}" target="_blank"
             style="background-color: #007bff; color: #ffffff; padding: 12px 20px; border-radius: 5px; text-decoration: none; font-weight: bold;">
            View Resource
          </a>
        </p>

        <p style="font-size: 16px; color: #555;">
          If you wish to keep this resource available, please take action before the expiry date.
        </p>

        <p style="font-size: 16px; color: #888;">
          Best regards,<br>
          <strong>WC Team</strong>
        </p>
      </td>
    </tr>
  </table>

</body>
</html>
`;
