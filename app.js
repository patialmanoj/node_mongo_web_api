const MongoClient = require('mongodb').MongoClient;
const realEstateRepo = require('./repo/realEstateRepo');
const data=  require('./houses.json');
const url = 'mongodb://localhost:27017';

const dbName = 'realEstate';

async function main(){
    //open a client
    const client = new MongoClient(url ,{ useUnifiedTopology: true } );
    await client.connect();

    const results = await realEstateRepo.loadData(data);
    // console.log(results.insertedCount , results.ops);
    
    const getData = await realEstateRepo.get();
    //console.log(getData);

    const filterData = await realEstateRepo.get({address: getData[2].address}); // it will always return array
    //console.log(filterData);

    
    const id = getData[5]._id.toString(); // from URL you will get a string hence we need to check according to that
    const byId = await realEstateRepo.getById(id);
    // console.log(byId);

    const newItem=  {
        "id": 7,
        "address": "Tamil Nadu , 34 Bunglow",
        "country": "India",
        "description": "This luxurious three bedroom flat is contemporary in style and benefits from the use of a gymnasium and a reserved underground parking space.",
        "price": 321500,
        "photo": "534087"
    }
    const addedItem = await realEstateRepo.add(newItem);
    //console.log(addedItem._id);

    const itemToUpdate =  {
        "id": 7,
        "address": "Tamil Nadu , 72 sambiana beach",
        "country": "India",
        "description": "This luxurious three bedroom flat is contemporary in style and benefits from the use of a gymnasium and a reserved underground parking space.",
        "price": 321500,
        "photo": "534087"
    }

    const updatedItem = await realEstateRepo.update(addedItem._id ,itemToUpdate);
    // console.log(updatedItem);

    const deletedItem = await realEstateRepo.remove(addedItem._id);
    // console.log("delted item ",deletedItem);

    const averagePrice = await realEstateRepo.findAverageCost();
    console.log("average price $",averagePrice);
    
    const admin = client.db(dbName).admin();
    //console.log(await admin.serverStatus());
    await client.db(dbName).dropDatabase();
    // console.log(await admin.listDatabases());
    client.close();
}
main();