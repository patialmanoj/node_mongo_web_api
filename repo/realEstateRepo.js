const {MongoClient, ObjectID} = require('mongodb');
function realEstateRepo(){

    const dbName="realEstate";
    const url = 'mongodb://localhost:27017';

    // function sample(){
    //     return new Promise(async(resolve ,reject) => {
    //         const client = new MongoClient(url);
    //         try{
    //             await client.connect();
    //             const db =  client.db(dbName);

    //              client.close();
    //         }
    //         catch(error){
                    // reject(error);
    //         }
    //     });
    // }

    function get(query){
        return new Promise(async(resolve ,reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try{
                await client.connect();
                const db =  client.db(dbName);
                const items = db.collection('houses').find(query); // this will return the cursor only
                resolve(await items.toArray());
                client.close();

            }
            catch(error){
                reject(error);
            }
        });
    }

    function getById(id){
        return new Promise(async(resolve ,reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try{ 
                await client.connect();
                const db =  client.db(dbName);
                const item = await db.collection('houses').findOne({_id: ObjectID(id)}); // it wil return a single obj
                resolve(item);
                client.close();
            }
            catch(error){
                reject(error);
            }
        });
    }


    function add(item){
        return new Promise(async(resolve ,reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try{ 
                await client.connect();
                const db =  client.db(dbName);
                const addedItem =  await db.collection('houses').insertOne(item);
                //console.log(addedItem);
                resolve(addedItem.ops[0]);

                client.close();
            }
            catch(error){
                reject(error);
            }
        });
    }


    function update(id, newItem){
        return new Promise(async(resolve ,reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try{
                await client.connect();
                const db =  client.db(dbName);
                const updatedItem = await db.collection('houses')
                    .findOneAndReplace({_id:ObjectID(id)},newItem ,{returnOriginal:false} );
                resolve(updatedItem.value);
                client.close();
            }
            catch(error){
                    reject(error);
            }
        });
    }

  
    function remove(id){
        return new Promise(async(resolve ,reject) => {
            const client = new MongoClient(url, { useUnifiedTopology: true });
            try{ 
                await client.connect();
                const db =  client.db(dbName);
                const removed =  await db.collection('houses').deleteOne({ _id: ObjectID(id)});
                
                resolve(removed.deletedCount === 1);

                client.close();
            }
            catch(error){
                reject(error);
            }
        });
    }

    function findAverageCost(){
        return new Promise(async(resolve ,reject) => {
            const client = new MongoClient(url ,{ useUnifiedTopology: true });
            try{
                await client.connect();
                const db =  client.db(dbName);
                const average =  await db.collection('houses')
                    .aggregate([{ $group: 
                        {  _id: null , 
                            avgHousePrice:{ $avg:"$price" } 
                        }
                    }]).toArray();
                
                resolve(average[0].avgHousePrice);
                // do somo work  
                client.close();
            }
            catch(error){
                    reject(error);
            }
        });
    }

    function loadData(data){
        return new Promise(async (resolve,reject)=>{
            const client = new MongoClient(url,{ useUnifiedTopology: true });
            try{
                await client.connect();
                const db = client.db(dbName); 
                results =  await db.collection('houses').insertMany(data);
                resolve(results);  
                client.close();

            }
            catch(error){
                reject(error);
            }
        })
    }
    return {loadData, get, getById ,add, update, remove, findAverageCost};
}

module.exports = realEstateRepo();