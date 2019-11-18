//Import
//const [variavel] = require(---//----)

//DotEnv Armazena variaveis genericas do sistema
const dotenv = require('dotenv')
dotenv.config()

//Express e middleware
const express = require('express')
//Instanciando
const app = express()

//Morgan e o feedbback das requisicoes recebidas
const morgan = require('morgan')

//Verific dados e trata dados
const bodyParser = require('body-parser')

const cors = require('cors')

//Database verifica se o banco esta conectado
//Contrainsts verifica se o objeto esta entrando de forma valida
//Error todos os erros do sistema
const { databaseMidleware, constraintsMiddleware, errorMiddleware } = require('./utils/middlewares')

app.use(morgan('dev'))

//Limitando entrada de dados
app.use(bodyParser.json({ limit: '50mb' })) //limite de tamanho
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }))

let corsOption = {
  origin: "*",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  preflightContinue: false,
  optionsSuccessStatus: 204
}

app.use(cors(corsOption))
app.options('*', cors())

app.use(databaseMidleware)

app.use(constraintsMiddleware)

//Rotas de requisicao
app.use(require('./routes'))

app.use(errorMiddleware)

//Setando porta
app.listen(process.env.PORT)
console.log('Server running... port: ' + process.env.PORT)
