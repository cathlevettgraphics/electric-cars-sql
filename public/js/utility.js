/**
 * Populate form fields from a JSON object.
 *
 * @param form object The form element containing your input fields.
 * @param data object JSON data to populate the fields with.
 * @param basename string Optional basename which is added to `name` attributes
 */

export function populate(form, data) {
  // walk the object
  for (const key in data) {
    // if this is a system property then bail...
    if (!data.hasOwnProperty(key)) {
      continue;
    }

    // get key/value for inputs
    let name = key;
    let value = data[key];

    // Make any bad values an empty string
    if (!value && value !== 0) {
      value = "";
    }

    // try to find element in the form
    const element = form.elements[name];

    // If we can't then bail
    if (!element) {
      continue;
    }

    // see what type an element is to handle the process differently
    const type = element.type || element[0].type;

    switch (type) {
      case "checkbox": {
        // Here, value is an array of values to be spread across the checkboxes that make up this input. It's the value of the input as a whole, NOT the value of one checkbox.
        const values = Array.isArray(value) ? value : [value];

        for (let j = 0, len = element.length; j < len; j += 1) {
          const thisCheckbox = element[j];
          if (values.includes(thisCheckbox.value)) {
            thisCheckbox.checked = true;
          }
        }
        break;
      }
      case "select-multiple": {
        const values = Array.isArray(value) ? value : [value];

        for (let k = 0, len = element.options.length; k < len; k += 1) {
          const thisOption = element.options[k];
          if (values.includes(thisOption.value)) {
            thisOption.selected = true;
          }
        }
        break;
      }
      // case "select":
      // case "select-one":
      //   element.value = value.toString() || value;
      //   break;

      // case "date":
      //   element.value = new Date(value).toISOString().split("T")[0];
      //   break;

      // text boxes
      default:
        element.value = value; // { age: 32 }
        break;
    }
  }
}
