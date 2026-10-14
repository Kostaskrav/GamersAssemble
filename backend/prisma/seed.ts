import * as argon2 from 'argon2';
import { PostType, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const SEED_PASSWORD = 'Password123!';
const SEED_MARKER = '[seed]';

const seedUsers = [
  {
    email: 'nova.scout@gamersassemble.dev',
    username: 'nova_scout',
    displayName: 'Nova Scout',
  },
  {
    email: 'bug.smasher@gamersassemble.dev',
    username: 'bug_smasher',
    displayName: 'Bug Smasher',
  },
  {
    email: 'idea.forge@gamersassemble.dev',
    username: 'idea_forge',
    displayName: 'Idea Forge',
  },
] as const;

type GameFlavor = {
  bugs: Array<{ title: string; content: string }>;
  fixes: Array<{ title: string; content: string }>;
  ideas: Array<{ title: string; content: string }>;
  comments: string[];
};

const defaultFlavor = (gameName: string): GameFlavor => ({
  bugs: [
    {
      title: `${gameName}: crash after long session`,
      content: `After playing ${gameName} for about 2 hours, the game hard-crashes back to desktop with no error dialog. Happens more often after alt-tabbing.`,
    },
    {
      title: `${gameName}: settings reset on launch`,
      content: `Every few launches ${gameName} forgets my graphics preset and keybinds. Verified game files and it still happens.`,
    },
  ],
  fixes: [
    {
      title: `${gameName}: stutter fix that worked for me`,
      content: `If ${gameName} stutters on the first map load, set the shader cache to a fast SSD and disable fullscreen optimizations. Cleared it up on my rig.`,
    },
  ],
  ideas: [
    {
      title: `${gameName}: better matchmaking filters`,
      content: `Would love region + ping filters in ${gameName}, plus a way to prefer similar-ranked teammates.`,
    },
  ],
  comments: [
    `Same issue in ${gameName} here — especially after the last patch.`,
    `Have you tried verifying files? Helped me once in ${gameName}.`,
    `This is a solid ${gameName} tip, thanks for posting.`,
    `Devs should look at this — ${gameName} needs this QoL.`,
  ],
});

const gameFlavors: Record<string, GameFlavor> = {
  'helldivers-2': {
    bugs: [
      {
        title: 'Stuck on extraction pelican sometimes',
        content:
          'When the pelican lands on uneven terrain, my Helldiver clips into the ramp and cannot board. Mission fails even though the timer is fine.',
      },
      {
        title: 'Stratagem input drops mid-dive',
        content:
          'During heavy bot drops my stratagem arrow inputs randomly fail, so orbitals never call in. Controller and keyboard both do it.',
      },
    ],
    fixes: [
      {
        title: 'Fix for black screen after ship return',
        content:
          'If you get a black screen returning to the destroyer, alt-tab once then back. Forcing borderless window made it stop for me.',
      },
    ],
    ideas: [
      {
        title: 'Let us pin favorite stratagem loadouts',
        content:
          'Please add saved loadout slots per mission type. Swapping the same 4 stratagems before every dive gets old fast.',
      },
    ],
    comments: [
      'For democracy! Also seeing pelican ramp clip issues on rocky maps.',
      'Try delaying the board animation — waiting 1s after land helped me.',
      'Loadout presets would be huge for quickplay divers.',
      'Stratagem dropouts got worse after the last warbond patch for me.',
    ],
  },
  'elden-ring': {
    bugs: [
      {
        title: 'Torrent despawns during huge open-field fights',
        content:
          'In Caelid overworld invasions, Torrent sometimes vanishes and the mount whistle does nothing until I rest at a grace.',
      },
      {
        title: 'Co-op fog walls soft-lock host',
        content:
          'After a co-op boss kill, the host gets stuck behind a fog wall with no prompt. Only fix is reload the area.',
      },
    ],
    fixes: [
      {
        title: 'Stutter near Liurnia: disable volumetric fog',
        content:
          'Cutting volumetric fog and setting grass distance to medium removed the hitching around Raya Lucaria on my 3070.',
      },
    ],
    ideas: [
      {
        title: 'In-game boss recall from map',
        content:
          'A way to re-challenge remembrance bosses without fighting back through the dungeon would make build testing way better.',
      },
    ],
    comments: [
      'Classic FromSoft jank — same Torrent bug near Dragonbarrow.',
      'Try sitting at a Site of Grace; that usually restores the mount.',
      'Boss recall would be amazing for practice runs.',
      'Fog wall soft-lock happened to my friend after Mohg co-op.',
    ],
  },
  'cyberpunk-2077': {
    bugs: [
      {
        title: 'NPC pathing loop in Kabuki market',
        content:
          'Vendors and gang NPCs walk into stalls and spin forever in Kabuki. Quests that need dialogue nearby get stuck.',
      },
      {
        title: 'Ray tracing crash on entering Dogtown',
        content:
          'With path tracing on, entering Dogtown crashes to desktop. Disabling RT reflections stops it.',
      },
    ],
    fixes: [
      {
        title: 'Controller aim assist tweak that feels better',
        content:
          'Lowering horizontal accel and raising deadzone slightly made gunplay in Night City much cleaner on DualSense.',
      },
    ],
    ideas: [
      {
        title: 'Apartment wardrobe sync across safehouses',
        content:
          'Clothes unlocks should sync to every apartment. Swapping drip means fast-traveling across the whole map right now.',
      },
    ],
    comments: [
      'Dogtown RT crash is still happening on 4080 for me too.',
      'Phantom Liberty denser crowds make the Kabuki spin worse.',
      'Wardrobe sync would be peak Night City QoL.',
      'Try DX12 + hardware scheduling off if RT keeps crashing.',
    ],
  },
  'the-witcher-3-wild-hunt': {
    bugs: [
      {
        title: 'Horse camera snaps during gallop',
        content:
          'On next-gen update, Roach camera violently snaps when turning downhill. Makes forest rides rough.',
      },
    ],
    fixes: [
      {
        title: 'HairWorks alternative for FPS',
        content:
          'If HairWorks tanks FPS, use the community hair mod + FSR. Looks close and stays above 60 in Novigrad.',
      },
    ],
    ideas: [
      {
        title: 'Better Gwent deck import between playthroughs',
        content:
          'Let us export/import Gwent collections so NG+ players do not re-grind every innkeeper card.',
      },
    ],
    comments: [
      'Roach camera has been weird since the next-gen patch.',
      'Gwent import would save so many hours.',
      'Novigrad still melts GPUs during festivals.',
      'Try capping at 60 — the horse snap felt milder for me.',
    ],
  },
  'baldurs-gate-3': {
    bugs: [
      {
        title: 'Multiplayer inventory desync after long rest',
        content:
          'After a camp long rest in Act 2, one player loses potions until they rejoin. Host inventory looks fine.',
      },
    ],
    fixes: [
      {
        title: 'Turn-based stutter: lower crowd density',
        content:
          'In Lower City fights, dropping crowd density and disabling DLSS frame gen fixed turn-start hitches.',
      },
    ],
    ideas: [
      {
        title: 'Custom dice skins per character',
        content:
          'Cosmetic dice unlocked per hero would make every skill check feel more personal in multiplayer.',
      },
    ],
    comments: [
      'Inventory desync hit our co-op run after Moonrise.',
      'Larian please let us favorite spellbook presets.',
      'Act 3 density is gorgeous but brutal on mid-range PCs.',
      'Rejoining the lobby fixed the missing potions once for us.',
    ],
  },
  hades: {
    bugs: [
      {
        title: 'Boons UI overlaps on ultrawide',
        content:
          'On 32:9 the boon compare panel clips off-screen so I cannot see Hermes rarity text.',
      },
    ],
    fixes: [
      {
        title: 'Controller rumble soft-lock workaround',
        content:
          'If rumble freezes inputs after a death, unplug the pad for 2 seconds. Steam Input overlay was the culprit.',
      },
    ],
    ideas: [
      {
        title: 'Practice mode against specific bosses',
        content:
          'A training chamber for learning Hades / [REDACTED] patterns without a full underworld run would help a lot.',
      },
    ],
    comments: [
      'Ultrawide UI issues still pop up in the House too.',
      'Escape attempts feel better with that rumble fix.',
      'Boss practice would be perfect for heat climbs.',
      'Skelly would approve of a training chamber.',
    ],
  },
  'stardew-valley': {
    bugs: [
      {
        title: 'Festival collision soft-lock with mods',
        content:
          'During the Egg Festival I got stuck between two NPCs and could only quit to title. Happens with a tiny portrait mod.',
      },
    ],
    fixes: [
      {
        title: 'Lag on big farms: lower debris setting',
        content:
          'End-of-day lag on year 4 farms dropped a lot after clearing junk and lowering shadow quality.',
      },
    ],
    ideas: [
      {
        title: 'Chest auto-sort categories',
        content:
          'Native chest auto-sort by crop/fish/artifact would beat managing 40 labeled boxes in the shed.',
      },
    ],
    comments: [
      'Chest sorting is the most requested QoL for a reason.',
      'Festivals + mods are still a bit fragile.',
      'Try the no-clip debug once if you soft-lock in town.',
      'Year 4 lag is real once the Junimo huts go wild.',
    ],
  },
  'grand-theft-auto-v': {
    bugs: [
      {
        title: 'Online session kick after Cayo setups',
        content:
          'Finishing a Cayo Perico setup sometimes boots the whole invite-only lobby with “connection to session lost”.',
      },
    ],
    fixes: [
      {
        title: 'Reduce texture loss on story mode',
        content:
          'Raising extended texture budget and locking to 60 FPS stopped building pop-in around Downtown LS.',
      },
    ],
    ideas: [
      {
        title: 'Better invite-only job browser',
        content:
          'Let invite-only sessions browse jobs without being pulled into public matchmaking.',
      },
    ],
    comments: [
      'Session kicks after Cayo are painfully common.',
      'Invite-only job browser would save so many friends nights.',
      'Texture loss is still wild near the casino.',
      'Try verifying the Rockstar launcher cache if kicks persist.',
    ],
  },
  'red-dead-redemption-2': {
    bugs: [
      {
        title: 'Black screen after camp cinematic',
        content:
          'Sometimes after a gang camp cutscene the game stays black with audio only. Only alt-f4 recovers.',
      },
    ],
    fixes: [
      {
        title: 'Vulkan vs DX12 stability tip',
        content:
          'On AMD, Vulkan + async compute off stopped the random freezes during long trail rides.',
      },
    ],
    ideas: [
      {
        title: 'Photo mode framing guides',
        content:
          'Rule-of-thirds overlays in photo mode would make frontier screenshots easier without third-party tools.',
      },
    ],
    comments: [
      'Camp black screens happened twice in Chapter 3 for me.',
      'Photo mode guides would be perfect for this game.',
      'Trail freezes near Annesburg here too.',
      'Try windowed borderless before a long ride.',
    ],
  },
  'hollow-knight': {
    bugs: [
      {
        title: 'Controller ghost input in menus',
        content:
          'In the inventory map, the cursor drifts upward on DualSense until I disable Steam Input.',
      },
    ],
    fixes: [
      {
        title: 'Audio crackle on certain benches',
        content:
          'Switching to exclusive fullscreen fixed crackling audio when resting at benches in Deepnest.',
      },
    ],
    ideas: [
      {
        title: 'Boss practice room in Dirtmouth',
        content:
          'A dream practice hall for Pantheon bosses would help a ton without replaying the whole ascent.',
      },
    ],
    comments: [
      'Ghost cursor is a Steam Input issue for me as well.',
      'Dirtmouth practice room would be dreamlike — literally.',
      'Deepnest audio crackle is cursed.',
      'Godmaster already needs a rematch shortcut.',
    ],
  },
  celeste: {
    bugs: [
      {
        title: 'Assist mode icons overlap on Switch docked',
        content:
          'Assist mode indicators cover berry counters on some Chapter 7 screens in docked 1080p.',
      },
    ],
    fixes: [
      {
        title: 'Input delay: turn off VSync',
        content:
          'Disabling VSync and using a 120 Hz cap made dash buffering feel tighter on PC.',
      },
    ],
    ideas: [
      {
        title: 'Room timer ghosts for friends',
        content:
          'Shareable ghost replays per room would make comparing golden strawberry routes way more social.',
      },
    ],
    comments: [
      'VSync off was night-and-day for Chapter 3 tech.',
      'Friend ghosts would be incredible for collab practice.',
      'UI overlap on Switch is minor but annoying.',
      'Madeline would still say this climb is worth it.',
    ],
  },
  'portal-2': {
    bugs: [
      {
        title: 'Co-op desync in Calibration Course',
        content:
          'Partner sees different door states after a portal reset in the first co-op hub puzzles.',
      },
    ],
    fixes: [
      {
        title: 'Mouse acceleration off for precision',
        content:
          'rawinput 1 and m_rawinput 1 made gel shots and portal flicks much more consistent.',
      },
    ],
    ideas: [
      {
        title: 'Native workshop split-screen on PC',
        content:
          'Official split-screen for workshop maps would help couch co-op without console hops.',
      },
    ],
    comments: [
      'Co-op desync still happens after long sessions.',
      'Split-screen workshop support would be amazing.',
      'GLaDOS would call this an acceptable test result.',
      'Try both players reconnecting to the same lobby.',
    ],
  },
  'counter-strike-2': {
    bugs: [
      {
        title: 'Smoke edge peek inconsistency',
        content:
          'On Mirage window, smoke pixels sometimes allow peeks that are invisible on the other side.',
      },
    ],
    fixes: [
      {
        title: 'Lower input lag with fullscreen + FPS cap',
        content:
          'Exclusive fullscreen and capping a bit above refresh reduced my micro-stutters in Deathmatch.',
      },
    ],
    ideas: [
      {
        title: 'Practice map bot difficulty presets',
        content:
          'Saved aim-bot difficulty presets per workshop map would speed up warmups before Faceit.',
      },
    ],
    comments: [
      'Smoke issues feel better than launch but still odd.',
      'Fullscreen exclusive helped my 1% lows a lot.',
      'Warmup presets would be great for team routines.',
      'Seeing the same Mirage window inconsistency.',
    ],
  },
  'among-us': {
    bugs: [
      {
        title: 'Host migration fails mid-meeting',
        content:
          'If the host disconnects during a meeting, the lobby sometimes never migrates and everyone soft-locks.',
      },
    ],
    fixes: [
      {
        title: 'Voice chat echo: lower Discord + in-game',
        content:
          'Disable in-game voice if you use Discord — the double capture was causing echo for our lobby.',
      },
    ],
    ideas: [
      {
        title: 'Spectator notes for friends watching',
        content:
          'Let kicked/dead friends type private notes only visible to other spectators.',
      },
    ],
    comments: [
      'Host migration soft-lock ruined three games last night.',
      'Spectator notes would be hilarious and useful.',
      'Sus. But also please fix meeting desync.',
      'Echo fix works — Discord-only voice is cleaner.',
    ],
  },
  terraria: {
    bugs: [
      {
        title: 'World border lighting hole in Journey',
        content:
          'Near the world edge at night, lighting punches a black rectangle through builds until I reload.',
      },
    ],
    fixes: [
      {
        title: 'Multiplayer desync: frame skip off',
        content:
          'Turning Frame Skip off stopped item duping/desync when four of us dug Hellbridge lanes.',
      },
    ],
    ideas: [
      {
        title: 'Blueprint share codes for builds',
        content:
          'Official share codes for build blueprints would make showcasing arenas and bases easier.',
      },
    ],
    comments: [
      'Lighting holes near the edge are still weird.',
      'Blueprint codes would be chef’s kiss for YouTubers.',
      'Frame Skip tip helped our Journey party.',
      'Terraria networking still needs love in big worlds.',
    ],
  },
  'dark-souls-iii': {
    bugs: [
      {
        title: 'Summon signs vanish after area reload',
        content:
          'Password summon signs disappear after dying once near Pontiff, even with the same password.',
      },
    ],
    fixes: [
      {
        title: 'Blackblade stutter: borderless + FPS cap',
        content:
          'Capping at 60 and using borderless reduced the hitch when switching weapons mid-roll.',
      },
    ],
    ideas: [
      {
        title: 'Arena match history details',
        content:
          'Show loadouts used in Undead Match history so we can study what beat us.',
      },
    ],
    comments: [
      'Password summons around Irithyll are flaky for sure.',
      'Match history loadouts would help PvP learners.',
      'Praise the sun — and stable netcode.',
      'Try re-placing the sign after a bonfire warp.',
    ],
  },
  'destiny-2': {
    bugs: [
      {
        title: 'Raid checkpoint lost after fireteam wipe',
        content:
          'After wiping on a late encounter, returning through orbit sometimes boots us to an earlier checkpoint.',
      },
    ],
    fixes: [
      {
        title: 'Shader apply freeze workaround',
        content:
          'If the character menu freezes while applying shaders, switch characters once. Clears the stuck API call.',
      },
    ],
    ideas: [
      {
        title: 'Loadout linked to activity type',
        content:
          'Auto-equip a saved loadout when launching raids vs. Crucible would save so much tower time.',
      },
    ],
    comments: [
      'Checkpoint losses still happen on newer raids too.',
      'Activity-linked loadouts would be Guardian bliss.',
      'Shader freeze is back this season for me.',
      'Orbit and rejoin usually restores the right point.',
    ],
  },
  'apex-legends': {
    bugs: [
      {
        title: 'Heirloom animation freezes on dropship',
        content:
          'Inspecting an heirloom in the dropship can freeze my legend until we hit the ground.',
      },
    ],
    fixes: [
      {
        title: 'Audio cutoff fix: disable Steam overlay',
        content:
          'Turning off Steam overlay stopped footsteps cutting out during late-ring fights.',
      },
    ],
    ideas: [
      {
        title: 'Challenge tracker on map screen',
        content:
          'Show weekly challenge progress on the map so we do not open the full menu mid-game.',
      },
    ],
    comments: [
      'Dropship freeze is nasty in ranked.',
      'Challenge tracker on map would be excellent QoL.',
      'Steam overlay tip fixed my audio too.',
      'Still waiting on cleaner controller deadzones.',
    ],
  },
  'rocket-league': {
    bugs: [
      {
        title: 'Training pack resets after freeplay switch',
        content:
          'Leaving a pack for freeplay and returning restarts progress instead of continuing the shot.',
      },
    ],
    fixes: [
      {
        title: 'Input lag: turn off VSync + limit FPS',
        content:
          'VSync off and FPS capped to refresh made dribble training feel way more responsive.',
      },
    ],
    ideas: [
      {
        title: 'Save custom training progress in cloud',
        content:
          'Cloud-sync shot progress in packs so switching PCs does not wipe the playlist position.',
      },
    ],
    comments: [
      'Training pack resets are so annoying for warmups.',
      'Cloud progress would help a lot for dual-PC players.',
      'What a save — also please fix ball cam jitter.',
      'VSync tip is mandatory for aerial consistency.',
    ],
  },
  'sekiro-shadows-die-twice': {
    bugs: [
      {
        title: 'Controller vibration soft-locks grappling',
        content:
          'After a long boss attempt, grappling hook prompts stop appearing until I restart the game.',
      },
    ],
    fixes: [
      {
        title: 'Deflect timing: raise brightness slightly',
        content:
          'A slightly brighter gamma made perilous attack tells easier to read without washing out the scene.',
      },
    ],
    ideas: [
      {
        title: 'Reflection of Strength loadout presets',
        content:
          'Let us save combat art + prosthetic combos per boss reflection for faster practice.',
      },
    ],
    comments: [
      'Grapple prompt bug happened after Isshin attempts.',
      'Loadout presets for reflections would be perfect.',
      'Hesitation is defeat — and so is soft-locking.',
      'Brightness tip helped me with Genichiro perilous reads.',
    ],
  },
  'monster-hunter-world': {
    bugs: [
      {
        title: 'SOS flare join fails in Guiding Lands',
        content:
          'Joining Guiding Lands SOS hunts often fails with connection error even when both players are wired.',
      },
    ],
    fixes: [
      {
        title: 'Frame dips: disable background programs',
        content:
          'Closing overlay apps and setting DX12 reduced the hitch when a tempered monster enrages.',
      },
    ],
    ideas: [
      {
        title: 'Loadout sync for layered armor + skills',
        content:
          'One button to swap layered fashion with the matching skill set would speed up hunt prep.',
      },
    ],
    comments: [
      'Guiding Lands SOS errors are still too common.',
      'Layered + skill sync would be quality hunting.',
      'Carted once to a hitch — overlays were the issue.',
      'Happy hunting, and may your mantles never break early.',
    ],
  },
};

function pickRandom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]!;
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j]!, copy[i]!];
  }
  return copy;
}

function getFlavor(slug: string, name: string): GameFlavor {
  return gameFlavors[slug] ?? defaultFlavor(name);
}

function buildPostTemplates(slug: string, name: string) {
  const flavor = getFlavor(slug, name);
  return [
    ...flavor.bugs.map((item) => ({ ...item, type: PostType.BUG })),
    ...flavor.fixes.map((item) => ({ ...item, type: PostType.FIX })),
    ...flavor.ideas.map((item) => ({ ...item, type: PostType.IDEA })),
  ];
}

const platforms = [
  { name: 'PC', slug: 'pc' },
  { name: 'PlayStation 5', slug: 'ps5' },
  { name: 'Xbox Series X/S', slug: 'xbox-series' },
  { name: 'Nintendo Switch', slug: 'nintendo-switch' },
  { name: 'Mobile', slug: 'mobile' },
] as const;

type SeedGame = {
  name: string;
  slug: string;
  description: string;
  releaseDate: string;
  coverImageUrl: string;
  platformSlugs: Array<(typeof platforms)[number]['slug']>;
};

const steamCover = (appId: number) =>
  `https://cdn.cloudflare.steamstatic.com/steam/apps/${appId}/header.jpg`;

const games: SeedGame[] = [
  {
    name: 'Elden Ring',
    slug: 'elden-ring',
    description:
      'An open-world action RPG from FromSoftware. Explore the Lands Between, battle colossal bosses, and forge your own path through a dark fantasy epic.',
    releaseDate: '2022-02-25',
    coverImageUrl: steamCover(1245620),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'Cyberpunk 2077',
    slug: 'cyberpunk-2077',
    description:
      'An open-world RPG set in Night City, a megalopolis obsessed with power, glamour, and body modification. Play as V and chase immortality.',
    releaseDate: '2020-12-10',
    coverImageUrl: steamCover(1091500),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'The Witcher 3: Wild Hunt',
    slug: 'the-witcher-3-wild-hunt',
    description:
      'Play as Geralt of Rivia in a vast open-world RPG filled with meaningful choices, monster hunting, and one of gaming’s most acclaimed stories.',
    releaseDate: '2015-05-19',
    coverImageUrl: steamCover(292030),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch'],
  },
  {
    name: 'Baldur’s Gate 3',
    slug: 'baldurs-gate-3',
    description:
      'A deep Dungeons & Dragons RPG from Larian Studios. Gather a party, shape the story with every choice, and fight turn-based battles with wild freedom.',
    releaseDate: '2023-08-03',
    coverImageUrl: steamCover(1086940),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'Hades',
    slug: 'hades',
    description:
      'A rogue-like dungeon crawler from Supergiant Games. Battle out of the Underworld as Zagreus in stylish combat wrapped in a rich mythic story.',
    releaseDate: '2020-09-17',
    coverImageUrl: steamCover(1145360),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch'],
  },
  {
    name: 'Stardew Valley',
    slug: 'stardew-valley',
    description:
      'Escape to the countryside and build the farm of your dreams. Grow crops, raise animals, mine for ore, and become part of the Pelican Town community.',
    releaseDate: '2016-02-26',
    coverImageUrl: steamCover(413150),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch', 'mobile'],
  },
  {
    name: 'Grand Theft Auto V',
    slug: 'grand-theft-auto-v',
    description:
      'Explore Los Santos in Rockstar’s open-world crime epic. Follow three protagonists through heists, chaos, and the sprawling GTA Online playground.',
    releaseDate: '2013-09-17',
    coverImageUrl: steamCover(271590),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'Red Dead Redemption 2',
    slug: 'red-dead-redemption-2',
    description:
      'An immersive Western epic from Rockstar. Live as Arthur Morgan in a dying outlaw gang across a vast, atmospheric American frontier.',
    releaseDate: '2018-10-26',
    coverImageUrl: steamCover(1174180),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'Hollow Knight',
    slug: 'hollow-knight',
    description:
      'A hand-drawn Metroidvania set in the ruined kingdom of Hallownest. Explore labyrinthine caverns, master precise combat, and uncover ancient secrets.',
    releaseDate: '2017-02-24',
    coverImageUrl: steamCover(367520),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch'],
  },
  {
    name: 'Celeste',
    slug: 'celeste',
    description:
      'A precise platformer about climbing a mountain and facing yourself. Tight controls, tough challenges, and a heartfelt story about anxiety and perseverance.',
    releaseDate: '2018-01-25',
    coverImageUrl: steamCover(504230),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch'],
  },
  {
    name: 'Portal 2',
    slug: 'portal-2',
    description:
      'Valve’s mind-bending puzzle sequel. Use portals, gels, and co-op gadgets to escape Aperture Science with wit, physics, and unforgettable characters.',
    releaseDate: '2011-04-19',
    coverImageUrl: steamCover(620),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch'],
  },
  {
    name: 'Counter-Strike 2',
    slug: 'counter-strike-2',
    description:
      'The modern evolution of the legendary tactical shooter. Tight gunplay, competitive matches, and the Source 2 upgrade fans waited years for.',
    releaseDate: '2023-09-27',
    coverImageUrl: steamCover(730),
    platformSlugs: ['pc'],
  },
  {
    name: 'Among Us',
    slug: 'among-us',
    description:
      'A social deduction party game set in space. Complete tasks as a Crewmate—or sabotage the ship as an Impostor without getting voted out.',
    releaseDate: '2018-06-15',
    coverImageUrl: steamCover(945360),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch', 'mobile'],
  },
  {
    name: 'Terraria',
    slug: 'terraria',
    description:
      'Dig, fight, explore, and build in a randomly generated 2D sandbox adventure. Craft gear, defeat bosses, and shape your world however you like.',
    releaseDate: '2011-05-16',
    coverImageUrl: steamCover(105600),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch', 'mobile'],
  },
  {
    name: 'Dark Souls III',
    slug: 'dark-souls-iii',
    description:
      'The climactic chapter of FromSoftware’s landmark action RPG series. Brutal combat, cryptic lore, and unforgettable boss encounters await.',
    releaseDate: '2016-04-12',
    coverImageUrl: steamCover(374320),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'Destiny 2',
    slug: 'destiny-2',
    description:
      'Bungie’s free-to-play looter shooter. Team up as Guardians, raid alien strongholds, chase powerful gear, and shape the fate of the solar system.',
    releaseDate: '2017-09-06',
    coverImageUrl: steamCover(1085660),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'Apex Legends',
    slug: 'apex-legends',
    description:
      'A free-to-play battle royale from Respawn. Squad up with unique Legends, master movement and gunplay, and outplay rivals in the Apex Games.',
    releaseDate: '2019-02-04',
    coverImageUrl: steamCover(1172470),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch', 'mobile'],
  },
  {
    name: 'Rocket League',
    slug: 'rocket-league',
    description:
      'Soccer, but with rocket-powered cars. Easy to learn, hard to master aerials, team plays, and chaotic competitive matches.',
    releaseDate: '2015-07-07',
    coverImageUrl: steamCover(252950),
    platformSlugs: ['pc', 'ps5', 'xbox-series', 'nintendo-switch'],
  },
  {
    name: 'Sekiro: Shadows Die Twice',
    slug: 'sekiro-shadows-die-twice',
    description:
      'A samurai action adventure from FromSoftware. Master posture-breaking combat, stealth, and resurrection as the one-armed wolf in Sengoku Japan.',
    releaseDate: '2019-03-22',
    coverImageUrl: steamCover(814380),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
  {
    name: 'Monster Hunter: World',
    slug: 'monster-hunter-world',
    description:
      'Hunt towering monsters across living ecosystems. Craft gear from your quarry, team up with friends, and become a legendary hunter.',
    releaseDate: '2018-08-09',
    coverImageUrl: steamCover(582010),
    platformSlugs: ['pc', 'ps5', 'xbox-series'],
  },
];

async function seedPlatformsAndGames() {
  console.log('Seeding platforms...');

  for (const platform of platforms) {
    const existing =
      (await prisma.platform.findUnique({ where: { slug: platform.slug } })) ??
      (await prisma.platform.findUnique({ where: { name: platform.name } }));

    if (existing) {
      await prisma.platform.update({
        where: { id: existing.id },
        data: {
          name: platform.name,
          slug: platform.slug,
        },
      });
    } else {
      await prisma.platform.create({ data: platform });
    }
  }

  const allPlatforms = await prisma.platform.findMany();
  const platformBySlug = new Map(
    allPlatforms.map((platform) => [platform.slug, platform]),
  );

  console.log('Seeding games...');

  for (const game of games) {
    const platformIds = game.platformSlugs
      .map((slug) => platformBySlug.get(slug)?.id)
      .filter((id): id is number => typeof id === 'number');

    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {
        name: game.name,
        description: game.description,
        releaseDate: new Date(game.releaseDate),
        coverImageUrl: game.coverImageUrl,
        platforms: {
          set: platformIds.map((id) => ({ id })),
        },
      },
      create: {
        name: game.name,
        slug: game.slug,
        description: game.description,
        releaseDate: new Date(game.releaseDate),
        coverImageUrl: game.coverImageUrl,
        platforms: {
          connect: platformIds.map((id) => ({ id })),
        },
      },
    });
  }
}

async function ensureSeedUsers() {
  console.log('Seeding users...');
  const passwordHash = await argon2.hash(SEED_PASSWORD);
  const users = [];

  for (const user of seedUsers) {
    const saved = await prisma.user.upsert({
      where: { email: user.email },
      update: {
        username: user.username,
        displayName: user.displayName,
        passwordHash,
      },
      create: {
        email: user.email,
        username: user.username,
        displayName: user.displayName,
        passwordHash,
      },
    });
    users.push(saved);
  }

  return users;
}

async function clearSeededContentForUsers(userIds: number[]) {
  if (userIds.length === 0) return;

  await prisma.comment.deleteMany({
    where: {
      OR: [
        { authorId: { in: userIds }, content: { startsWith: SEED_MARKER } },
        {
          post: {
            authorId: { in: userIds },
            title: { startsWith: SEED_MARKER },
          },
        },
      ],
    },
  });

  await prisma.post.deleteMany({
    where: {
      authorId: { in: userIds },
      title: { startsWith: SEED_MARKER },
    },
  });
}

async function createPostsForUser(
  userId: number,
  allGames: Array<{
    id: number;
    name: string;
    slug: string;
    platforms: Array<{ id: number }>;
  }>,
) {
  const playableGames = allGames.filter((game) => game.platforms.length > 0);
  if (playableGames.length === 0) {
    throw new Error('No games with platforms available for seeding posts');
  }

  const selectedGames = shuffle(playableGames).slice(0, 10);
  while (selectedGames.length < 10) {
    selectedGames.push(pickRandom(playableGames));
  }

  const createdPosts = [];

  for (const game of selectedGames) {
    const templates = buildPostTemplates(game.slug, game.name);
    const template = pickRandom(templates);
    const platformIds = shuffle(game.platforms.map((platform) => platform.id)).slice(
      0,
      Math.max(1, Math.min(2, game.platforms.length)),
    );

    const post = await prisma.post.create({
      data: {
        title: `${SEED_MARKER} ${template.title}`,
        content: `${SEED_MARKER}\n${template.content}`,
        type: template.type,
        authorId: userId,
        gameId: game.id,
        platforms: {
          connect: platformIds.map((id) => ({ id })),
        },
      },
    });

    createdPosts.push(post);
  }

  return createdPosts;
}

async function createCommentsForUser(
  userId: number,
  candidatePosts: Array<{
    id: number;
    game: { name: string; slug: string };
  }>,
) {
  if (candidatePosts.length === 0) return 0;

  const targets = shuffle(candidatePosts).slice(0, 10);
  while (targets.length < 10) {
    targets.push(pickRandom(candidatePosts));
  }

  let created = 0;

  for (const post of targets) {
    const flavor = getFlavor(post.game.slug, post.game.name);
    const body = pickRandom(flavor.comments);

    await prisma.comment.create({
      data: {
        content: `${SEED_MARKER} ${body}`,
        authorId: userId,
        postId: post.id,
      },
    });
    created += 1;
  }

  return created;
}

async function seedUserContent() {
  const createdUsers = await ensureSeedUsers();

  const contentUsers = createdUsers;
  const contentUserIds = contentUsers.map((user) => user.id);

  console.log('Clearing previously seeded posts/comments for target users...');
  await clearSeededContentForUsers(contentUserIds);

  const allGames = await prisma.game.findMany({
    include: { platforms: true },
    orderBy: { id: 'asc' },
  });

  console.log('Creating 10 posts per user...');
  for (const user of contentUsers) {
    await createPostsForUser(user.id, allGames);
    console.log(`  - ${user.email}: 10 posts`);
  }

  const allPosts = await prisma.post.findMany({
    include: {
      game: {
        select: { name: true, slug: true },
      },
    },
  });

  console.log('Creating 10 comments per user...');
  for (const user of contentUsers) {
    const candidates = allPosts.filter((post) => post.authorId !== user.id);
    const pool = candidates.length > 0 ? candidates : allPosts;
    const count = await createCommentsForUser(user.id, pool);
    console.log(`  - ${user.email}: ${count} comments`);
  }
}

async function main() {
  await seedPlatformsAndGames();
  await seedUserContent();

  const [gameCount, platformCount, userCount, postCount, commentCount] =
    await Promise.all([
      prisma.game.count(),
      prisma.platform.count(),
      prisma.user.count(),
      prisma.post.count(),
      prisma.comment.count(),
    ]);

  console.log(
    `Seed complete: ${gameCount} games, ${platformCount} platforms, ${userCount} users, ${postCount} posts, ${commentCount} comments`,
  );
  console.log(`Seed user password: ${SEED_PASSWORD}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
