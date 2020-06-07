import path from 'path';
//knex nao consegue identificar a sinataxe export default do typescript
module.exports = {
    client: 'sqlite3',
    connection: {
        filename: path.resolve(__dirname,'src', 'database', 'database.sqlite'),
    },
    migrations: {
        directory: path.resolve(__dirname, 'src','database', 'migrations')
    },
    seeds: {
        directory: path.resolve(__dirname, 'src','database', 'seeds')
    },
    useNullAsDefault: true
}