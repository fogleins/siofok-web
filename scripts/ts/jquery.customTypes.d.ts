/**
 * Extends the JQuery type with the properties of jquery plugins that are used in the project.
 * It helps IDE code completion and tsc doesn't report warnings/errors either.
 */
interface JQuery {
    tagEditor(x: string): JQuery;
    tagEditor(x: string, arg: string): JQuery;
    tagEditor(x: Object): JQuery;
    tagEditor(x: Function): JQuery;
    toast(x: string): JQuery;
    daterangepicker(properties: Object, callback?: Function): JQuery;
}
