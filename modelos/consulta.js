var pool = require('./bd');

async function consulta (documento){
    try {
        var query = 'select * from celulares where dni = ? ';
        var rows = await pool.query(query, [documento]);
        return rows[0];
    } catch (error){
        console.log (error);
    }
}
async function deletetelefono(obj,id){
   
    var query = 'update celulares set ? where id = ? ';
    var rows = await pool.query(query,[obj,id]);
    return rows;
}

async function getDatosById (id){
   
    var query = 'select * from celulares where id = ? ';
    var rows = await pool.query(query,[id]);
    return rows[0];
}

async function modificarDatosById (obj,id){
    try {
        var query = 'update celulares set ? where id=? ';
        var rows = await pool.query(query, [obj,id]);
        return rows;
    } catch (error){
        throw error;
    }
}

module.exports = {consulta,deletetelefono,getDatosById,modificarDatosById}