import { Request, Response } from "npm:express@4.18.2";
import PersonModel from "../db/person.ts";

const deletePerson = async (req: Request, res: Response) => {
  try {
    const { dni } = req.params;
    const person = await PersonModel.findOneAndDelete({ dni }).exec();
    if (!person) {
      res.status(404).send("Person not found");
      return;
    }
    res.status(200).send("Person deleted");
  } catch (error) {
    res.status(404).send(error.message);
    return;
  }
};

export default deletePerson;
