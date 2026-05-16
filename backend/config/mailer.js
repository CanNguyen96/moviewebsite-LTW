const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, text) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'MovieWebsite <onboarding@resend.dev>', // Domain mặc định của Resend (miễn phí)
            to,
            subject,
            text
        });

        if (error) {
            console.error('Lỗi gửi email:', error);
            return false;
        }

        console.log('Email sent:', data?.id);
        return true;
    } catch (err) {
        console.error('Lỗi gửi email:', err);
        return false;
    }
};

module.exports = {
    sendMail
};
