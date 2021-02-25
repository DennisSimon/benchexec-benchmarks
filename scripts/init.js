const path = require('path');

const exec = require('child_process').exec;

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
  await runCommand(
    'git clone https://github.com/sosy-lab/benchexec.git stat_test'
  );
  await runCommand('git clone https://github.com/sosy-lab/benchexec.git old');
  await runCommand('git checkout 99470a', path.resolve('old').toString());
  await runCommand(
    'git checkout origin/table-render-test',
    path.resolve('new').toString()
  );
  await runCommand(
    'git checkout origin/async-stat-recalculation',
    path.resolve('stat_test').toString()
  );

  console.log('🐍\tInstalling python dependencies');
  await runCommand('pip install .', path.resolve('new').toString());
  await runCommand('pip install .', path.resolve('old').toString());
  await runCommand('pip install .', path.resolve('stat_test').toString());

  console.log('🚀\tDone');
};

run();
