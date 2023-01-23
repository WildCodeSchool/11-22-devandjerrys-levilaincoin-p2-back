const express = require("express");
const cors = require("cors");
const fs = require('fs');
const morgan = require('morgan');
const {validateUserSignIn} = require("./validator.js")
const app = express();
const serverPort = 4242

// XXXXXXXXXXXXXXXXXXXXXXXXXX Appel fichier JSON XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const customersDatas = require('./customersApi.json')
const vilainsDatas = require('./villainsApi.json');
const { stringify } = require("querystring");
const { log } = require("console");

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Middleware XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.use(cors("*"));
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXX   CUSTOMERS   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXX Ecriture dans fichier customer XXXXXXXXXXXXXXXXXXXXX
const fonctionDeTaitementRqueteCustomers = async (contentToWrite) => {
    // Fonction d'écriture dans le fichier json
    // contentToWrite est un paramètre correspondant ici à "requestContent"
    fs.writeFile('customersApi.json', contentToWrite, (err) => {

        if (err) {
            console.log(err);
        } else {
            console.log("done!!");
        }
    })
}
    // Route d'écriture
    app.post('/write/customers', validateUserSignIn, async (req, res, next) => {
    // récupère le body de la requête (req.body) pour le convertir en string
    // requestContent est le tableau envoyé par  la fonction saveJson de l'app
    // de l'exemple, le transfert se fait via "axios.post" côté front end
    const requestContent = JSON.stringify(req.body, null, 2)
    console.log("salut je suis la ", requestContent);
    await fonctionDeTaitementRqueteCustomers(requestContent);

    res.json(requestContent)
});
// XXXXXXXXXXXXXXXXXXXXXXXXX Import profils clients XXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/customers", (req, res) => {
    res.status(200).json(customersDatas);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX   VILLAINS   XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXXXXX Ecriture dans fichier villains XXXXXXXXXXXXXXXXXXXXX

const fonctionDeTaitementRqueteVillains = async (contentToWrite) => {  
    fs.writeFile('villainsApi.json', contentToWrite, (err) => {

        if (err) {
            console.log(err);
        } else {
            console.log("done!!");
        }
    })
}
    // Route d'écriture
app.post('/write/villains', async (req, res, next) => {
    const requestContent = JSON.stringify(req.body, null, 2)
    console.log("salut je suis la ", requestContent);
    await fonctionDeTaitementRqueteVillains(requestContent);

    res.json(requestContent)
});
// XXXXXXXXXXXXXXXXXX  Importe tous les profils VILAINS  XXXXXXXXXXXXXXXXXXXXX

app.get("/", (req, res) => {
    res.status(200).json(vilainsDatas);
});

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "idVilain"  XXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

// XXXXXXXXXXXXXXXXXXX  Vilain dynamic selection from Id  XXXXXXXXXXXXXXXXXXXX
app.get(`/selection/id/:id`, (req, res) => {
    const identification = parseInt(req.params.id,10)
    console.log(identification);
    const result = vilainsDatas.filter(data => data.id === identification);
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXX Vilain dynamic selection from Name XXXXXXXXXXXXXXXXXXXXX
app.get(`/selection/name/:name`, (req, res) => {
    const identification = req.params.name;
    console.log(identification);
    const result = vilainsDatas.filter(data => data.name === identification);
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "conquer"  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/occupation/conquer", (req, res) => {
    const result = vilainsDatas.filter(data => data.occupation === "conquer")
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "escort"  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/occupation/escort", (req, res) => {
    // XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
    const result = vilainsDatas.filter(data => data.occupation === "escort")
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "birthday"  XXXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/occupation/birthday", (req, res) => {
    const result = vilainsDatas.filter(data => data.occupation === "birthday")
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "nanny"  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/occupation/nanny", (req, res) => {
    const result = vilainsDatas.filter(data => data.occupation === "nanny")
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "EVG.JF"  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/occupation/stag", (req, res) => {
    const result = vilainsDatas.filter(data => data.occupation === "stag")
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "destroy"  XXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/occupation/destroy", (req, res) => {
    const result = vilainsDatas.filter(data => data.occupation === "destroy")
    res.status(200).json(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.listen(serverPort, (err) => {
    if (err) {
        console.log("ho crap!!");
    } else {
        console.log("http://localhost:4242")
    }
});