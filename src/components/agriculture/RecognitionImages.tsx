import paragraphPlacement from '@/data/agriculture/image-paragraph-placement.json';
import {DilutionExampleFigure} from './DilutionExampleFigure';
import {agricultureFigureSourceMarks} from './FigureSourceMarks';
import {SprayerPartSupport} from './SprayerPartSupport';
import {AgricultureImageRuby,AgricultureImageHeading} from './AgricultureImageRuby';
import localeData from '@/data/agriculture/recognition-image-locales.json';
import {FlowerLegendFigure} from './FlowerLegendFigure';
import {CropCalendarFigure} from './CropCalendarFigure';
import {StyleSheet,Text,View,type ImageSourcePropType,type StyleProp,type TextStyle} from 'react-native';
import {ZoomableFigure} from './ZoomableFigure';
import data from '@/data/agriculture/recognition-images.json';

const assets:Record<string,ImageSourcePropType>={
 "nursery-v9-crop-groups":require('../../../assets/agriculture/nursery-v9/nursery-crop-groups.png'),
 "cabbage":require('../../../assets/agriculture/royal-weekly-20261107/week01/cabbage.webp'),
 "chinese-cabbage":require('../../../assets/agriculture/royal-weekly-20261107/week01/chinese-cabbage.webp'),
 "lettuce":require('../../../assets/agriculture/royal-weekly-20261107/week01/lettuce.webp'),
 "spinach":require('../../../assets/agriculture/royal-weekly-20261107/week01/spinach.webp'),
 "onion":require('../../../assets/agriculture/royal-weekly-20261107/week01/onion.webp'),
 "daikon":require('../../../assets/agriculture/royal-weekly-20261107/week01/daikon.webp'),
 "indica-brown-rice":require('../../../assets/agriculture/royal-weekly-20261107/week01/indica-brown-rice.webp'),
 "japonica-brown-rice":require('../../../assets/agriculture/royal-weekly-20261107/week01/japonica-brown-rice.webp'),
 "plant-organ-positions":require('../../../assets/agriculture/recognition/plant-organ-positions-v1.webp'),
 "sowing-patterns":require('../../../assets/agriculture/recognition/sowing-patterns-v1.webp'),
 "soil-handtest-states":require('../../../assets/agriculture/recognition/soil-handtest-states-v1.webp'),
 "nursery-containers":require('../../../assets/agriculture/recognition/nursery-containers-v1.webp'),
 "potato":require('../../../assets/agriculture/royal-weekly-20261107/week01/potato.webp'),
 "sweet-potato":require('../../../assets/agriculture/royal-weekly-20261107/week01/sweet-potato.webp'),
 "carrot":require('../../../assets/agriculture/royal-weekly-20261107/week01/carrot.webp'),
 "tomato":require('../../../assets/agriculture/royal-weekly-20261107/week01/tomato.webp'),
 "eggplant":require('../../../assets/agriculture/royal-weekly-20261107/week01/eggplant.webp'),
 "cucumber":require('../../../assets/agriculture/royal-weekly-20261107/week01/cucumber.webp'),
 "apple":require('../../../assets/agriculture/royal-weekly-20261107/week01/apple.webp'),
 "grapes":require('../../../assets/agriculture/royal-weekly-20261107/week01/grapes.webp'),
 "persimmon":require('../../../assets/agriculture/royal-weekly-20261107/week01/persimmon.webp'),
 "asian-pear":require('../../../assets/agriculture/royal-weekly-20261107/week01/asian-pear.webp'),
 "peach":require('../../../assets/agriculture/royal-weekly-20261107/week01/peach.webp'),
 "chestnut":require('../../../assets/agriculture/royal-weekly-20261107/week01/chestnut.webp'),
 "kiwi":require('../../../assets/agriculture/royal-weekly-20261107/week01/kiwi.webp'),
 "blueberry":require('../../../assets/agriculture/royal-weekly-20261107/week01/blueberry.webp'),
 "unshu-mikan":require('../../../assets/agriculture/royal-weekly-20261107/week01/unshu-mikan.webp'),
 "yuzu":require('../../../assets/agriculture/royal-weekly-20261107/week01/yuzu.webp'),
 "loquat":require('../../../assets/agriculture/royal-weekly-20261107/week01/loquat.webp'),
 "pvc-cover-film":require('../../../assets/agriculture/recognition/pvc-cover-film-v1.webp'),
 "agripoly-film":require('../../../assets/agriculture/recognition/agripoly-film-v1.webp'),
 "nonwoven-cover":require('../../../assets/agriculture/recognition/nonwoven-cover-v1.webp'),
 "shade-cloth":require('../../../assets/agriculture/recognition/shade-cloth-v1.webp'),
 "insect-net":require('../../../assets/agriculture/recognition/insect-net-v1.webp'),
 "strawberry-gray-mold":require('../../../assets/agriculture/recognition/strawberry-gray-mold-v1.webp'),
 "cabbage-sclerotinia":require('../../../assets/agriculture/recognition/cabbage-sclerotinia-v1.webp'),
 "cabbage-soft-rot":require('../../../assets/agriculture/recognition/cabbage-soft-rot-v1.webp'),
 "cucumber-powdery-mildew":require('../../../assets/agriculture/recognition/cucumber-powdery-mildew-v1.webp'),
 "cucumber-downy-mildew":require('../../../assets/agriculture/recognition/cucumber-downy-mildew-v1.webp'),
 "tomato-late-blight":require('../../../assets/agriculture/recognition/tomato-late-blight-v1.webp'),
 "negi-rust":require('../../../assets/agriculture/recognition/negi-rust-v1.webp'),
 "broccoli-clubroot":require('../../../assets/agriculture/recognition/broccoli-clubroot-v1.webp'),
 "pest-thrips-wakegi":require('../../../assets/agriculture/recognition/pest-thrips-wakegi-v1.webp'),
 "pest-leafminer-wakegi-damage":require('../../../assets/agriculture/recognition/pest-leafminer-wakegi-damage-v1.webp'),
 "pest-mite-cucumber-damage":require('../../../assets/agriculture/recognition/pest-mite-cucumber-damage-v1.webp'),
 "pest-aphid-eggplant":require('../../../assets/agriculture/recognition/pest-aphid-eggplant-v1.webp'),
 "pest-cabbage-caterpillar":require('../../../assets/agriculture/recognition/pest-cabbage-caterpillar-v1.webp'),
 "pest-whitefly-tomato":require('../../../assets/agriculture/recognition/pest-whitefly-tomato-v1.webp'),
 "pest-sweetpotato-weevil":require('../../../assets/agriculture/recognition/pest-sweetpotato-weevil-v1.webp'),
 "pest-pepper-bug":require('../../../assets/agriculture/royal-weekly-20261107/pests/pepper-bug-source-stage-royal-v2.webp'),
 "equipment-manual-shoulder-sprayer":require('../../../assets/agriculture/equipment/manual-shoulder-sprayer-v1.png'),
 "equipment-powered-backpack-sprayer":require('../../../assets/agriculture/equipment/powered-backpack-sprayer-v1.png'),
 "equipment-speed-sprayer":require('../../../assets/agriculture/equipment/speed-sprayer-v1.png'),
 "equipment-portable-brush-cutter":require('../../../assets/agriculture/equipment/portable-brush-cutter-v1.png'),
 "equipment-walkbehind-hammer-mower":require('../../../assets/agriculture/equipment/walkbehind-hammer-mower-v1.png'),
 "equipment-ride-on-mower":require('../../../assets/agriculture/equipment/ride-on-mower-v1.png'),
 "tool-socket-wrench":require('../../../assets/agriculture/tools/socket-wrench-v1.png'),
 "tool-open-end-spanner":require('../../../assets/agriculture/tools/open-end-spanner-v1.png'),
 "tool-box-end-wrench":require('../../../assets/agriculture/tools/box-end-wrench-v1.png'),
 "tool-screwdrivers":require('../../../assets/agriculture/tools/screwdrivers-v1.png'),
 "tool-adjustable-wrench":require('../../../assets/agriculture/tools/adjustable-wrench-v1.png'),
 "tool-hex-keys":require('../../../assets/agriculture/tools/hex-keys-v1.png'),
 "irrigation-destinations":require('../../../assets/agriculture/diagrams/irrigation-destinations-v1.png'),
 "irrigation-tools":require('../../../assets/agriculture/diagrams/irrigation-tools-v1.png'),
 "soil-aggregate-comparison":require('../../../assets/agriculture/diagrams/soil-aggregate-comparison-v1.png'),
 "f40-general-thinning-comparison":require('../../../assets/agriculture/royal-weekly-20261107/week02/thinning-botanical-comparison-v2.webp'),
 "f40-general-nursery-forms":require('../../../assets/agriculture/completion-40/general/agr-f40-general-nursery-forms.png'),
 "f40-general-seeder":require('../../../assets/agriculture/royal-weekly-20261107/week02/hand-pushed-single-row-seeder.webp'),
 "f40-general-tractor-seeder":require('../../../assets/agriculture/completion-40/general/agr-f40-general-tractor-seeder.png'),
 "f40-general-transplanter":require('../../../assets/agriculture/completion-40/general/agr-f40-general-transplanter.png'),
 "f40-general-hand-planting":require('../../../assets/agriculture/completion-40/general/agr-f40-general-hand-planting.png'),
 "f40-general-row-plant-spacing":require('../../../assets/agriculture/completion-40/general/agr-f40-general-row-plant-spacing.png'),
 "f40-general-graft-connections":require('../../../assets/agriculture/completion-40/general/agr-f40-general-graft-connections.png'),
 "f40-general-planting-checks":require('../../../assets/agriculture/completion-40/general/agr-f40-general-planting-checks.png'),
 "f40-general-cropping-example-flow":require('../../../assets/agriculture/completion-40/general/agr-f40-general-cropping-example-flow.png'),
 "f40-general-flower-legend-reader":require('../../../assets/agriculture/completion-40/general/agr-f40-general-flower-legend-reader.png'),
 "agr-recognition-fertilizer-forms-appearance-v1":require('../../../assets/agriculture/completion-40/soil/fertilizer-forms-appearance-v1.png'),
 "agr-recognition-soil-tools-appearance-v1":require('../../../assets/agriculture/completion-40/soil/soil-tools-appearance-v1.png'),
 "agr-recognition-tractors-appearance-v1":require('../../../assets/agriculture/completion-40/soil/tractors-appearance-v1.png'),
 "agr-recognition-spreaders-ridgers-appearance-v1":require('../../../assets/agriculture/completion-40/soil/spreaders-ridgers-appearance-v1.png'),
 "agr-recognition-amendments-appearance-v1":require('../../../assets/agriculture/completion-40/soil/amendments-appearance-v1.png'),
 "agr-fig-soil-three-factor-relations-v1":require('../../../assets/agriculture/completion-40/soil/soil-three-factor-relations-v1.png'),
 "agr-fig-rotation-two-year-examples-v1":require('../../../assets/agriculture/completion-40/soil/rotation-two-year-examples-v1.png'),
 "agr-fig-nutrient-entry-routes-v2":require('../../../assets/agriculture/completion-40/soil/nutrient-entry-routes-v2.png'),
 "agr-fig-ridge-dimensions-v1":require('../../../assets/agriculture/completion-40/soil/ridge-dimensions-v1.png'),
 "rice-seedling-leaf-positions-v1":require('../../../assets/agriculture/royal-repair-18-20261108/rice-seedling-leaf-positions-v1.webp'),
 "rice-grain-structure-v1":require('../../../assets/agriculture/completion-40/rice/rice-grain-structure-v1.png'),
 "rice-pregermination-states-v1":require('../../../assets/agriculture/completion-40/rice/rice-pregermination-states-v1.png'),
 "sowing-and-plant-spacing-v1":require('../../../assets/agriculture/completion-40/rice/sowing-and-plant-spacing-v1.png'),
 "rice-feed-parts-v1":require('../../../assets/agriculture/royal-repair-18-20261108/rice-feed-parts-v1.webp'),
 "rice-calendar-comparison-v1":require('../../../assets/agriculture/completion-40/rice/rice-calendar-comparison-v1.png'),
 "rice-soaking-position-v1":require('../../../assets/agriculture/completion-40/rice/rice-soaking-position-v1.png'),
 "crop-fruits-atlas-v1":require('../../../assets/agriculture/completion-40/rice/crop-fruits-atlas-v1.png'),
 "crop-leaves-atlas-v1":require('../../../assets/agriculture/completion-40/rice/crop-leaves-atlas-v1.png'),
 "crop-herbs-legumes-atlas-v1":require('../../../assets/agriculture/completion-40/rice/crop-herbs-legumes-atlas-v1.png'),
 "crop-lotus-atlas-v1":require('../../../assets/agriculture/royal-weekly-20261107/week02/lotus-above-water-and-rhizome.webp'),
 "rice-machines-scenes-v1":require('../../../assets/agriculture/completion-40/rice/rice-machines-scenes-v1.png'),
 "agri-use-states-atlas-v1":require('../../../assets/agriculture/completion-40/rice/agri-use-states-atlas-v1.png'),
 "vegetable-seeds-atlas-v1":require('../../../assets/agriculture/completion-40/rice/vegetable-seeds-atlas-v1.png'),
 "processed-seeds-atlas-v1":require('../../../assets/agriculture/completion-40/rice/processed-seeds-atlas-v1.png'),
 "field-crop-parts-atlas-v1":require('../../../assets/agriculture/completion-40/rice/field-crop-parts-atlas-v1.png'),
 "rice-pest-symptom-reference-v1":require('../../../assets/agriculture/completion-40/rice/rice-pest-symptom-reference-v1.png'),
 "management-positions":require('../../../assets/agriculture/royal-weekly-20261107/management-positions-royal-v1.webp'),
 "pollination-target":require('../../../assets/agriculture/royal-weekly-20261107/pollination-target-royal-v1.webp'),
 "figure-eight-tie":require('../../../assets/agriculture/completion-40/safety/figure-eight-tie.png'),
 "harvest-handtools":require('../../../assets/agriculture/completion-40/safety/harvest-handtools.png'),
 "rice-combine":require('../../../assets/agriculture/completion-40/safety/rice-combine.png'),
 "leek-harvester":require('../../../assets/agriculture/completion-40/safety/leek-harvester.png'),
 "potato-digger":require('../../../assets/agriculture/completion-40/safety/potato-digger.png'),
 "tunnel-direct-cover":require('../../../assets/agriculture/royal-weekly-20261107/tunnel-direct-cover-royal-v1.webp'),
 "mulch-materials":require('../../../assets/agriculture/completion-40/safety/mulch-materials.png'),
 "rotary-mulcher":require('../../../assets/agriculture/completion-40/safety/rotary-mulcher.png'),
 "pheromone-dispenser":require('../../../assets/agriculture/royal-weekly-20261107/pheromone-dispenser-appearance-royal-v1.webp'),
 "cultivation-hilling":require('../../../assets/agriculture/completion-40/safety/cultivation-hilling.png'),
 "nozzle-source-examples":require('../../../assets/agriculture/royal-weekly-20261107/week09/nozzle-source-examples-royal-v1.webp'),
 "manual-backpack-sprayer":require('../../../assets/agriculture/completion-40/safety/manual-backpack-sprayer.png'),
 "machine-clothing":require('../../../assets/agriculture/royal-weekly-20261107/machine-work-clothing-royal-v1.webp'),
 "machine-control-names":require('../../../assets/agriculture/royal-weekly-20261107/machine-control-names-royal-v1.webp'),
 "pesticide-clothing":require('../../../assets/agriculture/royal-weekly-20261107/pesticide-work-clothing-royal-v1.webp'),
 "sprayer-parts":require('../../../assets/agriculture/royal-weekly-20261107/week09/sprayer-parts-appearance-royal-v1.webp'),
 "power-connector-examples":require('../../../assets/agriculture/royal-weekly-20261107/week09/power-connector-examples-royal-v1.webp'),
 "fuel-container-source-sign":require('../../../assets/agriculture/royal-weekly-20261107/week09/fuel-container-appearance-royal-v1.webp'),
 "ladder-hazards":require('../../../assets/agriculture/royal-weekly-20261107/week09/ladder-hazards-royal-v1.webp'),
 "leaf-fruit-source-reference":require('../../../assets/agriculture/completion-40/safety/leaf-fruit-source-reference.png'),
 "volume-factor-mass":require('../../../assets/agriculture/completion-40/safety/volume-factor-mass.png'),
 "tractor-source-conditions":require('../../../assets/agriculture/royal-food-owner-20261107/tractor-source-conditions-v1.webp'),
 "cultivator-source-sequence":require('../../../assets/agriculture/royal-food-owner-20261107/cultivator-source-components-v1.webp'),
 "brushcutter-source-sequence":require('../../../assets/agriculture/royal-food-owner-20261107/brushcutter-source-components-v1.webp'),
 "royal-fine-root-observation-v1":require('../../../assets/agriculture/royal-weekly-20261107/fine-root-specimen-v1.webp'),
 "fuel-source-mapping":require('../../../assets/agriculture/royal-food-owner-20261107/fuel-source-mapping-v1.png'),
 "source-extra-details":require('../../../assets/agriculture/completion-40/safety/source-extra-details.png'),
 "pesticide-source-conditions":require('../../../assets/agriculture/completion-40/safety/pesticide-source-conditions.png'),
 "f40-flower-harvest":require('../../../assets/agriculture/completion-40/flower/agr-f40-flower-harvest-v1.png'),
 "f40-flower-graft-positions":require('../../../assets/agriculture/royal-repair-18-20261108/f40-flower-graft-positions.webp'),
 "f40-flower-unshu":require('../../../assets/agriculture/royal-weekly-20261107/week01/unshu-mikan-flower.webp'),
 "f40-flower-cluster-dip":require('../../../assets/agriculture/royal-weekly-20261107/week25/grape-flower-cluster-dip-royal-v1.webp'),
 "f40-flower-materials":require('../../../assets/agriculture/completion-40/flower/agr-f40-flower-materials-v1.png'),
 "f40-flower-platform":require('../../../assets/agriculture/completion-40/flower/agr-f40-flower-platform-v1.png'),
 "f40-flower-transport":require('../../../assets/agriculture/completion-40/flower/agr-f40-flower-transport-v1.png'),
 "f40-flower-tools":require('../../../assets/agriculture/completion-40/flower/agr-f40-flower-tools-v1.png'),
 "f40-flower-soil-profiles":require('../../../assets/agriculture/completion-40/flower/agr-f40-flower-soil-profiles-v1.png'),
 "agr-f40-facility-single-house-roof-profiles":require('../../../assets/agriculture/completion-40/facility/single-house-roof-profiles.png'),
 "agr-f40-facility-connected-house-eave-height":require('../../../assets/agriculture/completion-40/facility/connected-house-eave-height.png'),
 "agr-f40-ventilation-label-positions":require('../../../assets/agriculture/completion-40/facility/ventilation-label-positions.png'),
 "agr-f40-seedling-measurement-leaves":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-seedling-measurement-leaves.webp'),
 "agr-f40-seedling-condition-comparison":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-seedling-condition-comparison.webp'),
 "agr-f40-hydroponic-media-types":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-hydroponic-media-types.webp'),
 "agr-f40-hydroponic-system-positions":require('../../../assets/agriculture/completion-40/facility/hydroponic-system-positions.png'),
 "agr-f40-graft-stem-section-labels":require('../../../assets/agriculture/completion-40/facility/graft-stem-section-labels.png'),
 "agr-f40-fruit-tree-form-profiles":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-fruit-tree-form-profiles.webp'),
 "agr-f40-fruit-mainstem-scaffold-labels":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-fruit-mainstem-scaffold-labels.webp'),
 "agr-f40-t-budding-concept-stages":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-t-budding-concept-stages.webp'),
 "agr-f40-graft-planting-union-position":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-graft-planting-union-position.webp'),
 "agr-f40-propagation-method-concepts":require('../../../assets/agriculture/royal-weekly-20261107/week47/propagation-methods-botanical-royal-v1.webp'),
 "agr-f40-branch-graft-type-profiles":require('../../../assets/agriculture/royal-weekly-20261107/agri-restaurant12/branch-graft-type-profiles-v2.png'),
 "agr-f40-graft-source-example-dimensions":require('../../../assets/agriculture/royal-weekly-20261107/agri-restaurant12/graft-source-example-dimensions-v2.png'),
 "agr-f40-pruning-branch-position-glossary":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-pruning-branch-position-glossary.webp'),
 "agr-f40-pear-thinning-shape-examples":require('../../../assets/agriculture/royal-weekly-20261107/pear-thinning-shape-examples-royal-v1.webp'),
 "agr-f40-satsuma-thinning-target-examples":require('../../../assets/agriculture/royal-weekly-20261107/satsuma-thinning-target-examples-royal-v1.webp'),
 "agr-f40-tomato-temperature-source-comparison":require('../../../assets/agriculture/completion-40/facility/tomato-temperature-source-comparison.png'),
 "agr-f40-cover-lifetime-source-comparison":require('../../../assets/agriculture/completion-40/facility/cover-lifetime-source-comparison.png'),
 "agr-f40-pf-source-range-comparison":require('../../../assets/agriculture/completion-40/facility/pf-source-range-comparison.png'),
 "agr-f40-temperature-instrument-source-examples":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-temperature-instrument-source-examples.webp'),
 "agr-f40-soil-moisture-instrument-forms":require('../../../assets/agriculture/royal-weekly-20261107/soil-moisture-instrument-forms-royal-v1.webp'),
 "agr-f40-fruit-lifecycle-source-regions":require('../../../assets/agriculture/completion-40/facility/fruit-lifecycle-source-regions.png'),
 "agr-f40-fruit-nursery-species-leaf-examples":require('../../../assets/agriculture/royal-weekly-20261107/agri-restaurant-more12/fruit-nursery-leaf-specimens-royal-v2.webp'),
 "agr-f40-fruit-branch-age-source-types":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-fruit-branch-age-source-types.webp'),
 "agr-f40-fruit-pruning-cut-position-examples":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-fruit-pruning-cut-position-examples.webp'),
 "agr-f40-fruit-pollination-tool-appearance-examples":require('../../../assets/agriculture/royal-weekly-20261107/week20/pollination-tools-appearance-royal-v1.webp'),
 "agr-f40-citrus-uninjured-injured-source-pair":require('../../../assets/agriculture/royal-weekly-20261107/citrus-rind-injury-pair-royal-v1.webp'),
 "agr-f40-peach-grape-bag-appearance":require('../../../assets/agriculture/royal-weekly-20261107/week19/peach-grape-bag-appearance-royal-v1.webp'),
 "agr-f40-peach-bagging-source-stages":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-peach-bagging-source-stages.webp'),
 "agr-f40-grape-bagging-source-stages":require('../../../assets/agriculture/royal-repair-18-20261108/agr-f40-grape-bagging-source-stages.webp'),
 "agr-f40-graft-cambium-contact-corrected-v2":require('../../../assets/agriculture/completion-40/facility/graft-cambium-contact-corrected-v2.png'),
 "f40-facility-support-greenhouse-crops":require('../../../assets/agriculture/royal-weekly-20261107/week15/greenhouse-crops-royal-v1.webp'),
 "f40-facility-support-greenhouse-flowers-a":require('../../../assets/agriculture/royal-weekly-20261107/week15/greenhouse-flowers-a-royal-v1.webp'),
 "f40-facility-support-greenhouse-flowers-b":require('../../../assets/agriculture/royal-weekly-20261107/week15/greenhouse-flowers-b-royal-v1.webp'),
 "f40-facility-support-rain-shelter-roof-only":require('../../../assets/agriculture/royal-weekly-20261107/week15/rain-shelter-roof-only-royal-v1.webp'),
 "f40-facility-support-greenhouse-heater-co2":require('../../../assets/agriculture/completion-40/facility-safety-support/greenhouse-heater-co2.png'),
 "f40-facility-support-greenhouse-auto-sprayer":require('../../../assets/agriculture/completion-40/facility-safety-support/greenhouse-auto-sprayer.png'),
 "f40-facility-support-greenhouse-insect-light-appearance":require('../../../assets/agriculture/royal-weekly-20261107/week37/greenhouse-insect-light-appearance-royal-v1.webp'),
 "f40-facility-support-tomato-blossom-end-appearance":require('../../../assets/agriculture/completion-40/facility-safety-support/tomato-blossom-end-appearance.png'),
 "f40-facility-support-nursery-place-container-types":require('../../../assets/agriculture/royal-repair-18-20261108/f40-facility-support-nursery-place-container-types.webp'),
 "f40-facility-support-paper-pot-connected-cells":require('../../../assets/agriculture/completion-40/facility-safety-support/paper-pot-connected-cells.png'),
 "agr-fig-f40-facility-soil-graft-equipment-appearance-v1":require('../../../assets/agriculture/royal-weekly-20261107/graft-equipment-appearance-v2.webp'),
 "agr-fig-f40-facility-soil-graft-preparation-and-view-sequence-v1":require('../../../assets/agriculture/royal-repair-18-20261108/agr-fig-f40-facility-soil-graft-preparation-and-view-sequence-v1.webp'),
 "f40-facility-support-carnation-greenhouse-level1":require('../../../assets/agriculture/completion-40/visual-safety/carnation-greenhouse-level1.png'),
 "royal-fruit-thinning-stages-v1":require('../../../assets/agriculture/royal-weekly-20261107/week29/fruit-thinning-stages-v1.webp'),
};
export function getAgricultureFigureAsset(assetKey:string) {return assets[assetKey];}
type RecognitionImage={
 id:string;lessonIds:string[];lessonSourceHashes:Record<string,string|undefined>;
 titleJa:string;altJa:string;observationJa:string;limitJa:string;
 labelsJa?:string[];scopeLevels?:string[];
 allowExpandedView?:boolean;
 creation?:unknown;kind?:string;paragraphIds?:string[];
 assetKey:string;width:number;height:number;assetSha256?:string;
};
type Colors={text:string;translation:string;translationText:string;border:string};
const images:RecognitionImage[]=Array.isArray(data.images)?data.images:[];
const matchesLesson=(item:RecognitionImage,lessonId:string,lessonSourceHash:string,level?:string)=>item.lessonIds?.includes(lessonId)
 &&item.lessonSourceHashes?.[lessonId]===lessonSourceHash
 &&(!level||!!item.scopeLevels?.includes(level))
 &&Object.prototype.hasOwnProperty.call(assets,item.assetKey)
 &&Number.isFinite(item.width)&&item.width>0&&Number.isFinite(item.height)&&item.height>0
 &&!!item.titleJa&&!!item.altJa&&!!item.observationJa&&!!item.limitJa;

export function hasRecognitionImage(lessonId:string,lessonSourceHash:string,assetKey:string,level?:string) {
 return images.some(item=>item.assetKey===assetKey&&matchesLesson(item,lessonId,lessonSourceHash,level));
}

type ImageLocale={title:string;alt:string;observation:string;limitKey:string;labels?:string[]};
type LocaleEntry={sourceJapanese:{title:string;alt:string;observation:string;limit:string};assetSha256:string;lessonSourceHashes:Record<string,string>;lessonRevisions:Record<string,string>;sourceLabelsJa?:string[];locales:Record<string,ImageLocale>};
const localeRegistry=localeData as {schemaVersion:number;studyOnly:boolean;entries:Record<string,LocaleEntry>;limits:Record<string,{sourceJapanese:string;locales:Record<string,string>}>};
export function recognitionImageTranslation(item:RecognitionImage,lessonId:string,lessonSourceHash:string,lessonRevision:string|undefined,language:string){
 const entry=localeRegistry.entries[item.id],t=entry?.locales[language],limit=t?localeRegistry.limits[t.limitKey]:null;
 const needsLabelMapping=!!(item.labelsJa?.length||entry?.sourceLabelsJa?.length||t?.labels?.length);
 const labelsMatch=!needsLabelMapping||(Array.isArray(item.labelsJa)&&Array.isArray(entry?.sourceLabelsJa)&&Array.isArray(t?.labels)
  &&entry.sourceLabelsJa.length===item.labelsJa.length&&t.labels.length===item.labelsJa.length
  &&entry.sourceLabelsJa.every((label,i)=>label===item.labelsJa?.[i])&&t.labels.every(label=>typeof label==='string'&&!!label.trim()));
 if(localeRegistry.schemaVersion!==1||!localeRegistry.studyOnly||!entry||!t||!limit||!lessonRevision
  ||item.lessonSourceHashes[lessonId]!==lessonSourceHash||entry.assetSha256!==item.assetSha256||entry.lessonSourceHashes[lessonId]!==lessonSourceHash||entry.lessonRevisions[lessonId]!==lessonRevision
  ||entry.sourceJapanese.title!==item.titleJa||entry.sourceJapanese.alt!==item.altJa||entry.sourceJapanese.observation!==item.observationJa||entry.sourceJapanese.limit!==item.limitJa
  ||limit.sourceJapanese!==item.limitJa||!t.title||!t.alt||!t.observation||!limit.locales[language]||!labelsMatch)return null;
 return {title:t.title,alt:t.alt,observation:t.observation,limit:limit.locales[language],...(t.labels?{labels:t.labels}:{})};
}


const compactFigureKeys=new Set(["royal-fine-root-observation-v1", "agripoly-film", "apple", "asian-pear", "blueberry", "broccoli-clubroot", "cabbage", "cabbage-sclerotinia", "cabbage-soft-rot", "carrot", "chestnut", "chinese-cabbage", "cucumber", "cucumber-downy-mildew", "cucumber-powdery-mildew", "daikon", "eggplant", "equipment-manual-shoulder-sprayer", "equipment-portable-brush-cutter", "equipment-powered-backpack-sprayer", "equipment-ride-on-mower", "equipment-speed-sprayer", "equipment-walkbehind-hammer-mower", "f40-facility-support-carnation-greenhouse-level1", "f40-facility-support-greenhouse-auto-sprayer", "f40-facility-support-greenhouse-heater-co2", "f40-facility-support-greenhouse-insect-light-appearance", "f40-flower-platform", "f40-flower-unshu", "f40-general-hand-planting", "f40-general-seeder", "f40-general-tractor-seeder", "f40-general-transplanter", "grapes", "indica-brown-rice", "insect-net", "japonica-brown-rice", "kiwi", "leek-harvester", "lettuce", "loquat", "machine-clothing", "management-positions", "manual-backpack-sprayer", "negi-rust", "nonwoven-cover", "onion", "peach", "persimmon", "pest-aphid-eggplant", "pest-cabbage-caterpillar", "pest-leafminer-wakegi-damage", "pest-mite-cucumber-damage", "pest-pepper-bug", "pest-sweetpotato-weevil", "pest-thrips-wakegi", "pest-whitefly-tomato", "pesticide-clothing", "potato", "potato-digger", "pvc-cover-film", "rice-combine", "rotary-mulcher", "shade-cloth", "spinach", "strawberry-gray-mold", "sweet-potato", "tomato", "tomato-late-blight", "tool-adjustable-wrench", "tool-box-end-wrench", "tool-hex-keys", "tool-open-end-spanner", "tool-screwdrivers", "tool-socket-wrench", "unshu-mikan", "yuzu"]);
export function recognitionImagePresentation(item:{assetKey:string}):'recognition'|'diagram'{return compactFigureKeys.has(item.assetKey)?'recognition':'diagram';}
export function recognitionImageParagraph(item:{id:string},lessonId:string,sourceHash:string){
 const entry=(paragraphPlacement as Record<string,{sourceHash:string;paragraphs:Record<string,string>}>)[lessonId];
 return entry?.sourceHash===sourceHash?entry.paragraphs[item.id]:undefined;
}

export function RecognitionImages({lessonId,lessonSourceHash,colors,level,language='ja',showTranslation=false,lessonRevision,paragraphId,unplacedOnly=false}:{lessonId:string;lessonSourceHash:string;colors:Colors;level?:string;language?:string;showTranslation?:boolean;lessonRevision?:string;paragraphId?:string;unplacedOnly?:boolean}) {
 const visible=images.filter(item=>matchesLesson(item,lessonId,lessonSourceHash,level)&&(!paragraphId&&!unplacedOnly||paragraphId===recognitionImageParagraph(item,lessonId,lessonSourceHash)||unplacedOnly&&!recognitionImageParagraph(item,lessonId,lessonSourceHash)));
 return <>{visible.map(item=>{const t=showTranslation?recognitionImageTranslation(item,lessonId,lessonSourceHash,lessonRevision,language):null;const ruby=(field:string,text:string,style:StyleProp<TextStyle>)=><AgricultureImageRuby imageId={item.id} assetSha256={item.assetSha256||''} lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} field={field} text={text} style={style} color={colors.translationText}/>;return <View key={item.id} testID={item.id} style={[s.figure,{backgroundColor:colors.translation,borderColor:colors.border}]}>
  {ruby('title',item.titleJa,[s.title,{color:colors.translationText}])}
  {!!t&&<Text testID={`${item.id}-localized-title`} style={[s.title,{color:colors.translationText}]}>{t.title}</Text>}
  {item.id==='agr-f40-safety-media-volume-factor-mass'?<DilutionExampleFigure lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} alt={t?.alt||item.altJa} colors={colors} renderLabel={index=><View>{ruby(`label:${index}`,item.labelsJa?.[index]||'',[s.body,{color:colors.translationText}])}{!!t?.labels?.[index]&&<Text testID={`${item.id}-localized-label-${index}`} style={[s.body,{color:colors.translationText}]}>{t.labels[index]}</Text>}</View>}/> :item.id==='agr-f40-general-cropping-example-flow'?<CropCalendarFigure lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language={language} showTranslation={showTranslation} includeMetadata={false} colors={colors}/>:item.id==='agr-f40-general-flower-legend-reader'?<FlowerLegendFigure lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} language={language} showTranslation={showTranslation} colors={colors}/>:<ZoomableFigure uiLanguage={language} source={assets[item.assetKey]} width={item.width} height={item.height} altJa={t?.alt||item.altJa} testID={item.id} colors={colors} presentation={recognitionImagePresentation(item)} allowExpandedView marks={agricultureFigureSourceMarks(item)}/>}
  {item.id==='agr-f40-safety-media-sprayer-parts'?<SprayerPartSupport lessonId={lessonId} lessonSourceHash={lessonSourceHash} lessonRevision={lessonRevision} level={level} assetSha256={item.assetSha256||''} alt={t?.alt||item.altJa} colors={colors} renderLabel={index=><View>{ruby(`label:${index}`,item.labelsJa?.[index]||'',[s.body,{color:colors.translationText}])}{!!t?.labels?.[index]&&<Text testID={`${item.id}-localized-label-${index}`} style={[s.body,{color:colors.translationText}]}>{t.labels[index]}</Text>}</View>}/>:item.id==='agr-f40-safety-media-volume-factor-mass'?null:!!item.labelsJa?.length&&<View style={{gap:4}}>{item.labelsJa.map((label,index)=><View key={`${index}-${label}`}>{ruby(`label:${index}`,label,[s.body,{color:colors.translationText}])}{!!t?.labels?.[index]&&<Text testID={`${item.id}-localized-label-${index}`} style={[s.body,{color:colors.translationText}]}>{t.labels[index]}</Text>}</View>)}</View>}
  <AgricultureImageHeading kind="observation" style={[s.label,{color:colors.translationText}]} color={colors.translationText}/>
  {ruby('observation',item.observationJa,[s.body,{color:colors.translationText}])}
  {!!t&&<Text testID={`${item.id}-localized-observation`} style={[s.body,{color:colors.translationText}]}>{t.observation}</Text>}
  <AgricultureImageHeading kind="limit" style={[s.label,{color:colors.translationText}]} color={colors.translationText}/>
  {ruby('limit',item.limitJa,[s.body,{color:colors.translationText}])}
  {!!t&&<Text testID={`${item.id}-localized-limit`} style={[s.body,{color:colors.translationText}]}>{t.limit}</Text>}
 </View>;})}</>;
}

const s=StyleSheet.create({
 figure:{width:'100%',maxWidth:720,minWidth:0,flexShrink:1,alignSelf:'center',marginVertical:12,padding:12,gap:10,borderWidth:1,borderRadius:12},
 title:{fontSize:20,lineHeight:31,fontWeight:'700'},
 label:{fontSize:17,lineHeight:28,fontWeight:'700',marginTop:4},
 body:{fontSize:17,lineHeight:29},
 expand:{minHeight:44,paddingHorizontal:12,paddingVertical:8,borderWidth:1,borderRadius:8,alignSelf:'flex-start',justifyContent:'center'},
});
