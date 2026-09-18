import { Injectable } from '@nestjs/common';
import { FavoriteRepo } from '../../infrastructure/favorite/favorite.repo.js';
import { AddPayload, DeletePayload, GetbyUserPayload, GetSubsetPayload } from './interfaces/index.js';

@Injectable()
export class FavoriteService {
  constructor(private readonly repo: FavoriteRepo) {}

  async add(payload: AddPayload): Promise<void> {
    await this.repo.add(payload);
  }

  async delete(data: DeletePayload): Promise<void> {
    await this.repo.delete(data);
  }

  async getLikedSubset(data: GetSubsetPayload): Promise<string[]> {
    const result = await this.repo.getLikedSubset(data);
    return result;
  }

  async getByUser(data: GetbyUserPayload): Promise<string[]> {
    const result = await this.repo.getByUser(data);
    return result;
  }
}
