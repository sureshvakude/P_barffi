export async function sendOtpEmail(email: string, otp: string) {
    try {
        const response = await fetch('/api/sendotp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                to: email,
                subject: 'Your Barffi.com OTP – Verify Your Account Now! 🚀',
                text: `Hello,

Welcome to **Barffi.com**! 🎉 We're excited to have you on board.

To complete your registration and secure your account, please use the following **One-Time Password (OTP):**

🔒 **${otp}**

This OTP is valid for the next **10 minutes**. Please do not share this code with anyone for security reasons.

If you didn’t request this, please ignore this email.

Need help? Our support team is here for you.

Happy exploring! 🚀

**Team Barffi**  
🌍 [www.barffi.com](https://www.barffi.com) | 📧 support@barffi.com`,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to send OTP email');
        }

        return { success: true, message: 'OTP email sent successfully' };
    } catch (error) {
        return { success: false, message: error.message };
    }
}
