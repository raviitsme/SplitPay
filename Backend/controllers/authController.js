const { getConnection } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const nodemailer = require('nodemailer');
const { welcomeUser } = require('../utils/emailTemplate');
const { autoCommit } = require('oracledb');
const transporter = nodemailer.createTransport({
    service : 'gmail',
    auth : {
        user : process.env.USER_EMAIL,
        pass : process.env.USER_PASS
    }
})

exports.registerUser = async (req, res) => {
    const { name, email, password } = req.body;
        if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'All fields are required'
        });
    }
    let connection;

    try {
        connection = await getConnection();
        console.log("Connected Successfully!");

        const publicId = uuidv4();
        const hashedPass = await bcrypt.hash(password, 10);
        
        const result = await connection.execute(
            `INSERT INTO APP_USERS 
            (FULL_NAME, EMAIL, USER_PASSWORD, PUBLIC_ID)
            VALUES 
            (:full_name, :email, :user_password, :public_id)`,
            {
                full_name : name,
                email : email,
                user_password : hashedPass,
                public_id : publicId
            },
            { autoCommit : true }
        );

        await transporter.sendMail({
            from : `SplitPay <${process.env.USER_EMAIL}>`,
            to : email,
            subject : "Welcome to SplitPay",
            html : welcomeUser({ full_name: name, user_id : publicId })
        });
    
        return res.status(200).json({
            success: true,
            message: "Successfully inserted!"
        })

    } catch (err) {
        console.error("Error : ", err);
        return res.status(500).json({
            success: false,
            message: "Error in DB"
        })
    } finally {
        if (connection) {
            try {
                await connection.close();
                console.log("Connection Closed!");
            } catch (err) {
                console.error("Error closing connection : ", err);
            }
        }
    }
}

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `Select PUBLIC_ID, USER_PASSWORD FROM app_users where email = :email`,
            { email }
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                success : false,
                message : "User not found!"
            });
        }

        const user = result.rows[0];

        const isMatch = await bcrypt.compare(password, user.USER_PASSWORD);
        if(!isMatch) {
            return res.status(401).json({
                success : false,
                message : "Invalid credentials"
            });
        }

        const token = jwt.sign(
            {publicID : user.PUBLIC_ID},
            process.env.JWT_SECRET,
            { expiresIn : '1d' }
        );

        res.cookie('token', token, {
            httpOnly : true,
            secure : false,
            sameSite : 'lax',
            maxAge : 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            success : true,
            message : "Login successful"
        });
    } catch (err) {
        console.error("Error at catch : ", err);
    } finally {
        if(connection) {
            await connection.close();
        }
    }
}