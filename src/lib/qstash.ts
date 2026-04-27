import { Client } from "@upstash/qstash";

const qstash = new Client();

export default function GetQStashClient() {
  return qstash;
}
