const { Router } = require('express');
const { append } = require('express/lib/response');
const router = Router();
const conf = require('../../conf.json');
const sql = require('mssql');
var _ = require('underscore');
const { messaging } = require('firebase-admin');
const admin = require('firebase-admin/app');
const serviceAccount = require('../util/appnotificaciones-66c44-firebase-adminsdk-qaxnr-24ba9ffe99.json');

admin.initializeApp({
    credential: admin.cert(serviceAccount)
});

router.post('/sendMessageByEmail', (req, res) => {
    
    const { email, tokenObject } = req.body;

    var token = ["fOA6tGwcSfePTw2GN5oHLN:APA91bGVpPBcuFmRKBzvcfjVfG6cZKxgZ-cBzwH_uw_ZupmN_DaHRWDAKl4p507My8ofB3bUDcgFydEzfzXQw7wLPI1HcLYQ-qNRT23ijMIsgk02RaiaulbcoNRSdaQS1X_SUV1UN1Wh", 
    "fX3DCnp0TKyghzHWxYnkGY:APA91bFwjk90nIO_CZoVfMknGnpsquoGtOiT3ye5ZEJSc6HJsI_fZ53FGk4BpdUq5Va5WN0TiWbxlF7MXv79FznqOIStre92ioTZjazWiYvOdGNL1RASleF-GW-GQ6IY5ZlipH7iQsWn",
    "dED4PMhV_UMxuOD5D_-eEj:APA91bEB1HSs9zT88ub87H7d8Fzsd_MTe-eYW0y7egTQRKc0COv_szEvh-7LUjD2Me1vJB015oc4GEZ-NayAMizcvxLryy1346eElrdXrPmYd3rONtSYzn1jyC04xc5FulxesDIhgWF8"
    ];

    var payload = {
        notification: {
        title:'Mi titulo',
        sound: 'Pizzicato.wav',
        body: 'El cuerpo',
        imageUrl: 'https://www.grupoandrade.com/CommonUtilities/Images/Header/Logo-Andrade.png',
        },
        data: {
        MyKey1: "Hello"
        }
    }

    var options = {
        priority: "high",
        timeToLive: 60 * 60 * 24
    }

    messaging().sendToDevice(token, payload, options).then((response) => {
        console.log("Respuesta: " + response);
        res.send('200');
    }).catch((err)=>{
        console.log("Err:" + err);

    });

})

module.exports = router;