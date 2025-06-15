export const otpEmailTemplate = (otp) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f8faff;
            margin: 0;
            padding: 0;
        }

        .email-container {
            max-width: 400px;
            margin: 20px auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #b5d5e5;
            border-radius: 8px;
            text-align: center;
        }

        .header {
            background-color: #2c67a6;
            color: #ffffff;
            padding: 10px 0;
            border-radius: 8px 8px 0 0;
        }

        .header h1 {
            margin: 0;
            font-size: 18px;
        }

        .content {
            margin: 20px 0;
            color: #1e293b;
            font-size: 16px;
        }

        .otp {
            font-size: 24px;
            font-weight: bold;
            color: #7ba779;
            margin: 10px 0;
        }

        .copy-btn {
            background-color: #3b82f6;
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
        }

        .copy-btn:hover {
            background-color: #1e3a8a;
        }

        .footer {
            margin-top: 20px;
            font-size: 12px;
            color: #6b7280;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <h1>White Circle OTP Verification</h1>
        </div>
        <div class="content">
            <p>Your One-Time Password (OTP) is:</p>
            <div class="otp" id="otp">${otp}</div>
            <p>Please use this code to complete your verification. This code is valid for 10 minutes.</p>
        </div>
        <div class="footer">
            <p>If you did not request this, please ignore this email.</p>
            <p>&copy; <script>document.write(new Date().getFullYear());</script> White Circle</p>
        </div>
    </div>
</body>
</html>
`
