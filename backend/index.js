const express = require('express');
const path = require('path');
const cors = require('cors');


const port = 8000;

const connectToMongo = require('./config/mongoose');
const Notes = require('./models/keeperSchema');
connectToMongo();
// const notes = require('./models/notes');
const app = express();

app.use(express.urlencoded());
app.use(express.json());
app.use(cors());

app.get("/api/getAll",(req,res)=>{
    Notes.find({} , (err, NotesList) => {
        if (err) { console.log(err,"Error in getAll"); }
        else {
            res.status(200).send(NotesList);
        }
    })
    
    // res.send("backend Connected");
});
app.post("/api/addNew",(req,res)=>{
    console.log(req.body);
    const { title, description } = req.body
    const notesObj = new Notes({
        title: title,
        description: description
    });

    notesObj.save(err => {
        if (err) {
            console.log(err,"Something wrong in saving notes")
        }
        Notes.find({}, (err, NotesList) => {
            if (err) { console.log(err); }
            else {
                res.status(200).send(NotesList);
            }
        })
    })

    
});
app.post("/api/delete",(req,res)=>{
    const { id } = req.body;
    Notes.deleteOne({ _id: id },() => {
        console.log('deleted');
        Notes.find({}, (err, NotesList) => {
            if (err) { console.log(err); }
            else {
                res.status(200).send(NotesList);
            }
        })
    })
    
});
app.put("/api/update/:id",async (req, res) => {
   try {
    const { title, description } = req.body;
    const newNote = {};
    if (title) {
        newNote.title = title;
    } if(description){
        newNote.description = description;
    
    }
       let note = Notes.findById(req.params.id);
       if (!note) {
           return res.status(404).send(res, "Not found");
       }
       note = await Notes.findByIdAndUpdate(
        req.params.id,
        { $set: newNote },
        { new: true }
       );
       res.json({ note });
   } catch (error) {
       console.log(error.message);
       res.status(500).send(error.message);
   }
     
})
app.listen(8000,()=>{
    console.log("Backend created at port 8000")
})

