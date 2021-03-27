"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AddressGeneration = exports.MultiSigCreation = void 0;
const express = require('express');
const cors = require('cors');
const bitcoin = __importStar(require("bitcoinjs-lib"));
const bip32 = __importStar(require("bip32"));
const bip39 = __importStar(require("bip39"));
const app = express();
app.use(cors());
//import swaggerUi = require('swagger-ui-express');
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./openapi.json"));
//const swaggerDocument = require('');
app.use('/api-docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
/**
 *
 *
 * @export
 * @class MultiSigCreation
 * @description n-out-of-m multi-sig P2SH address generator
 * @param mvalue: (number) Value of M (Number to be used)
 * @param nValue: (number) Value of N
 * @param publicKeys: (List[]) List[] of all the public keys
 */
class MultiSigCreation {
    constructor() {
        this.mValue = 2;
        this.nValue = 3;
        this.publicKeys = new Array(this.nValue);
    }
    /**
     *
     *
     * @param {number} mvalue
     * @param {number} nValue
     * @param {Array<string>} _publicKeys
     * @return {*}  {(string | null)}
     * @memberof MultiSigCreation
     */
    generateP2SHMultiSig(m, n, _publicKeys) {
        try {
            this.mValue = m;
            this.nValue = n;
            this.publicKeys = new Array(n);
            let pubkeys = _publicKeys
                .filter(pk => pk.length > 0)
                .map(hex => Buffer.from(hex, 'hex'));
            if (pubkeys.length == 0) {
                console.log("Input public keys for calculating multi-sig");
                return null;
            }
            const { address } = bitcoin.payments.p2sh({
                redeem: bitcoin.payments.p2ms({ m: this.mValue, pubkeys }),
            });
            return address !== null && address !== void 0 ? address : "";
        }
        catch (e) {
            console.log("Failed To generate multi-sig address");
            return null;
        }
    }
    getMultiSig() {
        let address = this.generateP2SHMultiSig(this.mValue, this.nValue, this.publicKeys);
        console.log(`Generated address: ${address}`);
    }
}
exports.MultiSigCreation = MultiSigCreation;
/**
 *
 * @description Native Segwit bech-32 address
  *Prefix “1”: Legacy Addresses, aka, Pay to Public Key Hash (P2PKH)
  *Prefix “bc1”: Native SegWit Bech32 Addresses, aka, Pay to Witness Public Key Hash (P2WPKH)
  *Prefix “3”: Nested SegWit Addresses, aka, Pay to Witness Public Key Hash in a Pay to Script Hash (P2SH-P2WPKH)
 * @export
 * @class AddressGeneration
 */
class AddressGeneration {
    constructor() {
        this.generatedAddress = "";
        this.seedPhrase = "";
        this.derivationPath = "";
        this.words = [];
    }
    derive(seedPhrase, derivationPath) {
        var _a;
        var seed = bip39.mnemonicToSeedSync(seedPhrase, "");
        const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
        const account = root.derivePath(derivationPath);
        let publicKey = account.publicKey;
        return (_a = bitcoin.payments.p2wpkh({ pubkey: publicKey }).address) !== null && _a !== void 0 ? _a : "";
    }
    validateInputs(seedPhrase) {
        var words = seedPhrase.trim().split(" ");
        // Mnemonic phrases can be from 3 words to 24 words but the most used interval is 12-24
        if (words.length >= 12 && words.length <= 24) {
            return true;
        }
        else {
            return false;
        }
    }
}
exports.AddressGeneration = AddressGeneration;
app.get('/segwit_address_generator/:seedPhrase/:path', (req, res) => {
    const generate = new AddressGeneration();
    var seedPhrase = req.params.seedPhrase;
    var derivationPath = req.params.path;
    if (!generate.validateInputs(seedPhrase)) {
        //console.log("incorrect input");
        res.status(412).send("Please check the input parameters, seed phrase words length must be between 12-24");
    }
    else {
        try {
            let generatedAddress = generate.derive(seedPhrase, derivationPath);
            res.status(200).send(generatedAddress);
        }
        catch (e) {
            res.status(400).send("There was an issue generating address");
        }
    }
});
var QRCode = require('qrcode');
app.post('/qrcode', (req, res) => {
    QRCode.toString('I am a pony!', { type: 'terminal' }, function (err, url) {
        console.log(url);
        res.send(url);
    });
});
app.get('/multisig/:m/:n/:publicKeys', (req, res) => {
    const multiSigGeneration = new MultiSigCreation();
    const mvalue = parseInt(req.params.m);
    const nvalue = parseInt(req.params.n);
    let publicKeys = new Array(nvalue);
    publicKeys = req.params.publicKeys.split(',');
    if (publicKeys.length != nvalue) {
        res.status(412).send("Check the input parameters, there must be " + nvalue + " public keys");
    }
    if (nvalue <= mvalue) {
        res.status(412).send("Check the input parameters n must be greater than m for multi-sig address generation");
    }
    try {
        let generatedAddress = multiSigGeneration.generateP2SHMultiSig(mvalue, nvalue, publicKeys);
        if (generatedAddress == null) {
            res.status(412).send("Incorrect Public Keys, failed to generate address");
        }
        //console.log('generated address: ' + generatedAddress);
        res.status(200).send(generatedAddress);
    }
    catch (e) {
        res.status(400).send("Failed to generate multi-sig address");
    }
});
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`App listening on PORT ${port}`));
