'use strict';
var __createBinding =
  (this && this.__createBinding) ||
  (Object.create
    ? function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        Object.defineProperty(o, k2, {
          enumerable: true,
          get: function () {
            return m[k];
          },
        });
      }
    : function (o, m, k, k2) {
        if (k2 === undefined) k2 = k;
        o[k2] = m[k];
      });
var __setModuleDefault =
  (this && this.__setModuleDefault) ||
  (Object.create
    ? function (o, v) {
        Object.defineProperty(o, 'default', { enumerable: true, value: v });
      }
    : function (o, v) {
        o['default'] = v;
      });
var __importStar =
  (this && this.__importStar) ||
  function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
      for (var k in mod)
        if (k !== 'default' && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.usePreservedForm = void 0;
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
        var fieldRef = fields[key]._f.ref;
        fieldRef.addEventListener('blur', handleChange);
        fieldRef.addEventListener('input', handleChange);
        fieldRef.addEventListener('reset', handleChange);
      }
      return function () {
        for (var key in fields) {
          var fieldRef = fields[key]._f.ref;
          fieldRef.removeEventListener('input', handleChange);
          fieldRef.removeEventListener('blur', handleChange);
          fieldRef.removeEventListener('reset', handleChange);
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
