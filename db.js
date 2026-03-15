require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb'); //objectid

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// existing function
async function saveToMongo(studentData, accountType) {
    try {
        await client.connect();
        const database = client.db("FYP_DataBase");
        const collectionName = (accountType === "admin") ? "Admin" : "CSC_Trial";
        const collection = database.collection(collectionName);
        return await collection.insertOne({
            ...studentData,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Save Error:", error);
        throw error;
    }
}



// fetch Data
async function getAttendanceData(collectionName) {
    try {
        await client.connect();
        const database = client.db("FYP_DataBase");
        return await database.collection(collectionName)
            .find()
            .sort({ timestamp: -1 }) 
            .toArray();
    } catch (error) {
        console.error("Fetch Error:", error);
        throw error;
    }
}



// delete Data using the data id, not student id
async function deleteFromMongo(recordId, accountType) {
    try {
        await client.connect();
        const database = client.db("FYP_DataBase");
        // map the account type to the correct collection
        const collectionName = (accountType === "admin") ? "Admin" : "CSC_Trial";
        const collection = database.collection(collectionName);
        
        const result = await collection.deleteOne({ _id: new ObjectId(recordId) });
        return result;
    } catch (error) {
        console.error("Delete Error:", error);
        throw error;
    }
}

module.exports = { saveToMongo, getAttendanceData, deleteFromMongo };