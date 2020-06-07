import { Request, Response, response } from "express";
import knex from "../database/connection";

class PointsController {
  async create(request: Request, response: Response) {
    // DESESTRUTURAÇÃO: Objeto a esqeurda
    const {
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
      items,
    } = request.body;

    const trx = await knex.transaction();

    const point = {
      image:
        "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=300&q=50",
      name,
      email,
      whatsapp,
      latitude,
      longitude,
      city,
      uf,
    }
    // assim que fazemos INSERT com o knex
    const insertedIds = await trx("points").insert(point);

    const point_id = insertedIds[0];
    //SHORT SINTAX acima: Como temos os mesmos nomes nao precisamos fazer name: name
    const pointItems = items.map((item_id: number) => {
      return {
        item_id,
        point_id,
      };
    });
    await trx("point_items").insert(pointItems);
    trx.commit();
    return response.json({ id: point_id, ...point });
  }

  async show(request: Request, response: Response) {
    const { id } = request.params;
    // assim que faz SELECT simples por id, pegando so um registro
    const point = await knex('points').where('id' , id).first();

    if(!point) {
      response.status(400).json({message: 'No point found.'});
    }
    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return response.json({point, items});
  }

  async index(request: Request, response: Response) {
    // cidade, uf, items(query params)
    const { cidade, uf, items} = request.query;

    // elementos vem com string com ids separados por virgulas.
    const parsedItems = String(items)
      .split(',')
      .map(item => Number(item.trim()));

    const points = await knex('points')
      .join('point_items', 'points.id', '=', 'point_items.point_id')
      .whereIn('point_items.item_id', parsedItems)
      .where('city', String(cidade))
      .where('uf', String(uf))
      .distinct()
      .select('points.*');

    return response.json(points);

  }
}
export default PointsController;
