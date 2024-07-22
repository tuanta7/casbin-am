function formatISODate(ISODate) {
  return new Date(ISODate).toLocaleString("en-us", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export { formatISODate };
