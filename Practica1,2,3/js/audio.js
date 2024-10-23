var audio = document.getElementById("audio");
var audioActual = document.getElementById("audio-select");
var duracion = document.getElementById("duracion");
var restante = document.getElementById("restante");
var fichero = document.getElementById("fichero");
var estado = document.getElementById("estado");

function seleccionarAudio() {
  if (audioActual.value) {
    audio.src = audioActual.value;
    audio.load();
    fichero.textContent = "Archivo: " + audio.src;
    estado.textContent = "Estado: pausado";
  } else {
    audio.pause();
    file.textContent = "Archivo: ";
    duracion.textContent = "Duración total: ";
    restante.textContent = "Tiempo restante: ";
    estado.textContent = "Estado: pausado";
  }
}

function actualizaDuracion() {
  duracion.textContent = "Duración total: " + traducirTiempo(audio.duration);
}

function actualizaTiempo() {
    restante.textContent = "Tiempo restante: " + traducirTiempo(audio.duration - audio.currentTime);
  estado.textContent = "Estado: iniciado";
}

function pausarAudio() {
    estado.textContent = "Estado: pausado";
}

function acabarAudio() {
    estado.textContent = "Estado: finalizado";
}

function traducirTiempo(time) {
  let minutes = Math.floor(time / 60);
  let seconds = Math.floor(time % 60);
  return minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
}

audioActual.addEventListener("change", seleccionarAudio);
audio.addEventListener("loadeddata", actualizaDuracion);
audio.addEventListener("timeupdate", actualizaTiempo);
audio.addEventListener("pause", pausarAudio);
audio.addEventListener("ended", acabarAudio);
