$(function(){
   
    var Book = Backbone.Model.extend({
        defaults: {
            id: '',
            name: ''
        },
        
        initialize: function(){
            this.on('invalid', function(model, error){
                console.log(error);
            })
        },
        
        validate: function(model) {
            return "";
            if (model.id <= 0) {
                return 'Invalid id: ' + model.id;
            }
        },
        
        urlRoot: 'http://localhost:3000/test'
    });
    
    var book1 = new Book({name:"喀秋莎"});
    book1.save({}, {
        success: function(model){
            console.log(model);
            
            var book2 = new Book({id:model.get('id')});
            book2.fetch({
                success: function(model){
                    console.log(model);
                    
                    book2.destroy();
                },
                fail: function(e){
                    console.log(e);
                }
            });
        },
        fail: function(e){
            console.log(e);
        }
    });
});
