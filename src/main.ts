import RecordLabelController from './recordLabelController';

const run = async () => {
  const recordLabelController = new RecordLabelController();
  await recordLabelController.click();
  return recordLabelController.getResult();
};

run()
  .then(output => console.log(output))
  .catch(err => console.log(`unexpected error: ${err}`));
