
var uniqueId = function() {
    var date = Date.now();
    var random = Math.random() * Math.random();

    return Math.floor(date * random).toString();
};

var theMessage = function(text, name, value) {
    return {
        user: name,
        message: text,
        id: value
    };
};

var appState = {
    mainUrl: 'http://localhost:999/chat',
    messageList:[],
    token: 'TE11EN'
};

function storeMessages(sendMessage, continueWith) {
     post(appState.mainUrl, JSON.stringify(sendMessage), function () {
        updateMessages();
    });
}

function restoreMessages(continueWith) {
    var url = appState.mainUrl + '?token=' + appState.token;

    get(url, function (responseText) {
        console.assert(responseText != null);
        var response = JSON.parse(responseText).messages;
        createAllTasks(response);

        continueWith && continueWith();
    });
}

function createAllTasks(allTasks) {
    for(var i = 0; i < allTasks.length; i++){
        addAllMessages(allTasks[i]);
    }
}

function addAllMessages(message) {
    if (appState.messageList[message.id] == null) {
        task = message;
        messageDiv = $('.exampleMessage').first().clone();
        messageDiv.find('.nick').html(task.user + ":");
        messageDiv.find('.message').html(task.message);
        messageDiv.attr('message-id', task.id);
        $('#showMessage').append(messageDiv.show());
        appState.messageList.push(message);
    }
}

function restoreName(){
    if(typeof(Storage) == "undefined") {
        alert('localStorage is not accessible');
        return;
    }

    var item = localStorage.getItem("Chat userName");


    $('#messageArea').attr('disabled', false);
    $('#send').attr('disabled', false);

    return item && JSON.parse(item);
}

function updateMessages(continueWith) {
    var url = appState.mainUrl + '?token=' + appState.token;

    get(url, function (responseText) {
        console.assert(responseText != null);
        var response = JSON.parse(responseText).messages;
        for (var i = 0; i < response.length; i++) {
            addAllMessages(response[i]);
        }
        continueWith && continueWith();
    });
    setTimeout(updateMessages, 1000);
}


$(document).ready(function () {

    $userName = $('h4.currentName');
    $inputChange = $('#changeName');

    restoreMessages();
    $userName.html(restoreName() || "Имя пользователя");

    //enter in chat
    $('#submitUser').click(function () {    
        if ($('#userLogin').val() != "") {
            userName = $('#userLogin').val();
            $userName.html(userName);
            $('#userLogin').val('');
            $('#messageArea').attr('disabled', false);
            $('#send').attr('disabled', false);

            localStorage.setItem("Chat userName", JSON.stringify($userName.html()));
        };
    })

    //change name
    $('#changeCurrentName').click(function () {
        name = $userName.html();
        $userName.hide();
        $inputChange.attr('disabled', false);
        $inputChange.val(name);
        $inputChange.show();
        $(this).hide();
        $('#saveCurrentName').show();
    })

    // save change name
    $('#saveCurrentName').click(function () {
        name = $inputChange.val();
        if (name != "") {
        $inputChange.attr('disabled', true);
        $inputChange.hide();
        $userName.html(name);
        $(this).hide();
        $('#changeCurrentName').show()
        $userName.show();

        localStorage.setItem("Chat userName", JSON.stringify($userName.html()));
        };
    })

    //send message
    $('#send').click(function () {

        message = $('#messageArea').val();
        if (message != "") {
            task = theMessage(message,$userName.html(),appState.messageList.length);
            storeMessages(task,
             function () {
                appState.messageList.push(task);
                messageDiv = $('.exampleMessage').first().clone();
                messageDiv.find('.nick').html($userName.html() + ":");
                messageDiv.find('.message').html(message);
                messageDiv.attr('message-id', uniqueId());
                $('#showMessage').append(messageDiv.show());
                $('#messageArea').val('');
            });
            $('#messageArea').val('');
        };
    })
})

function get(url, continueWith, continueWithError) {
    ajax('GET', url, null, continueWith, continueWithError);
}
function post(url, data, continueWith, continueWithError) {
    ajax('POST', url, data, continueWith, continueWithError);
}

function isError(text) {
    if (text == "")
        return false;

    try {
        var obj = JSON.parse(text);
    } catch (ex) {
        return true;
    }

    return !!obj.error;
}
function ajax(method, url, data, continueWith, continueWithError) {
    var xhr = new XMLHttpRequest();

    continueWithError = continueWithError;
    xhr.open(method || 'GET', url, true);

    xhr.onload = function () {
        if (xhr.readyState != 4)
            return;

        if (xhr.status != 200) {
            continueWithError('Error on the server side, response ' + xhr.status);
            return;
        }

        if (isError(xhr.responseText)) {
            continueWithError('Error on the server side, response ' + xhr.responseText);
            return;
        }

        continueWith(xhr.responseText);
    };

    xhr.ontimeout = function () {
        continueWithError('Server timed out !');
    }

    xhr.onerror = function (e) {
        var errMsg = 'Server connection error !\n' +
        '\n' +
        'Check if \n' +
        '- server is active\n' +
        '- server sends header "Access-Control-Allow-Origin:*"';

        continueWithError(errMsg);
    };

    xhr.send(data);
}
