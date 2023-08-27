import mongoose from "mongoose";

import ENV from '../config.js'

export async function connection() {
    try {
        await mongoose.connect(ENV.ATLAS_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        console.log('Error in Connecting To Database');
    }
}




// import { MongoMemoryServer } from "mongodb-memory-server";

// async function connect() {

//     const mongod = await MongoMemoryServer.create();
//     const getUri = mongod.getUri();

//     mongoose.set('strictQuery', true)
//     // const db = await mongoose.connect(getUri);
//     const db = await mongoose.connect(ENV.ATLAS_URI);
//     console.log("Database Connected")
//     return db;
// }

// export default connect;