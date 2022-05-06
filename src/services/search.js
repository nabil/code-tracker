export function search(jsonArray, term, fields) {
  console.debug('search term:' + term);
  console.debug(jsonArray);
  console.debug(fields);

  if (!jsonArray?.length || !fields?.length || !term?.length) {
    return jsonArray;
  }

  var terms = term.split('/^s*$/');
  var result = jsonArray.filter((item, i1) => {
    return terms.some((term, i2) => {
      return fields.some((field, i3) => {
        return item[field]?.toString().toLowerCase().includes(term.toLowerCase());
      });
    });
  });

  return result;
}
