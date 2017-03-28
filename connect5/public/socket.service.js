/**
 * Created by JianingLiu on 9/5/16.
 */

var app = angular.module('connect5');
app.service('SocketService', SocketService);

SocketService.$inject = ['socketFactory'];

//create a socket singleton, because the app only needs 1 socket
function SocketService(socketFactory) {
    if(!this.sharedSocket){
        this.sharedSocket = socketFactory();
    }
}