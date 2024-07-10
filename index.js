// const express = require('express');
// const app = express();
// const port = 8080
// const mysql = require(mysql2)

// app.get('/mahasiswa/:nim', (req,res)=>{
//     const nim = req.params.nim

//     res.send(`Mahasiswa dengan nim ${nim} di temukan`)
// });

// app.get('/mahasiswa/:nim/:semester', (req,res)=>{

//     const nim = req.params.nim
//     const semester = req.params.semester

//     res.send(`Mahasiswa dengan : ${nim} semester :${semester} di temukan`)
// });

// app.get('/get-mahasiswa-by-nim', (req, res)=>{
//     const nim = req.query.nim

//     res.send(`Mahasiswa dengan nim${nim} di temukan`)
// });

// app.get('/nilai-persemester', (req,res)=>{
//     const nim = req.query.nim
//     const semester = req.query.semester

//     res.send(`Mahasiswa dengan nim : ${nim} semester : ${semester} di temukan`)
// })

// app.use(express.json()),

// app.post('/mahasiswa', (req,res)=>{
//     const nim = req.body.nim;
//     const nama = req.body.nama;
//     const angkatan = req.body.angkatan;
//     const prodi = req.body.prodi;

//     const msg = {status:"sukses",
//                     data:{"nim" : nim, "nama" : nama, "angkatan" : angkatan, "prodi" : prodi}};
//     res.send(msg);
// })

// app.get('/', (req, res) =>{
//     res.send('Menyala Abangkuhh')
// });

// app.post ('/', (req, res)=>{
//     res.send('post data')
// })

// app.put ('/', (req, res)=>{
//     res.send('upload sucsesful')
// })

// app.delete ('/', (req, res)=>{
//     res.send('delete sucsesful')
// })

'use strict';

var GetIntrinsic = require('get-intrinsic');
var callBound = require('call-bind/callBound');
var inspect = require('object-inspect');

var $TypeError = require('es-errors/type');
var $WeakMap = GetIntrinsic('%WeakMap%', true);
var $Map = GetIntrinsic('%Map%', true);

var $weakMapGet = callBound('WeakMap.prototype.get', true);
var $weakMapSet = callBound('WeakMap.prototype.set', true);
var $weakMapHas = callBound('WeakMap.prototype.has', true);
var $mapGet = callBound('Map.prototype.get', true);
var $mapSet = callBound('Map.prototype.set', true);
var $mapHas = callBound('Map.prototype.has', true);

/*
* This function traverses the list returning the node corresponding to the given key.
*
* That node is also moved to the head of the list, so that if it's accessed again we don't need to traverse the whole list. By doing so, all the recently used nodes can be accessed relatively quickly.
*/
var listGetNode = function (list, key) { // eslint-disable-line consistent-return
	for (var prev = list, curr; (curr = prev.next) !== null; prev = curr) {
		if (curr.key === key) {
			prev.next = curr.next;
			curr.next = list.next;
			list.next = curr; // eslint-disable-line no-param-reassign
			return curr;
		}
	}
};

var listGet = function (objects, key) {
	var node = listGetNode(objects, key);
	return node && node.value;
};
var listSet = function (objects, key, value) {
	var node = listGetNode(objects, key);
	if (node) {
		node.value = value;
	} else {
		// Prepend the new node to the beginning of the list
		objects.next = { // eslint-disable-line no-param-reassign
			key: key,
			next: objects.next,
			value: value
		};
	}
};
var listHas = function (objects, key) {
	return !!listGetNode(objects, key);
};

module.exports = function getSideChannel() {
	var $wm;
	var $m;
	var $o;
	var channel = {
		assert: function (key) {
			if (!channel.has(key)) {
				throw new $TypeError('Side channel does not contain ' + inspect(key));
			}
		},
		get: function (key) { // eslint-disable-line consistent-return
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapGet($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapGet($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listGet($o, key);
				}
			}
		},
		has: function (key) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if ($wm) {
					return $weakMapHas($wm, key);
				}
			} else if ($Map) {
				if ($m) {
					return $mapHas($m, key);
				}
			} else {
				if ($o) { // eslint-disable-line no-lonely-if
					return listHas($o, key);
				}
			}
			return false;
		},
		set: function (key, value) {
			if ($WeakMap && key && (typeof key === 'object' || typeof key === 'function')) {
				if (!$wm) {
					$wm = new $WeakMap();
				}
				$weakMapSet($wm, key, value);
			} else if ($Map) {
				if (!$m) {
					$m = new $Map();
				}
				$mapSet($m, key, value);
			} else {
				if (!$o) {
					// Initialize the linked list as an empty node, so that we don't have to special-case handling of the first node: we can always refer to it as (previous node).next, instead of something like (list).head
					$o = { key: {}, next: null };
				}
				listSet($o, key, value);
			}
		}
	};
	return channel;
};