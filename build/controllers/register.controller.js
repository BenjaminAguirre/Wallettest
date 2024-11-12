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
exports.generateWallet = generateWallet;
exports.login = login;
const { exec } = require('child_process');
function generateWallet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const username = req.body.username;
            if (!username) {
                return;
            }
            exec(`provider-services keys add ${username}`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error al crear la cuenta: ${stderr}`);
                    return res.status(500).send(`Error al crear la cuenta: ${stderr}`);
                }
                console.log(stdout);
                exec(`provider-services keys show ${username} -a`, (error, stdout) => {
                    if (error) {
                        console.error(`Error al obtener la dirección de la cuenta: ${error}`);
                        return res.status(500).send('Error al obtener la dirección de la cuenta');
                    }
                    const AKASH_ACCOUNT_ADDRESS = stdout.trim();
                    console.log(`AKASH_ACCOUNT_ADDRESS: ${AKASH_ACCOUNT_ADDRESS}`);
                    res.status(200).send('Cuenta creada exitosamente');
                });
            });
        }
        catch (error) {
            console.error(`Error en generateWallet: ${error}`);
            res.status(500).send('Error en la creación de la billetera');
        }
    });
}
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
    });
}
