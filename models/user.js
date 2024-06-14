class User {
    constructor(firstName, lastName, email, password, upgrade) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.password = password;
        this.upgrade = upgrade;
    }
}

module.exports = User;
