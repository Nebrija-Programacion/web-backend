// @ts-expect-error
import { Request, Response } from "npm:express@4.17.1";
import { MonumentModel } from "../db/monument.ts";

export const deleteMonument = async (req: Request, res: Response) => {
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
    const contact = await MonumentModel.findByIdAndDelete(id);
    if (!contact) {
      res.status(404).json({
        message: "Monument not found",
      });
      return;
    }

    res.status(200).json({
      message: "Monument deleted",
    });
  } catch (error) {
    res.status(500).json({
      message: "Something went wrong",
    });
  }
};
