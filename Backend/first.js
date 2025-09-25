// -----------------------------------update ---------------------------------------------
// app.put("/:id", (req, res) => {
//     try {
//         fs.readFile(path, { encoding: "utf-8" }, (err, todos) => {
//             if (err) {
//                 return res.status(500).json({ message: "please try again" });
//             }

//             todos = todos ? JSON.parse(todos) : [];

//             let updated = false;
//             const updatedTodos = todos.map((todo) => {
//                 if (todo.id === +req.params.id) {
//                     updated = true;
//                     return { ...todo, ...req.body }; // merge old + new data
//                 }
//                 return todo;
//             });

//             if (!updated) {
//                 return res.status(404).json({ message: "Todo not found" });
//             }

//             fs.writeFile(
//                 path,
//                 JSON.stringify(updatedTodos, null, 2),
//                 { encoding: "utf-8" },
//                 (err) => {
//                     if (err) {
//                         return res.status(500).json({ message: "please try again" });
//                     } else {
//                         return res.status(200).json({ message: "Todo updated" });
//                     }
//                 }
//             );
//         });
//     } catch (error) {
//         return res.status(500).json({ message: "please try again" });
//     }
// });