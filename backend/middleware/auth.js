const { ClerkExpressWithAuth } = require('@clerk/clerk-sdk-node');

const clerkWithAuth = ClerkExpressWithAuth({
  secretKey: process.env.CLERK_SECRET_KEY,
});

function optionalAuth(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    req.auth = { userId: null };
    return next();
  }
  clerkWithAuth(req, res, (err) => {
    if (err || !req.auth) req.auth = { userId: null };
    next();
  });
}

module.exports = { clerkWithAuth, optionalAuth };
