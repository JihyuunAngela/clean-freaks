const User = require("../models/User");
const Todo = require("../models/Todo");

module.exports = {
  getAdd: async (req, res) => {
    try {
      if (!req.user) {
        res.redirect("/login")
      } else {
        res.render("add.ejs", {user: req.user});
      }
    } catch (err) {
      console.log(err);
    }
  },
  createTodo: async (req, res) => {
    try {
        console.log(req.body)
        await Todo.create( {
            todoItem: req.body.todoItem,
            cleaningArea: req.body.cleaningArea,
            dueDate: req.body.dueDate,
            comment: req.body.comment,
            completed: false,
            user: req.user.id,
        } );
        console.log("Task has been added!");
        res.redirect("/");
    } catch (err) {
    console.log(err);
    }
  },
  editTodoPage: async (req, res) => {
    try {
      const todo = await Todo.findById(req.params.id).lean()
      if ( !todo ) {
        return res.render("error/404")
      }

      if (todo.user != req.user.id) {
        res.redirect(`/`)
      } else {
        res.render("edit.ejs", {todo: todo, user: req.user} );
      }
    } catch (err) {
      console.log(err);
    }
  },
  editTodo: async (req, res) => {
    try {

      const todo = await Todo.findById(req.params.id).lean()
      if ( !todo ) {
        return res.render("error/404")
      }

      if (todo.user != req.user.id) {
        res.redirect(`/`)
      } else {
        await Todo.findOneAndUpdate( // mongoose method
        { _id: req.params.id }, // find id
        req.body, // req what to replace
        );
      console.log("Post edited");
      res.redirect(`/`); // redirect 
      }
    } catch (err) {
    console.log(err);
    }
  },
  deleteTodo: async (req, res) => {
      try {           
          await Todo.deleteOne( {_id: req.body.itemFromJS, user: req.user._id} )
          res.json('Todo Deleted')
          console.log('Deleted todo item')
      } catch (err) {
        console.log(err);
      }
  },
  markComplete: async (req, res) => {
      try {
        await Todo.updateOne({_id: req.body.itemFromJS},{
            $set: {
                completed: true
              }
        },{
            sort: {_id: -1},
            upsert: false
        })
            console.log('Marked Complete')
            res.json('Marked Complete')
      } catch (err) {
        console.log(err);
      }
  },
  markUncomplete: async (req, res) => {
      try {
        await Todo.updateOne({_id: req.body.itemFromJS},{
            $set: {
                completed: false
              }
        },{
            sort: {_id: -1},
            upsert: false
        })
            console.log('Marked Complete')
            res.json('Marked Complete')
      } catch (err) {
        console.log(err);
      }
  },
  getCleaningArea: async(req, res) => {
    try {
      let todos = await Todo.find( {cleaningArea: req.params.area, user: req.user} )
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      let today  = new Date();
      let day = String(today.getDate()).padStart( 2, '0')
      let month = String(today.getMonth() + 1).padStart( 2, '0')
      let year = today.getFullYear();
      let todayDate = `${year}-${month}-${day}`;

      let due = await Todo.find( {
        cleaningArea: req.params.area, 
        user: req.user, 
        dueDate: todayDate,
      })

      let futureDate = await Todo.find( {
        cleaningArea: req.params.area, 
        user: req.user,
        dueDate: {$gt: todayDate},
      } ).sort({dueDate: 1})

      res.render("cleaningArea.ejs", {
        todos: todos, 
        user: req.user, 
        area: req.params.area, 
        due: due, 
        date: today.toLocaleDateString("en-US", options),
        futureDate: futureDate,
      })
    } catch {
      console.log(err)
    }
  },
}