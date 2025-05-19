import nodemailer from 'nodemailer';
import environment from './environment';
import { logger } from '../utils/logger.util';

// إنشاء ناقل البريد الإلكتروني | Create email transporter
const transporter = nodemailer.createTransport({
  host: environment.EMAIL.HOST,
  port: environment.EMAIL.PORT,
  secure: environment.EMAIL.PORT === 465,
  auth: {
    user: environment.EMAIL.USER,
    pass: environment.EMAIL.PASS,
  },
});

// التحقق من اتصال البريد الإلكتروني | Verify email connection
const verifyConnection = async (): Promise<void> => {
  try {
    await transporter.verify();
    logger.info('تم الاتصال بخدمة البريد الإلكتروني بنجاح | Email service connected successfully');
  } catch (error) {
    logger.error('خطأ في الاتصال بخدمة البريد الإلكتروني | Email service connection error:', error);
    throw error;
  }
};

// قوالب البريد الإلكتروني | Email templates
const emailTemplates = {
  // قالب الترحيب | Welcome template
  welcome: (name: string) => ({
    subject: 'مرحبًا بك في تطبيق توصيل السوبر ماركت | Welcome to Supermarket Delivery App',
    html: `
      <h1>مرحبًا ${name}!</h1>
      <p>شكرًا لتسجيلك في تطبيق توصيل السوبر ماركت.</p>
      <p>يمكنك الآن البدء في التسوق وتوصيل طلباتك إلى منزلك.</p>
    `,
  }),

  // قالب إعادة تعيين كلمة المرور | Password reset template
  resetPassword: (name: string, resetLink: string) => ({
    subject: 'إعادة تعيين كلمة المرور | Reset Password',
    html: `
      <h1>مرحبًا ${name}</h1>
      <p>لقد تلقينا طلبًا لإعادة تعيين كلمة المرور الخاصة بك.</p>
      <p>انقر على الرابط التالي لإعادة تعيين كلمة المرور:</p>
      <a href="${resetLink}">إعادة تعيين كلمة المرور | Reset Password</a>
      <p>ينتهي هذا الرابط خلال 1 ساعة.</p>
    `,
  }),

  // قالب تأكيد الطلب | Order confirmation template
  orderConfirmation: (name: string, orderNumber: string, orderDetails: any) => ({
    subject: `تأكيد الطلب #${orderNumber} | Order Confirmation #${orderNumber}`,
    html: `
      <h1>مرحبًا ${name}</h1>
      <p>شكرًا لطلبك! تم استلام طلبك بنجاح.</p>
      <h2>تفاصيل الطلب | Order Details:</h2>
      <p>رقم الطلب | Order Number: ${orderNumber}</p>
      <p>التاريخ | Date: ${new Date().toLocaleString()}</p>
      <p>المبلغ الإجمالي | Total Amount: ${orderDetails.total}</p>
    `,
  }),
};

// إرسال البريد الإلكتروني | Send email
const sendEmail = async (to: string, template: string, data: any): Promise<void> => {
  try {
    let emailContent;
    switch (template) {
      case 'welcome':
        emailContent = emailTemplates.welcome(data.name);
        break;
      case 'resetPassword':
        emailContent = emailTemplates.resetPassword(data.name, data.resetLink);
        break;
      case 'orderConfirmation':
        emailContent = emailTemplates.orderConfirmation(data.name, data.orderNumber, data.orderDetails);
        break;
      default:
        throw new Error('قالب البريد الإلكتروني غير موجود | Email template not found');
    }
    
    await transporter.sendMail({
      from: environment.EMAIL.FROM,
      to,
      subject: emailContent.subject,
      html: emailContent.html,
    });
    
    logger.info(`تم إرسال البريد الإلكتروني بنجاح إلى ${to} | Email sent successfully to ${to}`);
  } catch (error) {
    logger.error('خطأ في إرسال البريد الإلكتروني | Error sending email:', error);
    throw error;
  }
};

export default {
  verifyConnection,
  sendEmail,
}; 