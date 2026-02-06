const { getConnection } = require('../config/db');

exports.getDashboardStats = async (req, res) => {
    let connection;

    try {
        const { USER_ID } = req.user;
        connection = await getConnection();

        const oweResult = await connection.execute(
            `
                SELECT NVL(SUM(es.SHARE_AMOUNT), 0) AS you_owe
                FROM EXPENSE_SHARES es 
                JOIN EXPENSES e ON e.EXPENSE_ID = es.EXPENSE_ID
                WHERE es.USER_ID = :USER_ID
                AND e.PAID_BY <> :USER_ID
            `,
            { USER_ID }
        );

        const youOwe = oweResult.rows[0].YOU_OWE;

        const getResult = await connection.execute()

        res.status(200).json({
            success: true,
            data: {
                // totalBalance,
                youOwe
            }
        });
    } catch (err) {
        console.error("Dashboard Error : ", err);
        res.status(500).json({
            success : false,
            message : "Failed to load dashboard data"
        });
    } finally {
        if(connection) await connection.close();
    }
};
