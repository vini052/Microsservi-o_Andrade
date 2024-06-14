'use strict';

const db = require('../db');
const { collection, addDoc, getDocs, query, where, Timestamp } = require('firebase/firestore');
const bcrypt = require('bcrypt');
const User = require('../models/user');

const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        // Log the received data
        console.log('Signup data received:', req.body);

        // Criptografar senha
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User(firstName, lastName, email, hashedPassword, false);

        await addDoc(collection(db, 'usuarios'), {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            upgrade: user.upgrade
        });

        // Log successful signup
        console.log('User signed up successfully');

        res.status(201).json({ message: 'Cadastro bem sucedido!' });
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(400).json({ message: error.message });
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const q = query(collection(db, 'usuarios'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        // Log the received data
        console.log('Login data received:', req.body);

        if (querySnapshot.empty) {
            return res.status(400).json({ message: 'Email ou senha incorretos' });
        }

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ message: 'Email ou senha incorretos' });
        }

        // Registra o horário de login
        await addDoc(collection(db, 'logins'), {
            userId: userDoc.id,
            email: user.email,
            loginTime: Timestamp.now()
        });

        // Log successful login
        console.log('User logged in successfully');

        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    signup,
    login
};