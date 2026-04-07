"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/atoms";

interface TestInstructionsProps {
  examType: string;
  subjects: string[];
  duration: string;
  questionCount: number;
  userName: string;
  onGoBack: () => void;
  onAttemptTest: () => void;
  isAttempting?: boolean;
}

export function TestInstructions({
  examType,
  subjects,
  duration,
  questionCount,
  userName,
  onGoBack,
  onAttemptTest,
  isAttempting,
}: TestInstructionsProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl p-6 md:p-8">
        <h1 className="text-xl font-semibold text-blue-500 mb-6">
          Welcome, {userName}
        </h1>
        <hr className="mb-6 text-[#DCDFE4]" />

        <h2 className="text-lg font-bold text-gray-900 mb-1">
          Test Instructions
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Please read carefully before starting
        </p>

        <div className="space-y-3 mb-6">
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 w-24">Exam Type:</span>
            <span className="text-sm font-medium text-gray-900">
              {examType}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 w-24">Subject:</span>
            <span className="text-sm font-medium text-gray-900">
              {subjects.join(", ")}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 w-24">Duration:</span>
            <span className="text-sm font-medium text-gray-900">
              {duration}
            </span>
          </div>
          <div className="flex gap-4">
            <span className="text-sm text-gray-500 w-24">Question:</span>
            <span className="text-sm font-medium text-gray-900">
              {questionCount} Questions
            </span>
          </div>
        </div>

        <div className="space-y-2 mb-8">
          <div className="flex items-start gap-2 text-red-500">
            <Icon
              icon="hugeicons:checkmark-circle-02"
              className="w-4 h-4 mt-0.5 flex-shrink-0"
            />
            <span className="text-sm">Read Each Question Carefully</span>
          </div>
          <div className="flex items-start gap-2 text-red-500">
            <Icon
              icon="hugeicons:checkmark-circle-02"
              className="w-4 h-4 mt-0.5 flex-shrink-0"
            />
            <span className="text-sm">
              Each question has only one correct answer. Click on your choice to
              select it.
            </span>
          </div>
          <div className="flex items-start gap-2 text-red-500">
            <Icon
              icon="hugeicons:checkmark-circle-02"
              className="w-4 h-4 mt-0.5 flex-shrink-0"
            />
            <span className="text-sm">
              After answering the last question, click &quot;Finish Exam&quot;
              to submit and view your results.
            </span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outlined" onClick={onGoBack}>
            Go back
          </Button>
          <Button onClick={onAttemptTest} loading={isAttempting}>
            Attempt Test
          </Button>
        </div>
      </div>
    </div>
  );
}
