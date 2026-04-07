"use client";

import { useEffect, useState } from "react";
import { Button } from "../../atoms";
import { InputField } from "@/components/molecules";
import { useUtilsStore, useStudentStore } from "@/store";
import { authRequest } from "@/lib/api";
import { handleAxiosError } from "@/utils";
import { toast } from "sonner";
import type { ISubject } from "@/types";

export function CompleteProfileModal({ isOpen }: { isOpen: boolean }) {
  const { subjects, fetchSubjectsByExamType } = useUtilsStore();
  const { dashboardData, setDashboardData } = useStudentStore();

  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);
  const [selectedSubjectsString, setSelectedSubjectsString] = useState("");
  const [loadingSubjects, setLoadingSubjects] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentExamType = dashboardData?.currentExamType;
  const examTypeId = currentExamType?.id;
  const examTypeName = currentExamType?.name;
  const minSubjects = currentExamType?.minSubjectsSelectable ?? 1;
  const maxSubjects = currentExamType?.maxSubjectsSelectable ?? 9;

  // Fetch subjects when modal opens
  useEffect(() => {
    if (isOpen && examTypeId) {
      setLoadingSubjects(true);
      void fetchSubjectsByExamType(examTypeId).finally(() => {
        setLoadingSubjects(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, examTypeId]);

  const handleSubjectChange = (value: string) => {
    setSelectedSubjectsString(value);
    const ids = value
      .split(",")
      .map((id) => id.trim())
      .filter(Boolean);
    setSelectedSubjectIds(ids);
  };

  const handleSubmit = async () => {
    if (!examTypeId) return;

    if (selectedSubjectIds.length < minSubjects) {
      toast.error(
        `Please select at least ${minSubjects} subject${minSubjects > 1 ? "s" : ""}`,
      );
      return;
    }

    if (selectedSubjectIds.length > maxSubjects) {
      toast.error(
        `Please select at most ${maxSubjects} subject${maxSubjects > 1 ? "s" : ""}`,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await authRequest({
        method: "PATCH",
        url: "/students/settings/subjects",
        data: {
          examTypeId,
          subjectIds: selectedSubjectIds,
        },
      });

      const result = (res as any).data?.data as {
        selectedSubjects: { id: string; name: string }[];
      };

      // Update dashboard data with new subjects
      if (dashboardData) {
        setDashboardData({
          ...dashboardData,
          selectedSubjects: (result.selectedSubjects as { id: string; name: string; questionsAttempted: number }[]),
          currentExamType: {
            ...dashboardData.currentExamType,
            hasSelectedSubjects: true,
          },
          flags: {
            ...dashboardData.flags,
            hasSelectedDefaultSubjects: true,
          },
          stats: {
            ...dashboardData.stats,
            totalSubjectsSelected: result.selectedSubjects.length,
          },
        });
      }

      toast.success("Subjects updated successfully!");
    } catch (error) {
      handleAxiosError(error, "Failed to update subjects");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const isValidSelection =
    selectedSubjectIds.length >= minSubjects &&
    selectedSubjectIds.length <= maxSubjects;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">
            Complete your Profile
          </h2>
          {/* No close button - this is compulsory */}
        </div>

        <div className="p-4 md:p-6">
          <div className="mb-2">
            <h3 className="text-lg md:text-xl font-semibold text-gray-900">
              Welcome! Let&apos;s Set Things Up!
            </h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            You&apos;re almost ready to start your learning journey. Choose the
            subjects that match your goals, this helps us personalize your
            experience and track your progress easily.
          </p>

          <div className="space-y-4">
            <div>
              <InputField
                value={examTypeName || ""}
                label="Exam Type"
                disabled
              />
            </div>

            <div>
              <InputField
                label="Select Subjects"
                type="multi-select"
                placeholder={
                  loadingSubjects
                    ? "Loading subjects..."
                    : "Select your subjects"
                }
                value={selectedSubjectsString}
                selectOptions={subjects.map((subject: ISubject) => ({
                  value: subject.id,
                  label: subject.name,
                }))}
                disabled={loadingSubjects}
                onChange={(e: { target: { value: string } }) => {
                  handleSubjectChange(e.target.value);
                }}
              />
              <p className="mt-1.5 text-xs text-[#667085]">
                Select between {minSubjects} and {maxSubjects} subjects (
                {selectedSubjectIds.length} selected)
              </p>
            </div>
          </div>

          <div className="flex justify-end mt-6">
            <Button
              onClick={handleSubmit}
              disabled={!isValidSelection || isSubmitting}
              loading={isSubmitting}
            >
              Submit
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
