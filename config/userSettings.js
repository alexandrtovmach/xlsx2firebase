module.exports = {
    firstLevelColumn: 'Country', // any column name [case sensetive]
    secondLevelColumn: 'ID', // any column name [case sensetive]
    endpoint: 'firestore', // 'firestore', 'realtimedb'
    nested: 'importedDB' // !!! NOT RECOMMENDED, because have a bad perfomance from firebase side !!! any string or ''
}