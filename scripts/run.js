const cypress = require('cypress');
const path = require('path');
const fs = require('fs').promises;
const exec = require('child_process').exec;

const { buildTemplate } = require('../template/buildTemplate');

const maxRows = 80_000;
const increment = 1_000;

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

const runSuites = async () => {
  await fs.rm(path.resolve('mochawesome-report').toString(), {
    recursive: true,
    force: true,
  });

  const oldVersionFileName = (
    await fs.readdir(path.resolve('old', 'bin', 'results').toString())
  ).find((item) => item.endsWith('.html'));

  const newVersionFileName = (
    await fs.readdir(path.resolve('new', 'bin', 'results').toString())
  ).find((item) => item.endsWith('.html'));

  const statTestVersionFileName = (
    await fs.readdir(path.resolve('stat_test', 'bin', 'results').toString())
  ).find((item) => item.endsWith('.html'));

  await cypress.run({
    reporter: 'mochawesome',
    reporterOptions: {
      overwrite: false,
      html: false,
      json: true,
    },
    record: false,
    video: false,
    browser: 'chrome',
    headless: 'true',
    env: {
      oldBase: `old/bin/results/${oldVersionFileName}`,
      newBase: `new/bin/results/${newVersionFileName}`,
      statBase: `stat_test/bin/results/${statTestVersionFileName}`,
    },
  });

  const reportFiles = (
    await fs.readdir(path.resolve('mochawesome-report').toString())
  ).filter((file) => file.endsWith('.json'));

  const results = {};
  for (const file of reportFiles) {
    const data = await fs.readFile(
      path.resolve('mochawesome-report', file).toString()
    );
    const json = JSON.parse(data);
    console.log({ json });
    let version;
    if (json.results[0].file.includes('stat_test')) {
      version = 'statCalculation';
    } else {
      version = json.results[0].file.includes('filters_new') ? 'new' : 'old';
    }

    const buckets = {};

    const subResults = {};

    for (const run of json.results[0].suites) {
      for (const { title, duration } of run.tests) {
        if (title.includes('navigate')) {
          continue;
        }
        if (!Array.isArray(buckets[title])) {
          buckets[title] = [];
        }
        buckets[title].push(duration);
      }
    }

    for (const durations of Object.entries(buckets)) {
      durations.sort();
    }

    for (const [key, durations] of Object.entries(buckets)) {
      const temp = { min: Infinity, max: -Infinity };
      let sum = 0;
      for (const duration of durations) {
        temp.min = Math.min(temp.min, duration);
        temp.max = Math.max(temp.max, duration);
        sum += duration;
      }
      temp.avg = sum / durations.length;
      temp.median =
        durations.length % 2 === 0
          ? (durations[durations.length / 2 - 1] +
              durations[durations.length / 2]) /
            2
          : durations[durations.length / 2];
      temp.raw = durations;
      subResults[key] = temp;
    }
    results[version] = subResults;
  }

  await fs.writeFile(
    path.resolve('mochawesome-report', 'accum-report.json').toString(),
    JSON.stringify(results)
  );
};

const run = async () => {
  await fs.mkdir(path.resolve('accum_results').toString(), { recursive: true });

  for (let numRows = increment; numRows < maxRows; numRows += increment) {
    console.log(`Running benchmark with ${numRows} rows`);
    const filePath = await buildTemplate(numRows);
    await Promise.all(
      ['new', 'old', 'bin'].map((item) =>
        fs.rm(path.resolve(item, 'bin', 'results'), {
          recursive: true,
          force: true,
        })
      )
    );
    await runCommand(
      `./table-generator ${filePath} -o results`,
      path.resolve('old', 'bin').toString()
    );
    await runCommand(
      `./table-generator ${filePath} -o results`,
      path.resolve('new', 'bin').toString()
    );
    await runCommand(
      `./table-generator ${filePath} -o results`,
      path.resolve('stat_test', 'bin').toString()
    );

    await runSuites();

    await fs.copyFile(
      path.resolve('mochawesome-report', 'accum-report.json'),
      path.resolve('accum_results', `res-${numRows}.json`)
    );
  }
};

run();
