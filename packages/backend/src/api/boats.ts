import express, { Request, Response } from "express";
import { handleFilteredSlugWeek } from "../utils/handleFilteredSlugWeek";
import { BoatQuery, WeeklyPriceHistory } from "../types/priceBoat";

const app: express.Application = express();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome endpoint
 *     description: Returns a welcome message.
 *     responses:
 *       200:
 *         description: Hello World
 *         content:
 *           text/plain:
 *             example: "Hello World"
 */
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World");
});

/**
 * @swagger
 * /boat:
 *   get:
 *     summary: Get boat data
 *     description: Retrieves boat data for a specific slug, week, and year.
 *     parameters:
 *       - in: query
 *         name: slug
 *         schema:
 *           type: string
 *           example: "example-boat"
 *         required: true
 *         description: The slug of the boat
 *       - in: query
 *         name: week
 *         schema:
 *           type: string
 *           example: "12"
 *         required: true
 *         description: The week number
 *       - in: query
 *         name: year
 *         schema:
 *           type: string
 *           example: "2025"
 *         required: true
 *         description: The year
 *     responses:
 *       200:
 *         description: A successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 slug:
 *                   type: string
 *                   example: "example-boat"
 *                 boat:
 *                   $ref: '#/components/schemas/WeeklyPriceHistory'
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             example:
 *               error: "Invalid parameters"
 *       404:
 *         description: Boat not found
 *         content:
 *           application/json:
 *             example:
 *               error: "Boat not found"
 */
app.get<{}, { slug: string; boat: WeeklyPriceHistory }, {}, BoatQuery>("/boat", handleFilteredSlugWeek);

export default app;
