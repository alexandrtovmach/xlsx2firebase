const fs = require('fs');
const XLSX = require('xlsx');
const firestoreRepository = require('../../repositories/firestore');
const realtimedbRepository = require('../../repositories/realtimedb');

const arrJSONs = [{}];
const pathToFile = './resources/db.xlsx';

module.exports = {
  importDB(...args) {
    this.process_RS(fs.createReadStream(pathToFile), ...args)
  },

  checkToLimit(obj, limit=500) {
    let total = 0;
    for (let key in obj) {
      total += Object.keys(obj[key]).length;
    }
    return total <= limit;
  },
  
  process_RS(stream, endpoint, h1, h2, wrapper) {
    const buffers = [];
    const repository = (endpoint === 'realtimedb')? realtimedbRepository: firestoreRepository;
    const dbRef = repository.init();

    stream.on('data', (data) => {
      buffers.push(data);
    });
    stream.on('end', () => {
      const workbook = XLSX.read(Buffer.concat(buffers), {type:"buffer"});
      XLSX
      .utils
      .sheet_to_json(workbook.Sheets[workbook.SheetNames[0]])
      .forEach(jsonObj => {
        const JSONbig = this.checkToLimit(arrJSONs[arrJSONs.length - 1], 50)? arrJSONs[arrJSONs.length - 1]: arrJSONs.push({});
        const c1 = jsonObj[h1];
          c2 = jsonObj[h2];
      
        JSONbig[c1] = {
          ...JSONbig[c1],
          [c2]: jsonObj
        }
      })
      const promisesArray = [];
      arrJSONs.forEach((el, i) => {
        setTimeout(() => {
          promisesArray.push(repository.upload(dbRef, el, wrapper));
        }, 1000*i)
      })
      setTimeout(() => {
        Promise.all(promisesArray)
          .then(() => {
            console.log('Import is successful, you can stop the process "Ctrl+C"')
          })
          .catch((err) => {
            console.error('Import is failed')
            console.error(err)
          })
      }, 1000*arrJSONs.length)
    });
  }
}