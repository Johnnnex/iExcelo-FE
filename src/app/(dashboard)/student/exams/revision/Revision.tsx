"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
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
import { useExamStore, useAuthStore, useStudentStore } from "@/store";
import type { IQuestionResponse, IFlagUpdate } from "@/types";

interface QuestionResult {
  answered: boolean;
  correct?: boolean;
}

function RevisionSkeleton() {
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

function RevisionTestContent() {
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
    getQuestion,
    getPassage,
    prefetchAround,
    loadingPages,
  } = useExamStore();
  const { fetchDashboard, granularity } = useStudentStore();

  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<
    Record<string, string | string[] | Record<string, string>>
  >({});
  const [submittedQuestions, setSubmittedQuestions] = useState<Set<number>>(
    new Set(),
  );
  const [questionResults, setQuestionResults] = useState<
    Record<number, QuestionResult>
  >({});
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(
    new Set(),
  );
  const [isNavigationMinimized, setIsNavigationMinimized] = useState(false);
  const [showNavigation, setShowNavigation] = useState(true);
  const [showResults, setShowResults] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isExamSubmitted, setIsExamSubmitted] = useState(false);
  const [showFullDetails, setShowFullDetails] = useState(false);
  const [fullDetailsTopic, setFullDetailsTopic] = useState("");
  const [fullDetailsTopicId, setFullDetailsTopicId] = useState<string | null>(
    null,
  );
  const [fullDetailsContent, setFullDetailsContent] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  useExamProtection(!isExamSubmitted);
  // Guard: show our own modal instead of browser dialog when back button is pressed
  const { showLeaveModal, dismissLeaveModal } =
    useExamLeaveGuard(!isExamSubmitted);

  // Seed flaggedQuestions from previously flagged IDs when session loads
  useEffect(() => {
    if (examSession?.flaggedQuestionIds?.length) {
      setFlaggedQuestions(new Set(examSession.flaggedQuestionIds));
    }
  }, [examSession?.examAttemptId, examSession?.flaggedQuestionIds]);

  // Redirect after render if no active session — avoids setState-during-render warning
  useEffect(() => {
    if (!pendingConfig && !examSession) {
      router.replace("/student/exams");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [!!pendingConfig, !!examSession]);

  if (!pendingConfig && !examSession) {
    return <RevisionSkeleton />;
  }

  const totalQuestions =
    examSession?.totalCount ?? pendingConfig?.questionCount ?? 0;
  const examTypeName =
    examSession?.examTypeName ?? pendingConfig?.examTypeName ?? "";
  const subjectNames =
    examSession?.subjectNames ?? pendingConfig?.subjectNames ?? [];
  const userName = user?.firstName ?? "Student";

  // Question access goes through the page cache so large exams work correctly.
  const questionIndex = currentQuestion - 1; // 0-based
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

  // Frozen = whole exam submitted OR this question individually confirmed
  const isCurrentFrozen =
    isExamSubmitted || submittedQuestions.has(currentQuestion);

  const correctCount = Object.values(questionResults).filter(
    (r) => r.correct,
  ).length;
  const incorrectCount = Object.values(questionResults).filter(
    (r) => r.answered && !r.correct,
  ).length;
  const answeredCount = Object.keys(questionResults).length;
  const score =
    totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;

  const handleSelectOption = (optionId: string) => {
    if (!question || isCurrentFrozen) return;
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

  const handleSubmitAnswer = () => {
    if (!question) return;
    const answer = answers[question.id];
    const correctAnswer = question.correctAnswer;
    let isCorrect: boolean;

    if (isEssay) {
      isCorrect = false; // essays not auto-graded on client
    } else if (isTextInput) {
      const studentAnswer =
        typeof answer === "string" ? answer.trim().toLowerCase() : "";
      const accepted = String(correctAnswer ?? "")
        .split(/[,/]/)
        .map((a) => a.trim().toLowerCase())
        .filter(Boolean);
      isCorrect = accepted.length > 0 && accepted.includes(studentAnswer);
    } else if (isMultipleResponse) {
      const selected = Array.isArray(answer) ? [...answer].sort() : [];
      const correct = Array.isArray(correctAnswer)
        ? [...(correctAnswer as string[])].sort()
        : [];
      isCorrect =
        selected.length === correct.length &&
        selected.every((v, i) => v === correct[i]);
    } else if (isMatching) {
      const answerMap = (answer as Record<string, string>) ?? {};
      const correctMap = (correctAnswer as Record<string, string>) ?? {};
      isCorrect = Object.entries(correctMap).every(
        ([k, v]) =>
          answerMap[k]?.trim().toLowerCase() === v.trim().toLowerCase(),
      );
    } else {
      // MULTIPLE_CHOICE / TRUE_FALSE
      isCorrect = correctAnswer !== undefined && answer === correctAnswer;
    }

    setSubmittedQuestions(new Set([...submittedQuestions, currentQuestion]));
    setQuestionResults({
      ...questionResults,
      [currentQuestion]: { answered: true, correct: isCorrect },
    });
  };

  const handleNextQuestion = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handleToggleFlag = () => {
    if (isExamSubmitted || !question) return;
    const newFlagged = new Set(flaggedQuestions);
    if (newFlagged.has(question.id)) {
      newFlagged.delete(question.id);
    } else {
      newFlagged.add(question.id);
    }
    setFlaggedQuestions(newFlagged);
  };

  const handleEndReview = async () => {
    const elapsed = examSession
      ? Math.floor(
          (Date.now() - new Date(examSession.startedAt).getTime()) / 1000,
        )
      : 0;
    // Build responses from the answers dict — works regardless of pagination
    // since answers are keyed by questionId, not page position.
    const responses: IQuestionResponse[] = Object.entries(answers)
      .filter(([, a]) => {
        if (Array.isArray(a)) return a.length > 0;
        if (typeof a === "string") return a.trim() !== "";
        return a !== null && a !== undefined;
      })
      .map(([questionId, answer]) => ({
        questionId,
        answer,
        timeSpent: 0,
        isFlagged: flaggedQuestions.has(questionId),
      }));
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
    setIsExamSubmitted(true);
    setShowResults(true);
  };

  const handleConfirmSubmit = () => {
    setShowConfirmModal(false);
    handleEndReview();
  };

  const handleReviewTest = () => {
    setShowResults(false);
    setCurrentQuestion(1);
  };

  const handleReturnToMain = () => {
    fetchDashboard(granularity);
    router.push("/student/exams");
    clearSession();
  };

  const getOptionState = (optionId: string) => {
    if (!question) return "default";
    const wasSubmitted = submittedQuestions.has(currentQuestion);
    // During exam: only reveal state after per-question submission
    if (!isExamSubmitted && !wasSubmitted) return "default";
    const correctAnswer = question.correctAnswer;
    const correctSet = Array.isArray(correctAnswer)
      ? correctAnswer
      : correctAnswer != null
        ? [correctAnswer as string]
        : [];
    if (correctSet.includes(optionId)) return "correct";
    // For unanswered questions in review, only highlight correct — no red
    if (wasSubmitted) {
      const userAnswer = answers[question.id];
      const selectedSet = Array.isArray(userAnswer)
        ? userAnswer
        : userAnswer != null
          ? [userAnswer as string]
          : [];
      if (selectedSet.includes(optionId)) return "incorrect";
    }
    return "default";
  };

  const getCorrectAnswerDisplay = (q: typeof question): string => {
    if (!q?.correctAnswer) return "";
    const ca = q.correctAnswer;
    if (typeof ca === "string") {
      if (q.options && q.options.length > 0) return `Option ${ca}`;
      return ca;
    }
    if (Array.isArray(ca)) return `Options ${ca.join(", ")}`;
    if (typeof ca === "object")
      return Object.entries(ca)
        .map(([k, v]) => `${k} → ${v}`)
        .join("; ");
    return String(ca);
  };

  const getCorrectAnswerLetter = (q: typeof question): string => {
    if (!q?.correctAnswer || !q.options?.length) return "";
    const idx = q.options.findIndex((o) => o.id === q.correctAnswer);
    if (idx === -1) return String(q.correctAnswer);
    return String.fromCharCode(65 + idx);
  };

  const handleShowFullDetails = () => {
    if (!question) return;
    setFullDetailsTopic(question.topicName ?? "");
    setFullDetailsTopicId(question.topicId ?? null);
    setFullDetailsContent(
      question.explanationLong ?? question.explanationShort ?? "",
    );
    setShowFullDetails(true);
  };

  const handleAttemptTest = async () => {
    await startExam();
    setIsLoading(false);
    setShowInstructions(false);
  };

  const getButtonStyle = (num: number) => {
    if (questionResults[num]?.answered) {
      return questionResults[num].correct
        ? "bg-green-100 text-green-700"
        : "bg-red-100 text-red-700";
    }
    // In review mode, questions never individually submitted = unanswered
    if (isExamSubmitted && !questionResults[num]?.answered) {
      return "bg-amber-50 text-amber-600 border-amber-300";
    }
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
        correctAnswers={examResult?.correctAnswers ?? correctCount}
        incorrectAnswers={examResult?.wrongAnswers ?? incorrectCount}
        unattempted={examResult?.unanswered ?? totalQuestions - answeredCount}
        score={
          examResult?.scorePercentage ?? (correctCount / totalQuestions) * 100
        }
        onReviewTest={handleReviewTest}
        onReturnToMain={handleReturnToMain}
      />
    );
  }

  return (
    <>
      {showInstructions && (
        <TestInstructions
          examType={examTypeName}
          subjects={subjectNames}
          duration="N/A"
          questionCount={totalQuestions}
          userName={userName}
          onGoBack={() => router.back()}
          onAttemptTest={handleAttemptTest}
          isAttempting={isStartingExam}
        />
      )}
      {isLoading || isPageLoading ? (
        <RevisionSkeleton />
      ) : (
        <section className="bg-white p-4 md:p-6 select-none">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
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
                          disabled={isExamSubmitted}
                          className={cn(
                            "p-2.5 flex items-center justify-center rounded-[1.25rem] transition-colors",
                            question && flaggedQuestions.has(question.id)
                              ? "bg-pink-100 text-pink-500 hover:bg-pink-200"
                              : "bg-gray-100 text-[#454545] hover:bg-gray-200",
                            isExamSubmitted && "opacity-40 cursor-not-allowed",
                          )}
                        >
                          <Icon icon="hugeicons:flag-02" className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="pt-5.5">
                        {/* Unanswered badge — shown during review for skipped questions */}
                        {isExamSubmitted &&
                          !submittedQuestions.has(currentQuestion) && (
                            <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium mb-4">
                              <Icon
                                icon="hugeicons:alert-02"
                                className="w-4 h-4"
                              />
                              Unanswered
                            </div>
                          )}
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
                            readOnly={isCurrentFrozen}
                            onChange={(e: { target: { name?: string; value: any } }) =>
                              setAnswers({
                                ...answers,
                                [question.id]: e.target.value,
                              })
                            }
                          />
                        ) : isTextInput ? (
                          /* ── Fill in the blank / Short answer ── */
                          <div>
                            <input
                              type="text"
                              value={(answers[question.id] as string) ?? ""}
                              onChange={(e) =>
                                !isCurrentFrozen &&
                                setAnswers({
                                  ...answers,
                                  [question.id]: e.target.value,
                                })
                              }
                              disabled={isCurrentFrozen}
                              placeholder="Type your answer here…"
                              className={cn(
                                "w-full border rounded-lg px-4 py-3 text-sm outline-none transition-colors",
                                isCurrentFrozen
                                  ? questionResults[currentQuestion]?.correct
                                    ? "border-green-400 bg-green-50 text-green-700 cursor-not-allowed"
                                    : submittedQuestions.has(currentQuestion)
                                      ? "border-red-400 bg-red-50 text-red-600 cursor-not-allowed"
                                      : "border-gray-200 bg-gray-50 cursor-not-allowed"
                                  : "border-gray-300 focus:border-blue-400",
                              )}
                            />
                            {(submittedQuestions.has(currentQuestion) &&
                              !questionResults[currentQuestion]?.correct) ||
                            (isExamSubmitted &&
                              !submittedQuestions.has(currentQuestion))
                              ? question.correctAnswer && (
                                  <p className="mt-2 text-sm font-medium text-green-700">
                                    Correct answer:{" "}
                                    <span className="font-bold">
                                      {String(question.correctAnswer)}
                                    </span>
                                  </p>
                                )
                              : null}
                          </div>
                        ) : isMultipleResponse ? (
                          /* ── Multiple response (select all that apply) ── */
                          <div className="space-y-3">
                            <p className="text-xs text-gray-500">
                              Select all that apply.
                            </p>
                            {question.options.map((option, optionIndex) => {
                              const selectedArr =
                                (answers[question.id] as string[]) ?? [];
                              const isChecked = selectedArr.includes(option.id);
                              const isSubmitted =
                                submittedQuestions.has(currentQuestion);
                              // Reveal answers: when individually submitted OR in review mode
                              const showRevealed =
                                isSubmitted || isExamSubmitted;
                              const correctSet = Array.isArray(
                                question.correctAnswer,
                              )
                                ? (question.correctAnswer as string[])
                                : [];
                              const isCorrectOption = correctSet.includes(
                                option.id,
                              );
                              const letter = String.fromCharCode(
                                65 + optionIndex,
                              );
                              return (
                                <div
                                  key={option.id}
                                  className={cn(
                                    "rounded-lg transition-colors [&>label]:w-full [&>label]:p-3",
                                    showRevealed && isCorrectOption
                                      ? "bg-green-50"
                                      : isSubmitted && isChecked
                                        ? "bg-red-50"
                                        : isChecked
                                          ? "bg-blue-50"
                                          : "hover:bg-gray-50",
                                    isCurrentFrozen
                                      ? "pointer-events-none opacity-60"
                                      : "cursor-pointer",
                                  )}
                                >
                                  <CheckBox
                                    value={isChecked}
                                    onChange={() =>
                                      !isCurrentFrozen &&
                                      handleSelectOption(option.id)
                                    }
                                    customLabel={
                                      <div className="flex items-center gap-3 flex-1 ml-2">
                                        <span
                                          className={cn(
                                            "text-xs font-bold w-5 shrink-0",
                                            showRevealed && isCorrectOption
                                              ? "text-green-600"
                                              : isSubmitted && isChecked
                                                ? "text-red-500"
                                                : "text-gray-400",
                                          )}
                                        >
                                          {letter}
                                        </span>
                                        <span
                                          className={cn(
                                            "text-sm flex-1",
                                            showRevealed && isCorrectOption
                                              ? "text-green-600"
                                              : isSubmitted && isChecked
                                                ? "text-red-500"
                                                : "text-gray-600",
                                          )}
                                        >
                                          <RichText
                                            content={option.text}
                                            variant="inline"
                                          />
                                        </span>
                                        {showRevealed && isCorrectOption && (
                                          <Icon
                                            icon="hugeicons:tick-01"
                                            className="w-5 h-5 text-green-800"
                                          />
                                        )}
                                        {isSubmitted &&
                                          !isCorrectOption &&
                                          isChecked && (
                                            <Icon
                                              icon="hugeicons:cancel-circle"
                                              className="w-5 h-5 text-red-500"
                                            />
                                          )}
                                      </div>
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
                              const userMatch = answerMap[option.id] ?? "";
                              const isMatchSubmitted =
                                submittedQuestions.has(currentQuestion);
                              const showMatchRevealed =
                                isMatchSubmitted || isExamSubmitted;
                              const correctMap =
                                (question.correctAnswer as Record<
                                  string,
                                  string
                                >) ?? {};
                              const correctMatch = correctMap[option.id] ?? "";
                              const isOptionCorrect =
                                isMatchSubmitted &&
                                userMatch.trim().toLowerCase() ===
                                  correctMatch.trim().toLowerCase();
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
                                    value={userMatch}
                                    disabled={isCurrentFrozen}
                                    onChange={(e) => {
                                      if (isCurrentFrozen) return;
                                      setAnswers({
                                        ...answers,
                                        [question.id]: {
                                          ...((answers[question.id] as Record<
                                            string,
                                            string
                                          >) ?? {}),
                                          [option.id]: e.target.value,
                                        },
                                      });
                                    }}
                                    placeholder="Type match…"
                                    className={cn(
                                      "flex-1 border rounded-lg px-3 py-2 text-sm outline-none transition-colors",
                                      showMatchRevealed
                                        ? isOptionCorrect
                                          ? "border-green-400 bg-green-50 text-green-700 cursor-not-allowed"
                                          : "border-red-400 bg-red-50 text-red-600 cursor-not-allowed"
                                        : "border-gray-300 focus:border-blue-400",
                                    )}
                                  />
                                  {showMatchRevealed && !isOptionCorrect && (
                                    <span className="text-xs font-semibold text-green-700 flex-shrink-0">
                                      → {correctMatch}
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          /* ── Multiple choice / True-False ── */
                          <div className="space-y-3">
                            {question.options.map((option, optionIndex) => {
                              const state = getOptionState(option.id);
                              const isSelected =
                                answers[question.id] === option.id;
                              const letter = String.fromCharCode(
                                65 + optionIndex,
                              );
                              return (
                                <label
                                  key={option.id}
                                  onClick={() =>
                                    !isCurrentFrozen &&
                                    handleSelectOption(option.id)
                                  }
                                  className={cn(
                                    "flex items-center gap-3 w-full text-left p-3 rounded-lg transition-colors",
                                    state === "correct" && "bg-green-50",
                                    state === "incorrect" && "bg-red-50",
                                    state === "default" &&
                                      isSelected &&
                                      "bg-blue-50",
                                    state === "default" &&
                                      !isSelected &&
                                      "hover:bg-gray-50",
                                    isCurrentFrozen
                                      ? "cursor-not-allowed opacity-60"
                                      : "cursor-pointer",
                                  )}
                                >
                                  <Radio
                                    name={`question-${currentQuestion}`}
                                    value={isSelected}
                                    state={
                                      state !== "default" ? state : undefined
                                    }
                                    onChange={() =>
                                      !isCurrentFrozen &&
                                      handleSelectOption(option.id)
                                    }
                                  />
                                  <span
                                    className={cn(
                                      "text-xs font-bold w-5 shrink-0",
                                      state === "correct" && "text-green-600",
                                      state === "incorrect" && "text-red-500",
                                      state === "default" && "text-gray-400",
                                    )}
                                  >
                                    {letter}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-sm",
                                      state === "correct" && "text-green-600",
                                      state === "incorrect" && "text-red-500",
                                      state === "default" && "text-gray-600",
                                    )}
                                  >
                                    <RichText
                                      content={option.text}
                                      variant="inline"
                                    />
                                  </span>
                                  {state === "correct" && (
                                    <Icon
                                      icon="hugeicons:tick-01"
                                      className="w-5 h-5 text-green-800 ml-auto"
                                    />
                                  )}
                                  {state === "incorrect" && (
                                    <Icon
                                      icon="hugeicons:cancel-circle"
                                      className="w-5 h-5 text-red-500 ml-auto"
                                    />
                                  )}
                                </label>
                              );
                            })}
                          </div>
                        )}

                        <div className="flex justify-end mt-6">
                          {isExamSubmitted ? (
                            /* Post-submission review mode */
                            currentQuestion === totalQuestions ? (
                              <Button onClick={handleReturnToMain}>
                                Return to Main Window
                              </Button>
                            ) : (
                              <Button onClick={handleNextQuestion}>
                                Next Question
                              </Button>
                            )
                          ) : !submittedQuestions.has(currentQuestion) ? (
                            <Button
                              onClick={handleSubmitAnswer}
                              disabled={(() => {
                                const a = answers[question.id];
                                if (a == null) return true;
                                if (Array.isArray(a)) return a.length === 0;
                                if (typeof a === "string")
                                  return a.trim() === "";
                                if (typeof a === "object")
                                  return !Object.values(
                                    a as Record<string, string>,
                                  ).some((v) => v?.trim() !== "");
                                return false;
                              })()}
                            >
                              Submit Answer
                            </Button>
                          ) : currentQuestion === totalQuestions ? (
                            <Button
                              onClick={() => setShowConfirmModal(true)}
                              loading={isSubmittingExam}
                            >
                              End and Review
                            </Button>
                          ) : (
                            <Button onClick={handleNextQuestion}>
                              Next Question
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {(isExamSubmitted ||
                    submittedQuestions.has(currentQuestion)) &&
                    question &&
                    (question.correctAnswer ||
                      question.topicName ||
                      question.explanationShort) && (
                      <div
                        style={{
                          boxShadow:
                            "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
                        }}
                        className="border-[#258BE4] rounded-xl border p-[1.25rem_1.375rem_2rem_1.25rem] bg-[#DBEDFF] overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row items-start md:justify-between">
                          <h3 className="font-semibold text-gray-900">
                            Explanation
                          </h3>
                          {question.explanationLong && (
                            <button
                              onClick={handleShowFullDetails}
                              className="text-[#E32E89] text-sm font-medium hover:underline flex items-center gap-1 mt-2 md:mt-0"
                            >
                              Detailed Explanation
                              <Icon
                                icon="hugeicons:arrow-right-01"
                                className="w-4 h-4"
                              />
                            </button>
                          )}
                        </div>

                        {question.correctAnswer && (
                          <>
                            <div className="h-[1px] w-full bg-[#EDEDED] my-4" />
                            {question.type === "multiple_choice" ||
                            question.type === "true_false" ? (
                              <p className="font-semibold text-blue-600">
                                Correct answer is{" "}
                                {getCorrectAnswerLetter(question)}
                              </p>
                            ) : (
                              <>
                                <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">
                                  Right Answer
                                </h4>
                                <div className="text-lg font-bold text-blue-600">
                                  <RichText
                                    content={getCorrectAnswerDisplay(question)}
                                    variant="inline"
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}

                        {question.explanationShort && (
                          <>
                            <div className="h-[1px] w-full bg-[#EDEDED] my-4" />
                            <div className="text-gray-600 text-sm leading-relaxed">
                              <RichText content={question.explanationShort} />
                            </div>
                          </>
                        )}
                      </div>
                    )}
                </div>
                <Disclaimer />
              </div>

              {/* Sidebar */}
              <div className="hidden lg:block">
                <div
                  style={{
                    boxShadow:
                      "0 0 0 1px rgba(0, 0, 0, 0.06), 0 5px 22px 0 rgba(0, 0, 0, 0.04)",
                  }}
                  className="bg-white rounded-[1.5rem] p-[2rem_1rem]"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      Test Navigation
                    </h3>
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
                        <div className="flex w-fit mx-auto flex-col items-center border p-[1rem_2rem] bg-[#F3F3F3] rounded-[1rem] text-[#E32E89] border-[#E32E89] gap-2 mb-2">
                          <span className="text-[1.5rem] tracking-[-.48px] leading-8 font-[600]">
                            Score
                          </span>
                          <span className="text-[2.25rem] tracking-[-.72px] leading-11 font-[500]">
                            {isExamSubmitted && examResult
                              ? Math.round(examResult.scorePercentage)
                              : score}
                            %
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
                        onClick={
                          isExamSubmitted
                            ? handleReturnToMain
                            : () => setShowConfirmModal(true)
                        }
                        className="text-blue-500 text-sm font-medium hover:underline"
                      >
                        {isExamSubmitted
                          ? "Return to Main Window"
                          : "Finish and Review…"}
                      </button>
                    </>
                  )}
                </div>
                <Calculator />
              </div>
            </div>

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
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-sm text-gray-600">Score</span>
                          <span className="text-lg font-bold text-blue-600">
                            {isExamSubmitted && examResult
                              ? Math.round(examResult.scorePercentage)
                              : score}
                            %
                          </span>
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
                          onClick={
                            isExamSubmitted
                              ? handleReturnToMain
                              : () => setShowConfirmModal(true)
                          }
                          className="text-blue-500 text-sm font-medium hover:underline"
                        >
                          {isExamSubmitted
                            ? "Return to Main Window"
                            : "Finish and Review…"}
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

      {/* ── Confirm Submit Modal ── */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-lg font-semibold text-gray-900">
                Submit Exam?
              </h2>
              <button
                onClick={() => setShowConfirmModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="hugeicons:cancel-01" className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Once submitted you cannot change your answers. You&apos;ll still
              be able to review the exam in read-only mode.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                onClick={() => setShowConfirmModal(false)}
                variant="outlined"
              >
                Go Back
              </Button>
              <Button loading={isSubmittingExam} onClick={handleConfirmSubmit}>
                Yes, Submit
              </Button>
            </div>
          </div>
        </div>
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

      {/* ── Explanation Modal ── */}
      {showFullDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">
                Explanation
              </h2>
              <button
                onClick={() => setShowFullDetails(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Icon icon="hugeicons:cancel-01" className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 md:p-6">
              {fullDetailsTopic && (
                <div className="mb-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1">
                    Topic
                  </p>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {fullDetailsTopic}
                    </h3>
                    {fullDetailsTopicId && (
                      <Link
                        href={`/student/topics/${fullDetailsTopicId}`}
                        target="_blank"
                        className="text-blue-500 hover:text-blue-700 text-sm font-medium flex items-center gap-1"
                      >
                        View Topic
                        <Icon
                          icon="hugeicons:arrow-right-01"
                          className="w-3.5 h-3.5"
                        />
                      </Link>
                    )}
                  </div>
                </div>
              )}
              <div className="text-gray-700 leading-relaxed">
                <RichText content={fullDetailsContent} />
              </div>
              <div className="flex justify-end mt-6">
                <button
                  onClick={() => setShowFullDetails(false)}
                  className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function Revision() {
  return <RevisionTestContent />;
}
