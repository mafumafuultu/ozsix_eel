const db = {
	get DB() {return this.database},
	set DB(db) {this.database = db},
};

/*
ObjectStore = table
index = index
value = record
*/
const create = {
	thread: db => {
		const storeName = 'thread';
		let store = db.createObjectStore(storeName, {keyPath : 'thread'});
		store.createIndex('read', 'thread', {unique: true});
		store.transaction.oncomplete = e => {
			db.transaction(storeName, 'readwrite').objectStore(storeName);
		};
	},
	talk: db => {
		const storeName = 'talk';
		let store = db.createObjectStore(storeName, {keyPath : 'thread'});
		store.createIndex('read', 'thread', {unique: true});
		store.transaction.oncomplete = e => {
			db.transaction(storeName, 'readwrite').objectStore(storeName);
		};
	},
	character: db => {
		const storeName = 'character';
		let store = db.createObjectStore('character', {keyPath : 'thread'});
		store.createIndex('read', 'thread');
		store.transaction.oncomplete = e => {
			db.transaction(storeName, 'readwrite').objectStore(storeName);
		};
	},
};

const _writer = (db, o, storeName, key) => {
	let store = db.transaction(storeName, 'readwrite').objectStore(storeName);
	var req = store.get(o[key]);
	req.onerror = e => void console.log(`${storeName} fail`);
	req.onsuccess = function(e) {
		let data = req.result;
		var upd = store.put(Object.assign({}, data, o));
		upd.onerror = e => {/* miss */};
		upd.onsuccess = e => {/* succes */};
	};
};

const _reader = (a, storeName, idxName) => {
	db.DB.transaction(storeName, 'readonly').objectStore(storeName).openCursor(keyIDBkeyRange.only(idxName)).onsuccess = function(e) {
		var cursor = e.target.result;
		cursor ? (a.push(cursor.value), cursor.continue()) : console.log(`no entry`);
	};
};

const _remover = (db, o, storeName, key) => {
	var req = db.transaction(storeName, 'readwrite').objectStore(storeName).delete(o[key]);
	req.onsuccess = e => void console.debug(`${o[key]} del complete`);
};

const put = {
	thread: (db, o) => void _writer(db, o, 'thread', 'thread'),
	talk: (db, o) => void _writer(db, o, 'talk', 'thread'),
	character: (db, o) => void _writer(db, o, 'character', 'thread'),
};

const read = {
	thread: db => (a = [], _reader(a, 'thread'), a),
	talk: (db, key) => (a = [], _reader(a, 'talk', key), a),
	character: (db, key) => (a = [], _reader(a, 'character', key), a),
};

const del = {
	thread: o => void _remover(db.DB, o, 'thread', 'thread'),
	talk: o => void _remover(db.DB, o, 'talk', 'thread'),
	character: o => void _remover(db.DB, o, 'character', 'thread'),
};

const connection = () => {
	let req = indexedDB.open('ozsix', 1);
	req.onerror = e => void reject(req.errorCode);
	req.onupgradeneeded = e => (idb = e.target.result, Object.values(create).map(f => f(idb)));
	req.onsuccess = e => (db.DB = e.target.result, void 0);
};

connection();
