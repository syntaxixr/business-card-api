import { groupByKeys } from './group-by-keys';

describe('groupByKeys', () => {
  it('returns groups in key order and keeps row order', () => {
    const rows = [
      { owner: 2, value: 'a' },
      { owner: 1, value: 'b' },
      { owner: 2, value: 'c' },
    ];

    const groups = groupByKeys([1, 3, 2], rows, (row) => row.owner);

    expect(groups.map((group) => group.map((row) => row.value))).toEqual([['b'], [], ['a', 'c']]);
  });
});
