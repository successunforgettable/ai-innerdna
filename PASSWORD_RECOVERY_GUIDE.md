# Password Recovery System - User Guide

## Current Status
The password recovery system is fully operational with SendGrid integration. Emails are being sent successfully (status 202) but may experience delivery delays.

## How Password Recovery Works

### 1. Request Recovery
- Go to login page and click "Forgot Password?"
- Enter your registered email address
- System generates a unique recovery code

### 2. Recovery Options

#### Option A: Email Delivery (May be delayed)
- Check inbox for email from: support@arfeenkhan.com
- Check spam/junk folder
- Check promotions tab (Gmail users)
- Delivery can take 1-15 minutes

#### Option B: Contact Support Directly
If email doesn't arrive:
- Email: support@innerdna.com
- Include: Your registered email address
- Include: Recovery code (shown in browser after request)
- Response time: Within 24 hours

### 3. Recovery Process
1. Contact support with your recovery code
2. Verify your identity with registered email
3. Support team creates new secure password
4. Receive new login credentials via secure channel

## Technical Details
- Recovery codes expire after 24 hours
- All codes are logged server-side for verification
- Passwords are securely encrypted (cannot be retrieved)
- System maintains security through manual verification process

## Troubleshooting
- **No email received**: Check spam folder, wait 15 minutes, then contact support
- **Recovery code expired**: Request new recovery code
- **Multiple requests**: Only latest recovery code is valid

The system prioritizes security while providing multiple recovery paths for user convenience.