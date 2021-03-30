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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
//declare var require: any;
const supertest_1 = __importDefault(require("supertest"));
let app = require('../index').app;
var supertest = require("supertest");
describe("API Testing For Address Creation", () => {
    it("Check Server Running on Expected Port", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/");
        expect(result.text).toEqual("hello");
        expect(result.status).toEqual(200);
    }));
    it("Check HD Address Generated Successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/segwit_address_generator/seed%20sock%20milk%20update%20focus%20rotate%20barely%20fade%20car%20face%20mechanic%20mercy%20rainbow%20marry/m%2F84%27%2F0%27%2F0%27%2F0");
        expect(result.text).toMatch("bc1qp57nkqdl0suwcm8fpfx638jyya83al5enanhfg");
        expect(result.status).toEqual(200);
    }));
    it("Check HD Address Generation Failure: Invalid input parameters : Seed Phrase", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/segwit_address_generator/mercy%20rainbow%20marry/m%2F84%27%2F0%27%2F0%27%2F0");
        expect(result.text).toMatch("Please check the input parameters, seed phrase words length must be between 12-24");
        expect(result.status).toEqual(412);
    }));
    it("Check HD Address Generation Failure: Invalid input parameters : Derivation Path", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/segwit_address_generator/seed%20sock%20milk%20update%20focus%20rotate%20barely%20fade%20car%20face%20mechanic%20mercy%20rainbow%20marry/m");
        expect(result.text).toMatch("There was an issue generating address");
        expect(result.status).toEqual(400);
    }));
    it("Check P2SH Multisig Address Generated Successfully", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/multisig/2/3/02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c,02799dc04a8acf04e793ff0f2c35c20c0388529eb964c565a455f13c07123c9ea2");
        expect(result.text).toMatch("3KN1RSpNKNeXbUBw5DbNjaWFyiet8XdSeZ");
        expect(result.status).toEqual(200);
    }));
    it("Check P2SH Multisig Address Generation Failure: Invalid Public Keys", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/multisig/2/4/02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c,02799dc04a8acf04e793ff0f2c35c20c0388529eb964c565a455f13c07123c9ea2");
        expect(result.text).toMatch("Check the input parameters, there must be 4 public keys");
        expect(result.status).toEqual(412);
    }));
    it("Check P2SH Multisig Address Generation Failure: Invalid n and m value", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/multisig/4/2/02e135e12b4417b41e92e738448cb51581c70f14bf885b0d4056ac2c3cc5c8729c,022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c");
        expect(result.text).toMatch("Check the input parameters n must be greater than m for multi-sig address generation");
        expect(result.status).toEqual(412);
    }));
    it("Check P2SH Multisig Address Generation Failure: Invalid n and m value", () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield supertest_1.default(app).get("/multisig/1/1/022015b568fb0f2f792e2e1d230a7f64e8a75b5d4a3ae549b55c3724cdc148b32c");
        expect(result.text).toMatch("Check the input parameters n must be greater than m for multi-sig address generation");
        expect(result.status).toEqual(412);
    }));
});
