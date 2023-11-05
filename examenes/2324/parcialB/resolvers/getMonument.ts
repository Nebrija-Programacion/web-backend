// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { MonumentModel } from "../db/monument.ts";
import getLocalData from "../lib/worldweather.ts";

export const getMonumentFromID = async (req: Request, res: Response) => {
  const { id } = req.params;

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
    const monument = await MonumentModel.findById(id);

    if (!monument) {
      res.status(404).json({
        message: "Monument not found",
      });
      return;
    }

    const { localTime, weather } = await getLocalData(
      monument.latitude,
      monument.longitude
    );
    const monumentData = {
      id,
      name: monument.name,
      description: monument.description,
      cp: monument.cp,
      isoCountryCode: monument.isoCountryCode,
      country: monument.country,
      city: monument.city,
      localTime,
      weather,
    };
    res.status(200).send(monumentData);
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};

export const getAllMonuments = async (req: Request, res: Response) => {
  try {
    const monuments = await MonumentModel.find();
    res.status(200).send(
      monuments.map((monument) => ({
        name: monument.name,
        id: monument.id,
        country: monument.country,
      }))
    );
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
