import { ATTRIBUTES, PlayerSectionsType, } from '@pericles/constants';

export default function hasSectionsInAdvance(
  sections: PlayerSectionsType[],
  key: number = 0
): boolean {
  return sections.length - 1 > key + ATTRIBUTES.MISC.MIN_SECTIONS;
}
