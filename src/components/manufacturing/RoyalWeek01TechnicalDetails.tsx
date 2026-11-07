import {ManufacturingNativeLabel} from './ManufacturingNativeLabel';
import {ManufacturingIllustrationText} from './ManufacturingIllustrationText';
import {Source49Japanese} from './Source49Japanese';
import {Text,View} from 'react-native';
import type {ManufacturingLesson} from '@/data/manufacturing';
import {useStudyAppearance} from '@/components/tokutei/StudyAppearance';

type Labels={practice:string;sleeve:string;thimble:string;position:string;inRange:string;outOfRange:string;mean:string;practiceRange:string;anode:string;cathode:string;workpiece:string;electroplating:string;anodizing:string;current:string;area:string;currentDensity:string};
type LocalizedLesson={sourceHash:string;title:string;exampleTitle:string;exampleText:string;structureTitle?:string;structureText?:string};
const locales=require('@/data/manufacturing/royal-week01-technical-locales.json').locales as Record<string,{labels:Labels;lessons:Record<string,LocalizedLesson>}>;
const revisions:Record<string,string>={
 "mfg1-electrical-l092":"73ffc032630b96c12946e18459064194d264439f2f68b673fd895724f7b66586",
 "mfg1-electrical-l093":"c9c250bb226da27d795729550eb30911875aa4a4d2ec14454c090016ee353cff",
 "mfg1-electrical-l094":"61b41fff2df8e19987bcf4354d4a41ddb8d68e02d034d08b2c10ab90e54c1625",
 "mfg1-electrical-l095":"b35aac25a5434e4d01dcaf35c62e96e044312d27ea3d831e48afb78f96bf198f",
 "mfg1-electrical-l096":"65320d9cddc8349601ebef035fce30c59a788715a8319a1e7897e5194bb5d71d",
 "mfg1-electrical-l097":"8e20d924ea819b92ec89bed0e0ba91f48aad5f3833baca2c7127b11c522d3e84",
 "mfg1-electrical-l098":"32dac857b35ef384dc54fce909412c7d2553e56a169f25379c89531af350e191",

 "mfg1-mechanical-lesson-085":"97a442e82fdd5f8022b9e1320c30e3962e89949a96d137ed282d7d2a4aebc9d8",
 "mfg1-mechanical-lesson-086":"d43b0e538e59ab994137bd1d7611b049dddbab2c92531664f8c387484cea43c2",
 "mfg1-mechanical-lesson-087":"10e5a87b094af8efe1f1e6a1b5dec0c1dffa726a1d667363fe5c49a41de3acca",
 "mfg1-mechanical-lesson-088":"61dd3c860ecdbb29070c741cc32d85a27433e9bcdba165d8c727f360864a3deb",
 "mfg1-mechanical-lesson-089":"fbc5a125628ff08a71771fc8376787f8a338cba9ee49e568a7ddae1edddcdbc7",
 "mfg1-mechanical-lesson-090":"5b2a9b56ac8fd2f356ba4e34067a7b74baa5413dd6e8b6bca0fa568c5c427a60",
 "mfg1-mechanical-lesson-091":"0623682059022892904e86a195e66665b74304ff507fd0b8a7a8b1497d10ca54",
 "mfg1-electrical-l085":"564dfafabfef8c6216ebf1c409581972fc16251cd51eb18fd392eb03ae7a7b7e",
 "mfg1-electrical-l086":"92d1b5133e06e8355490ba6238a8cbaac8cde6422e451cd245b88c789f45395f",
 "mfg1-electrical-l087":"872cb9a67a528953416336e028d92c1b5012212962156304cee93d814c9bc31a",
 "mfg1-electrical-l088":"0f7d79a8ffc0a7b5e91a84d9d61d0ae9c0cfd369fed896696dcb88742f88264d",
 "mfg1-electrical-l089":"609cff9c85c8ccdbcc09a49f1ba0ca1a5ae10d4cdf1942484dfd9288ebe6f93a",
 "mfg1-electrical-l090":"a1244a1a59ca33d8ef92b8fb04471ccd5db9d72b3ff8a8903785da68059c5eb4",
 "mfg1-electrical-l091":"6191040b40cd1b29a61a7ebd79c51d5fb6faa7021ab0eb8ef4d9f71191010e91",

 "mfg1-mechanical-lesson-078":"df6c9fe3e3a51f1646a57c901a5c2b3cf12aaef77b042cd94a5610453b5f3ecb",
 "mfg1-mechanical-lesson-079":"16a12f56c47c2549f55b2a566f8c146330dafa0212a5f4c9b4091a9f0d9d3a87",
 "mfg1-mechanical-lesson-080":"d6aba0333b218960cda4399dfb2ba4686aa8f628303e73624fee0e1cdcba204b",
 "mfg1-mechanical-lesson-081":"3da2188ce6420730deb8becf2f3b9c234da4ffeae1ec763485d7640d4757c4e6",
 "mfg1-mechanical-lesson-082":"c20300f47da9efa072b56072fb92ba2e195bff3a9f13808f917277fb23f6be50",
 "mfg1-mechanical-lesson-083":"d2e6e2ffe3427e12d4e1b0bb0eab9c6d3a088e4a64d34aeda4683654ab8f3697",
 "mfg1-mechanical-lesson-084":"98ebdda450a8198ea46803d85b39e12d56c141c836b1dc0480d06482525bbeb7",
 "mfg1-electrical-l078":"951f5d99de389d0d052f5ec6d390eec31b4f6e712de1d05988ba3a5075789e8d",
 "mfg1-electrical-l079":"af84b9524b18f9b658de324772404620a6a10b8c979991083baef14c247af53f",
 "mfg1-electrical-l080":"0c25e5f9d30ad13f7d71c9c8aede8d788a91d0fc6ce691876527c268f82f0129",
 "mfg1-electrical-l081":"ab98932a05addd11dfecc87a20fd600c1de0350eb266f55dfc35a8041c24700f",
 "mfg1-electrical-l082":"ed9890d616a3eae840411f4609118f4a78a14d922ba3bd6a570339ed035d9fd1",
 "mfg1-electrical-l083":"9700f5ce1eb6f74c9dcf3014c8c3fa483f7492ad014114254b87e3a7fdb3a768",
 "mfg1-electrical-l084":"8d0ef8c0512cce8ce611451ae6551ece6f67a7da00ae1951ee6f514ec154896c",

 "mfg1-mechanical-lesson-071":"45ca487a156d62c145b008a85710657c543dc1179e4f4c83eabbac5e80f5ac21",
 "mfg1-mechanical-lesson-072":"53fa49bf8402fdb1dc23bc3956e20901e906a250d63de7b0a688c8e3f6ebb103",
 "mfg1-mechanical-lesson-073":"1628bb9c538060b75bf2a5d70361aeb00c05d792d73300905f8d6274dbffdf2b",
 "mfg1-mechanical-lesson-074":"6725581d21460c1da19b735979fcefeed88573f49f7cd4546cf63b50f557bc78",
 "mfg1-mechanical-lesson-075":"80a747f91c28b9340f03c953160e65d5a625d0342db5fe150a364ab708bc3eaa",
 "mfg1-mechanical-lesson-076":"00cbd05fe53785d0c7df7106290053a176bea7577b1ceaac888f7afa3b4e4d43",
 "mfg1-mechanical-lesson-077":"4caa5c8178dc3f530f71cf7d78045138c45f1649c899d84ac66cc960a8fc7a73",
 "mfg1-electrical-l071":"d99438ff6de3ea74ebce53fd03707467e62759206566ed9fe53e1897c1385686",
 "mfg1-electrical-l072":"aa213598332b37cded6bc5c111231b9e6ae94d7de76cbd4ad174f8fac3927460",
 "mfg1-electrical-l073":"e535ba3bac5cc43e6b934bc41ec4b3422572a6396f0ee6c3a82846645b0976e1",
 "mfg1-electrical-l074":"aa3bf37030bd09585e1ff4baf543ab4c1ec11f7be57a52d6d3ffa8c331bd90db",
 "mfg1-electrical-l075":"25b343d5c17e0f1c6341bbb74624260be811dd15aa757a4eb8207cec69466d89",
 "mfg1-electrical-l076":"da01dd1203b38cd444550c258b608849799ca0724a520cf934b0e36601be8489",
 "mfg1-electrical-l077":"614284c4181587733b9090e0984f94cf23ab20ea4d46b2619f26c39cc9d52024",
 "mfg1-surface-lesson-071":"aeed8683518ebc61a91e29e96f861760717bcd96870236b02ba9d2b9f34020eb",
 "mfg1-surface-lesson-072":"f1dfb2d86c8a808346b268c5d41eb623d88cc47767ccc887a1395a79ac4e4b29",
 "mfg1-surface-lesson-073":"6e01d7d938adbb12677f4ea609782517594fccdbcaf050d253a0b3b9b7a3e540",

 "mfg1-mechanical-lesson-064":"39778432e4fc1ae09db487d4012f817cf2cf57d5b85d568ab67219995e3bf245",
 "mfg1-mechanical-lesson-065":"e04486274c1f9bda82964f1c9ec8829d29d4c4d411107702681b4bb8d114edeb",
 "mfg1-mechanical-lesson-066":"26db2d9eec3cfb0dd0f470e5a49c2933abf245524df4cf12a48038e8faa7305b",
 "mfg1-mechanical-lesson-067":"eb054eaa714a63a8ef1b710ff5b1aa97d07d260675fe3a1a15a3ab15b348adfc",
 "mfg1-mechanical-lesson-068":"0339e916c023dd98d00a4bfa6d5f1a95fe2a523d21a4e75d5a5295b29c545df8",
 "mfg1-mechanical-lesson-069":"b95baae80de044ae43933c200d3800c4422ccf58ecd660ba3ca0d9f902bddfbb",
 "mfg1-mechanical-lesson-070":"7d861464c96a4d4ce144c79dc98cce44e4448c0ad0b9c5530fb816564c955126",
 "mfg1-electrical-l064":"2406f51b31d15c2b8be938e239f49a58d7638db1c8400455c81653d2eebb29ae",
 "mfg1-electrical-l065":"ea00b75e01ffc7c14c5dd3893b9d5417686a3eb3a6b2c57e0a50d26e90fabaa6",
 "mfg1-electrical-l066":"52e82953a82dc1d65e2e8abc167c4dcefff2f0addac1fd7c5c166b19e7256859",
 "mfg1-electrical-l067":"05f9b9f7e90cc950c0b37ae129f394912cecea318c87dc965df475196de4225d",
 "mfg1-electrical-l068":"37fa285ec2bb91c45010b17187dc0689d772b24bab1a1b4937db97f1daca2601",
 "mfg1-electrical-l069":"2070ae51e0e9eb05263795e8dcde06ab44490e7bc5146bebeb2a3e63ac3daedb",
 "mfg1-electrical-l070":"e4f00ae5cbf227148e2b5380b6976d5533fc785630e52efefdc6f1514d4c17cb",
 "mfg1-surface-lesson-064":"59083379673c9ca06095653dfadb59ff36f571f07805d41450eb2fef0301ab17",
 "mfg1-surface-lesson-065":"43500fc961fbb37825512fb4bf8f36e6b90db2eaf9be900063b7dc2fe4e1a8c3",
 "mfg1-surface-lesson-066":"cc81d644f6ba4f10851725b4176cc9bbbe2fc49623aefa09fc2afb548d554d39",
 "mfg1-surface-lesson-067":"01c109ce2cd89407fc1aa88ba88f205a28014a857886e66de8fd4999b52c0ab0",
 "mfg1-surface-lesson-068":"e1af4411c9fea93a19c0033ce585b5581c6895da37c69c319fe8feb9f7ddad96",
 "mfg1-surface-lesson-069":"4aada97b9ffd9e7ae041763e972ec6557c4551c7b9aa22d94526acbda1b028b5",
 "mfg1-surface-lesson-070":"5ba423c6b91e39261b9fef83ecc64e4ecce3cce7b8bdcee5acd32961cf4dac6a",

 "mfg1-mechanical-lesson-057":"824b758cb7708663e7d762bccbbb334713d468cba2acab51b26d7f0c41523a95",
 "mfg1-mechanical-lesson-058":"104c99ea32387a27e2c2f866a47166ab5eff03b6a454a3761762dfe853656f03",
 "mfg1-mechanical-lesson-059":"84bbdf238ca519a264d7529987fde0f3886bb2480ccffc0e5a0acf1edfded872",
 "mfg1-mechanical-lesson-060":"7a138757d24a93e5f4a33956b98f4d27c3546e6b78b45d931156f3ca68f7c4e4",
 "mfg1-mechanical-lesson-061":"9cba5fcea2de6e3c93eaf9f29e9ff9fa9bda68f522464f89a443cd53c81ff2ca",
 "mfg1-mechanical-lesson-062":"81f3a27dd9ae16180eaecc83a2025ef5daacb45c1f52945bbc5d0e404bf500a2",
 "mfg1-mechanical-lesson-063":"60bebeb3561a5f2d792e6ad43fda2b2b64dac2cb871d2bf0f63e56969ab41159",
 "mfg1-electrical-l057":"ded6ac22dacf79b0c53ffb94d2ab00067e27c4659adc901ec6397bb29f6b4f2e",
 "mfg1-electrical-l058":"ded2493cad8338a4e4c59d5389601174057fb43b3d22f77b5a1f5fe8296f92c2",
 "mfg1-electrical-l059":"0a85b0c6c7b4c0650ab2317ff83f36e9c3d50c42228311a61ac9b3792d8db029",
 "mfg1-electrical-l060":"c5f63987c6b38a05568066b10e31063044cda9d6cf37d1ef9536753882f3ec9f",
 "mfg1-electrical-l061":"8aceec3857c06e6d413bda27a5f963ae8a711d916d1b9c70da2e75264a41733b",
 "mfg1-electrical-l062":"559c4a0398fcfc6fc59cc11caf04c0d3df65fb3c21870d22158b1b6a1e447edf",
 "mfg1-electrical-l063":"b76aa1793be9ca2b5294c7a565cab6cfc9424dcb82b156efe9e79686dd8a6c4b",
 "mfg1-surface-lesson-057":"d1a9cc3f4c9b8989e00ac8b95ba06f5e827bdaab17f91b7319d3c8fc6e3b80ae",
 "mfg1-surface-lesson-058":"cb0441c1075655078ca0332fa8475681a78db3a9485930bb7075446e5f0ae07a",
 "mfg1-surface-lesson-059":"2591f625a2f6a94c249ec474b2fc6236e65fe60ef4cdeee593259c7abc613ed1",
 "mfg1-surface-lesson-060":"f24db1adfac652687ade96beedd8578bc232658bfb47ce420e04fa471c69d60a",
 "mfg1-surface-lesson-061":"8c849f2ff23f35f383aee7ef7c4b289aee2e377530dba84dda54377014c69cec",
 "mfg1-surface-lesson-062":"b864576295c9d53628d23c993e15756bd5af5013a373636a58249daea39f7c8a",
 "mfg1-surface-lesson-063":"ea360eb0c28bbb78fb085b6e910b815ea6cec0ba1cbe71f35e19069eadea2ea9",

 "mfg1-mechanical-lesson-050":"335a305ee11101a1b0310d8524de45b14318c0f30e2fe3cf827414b7dc35390c",
 "mfg1-mechanical-lesson-051":"b302752eafecd99d9826872c3c8bc1c39594101a2733bb05be93e17c022157a0",
 "mfg1-mechanical-lesson-052":"5ce6e7da3d1dd0588dd63b0e5e8bfde4630fd07aa0c292344d62f1f94ad8c19d",
 "mfg1-mechanical-lesson-053":"f2b6b7db9e3d7fae531e9ecd75f1531e9e3150d22c2479f65f23d256702a1416",
 "mfg1-mechanical-lesson-054":"0d19cb52472f31246ee740a2a218e968b7e74c7f2d8c215b4dd393c16c5bda3e",
 "mfg1-mechanical-lesson-055":"9e3ab74e9d1f3e2bf642d23c0edb3dffb7e0789d8bc60aa46059269577f36662",
 "mfg1-mechanical-lesson-056":"0ff1a5af20a576065d956e83bffc67f34796f5e9b58972785d3782bb014e9d9e",
 "mfg1-electrical-l050":"de16ec5ccf0a1b2121602799ee978846021ac2489ff040a66fbe0cd9c8353e44",
 "mfg1-electrical-l051":"9a55436de848cee3466855cee915e709f3a2a95df0ff3fc28676a2e7b82434ed",
 "mfg1-electrical-l052":"07bdb79e41b71e4722bf854bd3e8a083b981dfb2c49db970c79e26e9e26d6be4",
 "mfg1-electrical-l053":"6ff5a5a352521a52ddbece44b4378a6865c3aaeb5b2f95b2eb4469137607f1be",
 "mfg1-electrical-l054":"416b775390fdfa41652b1bc7866da763128b0ce80735fd987ea98e4223198204",
 "mfg1-electrical-l055":"fa6aaa7bc6ce1651a940e947d0c4dd1932210808ba139d192265b2548f7056ab",
 "mfg1-electrical-l056":"7516e9ee6643f966df0ba2b7d90f0c31aa48a4cdd4f65d261c1948b1afc5ba4e",
 "mfg1-surface-lesson-050":"06a91471522f011b641146e9a333c8b8245020bcd1788d3f5dac90ef6bc34924",
 "mfg1-surface-lesson-051":"789d0e18a2f056aa3009e2422cc99d41c4edb2e6822f38c4860baafb7e98ee97",
 "mfg1-surface-lesson-052":"6f7dfd544e12c52ef52f642d23e9c4e6103733f63cba37209be90df1558c03fb",
 "mfg1-surface-lesson-053":"ff9c0c7a21879d0fcd08987ba719814c183722320c90df25cbd95dfd525e7cd5",
 "mfg1-surface-lesson-054":"283b744e3f585d17e3d46479424e6e3cf3eaca74ba011b72bd6622bb7f3202ac",
 "mfg1-surface-lesson-055":"78facfbf5b3f184818deeea53cb9e9383cf5a666d8c19e518a89d7e09e14968d",
 "mfg1-surface-lesson-056":"ddd3c75f8ce2cd7ccaa6b075b5fd02a656067309dc8e171386e83581d2949095",

 "mfg1-mechanical-lesson-043":"feb8b157bd375640fb52265bfbdd60070de9ac0b4efba6d904020a251c0a275b",
 "mfg1-mechanical-lesson-044":"4e5211d1f85fc648ad19051de3e666a9c999cbc4b05c148db88b9e43ed10c7ef",
 "mfg1-mechanical-lesson-045":"0c2be02241a6b75169cf985ee4bbf65044ec9ddd4fdc2b912878ececb930a16d",
 "mfg1-mechanical-lesson-046":"915489d827b87d1ba550ec2cb931be02529d25b933cb64ac50a009dd3fdda272",
 "mfg1-mechanical-lesson-047":"f844924c0aae73f04b5219d70389d2638d30d35d15bd26d5705ac92ee405bed6",
 "mfg1-mechanical-lesson-048":"b6c037fbb354e9adc1c7891ac98ee33e13c04b6f082daa3a8ce04971a0c24e24",
 "mfg1-mechanical-lesson-049":"ceca8331e7510f74357814ec9a21d538bd4be2cde75a0f0a60738b976531e2af",
 "mfg1-electrical-l043":"e9e17404e6165edcba961c93d088830e0b757dd9f8d22069fdaf30bc500267f8",
 "mfg1-electrical-l044":"1e226b28ab038e668c0b68065eb401e6554284eac069f52d950a3160417f88a2",
 "mfg1-electrical-l045":"adb20021f7532d3a31df0a6132d37280412f17dd6c1f8d9cf730a11914f9c127",
 "mfg1-electrical-l046":"47b4d3d42ff6351a877ce68c49a9c7615a8c8880c5a44efa4075ab44088cb947",
 "mfg1-electrical-l047":"9c9916632dadb0ed446d60db5052dbb87582ddc5878de449a90d6ec2c38ce048",
 "mfg1-electrical-l048":"1579bd70fb32210b2e132da19886e5db99f6240bfbadb736c33e5eaa81900335",
 "mfg1-electrical-l049":"33ee70ac67d89f53340dd095cfc5ae53bb71761cb25f3ac5782859c3edd2f718",
 "mfg1-surface-lesson-043":"7393565086afd0ad22323b8d4a0028a5e9de08500636e569ac6dcf70389df8ff",
 "mfg1-surface-lesson-044":"fdf10e1d79dd9b2d46d9c5c8e09b69774973614ff534e0dfbbfd845e27df3baf",
 "mfg1-surface-lesson-045":"fdeadee14f082898ef3f4cb57a5ae8e00b76a38586b1d50bdcf9edc44f89f44b",
 "mfg1-surface-lesson-046":"6e3ad08ce52a7331beaad842a0bbbbcd4af8f61b6d435c2ca4caeabc1d1e1e8a",
 "mfg1-surface-lesson-047":"2793c3fb134d8b0fad7d34f0cf3cd46ed1abc5c1b539c518da8fcb0b8a04b947",
 "mfg1-surface-lesson-048":"9ee4edf387af8cbb82a3933bf159f2c0d87baf2d005f4a2279d9bf4d8f5d763f",
 "mfg1-surface-lesson-049":"89934a369c7c47c1df012760a9bedd3ee78c6977ba7bffde72195ea8622d0a0d",

 "mfg1-mechanical-lesson-036":"15f0cd63df1fed4ff5dcaa62d749c3542e27ed3f559d316844ee07afebb23737",
 "mfg1-mechanical-lesson-037":"20a068c1e06483d42d2f533d349feedbbfae23cba4f4bc2c9650490cce34c7c3",
 "mfg1-mechanical-lesson-038":"285ca25559d9a78529d4e2221b051b2b509d8723fc17cf144a4e35e6739ebdc5",
 "mfg1-mechanical-lesson-039":"0d0bb43ee698811c4dbdeb9a23ef5b6356f2f2192c4054a2cfed644934cb5378",
 "mfg1-mechanical-lesson-040":"ba18f9c4ac3ca23e7121fb9e9da6783ed0d194336ca57c8f286bd5211d624412",
 "mfg1-mechanical-lesson-041":"f8b0a120d407afefb46b21e2d781142c26b0f579b0dbaaef632c0bb327448781",
 "mfg1-mechanical-lesson-042":"70aff6b5237e4c071417b0644bb9121aa4c1a48a87eb8823233fb43953ec858a",
 "mfg1-electrical-l036":"dc84097f99b1a21c3d04786cae4b136580c0977ad941e049ac9d3ebe947bb005",
 "mfg1-electrical-l037":"72a7d3c677b4ed2db79aac5f2113f984afe1168b5ff6b62a4fc69ab46491a6ba",
 "mfg1-electrical-l038":"9174292d60f625cc88610a75529c488ca10d7f97444b7ba2c36559e75d10a6e2",
 "mfg1-electrical-l039":"c403b451ea4b43c5527d295a04898eaace52af2ff980ff247cbe36ae7bb982b2",
 "mfg1-electrical-l040":"5b8b51ad3e16c58e382165caa850fa608d676470e6b2e3b34644746767f1829b",
 "mfg1-electrical-l041":"5ca418118abb4b5e7807aff1689ded494dd2d9c02a00d66961d3a6e10a4a899f",
 "mfg1-electrical-l042":"aeb1b6dad2facb358bd2ca6388cd1947fe758e5e0ee221ba6301fba817a19bfc",
 "mfg1-surface-lesson-036":"8ba88aca0af9d357d6324ae5cae34d7d39ee89871a452255b8de5ad1651f103d",
 "mfg1-surface-lesson-037":"ae0cca90254baeae0b5abe578f1df070510a5af5a1d015812a13b8aafedb46ae",
 "mfg1-surface-lesson-038":"a00178622274907eac62c7070e07e660a8b999d6e7678a458ae4685c53ece07d",
 "mfg1-surface-lesson-039":"a42237cadb8e99f979b63477039bff09f7df105b04965ed3cc79cd792422030c",
 "mfg1-surface-lesson-040":"a5a5a504c25909dffe0d6721eb911868639dfcff5f2b6a36c82219bb92e58b01",
 "mfg1-surface-lesson-041":"84b96496dc28e026c14440a9e4f27ff1a8fe8972aff7eeaf0201a026026902db",
 "mfg1-surface-lesson-042":"c9c4c244e974e62a87149ae4d335feda8047ce9993ba5764ed030bbe418a69d1",

 "mfg1-mechanical-lesson-029":"e2440d55bce19dc237fd96444ac2999491b9475fa9be0d6884bbdf289d3ca0b5",
 "mfg1-mechanical-lesson-030":"c2c8323578794527d2e2a243e3b384aeac2977d43d846c198230e11f768a03de",
 "mfg1-mechanical-lesson-031":"a1d45f1b6370313e08ea9120c6a849ccb2f48e4af08bea9586d2ba90522805b4",
 "mfg1-mechanical-lesson-032":"46a4f50c3bf759840c315f802825c5a2740fd461019fcc5e5c22b20b62e63b4e",
 "mfg1-mechanical-lesson-033":"d8057a1753c9d3201bfd33643c2244de0f248eb6887484a93c9c7e3dfbaffe80",
 "mfg1-mechanical-lesson-034":"ab96382ff1b217a02f59ea542d0525a899ec88c4e42a832ee1bba255a1678d41",
 "mfg1-mechanical-lesson-035":"5da8d23770159ba021e558544d000c37a845b996485df6a4c7e1620a55c05149",
 "mfg1-electrical-l029":"36840f63d74a17940fee7aa25127b1fb590bf334452baa2c6db7a419583de233",
 "mfg1-electrical-l030":"f8d8fc04575b667f12bcf7ffd98c235972136b8b2033c2724b2ac73362424474",
 "mfg1-electrical-l031":"788a9633fb569ae0505368d9fa3284920490c147a0cf9bc80444115f2abb728a",
 "mfg1-electrical-l032":"d17d7dcf79eaeffe5074f5d2ab57b34f1481fd875012e165c78e8411dfb77db2",
 "mfg1-electrical-l033":"356f00962ec9c5ec5103442ff5bb0a7c93d66a6d95b742658f2101d322b440f6",
 "mfg1-electrical-l034":"d90c633c04b1815d796de13f6f7f8aebe16ac1c155e9dce4ffa868bba0593b28",
 "mfg1-electrical-l035":"5f33302fc0aa0a19fa54ceef92716ae3e97f2fedd18777ae181759bbd158859a",
 "mfg1-surface-lesson-029":"b748770ffe0acd765c523a8df8f5eab00ab69222f176b71e5b0d41807a531d2f",
 "mfg1-surface-lesson-030":"80cc4b5d18c9ec92592d8f5fa4b0e5e4d82666b6957d40da85cb8f39b9ea8be3",
 "mfg1-surface-lesson-031":"0ae709e4d8a606902e5cfd4bfeeb397efff0918faa8f176f47041535e74b3548",
 "mfg1-surface-lesson-032":"30474199accccec7067063a80680ca5302609ed1494fd14927c15b954c8cae58",
 "mfg1-surface-lesson-033":"047bdd2316ba34d01370aa11b2eccb275765212263084a01825aa743e360ce5a",
 "mfg1-surface-lesson-034":"c2c547447a1ec02dd704dee17bbdd5c1bfb3182519c5d43e5564c2aec1fda4e5",
 "mfg1-surface-lesson-035":"d9dea5b1c936e334aa353c620a19c16a77959726651f2894a962a2dedba9b45d",

 "mfg1-mechanical-lesson-022":"d5c1735efb0bac01ec4ed99cb4529f082707eb13ad4dc0add75e763cb670917f",
 "mfg1-mechanical-lesson-023":"4c3d36c42bfa45684851a2285be9340525b828f38d1be4d92a98ef6b84596548",
 "mfg1-mechanical-lesson-024":"227583377d3c80d522fdf31e94e8cf33b250ef28d8bf9442a6b897df6d7b8f9a",
 "mfg1-mechanical-lesson-025":"f10a6e71572a00b6e42ac2d3c205687180b5190360b3475806766833afecbad4",
 "mfg1-mechanical-lesson-026":"1467a3b735cf59c9b4d697a8017363c4d846e3981531a08f1fb42229be0871c7",
 "mfg1-mechanical-lesson-027":"329329bc14af273612560ce204f783fd62c969ba3874eb130403ffec2b60b0a2",
 "mfg1-mechanical-lesson-028":"0c4e295a731282369bb81571b25700d537e14949308916bcd75e03914565555c",
 "mfg1-electrical-l022":"a680c5bfcdaace4358439016b5305ee47889bdadc534f139ef7639c53c75b82f",
 "mfg1-electrical-l023":"5e8b9ca9ce437a0ab453ee1b4b1263f1a78f85c1db93b37c2209f6c198919973",
 "mfg1-electrical-l024":"ec282035552d7ae1be1486a6287e4710f738254307794e9da64218526aa33f91",
 "mfg1-electrical-l025":"f6c61e108c840e7b1ccf9794a4da7c366703a38c3368945803d9310c31a1aa37",
 "mfg1-electrical-l026":"1d7fdf6cc82278ade4f9b755e5fbdc449f5b46931a1aea345db76d9fe9e3b2a5",
 "mfg1-electrical-l027":"e33b8ccae4da46a52b6bb775596d119b418562198357bc8a06af0d0defd157f1",
 "mfg1-electrical-l028":"cedf3f5b13b0d74026ab57d69794392e8b571766d3af97be396225cd7d8ee33a",
 "mfg1-surface-lesson-022":"c54958c37a7ae8be011c85bb08214e734b09daf668e56b6cb175cc8ec52a46be",
 "mfg1-surface-lesson-023":"c68c6b0c18d9e9705e4dd62e62597e1cb2f16d0c146d7bdb7adf61ca696b7967",
 "mfg1-surface-lesson-024":"bf4e0da0d0fa1e1a6a10577bb0b289b98209af70e116732b2efd36601c7d2a98",
 "mfg1-surface-lesson-025":"0c8d9fdcaeeb19f96f6abb07643cad182c3a1a88dc5534380b3882d7aa04aa0e",
 "mfg1-surface-lesson-026":"a77fcbeb8fdf745f1f0349170adb6f017c699a694e154e8a86836a089f9b0dc5",
 "mfg1-surface-lesson-027":"8494cfcd8849b3f8887ee2c43e00d91bd0d3c1612d2ba0196e50dc898394beeb",
 "mfg1-surface-lesson-028":"c34ffc0a11292702342aef819eca87403854c5057221855741e162f8ff7eb874",

 "mfg1-mechanical-lesson-015":"92d89fedabc628cafb74ccd7016933d216455d72cfbcf37ad49e2e96d26ff1fc",
 "mfg1-mechanical-lesson-016":"7a5f9b7be83e4d562c947fb6a42327f8d6e423a195e91ed74c0d0fb738841ae6",
 "mfg1-mechanical-lesson-017":"4b551fd599fce7d837a851436feb5d27be33ed01e7df1bfdc733532a82218348",
 "mfg1-mechanical-lesson-018":"ef7d6a94982c25a984c9480e920b2af82a1a00fa9bf3844e86e9877681db9cdb",
 "mfg1-mechanical-lesson-019":"d9e8a5bb0d6a2da7895edccb6b78c93e52896b444c1386efcbd415b456e83cc1",
 "mfg1-mechanical-lesson-020":"d093d570d5b0a9a12428523e25be3ba8375577f612c2c85f1810397662eca666",
 "mfg1-mechanical-lesson-021":"7f588a7c67b86e7ad773e48af595bd25d8ce8d0f9a4b1feb6b0107d4bdd930a1",
 "mfg1-electrical-l015":"25d7da40236abfd57e0e62fafda205a46a321d258e83fad5905f178fb6ce31bb",
 "mfg1-electrical-l016":"51f6e5bb168cd2a249b1464289b25b0250ee9ca98d0da790de78b2a55cc21dc0",
 "mfg1-electrical-l017":"42bdff3e0759e2d01d348391465d41b9dea1edc600922d8541b54e4833420065",
 "mfg1-electrical-l018":"e31e735cd6be75ceadc82390e397911487373abb684564fe38ea8925180e562b",
 "mfg1-electrical-l019":"1f1e498d2079634e54fcc72973deeaab17f02e59ebb46b3f54e25fda1f7c8d67",
 "mfg1-electrical-l020":"c05ab4a434bc985022ac055dab7f2aed0c5f10a452be0ebe5f8faa925d1fa571",
 "mfg1-electrical-l021":"08d8e5394649ca2538ce30436be9d2c3bf52533e39038c791c6b598cc4f3ca13",
 "mfg1-surface-lesson-015":"fd31fbe0802e41410b6a406e38ff5c8e0c33d9dd9fcc3f459b7da4f7d699f606",
 "mfg1-surface-lesson-016":"0b3e38703af71909630f6026c9fd8913913e0512d423614412c2f91fadaf0109",
 "mfg1-surface-lesson-017":"35499ac8a309fe7dc4519aedb61d9f861b200351d52a202441d510864bdf9f67",
 "mfg1-surface-lesson-018":"7fa1081fc992c4c9bf535ebc3dc3f8bc04a044280f642ce806feeae76bb030d5",
 "mfg1-surface-lesson-019":"a71b6d182a8d4c4dae7201ea2fef28f8295634c58c6626a656a971c9119fc7e9",
 "mfg1-surface-lesson-020":"23e6277b01cc5f4ed700e36c05b3d2591b985496e97d1be1b59622e852e44da7",
 "mfg1-surface-lesson-021":"b32a9734e0806ab2a5c171d3d8213ab48c45a40ffe05e244aa691a5d5b5a6a7e",

 "mfg1-mechanical-lesson-012":"a5d4b0e59956b0f039f65bff4cbbd18ff5226fabf1b779acf75d49a72e8a20d8",
 "mfg1-mechanical-lesson-013":"08cbdd5a897752800177bb3bacbb13be2643f58b7aa40aa6d646b189c37e8608",
 "mfg1-mechanical-lesson-014":"85a6746f35d720c9df6341d0dc10f9885ddf0109d44a8376a0b1e4f8e6de95c7",
 "mfg1-electrical-l012":"6bf38e20c1e07bb94c4132c8f23e67fb1bad3d4b9455e430e4fb7af1655dc041",
 "mfg1-electrical-l013":"61e3e1aa396f6864baab347c846ccec451c6669338ca2240ed4341bcaa9d7ade",
 "mfg1-electrical-l014":"9990d5682d40bc83845c192ee91e3a53bb1b9d047c76418e2b218339e7733571",
 "mfg1-surface-lesson-012":"e5a9a9cbab9721de9b90fd516becdfda25b41dadfe600ec6f9a09c7bd334687c",
 "mfg1-surface-lesson-013":"dfe9d92dafdcd046ed51e8fd2b47ad4f4f63c475a8816f82836bbc03713166b8",
 "mfg1-surface-lesson-014":"91d2a2ac2c673a2dd9f791f9bb7f25c50306bb783fdab8a3b4993356e09a1884",

 'mfg1-mechanical-lesson-011':'7c03413b76ee4823f4b9ac8ec818aa9003f657910af6dff216db2eb51c4ac24d',
 'mfg1-electrical-l011':'7ac97182b7515dae74e6937e1e9cfd82d179c70e14b1d1eec949ea5ab80d3c89',
 'mfg1-surface-lesson-011':'04877240b0ed95efd66acf3164467afea7b036133b3f3ae477d7a24d5804f2a2',

 'mfg1-surface-lesson-010':'5af27b4e06505d5542bfe0003988ef628d1e222886b305c43eed0938cc51007e',
 'mfg1-electrical-l004':'ed8991b0b74fd0ee53acaefe01df73626d5bd64d6cac7aada260b37598f11bd9',
 'mfg1-surface-lesson-003':'732f5babc3b1116021edc5fe629199f15ea34e6e46dae7d7c13a92fd59d99cd7',
 'mfg1-surface-lesson-005':'ffa9eee69706855dfb3c0470e0985aba9aa88393ef85ec227786a474e38834d7',
 'mfg1-surface-lesson-006':'10d403ac5e6bd4cb3e079539984a41cb22aaedd6182600405f4ba79b81b9a4f7',
 'mfg1-surface-lesson-007':'747e26aa25b045c129c6f554c21feb702594ea5efeb44b14745a27c2d970e7ee',
};

/** Exact native numbers accompany the artwork; generated scale marks are never a reading exercise. */
export function RoyalWeek01TechnicalDetails({lesson,language='ja'}:{lesson:ManufacturingLesson;language?:string}){
 const {colors}=useStudyAppearance();
 if(revisions[lesson.id]!==lesson.sourceHash)return null;
 const selected=Object.prototype.hasOwnProperty.call(locales,language)?locales[language]:locales.ja;
 const target=selected.lessons[lesson.id],labels=selected.labels;
 if(!target||target.sourceHash!==lesson.sourceHash)return null;
 const body={color:colors.text,fontSize:17,lineHeight:29};
 // Reuse only these exact current source-bound fields; all other native text stays unchanged.
 const checkedExample=selected===locales.ja&&['mfg1-mechanical-lesson-049','mfg1-electrical-l043'].includes(lesson.id)
  ?<Source49Japanese lesson={lesson} paragraphId="section-3" text={target.exampleText} style={body}/>
  :<Text style={body}>{target.exampleText}</Text>;
 const heading={...body,fontWeight:'700' as const};
 const border={borderWidth:1,borderColor:colors.border,borderRadius:10,padding:14,gap:10};
 if(["mfg1-mechanical-lesson-012", "mfg1-mechanical-lesson-013", "mfg1-mechanical-lesson-014", "mfg1-electrical-l012", "mfg1-electrical-l013", "mfg1-electrical-l014", "mfg1-surface-lesson-012", "mfg1-surface-lesson-013", "mfg1-surface-lesson-014"].includes(lesson.id))return <View testID="manufacturing-native-week02-final-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(["mfg1-mechanical-lesson-022", "mfg1-mechanical-lesson-023", "mfg1-mechanical-lesson-024", "mfg1-mechanical-lesson-025", "mfg1-mechanical-lesson-026", "mfg1-mechanical-lesson-027", "mfg1-mechanical-lesson-028", "mfg1-electrical-l022", "mfg1-electrical-l023", "mfg1-electrical-l024", "mfg1-electrical-l025", "mfg1-electrical-l026", "mfg1-electrical-l027", "mfg1-electrical-l028", "mfg1-surface-lesson-022", "mfg1-surface-lesson-023", "mfg1-surface-lesson-024", "mfg1-surface-lesson-025", "mfg1-surface-lesson-026", "mfg1-surface-lesson-027", "mfg1-surface-lesson-028"].includes(lesson.id))return <View testID="manufacturing-native-week04-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(["mfg1-mechanical-lesson-029", "mfg1-mechanical-lesson-030", "mfg1-mechanical-lesson-031", "mfg1-mechanical-lesson-032", "mfg1-mechanical-lesson-033", "mfg1-mechanical-lesson-034", "mfg1-mechanical-lesson-035", "mfg1-electrical-l029", "mfg1-electrical-l030", "mfg1-electrical-l031", "mfg1-electrical-l032", "mfg1-electrical-l033", "mfg1-electrical-l034", "mfg1-electrical-l035", "mfg1-surface-lesson-029", "mfg1-surface-lesson-030", "mfg1-surface-lesson-031", "mfg1-surface-lesson-032", "mfg1-surface-lesson-033", "mfg1-surface-lesson-034", "mfg1-surface-lesson-035"].includes(lesson.id))return <View testID="manufacturing-native-week05-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(["mfg1-mechanical-lesson-036", "mfg1-mechanical-lesson-037", "mfg1-mechanical-lesson-038", "mfg1-mechanical-lesson-039", "mfg1-mechanical-lesson-040", "mfg1-mechanical-lesson-041", "mfg1-mechanical-lesson-042", "mfg1-electrical-l036", "mfg1-electrical-l037", "mfg1-electrical-l038", "mfg1-electrical-l039", "mfg1-electrical-l040", "mfg1-electrical-l041", "mfg1-electrical-l042", "mfg1-surface-lesson-036", "mfg1-surface-lesson-037", "mfg1-surface-lesson-038", "mfg1-surface-lesson-039", "mfg1-surface-lesson-040", "mfg1-surface-lesson-041", "mfg1-surface-lesson-042"].includes(lesson.id))return <View testID="manufacturing-native-week06-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(["mfg1-mechanical-lesson-043", "mfg1-mechanical-lesson-044", "mfg1-mechanical-lesson-045", "mfg1-mechanical-lesson-046", "mfg1-mechanical-lesson-047", "mfg1-mechanical-lesson-048", "mfg1-mechanical-lesson-049", "mfg1-electrical-l043", "mfg1-electrical-l044", "mfg1-electrical-l045", "mfg1-electrical-l046", "mfg1-electrical-l047", "mfg1-electrical-l048", "mfg1-electrical-l049", "mfg1-surface-lesson-043", "mfg1-surface-lesson-044", "mfg1-surface-lesson-045", "mfg1-surface-lesson-046", "mfg1-surface-lesson-047", "mfg1-surface-lesson-048", "mfg1-surface-lesson-049"].includes(lesson.id))return <View testID="manufacturing-native-week07-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(["mfg1-mechanical-lesson-050", "mfg1-mechanical-lesson-051", "mfg1-mechanical-lesson-052", "mfg1-mechanical-lesson-053", "mfg1-mechanical-lesson-054", "mfg1-mechanical-lesson-055", "mfg1-mechanical-lesson-056", "mfg1-electrical-l050", "mfg1-electrical-l051", "mfg1-electrical-l052", "mfg1-electrical-l053", "mfg1-electrical-l054", "mfg1-electrical-l055", "mfg1-electrical-l056", "mfg1-surface-lesson-050", "mfg1-surface-lesson-051", "mfg1-surface-lesson-052", "mfg1-surface-lesson-053", "mfg1-surface-lesson-054", "mfg1-surface-lesson-055", "mfg1-surface-lesson-056"].includes(lesson.id))return <View testID="manufacturing-native-week08-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(["mfg1-mechanical-lesson-057", "mfg1-mechanical-lesson-058", "mfg1-mechanical-lesson-059", "mfg1-mechanical-lesson-060", "mfg1-mechanical-lesson-061", "mfg1-mechanical-lesson-062", "mfg1-mechanical-lesson-063", "mfg1-electrical-l057", "mfg1-electrical-l058", "mfg1-electrical-l059", "mfg1-electrical-l060", "mfg1-electrical-l061", "mfg1-electrical-l062", "mfg1-electrical-l063", "mfg1-surface-lesson-057", "mfg1-surface-lesson-058", "mfg1-surface-lesson-059", "mfg1-surface-lesson-060", "mfg1-surface-lesson-061", "mfg1-surface-lesson-062", "mfg1-surface-lesson-063"].includes(lesson.id))return <View testID="manufacturing-native-week09-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(["mfg1-mechanical-lesson-064", "mfg1-mechanical-lesson-065", "mfg1-mechanical-lesson-066", "mfg1-mechanical-lesson-067", "mfg1-mechanical-lesson-068", "mfg1-mechanical-lesson-069", "mfg1-mechanical-lesson-070", "mfg1-electrical-l064", "mfg1-electrical-l065", "mfg1-electrical-l066", "mfg1-electrical-l067", "mfg1-electrical-l068", "mfg1-electrical-l069", "mfg1-electrical-l070", "mfg1-surface-lesson-064", "mfg1-surface-lesson-065", "mfg1-surface-lesson-066", "mfg1-surface-lesson-067", "mfg1-surface-lesson-068", "mfg1-surface-lesson-069", "mfg1-surface-lesson-070"].includes(lesson.id))return <View testID="manufacturing-native-week10-technical" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(["mfg1-mechanical-lesson-071", "mfg1-mechanical-lesson-072", "mfg1-mechanical-lesson-073", "mfg1-mechanical-lesson-074", "mfg1-mechanical-lesson-075", "mfg1-mechanical-lesson-076", "mfg1-mechanical-lesson-077", "mfg1-electrical-l071", "mfg1-electrical-l072", "mfg1-electrical-l073", "mfg1-electrical-l074", "mfg1-electrical-l075", "mfg1-electrical-l076", "mfg1-electrical-l077", "mfg1-surface-lesson-071", "mfg1-surface-lesson-072", "mfg1-surface-lesson-073"].includes(lesson.id))return <View testID="manufacturing-native-week11-technical" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(["mfg1-mechanical-lesson-078", "mfg1-mechanical-lesson-079", "mfg1-mechanical-lesson-080", "mfg1-mechanical-lesson-081", "mfg1-mechanical-lesson-082", "mfg1-mechanical-lesson-083", "mfg1-mechanical-lesson-084", "mfg1-electrical-l078", "mfg1-electrical-l079", "mfg1-electrical-l080", "mfg1-electrical-l081", "mfg1-electrical-l082", "mfg1-electrical-l083", "mfg1-electrical-l084"].includes(lesson.id))return <View testID="manufacturing-native-week12-technical" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(["mfg1-mechanical-lesson-085", "mfg1-mechanical-lesson-086", "mfg1-mechanical-lesson-087", "mfg1-mechanical-lesson-088", "mfg1-mechanical-lesson-089", "mfg1-mechanical-lesson-090", "mfg1-mechanical-lesson-091", "mfg1-electrical-l085", "mfg1-electrical-l086", "mfg1-electrical-l087", "mfg1-electrical-l088", "mfg1-electrical-l089", "mfg1-electrical-l090", "mfg1-electrical-l091"].includes(lesson.id))return <View testID="manufacturing-native-week13-technical" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(["mfg1-electrical-l092", "mfg1-electrical-l093", "mfg1-electrical-l094", "mfg1-electrical-l095", "mfg1-electrical-l096", "mfg1-electrical-l097", "mfg1-electrical-l098"].includes(lesson.id))return <View testID="manufacturing-native-week14-technical" style={border}>
  <Text style={heading}>{labels.practice} · {target.title}</Text>
  <Text style={heading}>{target.structureTitle}</Text><Text style={body}>{target.structureText}</Text>
  <Text style={heading}>{target.exampleTitle}</Text><Text style={body}>{target.exampleText}</Text>
 </View>;
 if(["mfg1-mechanical-lesson-015", "mfg1-mechanical-lesson-016", "mfg1-mechanical-lesson-017", "mfg1-mechanical-lesson-018", "mfg1-mechanical-lesson-019", "mfg1-mechanical-lesson-020", "mfg1-mechanical-lesson-021", "mfg1-electrical-l015", "mfg1-electrical-l016", "mfg1-electrical-l017", "mfg1-electrical-l018", "mfg1-electrical-l019", "mfg1-electrical-l020", "mfg1-electrical-l021", "mfg1-surface-lesson-015", "mfg1-surface-lesson-016", "mfg1-surface-lesson-017", "mfg1-surface-lesson-018", "mfg1-surface-lesson-019", "mfg1-surface-lesson-020", "mfg1-surface-lesson-021"].includes(lesson.id))return <View testID="manufacturing-native-week03-technical" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(lesson.id==='mfg1-mechanical-lesson-011')return <View testID="manufacturing-native-qc-control-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
  <ManufacturingIllustrationText lesson={lesson} field="exampleTitle" text={target.exampleTitle} enabled={selected===locales.ja} style={heading}/>{checkedExample}
 </View>;
 if(lesson.id==='mfg1-electrical-l011')return <View testID="manufacturing-native-variation-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <Text style={heading}>9.90 mm ≤ x ≤ 10.10 mm</Text>
  {[9.80,10.00,10.20].map(value=><View key={value} style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><Text style={body}>{value.toFixed(2)}</Text><Text style={body}> mm · </Text><ManufacturingNativeLabel lesson={lesson} field={value>=9.90&&value<=10.10?"inRange":"outOfRange"} text={value>=9.90&&value<=10.10?labels.inRange:labels.outOfRange} enabled={selected===locales.ja} style={body}/></View>)}
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"mean"} text={labels.mean} enabled={selected===locales.ja} style={heading}/><Text style={heading}>：(9.80 ＋ 10.00 ＋ 10.20) ÷ 3 ＝ 10.00 mm</Text></View>
  {checkedExample}
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
 </View>;
 if(lesson.id==='mfg1-surface-lesson-011')return <View testID="manufacturing-native-concentration-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <Text style={body}>4.00 g ÷ 0.500 L ＝ 8.00 g/L</Text>
  <Text style={body}>4.00 g ÷ 40.0 g/mol ＝ 0.100 mol</Text>
  <Text style={heading}>0.100 mol ÷ 0.500 L ＝ 0.200 mol/L</Text>
  {checkedExample}
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
 </View>;
 if(lesson.id==='mfg1-surface-lesson-010')return <View testID="manufacturing-native-titration-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <Text style={heading}>13.2 mL − 1.2 mL ＝ 12.0 mL</Text>
  <Text style={body}>HCl ＋ NaOH → NaCl ＋ H₂O · 1：1</Text>
  <Text style={body}>0.100 mol/L × 0.0120 L ＝ 0.00120 mol</Text>
  <Text style={heading}>0.00120 mol ÷ 0.0100 L ＝ 0.120 mol/L</Text>
  {checkedExample}
 </View>;
 if(lesson.id==='mfg1-electrical-l004')return <View testID="manufacturing-native-micrometer-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <Text style={body}>{labels.sleeve}：6 mm ＋ 0.5 mm ＝ 6.5 mm</Text>
  <View accessibilityLabel={`${labels.sleeve}: 6 mm + 0.5 mm = 6.5 mm`} style={{height:110,marginHorizontal:12}}>
   <View style={{position:'absolute',left:0,right:0,top:42,height:2,backgroundColor:colors.text}}/>
   {Array.from({length:14},(_,i)=><View key={i} style={{position:'absolute',left:`${i/14*100}%`,top:i%2===0?21:42,width:i===13?3:1,height:i%2===0?23:18,backgroundColor:i===13?colors.translationText:colors.text}}>
    {i%2===0&&<Text style={{position:'absolute',left:-10,top:-23,width:24,fontSize:15,color:colors.text,textAlign:'center'}}>{i/2}</Text>}
   </View>)}
   <Text style={{position:'absolute',right:0,top:67,fontSize:16,lineHeight:26,fontWeight:'700',color:colors.translationText}}>＋ 0.5 mm</Text>
  </View>
  <Text style={body}>{labels.thimble}：24 × 0.01 mm ＝ 0.24 mm</Text>
  <Text style={heading}>6.5 mm ＋ 0.24 mm ＝ 6.74 mm</Text>
  {checkedExample}
 </View>;
 if(lesson.id==='mfg1-surface-lesson-005')return <View testID="manufacturing-native-electroplating-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><Text style={heading}>＋ </Text><ManufacturingNativeLabel lesson={lesson} field={"anode"} text={labels.anode} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · Cu</Text></View><Text style={body}>Cu → Cu²⁺ ＋ 2e⁻</Text>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><Text style={heading}>− </Text><ManufacturingNativeLabel lesson={lesson} field={"cathode"} text={labels.cathode} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · </Text><ManufacturingNativeLabel lesson={lesson} field={"workpiece"} text={labels.workpiece} enabled={selected===locales.ja} style={heading}/></View><Text style={body}>Cu²⁺ ＋ 2e⁻ → Cu</Text>
  {checkedExample}
 </View>;
 if(lesson.id==='mfg1-surface-lesson-006')return <View testID="manufacturing-native-current-density-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"current"} text={labels.current} enabled={selected===locales.ja} style={body}/><Text style={body}>：7.2 A</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"area"} text={labels.area} enabled={selected===locales.ja} style={body}/><Text style={body}>：2.4 dm²</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"currentDensity"} text={labels.currentDensity} enabled={selected===locales.ja} style={heading}/><Text style={heading}>：7.2 A ÷ 2.4 dm² ＝ 3.0 A/dm²</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"area"} text={labels.area} enabled={selected===locales.ja} style={body}/><Text style={body}>：4.8 dm²</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"currentDensity"} text={labels.currentDensity} enabled={selected===locales.ja} style={heading}/><Text style={heading}>：7.2 A ÷ 4.8 dm² ＝ 1.5 A/dm²</Text></View>
  {checkedExample}
 </View>;
 if(lesson.id==='mfg1-surface-lesson-007')return <View testID="manufacturing-native-anodizing-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><Text style={heading}> · {target.title}</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"electroplating"} text={labels.electroplating} enabled={selected===locales.ja} style={heading}/><Text style={heading}>：</Text><ManufacturingNativeLabel lesson={lesson} field={"workpiece"} text={labels.workpiece} enabled={selected===locales.ja} style={heading}/><Text style={heading}> − (</Text><ManufacturingNativeLabel lesson={lesson} field={"cathode"} text={labels.cathode} enabled={selected===locales.ja} style={heading}/><Text style={heading}>)</Text></View>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"anodizing"} text={labels.anodizing} enabled={selected===locales.ja} style={heading}/><Text style={heading}>：</Text><ManufacturingNativeLabel lesson={lesson} field={"workpiece"} text={labels.workpiece} enabled={selected===locales.ja} style={heading}/><Text style={heading}> ＋ (</Text><ManufacturingNativeLabel lesson={lesson} field={"anode"} text={labels.anode} enabled={selected===locales.ja} style={heading}/><Text style={heading}>)</Text></View>
  {checkedExample}
  <ManufacturingIllustrationText lesson={lesson} field="structureTitle" text={target.structureTitle} enabled={selected===locales.ja} style={heading}/><Text style={body}>{target.structureText}</Text>
 </View>;
 return <View testID="manufacturing-native-coating-example" style={border}>
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end'}}><ManufacturingNativeLabel lesson={lesson} field="practice" text={labels.practice} enabled={selected===locales.ja} style={heading}/><View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><Text style={heading}> · </Text><ManufacturingNativeLabel lesson={lesson} field={"practiceRange"} text={labels.practiceRange} enabled={selected===locales.ja} style={heading}/><Text style={heading}> 8〜12 μm</Text></View></View>
  {[{position:1,value:7},{position:2,value:10},{position:3,value:13}].map(row=><View key={row.position} style={{flexDirection:'row',flexWrap:'wrap',justifyContent:'space-between',gap:8,borderBottomWidth:1,borderBottomColor:colors.border,paddingVertical:8}}>
   <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"position"} text={labels.position} enabled={selected===locales.ja} style={body}/><Text style={body}> </Text><Text style={body}>{row.position}</Text></View><Text style={heading}>{row.value} μm</Text><View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={row.value>=8&&row.value<=12?"inRange":"outOfRange"} text={row.value>=8&&row.value<=12?labels.inRange:labels.outOfRange} enabled={selected===locales.ja} style={body}/></View>
  </View>)}
  <View style={{flexDirection:'row',flexWrap:'wrap',alignItems:'flex-end',maxWidth:'100%'}}><ManufacturingNativeLabel lesson={lesson} field={"mean"} text={labels.mean} enabled={selected===locales.ja} style={heading}/><Text style={heading}>：(7 ＋ 10 ＋ 13) ÷ 3 ＝ 10 μm</Text></View>
  {checkedExample}
 </View>;
}
