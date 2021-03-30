"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sinon_1 = __importDefault(require("sinon"));
const chai_1 = __importDefault(require("chai"));
const sinon_chai_1 = __importDefault(require("sinon-chai"));
var expect = chai_1.default.expect;
chai_1.default.use(sinon_chai_1.default);
var supertest = require("supertest");
module.exports = {
    sinon: sinon_1.default,
    chai: chai_1.default,
    expect: expect,
    supertest: supertest
};
