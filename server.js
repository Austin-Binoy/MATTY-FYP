const express = require('express');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// pull mongo details from db.js
const { saveToMongo, getAttendanceData, deleteFromMongo } = require('./db'); 

const app = express();

// use the public folder files
app.use(express.static('public'));
// limit base64 image size to 10mb, otherwise it can crash
app.use(express.json({ limit: '10mb' }));

//check for the uploads folder otherwise create it. Need a snapshot image to process
if (!fs.existsSync('./uploads')) fs.mkdirSync('./uploads');




// submit button, saves the details into save-student
app.post('/save-student', async (req, res) => {
    try {
        const studentData = {
            // store the name and id accordingly
            studentId: req.body.studentId,
            name: req.body.name,
            timestamp: new Date() 
        };

        // account chooses which collection to save the data into
        const result = await saveToMongo(studentData, req.body.account);
        res.status(200).json(result);
    } catch (err) {
        console.error("Save Error:", err);
        res.status(500).json({ error: "Failed to save to database" });
    }
});




// saves the screenshot and then sends it to python to process.
app.post('/scan', (req, res) => {
    // 1. image converted to base64 and then header is removed
    const imgData = req.body.image.replace(/^data:image\/jpeg;base64,/, "");
    const filePath = path.join(__dirname, 'uploads', 'scan.jpg');
    
    // 2. save the image temporarily into ./uploads so that python can process it
    fs.writeFileSync(filePath, imgData, 'base64');

    // 3. runs the python script 
    const pythonProcess = spawn('python', ['./py_engine/id_scanner_v1.py', filePath]);
    let outputData = "";

    // 4. take the output of the python script and store it into outputData
    pythonProcess.stdout.on('data', (data) => { outputData += data.toString(); });

    // 5. send the output values back into the frontend
    pythonProcess.on('close', () => {
        res.json({ result: outputData.trim() });

        // delete the image from the uploads folder instantly
        fs.unlink(filePath, (err) => {
            if (err) console.error("Cleanup error:", err);
            else console.log(" Scan file deleted for privacy.");
        });
    });
});






// populate the dashboard from mongo db
app.get('/get-data', async (req, res) => {
    try {
        const role = req.query.collection; 
        // make sure that admin will only see admin logs and csc only sees csc logs
        let collectionName = (role && role.toLowerCase() === "admin") ? "Admin" : "CSC_Trial";

        const data = await getAttendanceData(collectionName);
        res.json(data);
    } catch (err) {
        console.error("Fetch Error:", err);
        res.status(500).json({ error: "Failed to fetch data" });
    }
});






// "Right to Erasure." in case if a student requests their data removed
app.delete('/delete-student', async (req, res) => {
    try {
        // delete the id of the log entry instead by student id. if we delete student id, it will delete all logs of that student.
        const { id, collection } = req.body; 
        const result = await deleteFromMongo(id, collection);
        res.status(200).json(result);
    } catch (err) {
        console.error("Delete Error:", err);
        res.status(500).json({ error: "Delete failed" });
    }
});

app.listen(3000, () => console.log('🚀 Server running: http://localhost:3000'));