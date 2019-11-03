"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ftp_1 = __importDefault(require("ftp"));
exports.default = (host, file) => new Promise((res, rej) => {
    const c = new ftp_1.default();
    c.on('ready', () => c.get(file, (err, stream) => {
        if (err)
            rej(err);
        let contents = '';
        stream.on('data', data => contents += data);
        stream.on('end', () => {
            c.end();
            res(contents);
        });
    }));
    c.connect({
        host
    });
});
