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
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
function generateWallet(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        // 1. Obtener el username y password desde el cuerpo de la solicitud
        const username = req.body.username;
        const password = req.body.password;
        if (!username || !password) {
            return res.status(400).send('Los campos "username" y "password" son requeridos.'); // Actualizar el mensaje de error
        }
        // 4. Usar el username y password como la frase mnemotécnica
        const mnemonic = `${username} ${password}`; // Combina username y password como mnemonic
        // 5. Generar la clave privada (implementación manual)
        const seed = generateSeed(mnemonic);
        const privateKey = derivePrivateKey(seed); // Implementación manual para derivar la clave
        // 5. Almacenar la clave privada en la base de datos (simulado aquí)
        const save = yield savePrivateKeyToDatabase(mnemonic, privateKey);
        console.log(save);
        // Función para guardar la clave privada
        // 7. Devolver la frase mnemotécnica y la clave privada
        return res.status(200).json({
            mnemonic,
            privateKey,
        });
    });
}
// Función para generar una semilla a partir de la frase mnemotécnica
function generateSeed(mnemonic) {
    const salt = 'mnemonic' + 'some_salt'; // Agrega un salt para mayor seguridad
    const seed = crypto.pbkdf2Sync(mnemonic, salt, 2048, 64, 'sha512');
    return seed; // Retorna la semilla generada
}
// Función para derivar la clave privada a partir de la semilla
function derivePrivateKey(seed) {
    // Implementación simplificada de la derivación de clave privada
    // En un caso real, deberías seguir el estándar BIP32
    const privateKey = seed.slice(0, 32).toString('hex'); // Toma los primeros 32 bytes como clave privada
    return privateKey; // Retorna la clave privada derivada
}
// Nueva función para verificar si el mnemonic corresponde a la clave privada
function verifyMnemonic(mnemonic, privateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const seed = generateSeed(mnemonic); // Genera la semilla a partir del mnemonic
        const derivedPrivateKey = derivePrivateKey(seed); // Deriva la clave privada a partir de la semilla
        return derivedPrivateKey === privateKey; // Compara las claves privadas
    });
}
// Nueva lógica en la función de inicio de sesión
function login(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const username = req.body.username;
        const password = req.body.password;
        const mnemonic = `${username} ${password}`;
        console.log(mnemonic);
        // Recuperar la clave privada de la base de datos
        const privateKey = yield getPrivateKeyFromDatabase(mnemonic);
        console.log(privateKey);
        // Función para obtener la clave privada
        if (!privateKey) {
            return res.status(401).send('Credenciales inválidas.'); // Mensaje de error si no se encuentra la clave
        }
        // Verificar si el mnemonic corresponde a la clave privada
        const isValid = yield verifyMnemonic(mnemonic, privateKey);
        if (!isValid) {
            return res.status(401).send('Credenciales inválidas.'); // Mensaje de error si no coinciden
        }
        // Devolver la clave privada al usuario (considera no hacerlo en producción)
        return res.status(200).json({
            privateKey,
        });
    });
}
// Función simulada para guardar la clave privada en la base de datos
function savePrivateKeyToDatabase(mnenomic, privateKey) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path.join(__dirname, `${mnenomic}_privateKey.txt`); // Define el nombre del archivo
        yield fs.promises.writeFile(filePath, privateKey); // Escribe la clave privada en el archivo
    });
}
// Función simulada para obtener la clave privada de la base de datos
function getPrivateKeyFromDatabase(mnemonic) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePath = path.join(__dirname, `${mnemonic}_privateKey.txt`); // Define el nombre del archivo
        try {
            const privateKey = yield fs.promises.readFile(filePath, 'utf-8'); // Lee la clave privada del archivo
            return privateKey; // Retorna la clave privada leída
        }
        catch (error) {
            return null; // Si hay un error (archivo no encontrado), retorna null
        }
    });
}
