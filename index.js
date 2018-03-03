const { nested, firstLevelColumn, secondLevelColumn, endpoint } = require('./config/userSettings');
const importService = require(`./services/xlsx/importer`);


try {
  importService.importDB(endpoint, firstLevelColumn, secondLevelColumn, nested);
} catch(err) {
  console.error(err)
}