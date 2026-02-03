const { getConnection, initPool } = require('../config/db');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

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
            `INSERT INTO app_users (full_name, email, user_password, public_id) 
                values (:full_name, :email, :user_password, :public_id)`,
            {
                full_name: name,
                email: email,
                user_password: hashedPass,
                public_id : publicId
            },
            { autoCommit: true }
        );
        console.log(result);
        console.log(result.rowsAffected);
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