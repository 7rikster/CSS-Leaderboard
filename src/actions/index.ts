"use server";

import connectToDB from "@/database";
import OpenSourceModel from "@/models/opensource";
import { revalidatePath } from "next/cache";

interface Issue {
  title: string;
  level: string;
  url: string;
  date: Date;
}

interface ContestantData {
  id?: string;
  name: string;
  score: number;
  issuesFixed: Issue[];
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

export async function updateContestant(formData: ContestantData, _id: string) {
  await connectToDB();
  console.log(formData);
  const response = await OpenSourceModel.findByIdAndUpdate(
    _id,
    { ...formData },
    { new: true }
  );
  return JSON.parse(JSON.stringify(response));
}
