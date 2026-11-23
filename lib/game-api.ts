/**
 * Adapter boundary for a future authorized Ragnarok Origin API.
 * The current implementation intentionally uses only curated local catalog data.
 */
export interface GameApiClient {
  getCharacter(nick: string): Promise<{ nick: string; verified: boolean }>;
  getEquipment(slug: string): Promise<{ slug: string; name: string } | null>;
  getInventory(nick: string): Promise<unknown[]>;
}

export class CuratedCatalogGameApi implements GameApiClient {
  async getCharacter(nick: string) {
    return { nick, verified: false };
  }
  async getEquipment() {
    return null;
  }
  async getInventory() {
    return [];
  }
}

export const gameApi: GameApiClient = new CuratedCatalogGameApi();
