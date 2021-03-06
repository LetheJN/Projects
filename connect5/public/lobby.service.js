'use strict';

app.service('LobbyService', LobbyService);
LobbyService.$inject = ['SocketService', 'PlayerService', '$rootScope'];

function LobbyService(SocketService, PlayerService, $rootScope) {
    let socket = SocketService.sharedSocket;

    this.rooms = [];
    this.activeRoom = undefined;

    this.createRoom = function(roomName, cb){
        let room = new Room(roomName, [PlayerService.player]);
        socket.emit('createRoom', room, cb);
    };

    this.getRooms = function () {
        socket.emit('getRooms', '', this.updateRoomInfo.bind(this));
    };

    this.joinRoom = function(room, cb){
        socket.emit('joinRoom', room, cb);
    };

    this.leaveRoom = function(room, cb){
        socket.emit('leaveRoom', room, cb);
    };

    this.updateRoomInfo = function(rooms){
        this.rooms = rooms.map((room) => {
            return new Room(room.name, room.players);
        });
        this.setActiveRoom();
    };

    this.setActiveRoom = function(){
        this.activeRoom = this.rooms.find(function(room){
            return room.isPlayerInRoom();
        });
    };

    socket.on('updateRoomInfo', this.updateRoomInfo.bind(this));
    socket.on('startGame', ()=>{
        $rootScope.$emit('startGame');
    });

    class Room{
        constructor(name, players){
            this.name = name;
            this.players = players;
        }
        isPlayerInRoom(){
            return this.players.some(function(_player){
                return _player.name === PlayerService.player.name;
            });
        }
    }
}