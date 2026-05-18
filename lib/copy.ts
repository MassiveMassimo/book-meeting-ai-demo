// Static UI copy. Replaces the previous i18n dictionaries system.
// Components still consume this via `dict.foo.bar` to minimize diff —
// only the source changed (locale-aware loader → static const).
import en from "./copy.en.json";

export const dict = en;
export type Dictionary = typeof en;
