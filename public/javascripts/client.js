var users = [];

$(document).ready(function(){
    updateUserTable();
    $('#userTable').on('click', 'td a.user', showUserInfo);
    $('#userTable').on('click', 'td a.deleteUser', deleteUser);
});

function updateUserTable() {
    var content = '';
    $.getJSON('/json/list', function(data){
        users = data;
        $.each(data, function(){
            content += '<tr rel="'+ this._id +'">';
            content += '<td><a href="#" class="user">' + this.username + "</td>";
            content += '<td>' + this.email + "</td>";
            content += '<td><a href="#" class="deleteUser">delete</a></td>';
            content += '</tr>';
        });
        $('#userTable tbody').html(content);
    });
}

function showUserInfo(event) {
    event.preventDefault();
    var id = $(this).parents('tr').first().attr('rel');
    var index = users.map(function(item){return item._id}).indexOf(id);
    var user = users[index];
    $("#userInfoName").text(user.username);
    $("#userInfoEmail").text(user.email);
}

function deleteUser(event) {
    event.preventDefault();
    var id = $(this).parents('tr').first().attr('rel');
    console.log();
    $.ajax({
        type: 'DELETE',
        url: '/json/delete/' + id
    }).done(function(response){
        if(response.msg == "") {
            
        }
        else {
            console.log(response.msg);
        }
        updateUserTable();
    });
}