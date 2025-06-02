// db.js - configuración IndexedDB usando Dexie
const db = new Dexie("ClaveFacilDB");

db.version(1).stores({
  passwords: '++id,value,date',
  logins: '++id,site,username,password,date'
});
