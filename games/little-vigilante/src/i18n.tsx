import { createI18nApi, declareComponentKeys } from 'i18nifty';
import { Text } from '@atoms/Text';
import { colorBySlotNumber } from '@explorers-club/styles';
import {
  colorByTeam,
  displayNameByRole,
  getTeamThemeColor,
  teamByRole,
} from './meta/little-vigilante.constants';
import { Role } from './schema';
export { declareComponentKeys };

//List the languages you with to support
export const languages = ['en'] as const;

//If the user's browser language doesn't match any
//of the languages above specify the language to fallback to:
export const fallbackLanguage = 'en';

export type Language = typeof languages[number];

export type LocalizedString = Parameters<typeof resolveLocalizedString>[0];

export const {
  useTranslation,
  resolveLocalizedString,
  useLang,
  $lang,
  useResolveLocalizedString,
  /** For use outside of React */
  getTranslation,
} = createI18nApi<typeof import('./ui/organisms/chat.component').i18n>()(
  { languages, fallbackLanguage },
  {
    en: {
      MessageComponent: {
        night_phase: 'Night phase begins',
        discuss: 'Discuss!',
        vote: 'Vote!',
        role_assign: ({ role }) => `You are the ${displayNameByRole[role]}`,
        player_role: ({ name, role, slotNumber }) => (
          <Text>
            <Text
              variant={colorBySlotNumber[slotNumber]}
              css={{ fontWeight: 'bold', display: 'inline' }}
            >
              {name}
            </Text>{' '}
            is the {displayNameByRole[role as Role]}.
          </Text>
        ),
        you_won: `You Won!`,
        you_lost: `You Lost`,
        vigilante_ability_fallback: ({ unusedRole }) => (
          <Text size={1}>
            <Text>
              <strong>{displayNameByRole[unusedRole as Role]}</strong> is not
              being played by another player
            </Text>
          </Text>
        ),
        vigilante_ability_primary: ({
          sidekickPlayerName,
          sidekickSlotNumber,
        }) => (
          <Text size={1}>
            <Text
              variant={colorBySlotNumber[sidekickSlotNumber]}
              css={{ fontWeight: 'bold', display: 'inline' }}
            >
              {sidekickPlayerName}
            </Text>{' '}
            <>
              is the{' '}
              <Text
                variant="crimson"
                css={{ fontWeight: 'bold', display: 'inline' }}
              >
                Sidekick
              </Text>
            </>
          </Text>
        ),
        twin_girl_ability: ({ twinBoyPlayerName, twinBoySlotNumber }) => (
          <Text>
            {twinBoyPlayerName && twinBoySlotNumber ? (
              <>
                <Text
                  css={{ display: 'inline', fontWeight: 'bold' }}
                  variant={colorBySlotNumber[twinBoySlotNumber]}
                >
                  {twinBoyPlayerName}
                </Text>{' '}
                is your twin.
              </>
            ) : (
              <Text>You are the only twin</Text>
            )}
          </Text>
        ),
        twin_boy_ability: ({ twinGirlPlayerName, twinGirlSlotNumber }) => (
          <Text>
            {twinGirlPlayerName && twinGirlSlotNumber ? (
              <>
                <Text
                  css={{ display: 'inline', fontWeight: 'bold' }}
                  variant={colorBySlotNumber[twinGirlSlotNumber]}
                >
                  {twinGirlPlayerName}
                </Text>{' '}
                is your twin.
              </>
            ) : (
              <Text>You are the only twin</Text>
            )}
          </Text>
        ),
        monk_ability: ({ monkRole, monkSlotNumber }) => (
          <Text>
            <Text
              variant={colorBySlotNumber[monkSlotNumber]}
              css={{ fontWeight: 'bold', display: 'inline' }}
            >
              You
            </Text>{' '}
            are the{' '}
            <Text variant={getTeamThemeColor(teamByRole[monkRole as Role])}>
              {displayNameByRole[monkRole as Role]}
            </Text>
          </Text>
        ),
        butler_ability: ({
          vigilanteSlotNumber,
          vigilantePlayerName,
          sidekickSlotNumber,
          sidekickPlayerName,
        }) => (
          <Text size={1}>
            <Text
              variant={colorBySlotNumber[vigilanteSlotNumber]}
              css={{ fontWeight: 'bold', display: 'inline' }}
            >
              {vigilantePlayerName}
            </Text>{' '}
            <>
              is the{' '}
              <Text
                variant="crimson"
                css={{ fontWeight: 'bold', display: 'inline' }}
              >
                Vigilante
              </Text>
              {sidekickPlayerName && sidekickSlotNumber ? (
                <>
                  {' '}
                  and{' '}
                  <Text
                    variant={colorBySlotNumber[sidekickSlotNumber]}
                    css={{ fontWeight: 'bold', display: 'inline' }}
                  >
                    {sidekickPlayerName}
                  </Text>{' '}
                  is the{' '}
                  <Text
                    variant="crimson"
                    css={{ fontWeight: 'bold', display: 'inline' }}
                  >
                    Sidekick
                  </Text>
                  .
                </>
              ) : (
                <>.</>
              )}
            </>
          </Text>
        ),
        sidekick_ability: ({ vigilanteSlotNumber, vigilantePlayerName }) => (
          <Text size={1}>
            <Text
              variant={colorBySlotNumber[vigilanteSlotNumber]}
              css={{ fontWeight: 'bold', display: 'inline' }}
            >
              {vigilantePlayerName}
            </Text>{' '}
            <>
              is the{' '}
              <Text
                variant="crimson"
                css={{ fontWeight: 'bold', display: 'inline' }}
              >
                Vigilante
              </Text>
            </>
          </Text>
        ),
        winners: ({
          vigilanteSlotNumber,
          vigilantePlayerName,
          sidekickPlayerName,
          sidekickSlotNumber,
        }) => (
          <Text size={1}>
            <Text
              variant={colorBySlotNumber[vigilanteSlotNumber]}
              css={{ fontWeight: 'bold', display: 'inline' }}
            >
              {vigilantePlayerName}
            </Text>{' '}
            {sidekickPlayerName && sidekickSlotNumber ? (
              <>
                and{' '}
                <Text
                  variant={colorBySlotNumber[sidekickSlotNumber]}
                  css={{ fontWeight: 'bold', display: 'inline' }}
                >
                  {sidekickPlayerName}
                </Text>{' '}
                are the{' '}
                <Text
                  variant="crimson"
                  css={{ fontWeight: 'bold', display: 'inline' }}
                >
                  Vigilantes
                </Text>
                .
              </>
            ) : (
              <>
                is the{' '}
                <Text
                  variant="crimson"
                  css={{ fontWeight: 'bold', display: 'inline' }}
                >
                  Vigilante
                </Text>
              </>
            )}
          </Text>
        ),
      },
    },
  }
);
