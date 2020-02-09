"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
class Util {
    static sanitizeId(content) {
        let out = content;
        out = out.trim();
        out = out.replace(/(\r\n|\n|\r|\s+)/gm, '-');
        return out;
    }
    static sanitizeMeta(content) {
        let out = content;
        out = out.replace(/(\r\n|\n|\r)/gm, '');
        out = out.substring(0, 400);
        out = out.trim();
        return out;
    }
    static getContributorRating(adds = 0, edits = 0) {
        return 10 * adds + edits;
    }
    static up1Letter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }
}
exports.Util = Util;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
class UtilIO {
    static fileExists(path) {
        return fs_1.default.existsSync(path_1.default.normalize(path));
    }
    static writeFile(path, data) {
        path = path_1.default.normalize(path);
        fs_1.default.mkdirSync(path_1.default.dirname(path), { recursive: true });
        fs_1.default.writeFileSync(path, data);
    }
    static readFile(path) {
        path = path_1.default.normalize(path);
        return fs_1.default.readFileSync(path, { encoding: 'utf-8' });
    }
}
exports.UtilIO = UtilIO;
//# sourceMappingURL=Util.js.map