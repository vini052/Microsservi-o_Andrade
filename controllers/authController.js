'use strict';

const db = require('../db');
const { collection, addDoc, getDocs, query, where, Timestamp, updateDoc, doc } = require('firebase/firestore');
const User = require('../models/user');

const signup = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password } = req.body;

        console.log('Signup data received:', req.body);

        const user = new User(firstName, lastName, email, password, false);

        await addDoc(collection(db, 'usuarios'), {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            upgrade: user.upgrade
        });

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

        console.log('Login data received:', req.body);

        if (querySnapshot.empty) {
            return res.status(400).json({ message: 'Email ou senha incorretos' });
        }

        const userDoc = querySnapshot.docs[0];
        const user = userDoc.data();

        if (password !== user.password) {
            return res.status(400).json({ message: 'Email ou senha incorretos' });
        }

        // Configurar o cookie com o email do usuário
        res.cookie('userEmail', user.email, { httpOnly: true, secure: true });

        await addDoc(collection(db, 'logins'), {
            userId: userDoc.id,
            email: user.email,
            loginTime: Timestamp.now()
        });

        console.log('User logged in successfully');

        res.status(200).json({ message: 'Login bem-sucedido' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(400).json({ message: error.message });
    }
};

const upgradeUser = async (req, res, next) => {
    try {
        const { email } = req.params;
        const q = query(collection(db, 'usuarios'), where('email', '==', email));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        const userDoc = querySnapshot.docs[0];
        const userRef = doc(db, 'usuarios', userDoc.id);

        await updateDoc(userRef, { upgrade: true });

        res.status(200).json({ message: 'Usuário atualizado para premium' });
    } catch (error) {
        console.error('Error during upgrade:', error);
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    signup,
    login,
    upgradeUser
};
