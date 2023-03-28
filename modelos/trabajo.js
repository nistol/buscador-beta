var pool = require('./bd');

async function trabajo (documento){
    try {
        var query = 'select * from trabajo where dni = ?';
        var rows = await pool.query(query,[documento]);
        
        return rows[0];
    } catch (error){
        console.log (error);
    }
}

module.exports = {trabajo}