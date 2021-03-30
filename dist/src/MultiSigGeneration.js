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
            if (pubkeys.length == 0 || pubkeys.length != this.nValue) {
                console.log("Input " + this.nValue + " public keys for calculating multi-sig");
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
exports.default = MultiSigCreation;
