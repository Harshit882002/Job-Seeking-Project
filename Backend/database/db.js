import mongoose from "mongoose";

export const db = () => {
    mongoose.connect(process.env.MONGO_URI, {
        dbName: "MERN_STACK_JOB_SEEKING"
    }).then(() => {
        console.log("DataBase Connected Successfully !")
    }).catch((err) => {
        console.log(`Some error occured while connecting to DataBase : ${err}`);
    });
}