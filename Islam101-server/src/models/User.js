const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    // Basic info
    name: {
        type: String,
        required: [true, 'Name is required'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false // Never return password in queries by default
    },


    // Location for prayer times
    city: { type: String, default: '' },
    country: { type: String, default: '' },

    // Schedule blocks (replaces localStorage)
    scheduleBlocks: [{
        name: { type: String, required: true },
        start: { type: String, required: true },
        end: { type: String, required: true }
    }],

    // Real stats (not hardcoded anymore!)
    stats: {
        chatMessages: { type: Number, default: 0 },
        scansDone: { type: Number, default: 0 },
        daysActive: { type: Number, default: 0 },
        lastActiveDate: { type: String, default: '' }
    },

    createdAt: { type: Date, default: Date.now }
});

// Hash password before saving (Mongoose 9+ uses async/await, no `next` callback)
userSchema.pre('save', async function () {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

// Method to compare passwords during login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
