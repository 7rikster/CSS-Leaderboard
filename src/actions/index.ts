"use server";

import connectToDB from "@/database";
import OpenSourceModel from "@/models/opensource";
import { revalidatePath } from "next/cache";

interface ContestantData {
  name: string;
  score: number;
  issuesFixed: string[];
}

export async function createContestant(
  formData: ContestantData,
  pathToRevalidate: string
) {
  await connectToDB();
  await OpenSourceModel.create(formData);
  revalidatePath(pathToRevalidate);
}

export async function getContestants() {
  await connectToDB();
  const contestants = await OpenSourceModel.find({}).sort({ score: -1 });

  return JSON.parse(JSON.stringify(contestants));
}
