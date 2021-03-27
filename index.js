"use strict";
exports.__esModule = true;
var express = require('express');
var bitcoin = require("bitcoinjs-lib");
var bip32 = require("bip32");
var bip39 = require("bip39");
var app = express();
var fname = "naman";
var HdAddGen = require('hdaddressgenerator');
var mnemonic = "brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero";
var seed = "09a0a3b58d10bbc456254f1915c2627d8f0e9968922505b39dbb08f6a5dc9dafdee40cff16aa488add7ee4e2ec6eaf40425d3f2aea81c18c2c314d58885e923a";
app.get('/hdaddress', function (req, res) {
    var mnemonic = "brand improve symbol strike say focus ginger imitate ginger appear wheel brand swear relief zero";
    var seed = "09a0a3b58d10bbc456254f1915c2627d8f0e9968922505b39dbb08f6a5dc9dafdee40cff16aa488add7ee4e2ec6eaf40425d3f2aea81c18c2c314d58885e923a";
    var bip49 = HdAddGen.withMnemonic(mnemonic, "test", "BTC", false, 49);
    console.log("\nBIP 49 ( Segwit Compatible '3' ) Key Generation");
    // Generate 3 address pairs starting from index 0,
    var bip49Addresses = bip49.generate(3, 0);
    bip49Addresses.forEach(function (address) {
        console.log(address.path, address.address, address.pubKey, address.privKey);
    });
});
app.get('/segwit_address', function (req, res) {
    var _a;
    var generatedAddress = "";
    var seedPhrase = "";
    var hiddenPhrase = "";
    var derivationPath = "";
    var seed = bip39.mnemonicToSeedSync(seedPhrase, "");
    var root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
    var account = root.derivePath(derivationPath);
    var publicKey = account.publicKey;
    res.send((_a = bitcoin.payments.p2wpkh({ pubkey: publicKey }).address) !== null && _a !== void 0 ? _a : "");
});
app.get('/api/address', function (req, res) {
    res.send(bitcoin.ECPair.makeRandom().toWIF());
});
var port = process.env.PORT || 3000;
app.listen(port, function () { return console.log("App listening on PORT " + port); });
