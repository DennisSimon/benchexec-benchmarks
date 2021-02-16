const cypress = require('cypress');
const path = require('path');
const fs = require('fs').promises;

const run = async () => {
  const oldVersionFileName = (
    await fs.readdir(path.resolve('old', 'bin', 'results').toString())
  ).find((item) => item.endsWith('.html'));

  const newVersionFileName = (
    await fs.readdir(path.resolve('new', 'bin', 'results').toString())
  ).find((item) => item.endsWith('.html'));
  await cypress.run({
    reporter: 'mochawesome',
    reporterOptions: {
      overwrite: false,
      html: false,
      json: true,
    },
    record: false,
    browser: 'chrome',
    headless: 'true',
    env: {
      oldBase: `old/bin/results/${oldVersionFileName}`,
      newBase: `new/bin/results/${newVersionFileName}`,
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
    const version = json.results[0].file.includes('filters_new')
      ? 'new'
      : 'old';
    const buckets = {};

    const subResults = {};

    for (const run of json.results[0].suites) {
      for (const { title, duration } of run.tests) {
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

run();
