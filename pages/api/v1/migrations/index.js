import database from "infra/database.js";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import databse from "infra/database.js";

export default async function status(request, response) {
  const dbClient = await database.getNewClient();
  const defaultMigrationOptions = {
    dbClient: dbClient,
    dryRun: true,
    dir: resolve("infra", "migrations"),
    direction: "up",
    verbose: true,
    migrationsTable: "pgmigrations",
  };

  if (request.method === "GET") {
    const pendingMigrations = await migrationRunner(defaultMigrationOptions);
    await dbClient.end();
    response.status(200).json(pendingMigrations);
  }

  if (request.method === "POST") {
    const migratedMigratios = await migrationRunner({
      ...defaultMigrationOptions,
      dryRun: false,
    });
    await dbClient.end();
    if (migratedMigratios.length > 0) {
      return response.status(201).json(migratedMigratios);
    }

    return response.status(200).json(migratedMigratios);
  }

  return response.status(405).end();
}
