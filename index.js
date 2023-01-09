const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const serverPort = 4242

const app = express()

app.use(morgan('tiny'))
app.use(cors('*'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.get('/', (req, res) => {
  console.log('une nouvelle requête est arrivée dans l’API !  ')
  res.json('je suis dans le /')
})

app.listen(serverPort, () => console.log('http://localhost:4242'))
