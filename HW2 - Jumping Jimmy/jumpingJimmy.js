const jumpingJimmy = (tower, jumpHeight) =>
  tower.reduce(
    (acc, cur) => (acc += cur <= jumpHeight ? cur : ((jumpHeight = 0), 0)),
    0
  );
