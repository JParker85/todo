// Model for the field that will be create the todo list for the app

var Todo = Backbone.Model.extend({
  defaults: function() {
    return {
    task: 'What do you need to do?'
  };
},

  urlRoot:'http://tiny-pizza-server.herokuapp.com/collections/big',

  idAttribute: '_id'
});


var TodoList = Backbone.Collection.extend({
    model: Todo,
    url:'http://tiny-pizza-server.herokuapp.com/collections/big',
    // comparator: -'_id'
    // this is a completely ridiculously way to force a sort that returns the latest submission first; converts _id from hexadecimal to decimal and sorts by negative, so higher _id values are shown first; since no _id has yet been generated for the new item, force a very large negative number to be returned
    comparator : function (model) {
      var pseudoID;
      if (model.get('_id') == undefined) {
        pseudoID = -9.5923158918808516e+28;
        console.log('here');
      }
      else {
        pseudoID = -(parseInt((model.get('_id')), 16));
      }
      console.log(pseudoID);
      return pseudoID;
    }
  });


var todoList = new TodoList();
todoList.fetch();



var TodoView = Backbone.View.extend({
  className : 'todo_list',

  initialize: function(){
      console.log("What's your Big Todo?");
      this.listenTo(this.collection, 'add', this.render);
      this.collection.fetch();
    },

    render: function(){
      var source = $('#todo_template').html();
      var template = Handlebars.compile(source);
      var rendered = template({todoView: this.collection.toJSON()});
      this.$el.html(rendered);
      return this;
  }

});

var todoView = new TodoView ({
  collection: todoList
});


$(document).ready(function() {
    $('.todo_list').append(todoView.render().$el);
    $('#add_task').submit(function(ev){
        var todo = new Todo({summary: $('#new_task').val()});
        todo.save(null, {wait: true});
        todoView.add(todo);
        return false;
      });
 })
