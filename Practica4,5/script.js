// Parámetros introducidos
var volumen = document.getElementById("volumen");

// Datos del juego
var radio = 45;
var radioB = 10;
var vel = 5;
var requestId = 0;
var balas = [];
var keyPressed = {};
var puntosParaGanar = 20;

// Botones
var inicioBoton = document.getElementById("boton");

// Canvas
var c = document.getElementById("canvas");
var ctx = c.getContext("2d");

// Audio
const AudioContext = window.AudioContext || window.webkitAudioContext;
const pannerOptions = { pan: 0 };
var gainInput = document.getElementById("volumen");
// Ganancia
var gainNodeBalas;
var gainNodeFondo;
// Estereo
var pannerBalas;
var pannerFondo;
// Audios
var audioCtx;
var audioBalas;
var audioMusica;
var trackBalas;
var trackMusica;


function iniciar()
{
    if(requestId)
        window.cancelAnimationFrame(requestId);
    requestId = 0;

    if(balas.length) // Si hay balas creadas y le dan a iniciar otra partida, éstas se borran
        balas.splice(0, balas.length);

    if(Object.keys(keyPressed).length) // Si se ha quedado algun valor en TRUE en el vector de teclas pulsadas, se eliminan
        keyPressed = {};

    let nombre1 = document.getElementById("nombre1").value;
    let nombre2 = document.getElementById("nombre2").value;
    let color1 = document.getElementById("color1").value;
    let color2 = document.getElementById("color2").value;
    let pos1 = {x: c.width/4, y: c.height/2};
    let pos2 = {x: c.width/1.4, y: c.height/2};

    if(nombre1 == "")
        nombre1 = "Jugador 1";
    if(nombre2 == "")
        nombre2 = "Jugador 2";
    
    jugador1 = new Jugador(1, nombre1, pos1, 0, color1, radio);
    jugador2 = new Jugador(2, nombre2, pos2, 0, color2, radio);

    document.addEventListener('keydown', pulsarTecla);
    document.addEventListener('keyup', soltarTecla);

    c.addEventListener('click', disparar);
    sonidoMusica();
    animar();
}

function dibujar()
{   
    ctx.clearRect(0, 0, c.width, c.height);

    if(jugador1.puntos < puntosParaGanar && jugador2.puntos < puntosParaGanar)
    {
        // Linea central
        ctx.beginPath();
        ctx.setLineDash([10, 5]);
        ctx.moveTo(c.width/2, 0);
        ctx.lineTo(c.width/2, c.height);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.closePath();

        // Balas
        dibujarBalas();

        // Jugadores
        jugador1.dibujar();
        jugador2.dibujar();
    } else {
        if(jugador1.puntos > jugador2.puntos)
            var texto = "Enhorabuena " + jugador1.nombre + " ¡Has ganado!";
        else 
            var texto = "Enhorabuena " + jugador2.nombre + " ¡Has ganado!";

        ctx.font = "35px sans-serif";
        ctx.fillStyle = "Black";
        /* Este codigo sirve para que el texto quede centrado en el canva sin importar la longitud del texto */
        var x = (c.width - ctx.measureText(texto).width) / 2;
        var y = c.height / 2;
        ctx.fillText(texto, x, y);

        if(requestId)
            window.cancelAnimationFrame(requestId);
        requestId = 0;
        c.removeEventListener('click', disparar);
    }
}

function animar()
{
    requestId = window.requestAnimationFrame(animar);
    actualizarBalas();
    mover();
    dibujar();
}

/* ---------- Balas ---------- */
function disparar()
{
    var x = event.clientX - c.offsetLeft;
    if(x < c.width/2) // Si el clic se hace en la mitad izquierda, dispara el jugador 1
    {
        let bala1 = new Bala(jugador1.pos, 1, radioB);
        let bala2 = new Bala({x: jugador1.pos.x - radioB * 4, y: jugador1.pos.y}, 1, radioB);
        let bala3 = new Bala({x: jugador1.pos.x + radioB * 4, y: jugador1.pos.y}, 1, radioB);
        sonidoDisparo(1);
        balas.push(bala1);
        balas.push(bala2);
        balas.push(bala3);
    } else {          // Si el clic se hace en la mitad derecha, dispara el jugador 2
        let bala1 = new Bala(jugador2.pos, 2, radioB);
        let bala2 = new Bala({x: jugador2.pos.x - radioB * 4, y: jugador2.pos.y}, 2, radioB);
        let bala3 = new Bala({x: jugador2.pos.x + radioB * 4, y: jugador2.pos.y}, 2, radioB);
        sonidoDisparo(2);  
        balas.push(bala1);
        balas.push(bala2);
        balas.push(bala3);
    }
}

function actualizarBalas()
{
    for(let i = 0; i < balas.length; i++)
    {
        let bala = balas[i];
        // Si la bala se sale de los bordes se elimina
        if(bala.pos.x < 0 || bala.pos.x > c.width)
            balas.splice(i, 1);
        else if(bala.jugador == 2) { // Si colisiona con el jugador 1 se suman puntos al jugador 2 y la bala se elimina
            let distx = Math.abs(bala.pos.x - jugador1.pos.x);
            let disty = Math.abs(bala.pos.y - jugador1.pos.y);
            let dist = Math.sqrt(Math.pow(distx,2) + Math.pow(disty,2));
            if((dist <= jugador1.radio + bala.radio) && (Math.abs(bala.pos.x - jugador1.pos.x) <= jugador1.radio + bala.radio) && ((bala.pos.y <= jugador1.pos.y + jugador1.radio + bala.radio/2) && (bala.pos.y >= jugador1.pos.y - jugador1.radio - bala.radio/2)))
            {
                balas.splice(i, 1);
                jugador2.puntos++;
            }
        } else {                    // Si colisiona con el jugador 2 se suman puntos al jugador 1 y la bala se elimina
            let distx = Math.abs(bala.pos.x - jugador2.pos.x);
            let disty = Math.abs(bala.pos.y - jugador2.pos.y);
            let dist = Math.sqrt(Math.pow(distx,2) + Math.pow(disty,2));
            if((dist <= jugador2.radio + bala.radio) && (Math.abs(jugador2.pos.x - bala.pos.x) <= jugador2.radio + bala.radio) && ((bala.pos.y <= jugador2.pos.y + jugador2.radio + bala.radio/2) && (bala.pos.y >= jugador2.pos.y - jugador2.radio - bala.radio/2)))
            {
                balas.splice(i, 1);
                jugador1.puntos++;
            }
        }
    }
    for(let i = 0; i < balas.length; i++)
        balas[i].actualizaPos();
}

function dibujarBalas()
{
    for(let i = 0; i < balas.length; i++)
        balas[i].dibujar();
}

/* ---------- Movimiento ---------- */
function pulsarTecla()
{
    keyPressed[event.key] = true;    
}

function soltarTecla()
{
    delete keyPressed[event.key];
}

function mover()
{
    if(keyPressed['w']) {
        if(jugador1.pos.y > 0 + jugador1.radio)
            jugador1.pos.y -= 5;
    }
    if(keyPressed['a']) {
        if(jugador1.pos.x > 0 + jugador1.radio)
            jugador1.pos.x -= 5;
    }
    if(keyPressed['s']) {
        if(jugador1.pos.y < c.height - jugador1.radio)
            jugador1.pos.y += 5;
    }
    if(keyPressed['d']) {
        if(jugador1.pos.x < c.width/2 - jugador1.radio)
            jugador1.pos.x += 5;
    }
    if(keyPressed['ArrowUp']) {
        if(jugador2.pos.y > 0 + jugador2.radio)
            jugador2.pos.y -= 5;
    }
    if(keyPressed['ArrowLeft']) {
        if(jugador2.pos.x > c.width/2 + jugador2.radio)
            jugador2.pos.x -= 5;
    }
    if(keyPressed['ArrowDown']) {
        if(jugador2.pos.y < c.height - jugador2.radio)
            jugador2.pos.y += 5; 
    }
    if(keyPressed['ArrowRight']) {
        if(jugador2.pos.x < c.width - jugador2.radio - 2)
            jugador2.pos.x += 5;
    }
}

/* ---------- Audio ---------- */
function iniciarAudio()
{
    audioCtx = new AudioContext();
    gainNodeBalas = audioCtx.createGain();
    gainNodeFondo = audioCtx.createGain();
    pannerBalas = new StereoPannerNode(audioCtx, pannerOptions);
    pannerFondo = new StereoPannerNode(audioCtx, pannerOptions);
    audioBalas = document.getElementById("bala");
    audioMusica = document.getElementById("musica");
    trackMusica = audioCtx.createMediaElementSource(audioMusica);
    trackMusica.connect(gainNodeFondo).connect(pannerFondo).connect(audioCtx.destination);
    trackBalas = audioCtx.createMediaElementSource(audioBalas);
    trackBalas.connect(gainNodeBalas).connect(pannerBalas).connect(audioCtx.destination);
}

function ganancia()
{
    if(!audioCtx) 
        iniciarAudio();

    if(audioCtx.state === 'suspended')
        audioCtx.resume();

    gainNodeBalas.gain.value = gainInput.value;
}

function sonidoMusica()
{
    if(!audioCtx) 
        iniciarAudio();

    if(audioCtx.state === 'suspended')
        audioCtx.resume();

    if(!audioMusica.paused)
        audioMusica.currentTime = 0;
    else {
        gainNodeFondo.gain.value = 0.01;
        audioMusica.play();
    }  
}

function sonidoDisparo(jugador)
{
    if(!audioCtx) 
        iniciarAudio();

    if(audioCtx.state === 'suspended')
        audioCtx.resume();

    if(jugador == 1) // Si dispara el jugador 1 el sonido se escucha por la izquierda
        pannerBalas.pan.value = -1;
    else             // Si dispara el jugador 2 el sonido se escucha por la derecha
        pannerBalas.pan.value = 1;    

    audioBalas.play();
}

/* ---------- Clases ---------- */
class Bala{
    constructor(pos, jugador, radio)
    {
        this.pos = {...pos};  // Esto es para crear una copia de la variable y así evitar que ésta se modifique
        this.jugador = jugador;
        this.radio = radio;
    }

    actualizaPos()
    {
        if(this.jugador == 1)
            this.pos.x += vel;
        else
            this.pos.x -= vel;
    }

    dibujar()
    {
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radio, 0, 2 * Math.PI);
        if(this.jugador == 1)
            ctx.fillStyle = jugador1.color;
        else
            ctx.fillStyle = jugador2.color;
        ctx.fill();
        ctx.closePath();
    }
}

class Jugador{
    constructor(id, nombre, pos, puntos, color, radio)
    {
        this.id = id;
        this.nombre = nombre;
        this.pos = pos;
        this.puntos = puntos;
        this.color = color;
        this.radio = radio;
    }

    dibujar()
    {
        ctx.font = "16px sans-serif";
        ctx.fillStyle = "black";
        if(this.id == 1)
            ctx.fillText(this.nombre + ": " + this.puntos, c.width/4.5 - 25, 20);
        else
            ctx.fillText(this.nombre + ": " + this.puntos, c.width/1.4 - 25, 20);
    
        ctx.beginPath();
        ctx.arc(this.pos.x, this.pos.y, this.radio, 0, 2 * Math.PI);
        ctx.fillStyle = this.color;
        ctx.fill();
    
        ctx.lineWidth = 1;
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.closePath();
    }
}

/* ---------- Listeners ---------- */
inicioBoton.addEventListener('click', iniciar);
gainInput.addEventListener('input', ganancia);