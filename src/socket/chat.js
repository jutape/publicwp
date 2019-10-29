const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const usersArray = [];

module.exports = (io) => (socket) => {
  socket.on('user connect', (people, callback) => {
    if (usersArray.indexOf(people) != -1) {
      callback(false, 'Nome de usuario já em uso!');
    } else {
      if (people && people.length >= 4) {
        callback(true, undefined);
        socket.nickname = people;
        socket.color = getRandomColor();
        usersArray.push(socket.nickname);
        io.emit('user connect', socket.nickname, usersArray);
      } else {
        callback(false, 'Nome do usuario invalido! minimo de 4 caracteres.');
      }
    }
  });

  socket.on('chat message', (msg) => {
    io.emit('chat message', msg, socket.nickname, socket.color);
  });

  socket.on('disconnect', () => {
    const index = usersArray.indexOf(socket.nickname);
    if (index > -1) {
      usersArray.splice(index, 1);
    }
    io.emit('disconnect', socket.nickname, usersArray);
  });
};
