// config/cookieOptions.js
// Central place to define cookie settings for our JWT auth cookie
// Keeping this in one file means we don't repeat the same options everywhere

const cookieOptions = {
  httpOnly: true, // JS on frontend cannot read this cookie (protects from XSS)
  secure: process.env.NODE_ENV === "production", // only send over HTTPS in production
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // needed for cross-site cookies in production
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

module.exports = cookieOptions;
