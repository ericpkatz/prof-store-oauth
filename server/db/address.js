const client = require('./client');
const { v4 } = require('uuid');
const uuidv4 = v4;

const fetchAddresses = async(userId)=> {
  const SQL = `
    SELECT addresses.* 
    FROM
    addresses
    JOIN users
    ON users.id = addresses.user_id
    WHERE users.id = $1
  `;
  const response = await client.query(SQL, [ userId ]);
  return response.rows;
};


const createAddress = async(address)=> {
  const SQL = `
  INSERT INTO addresses (id, user_id, data) VALUES($1, $2, $3) RETURNING *
`;
 response = await client.query(SQL, [ uuidv4(), address.user_id, address.data]);
  return response.rows[0];
};


module.exports = {
  createAddress,
  fetchAddresses
};
