const { Router } = require('express');
const { append } = require('express/lib/response');
const router = Router();
const conf = require('../../conf.json');
const sql = require('mssql');
var _ = require('underscore');

router.get('/getDeviceTokensByUser', (req, res) => {
    const { email } = req.query;
    sql.connect(conf).then(pool => {
        return pool.request()
            .input('email', sql.VarChar, email)
            //.query('select * from ControlAplicaciones.dbo.cat_usuarios where usu_idusuario = @idEmpleado')
            .execute('[SEL_TOKENUSUARIO_SP]')
    }).then(result => {
        console.log(result.recordset);
        res.send(result.recordset);
    }).catch(err => {
        console.log('SEGUNDO ERR: ' + err);
        res.send('500 ' + err);
    })
})

router.post('/storeUserDeviceToken', (req, res) => {

    const { email, tokenObject } = req.body;
    sql.connect(conf).then(pool => {
        return pool.request()
            .input('email', sql.VarChar, email)
            .input('tokenObject', sql.VarChar(sql.MAX), tokenObject)
            //.query('select * from ControlAplicaciones.dbo.cat_usuarios where usu_idusuario = @idEmpleado')
            .execute('[INS_TOKENUSUARIO_SP]')
    }).then(result => {
        console.log(result);
        res.send('200');
    }).catch(err => {
        console.log('500 ' + err);
    })

});

router.delete('/:id', (req, res) => {
    const pelis = req.body;
    const {id} = req.params;

    _.each(pelis, ( peli, i ) => {
        if(peli.id === id) {
            console.log(peli);
            res.send('deleted...' + JSON.stringify(peli,null,4));
        }
    });
    
});

module.exports = router;
