const client = require('./client');
const fs = require('fs');
const path = require('path');

const {
  fetchProducts,
  createProduct,
  updateProduct
} = require('./products');

const {
  createUser,
  authenticate,
  findUserByToken
} = require('./auth');

const {
  createAddress,
  fetchAddresses
} = require('./address');

const {
  fetchLineItems,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  fetchOrders
} = require('./cart');

const loadImage = (filePath)=> {
  return new Promise((resolve, reject)=> {
    const fullPath = path.join(__dirname, filePath);
    fs.readFile(fullPath, 'base64', (err, result)=> {
      if(err){
        reject(err);
      }
      else {
        //data:[<mediatype>][;base64],<data>
        resolve(`data:image/png;base64,${result}`);
      }
    });
  });
};


const seed = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS addresses;
    DROP TABLE IF EXISTS line_items;
    DROP TABLE IF EXISTS products;
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(100) NOT NULL,
      is_admin BOOLEAN DEFAULT false NOT NULL
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      name VARCHAR(100) UNIQUE NOT NULL,
      image TEXT
    );

    CREATE TABLE addresses(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      data JSON DEFAULT '{}',
      user_id UUID REFERENCES users(id) NOT NULL
    );

    CREATE TABLE orders(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      is_cart BOOLEAN NOT NULL DEFAULT true,
      user_id UUID REFERENCES users(id) NOT NULL
    );

    CREATE TABLE line_items(
      id UUID PRIMARY KEY,
      created_at TIMESTAMP DEFAULT now(),
      product_id UUID REFERENCES products(id) NOT NULL,
      order_id UUID REFERENCES orders(id) NOT NULL,
      quantity INTEGER DEFAULT 1,
      CONSTRAINT product_and_order_key UNIQUE(product_id, order_id)
    );

  `;
  await client.query(SQL);

  const [moe, lucy, ethyl] = await Promise.all([
    createUser({ username: 'moe', password: `${process.env.password_prefix}_moe`, is_admin: false}),
    createUser({ username: 'lucy', password: `${process.env.password_prefix}_lucy`, is_admin: false}),
    createUser({ username: 'ethyl', password: `${process.env.password_prefix}_ethyl`, is_admin: true})
  ]);
  await createAddress({ user_id: moe.id, data: { formatted_address: 'earth'}});
  await createAddress({ user_id: moe.id, data: { formatted_address: 'mars'}});
  const fooImage = await loadImage('images/foo.png');
  const barImage = await loadImage('images/bar.png');
  const bazzImage = await loadImage('images/bazz.png');
  let [foo, bar, bazz] = await Promise.all([
    createProduct({ name: 'foo', image: fooImage}),
    createProduct({ name: 'bar', image: barImage}),
    createProduct({ name: 'bazz' }),
    createProduct({ name: 'quq' }),
  ]);
  bazz = await updateProduct({...bazz, image: bazzImage});
  let orders = await fetchOrders(ethyl.id);
  let cart = orders.find(order => order.is_cart);
  let lineItem = await createLineItem({ order_id: cart.id, product_id: foo.id});
  lineItem.quantity++;
  await updateLineItem(lineItem);
  lineItem = await createLineItem({ order_id: cart.id, product_id: bar.id});
  cart.is_cart = false;
  await updateOrder(cart);
};

module.exports = {
  fetchProducts,
  fetchOrders,
  fetchLineItems,
  fetchAddresses,
  createAddress,
  createLineItem,
  updateLineItem,
  deleteLineItem,
  updateOrder,
  updateProduct,
  authenticate,
  findUserByToken,
  seed,
  client
};
