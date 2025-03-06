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
exports.remove = exports.update = exports.comparePassword = exports.findByEmail = exports.create = exports.findOne = exports.findAll = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
let users = loadUsers();
function loadUsers() {
    try {
        const data = fs_1.default.readFileSync("users.json", "utf-8");
        return JSON.parse(data);
    }
    catch (error) {
        console.log(`Error loading users, ${error}`);
        return {};
    }
}
function saveUsers() {
    try {
        fs_1.default.writeFileSync("./users.json", JSON.stringify(users), "utf-8");
        console.log("Users saved successfully");
    }
    catch (error) {
        console.log(`Error:${error}`);
    }
}
const findAll = () => __awaiter(void 0, void 0, void 0, function* () { return Object.values(users); });
exports.findAll = findAll;
const findOne = (id) => __awaiter(void 0, void 0, void 0, function* () { return users[id]; });
exports.findOne = findOne;
const create = (usersData) => __awaiter(void 0, void 0, void 0, function* () {
    let id = (0, uuid_1.v4)();
    let check_users = yield (0, exports.findOne)(id);
    while (check_users) {
        id = (0, uuid_1.v4)();
        check_users = yield (0, exports.findOne)(id);
    }
    const salt = yield bcryptjs_1.default.genSalt(10);
    const hashedPassword = yield bcryptjs_1.default.hash(usersData.password, salt);
    const user = {
        id: id,
        username: usersData.username,
        email: usersData.email,
        password: hashedPassword,
    };
    users[id] = user;
    saveUsers();
    return user;
});
exports.create = create;
const findByEmail = (user_email) => __awaiter(void 0, void 0, void 0, function* () {
    const allUsers = yield (0, exports.findAll)();
    const getUser = allUsers.find((result) => result.email === user_email);
    return getUser || null;
});
exports.findByEmail = findByEmail;
const comparePassword = (user_email, supplied_password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findByEmail)(user_email);
    const decryptedPassword = yield bcryptjs_1.default.compare(supplied_password, user.password);
    if (!decryptedPassword) {
        return null;
    }
    return user;
});
exports.comparePassword = comparePassword;
const update = (id, updateValues) => __awaiter(void 0, void 0, void 0, function* () {
    const userExists = yield (0, exports.findOne)(id);
    if (!userExists) {
        return null;
    }
    if (updateValues.password) {
        const salt = yield bcryptjs_1.default.genSalt(10);
        const newPassword = yield bcryptjs_1.default.hash(updateValues.password, salt);
        updateValues.password = newPassword;
    }
    users[id] = Object.assign(Object.assign({}, userExists), updateValues);
    saveUsers();
    return users[id];
});
exports.update = update;
const remove = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, exports.findOne)(id);
    if (!user) {
        return null;
    }
    delete users[id];
    saveUsers();
});
exports.remove = remove;
