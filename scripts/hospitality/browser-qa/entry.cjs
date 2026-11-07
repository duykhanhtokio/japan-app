/* Browser-only QA surface: production components and providers, no native mocks. */
const React = require('react');
const {createRoot} = require('react-dom/client');
const {HotelGuideReadingProvider} = require('../../../src/components/hospitality/HotelGuideText');
const {HotelTwoRouteGuide} = require('../../../src/components/hospitality/HotelTwoRouteGuide');
const {HotelMealLayoutGuide} = require('../../../src/components/hospitality/HotelMealLayoutGuide');
const {HotelServiceVisualGuide} = require('../../../src/components/hospitality/HotelServiceVisualGuide');
const {HotelHospitalityRoleGuide} = require('../../../src/components/hospitality/HotelHospitalityRoleGuide');
const lessons = Object.fromEntries([
  ...require('../../../src/data/hospitality/front.json').lessons,
  ...require('../../../src/data/hospitality/planning.json').lessons,
  ...require('../../../src/data/hospitality/service.json').lessons,
  ...require('../../../src/data/hospitality/restaurant.json').lessons,
  ...require('../../../src/data/hospitality/safety.json').lessons,
].map(lesson => [lesson.id, lesson]));
const components = {
  'hotel-safety-07': HotelTwoRouteGuide,
  'hotel-restaurant-02': HotelMealLayoutGuide,
  'hotel-restaurant-03': HotelMealLayoutGuide,
  'hotel-restaurant-04': HotelMealLayoutGuide,
  'hotel-service-01': HotelServiceVisualGuide,
  'hotel-service-02': HotelServiceVisualGuide,
  'hotel-service-03': HotelServiceVisualGuide,
  'hotel-service-04': HotelHospitalityRoleGuide,
  'hotel-planning-05': HotelHospitalityRoleGuide,
};
const root = createRoot(document.getElementById('app'));
window.renderCase = async (id, locale, ruby) => {
  const lesson = lessons[id], Component = components[id];
  if (!lesson || !Component) throw new Error(`Unsupported QA lesson: ${id}`);
  root.render(React.createElement(HotelGuideReadingProvider, {
    lessonId: id, revision: lesson.revision, language: locale, enabled: ruby,
  }, React.createElement(Component, {lesson, language: locale})));
  await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)));
};
window.browserHarnessReady = true;
