// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { ContactModel } from "../db/contact.ts";
import getLocationFromZipAndCountry from "../lib/zipapi.ts";
import getLocalData from "../lib/worldweather.ts";

export const pushContact = async (req: Request, res: Response) => {
  const { dni, name, email, cp, isoCountryCode } = req.body;
  // check if all fields are provided
  if (!dni || !name || !email || !cp || !isoCountryCode) {
    res.status(400).json({
      message:
        "Please provide all fields: dni, name, email, cp, isoCountryCode",
    });
    return;
  }

  // check if all fields are strings
  if (
    typeof dni !== "string" ||
    typeof name !== "string" ||
    typeof email !== "string" ||
    typeof cp !== "string" ||
    typeof isoCountryCode !== "string"
  ) {
    res.status(400).json({
      message:
        "Please provide all fields as strings: dni, name, email, cp, isoCountryCode",
    });
    return;
  }

  // check if dni already exists
  const exists = await ContactModel.exists({ dni });
  if (exists) {
    res.status(409).json({
      message: "Contact already exists",
    });
    return;
  }

  try {
    // get latitude and longitude from cp and isoCountryCode
    const { latitude, longitude } = await getLocationFromZipAndCountry(
      cp,
      isoCountryCode
    );

    // get country and city from latitude and longitude
    const { city, country } = await getLocalData(latitude, longitude);
    try {
      const contact = new ContactModel({
        dni,
        name,
        email,
        cp,
        isoCountryCode,
        country,
        city,
        latitude,
        longitude,
      });

      await contact.save();

      // send only the data that is public to the client
      res.status(200).send({
        dni,
        name,
        email,
        cp,
        isoCountryCode,
      });
    } catch (error) {
      res.status(400).json({
        error: error.message,
        message: "Problema saving data to MongoDB",
      });
      return;
    }
  } catch (error) {
    res.status(400).json({
      error: error.message,
      message: "problem getting data from cp or isocode",
    });
    return;
  }
};
