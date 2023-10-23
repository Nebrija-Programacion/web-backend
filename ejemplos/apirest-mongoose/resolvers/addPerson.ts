import { Request, Response } from "npm:express@4.18.2";
import PersonModel from "../db/person.ts";

const addPerson = async (req: Request, res: Response) => {
  try {
    const { name, age, dni } = req.body;
    if (!name || !age || !dni) {
      res.status(400).send("Name, dni and age are required");
      return;
    }

    const alreadyExists = await PersonModel.findOne({ dni }).exec();
    if (alreadyExists) {
      res.status(400).send("Person already exists");
      return;
    }

    const newPerson = new PersonModel({ name, age, dni });
    await newPerson.save();

    res.status(200).send({
      name: newPerson.name,
      age: newPerson.age,
      dni: newPerson.dni,
      id: newPerson._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default addPerson;
