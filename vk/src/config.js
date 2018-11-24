const config = {
    port: +process.env.VK_PORT || 3999,
    accessToken: process.env.VK_ACCESS_TOKEN || "access_token",
    userId: process.env.VK_USER_ID || "userId",

    db: {
        mongoUrl: process.env.VK_MONGO_URL || "mongodb://localhost:32770",
        name: process.env.VK_DB_NAME || "hashtagwth"
    },

    minsk_latitude: 53.9,
    minsk_longitude: 27.56667,
    vk_version: 5.52,
    vk_max_count: 200,
    vkHashtags: [
        "минск",
        "dance",
        "party",
        "день рождения",
        "печаль",
        "девочки спасибо",
        "девочки спосибо",
        "культурное начало вечера",
        "minsk girl",
        "girl",
        "man",
        "hard party",
        "clever",
        "люблю свою жизнь",
        "lounge",
        "мята",
        "hookah",
        "#",
        " "
    ]
};

module.exports = config;