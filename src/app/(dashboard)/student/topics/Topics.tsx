"use client";

import { ChangeEvent, useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Button, RichText } from "@/components/atoms";
import { InputField } from "@/components/molecules";
import { useStudentStore, useExamStore } from "@/store";
import { cn } from "@/lib/utils";
import Link from "next/link";
import type { ITopic } from "@/types";

function TopicsSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          style={{
            boxShadow:
              "0 0 0 1px rgba(0,0,0,0.06), 0 5px 22px 0 rgba(0,0,0,0.04)",
          }}
          className="bg-white rounded-xl p-4 md:p-5 flex items-center justify-between"
        >
          <div>
            <div className="h-4 bg-gray-200 rounded w-36 mb-1.5" />
            <div className="h-3 bg-gray-100 rounded w-16" />
          </div>
          <div className="h-5 w-5 bg-gray-200 rounded" />
        </div>
      ))}
    </div>
  );
}

export default function Topics() {
  const { dashboardData } = useStudentStore();
  const {
    fetchTopicsByExamType,
    topicsGrouped,
    isLoadingTopics,
    searchTopics,
  } = useExamStore();

  const examTypeId = dashboardData?.currentExamType?.id ?? "";
  const isDemoUser = !dashboardData?.currentExamType?.isPaid;
  const selectedSubjects = dashboardData?.selectedSubjects ?? [];

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ITopic[] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [expandedSubjects, setExpandedSubjects] = useState<Set<string>>(
    new Set(),
  );

  // For demo users, show only their selected subjects. For paid users, we'd
  // load all subjects for the exam type — but since we only have selectedSubjects
  // from dashboard, we use those for both tiers.
  const subjects = isDemoUser ? selectedSubjects : selectedSubjects; // paid: same source; could be expanded later

  useEffect(() => {
    if (!examTypeId) return;
    const subjectIds = subjects.map((s) => s.id);
    fetchTopicsByExamType(
      examTypeId,
      subjectIds.length > 0 ? subjectIds : undefined,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examTypeId, subjects.length]);

  const handleSearch = async () => {
    if (!searchQuery.trim() || !examTypeId) return;
    setIsSearching(true);
    const results = await searchTopics(examTypeId, searchQuery.trim());
    setSearchResults(results);
    setIsSearching(false);
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults(null);
  };

  const toggleSubject = (subjectId: string) => {
    setExpandedSubjects((prev) => {
      const next = new Set(prev);
      if (next.has(subjectId)) {
        next.delete(subjectId);
      } else {
        next.add(subjectId);
      }
      return next;
    });
  };

  const renderTopicCard = (topic: ITopic) => (
    <div
      key={topic.id}
      style={{
        boxShadow: "0 0 0 1px rgba(0,0,0,0.06), 0 5px 22px 0 rgba(0,0,0,0.04)",
      }}
      className="bg-white rounded-xl p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-1">{topic.name}</h4>
          {topic.subjectName && (
            <p className="text-xs text-gray-400 mb-2">{topic.subjectName}</p>
          )}
          {topic.content && (
            <div className="text-sm text-gray-600 line-clamp-3">
              <RichText content={topic.content} variant="inline" />
            </div>
          )}
        </div>
        <Link
          href={`/student/topics/${topic.id}`}
          className="shrink-0 flex items-center gap-1 text-[#007FFF] text-sm font-medium hover:underline"
        >
          Read
          <Icon icon="hugeicons:arrow-right-01" className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );

  return (
    <section className="xl:px-[2rem] px-[.875rem] py-[1.25rem] mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-lg md:text-xl font-bold text-gray-900">Topics</h1>
        <span className="bg-[#F3F3F3] w-fit text-[#A12161] text-xs font-semibold px-3 py-2 rounded-full">
          {dashboardData?.currentExamType?.name ?? ""}
        </span>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 mb-8">
        <InputField
          type="text"
          label={null}
          placeholder="Search topics..."
          value={searchQuery}
          onChange={(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
            setSearchQuery(e.target.value)
          }
          onKeyDown={(e: React.KeyboardEvent) =>
            e.key === "Enter" && handleSearch()
          }
          className="flex-1 h-12 border rounded-full border-[#A6A6A6] text-[#A6A6A6] px-4"
        />
        {searchResults !== null ? (
          <Button variant="outlined" onClick={handleClearSearch}>
            Clear
          </Button>
        ) : (
          <Button onClick={handleSearch} loading={isSearching}>
            <Icon
              icon="hugeicons:search-01"
              className="w-5 h-5 hidden md:block"
            />
            Search
          </Button>
        )}
      </div>

      {/* Search results */}
      {searchResults !== null ? (
        <div>
          <p className="text-sm text-gray-500 mb-4">
            {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}{" "}
            for &quot;{searchQuery}&quot;
          </p>
          {searchResults.length === 0 ? (
            <p className="text-center text-gray-400 py-12">No topics found.</p>
          ) : (
            <div className="space-y-3">
              {searchResults.map(renderTopicCard)}
            </div>
          )}
        </div>
      ) : isLoadingTopics ? (
        <TopicsSkeleton />
      ) : subjects.length === 0 ? (
        <p className="text-center text-gray-400 py-12">
          No subjects selected. Please select your subjects first.
        </p>
      ) : (
        <div className="space-y-3">
          {subjects.map((subject) => {
            const topics = topicsGrouped[subject.id] ?? [];
            const isExpanded = expandedSubjects.has(subject.id);
            return (
              <div
                key={subject.id}
                style={{
                  boxShadow:
                    "0 0 0 1px rgba(0,0,0,0.06), 0 5px 22px 0 rgba(0,0,0,0.04)",
                }}
                className="bg-white rounded-xl overflow-hidden"
              >
                {/* Subject header */}
                <button
                  onClick={() => toggleSubject(subject.id)}
                  className="w-full flex items-center justify-between p-4 md:p-5 text-left"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {subject.name}
                    </h3>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {topics.length} topic{topics.length !== 1 ? "s" : ""}
                    </p>
                  </div>
                  <Icon
                    icon="hugeicons:arrow-down-01"
                    className={cn(
                      "w-5 h-5 text-gray-400 transition-transform",
                      isExpanded && "rotate-180",
                    )}
                  />
                </button>

                {/* Topics list */}
                {isExpanded && (
                  <div className="border-t border-[#EDEDED] px-4 md:px-5 py-4 space-y-3">
                    {topics.length === 0 ? (
                      <p className="text-sm text-gray-400">
                        No topics available for this subject.
                      </p>
                    ) : (
                      topics.map((topic) => (
                        <div
                          key={topic.id}
                          className="flex items-center justify-between gap-3 py-2 border-b border-[#F3F3F3] last:border-0"
                        >
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-800">
                              {topic.name}
                            </p>
                            {topic.content && (
                              <div className="text-xs text-gray-500 line-clamp-1 mt-0.5">
                                <RichText
                                  content={topic.content}
                                  variant="inline"
                                />
                              </div>
                            )}
                          </div>
                          <Link
                            href={`/student/topics/${topic.id}`}
                            className="shrink-0 flex items-center gap-1 text-[#007FFF] text-xs font-semibold hover:underline"
                          >
                            Read
                            <Icon
                              icon="hugeicons:arrow-right-01"
                              className="w-3.5 h-3.5"
                            />
                          </Link>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
