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
//   reset_pass_secret: process.env.RESET_PASS_TOKEN,
//   reset_pass_token_expires_in: process.env.RESET_PASS_TOKEN_EXPIRES_IN,
//   reset_pass_link: process.env.RESET_PASS_LINK,
//   emailSender: {
//     email: process.env.EMAIL,
//     app_pass: process.env.APP_PASS
// }
};
