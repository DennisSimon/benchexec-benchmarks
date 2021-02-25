const fs = require('fs').promises;
const faker = require('faker');
const path = require('path');

const header = `<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE result
  PUBLIC '+//IDN sosy-lab.org//DTD BenchExec result 3.0//EN'
  'https://www.sosy-lab.org/benchexec/result-3.0.dtd'>
  `;

const resultStart = `
<result benchmarkname="integration-witness-generation" cpuCores="2" date="2021-02-19 20:18:39 CET" endtime="2021-02-19T21:32:20.969428+01:00" generator="BenchExec 3.5" memlimit="7000000000B" options="-heap 6000M -setprop cpa.arg.compressWitness=true -setprop counterexample.export.compressWitness=true -svcomp20" starttime="2021-02-19T20:18:44.136677+01:00" timelimit="900s" tool="CPAchecker" toolmodule="benchexec.tools.cpachecker" version="trunk:36837">
  <columns>
    <column title="status"/>
    <column title="cputime"/>
    <column title="walltime"/>
  </columns>
  <systeminfo hostname="ws13">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws09">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws17">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws05">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws18">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws01">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604726784B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws03">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws16">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws19">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33646600192B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws06">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws08">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws07">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws12">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws04">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws10">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws02">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604653056B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws15">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
  <systeminfo hostname="ws11">
    <os name="Linux 4.15.0-135-generic"/>
    <cpu cores="8" frequency="4000000000Hz" model="Intel Core i7-6700 @ 3.40 GHz" turboboostActive="false"/>
    <ram size="33604661248B"/>
    <environment/>
  </systeminfo>
`;
const hostNames = [];
for (let i = 0; i < 20; i += 1) {
  if (i === 14) {
    continue;
  }
  hostNames.push(`ws${i.toString().padStart(2, '0')}`);
}

const statuses = ['true', 'false'];

const categories = ['correct', 'error', 'wrong'];

const makeRun = () => {
  const path = faker.unique(faker.system.filePath).replace(/[<>&'"]/g, '');
  const path2 = faker.system.filePath().replace(/[<>&'"]/g, '');
  const host = faker.random.arrayElement(hostNames);
  const status = faker.random.arrayElement(statuses);
  const category = faker.random.arrayElement(categories);
  return `  <run expectedVerdict="false" files="[${path}]" name="${path}" properties="unreach-call" propertyFile="${path2}">
    <column title="cputime" value="30.009782188s"/>
    <column title="host" value="${host}"/>
    <column title="memory" value="801742848B"/>
    <column title="status" value="${status}"/>
    <column title="walltime" value="15.380406404845417s"/>
    <column  title="blkio-read" value="0B"/>
    <column  title="blkio-write" value="0B"/>
    <column  title="category" value="${category}"/>
    <column  title="cpuCores" value="1,5"/>
    <column  title="cputime-cpu0" value="0.000022369s"/>
    <column  title="cputime-cpu1" value="14.774955530s"/>
    <column  title="cputime-cpu5" value="15.234804289s"/>
    <column  title="memoryNodes" value="0"/>
    <column  title="returnvalue" value="0"/>
    <column  title="starttime" value="2021-02-19T21:15:00.483534+01:00"/>
    <column  title="vcloud-additionalEnvironment" value=""/>
    <column  title="vcloud-cpuCoresDetails" value="[Processor{1, core=1, socket=0}, Processor{5, core=1, socket=0}]"/>
    <column  title="vcloud-debug" value="false"/>
    <column  title="vcloud-generatedFilesCount" value="104"/>
    <column  title="vcloud-matchedResultFilesCount" value="2"/>
    <column  title="vcloud-maxLogFileSize" value="20 MB"/>
    <column  title="vcloud-memoryNodesAllocation" value="{0=3.5 GB}"/>
    <column  title="vcloud-newEnvironment" value=""/>
    <column  title="vcloud-outerwalltime" value="16.127s"/>
    <column  title="vcloud-runId" value="e8ee1958-e2c6-4804-9802-c94c960783a8"/>
  </run>`;
};
const resultEnd = '</result>';
let offset = 0;

const writeData = async (writer, data) => {
  let { bytesWritten } = await writer.write(data);
  offset += bytesWritten;
};

const buildTemplate = async (numLines) => {
  const start = Date.now();
  const savePath = path.join(__dirname, 'template.xml');
  const writer = await fs.open(savePath, 'w');
  await writeData(writer, header);
  await writeData(writer, resultStart);

  for (let i = 0; i < numLines; i += 1) {
    await writeData(writer, makeRun());
  }
  await writeData(writer, resultEnd);
  await writer.close();

  console.log(`creation of template table took ${Date.now() - start} ms`);
  return savePath.toString();
};

module.exports = { buildTemplate };
