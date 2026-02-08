const db = require('oracledb');
const { getConnection } = require('../config/db');

exports.createNewGroup = async (req, res) => {

    const { name, members } = req.body;
    console.log("Here name ", name);

    const { user_id } = req.user;

    if (!name || !user_id) {
        return res.status(400).json({
            success: false,
            message: "Group name and creator required"
        });
    }

    let connection;
    try {
        connection = await getConnection();

        const insertGrp = await connection.execute(
            `
                INSERT INTO groups (group_name, created_by)
                VALUES (:1, :2)
                RETURNING group_id INTO :3
            `,
            [
                name,
                user_id,
                { dir: db.BIND_OUT, type: db.NUMBER }
            ]
        );

        const groupID = insertGrp.outBinds[0][0];
        console.log(groupID);

        await connection.execute(
            `INSERT INTO group_members (group_id, user_id, is_admin)
             VALUES (:1, :2, 'Y')`,
             [groupID, user_id]
        );

        const memberIds = [];
        if (members && members.length > 0) {
            for (const email of members) {
                const lookup = await connection.execute(
                    `SELECT user_id FROM app_users WHERE email = :email`,
                    { email },
                    { outFormat: db.OUT_FORMAT_OBJECT }
                );

                if (lookup.rows.length > 0) {
                    const memberUserID = lookup.rows[0].USER_ID;
                    if (memberUserID !== user_id) {
                        memberIds.push(memberUserID);
                    }
                } else {
                    console.warn(`User not found for email : ${email}`);
                }
            }
            if (memberIds.length > 0) {
                const binds = memberIds.map(uid => [groupID, uid]);
                const query = `INSERT INTO group_members (group_id, user_id) VALUES (:1, :2)`
                await connection.executeMany(query, binds);
            }
        }

        await connection.commit();

        res.status(201).json({
            success: true,
            message: "Group created successfully"
        });
    } catch (err) {
        console.error("Error : ", err);
        res.status(500).json({
            success: false,
            message: "Failed to create group."
        });
    } finally {
        if (connection) await connection.close();
    }
}

exports.getGroups = async (req, res) => {
    const { user_id } = req.user;
    let connection;
    try {
        connection = await getConnection();
        const result = await connection.execute(
            `SELECT DISTINCT g.group_id, g.group_name, au.full_name as created_by
            FROM group_members gm
            join groups g on gm.group_id = g.group_id
            join app_users au on g.created_by = au.user_id
            WHERE gm.user_id = :user_id
            ORDER BY g.group_id DESC`,
            { user_id },
            { outFormat : db.OUT_FORMAT_OBJECT }
        )
        return res.json({
            success : true,
            message : "Groups fetched successfully",
            groups : result.rows
        });
    } catch (err) {
        console.error("Get groups error : ", err);
        return res.status(500).json({
            success : false, 
            message : "Failed to fetch groups"
        });
    } finally {
        if(connection) await connection.close();
    }
}