const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const SkillShema = new Schema({
    Skillname: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('skill',SkillShema);