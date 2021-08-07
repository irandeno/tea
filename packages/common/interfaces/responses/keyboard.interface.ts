export interface BaseKeyboard {
  text: string;
}

export interface UrlButtonsKeyboard extends BaseKeyboard {
  url: string;
}

export interface DataButtonsKeyboard extends BaseKeyboard {
  data: string;
}

export type InlineKeyboard =
  | Array<UrlButtonsKeyboard>
  | Array<DataButtonsKeyboard>;

export type OrdinaryKeyboard = Array<BaseKeyboard>;

export interface Keyboard {
  keyboard?: InlineKeyboard | OrdinaryKeyboard;
}
