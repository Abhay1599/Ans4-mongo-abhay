const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb+srv://zapdoz1599:2024@accluster.eu9fqtx.mongodb.net';

async function findAll() {
    
    const client = await MongoClient.connect(url, { useNewUrlParser: true })
        .catch(err => { console.log("s2");console.log(err); });
    if (!client) return;
        
    try {
        console.log('1');
        const db =  client.db("test");
        console.log('2');
        let collection =  db.collection('products');
        console.log('3');
        let cursor =  collection.find({}).limit(10);
        console.log('4');
        await cursor.forEach(doc => console.log(doc));
        console.log('5');
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}
setTimeout(()=>{
    findAll();
    console.log('iter');
}, 5000);