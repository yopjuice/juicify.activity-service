import { Interaction } from './interaction.entity.js';
import { InteractionFixtures } from './fixtures/interaction.fixture.js';

describe('Interaction Entity', () => {
  describe('Creation & Getters', () => {
    it('should correctly initialize and return properties via getters', () => {
      const props = InteractionFixtures.props();
      const interaction = new Interaction(props);

      expect(interaction.id).toBe(props.id);
      expect(interaction.userId).toBe(props.userId);
      expect(interaction.itemType).toBe(props.itemType);
      expect(interaction.itemId).toBe(props.itemId);
      expect(interaction.actionType).toBe(props.actionType);
      expect(interaction.weight).toBe(props.weight);
      expect(interaction.createdAt).toBe(props.createdAt);
    });
  });

});
