export default function parse(response: unknown): string {
  if (typeof response === "undefined") {
    throw new Error();
  } else if (typeof response === "string" || typeof response == "number") {
    return response.toString();
  }
  return "not-implemented-yet";
}
