export default ()=>{
    return{
       db:{
           uri:process.env.MONGO_URL
       },
       jwt:{
           secret:process.env.JWT_SECRET,
           expiry:process.env.JWT_EXPIRY
       },
       redis:{
            host:process.env.REDIS_HOST,
            port:process.env.REDIS_PORT,
            ttl:process.env.REDIS_TTL
       }
    }
   }