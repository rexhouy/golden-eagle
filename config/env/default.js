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
        logo: '/modules/core/img/brand/logo.png',
        favicon: '/modules/core/img/brand/favicon.ico',
        upload_path: '/home/rexhouy/tmp/uploads/',
        upload_url: 'http://upload.localhost/',
        sms_host: 'app.cloopen.com',
        sms_port: '8883',
        sms_account_id: '8a48b5514e3e5862014e4d8dbcfd0e32',
        sms_url: '/2013-12-26/Accounts/'+this.sms_account_id+'/SMS/TemplateSMS',
        sms_auth_token: 'aab4e3de8705464a867248fdd23fa42e',
        sms_app_id: '8a48b5514ee36774014ef297cd810ff6',
        sms_template_id: '29212'

};
