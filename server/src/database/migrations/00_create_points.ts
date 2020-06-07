import Knex from "knex";

export async function up(knex: Knex) {
    // CRIAR A TABELA 
    // Cria uma tabela chamada points com estes campos.
    return knex.schema.createTable('points', table => {
        table.increments('id').primary();
        table.string('image').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('whatsapp').notNullable();

        table.decimal('latitude').notNullable();
        table.decimal('longitude').notNullable();

        table.string('city').notNullable();
        table.string('uf').notNullable();
    })

}

export async function down(knex: Knex) {
    // VOLTAR ATRAS, NO CASO DELETAR A TABELA
    knex.schema.dropTable('points');
}