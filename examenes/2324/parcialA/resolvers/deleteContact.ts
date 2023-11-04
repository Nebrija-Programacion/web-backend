// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { ContactModel } from "../db/contact.ts";

export const deleteContact = async (req: Request, res: Response) => {
  const { dni } = req.params;

  if (!dni) {
    res.status(400).json({
      message: "Please provide dni",
    });
    return;
  }

  if (typeof dni !== "string") {
    res.status(400).json({
      message: "Please provide dni as string",
    });
    return;
  }

  try {
    const contact = await ContactModel.findOneAndDelete({ dni });
    if (!contact) {
      res.status(404).json({
        message: "Contact not found",
      });
      return;
    }

    res.status(200).json({
      message: "Contact deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
