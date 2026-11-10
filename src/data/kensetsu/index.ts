import { dailyTechnicalIllustrations, dailyTechnicalIllustrationAspectRatios } from './daily-technical-illustrations';
import { foremanIllustrations, foremanIllustrationAspectRatios } from './foreman-illustrations';
import paragraphReuse from './paragraph-reuse-policy.json';
import { foremanSessions, foremanWeeks } from './foreman';
import { differentialIllustrations, differentialIllustrationAspectRatios } from './differential-illustrations';
import reusePolicy from './reuse-policy.json';
import { fieldPracticalSessions, fieldPracticalWeeks } from './field-practical';
import {deferLessonTranslations,type TranslationBundle} from './localization';
import {weeklyIllustrations,weeklyIllustrationAspectRatios} from './weekly-illustrations';
import type {ImageSourcePropType} from 'react-native';
import session001 from '../../../docs/ssw-workspace/kensetsu/shared-session-001.json';
import session002 from '../../../docs/ssw-workspace/kensetsu/shared-session-002.json';
import session003 from '../../../docs/ssw-workspace/kensetsu/shared-session-003.json';
import session004 from '../../../docs/ssw-workspace/kensetsu/shared-session-004.json';
import session005 from '../../../docs/ssw-workspace/kensetsu/shared-session-005.json';
import session006 from '../../../docs/ssw-workspace/kensetsu/shared-session-006.json';
import session007 from '../../../docs/ssw-workspace/kensetsu/shared-session-007.json';
import session008 from '../../../docs/ssw-workspace/kensetsu/shared-session-008.json';
import session009 from '../../../docs/ssw-workspace/kensetsu/shared-session-009.json';
import session010 from '../../../docs/ssw-workspace/kensetsu/shared-session-010.json';
import session011 from '../../../docs/ssw-workspace/kensetsu/shared-session-011.json';
import session012 from '../../../docs/ssw-workspace/kensetsu/shared-session-012.json';
import session013 from '../../../docs/ssw-workspace/kensetsu/shared-session-013.json';
import session014 from '../../../docs/ssw-workspace/kensetsu/shared-session-014.json';
import session015 from '../../../docs/ssw-workspace/kensetsu/shared-session-015.json';
import session016 from '../../../docs/ssw-workspace/kensetsu/shared-session-016.json';
import session017 from '../../../docs/ssw-workspace/kensetsu/shared-session-017.json';
import session018 from '../../../docs/ssw-workspace/kensetsu/shared-session-018.json';
import session019 from '../../../docs/ssw-workspace/kensetsu/shared-session-019.json';
import session020 from '../../../docs/ssw-workspace/kensetsu/shared-session-020.json';
import session021 from '../../../docs/ssw-workspace/kensetsu/shared-session-021.json';
import session022 from '../../../docs/ssw-workspace/kensetsu/shared-session-022.json';
import session023 from '../../../docs/ssw-workspace/kensetsu/shared-session-023.json';
import session024 from '../../../docs/ssw-workspace/kensetsu/shared-session-024.json';
import session025 from '../../../docs/ssw-workspace/kensetsu/shared-session-025.json';
import session026 from '../../../docs/ssw-workspace/kensetsu/shared-session-026.json';
import session027 from '../../../docs/ssw-workspace/kensetsu/shared-session-027.json';
import session028 from '../../../docs/ssw-workspace/kensetsu/shared-session-028.json';
import session029 from '../../../docs/ssw-workspace/kensetsu/shared-session-029.json';
import session030 from '../../../docs/ssw-workspace/kensetsu/shared-session-030.json';
import session031 from '../../../docs/ssw-workspace/kensetsu/shared-session-031.json';
import session032 from '../../../docs/ssw-workspace/kensetsu/shared-session-032.json';
import session033 from '../../../docs/ssw-workspace/kensetsu/shared-session-033.json';
import session034 from '../../../docs/ssw-workspace/kensetsu/shared-session-034.json';
import session035 from '../../../docs/ssw-workspace/kensetsu/shared-session-035.json';
import session036 from '../../../docs/ssw-workspace/kensetsu/shared-session-036.json';
import session037 from '../../../docs/ssw-workspace/kensetsu/shared-session-037.json';
import session038 from '../../../docs/ssw-workspace/kensetsu/shared-session-038.json';
import session039 from '../../../docs/ssw-workspace/kensetsu/shared-session-039.json';
import session040 from '../../../docs/ssw-workspace/kensetsu/shared-session-040.json';
import session041 from '../../../docs/ssw-workspace/kensetsu/shared-session-041.json';
import session042 from '../../../docs/ssw-workspace/kensetsu/shared-session-042.json';
import session043 from '../../../docs/ssw-workspace/kensetsu/shared-session-043.json';
import session044 from '../../../docs/ssw-workspace/kensetsu/shared-session-044.json';
import session045 from '../../../docs/ssw-workspace/kensetsu/shared-session-045.json';
import session046 from '../../../docs/ssw-workspace/kensetsu/shared-session-046.json';
import session047 from '../../../docs/ssw-workspace/kensetsu/shared-session-047.json';
import session048 from '../../../docs/ssw-workspace/kensetsu/shared-session-048.json';
import session049 from '../../../docs/ssw-workspace/kensetsu/shared-session-049.json';
import session050 from '../../../docs/ssw-workspace/kensetsu/shared-session-050.json';
import session051 from '../../../docs/ssw-workspace/kensetsu/shared-session-051.json';
import session052 from '../../../docs/ssw-workspace/kensetsu/shared-session-052.json';
import session053 from '../../../docs/ssw-workspace/kensetsu/shared-session-053.json';
import session054 from '../../../docs/ssw-workspace/kensetsu/shared-session-054.json';
import session055 from '../../../docs/ssw-workspace/kensetsu/shared-session-055.json';
import session056 from '../../../docs/ssw-workspace/kensetsu/shared-session-056.json';
import session057 from '../../../docs/ssw-workspace/kensetsu/shared-session-057.json';
import session058 from '../../../docs/ssw-workspace/kensetsu/shared-session-058.json';
import session059 from '../../../docs/ssw-workspace/kensetsu/shared-session-059.json';
import session060 from '../../../docs/ssw-workspace/kensetsu/shared-session-060.json';
import session061 from '../../../docs/ssw-workspace/kensetsu/shared-session-061.json';
import session062 from '../../../docs/ssw-workspace/kensetsu/shared-session-062.json';
import session063 from '../../../docs/ssw-workspace/kensetsu/shared-session-063.json';
import session064 from '../../../docs/ssw-workspace/kensetsu/shared-session-064.json';
import session065 from '../../../docs/ssw-workspace/kensetsu/shared-session-065.json';
import session066 from '../../../docs/ssw-workspace/kensetsu/shared-session-066.json';
import session067 from '../../../docs/ssw-workspace/kensetsu/shared-session-067.json';
import session068 from '../../../docs/ssw-workspace/kensetsu/shared-session-068.json';
import session069 from '../../../docs/ssw-workspace/kensetsu/shared-session-069.json';
import session070 from '../../../docs/ssw-workspace/kensetsu/shared-session-070.json';
import session071 from '../../../docs/ssw-workspace/kensetsu/shared-session-071.json';
import session072 from '../../../docs/ssw-workspace/kensetsu/shared-session-072.json';
import session073 from '../../../docs/ssw-workspace/kensetsu/shared-session-073.json';
import session074 from '../../../docs/ssw-workspace/kensetsu/shared-session-074.json';
import session075 from '../../../docs/ssw-workspace/kensetsu/shared-session-075.json';
import session076 from '../../../docs/ssw-workspace/kensetsu/shared-session-076.json';
import session077 from '../../../docs/ssw-workspace/kensetsu/shared-session-077.json';
import session078 from '../../../docs/ssw-workspace/kensetsu/shared-session-078.json';
import session079 from '../../../docs/ssw-workspace/kensetsu/shared-session-079.json';
import session080 from '../../../docs/ssw-workspace/kensetsu/shared-session-080.json';
import session081 from '../../../docs/ssw-workspace/kensetsu/shared-session-081.json';
import session082 from '../../../docs/ssw-workspace/kensetsu/shared-session-082.json';
import session083 from '../../../docs/ssw-workspace/kensetsu/shared-session-083.json';
import session084 from '../../../docs/ssw-workspace/kensetsu/shared-session-084.json';
import session085 from '../../../docs/ssw-workspace/kensetsu/shared-session-085.json';
import session086 from '../../../docs/ssw-workspace/kensetsu/shared-session-086.json';
import session087 from '../../../docs/ssw-workspace/kensetsu/shared-session-087.json';
import session088 from '../../../docs/ssw-workspace/kensetsu/shared-session-088.json';
import session089 from '../../../docs/ssw-workspace/kensetsu/shared-session-089.json';
import session090 from '../../../docs/ssw-workspace/kensetsu/shared-session-090.json';
import session091 from '../../../docs/ssw-workspace/kensetsu/shared-session-091.json';
import session092 from '../../../docs/ssw-workspace/kensetsu/shared-session-092.json';
import session093 from '../../../docs/ssw-workspace/kensetsu/shared-session-093.json';
import session094 from '../../../docs/ssw-workspace/kensetsu/shared-session-094.json';
import session095 from '../../../docs/ssw-workspace/kensetsu/shared-session-095.json';
import session096 from '../../../docs/ssw-workspace/kensetsu/shared-session-096.json';
import session097 from '../../../docs/ssw-workspace/kensetsu/shared-session-097.json';
import session098 from '../../../docs/ssw-workspace/kensetsu/shared-session-098.json';
import session099 from '../../../docs/ssw-workspace/kensetsu/shared-session-099.json';
import session100 from '../../../docs/ssw-workspace/kensetsu/shared-session-100.json';
import session101 from '../../../docs/ssw-workspace/kensetsu/shared-session-101.json';
import session102 from '../../../docs/ssw-workspace/kensetsu/shared-session-102.json';
import session103 from '../../../docs/ssw-workspace/kensetsu/shared-session-103.json';
import session104 from '../../../docs/ssw-workspace/kensetsu/shared-session-104.json';
import session105 from '../../../docs/ssw-workspace/kensetsu/shared-session-105.json';
import session106 from '../../../docs/ssw-workspace/kensetsu/shared-session-106.json';
import session107 from '../../../docs/ssw-workspace/kensetsu/shared-session-107.json';
import session108 from '../../../docs/ssw-workspace/kensetsu/shared-session-108.json';
import session109 from '../../../docs/ssw-workspace/kensetsu/shared-session-109.json';
import session110 from '../../../docs/ssw-workspace/kensetsu/shared-session-110.json';
import session111 from '../../../docs/ssw-workspace/kensetsu/shared-session-111.json';
import session112 from '../../../docs/ssw-workspace/kensetsu/shared-session-112.json';
import session113 from '../../../docs/ssw-workspace/kensetsu/shared-session-113.json';
import session114 from '../../../docs/ssw-workspace/kensetsu/shared-session-114.json';
import session115 from '../../../docs/ssw-workspace/kensetsu/shared-session-115.json';
import session116 from '../../../docs/ssw-workspace/kensetsu/shared-session-116.json';
import session117 from '../../../docs/ssw-workspace/kensetsu/shared-session-117.json';
import session118 from '../../../docs/ssw-workspace/kensetsu/shared-session-118.json';
import session119 from '../../../docs/ssw-workspace/kensetsu/shared-session-119.json';
import session120 from '../../../docs/ssw-workspace/kensetsu/shared-session-120.json';
import session121 from '../../../docs/ssw-workspace/kensetsu/shared-session-121.json';
import session122 from '../../../docs/ssw-workspace/kensetsu/shared-session-122.json';
import session123 from '../../../docs/ssw-workspace/kensetsu/shared-session-123.json';
import session124 from '../../../docs/ssw-workspace/kensetsu/shared-session-124.json';
import session125 from '../../../docs/ssw-workspace/kensetsu/shared-session-125.json';
import session126 from '../../../docs/ssw-workspace/kensetsu/shared-session-126.json';
import session127 from '../../../docs/ssw-workspace/kensetsu/shared-session-127.json';
import session128 from '../../../docs/ssw-workspace/kensetsu/shared-session-128.json';
import session129 from '../../../docs/ssw-workspace/kensetsu/shared-session-129.json';
import session130 from '../../../docs/ssw-workspace/kensetsu/shared-session-130.json';
import session131 from '../../../docs/ssw-workspace/kensetsu/shared-session-131.json';
import session132 from '../../../docs/ssw-workspace/kensetsu/shared-session-132.json';
import session133 from '../../../docs/ssw-workspace/kensetsu/shared-session-133.json';
import session134 from '../../../docs/ssw-workspace/kensetsu/shared-session-134.json';
import session135 from '../../../docs/ssw-workspace/kensetsu/shared-session-135.json';
import session136 from '../../../docs/ssw-workspace/kensetsu/shared-session-136.json';
import session137 from '../../../docs/ssw-workspace/kensetsu/shared-session-137.json';
import session138 from '../../../docs/ssw-workspace/kensetsu/shared-session-138.json';
import session139 from '../../../docs/ssw-workspace/kensetsu/shared-session-139.json';
import session140 from '../../../docs/ssw-workspace/kensetsu/shared-session-140.json';
import session141 from '../../../docs/ssw-workspace/kensetsu/shared-session-141.json';
import session142 from '../../../docs/ssw-workspace/kensetsu/shared-session-142.json';
import session143 from '../../../docs/ssw-workspace/kensetsu/shared-session-143.json';
import session144 from '../../../docs/ssw-workspace/kensetsu/shared-session-144.json';
import session145 from '../../../docs/ssw-workspace/kensetsu/shared-session-145.json';
import session146 from '../../../docs/ssw-workspace/kensetsu/shared-session-146.json';
import session147 from '../../../docs/ssw-workspace/kensetsu/shared-session-147.json';
import session148 from '../../../docs/ssw-workspace/kensetsu/shared-session-148.json';
import session149 from '../../../docs/ssw-workspace/kensetsu/shared-session-149.json';
import session150 from '../../../docs/ssw-workspace/kensetsu/shared-session-150.json';
import session151 from '../../../docs/ssw-workspace/kensetsu/shared-session-151.json';
import session152 from '../../../docs/ssw-workspace/kensetsu/shared-session-152.json';
import session153 from '../../../docs/ssw-workspace/kensetsu/shared-session-153.json';
import session154 from '../../../docs/ssw-workspace/kensetsu/shared-session-154.json';
import session155 from '../../../docs/ssw-workspace/kensetsu/shared-session-155.json';
import session156 from '../../../docs/ssw-workspace/kensetsu/shared-session-156.json';
import session157 from '../../../docs/ssw-workspace/kensetsu/shared-session-157.json';
import session158 from '../../../docs/ssw-workspace/kensetsu/shared-session-158.json';
import session159 from '../../../docs/ssw-workspace/kensetsu/shared-session-159.json';
import session160 from '../../../docs/ssw-workspace/kensetsu/shared-session-160.json';
import session161 from '../../../docs/ssw-workspace/kensetsu/shared-session-161.json';
import session162 from '../../../docs/ssw-workspace/kensetsu/shared-session-162.json';
import session163 from '../../../docs/ssw-workspace/kensetsu/shared-session-163.json';
import session164 from '../../../docs/ssw-workspace/kensetsu/shared-session-164.json';
import session165 from '../../../docs/ssw-workspace/kensetsu/shared-session-165.json';
import session166 from '../../../docs/ssw-workspace/kensetsu/shared-session-166.json';
import session167 from '../../../docs/ssw-workspace/kensetsu/shared-session-167.json';
import session168 from '../../../docs/ssw-workspace/kensetsu/shared-session-168.json';
import session169 from '../../../docs/ssw-workspace/kensetsu/shared-session-169.json';
import session170 from '../../../docs/ssw-workspace/kensetsu/shared-session-170.json';
import session171 from '../../../docs/ssw-workspace/kensetsu/shared-session-171.json';
import session172 from '../../../docs/ssw-workspace/kensetsu/shared-session-172.json';
import session173 from '../../../docs/ssw-workspace/kensetsu/shared-session-173.json';
import session174 from '../../../docs/ssw-workspace/kensetsu/shared-session-174.json';
import session175 from '../../../docs/ssw-workspace/kensetsu/shared-session-175.json';
import session176 from '../../../docs/ssw-workspace/kensetsu/shared-session-176.json';
import session177 from '../../../docs/ssw-workspace/kensetsu/shared-session-177.json';
import session178 from '../../../docs/ssw-workspace/kensetsu/shared-session-178.json';
import session179 from '../../../docs/ssw-workspace/kensetsu/shared-session-179.json';
import session180 from '../../../docs/ssw-workspace/kensetsu/shared-session-180.json';
import session181 from '../../../docs/ssw-workspace/kensetsu/shared-session-181.json';
import session182 from '../../../docs/ssw-workspace/kensetsu/shared-session-182.json';
import session183 from '../../../docs/ssw-workspace/kensetsu/shared-session-183.json';
import session184 from '../../../docs/ssw-workspace/kensetsu/shared-session-184.json';
import session185 from '../../../docs/ssw-workspace/kensetsu/shared-session-185.json';
import session186 from '../../../docs/ssw-workspace/kensetsu/shared-session-186.json';
import session187 from '../../../docs/ssw-workspace/kensetsu/shared-session-187.json';
import session188 from '../../../docs/ssw-workspace/kensetsu/shared-session-188.json';
import session189 from '../../../docs/ssw-workspace/kensetsu/shared-session-189.json';
import session190 from '../../../docs/ssw-workspace/kensetsu/shared-session-190.json';
import session191 from '../../../docs/ssw-workspace/kensetsu/shared-session-191.json';
import session192 from '../../../docs/ssw-workspace/kensetsu/shared-session-192.json';
import session193 from '../../../docs/ssw-workspace/kensetsu/shared-session-193.json';
import session194 from '../../../docs/ssw-workspace/kensetsu/shared-session-194.json';
import session195 from '../../../docs/ssw-workspace/kensetsu/shared-session-195.json';
import session196 from '../../../docs/ssw-workspace/kensetsu/shared-session-196.json';
import session197 from '../../../docs/ssw-workspace/kensetsu/shared-session-197.json';
import session198 from '../../../docs/ssw-workspace/kensetsu/shared-session-198.json';
import session199 from '../../../docs/ssw-workspace/kensetsu/shared-session-199.json';
import session200 from '../../../docs/ssw-workspace/kensetsu/shared-session-200.json';
import session201 from '../../../docs/ssw-workspace/kensetsu/shared-session-201.json';
import session202 from '../../../docs/ssw-workspace/kensetsu/shared-session-202.json';
import session203 from '../../../docs/ssw-workspace/kensetsu/shared-session-203.json';
import session204 from '../../../docs/ssw-workspace/kensetsu/shared-session-204.json';
import session205 from '../../../docs/ssw-workspace/kensetsu/shared-session-205.json';
import session206 from '../../../docs/ssw-workspace/kensetsu/shared-session-206.json';
import session207 from '../../../docs/ssw-workspace/kensetsu/shared-session-207.json';
import session208 from '../../../docs/ssw-workspace/kensetsu/shared-session-208.json';
import session209 from '../../../docs/ssw-workspace/kensetsu/shared-session-209.json';
import session210 from '../../../docs/ssw-workspace/kensetsu/shared-session-210.json';
import session211 from '../../../docs/ssw-workspace/kensetsu/shared-session-211.json';
import session212 from '../../../docs/ssw-workspace/kensetsu/shared-session-212.json';
import session213 from '../../../docs/ssw-workspace/kensetsu/shared-session-213.json';
import session214 from '../../../docs/ssw-workspace/kensetsu/shared-session-214.json';
import session215 from '../../../docs/ssw-workspace/kensetsu/shared-session-215.json';
import session216 from '../../../docs/ssw-workspace/kensetsu/shared-session-216.json';
import session217 from '../../../docs/ssw-workspace/kensetsu/shared-session-217.json';
import session218 from '../../../docs/ssw-workspace/kensetsu/shared-session-218.json';
import session219 from '../../../docs/ssw-workspace/kensetsu/shared-session-219.json';
import session220 from '../../../docs/ssw-workspace/kensetsu/shared-session-220.json';
import session221 from '../../../docs/ssw-workspace/kensetsu/shared-session-221.json';
import session222 from '../../../docs/ssw-workspace/kensetsu/shared-session-222.json';
import session223 from '../../../docs/ssw-workspace/kensetsu/shared-session-223.json';
import session224 from '../../../docs/ssw-workspace/kensetsu/shared-session-224.json';
import session225 from '../../../docs/ssw-workspace/kensetsu/shared-session-225.json';
import session226 from '../../../docs/ssw-workspace/kensetsu/shared-session-226.json';
import session227 from '../../../docs/ssw-workspace/kensetsu/shared-session-227.json';
import session228 from '../../../docs/ssw-workspace/kensetsu/shared-session-228.json';
import session229 from '../../../docs/ssw-workspace/kensetsu/shared-session-229.json';
import session230 from '../../../docs/ssw-workspace/kensetsu/shared-session-230.json';
import session231 from '../../../docs/ssw-workspace/kensetsu/shared-session-231.json';
import session232 from '../../../docs/ssw-workspace/kensetsu/shared-session-232.json';
import session233 from '../../../docs/ssw-workspace/kensetsu/shared-session-233.json';
import session234 from '../../../docs/ssw-workspace/kensetsu/shared-session-234.json';
import session235 from '../../../docs/ssw-workspace/kensetsu/shared-session-235.json';
import session236 from '../../../docs/ssw-workspace/kensetsu/shared-session-236.json';
import session237 from '../../../docs/ssw-workspace/kensetsu/shared-session-237.json';
import session238 from '../../../docs/ssw-workspace/kensetsu/shared-session-238.json';
import session239 from '../../../docs/ssw-workspace/kensetsu/shared-session-239.json';
import session240 from '../../../docs/ssw-workspace/kensetsu/shared-session-240.json';
import session241 from '../../../docs/ssw-workspace/kensetsu/shared-session-241.json';
import session242 from '../../../docs/ssw-workspace/kensetsu/shared-session-242.json';
import session243 from '../../../docs/ssw-workspace/kensetsu/shared-session-243.json';
import session244 from '../../../docs/ssw-workspace/kensetsu/shared-session-244.json';
import session245 from '../../../docs/ssw-workspace/kensetsu/shared-session-245.json';
import session246 from '../../../docs/ssw-workspace/kensetsu/shared-session-246.json';
import session247 from '../../../docs/ssw-workspace/kensetsu/shared-session-247.json';
import session248 from '../../../docs/ssw-workspace/kensetsu/shared-session-248.json';
import session249 from '../../../docs/ssw-workspace/kensetsu/shared-session-249.json';
import session250 from '../../../docs/ssw-workspace/kensetsu/shared-session-250.json';
import session251 from '../../../docs/ssw-workspace/kensetsu/shared-session-251.json';
import session252 from '../../../docs/ssw-workspace/kensetsu/shared-session-252.json';
import session253 from '../../../docs/ssw-workspace/kensetsu/shared-session-253.json';
import session254 from '../../../docs/ssw-workspace/kensetsu/shared-session-254.json';
import session255 from '../../../docs/ssw-workspace/kensetsu/shared-session-255.json';
import session256 from '../../../docs/ssw-workspace/kensetsu/shared-session-256.json';
import session257 from '../../../docs/ssw-workspace/kensetsu/shared-session-257.json';
import session258 from '../../../docs/ssw-workspace/kensetsu/shared-session-258.json';
import session259 from '../../../docs/ssw-workspace/kensetsu/shared-session-259.json';
import session260 from '../../../docs/ssw-workspace/kensetsu/shared-session-260.json';
import session261 from '../../../docs/ssw-workspace/kensetsu/shared-session-261.json';
import session262 from '../../../docs/ssw-workspace/kensetsu/shared-session-262.json';
import session263 from '../../../docs/ssw-workspace/kensetsu/shared-session-263.json';
import session264 from '../../../docs/ssw-workspace/kensetsu/shared-session-264.json';
import session265 from '../../../docs/ssw-workspace/kensetsu/shared-session-265.json';
import session266 from '../../../docs/ssw-workspace/kensetsu/shared-session-266.json';
import session267 from '../../../docs/ssw-workspace/kensetsu/shared-session-267.json';
import session268 from '../../../docs/ssw-workspace/kensetsu/shared-session-268.json';
import session269 from '../../../docs/ssw-workspace/kensetsu/shared-session-269.json';
import session270 from '../../../docs/ssw-workspace/kensetsu/shared-session-270.json';
import session271 from '../../../docs/ssw-workspace/kensetsu/shared-session-271.json';
import session272 from '../../../docs/ssw-workspace/kensetsu/shared-session-272.json';
import session273 from '../../../docs/ssw-workspace/kensetsu/shared-session-273.json';
import session274 from '../../../docs/ssw-workspace/kensetsu/shared-session-274.json';
import session275 from '../../../docs/ssw-workspace/kensetsu/shared-session-275.json';
import session276 from '../../../docs/ssw-workspace/kensetsu/shared-session-276.json';
import session277 from '../../../docs/ssw-workspace/kensetsu/shared-session-277.json';
import session278 from '../../../docs/ssw-workspace/kensetsu/shared-session-278.json';
import session279 from '../../../docs/ssw-workspace/kensetsu/shared-session-279.json';
import session280 from '../../../docs/ssw-workspace/kensetsu/shared-session-280.json';
import session281 from '../../../docs/ssw-workspace/kensetsu/shared-session-281.json';
import session282 from '../../../docs/ssw-workspace/kensetsu/shared-session-282.json';
import session283 from '../../../docs/ssw-workspace/kensetsu/shared-session-283.json';
import session284 from '../../../docs/ssw-workspace/kensetsu/shared-session-284.json';
import session285 from '../../../docs/ssw-workspace/kensetsu/shared-session-285.json';
import session286 from '../../../docs/ssw-workspace/kensetsu/shared-session-286.json';
import session287 from '../../../docs/ssw-workspace/kensetsu/shared-session-287.json';
import session288 from '../../../docs/ssw-workspace/kensetsu/shared-session-288.json';
import session289 from '../../../docs/ssw-workspace/kensetsu/shared-session-289.json';
import session290 from '../../../docs/ssw-workspace/kensetsu/shared-session-290.json';
import session291 from '../../../docs/ssw-workspace/kensetsu/shared-session-291.json';
import session292 from '../../../docs/ssw-workspace/kensetsu/shared-session-292.json';
import session293 from '../../../docs/ssw-workspace/kensetsu/shared-session-293.json';
import session294 from '../../../docs/ssw-workspace/kensetsu/shared-session-294.json';
import session295 from '../../../docs/ssw-workspace/kensetsu/shared-session-295.json';
import session296 from '../../../docs/ssw-workspace/kensetsu/shared-session-296.json';
import session297 from '../../../docs/ssw-workspace/kensetsu/shared-session-297.json';
import session298 from '../../../docs/ssw-workspace/kensetsu/shared-session-298.json';
import session299 from '../../../docs/ssw-workspace/kensetsu/shared-session-299.json';
import session300 from '../../../docs/ssw-workspace/kensetsu/shared-session-300.json';
import session301 from '../../../docs/ssw-workspace/kensetsu/shared-session-301.json';
import session302 from '../../../docs/ssw-workspace/kensetsu/shared-session-302.json';
import session303 from '../../../docs/ssw-workspace/kensetsu/shared-session-303.json';
import session304 from '../../../docs/ssw-workspace/kensetsu/shared-session-304.json';
import session305 from '../../../docs/ssw-workspace/kensetsu/shared-session-305.json';
import session306 from '../../../docs/ssw-workspace/kensetsu/shared-session-306.json';
import session307 from '../../../docs/ssw-workspace/kensetsu/shared-session-307.json';
import session308 from '../../../docs/ssw-workspace/kensetsu/shared-session-308.json';
import session309 from '../../../docs/ssw-workspace/kensetsu/shared-session-309.json';
import session310 from '../../../docs/ssw-workspace/kensetsu/shared-session-310.json';
import session311 from '../../../docs/ssw-workspace/kensetsu/shared-session-311.json';
import session312 from '../../../docs/ssw-workspace/kensetsu/shared-session-312.json';
import session313 from '../../../docs/ssw-workspace/kensetsu/shared-session-313.json';
import session314 from '../../../docs/ssw-workspace/kensetsu/shared-session-314.json';
import session315 from '../../../docs/ssw-workspace/kensetsu/shared-session-315.json';
import session316 from '../../../docs/ssw-workspace/kensetsu/shared-session-316.json';
import session317 from '../../../docs/ssw-workspace/kensetsu/shared-session-317.json';
import session318 from '../../../docs/ssw-workspace/kensetsu/shared-session-318.json';
import session319 from '../../../docs/ssw-workspace/kensetsu/shared-session-319.json';
import session320 from '../../../docs/ssw-workspace/kensetsu/shared-session-320.json';
import session321 from '../../../docs/ssw-workspace/kensetsu/shared-session-321.json';
import session322 from '../../../docs/ssw-workspace/kensetsu/shared-session-322.json';
import session323 from '../../../docs/ssw-workspace/kensetsu/shared-session-323.json';
import session324 from '../../../docs/ssw-workspace/kensetsu/shared-session-324.json';
import session325 from '../../../docs/ssw-workspace/kensetsu/shared-session-325.json';
import session326 from '../../../docs/ssw-workspace/kensetsu/shared-session-326.json';
import session327 from '../../../docs/ssw-workspace/kensetsu/shared-session-327.json';
import session328 from '../../../docs/ssw-workspace/kensetsu/shared-session-328.json';
import session329 from '../../../docs/ssw-workspace/kensetsu/shared-session-329.json';
import session330 from '../../../docs/ssw-workspace/kensetsu/shared-session-330.json';
import session331 from '../../../docs/ssw-workspace/kensetsu/shared-session-331.json';
import session332 from '../../../docs/ssw-workspace/kensetsu/shared-session-332.json';
import session333 from '../../../docs/ssw-workspace/kensetsu/shared-session-333.json';
import session334 from '../../../docs/ssw-workspace/kensetsu/shared-session-334.json';
import session335 from '../../../docs/ssw-workspace/kensetsu/shared-session-335.json';
import session336 from '../../../docs/ssw-workspace/kensetsu/shared-session-336.json';
import session337 from '../../../docs/ssw-workspace/kensetsu/shared-session-337.json';
import session338 from '../../../docs/ssw-workspace/kensetsu/shared-session-338.json';
import session339 from '../../../docs/ssw-workspace/kensetsu/shared-session-339.json';
import session340 from '../../../docs/ssw-workspace/kensetsu/shared-session-340.json';
import session341 from '../../../docs/ssw-workspace/kensetsu/shared-session-341.json';
import session342 from '../../../docs/ssw-workspace/kensetsu/shared-session-342.json';
import session343 from '../../../docs/ssw-workspace/kensetsu/shared-session-343.json';
import session344 from '../../../docs/ssw-workspace/kensetsu/shared-session-344.json';
import session345 from '../../../docs/ssw-workspace/kensetsu/shared-session-345.json';
import session346 from '../../../docs/ssw-workspace/kensetsu/shared-session-346.json';
import session347 from '../../../docs/ssw-workspace/kensetsu/shared-session-347.json';
import session348 from '../../../docs/ssw-workspace/kensetsu/shared-session-348.json';
import session349 from '../../../docs/ssw-workspace/kensetsu/shared-session-349.json';
import session350 from '../../../docs/ssw-workspace/kensetsu/shared-session-350.json';
import session351 from '../../../docs/ssw-workspace/kensetsu/shared-session-351.json';
import session352 from '../../../docs/ssw-workspace/kensetsu/shared-session-352.json';
import session353 from '../../../docs/ssw-workspace/kensetsu/shared-session-353.json';
import session354 from '../../../docs/ssw-workspace/kensetsu/shared-session-354.json';
import session355 from '../../../docs/ssw-workspace/kensetsu/shared-session-355.json';
import session356 from '../../../docs/ssw-workspace/kensetsu/shared-session-356.json';
import session357 from '../../../docs/ssw-workspace/kensetsu/shared-session-357.json';
import session358 from '../../../docs/ssw-workspace/kensetsu/shared-session-358.json';
import session359 from '../../../docs/ssw-workspace/kensetsu/shared-session-359.json';
import session360 from '../../../docs/ssw-workspace/kensetsu/shared-session-360.json';
import session361 from '../../../docs/ssw-workspace/kensetsu/shared-session-361.json';
import session362 from '../../../docs/ssw-workspace/kensetsu/shared-session-362.json';
import session363 from '../../../docs/ssw-workspace/kensetsu/shared-session-363.json';
import session364 from '../../../docs/ssw-workspace/kensetsu/shared-session-364.json';
import session365 from '../../../docs/ssw-workspace/kensetsu/shared-session-365.json';
import session366 from '../../../docs/ssw-workspace/kensetsu/shared-session-366.json';
import session367 from '../../../docs/ssw-workspace/kensetsu/shared-session-367.json';
import session368 from '../../../docs/ssw-workspace/kensetsu/shared-session-368.json';
import session369 from '../../../docs/ssw-workspace/kensetsu/shared-session-369.json';
import session370 from '../../../docs/ssw-workspace/kensetsu/shared-session-370.json';
import session371 from '../../../docs/ssw-workspace/kensetsu/shared-session-371.json';
import session372 from '../../../docs/ssw-workspace/kensetsu/shared-session-372.json';
import session373 from '../../../docs/ssw-workspace/kensetsu/shared-session-373.json';
import session374 from '../../../docs/ssw-workspace/kensetsu/shared-session-374.json';
import session375 from '../../../docs/ssw-workspace/kensetsu/shared-session-375.json';
import session376 from '../../../docs/ssw-workspace/kensetsu/shared-session-376.json';
import session377 from '../../../docs/ssw-workspace/kensetsu/shared-session-377.json';
import session378 from '../../../docs/ssw-workspace/kensetsu/shared-session-378.json';
import session379 from '../../../docs/ssw-workspace/kensetsu/shared-session-379.json';
import session380 from '../../../docs/ssw-workspace/kensetsu/shared-session-380.json';
import session381 from '../../../docs/ssw-workspace/kensetsu/shared-session-381.json';
import session382 from '../../../docs/ssw-workspace/kensetsu/shared-session-382.json';
import session383 from '../../../docs/ssw-workspace/kensetsu/shared-session-383.json';
import session384 from '../../../docs/ssw-workspace/kensetsu/shared-session-384.json';
import session385 from '../../../docs/ssw-workspace/kensetsu/shared-session-385.json';
import week001 from '../../../docs/ssw-workspace/kensetsu/shared-week-001.json';
import week002 from '../../../docs/ssw-workspace/kensetsu/shared-week-002.json';
import week003 from '../../../docs/ssw-workspace/kensetsu/shared-week-003.json';
import week004 from '../../../docs/ssw-workspace/kensetsu/shared-week-004.json';
import week005 from '../../../docs/ssw-workspace/kensetsu/shared-week-005.json';

import week006 from '../../../docs/ssw-workspace/kensetsu/shared-week-006.json';

import week007 from '../../../docs/ssw-workspace/kensetsu/shared-week-007.json';

import week008 from '../../../docs/ssw-workspace/kensetsu/shared-week-008.json';

import week009 from '../../../docs/ssw-workspace/kensetsu/shared-week-009.json';

import week010 from '../../../docs/ssw-workspace/kensetsu/shared-week-010.json';

import week011 from '../../../docs/ssw-workspace/kensetsu/shared-week-011.json';

import week012 from '../../../docs/ssw-workspace/kensetsu/shared-week-012.json';

import week013 from '../../../docs/ssw-workspace/kensetsu/shared-week-013.json';

import week014 from '../../../docs/ssw-workspace/kensetsu/shared-week-014.json';

import week015 from '../../../docs/ssw-workspace/kensetsu/shared-week-015.json';

import week016 from '../../../docs/ssw-workspace/kensetsu/shared-week-016.json';
import week017 from '../../../docs/ssw-workspace/kensetsu/shared-week-017.json';
import week018 from '../../../docs/ssw-workspace/kensetsu/shared-week-018.json';
import week019 from '../../../docs/ssw-workspace/kensetsu/shared-week-019.json';
import week020 from '../../../docs/ssw-workspace/kensetsu/shared-week-020.json';
import week021 from '../../../docs/ssw-workspace/kensetsu/shared-week-021.json';
import week022 from '../../../docs/ssw-workspace/kensetsu/shared-week-022.json';
import week023 from '../../../docs/ssw-workspace/kensetsu/shared-week-023.json';
import week024 from '../../../docs/ssw-workspace/kensetsu/shared-week-024.json';
import week025 from '../../../docs/ssw-workspace/kensetsu/shared-week-025.json';
import week026 from '../../../docs/ssw-workspace/kensetsu/shared-week-026.json';
import week027 from '../../../docs/ssw-workspace/kensetsu/shared-week-027.json';
import week028 from '../../../docs/ssw-workspace/kensetsu/shared-week-028.json';
import week029 from '../../../docs/ssw-workspace/kensetsu/shared-week-029.json';
import week030 from '../../../docs/ssw-workspace/kensetsu/shared-week-030.json';
import week031 from '../../../docs/ssw-workspace/kensetsu/shared-week-031.json';
import week032 from '../../../docs/ssw-workspace/kensetsu/shared-week-032.json';
import week033 from '../../../docs/ssw-workspace/kensetsu/shared-week-033.json';
import week034 from '../../../docs/ssw-workspace/kensetsu/shared-week-034.json';
import week035 from '../../../docs/ssw-workspace/kensetsu/shared-week-035.json';
import week036 from '../../../docs/ssw-workspace/kensetsu/shared-week-036.json';
import week037 from '../../../docs/ssw-workspace/kensetsu/shared-week-037.json';
import week038 from '../../../docs/ssw-workspace/kensetsu/shared-week-038.json';
import week039 from '../../../docs/ssw-workspace/kensetsu/shared-week-039.json';
import week040 from '../../../docs/ssw-workspace/kensetsu/shared-week-040.json';
import week041 from '../../../docs/ssw-workspace/kensetsu/shared-week-041.json';
import week042 from '../../../docs/ssw-workspace/kensetsu/shared-week-042.json';
import week043 from '../../../docs/ssw-workspace/kensetsu/shared-week-043.json';
import week044 from '../../../docs/ssw-workspace/kensetsu/shared-week-044.json';
import week045 from '../../../docs/ssw-workspace/kensetsu/shared-week-045.json';
import week046 from '../../../docs/ssw-workspace/kensetsu/shared-week-046.json';
import week047 from '../../../docs/ssw-workspace/kensetsu/shared-week-047.json';
import week048 from '../../../docs/ssw-workspace/kensetsu/shared-week-048.json';
import week049 from '../../../docs/ssw-workspace/kensetsu/shared-week-049.json';
import week050 from '../../../docs/ssw-workspace/kensetsu/shared-week-050.json';
import week051 from '../../../docs/ssw-workspace/kensetsu/shared-week-051.json';
import week052 from '../../../docs/ssw-workspace/kensetsu/shared-week-052.json';
import week053 from '../../../docs/ssw-workspace/kensetsu/shared-week-053.json';
import week054 from '../../../docs/ssw-workspace/kensetsu/shared-week-054.json';
import week055 from '../../../docs/ssw-workspace/kensetsu/shared-week-055.json';

export type Level='1'|'2';
export type Field='utilities'|'building'|'civil';
export type Paragraph={id:string;ja:string;translations?:Record<string,string>};
export type Cluster={id:string;titleJa:string;titleTranslations?:Record<string,string>;paragraphs:Paragraph[];applicationPromptJa?:string;applicationPromptTranslations?:Record<string,string>;reflectionJa?:string;reflectionTranslations?:Record<string,string>;learningActivity?:{ja:string;translations?:Record<string,string>;graded?:boolean};terms?:{ja:string;reading:string;translations?:Record<string,string>}[];illustration?:{assetPath:string;captionJa:string;captionTranslations?:Record<string,string>}};
export type Session={scopeRevision?:string;sourceReferences?:{sourceId:string}[];id:string;revision:number;titleJa:string;titleTranslations?:Record<string,string>;clusters:Cluster[];keyTerms?:{term:string;reading:string;translations?:Record<string,string>}[];illustrations?:{path:string;clusterId?:string;altJa:string;altTranslations?:Record<string,string>}[]};
export type Week={id:string;titleJa:string;sessionIds:string[]};
export const fields:{id:Field;title:string}[]=[{id:'utilities',title:'ライフライン・設備'},{id:'building',title:'建築'},{id:'civil',title:'土木'}];

const sourceSessions:Session[]=[...foremanSessions,...fieldPracticalSessions,session001,session002,session003,session004,session005,session006,session007,session008,session009,session010,session011,session012,session013,session014,session015,session016,session017,session018,session019,session020,session021,session022,session023,session024,session025,session026,session027,session028,session029,session030,session031,session032,session033,session034,session035,session036,session037,session038,session039,session040,session041,session042,session043,session044,session045,session046,session047,session048,session049,session050,session051,session052,session053,session054,session055,session056,session057,session058,session059,session060,session061,session062,session063,session064,session065,session066,session067,session068,session069,session070,session071,session072,session073,session074,session075,session076,session077,session078,session079,session080,session081,session082,session083,session084,session085,session086,session087,session088,session089,session090,session091,session092,session093,session094,session095,session096,session097,session098,session099,session100,session101,session102,session103,session104,session105,session106,session107,session108,session109,session110,session111,session112,session113,session114,session115,session116,session117,session118,session119,session120,session121,session122,session123,session124,session125,session126,session127,session128,session129,session130,session131,session132,session133,session134,session135,session136,session137,session138,session139,session140,session141,session142,session143,session144,session145,session146,session147,session148,session149,session150,session151,session152,session153,session154,session155,session156,session157,session158,session159,session160,session161,session162,session163,session164,session165,session166,session167,session168,session169,session170,session171,session172,session173,session174,session175,session176,session177,session178,session179,session180,session181,session182,session183,session184,session185,session186,session187,session188,session189,session190,session191,session192,session193,session194,session195,session196,session197,session198,session199,session200,session201,session202,session203,session204,session205,session206,session207,session208,session209,session210,session211,session212,session213,session214,session215,session216,session217,session218,session219,session220,session221,session222,session223,session224,session225,session226,session227,session228,session229,session230,session231,session232,session233,session234,session235,session236,session237,session238,session239,session240,session241,session242,session243,session244,session245,session246,session247,session248,session249,session250,session251,session252,session253,session254,session255,session256,session257,session258,session259,session260,session261,session262,session263,session264,session265,session266,session267,session268,session269,session270,session271,session272,session273,session274,session275,session276,session277,session278,session279,session280,session281,session282,session283,session284,session285,session286,session287,session288,session289,session290,session291,session292,session293,session294,session295,session296,session297,session298,session299,session300,session301,session302,session303,session304,session305,session306,session307,session308,session309,session310,session311,session312,session313,session314,session315,session316,session317,session318,session319,session320,session321,session322,session323,session324,session325,session326,session327,session328,session329,session330,session331,session332,session333,session334,session335,session336,session337,session338,session339,session340,session341,session342,session343,session344,session345,session346,session347,session348,session349,session350,session351,session352,session353,session354,session355,session356,session357,session358,session359,session360,session361,session362,session363,session364,session365,session366,session367,session368,session369,session370,session371,session372,session373,session374,session375,session376,session377,session378,session379,session380,session381,session382,session383,session384,session385] as unknown as Session[];
const translationLoaders:Record<string,()=>TranslationBundle>={
 "kensetsu-common-session-001":()=>require("./translations/session-001.json"),
 "kensetsu-common-session-002":()=>require("./translations/session-002.json"),
 "kensetsu-common-session-003":()=>require("./translations/session-003.json"),
 "kensetsu-common-session-004":()=>require("./translations/session-004.json"),
 "kensetsu-common-session-005":()=>require("./translations/session-005.json"),
 "kensetsu-common-session-006":()=>require("./translations/session-006.json"),
 "kensetsu-common-session-007":()=>require("./translations/session-007.json"),
 "kensetsu-common-session-008":()=>require("./translations/session-008.json"),
 "kensetsu-common-session-009":()=>require("./translations/session-009.json"),
 "kensetsu-common-session-010":()=>require("./translations/session-010.json"),
 "kensetsu-common-session-011":()=>require("./translations/session-011.json"),
 "kensetsu-common-session-012":()=>require("./translations/session-012.json"),
 "kensetsu-common-session-013":()=>require("./translations/session-013.json"),
 "kensetsu-common-session-014":()=>require("./translations/session-014.json"),
 "kensetsu-common-session-015":()=>require("./translations/session-015.json"),
 "kensetsu-common-session-016":()=>require("./translations/session-016.json"),
 "kensetsu-common-session-017":()=>require("./translations/session-017.json"),
 "kensetsu-common-session-018":()=>require("./translations/session-018.json"),
 "kensetsu-common-session-019":()=>require("./translations/session-019.json"),
 "kensetsu-common-session-020":()=>require("./translations/session-020.json"),
 "kensetsu-common-session-021":()=>require("./translations/session-021.json"),
 "kensetsu-common-session-022":()=>require("./translations/session-022.json"),
 "kensetsu-common-session-023":()=>require("./translations/session-023.json"),
 "kensetsu-common-session-024":()=>require("./translations/session-024.json"),
 "kensetsu-common-session-025":()=>require("./translations/session-025.json"),
 "kensetsu-common-session-026":()=>require("./translations/session-026.json"),
 "kensetsu-common-session-027":()=>require("./translations/session-027.json"),
 "kensetsu-common-session-028":()=>require("./translations/session-028.json"),
 "kensetsu-common-session-029":()=>require("./translations/session-029.json"),
 "kensetsu-common-session-030":()=>require("./translations/session-030.json"),
 "kensetsu-common-session-031":()=>require("./translations/session-031.json"),
 "kensetsu-common-session-032":()=>require("./translations/session-032.json"),
 "kensetsu-common-session-033":()=>require("./translations/session-033.json"),
 "kensetsu-common-session-034":()=>require("./translations/session-034.json"),
 "kensetsu-common-session-035":()=>require("./translations/session-035.json"),
 "kensetsu-common-session-036":()=>require("./translations/session-036.json"),
 "kensetsu-common-session-037":()=>require("./translations/session-037.json"),
 "kensetsu-common-session-038":()=>require("./translations/session-038.json"),
 "kensetsu-common-session-039":()=>require("./translations/session-039.json"),
 "kensetsu-common-session-040":()=>require("./translations/session-040.json"),
 "kensetsu-common-session-041":()=>require("./translations/session-041.json"),
 "kensetsu-common-session-042":()=>require("./translations/session-042.json"),
 "kensetsu-common-session-043":()=>require("./translations/session-043.json"),
 "kensetsu-common-session-044":()=>require("./translations/session-044.json"),
 "kensetsu-common-session-045":()=>require("./translations/session-045.json"),
 "kensetsu-common-session-046":()=>require("./translations/session-046.json"),
 "kensetsu-common-session-047":()=>require("./translations/session-047.json"),
 "kensetsu-common-session-048":()=>require("./translations/session-048.json"),
 "kensetsu-common-session-049":()=>require("./translations/session-049.json"),
 "kensetsu-common-session-050":()=>require("./translations/session-050.json"),
 "kensetsu-common-session-051":()=>require("./translations/session-051.json"),
 "kensetsu-common-session-052":()=>require("./translations/session-052.json"),
 "kensetsu-common-session-053":()=>require("./translations/session-053.json"),
 "kensetsu-common-session-054":()=>require("./translations/session-054.json"),
 "kensetsu-common-session-055":()=>require("./translations/session-055.json"),
 "kensetsu-common-session-056":()=>require("./translations/session-056.json"),
 "kensetsu-common-session-057":()=>require("./translations/session-057.json"),
 "kensetsu-common-session-058":()=>require("./translations/session-058.json"),
 "kensetsu-common-session-059":()=>require("./translations/session-059.json"),
 "kensetsu-common-session-060":()=>require("./translations/session-060.json"),
 "kensetsu-common-session-061":()=>require("./translations/session-061.json"),
 "kensetsu-common-session-062":()=>require("./translations/session-062.json"),
 "kensetsu-common-session-063":()=>require("./translations/session-063.json"),
 "kensetsu-common-session-064":()=>require("./translations/session-064.json"),
 "kensetsu-common-session-065":()=>require("./translations/session-065.json"),
 "kensetsu-common-session-066":()=>require("./translations/session-066.json"),
 "kensetsu-common-session-067":()=>require("./translations/session-067.json"),
 "kensetsu-common-session-068":()=>require("./translations/session-068.json"),
 "kensetsu-common-session-069":()=>require("./translations/session-069.json"),
 "kensetsu-common-session-070":()=>require("./translations/session-070.json"),
 "kensetsu-common-session-071":()=>require("./translations/session-071.json"),
 "kensetsu-common-session-072":()=>require("./translations/session-072.json"),
 "kensetsu-common-session-073":()=>require("./translations/session-073.json"),
 "kensetsu-common-session-074":()=>require("./translations/session-074.json"),
 "kensetsu-common-session-075":()=>require("./translations/session-075.json"),
 "kensetsu-common-session-076":()=>require("./translations/session-076.json"),
 "kensetsu-common-session-077":()=>require("./translations/session-077.json"),
 "kensetsu-common-session-078":()=>require("./translations/session-078.json"),
 "kensetsu-common-session-079":()=>require("./translations/session-079.json"),
 "kensetsu-common-session-080":()=>require("./translations/session-080.json"),
 "kensetsu-common-session-081":()=>require("./translations/session-081.json"),
 "kensetsu-common-session-082":()=>require("./translations/session-082.json"),
 "kensetsu-common-session-083":()=>require("./translations/session-083.json"),
 "kensetsu-common-session-084":()=>require("./translations/session-084.json"),
 "kensetsu-common-session-085":()=>require("./translations/session-085.json"),
 "kensetsu-common-session-086":()=>require("./translations/session-086.json"),
 "kensetsu-common-session-087":()=>require("./translations/session-087.json"),
 "kensetsu-common-session-088":()=>require("./translations/session-088.json"),
 "kensetsu-common-session-089":()=>require("./translations/session-089.json"),
 "kensetsu-common-session-090":()=>require("./translations/session-090.json"),
 "kensetsu-common-session-091":()=>require("./translations/session-091.json"),
 "kensetsu-common-session-092":()=>require("./translations/session-092.json"),
 "kensetsu-common-session-093":()=>require("./translations/session-093.json"),
 "kensetsu-common-session-094":()=>require("./translations/session-094.json"),
 "kensetsu-common-session-095":()=>require("./translations/session-095.json"),
 "kensetsu-common-session-096":()=>require("./translations/session-096.json"),
 "kensetsu-common-session-097":()=>require("./translations/session-097.json"),
 "kensetsu-common-session-098":()=>require("./translations/session-098.json"),
 "kensetsu-common-session-099":()=>require("./translations/session-099.json"),
 "kensetsu-common-session-100":()=>require("./translations/session-100.json"),
 "kensetsu-common-session-101":()=>require("./translations/session-101.json"),
 "kensetsu-common-session-102":()=>require("./translations/session-102.json"),
 "kensetsu-common-session-103":()=>require("./translations/session-103.json"),
 "kensetsu-common-session-104":()=>require("./translations/session-104.json"),
 "kensetsu-common-session-105":()=>require("./translations/session-105.json"),
 "kensetsu-common-session-106":()=>require("./translations/session-106.json"),
 "kensetsu-common-session-107":()=>require("./translations/session-107.json"),
 "kensetsu-common-session-108":()=>require("./translations/session-108.json"),
 "kensetsu-common-session-109":()=>require("./translations/session-109.json"),
 "kensetsu-common-session-110":()=>require("./translations/session-110.json"),
 "kensetsu-common-session-111":()=>require("./translations/session-111.json"),
 "kensetsu-common-session-112":()=>require("./translations/session-112.json"),
 "kensetsu-common-session-113":()=>require("./translations/session-113.json"),
 "kensetsu-common-session-114":()=>require("./translations/session-114.json"),
 "kensetsu-common-session-115":()=>require("./translations/session-115.json"),
 "kensetsu-common-session-116":()=>require("./translations/session-116.json"),
 "kensetsu-common-session-117":()=>require("./translations/session-117.json"),
 "kensetsu-common-session-118":()=>require("./translations/session-118.json"),
 "kensetsu-common-session-119":()=>require("./translations/session-119.json"),
 "kensetsu-common-session-120":()=>require("./translations/session-120.json"),
 "kensetsu-common-session-121":()=>require("./translations/session-121.json"),
 "kensetsu-common-session-122":()=>require("./translations/session-122.json"),
 "kensetsu-common-session-123":()=>require("./translations/session-123.json"),
 "kensetsu-common-session-124":()=>require("./translations/session-124.json"),
 "kensetsu-common-session-125":()=>require("./translations/session-125.json"),
 "kensetsu-common-session-126":()=>require("./translations/session-126.json"),
 "kensetsu-common-session-127":()=>require("./translations/session-127.json"),
 "kensetsu-common-session-128":()=>require("./translations/session-128.json"),
 "kensetsu-common-session-129":()=>require("./translations/session-129.json"),
 "kensetsu-common-session-130":()=>require("./translations/session-130.json"),
 "kensetsu-common-session-131":()=>require("./translations/session-131.json"),
 "kensetsu-common-session-132":()=>require("./translations/session-132.json"),
 "kensetsu-common-session-133":()=>require("./translations/session-133.json"),
 "kensetsu-common-session-134":()=>require("./translations/session-134.json"),
 "kensetsu-common-session-135":()=>require("./translations/session-135.json"),
 "kensetsu-common-session-136":()=>require("./translations/session-136.json"),
 "kensetsu-common-session-137":()=>require("./translations/session-137.json"),
 "kensetsu-common-session-138":()=>require("./translations/session-138.json"),
 "kensetsu-common-session-139":()=>require("./translations/session-139.json"),
 "kensetsu-common-session-140":()=>require("./translations/session-140.json"),
 "kensetsu-common-session-141":()=>require("./translations/session-141.json"),
 "kensetsu-common-session-142":()=>require("./translations/session-142.json"),
 "kensetsu-common-session-143":()=>require("./translations/session-143.json"),
 "kensetsu-common-session-144":()=>require("./translations/session-144.json"),
 "kensetsu-common-session-145":()=>require("./translations/session-145.json"),
 "kensetsu-common-session-146":()=>require("./translations/session-146.json"),
 "kensetsu-common-session-147":()=>require("./translations/session-147.json"),
 "kensetsu-common-session-148":()=>require("./translations/session-148.json"),
 "kensetsu-common-session-149":()=>require("./translations/session-149.json"),
 "kensetsu-common-session-150":()=>require("./translations/session-150.json"),
 "kensetsu-common-session-151":()=>require("./translations/session-151.json"),
 "kensetsu-common-session-152":()=>require("./translations/session-152.json"),
 "kensetsu-common-session-153":()=>require("./translations/session-153.json"),
 "kensetsu-common-session-154":()=>require("./translations/session-154.json"),
 "kensetsu-common-session-155":()=>require("./translations/session-155.json"),
 "kensetsu-common-session-156":()=>require("./translations/session-156.json"),
 "kensetsu-common-session-157":()=>require("./translations/session-157.json"),
 "kensetsu-common-session-158":()=>require("./translations/session-158.json"),
 "kensetsu-common-session-159":()=>require("./translations/session-159.json"),
 "kensetsu-common-session-160":()=>require("./translations/session-160.json"),
 "kensetsu-common-session-161":()=>require("./translations/session-161.json"),
 "kensetsu-common-session-162":()=>require("./translations/session-162.json"),
 "kensetsu-common-session-163":()=>require("./translations/session-163.json"),
 "kensetsu-common-session-164":()=>require("./translations/session-164.json"),
 "kensetsu-common-session-165":()=>require("./translations/session-165.json"),
 "kensetsu-common-session-166":()=>require("./translations/session-166.json"),
 "kensetsu-common-session-167":()=>require("./translations/session-167.json"),
 "kensetsu-common-session-168":()=>require("./translations/session-168.json"),
 "kensetsu-common-session-169":()=>require("./translations/session-169.json"),
 "kensetsu-common-session-170":()=>require("./translations/session-170.json"),
 "kensetsu-common-session-171":()=>require("./translations/session-171.json"),
 "kensetsu-common-session-172":()=>require("./translations/session-172.json"),
 "kensetsu-common-session-173":()=>require("./translations/session-173.json"),
 "kensetsu-common-session-174":()=>require("./translations/session-174.json"),
 "kensetsu-common-session-175":()=>require("./translations/session-175.json"),
 "kensetsu-common-session-176":()=>require("./translations/session-176.json"),
 "kensetsu-common-session-177":()=>require("./translations/session-177.json"),
 "kensetsu-common-session-178":()=>require("./translations/session-178.json"),
 "kensetsu-common-session-179":()=>require("./translations/session-179.json"),
 "kensetsu-common-session-180":()=>require("./translations/session-180.json"),
 "kensetsu-common-session-181":()=>require("./translations/session-181.json"),
 "kensetsu-common-session-182":()=>require("./translations/session-182.json"),
 "kensetsu-common-session-183":()=>require("./translations/session-183.json"),
 "kensetsu-common-session-184":()=>require("./translations/session-184.json"),
 "kensetsu-common-session-185":()=>require("./translations/session-185.json"),
 "kensetsu-common-session-186":()=>require("./translations/session-186.json"),
 "kensetsu-common-session-187":()=>require("./translations/session-187.json"),
 "kensetsu-common-session-188":()=>require("./translations/session-188.json"),
 "kensetsu-common-session-189":()=>require("./translations/session-189.json"),
 "kensetsu-common-session-190":()=>require("./translations/session-190.json"),
 "kensetsu-common-session-191":()=>require("./translations/session-191.json"),
 "kensetsu-common-session-192":()=>require("./translations/session-192.json"),
 "kensetsu-common-session-193":()=>require("./translations/session-193.json"),
 "kensetsu-common-session-194":()=>require("./translations/session-194.json"),
 "kensetsu-common-session-195":()=>require("./translations/session-195.json"),
 "kensetsu-common-session-196":()=>require("./translations/session-196.json"),
 "kensetsu-common-session-197":()=>require("./translations/session-197.json"),
 "kensetsu-common-session-198":()=>require("./translations/session-198.json"),
 "kensetsu-common-session-199":()=>require("./translations/session-199.json"),
 "kensetsu-common-session-200":()=>require("./translations/session-200.json"),
 "kensetsu-common-session-201":()=>require("./translations/session-201.json"),
 "kensetsu-common-session-202":()=>require("./translations/session-202.json"),
 "kensetsu-common-session-203":()=>require("./translations/session-203.json"),
 "kensetsu-common-session-204":()=>require("./translations/session-204.json"),
 "kensetsu-common-session-205":()=>require("./translations/session-205.json"),
 "kensetsu-common-session-206":()=>require("./translations/session-206.json"),
 "kensetsu-common-session-207":()=>require("./translations/session-207.json"),
 "kensetsu-common-session-208":()=>require("./translations/session-208.json"),
 "kensetsu-common-session-209":()=>require("./translations/session-209.json"),
 "kensetsu-common-session-210":()=>require("./translations/session-210.json"),
 "kensetsu-common-session-211":()=>require("./translations/session-211.json"),
 "kensetsu-common-session-212":()=>require("./translations/session-212.json"),
 "kensetsu-common-session-213":()=>require("./translations/session-213.json"),
 "kensetsu-common-session-214":()=>require("./translations/session-214.json"),
 "kensetsu-common-session-215":()=>require("./translations/session-215.json"),
 "kensetsu-common-session-216":()=>require("./translations/session-216.json"),
 "kensetsu-common-session-217":()=>require("./translations/session-217.json"),
 "kensetsu-common-session-218":()=>require("./translations/session-218.json"),
 "kensetsu-common-session-219":()=>require("./translations/session-219.json"),
 "kensetsu-common-session-220":()=>require("./translations/session-220.json"),
 "kensetsu-common-session-221":()=>require("./translations/session-221.json"),
 "kensetsu-common-session-222":()=>require("./translations/session-222.json"),
 "kensetsu-common-session-223":()=>require("./translations/session-223.json"),
 "kensetsu-common-session-224":()=>require("./translations/session-224.json"),
 "kensetsu-common-session-225":()=>require("./translations/session-225.json"),
 "kensetsu-common-session-226":()=>require("./translations/session-226.json"),
 "kensetsu-common-session-227":()=>require("./translations/session-227.json"),
 "kensetsu-common-session-228":()=>require("./translations/session-228.json"),
 "kensetsu-common-session-229":()=>require("./translations/session-229.json"),
 "kensetsu-common-session-230":()=>require("./translations/session-230.json"),
 "kensetsu-common-session-231":()=>require("./translations/session-231.json"),
 "kensetsu-common-session-232":()=>require("./translations/session-232.json"),
 "kensetsu-common-session-233":()=>require("./translations/session-233.json"),
 "kensetsu-common-session-234":()=>require("./translations/session-234.json"),
 "kensetsu-common-session-235":()=>require("./translations/session-235.json"),
 "kensetsu-common-session-236":()=>require("./translations/session-236.json"),
 "kensetsu-common-session-237":()=>require("./translations/session-237.json"),
 "kensetsu-common-session-238":()=>require("./translations/session-238.json"),
 "kensetsu-common-session-239":()=>require("./translations/session-239.json"),
 "kensetsu-common-session-240":()=>require("./translations/session-240.json"),
 "kensetsu-common-session-241":()=>require("./translations/session-241.json"),
 "kensetsu-common-session-242":()=>require("./translations/session-242.json"),
 "kensetsu-common-session-243":()=>require("./translations/session-243.json"),
 "kensetsu-common-session-244":()=>require("./translations/session-244.json"),
 "kensetsu-common-session-245":()=>require("./translations/session-245.json"),
 "kensetsu-common-session-246":()=>require("./translations/session-246.json"),
 "kensetsu-common-session-247":()=>require("./translations/session-247.json"),
 "kensetsu-common-session-248":()=>require("./translations/session-248.json"),
 "kensetsu-common-session-249":()=>require("./translations/session-249.json"),
 "kensetsu-common-session-250":()=>require("./translations/session-250.json"),
 "kensetsu-common-session-251":()=>require("./translations/session-251.json"),
 "kensetsu-common-session-252":()=>require("./translations/session-252.json"),
 "kensetsu-common-session-253":()=>require("./translations/session-253.json"),
 "kensetsu-common-session-254":()=>require("./translations/session-254.json"),
 "kensetsu-common-session-255":()=>require("./translations/session-255.json"),
 "kensetsu-common-session-256":()=>require("./translations/session-256.json"),
 "kensetsu-common-session-257":()=>require("./translations/session-257.json"),
 "kensetsu-common-session-258":()=>require("./translations/session-258.json"),
 "kensetsu-common-session-259":()=>require("./translations/session-259.json"),
 "kensetsu-common-session-260":()=>require("./translations/session-260.json"),
 "kensetsu-common-session-261":()=>require("./translations/session-261.json"),
 "kensetsu-common-session-262":()=>require("./translations/session-262.json"),
 "kensetsu-common-session-263":()=>require("./translations/session-263.json"),
 "kensetsu-common-session-264":()=>require("./translations/session-264.json"),
 "kensetsu-common-session-265":()=>require("./translations/session-265.json"),
 "kensetsu-common-session-266":()=>require("./translations/session-266.json"),
 "kensetsu-common-session-267":()=>require("./translations/session-267.json"),
 "kensetsu-common-session-268":()=>require("./translations/session-268.json"),
 "kensetsu-common-session-269":()=>require("./translations/session-269.json"),
 "kensetsu-common-session-270":()=>require("./translations/session-270.json"),
 "kensetsu-common-session-271":()=>require("./translations/session-271.json"),
 "kensetsu-common-session-272":()=>require("./translations/session-272.json"),
 "kensetsu-common-session-273":()=>require("./translations/session-273.json"),
 "kensetsu-common-session-274":()=>require("./translations/session-274.json"),
 "kensetsu-common-session-275":()=>require("./translations/session-275.json"),
 "kensetsu-common-session-276":()=>require("./translations/session-276.json"),
 "kensetsu-common-session-277":()=>require("./translations/session-277.json"),
 "kensetsu-common-session-278":()=>require("./translations/session-278.json"),
 "kensetsu-common-session-279":()=>require("./translations/session-279.json"),
 "kensetsu-common-session-280":()=>require("./translations/session-280.json"),
 "kensetsu-common-session-281":()=>require("./translations/session-281.json"),
 "kensetsu-common-session-282":()=>require("./translations/session-282.json"),
 "kensetsu-common-session-283":()=>require("./translations/session-283.json"),
 "kensetsu-common-session-284":()=>require("./translations/session-284.json"),
 "kensetsu-common-session-285":()=>require("./translations/session-285.json"),
 "kensetsu-common-session-286":()=>require("./translations/session-286.json"),
 "kensetsu-common-session-287":()=>require("./translations/session-287.json"),
 "kensetsu-common-session-288":()=>require("./translations/session-288.json"),
 "kensetsu-common-session-289":()=>require("./translations/session-289.json"),
 "kensetsu-common-session-290":()=>require("./translations/session-290.json"),
 "kensetsu-common-session-291":()=>require("./translations/session-291.json"),
 "kensetsu-common-session-292":()=>require("./translations/session-292.json"),
 "kensetsu-common-session-293":()=>require("./translations/session-293.json"),
 "kensetsu-common-session-294":()=>require("./translations/session-294.json"),
 "kensetsu-common-session-295":()=>require("./translations/session-295.json"),
 "kensetsu-common-session-296":()=>require("./translations/session-296.json"),
 "kensetsu-common-session-297":()=>require("./translations/session-297.json"),
 "kensetsu-common-session-298":()=>require("./translations/session-298.json"),
 "kensetsu-common-session-299":()=>require("./translations/session-299.json"),
 "kensetsu-common-session-300":()=>require("./translations/session-300.json"),
 "kensetsu-common-session-301":()=>require("./translations/session-301.json"),
 "kensetsu-common-session-302":()=>require("./translations/session-302.json"),
 "kensetsu-common-session-303":()=>require("./translations/session-303.json"),
 "kensetsu-common-session-304":()=>require("./translations/session-304.json"),
 "kensetsu-common-session-305":()=>require("./translations/session-305.json"),
 "kensetsu-common-session-306":()=>require("./translations/session-306.json"),
 "kensetsu-common-session-307":()=>require("./translations/session-307.json"),
 "kensetsu-common-session-308":()=>require("./translations/session-308.json"),
 "kensetsu-common-session-309":()=>require("./translations/session-309.json"),
 "kensetsu-common-session-310":()=>require("./translations/session-310.json"),
 "kensetsu-common-session-311":()=>require("./translations/session-311.json"),
 "kensetsu-common-session-312":()=>require("./translations/session-312.json"),
 "kensetsu-common-session-313":()=>require("./translations/session-313.json"),
 "kensetsu-common-session-314":()=>require("./translations/session-314.json"),
 "kensetsu-common-session-315":()=>require("./translations/session-315.json"),
 "kensetsu-common-session-316":()=>require("./translations/session-316.json"),
 "kensetsu-common-session-317":()=>require("./translations/session-317.json"),
 "kensetsu-common-session-318":()=>require("./translations/session-318.json"),
 "kensetsu-common-session-319":()=>require("./translations/session-319.json"),
 "kensetsu-common-session-320":()=>require("./translations/session-320.json"),
 "kensetsu-common-session-321":()=>require("./translations/session-321.json"),
 "kensetsu-common-session-322":()=>require("./translations/session-322.json"),
 "kensetsu-common-session-323":()=>require("./translations/session-323.json"),
 "kensetsu-common-session-324":()=>require("./translations/session-324.json"),
 "kensetsu-common-session-325":()=>require("./translations/session-325.json"),
 "kensetsu-common-session-326":()=>require("./translations/session-326.json"),
 "kensetsu-common-session-327":()=>require("./translations/session-327.json"),
 "kensetsu-common-session-328":()=>require("./translations/session-328.json"),
 "kensetsu-common-session-329":()=>require("./translations/session-329.json"),
 "kensetsu-common-session-330":()=>require("./translations/session-330.json"),
 "kensetsu-common-session-331":()=>require("./translations/session-331.json"),
 "kensetsu-common-session-332":()=>require("./translations/session-332.json"),
 "kensetsu-common-session-333":()=>require("./translations/session-333.json"),
 "kensetsu-common-session-334":()=>require("./translations/session-334.json"),
 "kensetsu-common-session-335":()=>require("./translations/session-335.json"),
 "kensetsu-common-session-336":()=>require("./translations/session-336.json"),
 "kensetsu-common-session-337":()=>require("./translations/session-337.json"),
 "kensetsu-common-session-338":()=>require("./translations/session-338.json"),
 "kensetsu-common-session-339":()=>require("./translations/session-339.json"),
 "kensetsu-common-session-340":()=>require("./translations/session-340.json"),
 "kensetsu-common-session-341":()=>require("./translations/session-341.json"),
 "kensetsu-common-session-342":()=>require("./translations/session-342.json"),
 "kensetsu-common-session-343":()=>require("./translations/session-343.json"),
 "kensetsu-common-session-344":()=>require("./translations/session-344.json"),
 "kensetsu-common-session-345":()=>require("./translations/session-345.json"),
 "kensetsu-common-session-346":()=>require("./translations/session-346.json"),
 "kensetsu-common-session-347":()=>require("./translations/session-347.json"),
 "kensetsu-common-session-348":()=>require("./translations/session-348.json"),
 "kensetsu-common-session-349":()=>require("./translations/session-349.json"),
 "kensetsu-common-session-350":()=>require("./translations/session-350.json"),
 "kensetsu-common-session-351":()=>require("./translations/session-351.json"),
 "kensetsu-common-session-352":()=>require("./translations/session-352.json"),
 "kensetsu-common-session-353":()=>require("./translations/session-353.json"),
 "kensetsu-common-session-354":()=>require("./translations/session-354.json"),
 "kensetsu-common-session-355":()=>require("./translations/session-355.json"),
 "kensetsu-common-session-356":()=>require("./translations/session-356.json"),
 "kensetsu-common-session-357":()=>require("./translations/session-357.json"),
 "kensetsu-common-session-358":()=>require("./translations/session-358.json"),
 "kensetsu-common-session-359":()=>require("./translations/session-359.json"),
 "kensetsu-common-session-360":()=>require("./translations/session-360.json"),
 "kensetsu-common-session-361":()=>require("./translations/session-361.json"),
 "kensetsu-common-session-362":()=>require("./translations/session-362.json"),
 "kensetsu-common-session-363":()=>require("./translations/session-363.json"),
 "kensetsu-common-session-364":()=>require("./translations/session-364.json"),
 "kensetsu-common-session-365":()=>require("./translations/session-365.json"),
 "kensetsu-common-session-366":()=>require("./translations/session-366.json"),
 "kensetsu-common-session-367":()=>require("./translations/session-367.json"),
 "kensetsu-common-session-368":()=>require("./translations/session-368.json"),
 "kensetsu-common-session-369":()=>require("./translations/session-369.json"),
 "kensetsu-common-session-370":()=>require("./translations/session-370.json"),
 "kensetsu-common-session-371":()=>require("./translations/session-371.json"),
 "kensetsu-common-session-372":()=>require("./translations/session-372.json"),
 "kensetsu-common-session-373":()=>require("./translations/session-373.json"),
 "kensetsu-common-session-374":()=>require("./translations/session-374.json"),
 "kensetsu-common-session-375":()=>require("./translations/session-375.json"),
 "kensetsu-common-session-376":()=>require("./translations/session-376.json"),
 "kensetsu-common-session-377":()=>require("./translations/session-377.json"),
 "kensetsu-common-session-378":()=>require("./translations/session-378.json"),
 "kensetsu-common-session-379":()=>require("./translations/session-379.json"),
 "kensetsu-common-session-380":()=>require("./translations/session-380.json"),
 "kensetsu-common-session-381":()=>require("./translations/session-381.json"),
 "kensetsu-common-session-382":()=>require("./translations/session-382.json"),
 "kensetsu-common-session-383":()=>require("./translations/session-383.json"),
 "kensetsu-common-session-384":()=>require("./translations/session-384.json"),
 "kensetsu-common-session-385":()=>require("./translations/session-385.json"),
};
export const sessions:Session[]=sourceSessions.map(session=>{const load=translationLoaders[session.id];return load?deferLessonTranslations(session,load):session;});
export const weeks:Week[]=[...foremanWeeks,week001,week002,week003,week004,week005,week006,week007,week008,week009,week010,week011,week012,week013,week014,week015,week016,week017,week018,week019,week020,week021,week022,week023,week024,week025,week026,week027,week028,week029,week030,week031,week032,week033,week034,week035,week036,week037,week038,week039,week040,week041,week042,week043,week044,week045,week046,week047,week048,week049,week050,week051,week052,week053,week054,week055,...fieldPracticalWeeks];

export const sessionById=new Map(sessions.map(s=>[s.id,s]));
export const illustrationAspectRatios:Record<string,number>={
 ...dailyTechnicalIllustrationAspectRatios,
 ...weeklyIllustrationAspectRatios,
 ...foremanIllustrationAspectRatios,
 ...differentialIllustrationAspectRatios,
 'assets/kensetsu/shared/greeting-v1.webp':1.7768331562167907,
 'assets/kensetsu/shared/handover-v1.webp':1.7768331562167907,
 'assets/kensetsu/shared/morning-meeting-v1.webp':1.7768331562167907,
};
export const illustrations:Record<string,ImageSourcePropType>={
 ...dailyTechnicalIllustrations,
 ...weeklyIllustrations,
 ...foremanIllustrations,
 ...differentialIllustrations,
 'assets/kensetsu/shared/handover-v1.webp':require('../../../assets/kensetsu/royal-weekly-20261107/week01/handover-royal-v2.webp'),
 'assets/kensetsu/shared/greeting-v1.webp':require('../../../assets/kensetsu/royal-weekly-20261107/week01/greeting-royal-v2.webp'),
 'assets/kensetsu/shared/morning-meeting-v1.webp':require('../../../assets/kensetsu/royal-weekly-20261107/week01/morning-meeting-royal-v2.webp'),
};
export const completionId=(session:Session)=>`${session.id}:r${session.revision}${session.scopeRevision ? `:scope:${session.scopeRevision}` : ""}`;
export const completionKey=(learner:string,level:Level,field:Field)=>`@japan_app_kensetsu_test:v1:${encodeURIComponent(learner)}:${level}:${field}`;
export function restoreProgress(raw:string|null):Record<string,true>{
 try{const data=JSON.parse(raw??'null');if(!data||typeof data!=='object'||Array.isArray(data))return {};
 const validIds=[...sessions.map(completionId),...paragraphReuse.supplements.map(view=>{const session=sessions.find(s=>s.id===view.targetSessionId)!;return completionId({...session,scopeRevision:view.scopeRevision});}),...reusePolicy.preservedArchivedCompletionIds];
 return Object.fromEntries(validIds.filter(id=>data[id]===true).map(id=>[id,true]));}catch{return {};}
}
