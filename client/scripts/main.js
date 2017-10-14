"use strict";
var Babble;

Babble = {
    ////register////
    register: function register(x) {
        var name, email;
        
        if (x == 0) {
            name = document.getElementById('reg_Name').value;
            email = document.getElementById('reg_Email').value;
        } else if (x == 1) {
            name = '';
            email = '';
        }
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                stop_modal();
                var temp_s = JSON.parse(xhr.responseText);
                var babble = {
                    currentMessage: "0",
                    userInfo: {
                        name: temp_s.name,
                        email: temp_s.email
                    }
                };
                temp_s = JSON.stringify(babble);
                saveStuff(temp_s);
                check_local();
                Babble.getMessages();
                Babble.getStats();
                console.log("register complete");
            }
        };
        xhr.timeout = 120000;
        xhr.open("POST", "http://localhost:9000/register", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var user = {
            "name": name,
            "email": email
        };
        xhr.send(JSON.stringify(user));
        xhr.ontimeout = function () {
            console.log("timout");
        };
    },
    ////register_1////
    register_1: function register_1() {
        var name, email;
        stop_modal();
        var babble = JSON.parse(loadStuff());
        name = babble.userInfo.name;
        email = babble.userInfo.email;

        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                Babble.getMessages();
                Babble.getStats();
                console.log("register complete");
            }
        };
        xhr.timeout = 120000;
        xhr.open("POST", "http://localhost:9000/register", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        var user = {
            "name": name,
            "email": email
        };
        xhr.send(JSON.stringify(user));
        xhr.ontimeout = function () {
            console.log("timout");
        };
    },
    ////logout////
    logout: function logout() {
        if ((JSON.stringify(loadStuff())) != "null") {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("user is out");
                }
            };
            xhr.timeout = 120000;
            xhr.open("DELETE", "http://localhost:9000/logOut", true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            console.log("user is almost out");
            xhr.send(JSON.stringify(loadStuff().userInfo));
            xhr.ontimeout = function () {
                console.log("timout");
            };
        }
    },
    ////getMessages////
    getMessages: function getMessages(counter, callback) {
        var last_id = 0;
        var babble1 = JSON.parse(loadStuff());
        if ((babble1 != "null") && (typeof babble1 != undefined) && (typeof tcounter != undefined)) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(2);
                    var babble = JSON.parse(loadStuff());
                    if ((this.responseText != "") && (this.responseText != "[]") && (this.responseText != '"[]"')) {
                        var messages_d = JSON.parse(this.responseText);
                        var id;
                        if ((typeof messages_d) === "string")
                            messages_d = JSON.parse(messages_d);
                        if (Array.isArray(messages_d)) {
                            if (messages_d.length > 0)
                                id = messages_d[messages_d.length - 1].id;
                        } else {
                            id = messages_d.id;
                        }
                        if (babble.currentMessage != id) {
                            babble.currentMessage = id;
                            var toJson = JSON.stringify(babble);
                            saveStuff(toJson);
                            check_local();
                            create_messages_list(messages_d);
                            console.log("get messages complete");
                        }

                        Babble.getMessages();
                    }
                }
            };
            xhr.timeout = 120000;
            last_id = babble1.currentMessage;
            xhr.open("GET", "http://localhost:9000/messages" + "?counter=" + last_id, true);
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.send();
            xhr.ontimeout = function () {
                Babble.getMessages();
            };
        }
    },
    ////postMessages////
    postMessage: function postMessage(message, callback) {
        var babble = JSON.parse(loadStuff());
        var name_d = babble.userInfo.name;
        var email_d = babble.userInfo.email;
        var _message = document.getElementById("mes").value;
        var data = {
            user: name_d,
            email: email_d,
            message: _message
        };
        var myJson = JSON.stringify(data);
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("add message complete");
                Babble.getStats();
                Babble.getMessages();
            }
        };
        xhr.timeout = 120000;
        xhr.open("POST", "http://localhost:9000/messages", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send(myJson);
        console.log("mes sent for adding");
        xhr.ontimeout = function () {
            Babble.getMessages();
        };
    },
    ////deleteMessage////
    deleteMessage: function deleteMessage(id, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                Babble.remove(id);
                Babble.getStats();
                console.log("delete message complete");
            }
        };
        xhr.timeout = 120000;
        xhr.open("delete", "http://localhost:9000/messages/" + id, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
        console.log("mes s to del");
        xhr.ontimeout = function () {
            Babble.getStats();
        };
    },

    remove: function remove(x) {
        var elem = document.getElementById("li_" + x);
        return elem.parentNode.removeChild(elem);
    },
    ////getStats////
    getStats: function getStats(callback) {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                if (this.responseText != "") {
                    var stat_d = JSON.parse(this.responseText);
                    var m_counter, u_counter;
                    m_counter = stat_d.messages;
                    u_counter = stat_d.users;
                    document.getElementsByClassName('user_c')[0].innerHTML = u_counter;
                    document.getElementsByClassName('message_c')[0].innerHTML = m_counter;
                    console.log("get stats complete");
                }
                Babble.getStats();
            }
        };
        xhr.timeout = 120000;
        xhr.open("GET", "http://localhost:9000/stats", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.send();
        xhr.ontimeout = function () {
            Babble.getStats();
        };
    }
};



///////////logout
window.onbeforeunload = Babble.logout();
//////////login
window.onload = function () {
    if (localStorage.getItem('babble')) {
        var babble = JSON.parse(loadStuff());
        babble.currentMessage = "0";
        var toJson = JSON.stringify(babble);
        saveStuff(toJson);
        check_local();
        console.log("01");
        Babble.getMessages();
        console.log("02");
        Babble.getStats();
        console.log("03");
        Babble.register_1();
        console.log("04");
    } else {
        start_modal();
    }
};

/////////textarea
makeGrowable(document.querySelector('.js-growable'));

function makeGrowable(container) {
    var area = container.querySelector('textarea');
    var clone = container.querySelector('span');
    area.addEventListener('input', function (e) {
        clone.textContent = area.value;
    });
}
///////modal
function start_modal() {
    document.getElementById('myModal').style.display = "block";
}

function stop_modal() {
    document.getElementById('myModal').style.display = "none";
}
////////////Localstorage
function saveStuff(local_info) {
    var local1 = JSON.parse(local_info);
    var user_Info = (local1.userInfo);
    var name_ = user_Info.name;
    var email_ = user_Info.email;
    var current_temp = local1.currentMessage;
    var babble = {
        currentMessage: current_temp + "",
        userInfo: {
            name: name_ + "",
            email: email_ + ""
        }
    };
    console.log('13');
    localStorage.setItem("babble", JSON.stringify(babble));
}

function check_local() {
    var local = JSON.parse(loadStuff());
    if (local.currentMessage == "undefined") {
        console.log("sadas");
    }
}

function loadStuff() {
    return localStorage.getItem("babble");
}
////////////create list of messages
function add_message_to_list(temp_message) {
    var t, y, b, temp_message_1;
    if ((typeof temp_message) === "string")
        temp_message_1 = JSON.parse(temp_message);
    else
        temp_message_1 = temp_message;
    if (Array.isArray(temp_message_1)) {
        y = document.createElement("LI");
        y.setAttribute("id", "li_" + temp_message_1[0].id);
        t = document.createTextNode(temp_message_1[0].message.message);
        b = document.createElement("button");
        b.setAttribute("class", "bt_n");
        b.setAttribute("id", temp_message_1[0].id);
        b.setAttribute("onclick", "Babble.deleteMessage()");
    } else {
        y = document.createElement("LI");
        y.setAttribute("id", "li_" + temp_message_1.id);
        t = document.createTextNode(temp_message_1.message.message);
        b = document.createElement("button");
        b.setAttribute("class", "bt_n");
        b.setAttribute("id", temp_message_1.id);
        b.setAttribute("onclick", "Babble.deleteMessage(" + temp_message_1.id + ")");
    }
    var x = document.createTextNode("x");
    b.appendChild(x);
    y.appendChild(b);
    y.appendChild(t);
    document.getElementById("myOl").appendChild(y);
}

function create_messages_list(mesagges_) {
    if (Array.isArray(mesagges_)) {
        for (var i = 0; i < mesagges_.length; i++) {
            add_message_to_list(mesagges_[i]);
        }
    } else {
        add_message_to_list(mesagges_);
    }

}

