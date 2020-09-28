const { readFileSync } = require('fs');
const { Script, compileFunction } = require('vm');

const fileSource = readFileSync('./.yarn/releases/yarn-berry.cjs', 'utf8')
  .split('\n')
  // get rid of shebang
  .slice(1)
  .join('\n');

const oneMillisecondAsNano = 1_000_000n;

let start = process.hrtime.bigint();

for (let i = 0; i < 100; i++) {
  new Script(fileSource);
}

console.log(
  'Running with Script took',
  Number((process.hrtime.bigint() - start) / oneMillisecondAsNano),
  'ms',
);

start = process.hrtime.bigint();

for (let i = 0; i < 100; i++) {
  compileFunction(fileSource);
}

console.log(
  'Running with compileFunction took',
  Number((process.hrtime.bigint() - start) / oneMillisecondAsNano),
  'ms',
);

start = process.hrtime.bigint();
let cachedData;

for (let i = 0; i < 100; i++) {
  const func = compileFunction(fileSource, [], {produceCachedData: true, cachedData});

  if (!cachedData) {
    cachedData = func.cachedData
  }
}

console.log(
    'Running with compileFunction and cached data took',
    Number((process.hrtime.bigint() - start) / oneMillisecondAsNano),
    'ms',
);
