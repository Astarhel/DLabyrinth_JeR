DLabyrinth.levelState = function (game) {

}
var players;
var currentPlayer;
var orbes;
var weaponItems;
var ammoItems;
var lifeItems;
var shieldItems;
var foodItems;
var interfaz;
var map, layer;
var temp, boolUpdate;
var damage_spr;
var vision_spr;
var first_visible; // Es true cuando acaba de hacerse visible una capa de bloqueo. En la iteración posterior se vuelve false
var map_handler; //Objeto que maneja las habitacioens a cerrar
var playerGroup; //Grupo para los personajes (ordenar su profundidad para que aparezcan detras o delante)
var itemsGroup; //Grupo para los items para que siempre aparezcan detrás del personaje

DLabyrinth.levelState.prototype = {
    preload: function () {

    },

    create: function () {
        //Sprite background
        //this.bg = game.add.tileSprite(0, 0, 1920, 1920, 'bg');

        //Límites del mundo para la cámara
        game.world.setBounds(0, 0, 3200, 3200);
        //game.stage.backgroundColor = "#71706F";

        //Conjuntos de objetos del juego
        players = new Array();
        orbes = new Array();
        weaponItems = new Array();
        ammoItems = new Array();
        lifeItems = new Array();
        shieldItems = new Array();
        foodItems = new Array();

        //Mapa
        map = new Mapa();
        map.createMap();

        first_visible = false;

        //map_handler = new MapHandler(map, map.layers);

        temp = setInterval(miniMapUpdate, 400); //Temporizador para mejorar fps (actualiza el minimapa)

        //Creamos los jugador
        playerGroup = game.add.group();
        players.push(new Jugador(300, 300, 'spriteSheet', 1));
        players.push(new Jugador(500, 300, 'spriteSheet2', 2));

        //Variables que subiremos al servidor y leerá el otro usuario
        DLabyrinth.player.positionX = players[DLabyrinth.player.id-1].sprite.x;
        DLabyrinth.player.positionY = players[DLabyrinth.player.id-1].sprite.y;

        //console.log(JSON.stringify(DLabyrinth.player))
        
        updatePlayer(DLabyrinth.player);
        
        //Inputs players
        players[0].createInputs();
        players[1].createInputs();

        damage_spr = game.add.sprite(0, 0, 'damage');
        damage_spr.scale.setTo(0.1);
        damage_spr.anchor.setTo(0, 0.5);
        //damage_spr.fixedToCamera = true;
        damage_spr.visible = false;

        /////////////////////////// INTERFAZ ///////////////////////////
        interfaz = new Interface();
        interfaz.createInterface();
        /////////////////////////// FIN INTERFAZ ///////////////////////////

        itemsGroup = game.add.group();
        generateItems();

        //Se busca a nuestro jugador en el array
        for (var i = 0; i < players.length; i++){
            if(players[i].id == DLabyrinth.player.id){
                currentPlayer = players[i];
            }
        }
        //La cámara sigue al jugador
        game.camera.follow(currentPlayer.sprite, Phaser.Camera.FOLLOW_LOCKON, 0.1, 0.1);

    },

    update: function () {
        //Actualizamos eventos de teclado y animaciones de los personajes
        for (var i = 0; i < players.length; i++) {
            players[i].updateInputs();
            players[i].updateAnimations();
            players[i].checkLifePoints();
        }
        
        map.update();
        checkCollisions(); // Chequeamos colisiones jugadores-objetos

        playerGroup.sort('y', Phaser.Group.SORT_ASCENDING);
        game.world.bringToTop(playerGroup);
        /////////////////////////// INTERFAZ ///////////////////////////
        interfaz.updateInterface(currentPlayer, orbes);
        /////////////////////////// FIN INTERFAZ ///////////////////////////


    },


}