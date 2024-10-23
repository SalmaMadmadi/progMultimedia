var video = document.getElementById("video");
var botonPlayPause = document.getElementById("play-pause");
var botonStop = document.getElementById("stop");
var botonMute = document.getElementById("mute");
var barraVol = document.getElementById("volumen");
var barraPro = document.getElementById("progreso");
var botonRet = document.getElementById("retrocede");
var botonAva = document.getElementById("avanza");
var ventana = document.getElementById("ampliar");
var tiempo = document.getElementById("tiempo");

function cambiaPlayPause() {
  if (video.paused || video.ended) {
    botonPlayPause.innerHTML = '<img src="../img/pause.png" class="boton-video">';
    document.getElementById("div-video").style.backgroundColor = 'rgb(187, 198, 170)';
    video.play();
  } else {
    botonPlayPause.innerHTML = '<img src="../img/play.png" class="boton-video">';
    document.getElementById("div-video").style.backgroundColor = 'rgb(199, 199, 199)';
    video.pause();
  }
}

function stopVideo() {
  video.currentTime = 0;
  video.pause();
  botonPlayPause.innerHTML = '<img src="../img/play.png" class="boton-video">';
  document.getElementById("div-video").style.backgroundColor = 'rgb(199, 199, 199)';
}

function controlMute() {
  if (video.muted) {
    botonMute.innerHTML = '<img src="../img/volumen.png" class="boton-video">';
    video.muted = false;
    barraVol.value = 0.1;
  } else {
    botonMute.innerHTML = '<img src="../img/mute.png" class="boton-video">';
    video.muted = true;
    barraVol.value = 0;
  }
}

function retrocedeVideo() {
    video.currentTime -= 5;
}

  function avanzaVideo() {
    video.currentTime += 5;
}

function actualizaVolumen() {
  video.volume = barraVol.value;
  if(barraVol.value == 0) {
    botonMute.innerHTML = '<img src="../img/mute.png" class="boton-video">';
    video.muted = true;
  } else {
    botonMute.innerHTML = '<img src="../img/volumen.png" class="boton-video">';
    video.volume = barraVol.value;
    video.muted = false;
  }
}

function actualizaProgreso() {
  var progreso = video.currentTime;
  var duracion = video.duration;
  var porciento = (progreso / duracion) * 100;
  barraPro.value = porciento;


  var minutos = Math.floor(video.currentTime / 60);
  var segundos = Math.floor(video.currentTime % 60);
  var minutosMostrados = minutos < 10 ? "0" + minutos : minutos;
  var segundosMostrados = segundos < 10 ? "0" + segundos : segundos;
  tiempo.innerHTML = minutosMostrados + ":" + segundosMostrados;

}

function controlVentana(){
    if (document.fullscreenElement) {
        document.exitFullscreen();
    } else {
        video.requestFullscreen();
    }
}

botonPlayPause.addEventListener("click", cambiaPlayPause);
botonStop.addEventListener("click", stopVideo);
botonMute.addEventListener("click", controlMute);
barraVol.addEventListener("input", actualizaVolumen);
video.addEventListener("timeupdate", actualizaProgreso);
video.addEventListener("click", cambiaPlayPause);
botonRet.addEventListener("click", retrocedeVideo);
botonAva.addEventListener("click", avanzaVideo);
ventana.addEventListener("click", controlVentana);