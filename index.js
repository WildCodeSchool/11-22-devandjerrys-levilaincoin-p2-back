const express = require("express");
const cors = require("cors");
const fs = require('fs');
const morgan = require('morgan');

const app = express();
const serverPort = 4242

//XXXXXXXXXXXXXXXXXXXX  AJOUT DES CONST POUR LA GOOGLE AUTH (EN PLUS DE CELLES DEJA PRESENTES) XXXXXXXXXXXX
require("dotenv/config");
const { OAuth2Client } = require("google-auth-library");
const jwt = require("jsonwebtoken");

let DB = [];

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
app.post('/write/customers', async (req, res, next) => {
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
    const identification = parseInt(req.params.id,16)
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

//XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX GOOGLE AUTH XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
// XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

/**
 *  This function is used verify a google account
 */
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

async function verifyGoogleToken(token) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: "Invalid user detected. Please try again" };
  }
}
app.post("/signup", async (req, res) => {
    try {
      // console.log({ verified: verifyGoogleToken(req.body.credential) });
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
  
        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }
  
        const profile = verificationResponse?.payload;
  
        DB.push(profile);
  
        res.status(201).json({
          message: "Signup was successful",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            token: jwt.sign({ email: profile?.email }, "myScret", {
              expiresIn: "1d",
            }),
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        message: "An error occurred. Registration failed.",
      });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      if (req.body.credential) {
        const verificationResponse = await verifyGoogleToken(req.body.credential);
        if (verificationResponse.error) {
          return res.status(400).json({
            message: verificationResponse.error,
          });
        }
  
        const profile = verificationResponse?.payload;
  
        const existsInDB = DB.find((person) => person?.email === profile?.email);
  
        if (!existsInDB) {
          return res.status(400).json({
            message: "You are not registered. Please sign up",
          });
        }
  
        res.status(201).json({
          message: "Login was successful",
          user: {
            firstName: profile?.given_name,
            lastName: profile?.family_name,
            picture: profile?.picture,
            email: profile?.email,
            token: jwt.sign({ email: profile?.email }, process.env.JWT_SECRET, {
              expiresIn: "1d",
            }),
          },
        });
      }
    } catch (error) {
      res.status(500).json({
        message: error?.message || error,
      });
    }
  });