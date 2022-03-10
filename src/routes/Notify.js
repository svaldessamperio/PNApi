const { Router } = require('express');
const { append } = require('express/lib/response');
const router = Router();
const conf = require('../../conf.json');
const sql = require('mssql');
const { messaging } = require('firebase-admin');

async function sendMessageToTokens (tokens, notification){
    if (tokens.length>0) {
        // var token = ["fOA6tGwcSfePTw2GN5oHLN:APA91bGVpPBcuFmRKBzvcfjVfG6cZKxgZ-cBzwH_uw_ZupmN_DaHRWDAKl4p507My8ofB3bUDcgFydEzfzXQw7wLPI1HcLYQ-qNRT23ijMIsgk02RaiaulbcoNRSdaQS1X_SUV1UN1Wh", 
        //             "fX3DCnp0TKyghzHWxYnkGY:APA91bFwjk90nIO_CZoVfMknGnpsquoGtOiT3ye5ZEJSc6HJsI_fZ53FGk4BpdUq5Va5WN0TiWbxlF7MXv79FznqOIStre92ioTZjazWiYvOdGNL1RASleF-GW-GQ6IY5ZlipH7iQsWn",
        //             "dED4PMhV_UMxuOD5D_-eEj:APA91bEB1HSs9zT88ub87H7d8Fzsd_MTe-eYW0y7egTQRKc0COv_szEvh-7LUjD2Me1vJB015oc4GEZ-NayAMizcvxLryy1346eElrdXrPmYd3rONtSYzn1jyC04xc5FulxesDIhgWF8"
        //             ];
        var payload = {
            notification,
            data: {
                MyKey1: "Hello"
            }
        }
        var options = {
            priority: "high",
            timeToLive: 60 * 60 * 24
        }
        
        messaging().sendToDevice(tokens, payload, options)
        .then( response => {
            console.log("Respuesta: " + response);
            return response;
        })
        .catch( err => {
            console.log("Err:" + err);
            return err;
        })
    }
}

router.post('/sendMessageByEmail', (req, res) => {

    const { email, notification } = req.body;
    const tokens = [];

    sql.connect(conf).then(pool => {
        return pool.request()
            .input('email', sql.VarChar, email)
            //.query('select * from ControlAplicaciones.dbo.cat_usuarios where usu_idusuario = @idEmpleado')
            .execute('[SEL_TOKENUSUARIO_SP]')
    }).then(result => {
        if (result.recordset.length > 0){
            const elements = JSON.parse(result.recordset[0].token);
            for(i=0; i<elements.length; i++){
                tokens.push(elements[i]._W);
            }
        }

        const send = sendMessageToTokens(tokens, notification);

    }).catch(err => {
        console.log('SEGUNDO ERR: ' + err);
    })

    res.send('200 Recibido:');
});

router.post('/sendMessageByNotifyType', (req, res) => {

    const { idTipoNotificacion, idTipoEscalamiento, notification } = req.body;
    const tokens = [];

    sql.connect(conf).then(pool => {
        return pool.request()
            .input('IdTipoNotificacion', sql.Int, idTipoNotificacion)
            .input('IdTipoEscalamiento', sql.Int, idTipoEscalamiento)
            //.query('select * from ControlAplicaciones.dbo.cat_usuarios where usu_idusuario = @idEmpleado')
            .execute('[SEL_TOKENBYTIPONOTIFICACION_SP]')
    }).then(result => {
        if (result.recordset.length > 0){
            const elements = JSON.parse(result.recordset[0].token);
            for(i=0; i<elements.length; i++){
                tokens.push(elements[i]._W);
            }
        }

        const send = sendMessageToTokens(tokens, notification);
        res.send('200 Recibido:');

    }).catch(err => {
        console.log('SEGUNDO ERR: ' + err);
        res.send('500 Recibido:');
    })


});

module.exports = router;
