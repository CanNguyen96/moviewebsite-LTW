const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to, subject, htmlContent) => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Anime69 <noreply@api.anime69.website>', // Dùng domain đã verify trên Resend
            to: to,
            subject: subject,
            html: htmlContent
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
