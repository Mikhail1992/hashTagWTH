const config = {
    port: +process.env.VK_PORT || 3999,
    accessToken: process.env.VK_ACCESS_TOKEN || "access_token",
    userId: process.env.VK_USER_ID || "userId"
};

module.exports = config;