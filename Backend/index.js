const fs = require("fs");
const express = require("express");
const { json } = require("stream/consumers");
const app = express();
let path = __dirname + "/todos.json";

// -------------------------- get --------------------------------------------
app.get("/", (req, res) => {
  fs.readFile(path, { encoding: "utf-8" }, (err, todos) => {
    if (err) {
      return res.status(500).json({ message: "Failed to read file" });
    }

    try {
      todos = todos ? JSON.parse(todos) : [];
      return res.status(200).json({ todos });
    } catch (error) {
      return res.status(500).json({ message: "Invalid JSON format" });
    }
  });
});



// ---------------------------------- post -------------------------------------------------------
app.use(express.json());
app.post("/", (req,res) => {
    try{
        fs.readFile(path, {encoding: "utf-8"}, (err,todos) =>{
            todos = todos ? JSON.parse(todos) : [];
            todos.push({...req.body, isChecked: req.body.isChecked || false,  id: todos.length + 1});
            fs.writeFile(
                path,
                JSON.stringify(todos), 
                {encoding: "utf-8"},
                (err) => {
                    if(err){
                        return res.status(500).json({message: "please try again"});
                    }
                    else{
                        return res
                            .status(201)
                            .json({message: "Todo added/created succesfully"});
                    }
                }
            );
        });
    }
    catch(error){
        return res.status(500).json({message: "please try again"});
    }
})


// -------------------------------- delete  ------------------------------------------------
app.delete("/:id", (req,res) =>{
    try{
        fs.readFile(path, {encoding: "utf-8"}, (err,todos) =>{
            todos = todos ? JSON.parse(todos) : [];
            const filterTodo = todos.filter((todo) => todo.id !== +req.params.id);
            fs.writeFile(
                path,
                JSON.stringify(filterTodo),
                {encoding: "utf-8"},
                (err) => {
                    if(err) {
                        return res.status(500).json({message: "please try again"});
                    }
                    else{
                        return res.status(200).json({message: "Todo delete"});
                    }
                }
            );
            
        });
    }
    catch(error){
        return res.status(500).json({message: "please try again"});
    }
    
})


// --------------------------------- update ----------------------------------
// app.put("/:id", (req,res) =>{
//     try{
//         fs.readFile(path, {encoding: "utf-8"}, (err,todos) =>{
//             todos = todos ? JSON.parse(todos) : [];
//             const updatedtodos = todos.map((todo) => {
//                 if(todo.id === +req.params.id){
//                     return { ...todo, ...req.body }
//                 }
//                 return todo;
//             });
        
//             fs.writeFile(
//                 path,
//                 JSON.stringify(updatedtodos),
//                 {encoding: "utf-8"},
//                 (err) => {
//                     if(err) {
//                         return res.status(500).json({message: "please try again"});
//                     }
//                     else{
//                         return res.status(200).json({message: "Todo updated"});
//                     }
//                 }
//             );
            
//         });
//     }
//     catch(error){
//         return res.status(500).json({message: "please try again"});
//     }
    
// })




// ----------------------------- get by id -------------------------------------------------
app.get("/:id", (req,res) =>{
    try{
        // read file todos.json
        fs.readFile(path, {encoding: "utf-8"}, (err,todos) =>{
            todos = todos ? JSON.parse(todos) : [];
            const todo = todos.find((todo) => todo.id === +req.params.id);
            if(!todo) return res.status(404).json({message:"Todo not found."})
                console.log(todo);
            return res.status(200).json({todos});
        });
    }
    catch(error){
        return res.status(500).json({message: "please try again"});
    }
});


// -------------------------------- update --------------------------------------

app.put("/:id", (req, res) =>{
    try {
        fs.readFile(path, {encoding: "utf-8"}, (err,todos) =>{
            todos = todos ? JSON.parse(todos) : [];
            const index = todos.findIndex((todo) => todo.id == req.params.id);
            todos[index] = {...todos[index], ...req.body};
            console.log("index",index);
            if(index === -1){
                return res.status(404).json({
                    message: "Todo not found."
                });
            }
            fs.writeFile(
                path,
                JSON.stringify(todos),
                { encoding: "utf-8"},
                (err) => {
                    if(err) return res.status(500).json({message: "please try again"});
                    return res.status(200).json({
                        todo: todos[index],
                        message: "todo updated successfully",
                    })
                })
        })
    } catch (error) {
        return res.status(500).json({message: "please try again"});
    }
}) 


app.listen(5000, ()=> {
    console.log("server started")
}) 