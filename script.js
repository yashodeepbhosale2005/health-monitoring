function generateData() {
  const bpm = Math.floor(Math.random() * (100 - 60 + 1)) + 60; // Random 60-100
  const spo2 = Math.floor(Math.random() * (99 - 92 + 1)) + 92; // Random 92-99

  document.getElementById("bpm").innerText = bpm;
  document.getElementById("spo2").innerText = spo2 + "%";
}
 
