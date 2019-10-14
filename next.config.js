require('dotenv').config();

module.exports = {
    publicRuntimeConfig: {
        apiUrl: process.env.API_URL,
        segmentWriteKey: process.env.SEGMENT_WRITE_KEY,
    }
};