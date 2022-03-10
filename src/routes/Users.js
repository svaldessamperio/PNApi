const { Router } = require('express');
const { append } = require('express/lib/response');
const router = Router();
const conf = require('../../conf.json');
const sql = require('mssql');
var _ = require('underscore');
const { messaging } = require('firebase-admin');

router.get('/getDeviceTokensByUser', (req, res) => {
    const { email } = req.query;
    sql.connect(conf).then(pool => {
        return pool.request()
            .input('email', sql.VarChar, email)
            //.query('select * from ControlAplicaciones.dbo.cat_usuarios where usu_idusuario = @idEmpleado')
            .execute('[SEL_TOKENUSUARIO_SP]')
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        console.log('SEGUNDO ERR: ' + err);
    })
})

router.get('/getDeviceTokensByTipoNotificacion', (req, res) => {
    const { idTipoNotificacion, idTipoEscalamiento } = req.query;
    sql.connect(conf).then(pool => {
        return pool.request()
            .input('IdTipoNotificacion', sql.Int, idTipoNotificacion)
            .input('IdTipoEscalamiento', sql.Int, idTipoEscalamiento)
            //.query('select * from ControlAplicaciones.dbo.cat_usuarios where usu_idusuario = @idEmpleado')
            .execute('[SEL_TOKENBYTIPONOTIFICACION_SP]')
    }).then(result => {
        res.send(result.recordset);
    }).catch(err => {
        console.log('SEGUNDO ERR: ' + err);
    })
})

router.post('/storeUserDeviceToken', (req, res) => {
    const {email, tokenObject}   = req.body.params;
    
    sql.connect(conf).then(pool => {
        return pool.request()
            .input('email', sql.VarChar, email)
            .input('tokenObject', sql.VarChar(sql.MAX), tokenObject)
            //.query('select * from ControlAplicaciones.dbo.cat_usuarios where usu_idusuario = @idEmpleado')
            .execute('[INS_TOKENUSUARIO_SP]')
    }).then(result => {
        console.log(result);
        res.send('Recibido: \n' + JSON.stringify(result,null,4));
    }).catch(err => {
        console.log('SEGUNDO ERR: ' + err);
    })
});

module.exports = router;
