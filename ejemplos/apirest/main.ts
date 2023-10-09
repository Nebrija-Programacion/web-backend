import express, { Request, Response } from "npm:express@4.18.2";
import { getLocation } from "./getlocation.ts";
import { getWeather } from "./getweather.ts";

const app = express();

app
  .get("/", (req: Request, res: Response) => {
    res.status(200).send("Hello World!");
  })
  .get(
    "/location/:countrycode/:zipcode",
    async (req: Request, res: Response) => {
      try {
        const zipcode = req.params.zipcode;
        const countrycode = req.params.countrycode;
        if (isNaN(Number(zipcode))) {
          res.status(400).send("Zipcode must be a number");
          return;
        }

        if (countrycode.length !== 2) {
          res.status(400).send("Country code must be 2 characters");
          return;
        }

        const location = await getLocation(zipcode, countrycode);
        res.status(200).send(location);
      } catch (e) {
        res.status(500).send(e.message);
      }
    }
  )
  .get(
    "/weather/:countrycode/:zipcode",
    async (req: Request, res: Response) => {
      try {
        const zipcode = req.params.zipcode;
        const countrycode = req.params.countrycode;

        if (isNaN(Number(zipcode))) {
          res.status(400).send("Zipcode must be a number");
          return;
        }

        if (countrycode.length !== 2) {
          res.status(400).send("Country code must be 2 characters");
          return;
        }

        // call getlocation
        const location = await getLocation(zipcode, countrycode);
        // call getweather
        const weather = await getWeather(location);
        // return weather
        res.status(200).send({
          location: weather.location,
          temperature: weather.temperature,
          description: weather.description,
        });
      } catch (error) {
        res.status(500).send(error.message);
      }
    }
  );

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
