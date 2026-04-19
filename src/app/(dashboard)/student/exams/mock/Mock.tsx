"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Calculator,
  ExamHeader,
  Disclaimer,
  TestResults,
  TestInstructions,
} from "@/components/molecules/student-dashboard";
import { Icon } from "@iconify/react";
import { useExamProtection, useExamLeaveGuard } from "@/hooks";
import { cn } from "@/lib/utils";
import { Button, CheckBox, Radio, RichText } from "@/components/atoms";
import { InputField } from "@/components/molecules";
import { useExamStore, useAuthStore } from "@/store";
import type { IQuestionResponse, IFlagUpdate } from "@/types";

function formatDuration(secs: number): string {
  const totalMins = Math.floor(secs / 60);
  if (totalMins >= 60) {
    const h = Math.floor(totalMins / 60);
    const m = totalMins % 60;
    return m > 0 ? `${h} hr ${m} mins` : `${h} hr`;
  }
  return `${totalMins} minutes`;
}

function formatTimeUsed(secs: number): string {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60);
  const s = secs % 60;
  if (h > 0) return `${h} hr ${m > 0 ? `${m} min ` : ""}${s} sec`;
  if (m > 0) return `${m} min ${s} sec`;
  return `${s} sec`;
}

function MockSkeleton() {
  return (
    <section className="bg-white p-4 md:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-pulse">
          <div className="lg:col-span-2 space-y-6 pb-8">
            <div className="rounded-[1.5rem] bg-gray-100 h-24" />
            <div className="rounded-[1rem] bg-gray-100 h-96" />
          </div>
          <div className="hidden lg:flex flex-col gap-4">
            <div className="rounded-[1.5rem] bg-gray-100 h-80" />
            <div className="rounded-[2rem] bg-gray-100 h-96" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Mock() {
  const router = useRouter();
  const { user } = useAuthStore();
  const {
    pendingConfig,
    examSession,
    isStartingExam,
    startExam,
    submitExam,
    examResult,
    isSubmittingExam,
    clearSession,
    mockConfig,
    getQuestion,
    getPassage,
    prefetchAround,
    loadingPages,
  } = useExamStore();

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<
    Record<string, string | string[] | Record<string, string>>
  >({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showNavigation, setShowNavigation] = useState(true);
  const [isNavigationMinimized, setIsNavigationMinimized] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  useExamProtection(!showResults);
  const { showLeaveModal, dismissLeaveModal } = useExamLeaveGuard(!showResults);

  // Seed flaggedQuestions from previously flagged IDs when session loads
  useEffect(() => {
    if (examSession?.flaggedQuestionIds?.length) {
      setFlaggedQuestions(new Set(examSession.flaggedQuestionIds));
    }
  }, [examSession?.examAttemptId, examSession?.flaggedQuestionIds]);

  // Initialize countdown timer once exam session is available
  useEffect(() => {
    if (examSession && timeLeft === null) {
      setTimeLeft(examSession.timeLimitSeconds ?? 95 * 60);
    }
  }, [examSession, timeLeft]);

  // Stable submit handler — used by both button and timer auto-submit
  const handleFinalSubmit = useCallback(async () => {
    const elapsed = examSession
      ? Math.floor(
          (Date.now() - new Date(examSession.startedAt).getTime()) / 1000,
        )
      : 0;
    // Build from answers dict — works regardless of pagination
    const responses: IQuestionResponse[] = Object.entries(answers).map(
      ([questionId, answer]) => ({
        questionId,
        answer,
        timeSpent: 0,
        isFlagged: flaggedQuestions.has(questionId),
      }),
    );
    // Compute delta: new flags added this session + pre-flagged that were removed
    const preflaggedIds = new Set(examSession?.flaggedQuestionIds ?? []);
    const flagUpdates: IFlagUpdate[] = [
      ...[...flaggedQuestions]
        .filter((id) => !preflaggedIds.has(id))
        .map((id) => ({ questionId: id, isFlagged: true })),
      ...[...preflaggedIds]
        .filter((id) => !flaggedQuestions.has(id))
        .map((id) => ({ questionId: id, isFlagged: false })),
    ];
    await submitExam(
      responses,
      elapsed,
      flagUpdates.length ? flagUpdates : undefined,
    );
    setShowReview(false);
    setShowResults(true);
  }, [examSession, answers, flaggedQuestions, submitExam]);

  // Countdown timer — only active after exam starts (isLoading === false)
  useEffect(() => {
    if (isLoading || timeLeft === null) return;
    if (timeLeft <= 0) {
      handleFinalSubmit();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev !== null ? prev - 1 : null));
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isLoading, handleFinalSubmit]);

  // Redirect after render if no active session — avoids setState-during-render warning
  useEffect(() => {
    if (!pendingConfig && !examSession) {
      router.replace("/student/exams");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!pendingConfig, !!examSession]);

  // Session guard — must come AFTER all hooks
  if (!pendingConfig && !examSession) {
    return <MockSkeleton />;
  }

  const totalQuestions =
    examSession?.totalCount ?? mockConfig?.standardQuestionCount ?? 0;
  const examTypeName =
    examSession?.examTypeName ?? pendingConfig?.examTypeName ?? "";
  const subjectNames =
    examSession?.subjectNames ?? pendingConfig?.subjectNames ?? [];
  const userName = user?.firstName ?? "Student";
  const timeLimitSeconds =
    examSession?.timeLimitSeconds ??
    (mockConfig ? mockConfig.standardDurationMinutes * 60 : 95 * 60);

  const questionIndex = currentQuestion - 1;
  const question = getQuestion(questionIndex);
  const currentPage = Math.floor(questionIndex / 20);
  const isPageLoading = loadingPages.has(currentPage);

  const isEssay = question?.type === "essay";
  const isFillInBlank = question?.type === "fill_in_the_blank";
  const isShortAnswer = question?.type === "short_answer";
  const isMultipleResponse = question?.type === "multiple_response";
  const isMatching = question?.type === "matching";
  const isTextInput = isFillInBlank || isShortAnswer;
  const passage = question?.passageId ? getPassage(question.passageId) : null;

  // Answered count from the answers dict (works across all pages)
  const answeredCount = Object.values(answers).filter((a) => {
    if (a == null) return false;
    if (Array.isArray(a)) return a.length > 0;
    if (typeof a === "string") return a.trim() !== "";
    return Object.values(a as Record<string, string>).some(
      (v) => v?.trim() !== "",
    );
  }).length;

  const handleSelectOption = (optionId: string) => {
    if (!question) return;
    if (isMultipleResponse) {
      const current = (answers[question.id] as string[]) ?? [];
      const updated = current.includes(optionId)
        ? current.filter((id) => id !== optionId)
        : [...current, optionId];
      setAnswers({ ...answers, [question.id]: updated });
    } else {
      setAnswers({ ...answers, [question.id]: optionId });
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 1) {
      const next = currentQuestion - 1;
      setCurrentQuestion(next);
      prefetchAround(next - 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      const next = currentQuestion + 1;
      setCurrentQuestion(next);
      prefetchAround(next - 1);
    } else setShowReview(true);
  };

  const handleToggleFlag = () => {
    if (!question) return;
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(question.id)) newFlagged.delete(question.id);
    else newFlagged.add(question.id);
    setFlaggedQuestions(newFlagged);
  };

  const handleFinish = () => setShowReview(true);
  const handleReturnToAttempt = () => setShowReview(false);

  const handleReturnToMain = () => {
    router.push("/student/exams");
    clearSession();
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleAttemptTest = async () => {
    await startExam();
    setIsLoading(false);
    setShowInstructions(false);
  };

  const getButtonStyle = (num: number) => {
    const q = examSession?.questions[num - 1];
    if (q && answers[q.id]) return "bg-gray-500 text-white";
    if (currentQuestion === num) return "bg-blue-500 text-white";
    return "bg-gray-100 text-gray-600 hover:bg-gray-200";
  };

  if (showResults) {
    return (
      <TestResults
        totalQuestions={totalQuestions}
        answeredQuestions={
          examResult
            ? examResult.correctAnswers + examResult.wrongAnswers
            : answeredCount
        }
        correctAnswers={examResult?.correctAnswers ?? 0}
        incorrectAnswers={examResult?.wrongAnswers ?? 0}
        unattempted={examResult?.unanswered ?? totalQuestions - answeredCount}
        score={examResult?.scorePercentage ?? 0}
        timeUsed={
          examResult?.timeSpentSeconds != null
            ? formatTimeUsed(examResult.timeSpentSeconds)
            : undefined
        }
        onReturnToMain={handleReturnToMain}
      />
    );
  }

  const sharedSidebar = (onPillClick: (num: number) => void) => (
    <div className="hidden lg:block">
      <div
        style={{
          boxShadow:
            "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
        }}
        className="bg-white rounded-[1.5rem] p-[2rem_1rem]"
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900">Test Navigation</h3>
          <button
            onClick={() => setIsNavigationMinimized((prev) => !prev)}
            className="text-gray-400 hover:text-gray-600"
          >
            <Icon
              icon="hugeicons:arrow-down-01"
              className={cn(
                "w-5 h-5 transition-transform",
                isNavigationMinimized && "rotate-180",
              )}
            />
          </button>
        </div>

        {!isNavigationMinimized && (
          <>
            <hr className="mt-4 text-[#DCDFE4]" />

            <div className="my-8">
              <div className="flex w-fit mx-auto flex-col items-center border p-[1rem_2rem] bg-[#F3F3F3] rounded-[1rem] text-[#E32E89] border-[#E32E89] gap-2">
                <span className="text-[1.5rem] tracking-[-.48px] leading-8 font-[600]">
                  Time Left
                </span>
                <span className="text-[2.25rem] tracking-[-.72px] leading-11 font-[500]">
                  {timeLeft !== null ? formatTime(timeLeft) : "--:--:--"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-8 gap-2 mb-6">
              {Array.from({ length: totalQuestions }, (_, i) => i + 1).map(
                (num) => (
                  <div key={num} className="relative">
                    <button
                      onClick={() => onPillClick(num)}
                      className={cn(
                        "w-8 h-8 rounded-lg text-sm font-medium transition-colors border",
                        getButtonStyle(num),
                        flaggedQuestions.has(getQuestion(num - 1)?.id ?? "") &&
                          "border-b-4 border-red-500",
                      )}
                    >
                      {num}
                    </button>
                  </div>
                ),
              )}
            </div>

            {showReview ? (
              <button
                onClick={handleFinalSubmit}
                disabled={isSubmittingExam}
                className="text-blue-500 text-sm font-medium hover:underline disabled:opacity-50"
              >
                Submit all and finish...
              </button>
            ) : (
              <button
                onClick={handleFinish}
                className="text-blue-500 text-sm font-medium hover:underline"
              >
                Finish attempt and Review...
              </button>
            )}
          </>
        )}
      </div>

      <Calculator />
    </div>
  );

  return (
    <>
      {showInstructions && (
        <TestInstructions
          examType={examTypeName}
          subjects={subjectNames}
          duration={formatDuration(timeLimitSeconds)}
          questionCount={totalQuestions}
          userName={userName}
          onGoBack={() => router.back()}
          onAttemptTest={handleAttemptTest}
          isAttempting={isStartingExam}
        />
      )}
      {isLoading || isPageLoading ? (
        <MockSkeleton />
      ) : showReview ? (
        /* ── Review / Summary screen ── */
        <section className="bg-white p-4 md:p-6 select-none">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — summary area */}
              <div className="lg:col-span-2 space-y-12 pb-8">
                <div
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
                  }}
                  className="bg-white rounded-[1.5rem]"
                >
                  {/* Header */}
                  <div className="p-6 flex flex-col gap-2 text-[#2B2B2B] border-b border-[#EDEDED]">
                    <span className="tracking-[-.4px] leading-7 font-[600] text-[1.25rem]">
                      Exam Type: {examTypeName}
                    </span>
                    <span className="tracking-[-.4px] leading-7 font-[500] text-[1.125rem]">
                      Subjects: {subjectNames.join(", ")}
                    </span>
                    <span className="tracking-[-.4px] leading-7 text-[#E32E89] font-[500] text-[1.125rem]">
                      Summary of Attempts
                    </span>
                  </div>

                  {/* Question status table */}
                  <div className="max-h-130 overflow-y-auto">
                    <table className="w-full">
                      <thead className="sticky top-0 bg-white">
                        <tr className="border-b border-[#EDEDED]">
                          <th className="text-left w-22 p-[1rem_1.5rem] text-[#2B2B2B] text-[.875rem] leading-5 font-[500]">
                            No.
                          </th>
                          <th className="text-left p-[1rem_1.5rem] text-[#2B2B2B] text-[.875rem] leading-5 font-[500]">
                            Question
                          </th>
                          <th className="text-left p-[1rem_1.5rem] text-[#2B2B2B] text-[.875rem] leading-5 font-[500]">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from(
                          { length: totalQuestions },
                          (_, i) => i + 1,
                        ).map((num) => {
                          const q = getQuestion(num - 1);
                          const isAnswered = q ? !!answers[q.id] : false;
                          const isFlagged = flaggedQuestions.has(q?.id ?? "");
                          return (
                            <tr
                              key={num}
                              className={cn(
                                "border-b border-[#EDEDED] border-0",
                                num % 2 === 0 ? "bg-[#FAFAFA]" : "bg-white",
                              )}
                            >
                              <td className="py-3 text-[.875rem] leading-5 font-[600] text-[#007FFF] h-20 w-22 p-[1.75rem_1.5rem]">
                                {num}
                              </td>
                              <td className="text-[.875rem] leading-4 p-[1.75rem_1.5rem] font-[400] text-[#2B2B2B]">
                                Question {num}
                                {isFlagged && (
                                  <span className="ml-2 inline-flex items-center gap-1 text-xs text-pink-500">
                                    <Icon
                                      icon="hugeicons:flag-02"
                                      className="w-3 h-3"
                                    />
                                    Flagged
                                  </span>
                                )}
                              </td>
                              <td className="p-[1.75rem_1.5rem] text-[.875rem] font-[400]">
                                {isAnswered ? (
                                  <span className="inline-flex items-center gap-1.5 text-[#0F973D] leading-4">
                                    <span className="w-2 h-2 rounded-full bg-[#0F973D]" />
                                    Answer Saved
                                  </span>
                                ) : (
                                  <span className="inline-flex items-center gap-1.5 text-[#D42620] leading-4">
                                    <span className="w-2 h-2 rounded-full bg-[#D42620]" />
                                    Not Answered
                                  </span>
                                )}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Action buttons */}
                  <div className="p-6 flex gap-4 border-t border-[#EDEDED]">
                    <Button variant="outlined" onClick={handleReturnToAttempt}>
                      Return to Attempt
                    </Button>
                    <Button
                      onClick={handleFinalSubmit}
                      loading={isSubmittingExam}
                    >
                      Submit all and finish
                    </Button>
                  </div>
                </div>

                <Disclaimer />
              </div>

              {/* Right — sidebar (pills navigate back to exam) */}
              {sharedSidebar((num) => {
                setCurrentQuestion(num);
                setShowReview(false);
              })}
            </div>

            {/* Mobile nav toggle */}
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
            >
              <Icon icon="hugeicons:menu-02" className="w-6 h-6" />
            </button>
          </div>
        </section>
      ) : (
        /* ── Exam questions screen ── */
        <section className="bg-white p-4 md:p-6 select-none">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left — question area */}
              <div className="lg:col-span-2 space-y-12 pb-8">
                <div
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
                  }}
                  className="p-6 bg-white rounded-[1.5rem] space-y-6"
                >
                  <ExamHeader examType={examTypeName} subjects={subjectNames} />

                  {question && (
                    <div
                      style={{
                        boxShadow:
                          "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
                      }}
                      className="bg-white rounded-[1rem] p-[1.25rem_1.375rem_2rem_1.375rem]"
                    >
                      <div className="flex items-center justify-between pb-5 border-b border-[#EDEDED]">
                        <h3 className="font-semibold text-gray-900">
                          Question {currentQuestion}
                        </h3>
                        <button
                          onClick={handleToggleFlag}
                          className={cn(
                            "p-2.5 flex items-center justify-center rounded-[1.25rem] transition-colors",
                            question && flaggedQuestions.has(question.id)
                              ? "bg-pink-100 text-pink-500 hover:bg-pink-200"
                              : "bg-gray-100 text-[#454545] hover:bg-gray-200",
                          )}
                        >
                          <Icon icon="hugeicons:flag-02" className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="pt-5">
                        {passage && (
                          <div className="mb-5 bg-[#F8F9FA] border border-[#E5E7EB] rounded-xl p-4">
                            <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">
                              Read the passage below
                            </p>
                            {passage.title && (
                              <h4 className="font-semibold text-gray-800 mb-2 text-sm">
                                {passage.title}
                              </h4>
                            )}
                            <div className="text-sm text-gray-700 leading-relaxed max-h-56 overflow-y-auto pr-1">
                              <RichText content={passage.content} />
                            </div>
                          </div>
                        )}
                        <div className="text-gray-700 mb-6 text-[.9375rem] leading-relaxed">
                          <RichText content={question.questionText} />
                        </div>
                        {/* ── Essay ── */}
                        {isEssay ? (
                          <InputField
                            type="rich-text"
                            name={`essay-${question.id}`}
                            value={(answers[question.id] as string) ?? ""}
                            onChange={(e: { target: { name?: string; value: any } }) =>
                              setAnswers({
                                ...answers,
                                [question.id]: e.target.value,
                              })
                            }
                          />
                        ) : isTextInput ? (
                          /* ── Fill in the blank / Short answer ── */
                          <input
                            type="text"
                            value={(answers[question.id] as string) ?? ""}
                            onChange={(e) =>
                              setAnswers({
                                ...answers,
                                [question.id]: e.target.value,
                              })
                            }
                            placeholder="Type your answer here…"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm outline-none focus:border-blue-400 transition-colors"
                          />
                        ) : isMultipleResponse ? (
                          /* ── Multiple response (select all that apply) ── */
                          <div className="space-y-3">
                            <p className="text-xs text-gray-500">
                              Select all that apply.
                            </p>
                            {question.options.map((option) => {
                              const selectedArr =
                                (answers[question.id] as string[]) ?? [];
                              const isChecked = selectedArr.includes(option.id);
                              return (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "rounded-lg transition-colors [&>label]:w-full [&>label]:p-3 cursor-pointer",
                                    isChecked
                                      ? "bg-blue-50"
                                      : "hover:bg-gray-50",
                                  )}
                                >
                                  <CheckBox
                                    value={isChecked}
                                    onChange={() =>
                                      handleSelectOption(option.id)
                                    }
                                    customLabel={
                                      <span className="text-sm text-gray-600 ml-2">
                                        <RichText
                                          content={option.text}
                                          variant="inline"
                                        />
                                      </span>
                                    }
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : isMatching ? (
                          /* ── Matching ── */
                          <div className="space-y-4">
                            <p className="text-xs text-gray-500">
                              Type the matching item for each entry.
                            </p>
                            {question.options.map((option) => {
                              const answerMap =
                                (answers[question.id] as Record<
                                  string,
                                  string
                                >) ?? {};
                              return (
                                <div
                                  key={option.id}
                                  className="flex items-center gap-3"
                                >
                                  <span className="flex-1 text-sm text-gray-700 font-medium">
                                    <RichText
                                      content={option.text}
                                      variant="inline"
                                    />
                                  </span>
                                  <Icon
                                    icon="hugeicons:arrow-right-01"
                                    className="w-4 h-4 text-gray-400 flex-shrink-0"
                                  />
                                  <input
                                    type="text"
                                    value={answerMap[option.id] ?? ""}
                                    onChange={(e) =>
                                      setAnswers({
                                        ...answers,
                                        [question.id]: {
                                          ...((answers[question.id] as Record<
                                            string,
                                            string
                                          >) ?? {}),
                                          [option.id]: e.target.value,
                                        },
                                      })
                                    }
                                    placeholder="Type match…"
                                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-blue-400 transition-colors"
                                  />
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* ── Multiple choice / True-False ── */
                          <div className="space-y-3">
                            {question.options.map((option) => (
                              <label
                                key={option.id}
                                onClick={() => handleSelectOption(option.id)}
                                className={cn(
                                  "flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors cursor-pointer",
                                  answers[question.id] === option.id
                                    ? "bg-blue-50"
                                    : "hover:bg-gray-50",
                                )}
                              >
                                <Radio
                                  name={`question-${currentQuestion}`}
                                  value={answers[question.id] === option.id}
                                  onChange={() => handleSelectOption(option.id)}
                                />
                                <span className="text-sm text-gray-600">
                                  <RichText
                                    content={option.text}
                                    variant="inline"
                                  />
                                </span>
                              </label>
                            ))}
                          </div>
                        )}

                        <div className="flex justify-between mt-6">
                          <Button
                            variant="outlined"
                            onClick={handlePrevious}
                            disabled={currentQuestion === 1}
                          >
                            Previous
                          </Button>
                          <Button onClick={handleNext}>
                            {currentQuestion === totalQuestions
                              ? "Finish"
                              : "Next"}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <Disclaimer />
              </div>

              {/* Right — sidebar */}
              {sharedSidebar((num) => {
                setCurrentQuestion(num);
                prefetchAround(num - 1);
              })}
            </div>

            {/* Mobile nav toggle */}
            <button
              onClick={() => setShowNavigation(!showNavigation)}
              className="fixed bottom-6 right-6 lg:hidden w-14 h-14 bg-blue-500 text-white rounded-full shadow-lg flex items-center justify-center"
            >
              <Icon icon="hugeicons:menu-02" className="w-6 h-6" />
            </button>

            {showNavigation && (
              <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex items-end justify-center">
                <div className="bg-white rounded-t-2xl w-full max-w-md p-4 pb-8">
                  <div className="bg-white rounded-xl border border-gray-100 p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">
                        Test Navigation
                      </h3>
                      <button
                        onClick={() =>
                          setIsNavigationMinimized((prev) => !prev)
                        }
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <Icon
                          icon="hugeicons:arrow-down-01"
                          className={cn(
                            "w-5 h-5 transition-transform",
                            isNavigationMinimized && "rotate-180",
                          )}
                        />
                      </button>
                    </div>
                    {!isNavigationMinimized && (
                      <>
                        <hr className="mb-4" />
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-gray-600">
                              Time Left
                            </span>
                            <span className="text-lg font-bold text-[#E32E89]">
                              {timeLeft !== null
                                ? formatTime(timeLeft)
                                : "--:--:--"}
                            </span>
                          </div>
                        </div>
                        <div className="grid grid-cols-8 gap-2 mb-6">
                          {Array.from(
                            { length: totalQuestions },
                            (_, i) => i + 1,
                          ).map((num) => (
                            <div key={num} className="relative">
                              <button
                                onClick={() => {
                                  setCurrentQuestion(num);
                                  prefetchAround(num - 1);
                                  setShowNavigation(false);
                                }}
                                className={cn(
                                  "w-8 h-8 rounded-lg text-sm font-medium transition-colors border",
                                  getButtonStyle(num),
                                  flaggedQuestions.has(
                                    getQuestion(num - 1)?.id ?? "",
                                  ) && "border-b-4 border-red-500",
                                )}
                              >
                                {num}
                              </button>
                            </div>
                          ))}
                        </div>
                        <button
                          onClick={handleFinish}
                          className="text-blue-500 text-sm font-medium hover:underline"
                        >
                          Finish attempt and Review...
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* ── Leave Exam Modal ── */}
      {showLeaveModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">
              Leave Exam?
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              Your progress will be lost if you leave now. Submit first to save
              your results.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="outlined" onClick={dismissLeaveModal}>
                Stay in Exam
              </Button>
              <Button
                onClick={() => {
                  dismissLeaveModal();
                  handleReturnToMain();
                }}
              >
                Leave Without Submitting
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
