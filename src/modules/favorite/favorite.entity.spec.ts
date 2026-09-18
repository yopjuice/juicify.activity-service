import { Favorite } from './favorite.entity.js';
import { FavoriteFixtures } from './fixtures/favorite.fixture.js';

describe('Favorite Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = FavoriteFixtures.props();
      const favorite = new Favorite(props);

      expect(favorite.userId).toBe(props.userId);
      expect(favorite.itemType).toBe(props.itemType);
      expect(favorite.itemId).toBe(props.itemId);
      expect(favorite.createdAt).toBe(props.createdAt);
    });
  });

});
