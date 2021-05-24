const sanitize = {
  sanitizeDate: (text) => {
    const event = {};

    let date = text.replace(/<\/{0,1}[a-z]+>/gi, "").split("\n");

    event.date = date[0].trim();
    event.hour = date[1].trim();
    event.locale =
      date.length > 5
        ? date[3].replaceAll("&nbsp;", " ").split(">")[1]
        : date[2].trim();

    return event;
  },
  sanitizeDescription: (text, index, totalItems) => {
    const event = {};

    if (totalItems === index + 1) {
      let description = text
        .replace(/<\/{0,1}[a-z]+>/gi, "")
        .replaceAll("\n", " ")
        .trim();
      event.status = description;
      return event;
    }

    let description = text.replace(/<\/{0,1}[a-z]+>/gi, "").split("\n");

    if (description.length < 7) {
      event.status = description[2];
      return event;
    }

    event.status = description[2].split("-")[0].trim();

    event.origin =
      description[5].replaceAll("\t", "").trim() +
      " " +
      description[6].replaceAll("\t", "").trim();

    event.destiny =
      description[7].replaceAll("\t", "").trim() +
      " " +
      description[8].replaceAll("\t", "");

    return event;
  },
};

module.exports = sanitize;
