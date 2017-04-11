import { expect } from 'chai';
import 'mocha';

describe('simple expect', () => {
  it('should return hello world', () => {
    const result = "Hello World!";
    expect(result).to.equal('Hello World!');
  });
});