# HTML Table benchmarking tool

## Description

This tools main purpose is to test the impact of a newly implemented filtering system on the HTML Table performance.
A separate benchmarking run definition has been created to also track the ad-hoc creation times of the statistics table

## Usage

To start using the tool, first install its JavaScript dependencies by running

```bash
npm install
```

Before the tool can be run it needs to set-up three separate installations of the benchexec tool to test the HTML Tables at different states. To initialize the environments run

```bash
npm run init
```

This clones the benchexec repository and installs all required python dependencies via `pip`.

The benchmark runs will be run ten times per benchmark table. Each benchmark table will be automatically created with different amounts of rows, which will be increased in steps of 1,000 rows per test run until a amount of 80,000 rows is reached. The initial amount of rows is 1,000.

The results of each run will be stored in a `accum_results` folder and will contain `min`, `max`, `avg` and `median` values of each benchmark. The raw values of all runs are also included in these files.

To start the benchmarking process run:

```bash
npm run run
```
