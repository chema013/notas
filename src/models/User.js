const mongoose = require('mongoose');
const { Schema} = mongoose;
const bcrypt = require('bcryptjs');

const UserSchema = new Schema({ //se definen los datos con su typo y su requerido
    name: { type: String, required: true},
    email: { type: String, required: true},
    password: { type: String, required: true},
    date: { type: Date, default: Date.now}
});

UserSchema.methods.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10); //encripta la contraseña 
    const hash = bcrypt.hash(password, salt); //genera un hash
    return hash;
};

UserSchema.methods.matchPassword = async function (password) {
    return await bcrypt.compare(password, this.password); //compara las contraseñas
};

module.exports = mongoose.model('User', UserSchema); //se exporta el esquema