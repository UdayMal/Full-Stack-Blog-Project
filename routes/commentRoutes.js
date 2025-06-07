const express = require("express");
const commentRoutes = express.Router(); 
const { ensureAuthenticated } = require("../middlewares/auth");
const { addComment, getCommentForm, updateComment, deleteComment } = require('../controllers/commentController');

// add comment 
commentRoutes.post("/posts/:id/comments", ensureAuthenticated, addComment);
//get comment form
commentRoutes.get("/comments/:id/edit", ensureAuthenticated, getCommentForm);
// update comment 
commentRoutes.put("/comments/:id", ensureAuthenticated, updateComment);

// delete comment
commentRoutes.delete("/comments/:id", ensureAuthenticated, deleteComment);  
module.exports = commentRoutes;