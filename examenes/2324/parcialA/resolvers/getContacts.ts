// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { ContactModel } from "../db/contact.ts";
import getLocalData from "../lib/worldweather.ts";

export const getContactFromDNI = async (req: Request, res: Response) => {
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
    const contact = await ContactModel.findOne({ dni });

    if (!contact) {
      res.status(404).json({
        message: "Contact not found",
      });
      return;
    }

    const { localTime, weather } = await getLocalData(
      contact.latitude,
      contact.longitude
    );
    const contactData = {
      dni,
      name: contact.name,
      email: contact.email,
      cp: contact.cp,
      isoCountryCode: contact.isoCountryCode,
      country: contact.country,
      city: contact.city,
      localTime,
      weather,
    };
    res.status(200).send(contactData);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getAllContacts = async (req: Request, res: Response) => {
  try {
    const contacts = await ContactModel.find();
    res
      .status(200)
      .send(
        contacts.map((contact) => ({ name: contact.name, dni: contact.dni }))
      );
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
