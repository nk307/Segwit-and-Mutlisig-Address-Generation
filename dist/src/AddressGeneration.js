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
Object.defineProperty(exports, "__esModule", { value: true });
const bitcoin = __importStar(require("bitcoinjs-lib"));
const bip32 = __importStar(require("bip32"));
const bip39 = __importStar(require("bip39"));
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
        if (this.validateInputs(seedPhrase)) {
            var seed = bip39.mnemonicToSeedSync(seedPhrase, "");
            const root = bip32.fromSeed(seed, bitcoin.networks.bitcoin);
            const account = root.derivePath(derivationPath);
            let publicKey = account.publicKey;
            return (_a = bitcoin.payments.p2wpkh({ pubkey: publicKey }).address) !== null && _a !== void 0 ? _a : "";
        }
        console.log("Seed length must be greater than 12 words");
        return null;
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
exports.default = AddressGeneration;
