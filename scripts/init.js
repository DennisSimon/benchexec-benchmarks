const path = require('path');

const exec = require('child_process').exec;

const data = [
  'https://buildbot.sosy-lab.org/cpachecker/results/nightly-sv-comp/00226.-r_integration-nightly-sv-comp.2020-10-23_22-05-14.results.xml.bz2',
  'https://buildbot.sosy-lab.org/cpachecker/results/nightly-termination/00208.-r34819_integration-nightly-termination.2020-08-26_22-00-13.results.xml.bz2',
  'https://buildbot.sosy-lab.org/cpachecker/results/nightly-induction/00201.-r_integration-nightly-induction.2020-12-30_22-00-30.results.xml.bz2',
];

const runCommand = async (command, cwd = process.cwd()) => {
  let cont;
  const promise = new Promise((resolve) => (cont = resolve));

  exec(command, { cwd, maxBuffer: 1024 * 1024 * 10 }, (error, stdout) => {
    if (error) {
      throw new Error(error);
    }
    cont(stdout);
  });

  return promise;
};

const run = async () => {
  console.log('🌱\tInitializing git clones');
  await runCommand('git clone https://github.com/sosy-lab/benchexec.git new');
  await runCommand('git clone https://github.com/sosy-lab/benchexec.git old');
  await runCommand('git checkout 99470a', path.resolve('old').toString());
  console.log('🏋️\tInstalling node dependencies');
  await runCommand(
    'npm i',
    path.resolve('new', 'benchexec', 'tablegenerator', 'react-table').toString()
  );
  await runCommand(
    'npm i',
    path.resolve('old', 'benchexec', 'tablegenerator', 'react-table').toString()
  );

  console.log('🐍\tInstalling python dependencies');
  await runCommand('pip install .', path.resolve('new').toString());
  await runCommand('pip install .', path.resolve('old').toString());

  console.log('📂\tCreating test tables...');
  await runCommand(
    `./table-generator ${data.join(' ')}`,
    path.resolve('old', 'bin').toString()
  );
  await runCommand(
    `./table-generator ${data.join(' ')}`,
    path.resolve('new', 'bin').toString()
  );
  console.log('🚀\tDone');
};

run();
