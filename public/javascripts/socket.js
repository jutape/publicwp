$(() => {
  var socket = io();
  var people = prompt("digite seu nick");

  socket.emit("user connect", people);

  $(".conversation-compose").submit(e => {
    e.preventDefault(); // prevents page reloading
    socket.emit("chat message", $("#m").val(), people);
    $("#m").val("");
    return false;
  });

  socket.on("user connect", (people, users) => {
    let newUser = $("<div>");
    newUser.addClass("info");
    newUser.text(`${people} se conectou`);
    addToStatus(users);
    $(".conversation-container").append(newUser);
  });

  socket.on("disconnect", (people, users) => {
    let deleteUser = $("<div>");
    deleteUser.addClass("info");
    deleteUser.text(`${people} se desconectou`);
    addToStatus(users);
    $(".conversation-container").append(deleteUser);
  });

  socket.on("chat message", (msg, pessoa) => {
    let message = $("<div>");
    message.addClass("message");
    message.text(msg);
    if (pessoa === people) {
      message.addClass("sent");
    } else {
      message.addClass("received");
      let contato = $("<p>");
      contato.addClass("contact");
      contato.text(people);
      message.prepend(contato);
    }
    $(".conversation-container").append(message);
  });

  const addToStatus = users => {
    if (Array.isArray(users)) {
      $(".status").text(users.join(", "));
    }
  };
});
