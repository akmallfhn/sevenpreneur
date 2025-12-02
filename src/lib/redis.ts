import { Redis } from "@upstash/redis";
import { randomUUID } from "crypto";

const redis = Redis.fromEnv();
const duration = 24 * 60 * 60; // 24 hours

export default function GetRedisClient() {
  return redis;
}

function queueKey(id: string) {
  return "queue:" + id;
}

function resultKey(id: string) {
  return "result:" + id;
}

export async function SaveQStashMessageID(message_id: string) {
  const resultId = randomUUID();

  await redis.set(queueKey(message_id), resultKey(resultId), { ex: duration });

  return resultId as string;
}

export async function SetAIResultEphemeral(message_id: string, result: object) {
  const resultKey = await redis.get<string>(queueKey(message_id));
  if (!resultKey) {
    return false;
  }

  return await redis.set(resultKey, result, { ex: duration });
}

export async function GetAIResultEphemeral<T>(id: string) {
  const data = await redis.get<T>(resultKey(id));

  const ttl = await redis.ttl(resultKey(id));
  const expiredAt = new Date(new Date().getTime() + ttl * 1000);

  return {
    result: data ? (data as T) : null,
    is_done: !!data,
    expired_at: data ? expiredAt : null,
  };
}
