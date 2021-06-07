const express = require('express')
const expressGraphql = require('express-graphql').graphqlHTTP
const mongoose = require('mongoose')
const schema = require('./schema/schema')
// const schema = require('./schema/schema2')
const PORT = process.env.PORT || 4000
const cors = require('cors')

mongoose.connect('mongodb+srv://glaxx:Smeg1984@shop-api1.fgv5d.mongodb.net/graphqlDB?retryWrites=true&w=majority?authSourse=yourDB&w=1',
{useUnifiedTopology : true, useNewUrlParser : true, useCreateIndex : true})

mongoose.connection.once('open', ()=>{
    console.log('Connected!!!')
})

const app = express()
app.use(cors())
app.use('/graphql', expressGraphql({
    graphiql : true,
    schema 
}))

app.listen(PORT, ()=>{
    console.log('App listening on 4000')
})
