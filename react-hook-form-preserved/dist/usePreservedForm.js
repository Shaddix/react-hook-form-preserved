'use strict';
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result['default'] = mod;
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
var react_1 = __importStar(require('react'));
var react_hook_form_1 = require('react-hook-form');
/*
  Preserves react-hook-form between unmount/mount cycles.
 */
function usePreservedForm(formName, optionsParam) {
  var options =
    optionsParam !== null && optionsParam !== void 0 ? optionsParam : {};
  var getValuesRef = react_1.default.useRef(null);
  var saveValuesFactory = react_1.useCallback(
    function () {
      return function () {
        if (getValuesRef.current) {
          var currentValues = getValuesRef.current();
          localStorage.setItem(formName, JSON.stringify(currentValues));
        }
      };
    },
    [formName],
  );
  // preserve values on unmount
  react_1.default.useEffect(saveValuesFactory, []);
  var jsonInitialValues = localStorage.getItem(formName);
  if (jsonInitialValues) {
    options.defaultValues = JSON.parse(jsonInitialValues);
  }
  var form = react_hook_form_1.useForm(options);
  var handleChange = react_1.useCallback(function (fieldName) {
    saveValuesFactory()();
  }, []);
  var fields = form.control.fieldsRef.current;
  react_1.useEffect(
    function () {
      for (var key in fields) {
        var fieldRef = fields[key].ref;
        fieldRef.addEventListener('blur', handleChange);
        fieldRef.addEventListener('input', handleChange);
      }
      return function () {
        for (var key in fields) {
          var fieldRef = fields[key].ref;
          fieldRef.removeEventListener('input', handleChange);
          fieldRef.removeEventListener('blur', handleChange);
        }
      };
    },
    [fields],
  );
  // eslint-disable-next-line
  saveValuesFactory()();
  // Save getValues reference on each rerender
  react_1.default.useEffect(
    function () {
      getValuesRef.current = form.getValues;
    },
    [form.getValues],
  );
  var reset = form.reset;
  form.reset = react_1.useCallback(
    function (props) {
      reset(props);
      var saveValuesFunction = saveValuesFactory();
      saveValuesFunction();
    },
    [reset, saveValuesFactory],
  );
  return form;
}
exports.usePreservedForm = usePreservedForm;
