import * as dotenv from "dotenv";
import { CronJob } from "cron";
import getClasses from "./getClasses";
import loginAndReserve from "./loginAndReserve";
import {
  ClassInfoArray,
  CollationResult,
  DesiredClassInfoArray,
} from "./interfaces";
import { writeFileAsync, localCheck, readFileAsync } from "./util";

dotenv.load();

const reserve = async (indexArray: Array<number>): Promise<void> => {
  for (const i of indexArray) {
    // await loginAndReserve(i);
  }
};

//main();
const job = new CronJob(
  "*/5 * * * * *",
  async () => {
    const collationResult: CollationResult = await localCheck(
      await getClasses()
    );

    if (collationResult.result) {
      job.stop();
      await reserve(collationResult.indexes);
      const preReservedClasses = await JSON.parse(
        await readFileAsync("reserved.json", {
          encoding: "utf8",
        })
      );
      const newReservedClasses = [];
      //await newReservedClasses.push(...preReservedClasses);
      //await newReservedClasses.push(...collationResult.details);
      await writeFileAsync(
        "reserved.json",
        await JSON.stringify([
          ...preReservedClasses,
          ...collationResult.details,
        ])
      );
      await console.log(`reserve ${collationResult.indexes.length} class(es)`);
      await job.start();
    } else {
      console.log("no much class");
    }
  },
  null,
  true
);
