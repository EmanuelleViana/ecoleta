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
      image: request.file.filename,
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
  
    
    const pointItems = items
        .split(',')
        .map((item:string)=>Number(item.trim()))
        .map((item_id: number) => {
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

    const serializedPoint = {
        ...point,
        image_url: `http://192.168.100.5:3333/uploads/${point.image}`,
      };


    const items = await knex('items')
      .join('point_items', 'items.id', '=', 'point_items.item_id')
      .where('point_items.point_id', id)
      .select('items.title')

    return response.json({point:serializedPoint, items});
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

      const serializedPoints = points.map((point) => {
        return {
          ...point,
          image_url: `http://192.168.100.5:3333/uploads/${point.image}`,
        };
      });


    return response.json(serializedPoints);

  }
}
export default PointsController;
