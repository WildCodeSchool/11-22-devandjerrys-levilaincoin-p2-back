const express = require("express");
const cors = require("cors");
const fs = require('fs');
const morgan = require ('morgan');

const app = express();

const serverPort = 4242
// XXXXXXXXXXXXXXXXXXXXXXXXXX Appel fichier JSON XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
const datas = require ('./villainsApi.json');
const { stringify } = require("querystring");
const { log } = require("console");
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXX Middleware XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.use(cors("*"));
app.use(morgan('tiny'));
app.use(express.json());
app.use(express.urlencoded({extended:false}));
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXX Déclaration de la route permettant d'accepter    XXXXXXXXXXXX
// XXXXXXXXXXXXXX les requêtes concernant l'écriture des datas XXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

const fonctionDeTaitementRquete = async (contentToWrite) => {

    // contentToWrite est un paramètre correspondant ici à "requestContent"
    fs.writeFile('villainsApi.json', contentToWrite, (err) =>{
    
        if(err) {
            console.log(err);
        } else {
            console.log("done!!");
        }
    }) 
}

app.post('/write', async (req, res, next) => {
    // récupère le body de la requête (req.body) pour le convertir en string
    const requestContent = JSON.stringify(req.body);
    console.log("salut je suis la ",requestContent);
    await fonctionDeTaitementRquete(requestContent);

    res.json(requestContent)
});

// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXX  Importe tous les profils  XXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

app.get("/", (req, res) => {
 res.status(200).json(datas);

});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "conquer"  XXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get("/occupation/conquer", (req, res) => {
const result = datas.filter(data=> data.occupation === "conquer")
 res.status(200).json(result);
//  console.log(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "escort"  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get("/occupation/escort", (req, res) => {
const result = datas.filter(data=> data.occupation === "escort")
 res.status(200).json(result);
//  console.log(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "birthday"  XXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get("/occupation/birthday", (req, res) => {
const result = datas.filter(data=> data.occupation === "birthday")
 res.status(200).json(result);
//  console.log(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "nanny"  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get("/occupation/nanny", (req, res) => {
const result = datas.filter(data=> data.occupation === "nanny")
 res.status(200).json(result);
//  console.log(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "EVG.JF"  XXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get("/occupation/stag", (req, res) => {
const result = datas.filter(data=> data.occupation === "stag")
 res.status(200).json(result);
//  console.log(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXX  Import "destroy"  XXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.get("/occupation/destroy", (req, res) => {
const result = datas.filter(data=> data.occupation === "destroy")
 res.status(200).json(result);
//  console.log(result);
});
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
app.listen(serverPort,(err) => {
    if(err){
        console.log("ho crap!!");
    } else{
    console.log("http://localhost:4242")
    }
});