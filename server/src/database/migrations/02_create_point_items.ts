import Knex from "knex";

export async function up(knex: Knex) {
    // CRIAR A TABELA 
    // Cria uma tabela chamada points com estes campos.
    return knex.schema.createTable('point_items', table => {
        table.increments('id').primary();
        table.integer('point_id').notNullable();
        table.integer('item_id').notNullable();
    })

}

export async function down(knex: Knex) {
    // VOLTAR ATRAS, NO CASO DELETAR A TABELA
    knex.schema.dropTable('point_items');
}