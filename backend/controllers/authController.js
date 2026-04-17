const User = require('../models/User');
const Task = require('../models/Task');
const generateToken = require('../utils/tokenGenerator');
const { validateRegister, validateLogin } = require('../validations/loginValidation');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { errors, isValid } = validateRegister(req.body);
        if (!isValid) return res.status(400).json({ success: false, errors });

        const { name, email, password, role } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ success: false, error: 'User already exists' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'student'
        });

        // Insert Sample Tasks
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        await Task.insertMany([
            {
                userId: user._id,
                title: 'Complete React Assignment',
                description: 'Finish the frontend UI for the new components.',
                priority: 'High',
                category: 'Assignment',
                deadline: tomorrow,
                status: 'Pending'
            },
            {
                userId: user._id,
                title: 'Study Data Structures',
                description: 'Review trees and graphs.',
                priority: 'Medium',
                category: 'Study',
                deadline: new Date(new Date().setDate(new Date().getDate() + 2)),
                status: 'Pending'
            },
            {
                userId: user._id,
                title: 'Prepare for Algorithms Exam',
                description: 'Solve past papers and review notes.',
                priority: 'High',
                category: 'Exam',
                deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
                status: 'Pending'
            },
            {
                userId: user._id,
                title: 'Review JavaScript Notes',
                description: 'Go over async/await and promises.',
                priority: 'Low',
                category: 'Study',
                deadline: tomorrow,
                status: 'Pending'
            }
        ]);

        res.status(201).json({
            success: true,
            token: generateToken(user._id, user.role),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { errors, isValid } = validateLogin(req.body);
        if (!isValid) return res.status(400).json({ success: false, errors });

        const { email, password } = req.body;

        // Check for user
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(401).json({ success: false, error: 'Invalid credentials' });
        }

        // Add Demo Task Data if the user has 0 tasks
        const taskCount = await Task.countDocuments({ userId: user._id });
        if (taskCount === 0) {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            
            await Task.insertMany([
                {
                    userId: user._id,
                    title: 'Complete React Assignment',
                    description: 'Finish the frontend UI for the new components.',
                    priority: 'High',
                    category: 'Assignment',
                    deadline: tomorrow,
                    status: 'Pending'
                },
                {
                    userId: user._id,
                    title: 'Study Data Structures',
                    description: 'Review trees and graphs.',
                    priority: 'Medium',
                    category: 'Study',
                    deadline: new Date(new Date().setDate(new Date().getDate() + 2)),
                    status: 'Pending'
                },
                {
                    userId: user._id,
                    title: 'Prepare Algorithms Exam',
                    description: 'Solve past papers and review notes.',
                    priority: 'High',
                    category: 'Exam',
                    deadline: new Date(new Date().setDate(new Date().getDate() + 3)),
                    status: 'Pending'
                },
                {
                    userId: user._id,
                    title: 'Review JavaScript Notes',
                    description: 'Go over async/await and promises.',
                    priority: 'Low',
                    category: 'Study',
                    deadline: tomorrow,
                    status: 'Pending'
                }
            ]);
        }

        res.status(200).json({
            success: true,
            token: generateToken(user._id, user.role),
            user: { id: user._id, name: user.name, email: user.email, role: user.role }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { registerUser, loginUser };
