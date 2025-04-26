function simulateData() {
  const heartRate = Math.floor(Math.random() * (100 - 60 + 1)) + 60;
  const spo2 = Math.floor(Math.random() * (99 - 95 + 1)) + 95;

  const heartElem = document.getElementById('heartRate');
  const spo2Elem = document.getElementById('spo2');

  heartElem.textContent = `${heartRate} BPM`;
  spo2Elem.textContent = `${spo2} %`;

  // Re-trigger animation
  heartElem.classList.remove('pulse');
  spo2Elem.classList.remove('pulse');
  void heartElem.offsetWidth; // trick to reset animation
  void spo2Elem.offsetWidth;
  heartElem.classList.add('pulse');
  spo2Elem.classList.add('pulse');
}
