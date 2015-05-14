$(function(){
   
    var Todo = Backbone.Model.extend({
        defaults: function(){
            return {
                done: false,
                text: "empty todo",
                order: todos.nextOrder()
            };
        },
    });
    
    var TodoList = Backbone.Collection.extend({
        model: Todo,
        
        localStorage: new Backbone.LocalStorage("todos"),
        
        done: function() {
            return this.where({done: true});
        },
        
        remaining: function() {
            return this.where({done: false});
        },
        
        nextOrder: function(){
            if (!this.length) return 1;
            return this.last().get("order") + 1;
        },
        
        comparator: 'order'
    });
    
    var todos = new TodoList;
    
    
    var TodoView = Backbone.View.extend({
        initialize: function(){
        },
        
        tagName: 'li',
        
        template: _.template($('#todo-template').html()),
        
        events: {
            'click .toggle': 'toggleDone',
            'dbclick .view': 'edit',
            'keypress .edit': 'checkEnter',
            'click .remove': 'remove'
        },
        
        render: function(){
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },
        
        edit: function(){
            this.$el.addClass('editing');
            this.input.focus();
        },
        
        remove: function(){
            this.model.destroy();
        },
        
        checkEnter: function(event){
            console.log(event);
            if (event.keyCode == 13) {
                this.close();
            }
        },
        
        close: function(){
            var val = this.input.val();
            if(!val) {
                this.remove();
            }
            else {
                this.$el.removeClass('editing');
                this.model.save({text:val});
            }
            
        },
    });
    
    var AppView = Backbone.View.extend({
        
        el: $('#app'),
        
        events: {
            'keypress #new-todo': 'checkEnter'
        },
        
        initialize: function(){
            this.input = this.$('#new-todo');
            
            this.listenTo(todos, 'add', this.addOne);
        },
        
        addOne: function(todo){
            var view = new TodoView({model:todo});
            this.$('ul').append(view.render().el);
        },
        
        checkEnter: function(e){
            if(e.keyCode != 13) return;
            var val = this.input.val();
            if(!val) return;
            
            todos.create({text:val});
            this.input.val('');
        }
    });
    
    var app = new AppView;
});
