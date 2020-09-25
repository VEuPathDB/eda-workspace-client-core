import { isRight } from "fp-ts/lib/Either";
import { Type } from "io-ts";
import { PathReporter } from "io-ts/lib/PathReporter";

export async function fetchWithCodec<A, O, I>(codec: Type<A, O, I>, input: RequestInfo, init?: RequestInit): Promise<A> {
  const response = await fetch(input, init);
  const result = codec.decode(await response.json());
  if (isRight(result)) return result.right;
  throw new Error(`Unexpected response: ${PathReporter.report(result).join('; ')}`);
}
