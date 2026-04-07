"use client";

import { Icon } from "@iconify/react";
import { Button } from "@/components/atoms";
import { InputField } from "@/components/molecules";
import { ChangeEvent, useState } from "react";

interface RevisionModeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onContinue: (numQuestions: number) => void;
  subjects: string[];
  isDemoUser: boolean;
  freeTierLimit: number;
}

export function RevisionModeModal({
  isOpen,
  onClose,
  onContinue,
  subjects,
  isDemoUser,
  freeTierLimit,
}: RevisionModeModalProps) {
  const [numQuestions, setNumQuestions] = useState<number | "">("");

  if (!isOpen) return null;

  const handleContinue = () => {
    if (!numQuestions) return;
    const capped = isDemoUser
      ? Math.min(numQuestions as number, freeTierLimit)
      : (numQuestions as number);
    onContinue(capped);
  };

  return (
    <section className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Revision Mode</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon icon="hugeicons:cancel-01" className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 md:p-6">
          {isDemoUser && (
            <div className="bg-[#FEF6E7] border-l-4 border-[#F3A218] mb-4 p-[.75rem_1rem]">
              <div className="flex items-center gap-2">
                <Icon
                  icon="hugeicons:information-circle"
                  className="w-5 h-5 text-[#F3A218] flex-shrink-0 mt-0.5"
                />
                <p className="text-[.875rem] font-[600] leading-5 text-[#2B2B2B]">
                  You only have access to {freeTierLimit} Questions!
                </p>
              </div>
            </div>
          )}

          <div className="border border-[#41BCE2] rounded-xl p-4 mb-6 bg-[#F1FCFF]">
            <div className="flex items-start gap-2 mb-3">
              <Icon
                icon="hugeicons:book-open-02"
                className="w-7.5 h-7.5"
                color="#41BCE2"
              />
              <div className="flex flex-col gap-[1rem]">
                <h4 className="font-[400] text-[1rem] text-[#575757] leading-[1.5rem]">
                  UTME Subjects
                </h4>
                <div className="space-y-2">
                  {subjects.map((subject) => (
                    <p
                      key={subject}
                      className="text-[#2B2B2B] text-[1.125rem] leading-[1.75rem] font-[500]"
                    >
                      {subject}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Number Of Questions that you want to give answers
            </label>
            <InputField
              type="number"
              label={null}
              value={numQuestions}
              onChange={(
                e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
              ) =>
                setNumQuestions(
                  e.target.value ? Number.parseInt(e.target.value) : "",
                )
              }
              placeholder={
                isDemoUser
                  ? `Enter no of questions (max ${freeTierLimit})`
                  : "Enter no of questions"
              }
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={handleContinue} disabled={!numQuestions}>
              Continue
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
