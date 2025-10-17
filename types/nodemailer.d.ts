declare module 'nodemailer' {
  // Минимальная декларация, чтобы TS не ругался.
  const nodemailer: any;
  export default nodemailer;
}