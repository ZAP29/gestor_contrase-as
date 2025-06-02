// app.js - funcionalidad principal
import './db.js';

const output = document.getElementById('passwordOutput');
const generateBtn = document.getElementById('generateBtn');
const copyBtn = document.getElementById('copyBtn');
const lengthSlider = document.getElementById('length');
const lengthValue = document.getElementById('lengthValue');
const historyList = document.getElementById('historyList');
const siteInput = document.getElementById('site');
const usernameInput = document.getElementById('username');
const savedPasswordInput = document.getElementById('savedPassword');
const saveBtn = document.getElementById('saveBtn');
const loginList = document.getElementById('loginList');

let worker = new Worker('js/worker.js');

generateBtn.onclick = () => {
  const length = parseInt(lengthSlider.value);
  worker.postMessage({ length });
};

worker.onmessage = function (e) {
  const pwd = e.data;
  output.value = pwd;
  saveGeneratedPassword(pwd);
};

function saveGeneratedPassword(pwd) {
  db.passwords.add({ value: pwd, date: new Date() });
  renderPasswordHistory();
}

copyBtn.onclick = () => {
  output.select();
  document.execCommand('copy');
};

lengthSlider.oninput = () => {
  lengthValue.textContent = lengthSlider.value;
};

saveBtn.onclick = () => {
  const site = siteInput.value;
  const username = usernameInput.value;
  const password = savedPasswordInput.value;
  if (site && username && password) {
    db.logins.add({ site, username, password, date: new Date() });
    siteInput.value = '';
    usernameInput.value = '';
    savedPasswordInput.value = '';
    renderSavedLogins();
  }
};

async function renderPasswordHistory() {
  const items = await db.passwords.orderBy('date').reverse().limit(5).toArray();
  historyList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.textContent = item.value;
    historyList.appendChild(li);
  });
}

async function renderSavedLogins() {
  const items = await db.logins.orderBy('date').reverse().toArray();
  loginList.innerHTML = '';
  items.forEach(item => {
    const li = document.createElement('li');
    li.innerHTML = `<strong>${item.site}</strong><br>${item.username} - ${item.password}`;
    loginList.appendChild(li);
  });
}

// Instalación manual de la PWA
let deferredPrompt;
const installBtn = document.getElementById('installBtn');

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  installBtn.style.display = 'inline-block';

  installBtn.addEventListener('click', () => {
    installBtn.style.display = 'none';
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(choiceResult => {
      if (choiceResult.outcome === 'accepted') {
        console.log('✅ App instalada');
      } else {
        console.log('❌ Usuario canceló la instalación');
      }
      deferredPrompt = null;
    });
  });
});

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js')
      .then(reg => console.log('✅ SW registrado'))
      .catch(err => console.error('❌ Error registrando SW', err));
  });
}



renderPasswordHistory();
renderSavedLogins();
