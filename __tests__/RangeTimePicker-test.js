import React from 'react';
import renderer from 'react-test-renderer';
import {RangeTimePicker} from '../src/components/forms/RangeTimePicker';
import {
  ApplicationProvider
} from '@ui-kitten/components';
import {Provider} from 'react-redux';
import store from '../src/store/store';
import { mapping, light as lightTheme, dark as darkTheme } from '@eva-design/eva';

const onselect = () => {};
const selectedoption = 1;
const day = {};
const multiple = true;

const data = {
  find: () => {}
};

test('renders correctly', () => {
  const tree = renderer.create(   
    <Provider store={store}>
          <ApplicationProvider mapping={mapping} theme={lightTheme}>
            <RangeTimePicker onSelect={onselect} selectedOption={selectedoption} day={day} multiple={multiple} />
          </ApplicationProvider>
        </Provider>
          ).toJSON();
  expect(tree).toMatchSnapshot();
});