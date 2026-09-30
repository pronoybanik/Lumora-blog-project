import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  ssl: {
    storeId: process.env.SSLCOMMERZ_STORE_ID,
    storePassword: process.env.SSLCOMMERZ_STORE_PASSWORD,
    paymentApi: process.env.SSLCOMMERZ_PAYMENT_API || "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
    validationApi: process.env.SSLCOMMERZ_VALIDATION_API || "https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php",
    successUrl: process.env.SSLCOMMERZ_SUCCESS_URL || "http://localhost:5000/api/v1/ssl/success",
    failedUrl: process.env.SSLCOMMERZ_FAILED_URL || "http://localhost:5173/failed",
    cancelUrl: process.env.SSLCOMMERZ_CANCEL_URL || "http://localhost:5173/cancel",
    monthlyAmount: process.env.PREMIUM_MONTHLY_AMOUNT || "1200",
    yearlyAmount: process.env.PREMIUM_YEARLY_AMOUNT || "12000",
  },
//   reset_pass_secret: process.env.RESET_PASS_TOKEN,
//   reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
//   reset_pass_link: process.env.RESET_PASS_LINK,
//   emailSender: {
//     email: process.env.EMAIL,
//     app_pass: process.env.APP_PASS
// }
};
