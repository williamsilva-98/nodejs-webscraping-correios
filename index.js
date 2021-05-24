const scrapper = require("./scrapper");
// QE821638872BR
// QC032379196BR
// PZ015760192BR

const track = async () => {
  const result = await scrapper("PZ015760192BR");
  console.log(result);
};

track();
