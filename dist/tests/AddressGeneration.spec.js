"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
require("ts-jest");
let AddressGeneration = require('../src/AddressGeneration').default;
describe('Segwit AddressGeneration Functional Tests', () => {
    const generation = new AddressGeneration();
    test('test-gen-0', () => __awaiter(void 0, void 0, void 0, function* () {
        let seedPhrase = "lizard century nut catch figure build swift call pledge toe cereal truck recipe faint clerk";
        let derivationPath = "m/84'/0'/0'/0/0";
        let generatedAddress = generation.derive(seedPhrase, derivationPath);
        expect(generatedAddress).toMatch("bc1q0j5dewvk89ss00l68a9hf8lah4c66wmahddmdv");
    }));
    test('test-gen-1', () => __awaiter(void 0, void 0, void 0, function* () {
        let seedPhrase = "dove lumber quote board young robust kit invite plastic regular skull history myself grass old";
        let derivationPath = "m/84'/0'/0'/0/0";
        let generatedAddress = generation.derive(seedPhrase, derivationPath);
        expect(generatedAddress).toMatch("bc1qrd8rth4r228a4qhthk9lf0yve9c90uh4uret3x");
    }));
    test('test-gen-2 Invalid Input Parameters: Seed Phrase', () => __awaiter(void 0, void 0, void 0, function* () {
        let seedPhrase = "dove lumber";
        let derivationPath = "m/84'/0'/0'/0/0";
        let generatedAddress = generation.derive(seedPhrase, derivationPath);
        expect(generatedAddress).toBeNull();
    }));
    test('test-gen-3 Invalid Input Parameters: Derivation path', () => __awaiter(void 0, void 0, void 0, function* () {
        let seedPhrase = "dove lumber";
        let derivationPath = "m";
        let generatedAddress = generation.derive(seedPhrase, derivationPath);
        expect(generatedAddress).toBeNull();
    }));
});
