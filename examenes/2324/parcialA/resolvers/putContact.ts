// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { ContactModel } from "../db/contact.ts";
import getLocalData from "../lib/worldweather.ts";
import getLocationFromZipAndCountry from "../lib/zipapi.ts";

export const putContact = async (req: Request, res: Response) => {
  const { dni } = req.params;
  const { name, email, cp, isoCountryCode } = req.body;

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
    // check if at least one field is provided
    if (!name && !email && !cp && !isoCountryCode) {
      res.status(400).json({
        message:
          "Please provide at least one field: name, email, cp, isoCountryCode",
      });
      return;
    }

    // check if contact with dni exists
    const contact = await ContactModel.findOne({ dni });
    if (!contact) {
      res.status(404).json({
        message: "Contact not found",
      });
      return;
    }

    // check if cp or isoCountryCode are provided and have changed
    if (
      (cp && cp !== contact.cp) ||
      (isoCountryCode && isoCountryCode !== contact.isoCountryCode)
    ) {
      // get latitude and longitude from cp and isoCountryCode
      const { latitude, longitude } = await getLocationFromZipAndCountry(
        cp || contact.cp,
        isoCountryCode || contact.isoCountryCode
      );
      // get city and country from latitude and longitude
      const { city, country } = await getLocalData(latitude, longitude);
      // update contact

      contact.latitude = latitude;
      contact.longitude = longitude;
      contact.city = city;
      contact.country = country;
    }

    // update rest of the fields
    contact.name = name || contact.name;
    contact.email = email || contact.email;
    contact.cp = cp || contact.cp;
    contact.isoCountryCode = isoCountryCode || contact.isoCountryCode;

    await contact.save();
    res.status(200).send({
      dni,
      name: contact.name,
      email: contact.email,
      cp: contact.cp,
      isoCountryCode: contact.isoCountryCode,
      country: contact.country,
      city: contact.city,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
