// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { MonumentModel } from "../db/monument.ts";
import getLocationFromZipAndCountry from "../lib/zipapi.ts";
import getLocalData from "../lib/worldweather.ts";

export const pushMonument = async (req: Request, res: Response) => {
  const { name, description, cp, isoCountryCode } = req.body;
  // check if all fields are provided
  if (!name || !description || !cp || !isoCountryCode) {
    res.status(400).json({
      message:
        "Please provide all fields: dni, name, description, cp, isoCountryCode",
    });
    return;
  }

  // check if all fields are strings
  if (
    typeof name !== "string" ||
    typeof description !== "string" ||
    typeof cp !== "string" ||
    typeof isoCountryCode !== "string"
  ) {
    res.status(400).json({
      message:
        "Please provide all fields as strings: dni, name, description, cp, isoCountryCode",
    });
    return;
  }

  // check if dni already exists
  const exists = await MonumentModel.exists({ name, cp });
  if (exists) {
    res.status(409).json({
      message: "Monument already exists",
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
      const monument = new MonumentModel({
        name,
        description,
        cp,
        isoCountryCode,
        country,
        city,
        latitude,
        longitude,
      });

      await monument.save();

      // send only the data that is public to the client
      res.status(200).send({
        name,
        description,
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
