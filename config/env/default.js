'use strict';

module.exports = {
        app: {
                title: '昆明金鹰',
                description: '',
                keywords: '昆明金鹰 众筹',
                googleAnalyticsTrackingID: process.env.GOOGLE_ANALYTICS_TRACKING_ID || 'GOOGLE_ANALYTICS_TRACKING_ID'
        },
        port: process.env.PORT || 3000,
        templateEngine: 'swig',
        sessionSecret: 'KM-GOLDEN-EAGLE',
        sessionCollection: 'sessions',
        logo: 'modules/core/img/brand/logo.png',
        favicon: 'modules/core/img/brand/favicon.ico'
};
