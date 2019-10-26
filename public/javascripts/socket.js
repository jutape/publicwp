$(() => {
  const socket = io();
  let people;

  const tailScroll = () => {
    var height = $(".conversation-container").get(0).scrollHeight;
    $(".conversation-container").animate(
      {
        scrollTop: height
      },
      500
    );
  };

  const addToStatus = users => {
    if (Array.isArray(users)) {
      $(".status").text(users.join(", "));
      $(".status").attr("title", users.join(", "));
    }
  };

  const login = () => {
    let nick = prompt("Digite seu nome de usuario:");
    socket.emit("user connect", nick, (aprove, message) => {
      if (!aprove && message) {
        alert(message);
        login();
      } else {
        people = nick;
      }
    });
  };

  login();

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
    tailScroll();
  });

  socket.on("disconnect", (people, users) => {
    let deleteUser = $("<div>");
    deleteUser.addClass("info");
    deleteUser.text(`${people} se desconectou`);
    addToStatus(users);
    $(".conversation-container").append(deleteUser);
    tailScroll();
  });

  socket.on("chat message", (msg, pessoa, color) => {
    let message = $("<div>");
    message.addClass("message");
    message.text(msg);
    if (pessoa === people) {
      message.addClass("sent");
    } else {
      message.addClass("received");
      let contato = $("<p>");
      contato.addClass("contact");
      contato.css({color})
      contato.text(pessoa);
      message.prepend(contato);
    }
    $(".conversation-container").append(message);
    tailScroll();
  });
});
