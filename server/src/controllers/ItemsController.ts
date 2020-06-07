import { Request } from "express";
import { Response } from "express";

import knex from "../database/connection";
class ItemsController {
  async index(request: Request, response: Response) {
    // E assim que faz SELECT com o knex:
    const items = await knex("items").select("*");

    const serializedItems = items.map((item) => {
      return {
        id: item.id,
        title: item.title,
        //temos so o nome da imagem com a extensao. Vamos alterar para o caminho completo, para conseguir acha-la
        image_url: `http://192.168.100.5:3333/uploads/${item.image}`,
      };
    });
    return response.json(serializedItems);
  }
}

export default ItemsController;
