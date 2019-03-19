class Socketer {
  constructor (app) {
    this.io = require('socket.io')(app)
    this.text = {
      text: ''
    }
    this.startup()
  }

  startup () {
    this.io.on('connection', this.connection)
  }

  connection (socket) {
    console.log('A new user with socket id ' + socket.id + 'has entered');
    

  }


}

module.exports = Socketer