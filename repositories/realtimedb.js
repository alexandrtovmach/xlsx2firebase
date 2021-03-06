const serviceKeyJSON = require('../config/service-key.json');
const admin = require("firebase-admin");

module.exports = {

  init() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceKeyJSON),
      databaseURL: `https://${serviceKeyJSON.project_id}.firebaseio.com`
    });
    return admin.database();
  },

  upload(collectionRef, data, wrapper) {
    if (data) {
      const promises = [];
      if (wrapper) {
        Object.keys(data).forEach(key => {
          promises.push(
            collectionRef.ref(wrapper).child(key).update(data[key])
              .then(_ok => console.info(`${wrapper}/${key}`))
              .catch(err => console.warn('FAILED', err))
          )
        });
      } else {
        Object.keys(data).forEach(key => {
          Object.keys(data[key]).forEach(key2 => {
            promises.push(
              collectionRef.ref(key).child(key2).update(data[key][key2])
                .then(_ok => console.info(`${key}/${key2}`))
                .catch(err => console.warn(`${key}/${key2} FAILED`, err))
            )
          })
        });
      }
      return Promise.all(promises)
    } else {
      throw new Error('Data not exist');
    }
  }
}