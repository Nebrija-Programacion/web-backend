// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { MonumentModel } from "../db/monument.ts";
import getLocalData from "../lib/worldweather.ts";
import getLocationFromZipAndCountry from "../lib/zipapi.ts";

export const putMonument = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description, cp, isoCountryCode } = req.body;

  if (!id) {
    res.status(400).json({
      message: "Please provide id",
    });
    return;
  }

  if (typeof id !== "string") {
    res.status(400).json({
      message: "Please provide id as string",
    });
    return;
  }

  try {
    // check if at least one field is provided
    if (!name && !description && !cp && !isoCountryCode) {
      res.status(400).json({
        message:
          "Please provide at least one field: name, description, cp, isoCountryCode",
      });
      return;
    }

    // check if monument with id exists
    const monument = await MonumentModel.findById(id);
    if (!monument) {
      res.status(404).json({
        message: "Monument not found",
      });
      return;
    }

    // check if cp or isoCountryCode are provided and have changed
    if (
      (cp && cp !== monument.cp) ||
      (isoCountryCode && isoCountryCode !== monument.isoCountryCode)
    ) {
      // get latitude and longitude from cp and isoCountryCode
      const { latitude, longitude } = await getLocationFromZipAndCountry(
        cp || monument.cp,
        isoCountryCode || monument.isoCountryCode
      );
      // get city and country from latitude and longitude
      const { city, country } = await getLocalData(latitude, longitude);
      // update monument

      monument.latitude = latitude;
      monument.longitude = longitude;
      monument.city = city;
      monument.country = country;
    }

    // update rest of the fields
    monument.name = name || monument.name;
    monument.description = description || monument.description;
    monument.cp = cp || monument.cp;
    monument.isoCountryCode = isoCountryCode || monument.isoCountryCode;

    await monument.save();
    res.status(200).send({
      id,
      name: monument.name,
      description: monument.description,
      cp: monument.cp,
      isoCountryCode: monument.isoCountryCode,
      country: monument.country,
      city: monument.city,
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
