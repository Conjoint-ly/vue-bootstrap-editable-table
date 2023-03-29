import {isObject} from "~/helpers";
import ColumnType from "./ColumnType";
import tJsonCell from './t-json-cell';

export default class JsonColumnType extends ColumnType {
  static type = 'JSON';
  static cell = tJsonCell;
  static icon = 'code';

  static convertStringToValue(str) {
    try {
      return JSON.parse(str)
    } catch (e) {
      return undefined;
    }
  }
  static validate(value) {
    return isObject(value);
  }
}