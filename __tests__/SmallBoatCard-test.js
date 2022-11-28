import React from 'react';
import renderer from 'react-test-renderer';
import {SmallBoatCard} from '../src/components/SmallBoatCard';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

// define the props that should be passed to the component
const boat = { item: {name: 'Boat 1', image: require('naviigo/assets/img/boat1.jpg')}}
const key = 1;
const onpress = () => {}

test('renders correctly', () => {
  const tree = renderer.create(<ApplicationProvider mapping={mapping} theme={lightTheme}><SmallBoatCard boat={boat} key={key} onPress={onpress}/></ApplicationProvider>).toJSON();
  expect(tree).toMatchSnapshot();
});