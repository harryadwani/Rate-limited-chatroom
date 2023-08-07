import React from 'react';
import { mount, configure } from 'enzyme';
import Adaptor from 'enzyme-adapter-react-16';
import App from '../src/App';

configure({ adapter: new Adaptor() });
describe('App', () => {
  let props;
  function sutFactory() {
    return mount(<App {...props} />);
  }

  beforeEach(() => {
    props = {};
  });
  it('should render the app', () => {
    const sut = sutFactory();
    console.log(sut.debug());
    expect(true).toBe(false);
  });
});
