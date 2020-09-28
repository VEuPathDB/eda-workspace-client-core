import { isLeft, isRight } from "fp-ts/lib/These";
import { Type } from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";

export function decode<T>(decoder: Type<T>, item: unknown): T {
  const res = decoder.decode(item);
  if (isLeft(res)) {
    const errors = PathReporter.report(res);
    throw new Error("Could not decode item.\n" + errors.join("\n"));
  }
  return res.right;
}