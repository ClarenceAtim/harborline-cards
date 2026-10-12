// PRODUCT IMAGES
// Each entry maps a product name to the image hash used by the reference retailer's listing
// for that same product (retrieved 2026-10-09). The slug of the name is the lookup key.
//
// IMAGE_MODE "remote": images load from the retailer's CDN (works immediately; fine for a demo).
// IMAGE_MODE "local" : images load from /public/products/<hash>.webp. Run `npm run download-images`
//                      once on your own computer to fetch them, then set IMAGE_MODE = "local".
// Products with no entry here show a labelled placeholder. A broken image falls back automatically.
// Images belong to their respective owners; use for the educational demo only and replace with
// your own or manufacturer-permitted photos before a real launch.

import { slugify } from "./format";

export const IMAGE_MODE: "remote" | "local" = "remote";

const raw: Record<string, string> = {
  // ---- Pokémon ----
  "Pokemon Scarlet & Violet Paldea Evolved Checklane Blister Pack": "3c88512ac891a6045cc8b956a6f71854f0a8f03b5b0e9413ac9d935dd62c112f",
  "Pokemon Sword & Shield Fusion Strike Booster Pack": "3e0646fe9f8cead6087fced8edb7c199671a71b1de6c24c0a6ec0349fc8cdb6c",
  "Pokemon Mega Evolution Moonlit Tin 6 Box Case": "01a8ccdace0d8bc2ce46bfa7180e994853c8c2fde6d67823270e4832f6c7a978",
  "Pokemon Scarlet & Violet Prismatic Evolutions Poster Collection Box": "8104794c1cc34d5cd6f373c774dd156a0f43e02af06cb7642a7e989eb1ca285c",
  "Pokemon Scarlet & Violet 151 Ultra Premium Collection Box": "e7efe46b3d90f83ca12f6c2e49c5ffc92aa686c3eb14bdfdc88466492cf6ab08",
  "Pokemon Scarlet & Violet Destined Rivals Booster Box": "cce9f52f1401e57f42b1c9ec98a24b806840be8f1cc06d9ee1aaaae244cf53ed",
  "Pokemon Scarlet & Violet Paldea Evolved Booster Box": "21dd70020f20902a6c1c3b4c51aad11a905fddc1b9cd1f8c2c7a94022e121b13",
  "Pokemon Scarlet & Violet Paradox Rift Booster Pack": "008c47c13b2886e8e6509bb4d6a20a0b59e8f5803b258561720b183ec01c2106",
  "Pokemon Mega Evolution Chaos Rising Sleeved Booster Pack": "df8403624354dbb95cca6e762517e8704668303c9dc893a711ee1a172cc6d931",
  "Pokemon Sword & Shield Silver Tempest Checklane Blister Pack": "4b91447d4e15c1582b57ff1062b7f4cf729315fc5341b5372988de1a8c7eb60f",
  "Pokemon Mega Evolution Chaos Rising Checklane Blister Pack": "d4cf1ae6384bcf75b724f166de5c051547f5607e4fd76ef1e4feddbd4cd5ac0a",
  "Pokemon Scarlet & Violet Surging Sparks Booster Pack": "f861584bc73397a02a65043c53c4894a3984ccf070cabb7191bf71f710506c58",
  "Pokemon Sword & Shield Astral Radiance Booster Pack": "a3a8af1f112e03a92662b7239a8a2b07456f9ac0b102db4e5a044bdada8a72df",
  "Pokemon Sword & Shield Fusion Strike Elite Trainer Box": "edbc9f5b92496c5ce76728edaf788757f182a0d38710efae503e8bce643a4e2a",
  "Pokemon Scarlet & Violet Obsidian Flames Booster Pack": "26d9a3104b4f535d42c1599f52914c1548b352c11ba5a02f45197d889e52eeb2",
  "Pokemon Mega Evolution Pitch Black Elite Trainer Box": "3cd34a190903a0a7beb439260b5d94e3a11f4318284f16e625726410d519f040",
  "Pokemon Mega Evolution Ascended Heroes Booster Bundle Box": "ec9295e123aae2a0e14c48c004e2b4b4c0d4de2e8486715b94eb47faa97649a7",
  "Pokemon Scarlet & Violet Destined Rivals Elite Trainer Box": "74e20c25da751707b148fd746ce24a78546bf52c045aa9b6babc0b5edec55bd8",
  "Pokemon Sword & Shield Vivid Voltage Booster Pack": "378f280437a23b4860463e934229614b02e4d9676972402d6f3f6981e26db351",
  "Pokemon Scarlet & Violet Prismatic Evolutions Super-Premium Collection Box": "96967ff350978a9bd3b73c01a408c7e26c4825c89c3a92ab54d1bfdff136828d",
  "Pokemon Mega Evolution Chaos Rising Elite Trainer Box": "f813d116bf00698828bd2d976503b1d9022687062a257fca59f228f08c6318ef",
  "Pokemon Scarlet & Violet Paldea Evolved Elite Trainer Box": "fe09a4e3c20d94afcd3cfbedf01c22d168d7e2bd25c000970a59732cc8c9901f",
  "Pokemon Sword & Shield Lost Origin Booster Pack": "db4a0c118ebb6645c6607a1e168d2b35a019a94da3d16d7fcee525c77ef71374",
  "Pokemon Scarlet & Violet Prismatic Evolutions Poster Collection 6 Box Case": "0778acf3f61ca36c5b72d9caf6966b96f7edb6a87c0bbc42415dbafade9941cf",

  // ---- Baseball ----
  "2021 Bowman Chrome Baseball Hobby Box": "3268e1137f9a9ccc209758ff4b926e35b1dd6e18ddf68be601a67786fd4d6031",
  "2021 Panini Select Baseball Hobby Box": "d743e84fba479e2da16c59643caafe11e708ce2f82a763a1df095ad98eff85cd",
  "2023 Leaf Trinity Baseball Mega Box": "b14a6eac7bd440e0c48ef1d44dd71e55e1a6c454edd1bc1c9e4be9898502b499",
  "2026 Topps Chrome Baseball Hobby Box": "68d25a8ee598e421fdfd3d11ed2ba6093f7ec7a6f3760b558e6187688e051fd8",
  "2026 Panini Prizm Baseball Hobby Blaster Box": "8750dc1938032bfb448ba2293e860a1979542fd6f034a5634085d3d2c3143ddf",
  "2026 Topps Chrome Baseball Value Box": "b6a4febd4fc53ba8eaf643e0f297ae26d72a641552389c214f6ada661b09848b",
  "2026 Topps Series 2 Baseball Hobby Box": "9dd4e39a7ea85ad8298f61f4e711b06a97f9b190a8b18f90770aedd3e262e321",
  "2025 Panini Select Baseball Hobby Box": "734eb41792bb03e5a0bd849defedc91b83bbdfbea55b49f974035f37869bcba6",
  "2026 Topps Chrome Baseball Jumbo Box": "55ef60a651418f2cc4e0a7360765e65899f59276cacb608e8516b8aafc81426d",
  "2026 Bowman Baseball Hobby Box": "91b2eb451dcce1eca22dae018c81b453097e1ee6d730d1f0d26449b4dc3d2a02",
  "2024 Leaf Press Pass Premium Baseball Hobby Box": "62a84646f4d533393cff0c83948b6ffe166294e982e64d98dc58a7a0e487f0a6",
  "2026 Topps Baseball Complete Hobby Factory Set 8 Box Case": "d25ac671b55091ce1c531bfee5dbbe69d0a89bc786ab6b044c7d4e366350933d",

  // ---- Basketball ----
  "2023/24 Panini Prizm Basketball Hobby Box": "d5347685a87ecc6cb00351507522edc230ba0d3aac25bbfb8aa07c41c4277ce1",
  "2020/21 Panini Prizm Basketball Fast Break Box": "2e7ec3712ae34b803b0f78766514e3ed81d9f19225fe1b913dceb05697fd648c",
  "2020/21 Panini Absolute Memorabilia Basketball Hobby Box": "a93cb70a2a6e2f31dc2b03c06b3584cc8eff62cb0a35a8acecef3fd33156906c",
  "2023/24 Panini Select Basketball Hanger Box": "462dd561fb4759df6bc93129365137e4c553830c1fa3f3b460703caac7810aa0",
  "2024/25 Topps Chrome Basketball Blaster Box": "5035db33fe9ec9864425572246c7085eeeda77b27765fc7d107ec3b5b24f5256",
  "2024/25 Topps Chrome Basketball Mega Box": "878315df98703354658873a09e06f10cd1ff6ececc67822d23a55608e4a883af",
  "2025/26 Bowman Basketball Mega Box": "f555e30ed680fdeb06a6c356b008c1b093c11b5b4523c989592b0bf8c3c7793d",
  "2025/26 Topps Chrome Basketball Hobby Box": "c6c7c6b1921ca76e12cbb2e1543fba1f04d958e9b75ac68c94f9c88af9a2be33",
  "2025/26 Bowman Basketball Blaster Box": "6445484c55b770006d21de5a5f5b077f6c4d652381780eb0b3bec038b4662c9a",
  "2022/23 Panini Mosaic Basketball Fast Break Box": "d67a84f14ebfc109038406633de69e4d891e4da41716cc31d089b35bbfc11353",

  // ---- Football ----
  "2023 Panini Contenders Football Hobby Box": "e6d626ffc1eee8a00ff591c5174ed1b9daf226b3b9f198aac25a0259d27af4aa",
  "2024 Panini Gold Standard Football Hobby Box": "f6340697d13b25a8100a53cc95fe07922fbd3a560af5628c7a3b1db5de472ea2",
  "2023 Panini Select Football H2 Box": "5d8be9807ce08d63d0038f45e87a670aa875bb550318ecc6747426371621ef50",
  "2023 Panini Select Football Hobby Box": "ed7dd06da93d36e9291b1d1f02fccdcbde717c0f66c3d591abcd19cbe17cd0b9",
  "2022 Panini Prizm Football No Huddle Box": "4df1d43829586cf8a49d7a8b69e1133078fb65a6e13d314bed55c4bcdd3e394c",
  "2023 Panini Donruss Football Factory Set": "fecbf277472e33b883591590840f6961bc51f43e3a1a5e898125dee5d7943190",
  "2024 Leaf Pro Set Metal Football Hobby Box": "ff5c319bfebea062ea408201b795672ba84a35c9c51c852813dc3a72cb47801d",
  "2021 Panini Select Football H2 Box": "d83e7017845ce67ed50329e7f7f1654ff69eebda016f985b650a98c2f9d5cb4e",
  "2024 Press Pass Premium Football Hobby Box": "2977c9b74a02c02eebd97b0dba72991d06e939cc5f0e5a9b598e36730f1ce4ca",
  "2022 Panini Score Football Retail Box": "2a3dd7b43e15d650688c56ef3413bb07059b528aa1c4f89e82bd547d757ee51d",
  "2021 Panini Mosaic Football Choice Box": "331fc63357494010ffa0eb0bd58509279dad6dd52875848b45ffda2136b352ef",
  "2024 Topps Midnight Football Hobby Box": "14a08131533d7526f050f61af299fe01f6b7c52774ea8a7efaecc58ce6eb9b74",
  "2024 Bowman University Chrome Football Sapphire Edition Box": "20449527567da559ac044507de5e8ecba2240871064952a52e189e5714e4d678",
  "2025 Topps Chrome Football Mega Box": "6c23b004cab0546309d970839ddbfa53c3301989a5e21301b75986c6dd5cfe10",

  // ---- Hockey ----
  "2023/24 Upper Deck SPx Hockey Hobby Box": "dc3b5f65d83598aeb3a4651713e9548a4b54729438a2aa1cbeb71b710cae6027",
  "2023/24 Upper Deck Allure Hockey Hobby Box": "ea590afc2bf2ad35faee7cbb164a4e20f1f7ea65e0eee904c70dbf2f334611e5",
  "2023/24 Upper Deck Series 2 Hockey Hobby Box": "0288672aa6e3e70cf6a85c8a4b961db6fed5ae0362c7bfe089e4ccd575832b16",
  "2023/24 Upper Deck O-Pee-Chee Platinum Hockey Hobby Box": "267d528b2854861bcd3f32a26bd19d15e391bfd53403592ad9c4407eefe366ee",
  "2023/24 Upper Deck Extended Series Hockey Hobby Box": "a4c49b085e7818d7894650212bb1cf9066868c04cc1e7176269aab9bc92c56e3",
  "2023/24 Upper Deck Ice Hockey Hobby Box": "f68ccfb2828ef8573ce6147c1903f707655c24b9dc9273206a052b292ee319ef",
  "2025/26 Upper Deck Series 2 Hockey Hobby Box": "193a717bffef1212b26054c86a16de94cbd46862d8c33a51d8c8a1f98d5b0323",
  "2024/25 Upper Deck Allure Hockey Hobby Box": "0e818be3418a52456ddef9db73899930bb44df3925312022bba4b9f5b1f02bbc",
  "2023/24 Upper Deck Skybox Metal Universe Hockey Hobby Box": "a8c955ac32e1bbdbd614127ea08b14cfa3e8deebc10fed9c889bc92cae2c8ac1",
  "2023/24 Upper Deck Credentials Hockey Hobby Box": "680165c28f482ea432b976cee32ed8d43fdd00a6b49a65fdb8b89a51bf49f122",
  "2024/25 Upper Deck PWHL Hockey Blaster Box": "9c5275f787f3af5b72d710428484babdb8d6c124de18e3ae00a8435c3d1cb8fb",
  "2021/22 Upper Deck SP Authentic Hockey Hobby Box": "28f609ca2c4a9a2f31bbab10e4e4504b62a098bc2b7924299dd6537014124aea",
  "2025/26 Upper Deck O-Pee-Chee Hockey Hobby Box": "819b31bdc922283081fcf3bf2a7e6440cf1fddb5aaed4b0b39ac20207bd0b57c",
  "2025/26 Upper Deck Skybox Metal Universe Hockey Hobby Box": "3c89200b3af7944eba98bdac034b713c94ab89cb779ed9db7f570bfe2fddfe26",
  "2025/26 Upper Deck Allure Hockey Hobby Box": "347b65081342f21a2006a6b85b5531728086b00b6ecbdb2aeb43582235f3377c",

  // ---- Other sports ----
  "2023 Topps Chrome Formula 1 Racing Hobby Box": "cff86d9117e8dfc1b265246ce7221b1baf2e779285755d8abd312b10fd923a30",
  "2025 Topps WWE Chrome Blaster Box": "9d416985414a3af4b4af4b354cfeb330481b64c6b7c62a14123bf1e911afa587",
  "2025 Leaf Metal Sports Heroes Hobby Box": "a39706c50bf581ac48c8cd332913887047c3495480358925fc6e6285647e4459",
  "2024 Leaf Electrum Multi-Sport Hobby Box": "4e706252aa0a36f1002821e00bef98ac1e9b99c4b775fa64ac8a47133c5b2965",
  "2026 Upper Deck Goodwin Champions Hobby Box": "64f10587854623d1bcbc2b1557e07bc41be777e443276da7aac190e44b242eb6",
  "2025 Upper Deck World of Sports Volume 1 Hobby Box": "b51532f526beeecc107f0559aa899859398d13b4c5b7f001cedb16261f95dfec",
  "2025 Leaf Metal Women of Sport Box": "71c2a0b752c8ecb8c10c85ed4f9e2afd33a3623aee7f60e14c8d5e27e8ec5416",
  "2025 Panini Texas Longhorns Multi-Sport NIL Hobby Box": "cd747731fd6718e9d43ad42e5bd999fda38011d5b63bf01054e301bcd354425e",
  "2026 Leaf Ultimate Sports Hobby Box": "797b204ef1c12800193e9890e769cec54102846f8f8fe0a312ecd63c2d26335b",

  // ---- Soccer ----
  "2025/26 Topps Chrome English Premier League Soccer Blaster Box": "0ba3a90c7a3a78069601634239a039a412db911a966c77b79c0d594a4e7e3469",
  "2020/21 Panini Chronicles Soccer Hobby Box": "976519b15135fad8763d5556e665a67ecab250af21e3f1bab7dcc1048767f28e",
  "2024/25 Panini Prizm English Premier League Soccer Hobby Box": "71ae2cd500265d60d30ab00ec1921e97efaabb5a4aab6c31b6c8691894efff39",
  "2026 Panini World Cup Soccer Sticker Hard Cover Album": "c1748b37ff145b1cb5c265461ea11c8693678b89a01f1733073b6120740f5f71",
  "2026 Panini FIFA World Cup Soccer Sticker 50-Pack Box": "ee98421a61f5d080d5f533426353a7fa75110f671fe8d747e20410771fa891d3",
  "2022/23 Topps Finest Bundesliga Soccer Hobby Box": "8385cc9eea994eb43c2d7e5f58e557eac57f4ca057d82d6df71a16ec415abf76",
  "2026 Panini Prizm FIFA World Cup Soccer Blaster Box": "03acde2be73601de82defe842121f4bccefa1ae10dabdaea661ebc0691c97d9d",
  "2025/26 Topps UEFA Club Competitions Soccer Hobby Box": "9482f76bd4a33cd6a85ca904715e2984154c75bf8411c3e35ab1b882d7cd3350",
  "2025/26 Topps Finest English Premier League Soccer Hobby Box": "7816771fbc7a334a0cdc8e7db90c15c3a4a0324dfce17023eed1b90c0d936758",
  "2025/26 Panini Donruss Road to FIFA World Cup 26 Soccer Hobby Box": "451243263d91cb4b971f9bce7c57d327d2728c64a136cf3bed1883f949fcf84e",

  // ---- One Piece ----
  "One Piece TCG: Royal Blood Booster Pack": "b2e79b400a0576bfa614a3e3269a9b5434574867fc463570c845bbac1a8f8dfd",
  "One Piece TCG: 500 Years in the Future Booster Pack": "5af96072f6bb8fdba287e94b810b4b2d8957e6c5503b861bfbc1b0d687fa4202",
  "One Piece TCG: Premium Booster One Piece Card The Best (PRB-01) Box": "ec74d63251c282d25a24e4bf92d01c2284a7ab9f091866b9d1a3b2a41c6a5c7e",
  "One Piece TCG: A Fist of Divine Speed Booster Pack": "e76e392f7a78ef59f5b5b91f52350ed398a5dea4e1f2841f04e9a4bf03ad0441",
  "One Piece TCG: Adventure on Kami's Island Booster Box": "067fc5f2bd7428be384c2a672aabfb73f7d6bbb2163b099d40e37d6a2b6eeaca",
  "One Piece TCG: Carrying On His Will Booster Box": "9d1b291242f293a54986d65cae53085a6378a435bde3f09026477a885286a117",
  "One Piece TCG: The Azure Sea's Seven Booster Box": "2f8d5d60da2cb0f8f04245281614a56bb2c94d10fb5efc2c0e7336c401601b45",
  "One Piece TCG: Starter Deck 32 Display": "d05fb9658b30cf2ae6149b7033326ca37d668d47867bb916c842ece5c442201c",
  "One Piece TCG: Pillars of Strength Booster Box": "3b98046a4b7de9890771790446528deeb69364c88a7ca2b8e092220ff9d1d245",
  "One Piece TCG: Two Legends Booster Pack": "595cbb284954ae2bdd37ddfc9b9f7172406e85a404efb068ea8487f7ee3235cc",

  // ---- Dragon Ball ----
  "Dragon Ball Super TCG: Fearsome Rivals Booster (B-29) Pack": "229094efb9630a80c22fabb759cc94cdcd746f8d768e01ba005217add458723b",
  "Dragon Ball Super TCG: Prismatic Clash Booster (B-28) Pack": "0514d33ebd31f79902d6cc5dd5d934582df0501c04564be8858bba3144f99e19",
  "Dragon Ball Super TCG: Perfect Combination Booster (B-23) Pack": "51e755b6251886e91219b50cbcc16534452a7712765a1b31efcffa387afb7f64",
  "Dragon Ball Super TCG: Power Absorbed Booster (B-20) Pack": "95ba5c46353b08ff269f5fa36e7a3a05b8111f7b0c2f72174f42071af78459cc",
  "Dragon Ball Super TCG: Dawn of the Z-Legends Booster (B-18) Pack": "7d562ab87d84480c4f833173b54beb08dc25a6bdef8d3e072c39f6eaa54a02ab",
  "Dragon Ball Super TCG: Ultimate Squad Booster (B-17) Pack": "cdae2f4b0668b32a29243cd389b6e108bca71efce9ab6719fb687035694ad4ea",
  "Dragon Ball Super TCG: Mythic Booster (MB-01) Pack": "37748f5ee00eb50c97c2dfae2048159a578e1de63f4dacabff326ed015892441",
  "Dragon Ball Super TCG: Saiyan Showdown Booster (B-15) Pack": "26ef9df7ccdee289c0448cba31d176bf9c665f4141b23347fcf56fec52f7cbbc",
  "Dragon Ball Super TCG: Cross Spirits Booster (B-14) Pack": "a933e8bc62d8fda165210f224b45055420beeee2db19ff479559bf7f4942d10c",

  // ---- Magic: The Gathering ----
  "Magic: The Gathering Foundations Jumpstart Booster Display": "1d4c21903889a0a5d3a5eb8932fb77a4d58954e8a402cc80a0f5e7320193c74f",
  "Magic: The Gathering Aetherdrift Finish Line Bundle Box": "de4acc2e9ae4717ae55020bd95a30dc2abd98a1f932b5f186134f976322de976",
  "Magic: The Gathering Lord of the Rings Tales of Middle-Earth Set Booster Box": "929e1287d14f6f88d1495402aa94df87c11cf632767ffb15ac91c28f61a38979",
  "Magic: The Gathering Avatar The Last Airbender Play Booster Box": "95a530d0da71dcec9c92cef74780c611a35b3e4255157f0404022edb5f52b714",
  "Magic: The Gathering Aetherdrift Commander Deck": "c025fa519907aba4434731ec2b72f78ef4382da820cc92545d2e9c8aaa654fc7",
  "Magic: The Gathering Lorwyn Eclipsed Play Booster Box": "5c9dbd87236439727a216381047280b0176b9a95320783c9083cf4971566e215",
  "Magic: The Gathering Teenage Mutant Ninja Turtles Team Up Box": "238dbf6ebfdba5fc88e54f14df6465cd45b64a19241fcc71151d0c69d4e8e9da",
  "Magic: The Gathering Teenage Mutant Ninja Turtles Pre-Release Kit Box": "f8ac475246c4e5427974568c209a15bf657ff3863e41ca8b1dfab4bd928719a0",
  "Magic: The Gathering Foundations Play Booster Pack": "839bf505ab164a2e2169b085919ac72de1b2f65ec08f60c9dd37eee9ef9deb64",
  "Magic: The Gathering Edge of Eternities Collector Booster Pack": "2ea89449154596d2be53659b3b43deb841aaece2888a4ea661f55b8191c9c1cf",
};

const bySlug: Record<string, string> = Object.fromEntries(Object.entries(raw).map(([n, h]) => [slugify(n), h]));

export const hashFor = (name: string) => bySlug[slugify(name)] ?? "";

export function imageUrl(hash: string) {
  if (!hash) return "";
  if (IMAGE_MODE === "local") return `/products/${hash}.webp`;
  return `https://www.midwestcards.com/_next/image?url=%2Fimagery%2Fovernight%2F${hash}.webp&w=1920&q=75`;
}

export const allHashes = () => Array.from(new Set(Object.values(raw)));
