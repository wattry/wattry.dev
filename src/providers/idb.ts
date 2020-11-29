import { openDB } from 'idb';

export default openDB('stores', 1, {
    upgrade(db) {
      db.createObjectStore('user-info');
    },
});
