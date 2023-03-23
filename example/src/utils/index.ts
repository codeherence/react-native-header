interface RangeProps {
  start?: number;
  end: number;
  step?: number;
}

export const range = ({ start = 0, end, step = 1 }: RangeProps): Array<number> => {
  const result = new Array(end - start);

  let i = 0;
  for (let v = start; v < end; v += step) {
    result[i] = v;
    i += 1;
  }

  return result;
};
