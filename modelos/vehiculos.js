var pool = require('./bd');

async function vehiculos (documento){
    try {
        var query = 'select * from vehiculos where dni = ?';
        var rows = await pool.query(query,[documento]);
        return rows[0];
    } catch (error){
        console.log (error);
    }
}

module.exports = {vehiculos}