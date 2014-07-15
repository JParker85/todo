// Model for the field that will be create the todo list for the app

var Todo = Backbone.Model.extend({
  defaults: function() {
    return {
    task: 'What do you need to do?'
    }
  },
  urlRoot:'http://tiny-pizza-server.herokuapp.com/collections/big',
  idAttribute: '_id'
});


var TodoList = Backbone.Collection.extend({
    model: Todo,
    url:'http://tiny-pizza-server.herokuapp.com/collections/big'
  });


var todoList = new TodoList();
todoList.fetch();



var TodoView = Backbone.View.extend({
  className : 'todo_list',

  initialize: function(){
      console.log("What's your Big Todo?");
      // 4 Listens for the event of add in the todoView
      //http://backbonejs.org/#Events-listenTo
      this.listenTo(this.collection, 'add', this.render);
      this.collection.fetch();
    },

    render: function(){
      //5 Identifing the HTML source for the template
      var source = $('#todo_template').html();
      //6 compiling to the template
      var template = Handlebars.compile(source);
      //7 rendering tthe template to the HTML
      var rendered = template({todoList: this.collection.toJSON()});
      this.$el.html(rendered);
      return this;
  }

});

var todoView = new TodoView ({
  collection: todoList
});


$(document).ready(function() {
    $('.todo_list').append(todoView.render().$el);
    // 1. Wait for the submit button is presedded
    $('#add_task').submit(function(event){
        var todo = new Todo(),
          $newTask = $('#new_task');
        // 2 Set and save the task in the todo on the server
        todo.set('task', $newTask.val());
        todo.save();
        // 3 add it to the list
        todoList.add(todo);
        $newTask.val('');
        event.preventDefault();

      });

    $('.todo_list').on('click','.removeTask',function() {
      var $this = $(this),
        id = $this.data('id'),
        todo = todoList.get(id);

      $this.parent().remove();

      todo.destroy();
    });


 })



























 
