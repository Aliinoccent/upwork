
const router=require('./routers/index')
const {server,app,express} =require( "./socket/socket")
const pool =require('./config/db');
const allTables =require('./models/index')
const cors=require("cors")

app.use(express.json())
app.use(cors({
  origin: 'http://127.0.0.1:5500', 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
}));



allTables();
app.use('/',router)


server.listen(3000)
