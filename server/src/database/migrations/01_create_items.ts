import Knex from "knex";

export async function up(knex: Knex) {
    // CRIAR A TABELA 
    // Cria uma tabela chamada points com estes campos.
    return knex.schema.createTable('items', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('title').notNullable();
    })

}

export async function down(knex: Knex) {
    // VOLTAR ATRAS, NO CASO DELETAR A TABELA
    knex.schema.dropTable('items');
}