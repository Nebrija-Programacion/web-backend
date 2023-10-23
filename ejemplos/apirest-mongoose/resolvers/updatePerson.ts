import { Request, Response } from "npm:express@4.18.2";
import PersonModel from "../db/person.ts";

const updatePerson = async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const { name, age } = req.body;
    if (!name || !age) {
      res.status(400).send("Name and age are required");
      return;
    }

    const updatedPerson = await PersonModel.findOneAndUpdate(
      { dni },
      { name, age },
      { new: true }
    ).exec();

    if (!updatedPerson) {
      res.status(404).send("Person not found");
      return;
    }

    res.status(200).send({
      name: updatedPerson.name,
      age: updatedPerson.age,
      dni: updatedPerson.dni,
      id: updatedPerson._id.toString(),
    });
  } catch (error) {
    res.status(500).send(error.message);
    return;
  }
};

export default updatePerson;
