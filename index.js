let express=require('express')
let cors=require('cors')
let app=express()
let port=process.env.PORT || 3000
// middleware 
app.use(cors())
app.use(express.json())

app.get('/', (req,res)=>{
    res.send('coffee making server is running')
})
app.listen(port,()=>{
    console.log(`Coffee Server is running on port:${port}`)
})