const jwtConfig = {
    secret: process.env.JWT_SECRET || 'default_secret',
    expiresIn: process.env.JWT_EXPIRE || '30d'
};

module.exports = jwtConfig;
