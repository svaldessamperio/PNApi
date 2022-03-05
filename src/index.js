const express = require ('express');
const app = express();
var cors = require('cors');
const morgan = require ('morgan');

//Settings
app.set('port', process.env.PORT || 5000);
app.set('jason spaces', 2);

//middlewares
app.use(morgan('combined')); //muestra más información de la petición a este servidor
app.options("*", cors({ origin: 'http://localhost:5000', optionsSuccessStatus: 200 }));
app.use(cors({origin: true, credentials: true}));
app.use(express.urlencoded({extended: false})); //soporta formularios en html
app.use(express.json()); // soporta JSONs

//ROUTES
app.use('/api/pushNotToken', require('./routes/pushNotToken'));

//Startting Server
app.listen(app.get('port'), ()=> {
    console.log(`Server on Port ${app.get('port')}`);
})
