import { getHour, getMinute, timeToInt, timeToMinutes, minutesToTime, fromTime, toTime, capitalizeFirstLetter, validateEmail, getFirstImage, boatDataFromQRCode, sanitizeUsername, calculateServiceCost, showServiceCost, calculateTotalCost, showTotalCost } from '../src/utils/index'

test('getHour', () => {
  expect(getHour('12:20:10')).toBe('12');
});

test('getMinute', () => {
  expect(getMinute('12:20:10')).toBe('20');
});

test('timeToInt', () => {
  expect(timeToInt('12:20')).toBe(1220);
});

test('timeToMinutes', () => {
  expect(timeToMinutes('12:20')).toBe(740);
});

test('minutesToTime', () => {
  expect(minutesToTime(740)).toBe('12:20');
});

test('fromTime', () => {
  expect(fromTime('12:20', '11:10')).toBe('11:10');
});

test('toTime', () => {
  expect(toTime('12:20', '11:10')).toBe('12:20');
});

test('capitalizeFirstLetter', () => {
  expect(capitalizeFirstLetter('test')).toBe('Test');
});

test('validateEmail', () => {
  expect(validateEmail('test')).toBe(false);
});

test('validateEmail', () => {
  expect(validateEmail('test@test.com')).toBe(true);
});

test('getFirstImage', () => {
  expect(getFirstImage([{path: 'first/image'}, {path: 'second/image'}])).toBe('first/image');
});

test('boatDataFromQRCode', () => {
  expect(boatDataFromQRCode('id_test/host_test')).toStrictEqual({id: 'id_test', hostUsername: 'host_test'});
});

test('sanitizeUsername', () => {
  expect(sanitizeUsername('test@test.com')).toBe('test');
});

test('calculateServiceCost', () => {
  expect(calculateServiceCost('BOOKING_FEES_PERCENTAGE', 100)).toBe('5');
});

test('showServiceCost', () => {
  expect(showServiceCost('BOOKING_FEES_PERCENTAGE', 100, '€')).toBe('5 €');
});

test('calculateTotalCost', () => {
  expect(calculateTotalCost('BOOKING_FEES_PERCENTAGE', 100)).toBe('105');
});

test('showTotalCost', () => {
  expect(showTotalCost('BOOKING_FEES_PERCENTAGE', 100, '€')).toBe('105 €');
});