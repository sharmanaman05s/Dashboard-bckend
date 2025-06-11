// This file will correctly initialize the Clerk SDK for use in your backend.
const { createClerkClient } = require('@clerk/backend');

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
 
module.exports = clerk; 