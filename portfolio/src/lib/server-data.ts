import fs from "fs/promises";
import path from "path";
import baseData from "@/data/data.json";

export type PortfolioData = typeof baseData;

const dataPath = path.join(process.cwd(), "src", "data", "data.json");

export async function readData(): Promise<PortfolioData> {
  try {
    const raw = await fs.readFile(dataPath, "utf8");
    return JSON.parse(raw) as PortfolioData;
  } catch {
    return baseData as PortfolioData;
  }
}

export async function writeData(data: PortfolioData) {
  const payload = JSON.stringify(data, null, 2);
  await fs.writeFile(dataPath, payload, "utf8");
}
